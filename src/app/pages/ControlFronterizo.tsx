import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, Send, Loader2 } from 'lucide-react';
import { mockTramites, getStatusColor, getStatusLabel } from '../data/mockData';
import { toast } from 'sonner';

type Accion = 'validar' | 'observar' | 'rechazar' | 'secundaria' | 'alerta';

function ProcesandoModal({ accion, phase, onClose }: { accion: Accion; phase: 'loading' | 'done'; onClose: () => void }) {
  const config: Record<Accion, { label: string; color: string; icon: JSX.Element }> = {
    validar:    { label: 'Paso autorizado exitosamente', color: 'text-green-700 bg-green-50 border-green-200', icon: <CheckCircle className="w-10 h-10 text-green-600" /> },
    observar:   { label: 'Trámite marcado con observaciones', color: 'text-orange-700 bg-orange-50 border-orange-200', icon: <AlertCircle className="w-10 h-10 text-orange-500" /> },
    rechazar:   { label: 'Trámite rechazado', color: 'text-red-700 bg-red-50 border-red-200', icon: <XCircle className="w-10 h-10 text-red-600" /> },
    secundaria: { label: 'Derivado a revisión secundaria', color: 'text-blue-700 bg-blue-50 border-blue-200', icon: <Send className="w-10 h-10 text-blue-600" /> },
    alerta:     { label: 'Alerta crítica emitida a la Central', color: 'text-red-800 bg-red-100 border-red-300 font-bold', icon: <AlertCircle className="w-10 h-10 text-red-700" /> },
  };
  const { label, color, icon } = config[accion];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
        {phase === 'loading' ? (
          <>
            <Loader2 className="w-14 h-14 mx-auto mb-4 text-primary animate-spin" />
            <p className="text-lg mb-1">Procesando evaluación</p>
            <p className="text-sm text-muted-foreground">Registrando decisión en el sistema...</p>
            <div className="mt-4 w-full bg-secondary rounded-full h-1.5 overflow-hidden">
              <div className="bg-primary h-full rounded-full animate-pulse" style={{ width: '70%' }} />
            </div>
          </>
        ) : (
          <>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 bg-gray-50">{icon}</div>
            <p className="text-lg mb-2">Evaluación registrada</p>
            <div className={`border rounded-lg p-3 text-sm mb-6 ${color}`}>{label}</div>
            <div className="text-xs text-muted-foreground mb-6 space-y-1 text-left">
              <p>• Expediente actualizado en el sistema</p>
              <p>• Notificación enviada al pasajero</p>
              <p>• Registro de auditoría guardado</p>
            </div>
            <Button className="w-full" onClick={onClose}>Finalizar</Button>
          </>
        )}
      </div>
    </div>
  );
}

