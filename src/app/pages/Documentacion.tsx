import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { AlertCircle, ArrowLeft, ArrowRight, Upload, X, Check, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface FormData {
  // Datos Personales
  run: string;
  nombre: string;
  nacionalidad: string;
  pasaporte: string;
  
  // Vehículo
  tieneVehiculo: boolean;
  patente: string;
  marca: string;
  modelo: string;
  
  // Menores
  tieneMenores: boolean;
  menores: Array<{
    nombre: string;
    documento: string;
    autorizacion: File | null;
  }>;
  
  // Declaración SAG
  alimentos: boolean;
  productosAnimales: boolean;
  productosVegetales: boolean;
  
  // Documentos
  documentoPasaporte: File | null;
  seguro: File | null;
  permiso: File | null;
}

export function Documentacion() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    run: '',
    nombre: '',
    nacionalidad: 'Chilena',
    pasaporte: '',
    tieneVehiculo: false,
    patente: '',
    marca: '',
    modelo: '',
    tieneMenores: false,
    menores: [],
    alimentos: false,
    productosAnimales: false,
    productosVegetales: false,
    documentoPasaporte: null,
    seguro: null,
    permiso: null
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFileChange = (field: string, file: File | null) => {
    // CP-04.04: Tamaño excedido
    if (file && file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, [field]: 'El archivo no debe superar los 5 MB' }));
      return;
    }

    // CP-04.03: Formato inválido
    if (file) {
      const validFormats = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!validFormats.includes(file.type)) {
        setErrors(prev => ({ ...prev, [field]: 'Formato inválido. Use PDF, JPG o PNG' }));
        return;
      }
    }

    handleChange(field, file);
  };

  const addMenor = () => {
    setFormData(prev => ({
      ...prev,
      menores: [...prev.menores, { nombre: '', documento: '', autorizacion: null }]
    }));
  };

  const removeMenor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      menores: prev.menores.filter((_, i) => i !== index)
    }));
  };

  const updateMenor = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      menores: prev.menores.map((menor, i) =>
        i === index ? { ...menor, [field]: value } : menor
      )
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // CP-04.02: Documento faltante
    if (!formData.run) newErrors.run = 'El RUN/Pasaporte es obligatorio';
    if (!formData.nombre) newErrors.nombre = 'El nombre es obligatorio';
    if (!formData.documentoPasaporte) {
      newErrors.documentoPasaporte = 'Debe adjuntar una copia del pasaporte o cédula';
    }

    if (formData.tieneVehiculo) {
      if (!formData.patente) newErrors.patente = 'La patente es obligatoria';
      if (!formData.marca) newErrors.marca = 'La marca es obligatoria';
      if (!formData.modelo) newErrors.modelo = 'El modelo es obligatorio';
      if (!formData.seguro) newErrors.seguro = 'El seguro obligatorio es requerido para vehículos';
      if (!formData.permiso) newErrors.permiso = 'El permiso de circulación es obligatorio';
    }

    if (formData.tieneMenores && formData.menores.length > 0) {
      formData.menores.forEach((menor, i) => {
        if (!menor.nombre) newErrors[`menor_${i}_nombre`] = 'El nombre del menor es obligatorio';
        if (!menor.documento) newErrors[`menor_${i}_documento`] = 'El documento es obligatorio';
        if (!menor.autorizacion) {
          newErrors[`menor_${i}_autorizacion`] = 'La autorización notarial es obligatoria';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fillMockData = () => {
    // Generar un archivo falso (Mock File) para pasar las validaciones en desarrollo
    const createMockFile = (name: string) => {
      const blob = new Blob(['contenido de prueba'], { type: 'application/pdf' });
      return new File([blob], name, { type: 'application/pdf' });
    };

    setFormData({
      run: '12.345.678-9',
      nombre: 'Juan Pérez Soto',
      nacionalidad: 'Chilena',
      pasaporte: 'CH1234567',
      tieneVehiculo: true,
      patente: 'ABCD12',
      marca: 'Toyota',
      modelo: 'Corolla 2020',
      tieneMenores: true,
      menores: [
        { nombre: 'Pedro Pérez', documento: '22.345.678-9', autorizacion: createMockFile('autorizacion_notarial.pdf') }
      ],
      alimentos: true,
      productosAnimales: false,
      productosVegetales: false,
      documentoPasaporte: createMockFile('pasaporte.pdf'),
      seguro: createMockFile('seguro_obligatorio.pdf'),
      permiso: createMockFile('permiso_circulacion.pdf')
    });
    setErrors({});
    toast.success('Datos de prueba y archivos simulados cargados automáticamente');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Auto-fill on empty submit
    if (!formData.run && !formData.nombre) {
      fillMockData();
      return;
    }

    // CP-04.01: Flujo exitoso
    if (validate()) {
      setIsLoading(true);
      // Simulate network request
      await new Promise(r => setTimeout(r, 800));
      setIsLoading(false);
      
      // Store form data
      sessionStorage.setItem('solicitudDocumentacion', JSON.stringify({
        ...formData,
        // Convert files to names for storage
        documentoPasaporte: formData.documentoPasaporte?.name,
        seguro: formData.seguro?.name,
        permiso: formData.permiso?.name,
        menores: formData.menores.map(m => ({
          ...m,
          autorizacion: m.autorizacion?.name
        }))
      }));
      navigate('/solicitudes/confirmacion');
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
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
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">
              2
            </div>
            <span className="text-sm">Documentación</span>
          </div>
          <div className="h-px bg-border flex-1"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm">
              3
            </div>
            <span className="text-sm text-muted-foreground">Confirmación</span>
          </div>
        </div>

        <div className="flex justify-end mb-4">
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={fillMockData}
            className="text-amber-600 border-amber-200 bg-amber-50 hover:bg-amber-100 hover:text-amber-700"
            title="Rellenar con datos de prueba (Solo Desarrollo)"
          >
            <Zap className="w-4 h-4 mr-2" />
            Rellenar Formulario y Documentos
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Datos Personales */}
          <Card>
            <CardHeader>
              <CardTitle>A. Datos Personales</CardTitle>
              <CardDescription>Información del pasajero principal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="run">RUN / Pasaporte *</Label>
                  <Input
                    id="run"
                    placeholder="12.345.678-9"
                    value={formData.run}
                    onChange={(e) => handleChange('run', e.target.value)}
                    error={!!errors.run}
                  />
                  {errors.run && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.run}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre Completo *</Label>
                  <Input
                    id="nombre"
                    placeholder="Juan Pérez Soto"
                    value={formData.nombre}
                    onChange={(e) => handleChange('nombre', e.target.value)}
                    error={!!errors.nombre}
                  />
                  {errors.nombre && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.nombre}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nacionalidad">Nacionalidad *</Label>
                  <Input
                    id="nacionalidad"
                    value={formData.nacionalidad}
                    onChange={(e) => handleChange('nacionalidad', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pasaporte">N° Pasaporte (opcional)</Label>
                  <Input
                    id="pasaporte"
                    placeholder="CH1234567"
                    value={formData.pasaporte}
                    onChange={(e) => handleChange('pasaporte', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vehículo */}
          <Card>
            <CardHeader>
              <CardTitle>B. Vehículo</CardTitle>
              <CardDescription>Información del vehículo (si corresponde)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="tieneVehiculo"
                  checked={formData.tieneVehiculo}
                  onChange={(e) => handleChange('tieneVehiculo', e.target.checked)}
                  className="w-4 h-4 rounded border-border"
                />
                <Label htmlFor="tieneVehiculo" className="cursor-pointer">
                  Viajaré con vehículo
                </Label>
              </div>

              {formData.tieneVehiculo && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="patente">Patente *</Label>
                    <Input
                      id="patente"
                      placeholder="ABCD12"
                      value={formData.patente}
                      onChange={(e) => handleChange('patente', e.target.value.toUpperCase())}
                      error={!!errors.patente}
                    />
                    {errors.patente && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.patente}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="marca">Marca *</Label>
                    <Input
                      id="marca"
                      placeholder="Toyota"
                      value={formData.marca}
                      onChange={(e) => handleChange('marca', e.target.value)}
                      error={!!errors.marca}
                    />
                    {errors.marca && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.marca}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="modelo">Modelo *</Label>
                    <Input
                      id="modelo"
                      placeholder="Corolla 2020"
                      value={formData.modelo}
                      onChange={(e) => handleChange('modelo', e.target.value)}
                      error={!!errors.modelo}
                    />
                    {errors.modelo && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.modelo}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Menores */}
          <Card>
            <CardHeader>
              <CardTitle>C. Menores de Edad</CardTitle>
              <CardDescription>Información de menores que viajan con usted</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="tieneMenores"
                  checked={formData.tieneMenores}
                  onChange={(e) => handleChange('tieneMenores', e.target.checked)}
                  className="w-4 h-4 rounded border-border"
                />
                <Label htmlFor="tieneMenores" className="cursor-pointer">
                  Viajaré con menores de edad
                </Label>
              </div>

              {formData.tieneMenores && (
                <div className="space-y-4 pt-2">
                  {formData.menores.map((menor, index) => (
                    <div key={index} className="p-4 border border-border rounded-lg space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm">Menor {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMenor(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Nombre Completo *</Label>
                          <Input
                            placeholder="Nombre del menor"
                            value={menor.nombre}
                            onChange={(e) => updateMenor(index, 'nombre', e.target.value)}
                            error={!!errors[`menor_${index}_nombre`]}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>RUN / Documento *</Label>
                          <Input
                            placeholder="12.345.678-9"
                            value={menor.documento}
                            onChange={(e) => updateMenor(index, 'documento', e.target.value)}
                            error={!!errors[`menor_${index}_documento`]}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Autorización Notarial *</Label>
                        <div className="flex items-center gap-2">
                          <label className="flex-1 cursor-pointer">
                            <div className={`border-2 border-dashed rounded-lg p-4 text-center hover:bg-accent/50 transition-colors ${
                              errors[`menor_${index}_autorizacion`] ? 'border-destructive' : 'border-border'
                            }`}>
                              {menor.autorizacion ? (
                                <div className="flex items-center justify-center gap-2 text-sm">
                                  <Check className="w-4 h-4 text-green-600" />
                                  {menor.autorizacion.name}
                                </div>
                              ) : (
                                <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                                  <Upload className="w-5 h-5" />
                                  <span>Adjuntar autorización</span>
                                </div>
                              )}
                            </div>
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => updateMenor(index, 'autorizacion', e.target.files?.[0] || null)}
                              className="hidden"
                            />
                          </label>
                        </div>
                        {errors[`menor_${index}_autorizacion`] && (
                          <p className="text-sm text-destructive flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors[`menor_${index}_autorizacion`]}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                  <Button type="button" variant="outline" onClick={addMenor}>
                    Agregar Menor
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Declaración SAG */}
          <Card>
            <CardHeader>
              <CardTitle>D. Declaración SAG</CardTitle>
              <CardDescription>
                Indique si transporta productos regulados por el Servicio Agrícola y Ganadero
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="alimentos"
                  checked={formData.alimentos}
                  onChange={(e) => handleChange('alimentos', e.target.checked)}
                  className="w-4 h-4 rounded border-border"
                />
                <Label htmlFor="alimentos" className="cursor-pointer">
                  Alimentos (frutas, verduras, carnes, lácteos)
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="productosAnimales"
                  checked={formData.productosAnimales}
                  onChange={(e) => handleChange('productosAnimales', e.target.checked)}
                  className="w-4 h-4 rounded border-border"
                />
                <Label htmlFor="productosAnimales" className="cursor-pointer">
                  Productos de origen animal
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="productosVegetales"
                  checked={formData.productosVegetales}
                  onChange={(e) => handleChange('productosVegetales', e.target.checked)}
                  className="w-4 h-4 rounded border-border"
                />
                <Label htmlFor="productosVegetales" className="cursor-pointer">
                  Productos vegetales (semillas, plantas, madera)
                </Label>
              </div>

              {(formData.alimentos || formData.productosAnimales || formData.productosVegetales) && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm">
                  <p className="text-yellow-800">
                    ⚠️ Su declaración requiere inspección especial del SAG en el paso fronterizo
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Adjuntar Documentos */}
          <Card>
            <CardHeader>
              <CardTitle>E. Adjuntar Documentos</CardTitle>
              <CardDescription>
                Formatos permitidos: PDF, JPG, PNG. Tamaño máximo: 5 MB por archivo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Pasaporte o Cédula de Identidad *</Label>
                <label className="cursor-pointer block">
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center hover:bg-accent/50 transition-colors ${
                    errors.documentoPasaporte ? 'border-destructive' : 'border-border'
                  }`}>
                    {formData.documentoPasaporte ? (
                      <div className="flex items-center justify-center gap-2">
                        <Check className="w-5 h-5 text-green-600" />
                        <span>{formData.documentoPasaporte.name}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Upload className="w-8 h-8" />
                        <span>Haga clic para adjuntar documento</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange('documentoPasaporte', e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
                {errors.documentoPasaporte && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.documentoPasaporte}
                  </p>
                )}
              </div>

              {formData.tieneVehiculo && (
                <>
                  <div className="space-y-2">
                    <Label>Seguro Obligatorio *</Label>
                    <label className="cursor-pointer block">
                      <div className={`border-2 border-dashed rounded-lg p-6 text-center hover:bg-accent/50 transition-colors ${
                        errors.seguro ? 'border-destructive' : 'border-border'
                      }`}>
                        {formData.seguro ? (
                          <div className="flex items-center justify-center gap-2">
                            <Check className="w-5 h-5 text-green-600" />
                            <span>{formData.seguro.name}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Upload className="w-8 h-8" />
                            <span>Haga clic para adjuntar seguro</span>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange('seguro', e.target.files?.[0] || null)}
                        className="hidden"
                      />
                    </label>
                    {errors.seguro && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.seguro}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Permiso de Circulación *</Label>
                    <label className="cursor-pointer block">
                      <div className={`border-2 border-dashed rounded-lg p-6 text-center hover:bg-accent/50 transition-colors ${
                        errors.permiso ? 'border-destructive' : 'border-border'
                      }`}>
                        {formData.permiso ? (
                          <div className="flex items-center justify-center gap-2">
                            <Check className="w-5 h-5 text-green-600" />
                            <span>{formData.permiso.name}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Upload className="w-8 h-8" />
                            <span>Haga clic para adjuntar permiso</span>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange('permiso', e.target.files?.[0] || null)}
                        className="hidden"
                      />
                    </label>
                    {errors.permiso && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.permiso}
                      </p>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/solicitudes/nueva')}
              disabled={isLoading}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Procesando...' : 'Continuar'}
              {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
