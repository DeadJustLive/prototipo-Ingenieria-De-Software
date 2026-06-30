import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Search, RefreshCw, CheckCircle, XCircle, AlertCircle, FileText, Zap } from 'lucide-react';
import { buscarExpedientePorRun } from '../lib/expedientes';
import { mockTramites } from '../data/mockData';

export function ConsultasExternas() {
  const navigate = useNavigate();

  const [run, setRun] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [expediente, setExpediente] = useState<any>(null);
  const [resultadoPDI, setResultadoPDI] = useState<any>(null);
  const [resultadoSAG, setResultadoSAG] = useState<any>(null);
  const [resultadoAduana, setResultadoAduana] = useState<any>(null);

  const limpiarResultados = () => {
    setResultadoPDI(null);
    setResultadoSAG(null);
    setResultadoAduana(null);
  };

  const handleBuscarExpediente = async () => {
    if (!run.trim()) return;

    setIsSearching(true);
    setHasSearched(false);
    limpiarResultados();

    await new Promise((resolve) => setTimeout(resolve, 800));

    const resultado = buscarExpedientePorRun(run);

    setExpediente(resultado);
    setHasSearched(true);
    setIsSearching(false);
  };

  const handleConsultarExternos = async () => {
    if (!expediente) return;

    setIsSearching(true);
    limpiarResultados();

    await new Promise((resolve) => setTimeout(resolve, 1400));

    const pdi_down = localStorage.getItem('sys_config_pdi_down') === 'true';
    const sag_down = localStorage.getItem('sys_config_sag_down') === 'true';
    const aduana_down = localStorage.getItem('sys_config_aduana_down') === 'true';

    // PDI
    if (expediente.simularCaida || pdi_down) {
      setResultadoPDI({ estado: 'error', mensaje: 'Sistema PDI temporalmente no disponible (HTTP 500)' });
    } else {
      setResultadoPDI({ estado: 'activo', antecedentes: false, alertas: 0 });
    }

    // SAG
    if (expediente.simularCaida || sag_down) {
      setResultadoSAG({ estado: 'error', mensaje: 'Sistema SAG temporalmente no disponible (Timeout)' });
    } else if (expediente.estado === 'Observado') {
      setResultadoSAG({ estado: 'activo', restricciones: true, mensaje: 'Declaración SAG requiere revisión por productos regulados' });
    } else {
      setResultadoSAG({ estado: 'activo', restricciones: false, mensaje: 'Sin restricciones sanitarias activas' });
    }

    // ADUANA
    if (expediente.simularCaida || aduana_down) {
      setResultadoAduana({ estado: 'error', mensaje: 'Aduana limítrofe no disponible (Conexión rechazada)' });
    } else if (expediente.estado === 'Observado') {
      setResultadoAduana({ estado: 'activo', tramitesAnteriores: 1, ultimoIngreso: '2025-12-10' });
    } else {
      setResultadoAduana({ estado: 'activo', tramitesAnteriores: 3, ultimoIngreso: '2025-12-20' });
    }

    setIsSearching(false);
  };

  const resultadoGeneral = () => {
    if (!resultadoPDI && !resultadoSAG && !resultadoAduana) return null;

    if (
      resultadoPDI?.estado === 'error' ||
      resultadoSAG?.estado === 'error' ||
      resultadoAduana?.estado === 'error'
    ) {
      return {
        color: 'bg-red-50 border-red-200 text-red-700',
        texto: 'Consulta externa incompleta. Se requiere contingencia o revisión manual.',
      };
    }

    if (resultadoSAG?.restricciones) {
      return {
        color: 'bg-yellow-50 border-yellow-200 text-yellow-700',
        texto: 'Expediente con observación SAG. Requiere revisión antes de evaluar el paso fronterizo.',
      };
    }

    return {
      color: 'bg-green-50 border-green-200 text-green-700',
      texto: 'Expediente sin alertas externas. Apto para evaluación fronteriza.',
    };
  };

  const estadoGeneral = resultadoGeneral();

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl mb-1">Consulta de Sistemas Externos</h1>
          <p className="text-muted-foreground">
            Búsqueda de expediente por RUN e interoperabilidad con PDI, SAG y Aduana Limítrofe.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Buscar expediente fronterizo</CardTitle>
            <CardDescription>
              Ingrese el RUN del pasajero para recuperar la solicitud de viaje registrada en el preingreso online.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="run">RUN del pasajero</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setRun('12.345.678-9')}
                    className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 h-8"
                  >
                    <Zap className="w-3.5 h-3.5 mr-1" />
                    Datos de Prueba
                  </Button>
                </div>
                <Input
                  id="run"
                  placeholder="Ej: 12.345.678-9"
                  value={run}
                  onChange={(e) => setRun(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleBuscarExpediente()}
                />
                <p className="text-xs text-muted-foreground">
                  Pruebas sugeridas: 12.345.678-9 éxito, 18.765.432-1 observado, 11.111.111-1 sistema externo caído.
                </p>
              </div>

              <div className="flex items-end">
                <Button onClick={handleBuscarExpediente} disabled={isSearching || !run.trim()}>
                  {isSearching ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Buscar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {hasSearched && !expediente && (
          <Card>
            <CardContent className="pt-6">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                No existe una solicitud de viaje asociada al RUN ingresado.
              </div>
            </CardContent>
          </Card>
        )}

        {expediente && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Expediente recuperado
                </CardTitle>
                <CardDescription>
                  Información registrada previamente por el pasajero en la solicitud de viaje.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Dato label="Solicitud" value={expediente.id} />
                  <Dato label="Estado" value={expediente.estado} />
                  <Dato label="RUN" value={expediente.run} />
                  <Dato label="Pasajero" value={expediente.nombre} />
                  <Dato label="Nacionalidad" value={expediente.nacionalidad} />
                  <Dato label="Fecha de viaje" value={new Date(expediente.fechaViaje).toLocaleDateString('es-CL')} />
                  <Dato label="Paso fronterizo" value={expediente.pasoFronterizo} />
                  <Dato label="Destino" value={expediente.destino} />
                  <Dato label="Vehículo" value={expediente.vehiculo} />
                </div>

                <div className="mt-6 flex gap-3">
                  <Button onClick={handleConsultarExternos} disabled={isSearching}>
                    {isSearching ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Consultando sistemas...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Consultar PDI / SAG / Aduana
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      const match = mockTramites.find(t => t.pasajero.run === expediente.run);
                      navigate(`/control-fronterizo/${match ? match.id : '1'}`);
                    }}
                  >
                    Continuar a Evaluación Fronteriza
                  </Button>
                </div>
              </CardContent>
            </Card>

            {(resultadoPDI || resultadoSAG || resultadoAduana) && (
              <>
                {estadoGeneral && (
                  <div className={`p-4 border rounded-lg ${estadoGeneral.color}`}>
                    {estadoGeneral.texto}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ResultadoSistema
                    titulo="PDI"
                    resultado={
                      resultadoPDI?.estado === 'error'
                        ? resultadoPDI.mensaje
                        : resultadoPDI
                          ? 'Sin antecedentes ni alertas migratorias'
                          : 'Pendiente'
                    }
                    estado={resultadoPDI?.estado === 'error' ? 'error' : resultadoPDI ? 'ok' : 'pendiente'}
                  />

                  <ResultadoSistema
                    titulo="SAG"
                    resultado={
                      resultadoSAG?.estado === 'error'
                        ? resultadoSAG.mensaje
                        : resultadoSAG?.restricciones
                          ? resultadoSAG.mensaje
                          : resultadoSAG
                            ? 'Sin restricciones sanitarias activas'
                            : 'Pendiente'
                    }
                    estado={
                      resultadoSAG?.estado === 'error'
                        ? 'error'
                        : resultadoSAG?.restricciones
                          ? 'alerta'
                          : resultadoSAG
                            ? 'ok'
                            : 'pendiente'
                    }
                  />

                  <ResultadoSistema
                    titulo="Aduana Limítrofe"
                    resultado={
                      resultadoAduana?.estado === 'error'
                        ? resultadoAduana.mensaje
                        : resultadoAduana
                          ? `Sin observaciones. Trámites anteriores: ${resultadoAduana.tramitesAnteriores}`
                          : 'Pendiente'
                    }
                    estado={resultadoAduana?.estado === 'error' ? 'error' : resultadoAduana ? 'ok' : 'pendiente'}
                  />
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Historial de sincronización</CardTitle>
                    <CardDescription>
                      Registro de consultas realizadas para el expediente {expediente.id}.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {['PDI', 'SAG', 'Aduana Limítrofe'].map((sistema) => (
                        <div key={sistema} className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <div>
                            <p className="font-medium">{sistema}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date().toLocaleString('es-CL')}
                            </p>
                          </div>
                          <span className="text-sm">Consulta registrada</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

function Dato({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-lg">{value}</p>
    </div>
  );
}

function ResultadoSistema({
  titulo,
  resultado,
  estado,
}: {
  titulo: string;
  resultado: string;
  estado: 'ok' | 'alerta' | 'error' | 'pendiente';
}) {
  const config = {
    ok: {
      color: 'bg-green-50 border-green-200 text-green-700',
      icon: <CheckCircle className="w-5 h-5" />,
    },
    alerta: {
      color: 'bg-yellow-50 border-yellow-200 text-yellow-700',
      icon: <AlertCircle className="w-5 h-5" />,
    },
    error: {
      color: 'bg-red-50 border-red-200 text-red-700',
      icon: <XCircle className="w-5 h-5" />,
    },
    pendiente: {
      color: 'bg-gray-50 border-gray-200 text-gray-700',
      icon: <RefreshCw className="w-5 h-5" />,
    },
  }[estado];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{titulo}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`p-4 border rounded-lg flex items-start gap-2 ${config.color}`}>
          {config.icon}
          <p>{resultado}</p>
        </div>
      </CardContent>
    </Card>
  );
}