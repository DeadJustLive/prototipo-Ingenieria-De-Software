import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router';
import {
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  PlusCircle,
  Search,
  BarChart3,
  Users,
  ShieldCheck,
  Activity,
  ServerCrash,
  Settings,
  ShieldAlert
} from 'lucide-react';
import { mockTramites, getStatusLabel, getStatusColor } from '../data/mockData';

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl mb-1">Bienvenido/a, {user?.name}</h1>
          <p className="text-muted-foreground">Panel de control - {getRoleLabel(user?.role || '')}</p>
        </div>

        {/* Role-specific Dashboard */}
        {user?.role === 'pasajero' && <PasajeroDashboard />}
        {user?.role === 'aduanas' && <AduanasDashboard />}
        {user?.role === 'pdi' && <PDIDashboard />}
        {user?.role === 'sag' && <SAGDashboard />}
        {user?.role === 'admin' && <AdminDashboard />}
      </div>
    </Layout>
  );
}

function PasajeroDashboard() {
  const navigate = useNavigate();
  
  // Filter tramites for current user (in real app, would filter by user ID)
  const misTramites = mockTramites.slice(0, 3);
  const stats = {
    total: misTramites.length,
    aprobados: misTramites.filter(t => t.status === 'aprobado').length,
    enRevision: misTramites.filter(t => t.status === 'revision' || t.status === 'enviado').length,
    observados: misTramites.filter(t => t.status === 'observado').length
  };

  return (
    <>
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Solicitudes</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
          <CardContent>
            <FileText className="w-8 h-8 text-primary opacity-20" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Aprobadas</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.aprobados}</CardTitle>
          </CardHeader>
          <CardContent>
            <CheckCircle className="w-8 h-8 text-green-600 opacity-20" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>En Revisión</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">{stats.enRevision}</CardTitle>
          </CardHeader>
          <CardContent>
            <Clock className="w-8 h-8 text-yellow-600 opacity-20" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Observadas</CardDescription>
            <CardTitle className="text-3xl text-orange-600">{stats.observados}</CardTitle>
          </CardHeader>
          <CardContent>
            <AlertTriangle className="w-8 h-8 text-orange-600 opacity-20" />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button onClick={() => navigate('/solicitudes/nueva')}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Nueva Solicitud
          </Button>
          <Button variant="outline" onClick={() => navigate('/solicitudes')}>
            <FileText className="w-4 h-4 mr-2" />
            Ver Mis Solicitudes
          </Button>
        </CardContent>
      </Card>

      {/* Recent Tramites */}
      <Card>
        <CardHeader>
          <CardTitle>Solicitudes Recientes</CardTitle>
          <CardDescription>Últimas solicitudes de viaje</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {misTramites.map((tramite) => (
              <div
                key={tramite.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                onClick={() => navigate(`/solicitudes/${tramite.id}`)}
              >
                <div className="flex-1">
                  <p className="font-medium">{tramite.numeroSolicitud}</p>
                  <p className="text-sm text-muted-foreground">
                    {tramite.pasoFronterizo} - {tramite.fechaViaje}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(tramite.status)}`}>
                  {getStatusLabel(tramite.status)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function AduanasDashboard() {
  const navigate = useNavigate();
  
  const stats = {
    pendientes: mockTramites.filter(t => t.status === 'enviado' || t.status === 'revision').length,
    revisados: mockTramites.filter(t => t.status === 'aprobado' || t.status === 'rechazado').length,
    observados: mockTramites.filter(t => t.status === 'observado').length,
    hoy: 12
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pendientes de Revisión</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">{stats.pendientes}</CardTitle>
          </CardHeader>
          <CardContent>
            <Clock className="w-8 h-8 text-yellow-600 opacity-20" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Revisados Hoy</CardDescription>
            <CardTitle className="text-3xl">{stats.hoy}</CardTitle>
          </CardHeader>
          <CardContent>
            <CheckCircle className="w-8 h-8 text-primary opacity-20" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Observados</CardDescription>
            <CardTitle className="text-3xl text-orange-600">{stats.observados}</CardTitle>
          </CardHeader>
          <CardContent>
            <AlertTriangle className="w-8 h-8 text-orange-600 opacity-20" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Procesados</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.revisados}</CardTitle>
          </CardHeader>
          <CardContent>
            <Activity className="w-8 h-8 text-green-600 opacity-20" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button onClick={() => navigate('/buscar-tramite')}>
            <Search className="w-4 h-4 mr-2" />
            Buscar Trámite
          </Button>
          <Button variant="outline" onClick={() => navigate('/control-fronterizo')}>
            <ShieldCheck className="w-4 h-4 mr-2" />
            Control Fronterizo
          </Button>
          <Button variant="outline" onClick={() => navigate('/reportes')}>
            <BarChart3 className="w-4 h-4 mr-2" />
            Ver Reportes
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trámites Pendientes de Revisión</CardTitle>
          <CardDescription>Requieren atención inmediata</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockTramites.filter(t => t.status === 'enviado' || t.status === 'revision').map((tramite) => (
              <div
                key={tramite.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                onClick={() => navigate(`/control-fronterizo/${tramite.id}`)}
              >
                <div className="flex-1">
                  <p className="font-medium">{tramite.numeroSolicitud} - {tramite.pasajero.nombre}</p>
                  <p className="text-sm text-muted-foreground">
                    {tramite.pasoFronterizo} - {tramite.fechaViaje}
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  Revisar
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function PDIDashboard() {
  const navigate = useNavigate();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Ingresos Hoy</CardDescription>
            <CardTitle className="text-3xl">24</CardTitle>
          </CardHeader>
          <CardContent>
            <Activity className="w-8 h-8 text-primary opacity-20" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Salidas Hoy</CardDescription>
            <CardTitle className="text-3xl">18</CardTitle>
          </CardHeader>
          <CardContent>
            <Activity className="w-8 h-8 text-accent opacity-20" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Alertas Activas</CardDescription>
            <CardTitle className="text-3xl text-red-600">3</CardTitle>
          </CardHeader>
          <CardContent>
            <AlertTriangle className="w-8 h-8 text-red-600 opacity-20" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>En Tránsito</CardDescription>
            <CardTitle className="text-3xl">45</CardTitle>
          </CardHeader>
          <CardContent>
            <Clock className="w-8 h-8 text-yellow-600 opacity-20" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button onClick={() => navigate('/buscar-tramite')}>
            <Search className="w-4 h-4 mr-2" />
            Buscar Persona
          </Button>
          <Button variant="outline" onClick={() => navigate('/consultas-externas')}>
            <ShieldCheck className="w-4 h-4 mr-2" />
            Consultas Externas
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

function SAGDashboard() {
  const navigate = useNavigate();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Declaraciones Hoy</CardDescription>
            <CardTitle className="text-3xl">15</CardTitle>
          </CardHeader>
          <CardContent>
            <FileText className="w-8 h-8 text-primary opacity-20" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Inspecciones Pendientes</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">8</CardTitle>
          </CardHeader>
          <CardContent>
            <Clock className="w-8 h-8 text-yellow-600 opacity-20" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Aprobadas</CardDescription>
            <CardTitle className="text-3xl text-green-600">12</CardTitle>
          </CardHeader>
          <CardContent>
            <CheckCircle className="w-8 h-8 text-green-600 opacity-20" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Rechazadas</CardDescription>
            <CardTitle className="text-3xl text-red-600">2</CardTitle>
          </CardHeader>
          <CardContent>
            <AlertTriangle className="w-8 h-8 text-red-600 opacity-20" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button onClick={() => navigate('/buscar-tramite')}>
            <Search className="w-4 h-4 mr-2" />
            Buscar Declaración
          </Button>
          <Button variant="outline" onClick={() => navigate('/control-fronterizo')}>
            <ShieldCheck className="w-4 h-4 mr-2" />
            Control SAG
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

function AdminDashboard() {
  const navigate = useNavigate();
  const pdi_down = localStorage.getItem('sys_config_pdi_down') === 'true';
  const sag_down = localStorage.getItem('sys_config_sag_down') === 'true';

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Uptime Global</CardDescription>
            <CardTitle className="text-3xl text-green-600">99.98%</CardTitle>
          </CardHeader>
          <CardContent>
            <Activity className="w-8 h-8 text-green-600 opacity-20" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Salud API PDI</CardDescription>
            <CardTitle className={`text-2xl ${pdi_down ? 'text-red-600' : 'text-green-600'}`}>
              {pdi_down ? 'Error 500' : 'En línea'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pdi_down ? (
              <ServerCrash className="w-8 h-8 text-red-600 opacity-20" />
            ) : (
              <CheckCircle className="w-8 h-8 text-green-600 opacity-20" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Salud API SAG</CardDescription>
            <CardTitle className={`text-2xl ${sag_down ? 'text-yellow-600' : 'text-green-600'}`}>
              {sag_down ? 'Timeout' : 'En línea'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sag_down ? (
              <Clock className="w-8 h-8 text-yellow-600 opacity-20" />
            ) : (
              <CheckCircle className="w-8 h-8 text-green-600 opacity-20" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Usuarios Conectados</CardDescription>
            <CardTitle className="text-3xl">1,432</CardTitle>
          </CardHeader>
          <CardContent>
            <Users className="w-8 h-8 text-primary opacity-20" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Accesos Directos de Administración</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button onClick={() => navigate('/auditoria')}>
            <ShieldAlert className="w-4 h-4 mr-2" />
            Ver Auditoría
          </Button>
          <Button variant="outline" onClick={() => navigate('/configuracion')}>
            <Settings className="w-4 h-4 mr-2" />
            Configuración Global
          </Button>
          <Button variant="outline" onClick={() => navigate('/roles')}>
            <ShieldCheck className="w-4 h-4 mr-2" />
            Roles y Permisos
          </Button>
          <Button variant="outline" onClick={() => navigate('/usuarios')}>
            <Users className="w-4 h-4 mr-2" />
            Gestión Usuarios
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    pasajero: 'Pasajero / Turista',
    aduanas: 'Funcionario de Aduanas',
    pdi: 'Funcionario PDI',
    sag: 'Funcionario SAG',
    admin: 'Administrador del Sistema'
  };
  return labels[role] || role;
}