export function ControlFronterizo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [observaciones, setObservaciones] = useState('');
  const [accion, setAccion] = useState<Accion | null>(null);
  const [modalPhase, setModalPhase] = useState<'loading' | 'done' | null>(null);

  const tramite = mockTramites.find(t => t.id === id);

  if (!tramite) {
    return (
      <Layout>
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <p className="text-muted-foreground">Trámite no encontrado</p>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  const tabs = ['Datos Personales', 'Vehículo', 'Declaraciones', 'Documentos', 'Observaciones', 'Historial'];

  const quickActions: Record<string, string[]> = {
    observar: ['Falta seguro del vehículo', 'Diferencia menor en patente', 'Falta firma en autorización de menor'],
    rechazar: ['Documentación adulterada', 'Documento de identidad expirado', 'No cumple requisitos migratorios'],
    secundaria: ['Inspección exhaustiva de equipaje', 'Entrevista migratoria requerida', 'Revisión minuciosa de vehículo'],
    alerta: ['Orden de arraigo vigente (PDI)', 'Posible trata de personas (PDI)', 'Plaga cuarentenaria detectada (SAG)', 'Contrabando de especies (Aduanas)']
  };

  const handleConfirmarAccion = async () => {
    if ((accion === 'observar' || accion === 'rechazar' || accion === 'secundaria' || accion === 'alerta') && !observaciones.trim()) {
      toast.error('Debe ingresar detalles/observaciones antes de continuar');
      return;
    }
    setModalPhase('loading');
    await new Promise(r => setTimeout(r, 1800));
    setModalPhase('done');
  };

  const handleCerrarModal = () => {
    setModalPhase(null);
    navigate('/buscar-tramite');
  };

  return (
    <Layout>
      {modalPhase && accion && <ProcesandoModal accion={accion} phase={modalPhase} onClose={handleCerrarModal} />}

      <div className="space-y-6">
        <Button variant="outline" onClick={() => navigate('/buscar-tramite')}>
          <ArrowLeft className="w-4 h-4 mr-2" />Volver
        </Button>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle>Expediente Fronterizo - {tramite.numeroSolicitud}</CardTitle>
                  <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(tramite.status)}`}>{getStatusLabel(tramite.status)}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mt-4">
                  <div><p className="text-muted-foreground">Pasajero</p><p>{tramite.pasajero.nombre}</p></div>
                  <div><p className="text-muted-foreground">RUN/Pasaporte</p><p>{tramite.pasajero.run}</p></div>
                  <div><p className="text-muted-foreground">Fecha de Viaje</p><p>{new Date(tramite.fechaViaje).toLocaleDateString('es-CL')}</p></div>
                  <div><p className="text-muted-foreground">Paso Fronterizo</p><p>{tramite.pasoFronterizo}</p></div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="border-b border-border">
          <div className="flex gap-4 overflow-x-auto">
            {tabs.map((tab, index) => (
              <button key={tab} onClick={() => setActiveTab(index)}
                className={`pb-3 px-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === index ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 0 && (
          <Card>
            <CardHeader><CardTitle>Datos Personales</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><p className="text-sm text-muted-foreground mb-1">RUN / Pasaporte</p><p className="text-lg">{tramite.pasajero.run}</p></div>
                <div><p className="text-sm text-muted-foreground mb-1">Nombre Completo</p><p className="text-lg">{tramite.pasajero.nombre}</p></div>
                <div><p className="text-sm text-muted-foreground mb-1">Nacionalidad</p><p className="text-lg">{tramite.pasajero.nacionalidad}</p></div>
                {tramite.pasajero.pasaporte && <div><p className="text-sm text-muted-foreground mb-1">N° Pasaporte</p><p className="text-lg">{tramite.pasajero.pasaporte}</p></div>}
              </div>
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700"><CheckCircle className="w-5 h-5" /><p>Datos coinciden con documento presentado</p></div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 1 && (
          <Card>
            <CardHeader><CardTitle>Información del Vehículo</CardTitle></CardHeader>
            <CardContent>
              {tramite.vehiculo ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div><p className="text-sm text-muted-foreground mb-1">Patente</p><p className="text-lg font-mono">{tramite.vehiculo.patente}</p></div>
                    <div><p className="text-sm text-muted-foreground mb-1">Marca</p><p className="text-lg">{tramite.vehiculo.marca}</p></div>
                    <div><p className="text-sm text-muted-foreground mb-1">Modelo</p><p className="text-lg">{tramite.vehiculo.modelo}</p></div>
                  </div>
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700"><CheckCircle className="w-5 h-5" /><p>Documentos del vehículo verificados</p></div>
                  </div>
                </>
              ) : <p className="text-muted-foreground">No viaja con vehículo</p>}
            </CardContent>
          </Card>
        )}

        {activeTab === 2 && (
          <Card>
            <CardHeader><CardTitle>Declaraciones SAG</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: 'Alimentos', value: tramite.declaracionSAG.alimentos },
                  { label: 'Productos de origen animal', value: tramite.declaracionSAG.productosAnimales },
                  { label: 'Productos vegetales', value: tramite.declaracionSAG.productosVegetales },
                ].map(({ label, value }) => (
                  <div key={label} className={`p-4 rounded-lg ${value ? 'bg-yellow-50 border border-yellow-200' : 'bg-secondary'}`}>
                    <div className="flex items-center justify-between">
                      <span>{label}</span>
                      <span className={value ? 'text-orange-600' : 'text-muted-foreground'}>{value ? '✓ Declarado' : '✗ No declarado'}</span>
                    </div>
                  </div>
                ))}
              </div>
              {(tramite.declaracionSAG.alimentos || tramite.declaracionSAG.productosAnimales || tramite.declaracionSAG.productosVegetales) && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-800"><AlertCircle className="w-5 h-5" /><p>Requiere inspección especial del SAG</p></div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 3 && (
          <Card>
            <CardHeader><CardTitle>Verificación de Documentos</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(tramite.documentos).map(([key, value]) => (
                  <div key={key} className={`p-4 rounded-lg border ${value ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-center justify-between">
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      {value
                        ? <span className="flex items-center gap-1 text-green-700"><CheckCircle className="w-4 h-4" />Verificado</span>
                        : <span className="flex items-center gap-1 text-red-700"><XCircle className="w-4 h-4" />No presentado</span>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 4 && (
          <Card>
            <CardHeader><CardTitle>Observaciones del Funcionario</CardTitle></CardHeader>
            <CardContent>
              <textarea
                placeholder="Ingrese observaciones sobre este trámite..."
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                className="w-full min-h-32 p-3 border border-border rounded-md resize-none"
              />
            </CardContent>
          </Card>
        )}

        {activeTab === 5 && (
          <Card>
            <CardHeader><CardTitle>Historial</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-2 bg-primary rounded"></div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">{new Date(tramite.ultimaActualizacion).toLocaleString('es-CL')}</p>
                    <p>Estado: <strong>{getStatusLabel(tramite.status)}</strong></p>
                    {tramite.funcionarioRevisor && <p className="text-sm text-muted-foreground">Por: {tramite.funcionarioRevisor}</p>}
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 bg-muted rounded"></div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">{new Date(tramite.fechaCreacion).toLocaleString('es-CL')}</p>
                    <p className="text-muted-foreground">Solicitud creada por el pasajero</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Acciones */}
        <Card className="border-2 border-primary/20">
          <CardHeader><CardTitle>Evaluación del Paso Fronterizo</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {!accion ? (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <Button onClick={() => setAccion('validar')} className="h-auto py-4 flex-col gap-2">
                  <CheckCircle className="w-6 h-6" /><span>Autorizar Paso</span>
                </Button>
                <Button variant="outline" onClick={() => setAccion('observar')} className="h-auto py-4 flex-col gap-2 border-orange-300 text-orange-700 hover:bg-orange-50">
                  <AlertCircle className="w-6 h-6" /><span>Observar</span>
                </Button>
                <Button variant="outline" onClick={() => setAccion('rechazar')} className="h-auto py-4 flex-col gap-2 border-red-300 text-red-700 hover:bg-red-50">
                  <XCircle className="w-6 h-6" /><span>Rechazar</span>
                </Button>
                <Button variant="outline" onClick={() => setAccion('secundaria')} className="h-auto py-4 flex-col gap-2 border-blue-300 text-blue-700 hover:bg-blue-50">
                  <Send className="w-6 h-6" /><span>Secundaria</span>
                </Button>
                <Button variant="outline" onClick={() => setAccion('alerta')} className="h-auto py-4 flex-col gap-2 border-red-600 bg-red-50 hover:bg-red-100 text-red-800 font-semibold shadow-sm">
                  <AlertCircle className="w-6 h-6" /><span>Generar Alerta</span>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${
                  accion === 'validar' ? 'bg-green-50 border border-green-200' :
                  accion === 'observar' ? 'bg-orange-50 border border-orange-200' :
                  accion === 'rechazar' ? 'bg-red-50 border border-red-200' :
                  accion === 'alerta' ? 'bg-red-100 border-2 border-red-400' :
                  'bg-blue-50 border border-blue-200'
                }`}>
                  <p className="mb-2">
                    <strong>Acción seleccionada:</strong>{' '}
                    {accion === 'validar' && 'Autorizar Paso'}
                    {accion === 'observar' && 'Marcar con Observaciones'}
                    {accion === 'rechazar' && 'Rechazar Trámite'}
                    {accion === 'secundaria' && 'Derivar a Revisión Secundaria'}
                    {accion === 'alerta' && '🚨 Generar Alerta Crítica (PDI/SAG)'}
                  </p>
                  {(accion === 'observar' || accion === 'rechazar' || accion === 'secundaria' || accion === 'alerta') && (
                    <div className="mt-4">
                      {quickActions[accion]?.length > 0 && (
                        <div className="mb-2">
                          <p className="text-xs text-muted-foreground mb-2">Respuestas rápidas:</p>
                          <div className="flex flex-wrap gap-2">
                            {quickActions[accion].map((qa) => (
                              <Button
                                key={qa}
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setObservaciones(prev => prev ? `${prev}\n- ${qa}` : `- ${qa}`)}
                                className={`text-xs h-7 py-1 ${accion === 'alerta' ? 'border-red-300 hover:bg-red-50 text-red-700' : ''}`}
                              >
                                + {qa}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                      <textarea
                        placeholder={
                          accion === 'alerta' ? 'Describa la incidencia grave o añada detalles...' :
                          accion === 'rechazar' ? 'Motivo del rechazo (obligatorio)...' : 'Observaciones (obligatorio)...'
                        }
                        value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)}
                        className="w-full mt-2 min-h-24 p-3 border border-border rounded-md resize-none"
                      />
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleConfirmarAccion}>Confirmar</Button>
                  <Button variant="outline" onClick={() => setAccion(null)}>Cancelar</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
