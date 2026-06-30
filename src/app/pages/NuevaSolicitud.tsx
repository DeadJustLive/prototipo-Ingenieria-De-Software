import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { AlertCircle, ArrowRight, Zap } from 'lucide-react';
import { pasosFronterizos, paises } from '../data/mockData';
import { toast } from 'sonner';

export function NuevaSolicitud() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fechaViaje: '',
    pasoFronterizo: '',
    paisOrigen: 'Chile',
    paisDestino: '',
    tipoViaje: 'salida' as 'ingreso' | 'salida'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // CP-03.03: Campos obligatorios vacíos
    if (!formData.fechaViaje) {
      newErrors.fechaViaje = 'La fecha de viaje es obligatoria';
    }
    if (!formData.pasoFronterizo) {
      newErrors.pasoFronterizo = 'Debe seleccionar un paso fronterizo';
    }
    if (!formData.paisOrigen) {
      newErrors.paisOrigen = 'El país de origen es obligatorio';
    }
    if (!formData.paisDestino) {
      newErrors.paisDestino = 'El país de destino es obligatorio';
    }

    // CP-03.02: Fecha inválida
    if (formData.fechaViaje) {
      const selectedDate = new Date(formData.fechaViaje);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.fechaViaje = 'La fecha de viaje no puede ser anterior a hoy';
      }

      const maxDate = new Date();
      maxDate.setMonth(maxDate.getMonth() + 6);
      if (selectedDate > maxDate) {
        newErrors.fechaViaje = 'La fecha de viaje no puede ser superior a 6 meses';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fillMockData = () => {
    const today = new Date();
    today.setDate(today.getDate() + 5); // 5 days from now
    
    setFormData({
      fechaViaje: today.toISOString().split('T')[0],
      pasoFronterizo: pasosFronterizos[0],
      paisOrigen: 'Chile',
      paisDestino: 'Argentina',
      tipoViaje: 'salida'
    });
    setErrors({});
    toast.success('Datos de prueba cargados automáticamente');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Auto-fill on empty submit for dev convenience
    if (!formData.fechaViaje && !formData.pasoFronterizo && !formData.paisDestino) {
      fillMockData();
      return;
    }

    // CP-03.01: Datos válidos
    if (validate()) {
      setIsLoading(true);
      // Simulate network request
      await new Promise(r => setTimeout(r, 600));
      setIsLoading(false);
      
      // Store form data in sessionStorage to pass to next step
      sessionStorage.setItem('solicitudViaje', JSON.stringify(formData));
      navigate('/solicitudes/documentacion');
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground">
          <span>Inicio</span>
          <span className="mx-2">/</span>
          <span>Mis Solicitudes</span>
          <span className="mx-2">/</span>
          <span className="text-foreground">Nueva Solicitud</span>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">
              1
            </div>
            <span className="text-sm">Datos del Viaje</span>
          </div>
          <div className="h-px bg-border flex-1"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm">
              2
            </div>
            <span className="text-sm text-muted-foreground">Documentación</span>
          </div>
          <div className="h-px bg-border flex-1"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm">
              3
            </div>
            <span className="text-sm text-muted-foreground">Confirmación</span>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>Crear Solicitud de Viaje</CardTitle>
              <CardDescription>
                Ingrese los datos básicos de su viaje. Todos los campos son obligatorios.
              </CardDescription>
            </div>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={fillMockData}
              className="text-amber-600 border-amber-200 bg-amber-50 hover:bg-amber-100 hover:text-amber-700"
              title="Rellenar con datos de prueba (Solo Desarrollo)"
            >
              <Zap className="w-4 h-4 mr-2" />
              Rellenar Datos
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fechaViaje">Fecha de Viaje *</Label>
                  <Input
                    id="fechaViaje"
                    type="date"
                    value={formData.fechaViaje}
                    onChange={(e) => handleChange('fechaViaje', e.target.value)}
                    error={!!errors.fechaViaje}
                  />
                  {errors.fechaViaje && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.fechaViaje}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pasoFronterizo">Paso Fronterizo *</Label>
                  <select
                    id="pasoFronterizo"
                    value={formData.pasoFronterizo}
                    onChange={(e) => handleChange('pasoFronterizo', e.target.value)}
                    className={`flex h-10 w-full rounded-md border bg-input-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      errors.pasoFronterizo ? 'border-destructive' : 'border-border'
                    }`}
                  >
                    <option value="">Seleccione un paso fronterizo</option>
                    {pasosFronterizos.map((paso) => (
                      <option key={paso} value={paso}>
                        {paso}
                      </option>
                    ))}
                  </select>
                  {errors.pasoFronterizo && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.pasoFronterizo}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipoViaje">Tipo de Viaje *</Label>
                  <select
                    id="tipoViaje"
                    value={formData.tipoViaje}
                    onChange={(e) => handleChange('tipoViaje', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-border bg-input-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="salida">Salida de Chile</option>
                    <option value="ingreso">Ingreso a Chile</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paisOrigen">País Origen *</Label>
                  <select
                    id="paisOrigen"
                    value={formData.paisOrigen}
                    onChange={(e) => handleChange('paisOrigen', e.target.value)}
                    className={`flex h-10 w-full rounded-md border bg-input-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      errors.paisOrigen ? 'border-destructive' : 'border-border'
                    }`}
                  >
                    <option value="">Seleccione país</option>
                    {paises.map((pais) => (
                      <option key={pais} value={pais}>
                        {pais}
                      </option>
                    ))}
                  </select>
                  {errors.paisOrigen && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.paisOrigen}
                    </p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="paisDestino">País Destino *</Label>
                  <select
                    id="paisDestino"
                    value={formData.paisDestino}
                    onChange={(e) => handleChange('paisDestino', e.target.value)}
                    className={`flex h-10 w-full rounded-md border bg-input-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      errors.paisDestino ? 'border-destructive' : 'border-border'
                    }`}
                  >
                    <option value="">Seleccione país</option>
                    {paises.map((pais) => (
                      <option key={pais} value={pais}>
                        {pais}
                      </option>
                    ))}
                  </select>
                  {errors.paisDestino && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.paisDestino}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={() => navigate('/dashboard')} disabled={isLoading}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Procesando...' : 'Continuar'}
                  {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h4 className="mb-2">Información Importante</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• La solicitud debe realizarse con al menos 48 horas de anticipación</li>
              <li>• Todos los documentos deben estar vigentes</li>
              <li>• Las autorizaciones notariales para menores son obligatorias</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
