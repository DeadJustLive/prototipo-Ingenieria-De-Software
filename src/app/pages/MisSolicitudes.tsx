import { useNavigate } from 'react-router';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { PlusCircle, Search, Filter, Eye } from 'lucide-react';
import { mockTramites, getStatusColor, getStatusLabel } from '../data/mockData';
import { useState } from 'react';

export function MisSolicitudes() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todas');

  // Filter tramites (in real app, would filter by current user)
  let filteredTramites = mockTramites.slice(0, 5);

  if (searchTerm) {
    filteredTramites = filteredTramites.filter(t =>
      t.numeroSolicitud.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.pasajero.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (filterStatus !== 'todas') {
    filteredTramites = filteredTramites.filter(t => t.status === filterStatus);
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl mb-1">Mis Solicitudes</h1>
            <p className="text-muted-foreground">Gestione sus solicitudes de viaje</p>
          </div>
          <Button onClick={() => navigate('/solicitudes/nueva')}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Nueva Solicitud
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por número o nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="h-10 px-3 rounded-md border border-border bg-input-background text-sm"
                >
                  <option value="todas">Todos los estados</option>
                  <option value="borrador">Borrador</option>
                  <option value="enviado">Enviado</option>
                  <option value="revision">En Revisión</option>
                  <option value="observado">Observado</option>
                  <option value="aprobado">Aprobado</option>
                  <option value="rechazado">Rechazado</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tramites List */}
        <div className="space-y-4">
          {filteredTramites.length === 0 ? (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <p className="text-muted-foreground mb-4">No se encontraron solicitudes</p>
                <Button onClick={() => navigate('/solicitudes/nueva')}>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Crear Primera Solicitud
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredTramites.map((tramite) => (
              <Card
                key={tramite.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/solicitudes/${tramite.id}`)}
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Main Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg">{tramite.numeroSolicitud}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(tramite.status)}`}>
                          {getStatusLabel(tramite.status)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                        <div>
                          <span className="block">Paso Fronterizo</span>
                          <span className="text-foreground">{tramite.pasoFronterizo}</span>
                        </div>
                        <div>
                          <span className="block">Fecha de Viaje</span>
                          <span className="text-foreground">
                            {new Date(tramite.fechaViaje).toLocaleDateString('es-CL')}
                          </span>
                        </div>
                        <div>
                          <span className="block">Tipo</span>
                          <span className="text-foreground capitalize">{tramite.tipoViaje}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/solicitudes/${tramite.id}`);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Detalles
                      </Button>
                    </div>
                  </div>

                  {/* Observaciones */}
                  {tramite.observaciones && (
                    <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-md text-sm">
                      <p className="text-orange-800">
                        <strong>Observación:</strong> {tramite.observaciones}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
