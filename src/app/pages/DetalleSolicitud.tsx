import { useParams, useNavigate } from 'react-router';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Download, QrCode, FileText, Check, X } from 'lucide-react';
import { mockTramites, getStatusColor, getStatusLabel } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import React, { useState } from 'react';
import { toast } from 'sonner';

// ─── QR visual mock ─────────────────────────────────────────────────────────
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

// ─── Modal QR ────────────────────────────────────────────────────────────────
function QRModal({ tramite, onClose }: { tramite: any; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Código de Ingreso</p>
        <p className="text-lg font-mono mb-4">{tramite.numeroSolicitud}</p>

        <div className="flex justify-center mb-4 border border-border rounded-lg p-3 bg-white">
          <QRMockSVG value={tramite.numeroSolicitud} />
        </div>

        <div className="text-sm text-muted-foreground space-y-1 mb-4 text-left bg-secondary rounded-lg p-3">
          <p><span className="text-foreground font-medium">Pasajero:</span> {tramite.pasajero.nombre}</p>
          <p><span className="text-foreground font-medium">Paso:</span> {tramite.pasoFronterizo}</p>
          <p><span className="text-foreground font-medium">Fecha:</span> {new Date(tramite.fechaViaje).toLocaleDateString('es-CL')}</p>
          <p><span className="text-foreground font-medium">Estado:</span>{' '}
            <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(tramite.status)}`}>
              {getStatusLabel(tramite.status)}
            </span>
          </p>
        </div>

        <p className="text-xs text-muted-foreground mb-4">
          Presente este código al funcionario en el paso fronterizo
        </p>
        <Button className="w-full" onClick={onClose}>Cerrar</Button>
      </div>
    </div>
  );
}

// ─── Descarga comprobante ────────────────────────────────────────────────────
function descargarComprobante(tramite: any) {
  const contenido = `
========================================================
  SERVICIO NACIONAL DE ADUANAS - GOBIERNO DE CHILE
       COMPROBANTE DE SOLICITUD APROBADA
========================================================

N° Solicitud : ${tramite.numeroSolicitud}
Estado       : ${getStatusLabel(tramite.status)}
Fecha emisión: ${new Date().toLocaleString('es-CL')}

--------------------------------------------------------
DATOS DEL PASAJERO
--------------------------------------------------------
Nombre       : ${tramite.pasajero.nombre}
RUN/Pasaporte: ${tramite.pasajero.run}
Nacionalidad : ${tramite.pasajero.nacionalidad}
${tramite.pasajero.pasaporte ? `Pasaporte    : ${tramite.pasajero.pasaporte}` : ''}

--------------------------------------------------------
DATOS DEL VIAJE
--------------------------------------------------------
Paso Fronterizo : ${tramite.pasoFronterizo}
Fecha de Viaje  : ${new Date(tramite.fechaViaje).toLocaleDateString('es-CL')}
Tipo de Viaje   : ${tramite.tipoViaje === 'ingreso' ? 'Ingreso a Chile' : 'Salida de Chile'}

${tramite.vehiculo ? `--------------------------------------------------------
VEHÍCULO
--------------------------------------------------------
Patente : ${tramite.vehiculo.patente}
Marca   : ${tramite.vehiculo.marca}
Modelo  : ${tramite.vehiculo.modelo}
` : ''}
--------------------------------------------------------
Revisado por  : ${tramite.funcionarioRevisor || 'Sistema Automatizado'}
Fecha revisión: ${new Date(tramite.ultimaActualizacion).toLocaleString('es-CL')}

========================================================
Este comprobante debe presentarse junto con su
documento de identidad en el paso fronterizo.
========================================================
  `.trim();

  const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `comprobante-${tramite.numeroSolicitud}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success('Comprobante descargado correctamente');
}

