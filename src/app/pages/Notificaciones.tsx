import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Bell, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { mockNotifications } from '../data/mockData';

export function Notificaciones() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, leida: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, leida: true })));
  };

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case 'alerta':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'cambio-estado':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'observacion':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.leida).length;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl mb-1">Notificaciones</h1>
            <p className="text-muted-foreground">
              {unreadCount} notificación{unreadCount !== 1 ? 'es' : ''} sin leer
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              Marcar todas como leídas
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No hay notificaciones</p>
              </CardContent>
            </Card>
          ) : (
            notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`cursor-pointer transition-all ${
                  !notification.leida
                    ? 'border-l-4 border-l-primary bg-blue-50/30'
                    : 'hover:bg-accent/50'
                }`}
                onClick={() => {
                  markAsRead(notification.id);
                  if (notification.tramiteId) {
                    navigate(`/solicitudes/${notification.tramiteId}`);
                  }
                }}
              >
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification.tipo)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-medium">
                          {notification.titulo}
                          {!notification.leida && (
                            <span className="ml-2 inline-block w-2 h-2 bg-primary rounded-full"></span>
                          )}
                        </h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(notification.fecha).toLocaleDateString('es-CL', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {notification.mensaje}
                      </p>

                      {notification.tramiteId && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 h-auto p-0 text-primary hover:bg-transparent"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/solicitudes/${notification.tramiteId}`);
                          }}
                        >
                          Ver trámite →
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
