import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Search, Filter, Download, AlertTriangle, Info, ShieldAlert, FileText } from 'lucide-react';

interface Log {
  id: string;
  timestamp: string;
  usuario: string;
  rol: string;
  accion: string;
  modulo: string;
  nivel: 'info' | 'warning' | 'critical';
  detalles: string;
}

const mockLogs: Log[] = [
  { id: '1', timestamp: '2026-06-30T10:15:22', usuario: 'Carlos Muñoz', rol: 'aduanas', accion: 'Aprobación Expediente', modulo: 'Control Fronterizo', nivel: 'info', detalles: 'Aprobado trámite TR-2026-00001' },
  { id: '2', timestamp: '2026-06-30T10:18:05', usuario: 'Andrea Silva', rol: 'pdi', accion: 'Consulta Externa', modulo: 'Interoperabilidad', nivel: 'info', detalles: 'Búsqueda de antecedentes RUN 12.345.678-9' },
  { id: '3', timestamp: '2026-06-30T10:45:12', usuario: 'Sistema', rol: 'sistema', accion: 'Timeout Conexión', modulo: 'Consultas Externas', nivel: 'warning', detalles: 'Retraso de respuesta >5s en API PDI' },
  { id: '4', timestamp: '2026-06-30T11:02:30', usuario: 'Roberto Pérez', rol: 'sag', accion: 'Generación Alerta', modulo: 'Control Fronterizo', nivel: 'critical', detalles: 'Alerta SAG: Plaga cuarentenaria en TR-2026-00045' },
  { id: '5', timestamp: '2026-06-30T11:15:00', usuario: 'Desconocido', rol: 'none', accion: 'Intento Login Fallido', modulo: 'Autenticación', nivel: 'warning', detalles: 'Múltiples intentos erróneos IP 190.22.x.x' },
  { id: '6', timestamp: '2026-06-30T12:00:01', usuario: 'Patricia Rojas', rol: 'admin', accion: 'Edición Permisos', modulo: 'Roles y Permisos', nivel: 'critical', detalles: 'Asignado permiso de administrador a nuevo usuario' },
  { id: '7', timestamp: '2026-06-30T12:30:15', usuario: 'María González', rol: 'pasajero', accion: 'Creación Solicitud', modulo: 'Preingreso Online', nivel: 'info', detalles: 'Nueva solicitud creada TR-2026-00089' },
];

const getNivelIcon = (nivel: string) => {
  switch(nivel) {
    case 'info': return <Info className="w-4 h-4 text-blue-500" />;
    case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    case 'critical': return <ShieldAlert className="w-4 h-4 text-red-500" />;
    default: return <FileText className="w-4 h-4 text-gray-500" />;
  }
};

const getNivelBadge = (nivel: string) => {
  switch(nivel) {
    case 'info': return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full border border-blue-200">Info</span>;
    case 'warning': return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full border border-yellow-200">Warning</span>;
    case 'critical': return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full border border-red-200 font-bold">Critical</span>;
    default: return null;
  }
};

export function Auditoria() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterNivel, setFilterNivel] = useState('todos');

  let logs = mockLogs;
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    logs = logs.filter(l => 
      l.usuario.toLowerCase().includes(term) || 
      l.accion.toLowerCase().includes(term) || 
      l.detalles.toLowerCase().includes(term)
    );
  }
  if (filterNivel !== 'todos') {
    logs = logs.filter(l => l.nivel === filterNivel);
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl mb-1">Logs y Auditoría del Sistema</h1>
            <p className="text-muted-foreground">Registro inmutable de transacciones y eventos de seguridad.</p>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar Registro
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar por usuario, acción o detalle..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="pl-10" 
                />
              </div>
              <select 
                value={filterNivel} 
                onChange={(e) => setFilterNivel(e.target.value)} 
                className="h-10 px-3 rounded-md border border-border bg-input-background text-sm"
              >
                <option value="todos">Todos los niveles</option>
                <option value="info">Info</option>
                <option value="warning">Warning (Advertencia)</option>
                <option value="critical">Critical (Crítico)</option>
              </select>
              <Button variant="outline"><Filter className="w-4 h-4 mr-2" /> Más Filtros</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Registro de Eventos</CardTitle>
            <CardDescription>{logs.length} eventos registrados en el período seleccionado.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="text-left py-3 px-4 font-medium">Timestamp</th>
                    <th className="text-left py-3 px-4 font-medium">Nivel</th>
                    <th className="text-left py-3 px-4 font-medium">Usuario (Rol)</th>
                    <th className="text-left py-3 px-4 font-medium">Acción</th>
                    <th className="text-left py-3 px-4 font-medium">Módulo</th>
                    <th className="text-left py-3 px-4 font-medium">Detalles</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b border-border hover:bg-accent/30 font-mono">
                      <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                        {log.timestamp.replace('T', ' ')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getNivelIcon(log.nivel)}
                          {getNivelBadge(log.nivel)}
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-semibold text-foreground">{log.usuario}</span>
                        <span className="text-xs text-muted-foreground ml-1">({log.rol})</span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">{log.accion}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{log.modulo}</td>
                      <td className="py-3 px-4 text-muted-foreground max-w-xs truncate" title={log.detalles}>
                        {log.detalles}
                      </td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted-foreground">
                        No se encontraron registros que coincidan con la búsqueda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
