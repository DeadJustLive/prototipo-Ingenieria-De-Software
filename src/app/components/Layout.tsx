import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';
import { Bell, LogOut, Shield, User, Menu } from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = getNavItemsByRole(user?.role || 'pasajero');

  return (
    <div className="min-h-screen bg-secondary">
      {/* Top Navigation Bar */}
      <header className="bg-primary text-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8" />
              <div>
                <h1 className="text-lg">Sistema de Aduanas</h1>
                <p className="text-xs text-white/70">Gobierno de Chile</p>
              </div>
            </div>

            {/* User Info and Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/notificaciones')}
                className="relative p-2 hover:bg-white/10 rounded-md transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
              </button>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-md">
                <User className="w-4 h-4" />
                <div className="text-sm">
                  <p className="leading-none">{user?.name}</p>
                  <p className="text-xs text-white/70 capitalize">{user?.role}</p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-white hover:bg-white/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Secondary Navigation */}
      <nav className="bg-white border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const isExactMatch = location.pathname === item.path;
              const isChildMatch = location.pathname.startsWith(item.path + '/');
              const hasMoreSpecificMatch = navItems.some(
                other => other.path !== item.path && other.path.length > item.path.length && location.pathname.startsWith(other.path)
              );
              const isActive = isExactMatch || (isChildMatch && !hasMoreSpecificMatch);

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    'px-4 py-3 text-sm whitespace-nowrap border-b-2 transition-colors',
                    isActive
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-border mt-auto">
        <div className="container mx-auto px-4 py-4">
          <p className="text-sm text-muted-foreground text-center">
            © 2026 Servicio Nacional de Aduanas - Gobierno de Chile
          </p>
        </div>
      </footer>
    </div>
  );
}

function getNavItemsByRole(role: string) {
  const commonItems = [
    { path: '/dashboard', label: 'Inicio' }
  ];

  const roleSpecificItems: Record<string, Array<{ path: string; label: string }>> = {
    pasajero: [
      { path: '/solicitudes', label: 'Mis Solicitudes' },
      { path: '/solicitudes/nueva', label: 'Nueva Solicitud' },
      { path: '/notificaciones', label: 'Notificaciones' }
    ],
    aduanas: [
      { path: '/buscar-tramite', label: 'Buscar Trámite' },
      { path: '/control-fronterizo', label: 'Control Fronterizo' },
      { path: '/reportes', label: 'Reportes' },
      { path: '/notificaciones', label: 'Notificaciones' }
    ],
    pdi: [
      { path: '/buscar-tramite', label: 'Buscar Trámite' },
      { path: '/control-fronterizo', label: 'Control Fronterizo' },
      { path: '/consultas-externas', label: 'Consultas Externas' },
      { path: '/notificaciones', label: 'Notificaciones' }
    ],
    sag: [
      { path: '/buscar-tramite', label: 'Buscar Trámite' },
      { path: '/control-fronterizo', label: 'Control SAG' },
      { path: '/notificaciones', label: 'Notificaciones' }
    ],
    admin: [
      { path: '/usuarios', label: 'Gestión de Usuarios' },
      { path: '/roles', label: 'Roles y Permisos' },
      { path: '/reportes', label: 'Reportes' },
      { path: '/consultas-externas', label: 'Interoperabilidad' },
      { path: '/auditoria', label: 'Auditoría' },
      { path: '/configuracion', label: 'Configuración' },
      { path: '/notificaciones', label: 'Notificaciones' }
    ]
  };

  return [...commonItems, ...(roleSpecificItems[role] || [])];
}
