import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Search, FileText, Eye, QrCode, CheckCircle, Zap } from 'lucide-react';
import { mockTramites, getStatusColor, getStatusLabel } from '../data/mockData';

// ─── Modal escáner QR simulado ───────────────────────────────────────────────
function ScannerModal({ onClose, onResult }: { onClose: () => void; onResult: (tramite: any) => void }) {
  const [phase, setPhase] = useState<'scanning' | 'found'>('scanning');
  const tramiteMock = mockTramites.find(t => t.status === 'aprobado') || mockTramites[0];

  useState(() => {
    const t = setTimeout(() => {
      setPhase('found');
    }, 2500);
    return () => clearTimeout(t);
  });

  const handleContinuar = () => {
    onResult(tramiteMock);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {phase === 'scanning' ? (
          <>
            <p className="text-sm text-muted-foreground uppercase tracking-widest mb-4">Escaneando código QR</p>
            {/* Viewfinder simulado */}
            <div className="relative mx-auto w-52 h-52 mb-4">
              <div className="absolute inset-0 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                <div className="grid grid-cols-7 gap-0.5 opacity-20">
                  {Array.from({ length: 49 }).map((_, i) => (
                    <div key={i} className={`w-5 h-5 rounded-sm ${Math.random() > 0.4 ? 'bg-gray-800' : 'bg-transparent'}`} />
                  ))}
                </div>
              </div>
              <div className="absolute inset-0 flex flex-col pointer-events-none">
                <div
                  className="h-0.5 bg-primary/70 w-full animate-bounce"
                  style={{ animation: 'scanLine 1.5s linear infinite', marginTop: '50%' }}
                />
              </div>
              {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
                <div key={i} className={`absolute ${pos} w-6 h-6`}>
                  <div className={`absolute border-primary border-2 w-6 h-6 ${
                    i === 0 ? 'border-r-0 border-b-0' :
                    i === 1 ? 'border-l-0 border-b-0' :
                    i === 2 ? 'border-r-0 border-t-0' :
                    'border-l-0 border-t-0'
                  }`} />
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Acerque el código QR del pasajero a la cámara
            </p>
            <div className="flex items-center justify-center gap-2 text-primary">
              <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
              <span className="text-sm">Buscando código...</span>
            </div>
            <Button variant="outline" className="mt-4 w-full" onClick={onClose}>Cancelar</Button>
          </>
        ) : (
          <>
            <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-sm font-semibold mb-4 text-green-700">¡Código detectado!</p>
            <div className="bg-secondary rounded-lg p-4 text-sm text-left space-y-2 mb-4">
              <p><span className="text-muted-foreground">Solicitud:</span> <span className="font-mono">{tramiteMock.numeroSolicitud}</span></p>
              <p><span className="text-muted-foreground">Pasajero:</span> {tramiteMock.pasajero.nombre}</p>
              <p><span className="text-muted-foreground">Paso:</span> {tramiteMock.pasoFronterizo}</p>
              <p><span className="text-muted-foreground">Estado:</span>{' '}
                <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(tramiteMock.status)}`}>
                  {getStatusLabel(tramiteMock.status)}
                </span>
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={onClose}>Cancelar</Button>
              <Button className="flex-1" onClick={handleContinuar}>Ver Detalles</Button>
            </div>
          </>
        )}
      </div>
      <style>{`
        @keyframes scanLine {
          0% { margin-top: 10%; }
          50% { margin-top: 85%; }
          100% { margin-top: 10%; }
        }
      `}</style>
    </div>
  );
}

export function ConsultaTramite() {
  const navigate = useNavigate();
  const [searchMethod, setSearchMethod] = useState<'qr' | 'run' | 'pasaporte' | 'solicitud'>('qr');
  const [searchValue, setSearchValue] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const fillMockData = () => {
    switch (searchMethod) {
      case 'run':
        setSearchValue('12.345.678-9');
        break;
      case 'pasaporte':
        setSearchValue('CH1234567');
        break;
      case 'solicitud':
        setSearchValue('TR-2026-00001');
        break;
      default:
        break;
    }
  };

  const handleSearch = () => {
    setHasSearched(true);
    let filtered = mockTramites;
    if (searchValue) {
      filtered = filtered.filter(tramite => {
        switch (searchMethod) {
          case 'run':
          case 'pasaporte':
            return tramite.pasajero.run.includes(searchValue) ||
                   tramite.pasajero.pasaporte?.includes(searchValue);
          case 'solicitud':
            return tramite.numeroSolicitud.includes(searchValue.toUpperCase());
          default:
            return true;
        }
      });
    }
    setResults(filtered);
  };

  const getPlaceholder = () => {
    switch (searchMethod) {
      case 'run': return '12.345.678-9';
      case 'pasaporte': return 'CH1234567';
      case 'solicitud': return 'TR-2026-0001';
      default: return 'Ingrese valor de búsqueda';
    }
  };

  return (
    <Layout>
      {showScanner && (
        <ScannerModal
          onClose={() => setShowScanner(false)}
          onResult={(tramite) => navigate(`/solicitudes/${tramite.id}`)}
        />
      )}

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl mb-1">Consultar Trámite</h1>
          <p className="text-muted-foreground">Busque el estado de las solicitudes y trámites en curso</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Método de Búsqueda</CardTitle>
            <CardDescription>Seleccione el método de búsqueda e ingrese la información</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { key: 'qr', label: 'Escanear QR', Icon: QrCode },
                { key: 'run', label: 'Buscar por RUN', Icon: FileText },
                { key: 'pasaporte', label: 'Buscar por Pasaporte', Icon: FileText },
                { key: 'solicitud', label: 'N° de Solicitud', Icon: Search },
              ].map(({ key, label, Icon }) => (
                <button
                  key={key}
                  onClick={() => setSearchMethod(key as any)}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    searchMethod === key
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-center">{label}</p>
                </button>
              ))}
            </div>

            {searchMethod === 'qr' ? (
              <div className="text-center py-8">
                <QrCode className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">Acerque el código QR del pasajero a la cámara</p>
                <Button onClick={() => setShowScanner(true)}>Activar Escáner</Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="searchValue" className="text-base">
                    {searchMethod === 'run' && 'RUN'}
                    {searchMethod === 'pasaporte' && 'Número de Pasaporte'}
                    {searchMethod === 'solicitud' && 'Número de Solicitud'}
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={fillMockData}
                    className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 h-8"
                  >
                    <Zap className="w-3.5 h-3.5 mr-1" />
                    Datos de Prueba
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Input
                    id="searchValue"
                    placeholder={getPlaceholder()}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Button onClick={handleSearch}>
                    <Search className="w-4 h-4 mr-2" />
                    Buscar
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {hasSearched && (
          <Card>
            <CardHeader>
              <CardTitle>Resultados de Búsqueda</CardTitle>
              <CardDescription>
                {results.length} trámite{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No se encontraron trámites con los criterios de búsqueda</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {results.map((tramite) => (
                    <div
                      key={tramite.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-medium">{tramite.numeroSolicitud}</p>
                          <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(tramite.status)}`}>
                            {getStatusLabel(tramite.status)}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                          <div>
                            <span className="block">Pasajero</span>
                            <span className="text-foreground">{tramite.pasajero.nombre}</span>
                          </div>
                          <div>
                            <span className="block">RUN</span>
                            <span className="text-foreground">{tramite.pasajero.run}</span>
                          </div>
                          <div>
                            <span className="block">Fecha Viaje</span>
                            <span className="text-foreground">
                              {new Date(tramite.fechaViaje).toLocaleDateString('es-CL')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/solicitudes/${tramite.id}`)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalles
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
