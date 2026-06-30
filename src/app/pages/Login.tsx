import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { AlertCircle, Shield, User, Building2, Eye, Leaf, Settings } from 'lucide-react';
import { toast } from 'sonner';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(username, password);
    
    setIsLoading(false);

    if (result.success) {
      toast.success('Sesión iniciada correctamente', {
        description: `Bienvenido/a al Sistema de Aduanas`
      });
      navigate('/dashboard');
    } else {
      setError(result.error || 'Error en el inicio de sesión');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl text-white mb-2">Sistema de Aduanas</h1>
          <p className="text-white/80">Plataforma de Preingreso y Control Fronterizo</p>
          <p className="text-white/60 text-sm mt-1">Gobierno de Chile</p>
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader>
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>Ingrese sus credenciales para acceder al sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Ingrese su usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  error={!!error}
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Ingrese su contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!error}
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => toast.info('Funcionalidad en proceso de implementación', { description: 'La recuperación de contraseña estará disponible próximamente.' })}
              >
                Recuperar Contraseña
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Quick Access - Demo Users */}
        <Card className="mt-4 bg-white/10 border-white/20">
          <CardContent className="pt-5 pb-4">
            <p className="text-white/90 text-xs font-semibold uppercase tracking-wider mb-3 text-center">
              Acceso rápido — Usuarios de prueba
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {[
                { label: 'Pasajero', sub: 'María González', icon: User, username: 'pasajero1', color: 'bg-sky-500 hover:bg-sky-400' },
                { label: 'Aduanas', sub: 'Carlos Muñoz', icon: Building2, username: 'aduanas1', color: 'bg-emerald-600 hover:bg-emerald-500' },
                { label: 'PDI', sub: 'Andrea Silva', icon: Eye, username: 'pdi1', color: 'bg-violet-600 hover:bg-violet-500' },
                { label: 'SAG', sub: 'Roberto Pérez', icon: Leaf, username: 'sag1', color: 'bg-lime-600 hover:bg-lime-500' },
                { label: 'Administrador', sub: 'Patricia Rojas', icon: Settings, username: 'admin1', color: 'bg-amber-600 hover:bg-amber-500 col-span-2 sm:col-span-1' },
              ].map(({ label, sub, icon: Icon, username: u, color }) => (
                <button
                  key={u}
                  type="button"
                  disabled={isLoading}
                  onClick={async () => {
                    setError('');
                    setIsLoading(true);
                    setUsername(u);
                    setPassword('123456');
                    const result = await login(u, '123456');
                    setIsLoading(false);
                    if (result.success) {
                      toast.success('Sesión iniciada correctamente', {
                        description: `Accediendo como ${label}`
                      });
                      navigate('/dashboard');
                    }
                    else setError(result.error || 'Error al acceder');
                  }}
                  className={`${color} text-white rounded-lg px-3 py-2.5 flex items-center gap-2.5 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <div className="text-left leading-tight">
                    <p className="text-xs font-semibold">{label}</p>
                    <p className="text-[10px] text-white/75">{sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
