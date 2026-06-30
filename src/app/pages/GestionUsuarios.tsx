import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { UserPlus, Search, Edit, Trash2, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  estado: string;
  fechaCreacion: string;
}

const usuariosIniciales: Usuario[] = [
  { id: '1', nombre: 'María González', email: 'maria.gonzalez@example.cl', rol: 'pasajero', estado: 'activo', fechaCreacion: '2026-01-15' },
  { id: '2', nombre: 'Carlos Muñoz', email: 'carlos.munoz@aduana.cl', rol: 'aduanas', estado: 'activo', fechaCreacion: '2025-11-20' },
  { id: '3', nombre: 'Andrea Silva', email: 'andrea.silva@pdi.cl', rol: 'pdi', estado: 'activo', fechaCreacion: '2025-09-10' },
  { id: '4', nombre: 'Roberto Pérez', email: 'roberto.perez@sag.cl', rol: 'sag', estado: 'activo', fechaCreacion: '2025-08-05' },
  { id: '5', nombre: 'Patricia Rojas', email: 'patricia.rojas@aduana.cl', rol: 'admin', estado: 'activo', fechaCreacion: '2025-06-01' },
  { id: '6', nombre: 'Juan Pérez', email: 'juan.perez@example.cl', rol: 'pasajero', estado: 'inactivo', fechaCreacion: '2024-12-12' },
];

const getRolLabel = (rol: string) => ({ pasajero: 'Pasajero', aduanas: 'Aduanas', pdi: 'PDI', sag: 'SAG', admin: 'Administrador' }[rol] || rol);
const getRolColor = (rol: string) => ({ pasajero: 'bg-gray-100 text-gray-800', aduanas: 'bg-blue-100 text-blue-800', pdi: 'bg-purple-100 text-purple-800', sag: 'bg-green-100 text-green-800', admin: 'bg-red-100 text-red-800' }[rol] || 'bg-gray-100 text-gray-800');

interface FormValues { nombre: string; email: string; rol: string; estado: string; }

