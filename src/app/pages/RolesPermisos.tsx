import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Check, X, Save, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const permisosEstructura = [
  { modulo: 'Preingreso Online', acciones: ['crear', 'editar', 'eliminar', 'ver'] },
  { modulo: 'Control Fronterizo', acciones: ['validar', 'observar', 'rechazar', 'autorizar'] },
  { modulo: 'Búsqueda de Trámites', acciones: ['buscar', 'ver'] },
  { modulo: 'Reportes', acciones: ['generar', 'exportar'] },
  { modulo: 'Gestión de Usuarios', acciones: ['crear', 'editar', 'eliminar', 'ver'] },
  { modulo: 'Consultas Externas', acciones: ['consultar', 'sincronizar'] },
  { modulo: 'Notificaciones', acciones: ['ver', 'gestionar'] }
];

const rolesIniciales = [
  { id: 'pasajero', nombre: 'Pasajero / Turista', color: 'bg-gray-100 text-gray-800' },
  { id: 'aduanas', nombre: 'Funcionario Aduanas', color: 'bg-blue-100 text-blue-800' },
  { id: 'pdi', nombre: 'Funcionario PDI', color: 'bg-purple-100 text-purple-800' },
  { id: 'sag', nombre: 'Funcionario SAG', color: 'bg-green-100 text-green-800' },
  { id: 'admin', nombre: 'Administrador', color: 'bg-red-100 text-red-800' }
];

const matrizInicial: Record<string, Record<string, boolean>> = {
  'pasajero': {
    'Preingreso Online-crear': true,
    'Preingreso Online-editar': true,
    'Preingreso Online-eliminar': true,
    'Preingreso Online-ver': true,
    'Notificaciones-ver': true
  },
  'aduanas': {
    'Control Fronterizo-validar': true,
    'Control Fronterizo-observar': true,
    'Control Fronterizo-rechazar': true,
    'Control Fronterizo-autorizar': true,
    'Búsqueda de Trámites-buscar': true,
    'Búsqueda de Trámites-ver': true,
    'Reportes-generar': true,
    'Reportes-exportar': true,
    'Consultas Externas-consultar': true,
    'Notificaciones-ver': true
  },
  'pdi': {
    'Control Fronterizo-validar': true,
    'Control Fronterizo-observar': true,
    'Control Fronterizo-rechazar': true,
    'Búsqueda de Trámites-buscar': true,
    'Búsqueda de Trámites-ver': true,
    'Consultas Externas-consultar': true,
    'Consultas Externas-sincronizar': true,
    'Notificaciones-ver': true
  },
  'sag': {
    'Control Fronterizo-validar': true,
    'Control Fronterizo-observar': true,
    'Control Fronterizo-rechazar': true,
    'Búsqueda de Trámites-buscar': true,
    'Búsqueda de Trámites-ver': true,
    'Notificaciones-ver': true
  },
  'admin': {
    // Admin is handled via logic, but we can seed it with everything true for UI simplicity
  }
};

// Seed admin
permisosEstructura.forEach(p => {
  p.acciones.forEach(a => {
    if (!matrizInicial['admin']) matrizInicial['admin'] = {};
    matrizInicial['admin'][`${p.modulo}-${a}`] = true;
  });
});

