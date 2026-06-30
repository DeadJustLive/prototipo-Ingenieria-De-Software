import { useState } from 'react';
import { useNavigate } from 'react-router';
import { guardarExpediente, generarIdSolicitud } from '../lib/expedientes';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Check, CheckCircle, FileText, QrCode } from 'lucide-react';

// ─── QR visual (reutilizado desde DetalleSolicitud) ──────────────────────────
function QRMockSVG({ value }: { value: string }) {
  const hash = (s: string) => {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
    return h;
  };
  const size = 21;
  const cells: boolean[][] = Array.from({ length: size }, (_, r) =>
    Array.from({ length: size }, (_, c) => {
      if ((r < 7 && c < 7) || (r < 7 && c >= size - 7) || (r >= size - 7 && c < 7)) return true;
      if ((r === 7 || r === size - 8) && c < 7) return false;
      if (r < 7 && (c === 7 || c === size - 8)) return false;
      return ((hash(value + r * size + c) >> ((r + c) % 8)) & 1) === 1;
    })
  );
  const cellSize = 8;
  const svgSize = size * cellSize;
  return (
    <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`} xmlns="http://www.w3.org/2000/svg">
      <rect width={svgSize} height={svgSize} fill="white" />
      {cells.map((row, r) =>
        row.map((on, c) =>
          on ? <rect key={`${r}-${c}`} x={c * cellSize} y={r * cellSize} width={cellSize} height={cellSize} fill="#003d7a" /> : null
        )
      )}
    </svg>
  );
}

function QRModal({ solicitudId, onClose }: { solicitudId: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 text-center" onClick={e => e.stopPropagation()}>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Código de Ingreso</p>
        <p className="text-lg font-mono mb-4">{solicitudId}</p>
        <div className="flex justify-center mb-4 border border-border rounded-lg p-3 bg-white">
          <QRMockSVG value={solicitudId} />
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Presente este código al funcionario en el paso fronterizo
        </p>
        <Button className="w-full" onClick={onClose}>Cerrar</Button>
      </div>
    </div>
  );
}

export function Confirmacion() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [solicitudId, setSolicitudId] = useState('');
  const [showQR, setShowQR] = useState(false);

  // Get data from sessionStorage
  const viajeData = JSON.parse(sessionStorage.getItem('solicitudViaje') || '{}');
  const docData = JSON.parse(sessionStorage.getItem('solicitudDocumentacion') || '{}');

  const handleSubmit = async () => {
  setIsSubmitting(true);

  await new Promise(resolve => setTimeout(resolve, 1500));
  const idSolicitud = generarIdSolicitud();
  const nuevoExpediente = {
    id: idSolicitud,
    run: docData.run,
    nombre: docData.nombre,
    nacionalidad: docData.nacionalidad,

    fechaViaje: viajeData.fechaViaje,
    pasoFronterizo: viajeData.pasoFronterizo,

    destino: viajeData.paisDestino,

    estado:
      docData.alimentos ||
      docData.productosAnimales ||
      docData.productosVegetales
        ? 'Observado'
        : 'En revisión',

    vehiculo: docData.tieneVehiculo
      ? docData.patente
      : 'Sin vehículo',

    productosRegulados:
      docData.alimentos ||
      docData.productosAnimales ||
      docData.productosVegetales
  };

  guardarExpediente(nuevoExpediente);

  setIsSubmitting(false);
  setSolicitudId(idSolicitud);
  setSubmitted(true);
};

  if (submitted) {
    return (
      <Layout>
        {showQR && <QRModal solicitudId={solicitudId} onClose={() => setShowQR(false)} />}
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardContent className="pt-12 pb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl mb-2">¡Solicitud Enviada Exitosamente!</h2>
              <p className="text-muted-foreground mb-6">
                Su solicitud ha sido registrada y enviada para revisión
              </p>
              
              <div className="bg-secondary p-6 rounded-lg mb-6 text-left">
                <p className="text-sm text-muted-foreground mb-2">Número de Solicitud</p>
                <p className="text-2xl mb-4">{solicitudId}</p>
                
                <div className="space-y-2 text-sm">
                  <p><strong>Paso Fronterizo:</strong> {viajeData.pasoFronterizo}</p>
                  <p><strong>Fecha de Viaje:</strong> {new Date(viajeData.fechaViaje).toLocaleDateString('es-CL')}</p>
                  <p><strong>Estado:</strong> <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Enviado</span></p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6 text-sm text-left">
                <p className="mb-2"><strong>Próximos Pasos:</strong></p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Su solicitud será revisada en las próximas 24-48 horas</li>
                  <li>• Recibirá notificaciones sobre cambios en el estado</li>
                  <li>• Puede consultar el estado en "Mis Solicitudes"</li>
                  <li>• Presente el código QR en el paso fronterizo</li>
                </ul>
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                <Button onClick={() => setShowQR(true)}>
                  <QrCode className="w-4 h-4 mr-2" />
                  Ver Código QR
                </Button>
                <Button variant="outline" onClick={() => navigate('/solicitudes')}>
                  <FileText className="w-4 h-4 mr-2" />
                  Ver Mis Solicitudes
                </Button>
                <Button variant="outline" onClick={() => navigate('/dashboard')}>
                  Ir al Inicio
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Progress */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm">
              <Check className="w-5 h-5" />
            </div>
            <span className="text-sm">Datos del Viaje</span>
          </div>
          <div className="h-px bg-border flex-1"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm">
              <Check className="w-5 h-5" />
            </div>
            <span className="text-sm">Documentación</span>
          </div>
          <div className="h-px bg-border flex-1"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">
              3
            </div>
            <span className="text-sm">Confirmación</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Confirmar y Enviar Solicitud</CardTitle>
            <CardDescription>
              Revise los datos antes de enviar. Una vez enviada, algunos datos no podrán modificarse.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Datos del Viaje */}
            <div>
              <h3 className="mb-3">Datos del Viaje</h3>
              <div className="grid grid-cols-2 gap-y-2 text-sm bg-secondary p-4 rounded-lg">
                <div className="text-muted-foreground">Fecha de Viaje:</div>
                <div>{new Date(viajeData.fechaViaje).toLocaleDateString('es-CL')}</div>
                
                <div className="text-muted-foreground">Paso Fronterizo:</div>
                <div>{viajeData.pasoFronterizo}</div>
                
                <div className="text-muted-foreground">Tipo de Viaje:</div>
                <div className="capitalize">{viajeData.tipoViaje}</div>
                
                <div className="text-muted-foreground">Origen:</div>
                <div>{viajeData.paisOrigen}</div>
                
                <div className="text-muted-foreground">Destino:</div>
                <div>{viajeData.paisDestino}</div>
              </div>
            </div>

            {/* Datos Personales */}
            <div>
              <h3 className="mb-3">Datos Personales</h3>
              <div className="grid grid-cols-2 gap-y-2 text-sm bg-secondary p-4 rounded-lg">
                <div className="text-muted-foreground">RUN/Pasaporte:</div>
                <div>{docData.run}</div>
                
                <div className="text-muted-foreground">Nombre:</div>
                <div>{docData.nombre}</div>
                
                <div className="text-muted-foreground">Nacionalidad:</div>
                <div>{docData.nacionalidad}</div>
              </div>
            </div>

            {/* Vehículo */}
            {docData.tieneVehiculo && (
              <div>
                <h3 className="mb-3">Vehículo</h3>
                <div className="grid grid-cols-2 gap-y-2 text-sm bg-secondary p-4 rounded-lg">
                  <div className="text-muted-foreground">Patente:</div>
                  <div>{docData.patente}</div>
                  
                  <div className="text-muted-foreground">Marca:</div>
                  <div>{docData.marca}</div>
                  
                  <div className="text-muted-foreground">Modelo:</div>
                  <div>{docData.modelo}</div>
                </div>
              </div>
            )}

            {/* Menores */}
            {docData.tieneMenores && docData.menores?.length > 0 && (
              <div>
                <h3 className="mb-3">Menores de Edad</h3>
                <div className="space-y-2">
                  {docData.menores.map((menor: any, index: number) => (
                    <div key={index} className="bg-secondary p-3 rounded-lg text-sm">
                      <p><strong>{menor.nombre}</strong></p>
                      <p className="text-muted-foreground">Doc: {menor.documento}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Declaración SAG */}
            <div>
              <h3 className="mb-3">Declaración SAG</h3>
              <div className="bg-secondary p-4 rounded-lg">
                {!docData.alimentos && !docData.productosAnimales && !docData.productosVegetales ? (
                  <p className="text-sm text-muted-foreground">
                    No declara productos regulados por SAG
                  </p>
                ) : (
                  <div className="space-y-1 text-sm">
                    {docData.alimentos && <p>✓ Alimentos</p>}
                    {docData.productosAnimales && <p>✓ Productos de origen animal</p>}
                    {docData.productosVegetales && <p>✓ Productos vegetales</p>}
                  </div>
                )}
              </div>
            </div>

            {/* Documentos */}
            <div>
              <h3 className="mb-3">Estado de Documentación</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-secondary rounded-lg text-sm">
                  <span>Pasaporte/Cédula</span>
                  <span className="flex items-center gap-1 text-green-600">
                    <Check className="w-4 h-4" />
                    Adjuntado
                  </span>
                </div>
                
                {docData.tieneVehiculo && (
                  <>
                    <div className="flex items-center justify-between p-3 bg-secondary rounded-lg text-sm">
                      <span>Seguro Obligatorio</span>
                      <span className="flex items-center gap-1 text-green-600">
                        <Check className="w-4 h-4" />
                        Adjuntado
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary rounded-lg text-sm">
                      <span>Permiso de Circulación</span>
                      <span className="flex items-center gap-1 text-green-600">
                        <Check className="w-4 h-4" />
                        Adjuntado
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Warning */}
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-sm">
              <p className="text-yellow-800">
                ⚠️ Al enviar esta solicitud, declaro que toda la información proporcionada es verídica
                y los documentos adjuntos son auténticos.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/solicitudes/documentacion')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