function UsuarioForm({ titulo, initial, onSave, onClose }: { titulo: string; initial: FormValues; onSave: (v: FormValues) => Promise<void>; onClose: () => void }) {
  const [values, setValues] = useState<FormValues>(initial);
  const [errors, setErrors] = useState<Partial<FormValues>>({});
  const [loading, setLoading] = useState(false);

  const set = (field: keyof FormValues, value: string) => {
    setValues(p => ({ ...p, [field]: value }));
    setErrors(p => { const n = { ...p }; delete n[field]; return n; });
  };

  const validate = () => {
    const e: Partial<FormValues> = {};
    if (!values.nombre.trim()) e.nombre = 'El nombre es obligatorio';
    if (!values.email.trim()) e.email = 'El email es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) e.email = 'Email inválido';
    if (!values.rol) e.rol = 'El rol es obligatorio';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    await onSave(values);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg mb-4">{titulo}</h2>
        <div className="space-y-4">
          <div className="space-y-1">
            <Label>Nombre Completo *</Label>
            <Input value={values.nombre} onChange={e => set('nombre', e.target.value)} placeholder="Nombre completo" error={!!errors.nombre} />
            {errors.nombre && <p className="text-xs text-destructive">{errors.nombre}</p>}
          </div>
          <div className="space-y-1">
            <Label>Email *</Label>
            <Input value={values.email} onChange={e => set('email', e.target.value)} placeholder="correo@ejemplo.cl" type="email" error={!!errors.email} />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>
          <div className="space-y-1">
            <Label>Rol *</Label>
            <select
              value={values.rol}
              onChange={e => set('rol', e.target.value)}
              className={`flex h-10 w-full rounded-md border bg-input-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${errors.rol ? 'border-destructive' : 'border-border'}`}
            >
              <option value="">Seleccione un rol</option>
              <option value="pasajero">Pasajero</option>
              <option value="aduanas">Aduanas</option>
              <option value="pdi">PDI</option>
              <option value="sag">SAG</option>
              <option value="admin">Administrador</option>
            </select>
            {errors.rol && <p className="text-xs text-destructive">{errors.rol}</p>}
          </div>
          <div className="space-y-1">
            <Label>Estado</Label>
            <select
              value={values.estado}
              onChange={e => set('estado', e.target.value)}
              className="flex h-10 w-full rounded-md border border-border bg-input-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button className="flex-1" onClick={handleSave} disabled={loading}>
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Guardando...</> : 'Guardar'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function EliminarModal({ usuario, onConfirm, onClose }: { usuario: Usuario; onConfirm: () => Promise<void>; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 text-center" onClick={e => e.stopPropagation()}>
        <div className="inline-flex items-center justify-center w-14 h-14 bg-red-100 rounded-full mb-4">
          <Trash2 className="w-7 h-7 text-destructive" />
        </div>
        <h2 className="text-lg mb-2">¿Eliminar usuario?</h2>
        <p className="text-sm text-muted-foreground mb-1">Está por eliminar a <strong>{usuario.nombre}</strong>.</p>
        <p className="text-sm text-muted-foreground mb-6">Esta acción no se puede deshacer.</p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button className="flex-1 bg-destructive hover:bg-destructive/90 text-white" onClick={handleConfirm} disabled={loading}>
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Eliminando...</> : 'Eliminar'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosIniciales);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRol, setFilterRol] = useState('todos');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [modalCrear, setModalCrear] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState<Usuario | null>(null);
  const [usuarioEliminar, setUsuarioEliminar] = useState<Usuario | null>(null);

  let filteredUsuarios = usuarios;
  if (searchTerm) filteredUsuarios = filteredUsuarios.filter(u => u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));
  if (filterRol !== 'todos') filteredUsuarios = filteredUsuarios.filter(u => u.rol === filterRol);
  if (filterEstado !== 'todos') filteredUsuarios = filteredUsuarios.filter(u => u.estado === filterEstado);

  const handleCrear = async (values: FormValues) => {
    await new Promise(r => setTimeout(r, 900));
    setUsuarios(prev => [{ id: Date.now().toString(), ...values, fechaCreacion: new Date().toISOString().split('T')[0] }, ...prev]);
    setModalCrear(false);
    toast.success(`Usuario ${values.nombre} creado exitosamente`);
  };

  const handleEditar = async (values: FormValues) => {
    await new Promise(r => setTimeout(r, 900));
    setUsuarios(prev => prev.map(u => u.id === usuarioEditar!.id ? { ...u, ...values } : u));
    setUsuarioEditar(null);
    toast.success('Usuario actualizado correctamente');
  };

  const handleEliminar = async () => {
    await new Promise(r => setTimeout(r, 800));
    setUsuarios(prev => prev.filter(u => u.id !== usuarioEliminar!.id));
    toast.success(`Usuario ${usuarioEliminar!.nombre} eliminado`);
    setUsuarioEliminar(null);
  };

  return (
    <Layout>
      {modalCrear && <UsuarioForm titulo="Crear nuevo usuario" initial={{ nombre: '', email: '', rol: '', estado: 'activo' }} onSave={handleCrear} onClose={() => setModalCrear(false)} />}
      {usuarioEditar && <UsuarioForm titulo="Editar usuario" initial={{ nombre: usuarioEditar.nombre, email: usuarioEditar.email, rol: usuarioEditar.rol, estado: usuarioEditar.estado }} onSave={handleEditar} onClose={() => setUsuarioEditar(null)} />}
      {usuarioEliminar && <EliminarModal usuario={usuarioEliminar} onConfirm={handleEliminar} onClose={() => setUsuarioEliminar(null)} />}

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl mb-1">Gestión de Usuarios</h1>
            <p className="text-muted-foreground">Administre los usuarios del sistema</p>
          </div>
          <Button onClick={() => setModalCrear(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Crear Usuario
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Buscar por nombre o email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                </div>
              </div>
              <select value={filterRol} onChange={(e) => setFilterRol(e.target.value)} className="h-10 px-3 rounded-md border border-border bg-input-background text-sm">
                <option value="todos">Todos los roles</option>
                <option value="pasajero">Pasajero</option>
                <option value="aduanas">Aduanas</option>
                <option value="pdi">PDI</option>
                <option value="sag">SAG</option>
                <option value="admin">Administrador</option>
              </select>
              <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)} className="h-10 px-3 rounded-md border border-border bg-input-background text-sm">
                <option value="todos">Todos los estados</option>
                <option value="activo">Activos</option>
                <option value="inactivo">Inactivos</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usuarios del Sistema</CardTitle>
            <CardDescription>{filteredUsuarios.length} usuario{filteredUsuarios.length !== 1 ? 's' : ''} encontrado{filteredUsuarios.length !== 1 ? 's' : ''}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4">Usuario</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Rol</th>
                    <th className="text-left py-3 px-4">Estado</th>
                    <th className="text-left py-3 px-4">Fecha Creación</th>
                    <th className="text-right py-3 px-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsuarios.map((usuario) => (
                    <tr key={usuario.id} className="border-b border-border hover:bg-accent/50">
                      <td className="py-3 px-4">{usuario.nombre}</td>
                      <td className="py-3 px-4 text-muted-foreground">{usuario.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${getRolColor(usuario.rol)}`}>{getRolLabel(usuario.rol)}</span>
                      </td>
                      <td className="py-3 px-4">
                        {usuario.estado === 'activo'
                          ? <span className="flex items-center gap-1 text-green-600"><CheckCircle className="w-4 h-4" />Activo</span>
                          : <span className="flex items-center gap-1 text-red-600"><XCircle className="w-4 h-4" />Inactivo</span>}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{new Date(usuario.fechaCreacion).toLocaleDateString('es-CL')}</td>
                      <td className="py-3 px-4">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setUsuarioEditar(usuario)} title="Editar"><Edit className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => setUsuarioEliminar(usuario)} title="Eliminar"><Trash2 className="w-4 h-4 text-destructive" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { label: 'Total Usuarios', value: usuarios.length, color: '' },
            { label: 'Administradores', value: usuarios.filter(u => u.rol === 'admin').length, color: '' },
            { label: 'Funcionarios', value: usuarios.filter(u => ['aduanas', 'pdi', 'sag'].includes(u.rol)).length, color: '' },
            { label: 'Pasajeros', value: usuarios.filter(u => u.rol === 'pasajero').length, color: '' },
            { label: 'Activos', value: usuarios.filter(u => u.estado === 'activo').length, color: 'text-green-600' },
          ].map(({ label, value, color }) => (
            <Card key={label}>
              <CardHeader className="pb-3">
                <CardDescription>{label}</CardDescription>
                <CardTitle className={`text-2xl ${color}`}>{value}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
