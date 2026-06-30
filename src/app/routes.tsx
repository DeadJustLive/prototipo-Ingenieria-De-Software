import { createHashRouter, Navigate } from 'react-router';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { NuevaSolicitud } from './pages/NuevaSolicitud';
import { Documentacion } from './pages/Documentacion';
import { Confirmacion } from './pages/Confirmacion';
import { MisSolicitudes } from './pages/MisSolicitudes';
import { DetalleSolicitud } from './pages/DetalleSolicitud';
import { ConsultaTramite } from './pages/ConsultaTramite';
import { ControlFronterizoBusqueda } from './pages/ControlFronterizoBusqueda';
import { ControlFronterizo } from './pages/ControlFronterizo';
import { Notificaciones } from './pages/Notificaciones';
import { Reportes } from './pages/Reportes';
import { GestionUsuarios } from './pages/GestionUsuarios';
import { RolesPermisos } from './pages/RolesPermisos';
import { ConsultasExternas } from './pages/ConsultasExternas';
import { Auditoria } from './pages/Auditoria';
import { Configuracion } from './pages/Configuracion';

export const router = createHashRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/solicitudes',
    element: <MisSolicitudes />,
  },
  {
    path: '/solicitudes/nueva',
    element: <NuevaSolicitud />,
  },
  {
    path: '/solicitudes/documentacion',
    element: <Documentacion />,
  },
  {
    path: '/solicitudes/confirmacion',
    element: <Confirmacion />,
  },
  {
    path: '/solicitudes/:id',
    element: <DetalleSolicitud />,
  },
  {
    path: '/buscar-tramite',
    element: <ConsultaTramite />,
  },
  {
    path: '/control-fronterizo',
    element: <ControlFronterizoBusqueda />,
  },
  {
    path: '/control-fronterizo/:id',
    element: <ControlFronterizo />,
  },
  {
    path: '/notificaciones',
    element: <Notificaciones />,
  },
  {
    path: '/reportes',
    element: <Reportes />,
  },
  {
    path: '/usuarios',
    element: <GestionUsuarios />,
  },
  {
    path: '/roles',
    element: <RolesPermisos />,
  },
  {
    path: '/consultas-externas',
    element: <ConsultasExternas />,
  },
  {
    path: '/auditoria',
    element: <Auditoria />,
  },
  {
    path: '/configuracion',
    element: <Configuracion />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