export function RolesPermisos() {
  const [roles, setRoles] = useState(rolesIniciales);
  const [matriz, setMatriz] = useState(matrizInicial);
  const [isSaving, setIsSaving] = useState(false);
  const [modalNuevoRol, setModalNuevoRol] = useState(false);
  const [nuevoRolNombre, setNuevoRolNombre] = useState('');

  const togglePermiso = (rolId: string, modulo: string, accion: string) => {
    if (rolId === 'admin') {
      toast.error('Los permisos del rol Administrador no se pueden modificar.');
      return;
    }
    const key = `${modulo}-${accion}`;
    setMatriz(prev => {
      const rolPermisos = { ...prev[rolId] };
      rolPermisos[key] = !rolPermisos[key];
      return { ...prev, [rolId]: rolPermisos };
    });
  };

  const handleGuardar = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsSaving(false);
    toast.success('Permisos actualizados correctamente', { description: 'Los cambios aplicarán en el próximo inicio de sesión de los usuarios.' });
  };

  const handleCrearRol = async () => {
    if (!nuevoRolNombre.trim()) return;
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 800));
    
    const nuevoId = nuevoRolNombre.toLowerCase().replace(/\s+/g, '-');
    const nuevoRol = {
      id: nuevoId,
      nombre: nuevoRolNombre,
      color: 'bg-indigo-100 text-indigo-800'
    };
    
    setRoles([...roles, nuevoRol]);
    setMatriz({ ...matriz, [nuevoId]: {} });
    setModalNuevoRol(false);
    setNuevoRolNombre('');
    setIsSaving(false);
    toast.success(`Rol "${nuevoRolNombre}" creado exitosamente`);
  };

  return (
    <Layout>
      {modalNuevoRol && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setModalNuevoRol(false)}>
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg mb-4">Crear Nuevo Rol</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nombre del Rol</Label>
                <Input value={nuevoRolNombre} onChange={e => setNuevoRolNombre(e.target.value)} placeholder="Ej: Auditor Externo" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setModalNuevoRol(false)} disabled={isSaving}>Cancelar</Button>
              <Button className="flex-1" onClick={handleCrearRol} disabled={isSaving || !nuevoRolNombre.trim()}>
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Crear Rol'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl mb-1">Roles y Permisos</h1>
            <p className="text-muted-foreground">Gestione qué acciones puede realizar cada rol en el sistema.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setModalNuevoRol(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Rol
            </Button>
            <Button onClick={handleGuardar} disabled={isSaving}>
              {isSaving ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Guardando...</>
              ) : (
                <><Save className="w-4 h-4 mr-2" /> Guardar Cambios</>
              )}
            </Button>
          </div>
        </div>

        {/* Roles Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {roles.map((rol) => (
            <Card key={rol.id}>
              <CardContent className="pt-6">
                <div className={`px-3 py-2 rounded-lg text-center text-xs font-semibold ${rol.color}`}>
                  {rol.nombre}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Permissions Matrix */}
        <Card>
          <CardHeader>
            <CardTitle>Matriz de Autorización</CardTitle>
            <CardDescription>Haga clic en las casillas para habilitar o deshabilitar permisos específicos.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="text-left py-3 px-4 bg-secondary sticky left-0 z-10">Módulo / Acción</th>
                    {roles.map((rol) => (
                      <th key={rol.id} className="text-center py-3 px-2 bg-secondary min-w-[120px]">
                        <div className={`px-2 py-1 rounded text-xs truncate ${rol.color}`} title={rol.nombre}>
                          {rol.nombre.split(' ')[0]}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {permisosEstructura.map((permiso) => (
                    <React.Fragment key={permiso.modulo}>
                      <tr className="border-t-2 border-border bg-muted/30">
                        <td colSpan={roles.length + 1} className="py-2 px-4 sticky left-0 z-10 bg-muted/30">
                          <strong>{permiso.modulo}</strong>
                        </td>
                      </tr>
                      {permiso.acciones.map((accion) => (
                        <tr key={`${permiso.modulo}-${accion}`} className="border-b border-border hover:bg-accent/30 transition-colors">
                          <td className="py-3 px-4 pl-8 sticky left-0 z-10 bg-background">
                            <span className="capitalize">{accion}</span>
                          </td>
                          {roles.map((rol) => {
                            const hasPerm = matriz[rol.id]?.[`${permiso.modulo}-${accion}`];
                            const isEditable = rol.id !== 'admin';
                            return (
                              <td key={rol.id} className="text-center py-3 px-2">
                                <button
                                  type="button"
                                  onClick={() => togglePermiso(rol.id, permiso.modulo, accion)}
                                  disabled={!isEditable}
                                  className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-all ${
                                    hasPerm 
                                      ? 'bg-green-100 hover:bg-green-200 cursor-pointer' 
                                      : 'bg-gray-100 hover:bg-gray-200 cursor-pointer'
                                  } ${!isEditable ? 'opacity-60 cursor-not-allowed' : ''}`}
                                >
                                  {hasPerm ? <Check className="w-5 h-5 text-green-700" /> : <X className="w-4 h-4 text-gray-400" />}
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Permissions Summary */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {roles.map((rol) => {
            const totalPermisos = permisosEstructura.reduce((acc, p) => acc + p.acciones.length, 0);
            const permisosAsignados = permisosEstructura.reduce((acc, p) => {
              return acc + p.acciones.filter(a => matriz[rol.id]?.[`${p.modulo}-${a}`]).length;
            }, 0);
            const porcentaje = Math.round((permisosAsignados / totalPermisos) * 100);

            return (
              <Card key={rol.id}>
                <CardHeader className="pb-3 px-4">
                  <CardTitle className="text-xl text-center">{permisosAsignados}/{totalPermisos}</CardTitle>
                </CardHeader>
                <CardContent className="px-4">
                  <div className="w-full bg-secondary rounded-full h-2 mb-1">
                    <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${porcentaje}%` }}></div>
                  </div>
                  <p className="text-xs text-center text-muted-foreground">{porcentaje}%</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