// ─── Página principal ────────────────────────────────────────────────────────
export function DetalleSolicitud() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [showQR, setShowQR] = useState(false);

  const tramite = mockTramites.find(t => t.id === id);

  if (!tramite) {
    return (
      <Layout>
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <p className="text-muted-foreground">Solicitud no encontrada</p>
            <Button onClick={() => navigate('/solicitudes')} className="mt-4">
              Volver a Mis Solicitudes
            </Button>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  const tabs = ['Datos Personales', 'Vehículo', 'Declaraciones', 'Documentos', 'Historial'];

  return (
    <Layout>
      {showQR && <QRModal tramite={tramite} onClose={() => setShowQR(false)} />}

      <div className="space-y-6">
        <Button variant="outline" onClick={() => navigate('/solicitudes')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        {/* Header Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle>{tramite.numeroSolicitud}</CardTitle>
                  <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(tramite.status)}`}>
                    {getStatusLabel(tramite.status)}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mt-4">
                  <div>
                    <p className="text-muted-foreground">Pasajero</p>
                    <p>{tramite.pasajero.nombre}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Fecha de Viaje</p>
                    <p>{new Date(tramite.fechaViaje).toLocaleDateString('es-CL')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Paso Fronterizo</p>
                    <p>{tramite.pasoFronterizo}</p>
                  </div>
                </div>
              </div>

              {user?.role === 'pasajero' && tramite.status === 'aprobado' && (
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => setShowQR(true)}>
                    <QrCode className="w-4 h-4 mr-2" />
                    Mostrar QR
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => descargarComprobante(tramite)}>
                    <Download className="w-4 h-4 mr-2" />
                    Descargar
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex gap-4 overflow-x-auto">
            {tabs.map((tab, index) => (
              <button
                key={tab}
                onClick={() => setActiveTab(index)}
                className={`pb-3 px-2 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === index
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
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
                <div>
                  <p className="text-sm text-muted-foreground mb-1">RUN / Pasaporte</p>
                  <p>{tramite.pasajero.run}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Nombre Completo</p>
                  <p>{tramite.pasajero.nombre}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Nacionalidad</p>
                  <p>{tramite.pasajero.nacionalidad}</p>
                </div>
                {tramite.pasajero.pasaporte && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">N° Pasaporte</p>
                    <p>{tramite.pasajero.pasaporte}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 1 && (
          <Card>
            <CardHeader><CardTitle>Información del Vehículo</CardTitle></CardHeader>
            <CardContent>
              {tramite.vehiculo ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Patente</p>
                    <p className="font-mono">{tramite.vehiculo.patente}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Marca</p>
                    <p>{tramite.vehiculo.marca}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Modelo</p>
                    <p>{tramite.vehiculo.modelo}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No viaja con vehículo</p>
              )}
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
                  { label: 'Productos Animales', value: tramite.declaracionSAG.productosAnimales },
                  { label: 'Productos Vegetales', value: tramite.declaracionSAG.productosVegetales },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <span>{label}</span>
                    {value ? (
                      <span className="flex items-center gap-1 text-orange-600"><Check className="w-4 h-4" /> Declarado</span>
                    ) : (
                      <span className="flex items-center gap-1 text-muted-foreground"><X className="w-4 h-4" /> No declarado</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 3 && (
          <Card>
            <CardHeader><CardTitle>Documentos Adjuntos</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(tramite.documentos).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </div>
                    {value ? (
                      <span className="flex items-center gap-1 text-green-600"><Check className="w-4 h-4" /> Adjuntado</span>
                    ) : (
                      <span className="flex items-center gap-1 text-muted-foreground"><X className="w-4 h-4" /> No adjuntado</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 4 && (
          <Card>
            <CardHeader><CardTitle>Historial de Cambios</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-2 bg-primary rounded"></div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm mb-1">{new Date(tramite.ultimaActualizacion).toLocaleString('es-CL')}</p>
                    <p>Estado actualizado a: <strong>{getStatusLabel(tramite.status)}</strong></p>
                    {tramite.funcionarioRevisor && (
                      <p className="text-sm text-muted-foreground">Por: {tramite.funcionarioRevisor}</p>
                    )}
                    {tramite.observaciones && (
                      <p className="text-sm mt-2 p-2 bg-orange-50 border border-orange-200 rounded">{tramite.observaciones}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 bg-muted rounded"></div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm text-muted-foreground mb-1">{new Date(tramite.fechaCreacion).toLocaleString('es-CL')}</p>
                    <p className="text-muted-foreground">Solicitud creada</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {tramite.observaciones && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-orange-800">Observaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-orange-900">{tramite.observaciones}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
