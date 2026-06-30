import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Label } from '../components/ui/Label';
import { Save, AlertTriangle, Settings, Activity, ServerCrash, Clock, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

export function Configuracion() {
  const [config, setConfig] = useState({
    mantenimiento: false,
    pdi_down: false,
    sag_down: false,
    aduana_down: false,
    timeout_session: '30',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setConfig({
      mantenimiento: localStorage.getItem('sys_config_mantenimiento') === 'true',
      pdi_down: localStorage.getItem('sys_config_pdi_down') === 'true',
      sag_down: localStorage.getItem('sys_config_sag_down') === 'true',
      aduana_down: localStorage.getItem('sys_config_aduana_down') === 'true',
      timeout_session: localStorage.getItem('sys_config_timeout') || '30',
    });
  }, []);

  const handleToggle = (key: keyof typeof config) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 800));
    
    localStorage.setItem('sys_config_mantenimiento', config.mantenimiento.toString());
    localStorage.setItem('sys_config_pdi_down', config.pdi_down.toString());
    localStorage.setItem('sys_config_sag_down', config.sag_down.toString());
    localStorage.setItem('sys_config_aduana_down', config.aduana_down.toString());
    localStorage.setItem('sys_config_timeout', config.timeout_session);
    
    setIsSaving(false);
    toast.success('Configuración global actualizada', { 
      description: 'Los cambios de interoperabilidad (caídas) tienen efecto inmediato.' 
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl mb-1">Configuración del Sistema</h1>
            <p className="text-muted-foreground">Administre parámetros globales y simule escenarios de prueba.</p>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ServerCrash className="w-5 h-5" />
                Simulador de Caídas (Interoperabilidad)
              </CardTitle>
              <CardDescription>Fuerce la desconexión de servicios externos para probar resiliencia del sistema.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-red-50/30">
                <div className="space-y-0.5">
                  <Label className="text-base font-semibold">Sistema PDI (Antecedentes)</Label>
                  <p className="text-sm text-muted-foreground">Si está activo, las consultas externas a PDI fallarán con error 500.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('pdi_down')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${config.pdi_down ? 'bg-red-600' : 'bg-gray-200'}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${config.pdi_down ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg bg-red-50/30">
                <div className="space-y-0.5">
                  <Label className="text-base font-semibold">Sistema SAG (Sanitario)</Label>
                  <p className="text-sm text-muted-foreground">Forzar falla de respuesta en el servicio de revisión agrícola.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('sag_down')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${config.sag_down ? 'bg-red-600' : 'bg-gray-200'}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${config.sag_down ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg bg-red-50/30">
                <div className="space-y-0.5">
                  <Label className="text-base font-semibold">Aduana Limítrofe (MERCOSUR)</Label>
                  <p className="text-sm text-muted-foreground">Interrumpir conexión con el país vecino.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('aduana_down')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${config.aduana_down ? 'bg-red-600' : 'bg-gray-200'}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${config.aduana_down ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5" />
                  Mantenimiento Global
                </CardTitle>
                <CardDescription>Controles a nivel de plataforma entera.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border rounded-lg border-yellow-200 bg-yellow-50">
                  <div className="space-y-0.5">
                    <Label className="text-base font-semibold text-yellow-800">Modo Mantenimiento</Label>
                    <p className="text-sm text-yellow-700">Bloquea el acceso a usuarios no administradores.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle('mantenimiento')}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 ${config.mantenimiento ? 'bg-yellow-600' : 'bg-gray-200'}`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${config.mantenimiento ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Parámetros de Sesión
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Tiempo de expiración de sesión (minutos)</Label>
                  <select
                    value={config.timeout_session}
                    onChange={(e) => setConfig(prev => ({ ...prev, timeout_session: e.target.value }))}
                    className="flex h-10 w-full rounded-md border border-border bg-input-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="15">15 minutos (Alta seguridad)</option>
                    <option value="30">30 minutos (Estándar)</option>
                    <option value="60">60 minutos (Baja seguridad)</option>
                    <option value="120">2 horas</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
