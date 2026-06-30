export type TramiteStatus = 'borrador' | 'enviado' | 'revision' | 'observado' | 'aprobado' | 'rechazado';

export interface Tramite {
  id: string;
  numeroSolicitud: string;
  fechaViaje: string;
  pasoFronterizo: string;
  paisOrigen: string;
  paisDestino: string;
  tipoViaje: 'ingreso' | 'salida';
  pasajero: {
    run: string;
    nombre: string;
    nacionalidad: string;
    pasaporte?: string;
  };
  vehiculo?: {
    patente: string;
    marca: string;
    modelo: string;
  };
  menores?: Array<{
    nombre: string;
    documento: string;
    autorizacion: boolean;
  }>;
  declaracionSAG: {
    alimentos: boolean;
    productosAnimales: boolean;
    productosVegetales: boolean;
  };
  documentos: {
    pasaporte: boolean;
    seguro: boolean;
    permiso: boolean;
    autorizacionNotarial: boolean;
  };
  status: TramiteStatus;
  observaciones?: string;
  fechaCreacion: string;
  ultimaActualizacion: string;
  funcionarioRevisor?: string;
}

export const pasosFronterizos = [
  'Chacalluta - Arica',
  'Colchane - Iquique',
  'Jama - Antofagasta',
  'Paso Sico - Antofagasta',
  'Los Libertadores - Los Andes',
  'Pehuenche - Talca',
  'Pichachén - Temuco',
  'Cardenal Samoré - Osorno',
  'Futaleufú - Palena',
  'Río Don Guillermo - Cochrane'
];

export const paises = [
  'Argentina',
  'Bolivia',
  'Perú',
  'Brasil',
  'Chile'
];

export const mockTramites: Tramite[] = [
  {
    id: '1',
    numeroSolicitud: 'TR-2026-00001',
    fechaViaje: '2026-06-25',
    pasoFronterizo: 'Los Libertadores - Los Andes',
    paisOrigen: 'Chile',
    paisDestino: 'Argentina',
    tipoViaje: 'salida',
    pasajero: {
      run: '12.345.678-9',
      nombre: 'Juan Pérez Soto',
      nacionalidad: 'Chilena',
      pasaporte: 'CH1234567'
    },
    vehiculo: {
      patente: 'ABCD12',
      marca: 'Toyota',
      modelo: 'Corolla 2020'
    },
    declaracionSAG: {
      alimentos: false,
      productosAnimales: false,
      productosVegetales: false
    },
    documentos: {
      pasaporte: true,
      seguro: true,
      permiso: true,
      autorizacionNotarial: false
    },
    status: 'aprobado',
    fechaCreacion: '2026-06-15T10:30:00',
    ultimaActualizacion: '2026-06-16T14:20:00',
    funcionarioRevisor: 'Carlos Muñoz'
  },
  {
    id: '2',
    numeroSolicitud: 'TR-2026-00002',
    fechaViaje: '2026-06-20',
    pasoFronterizo: 'Chacalluta - Arica',
    paisOrigen: 'Perú',
    paisDestino: 'Chile',
    tipoViaje: 'ingreso',
    pasajero: {
      run: '98.765.432-1',
      nombre: 'Ana María Flores',
      nacionalidad: 'Peruana',
      pasaporte: 'PE9876543'
    },
    menores: [
      {
        nombre: 'Pedro Flores González',
        documento: '23.456.789-0',
        autorizacion: true
      }
    ],
    declaracionSAG: {
      alimentos: true,
      productosAnimales: false,
      productosVegetales: true
    },
    documentos: {
      pasaporte: true,
      seguro: true,
      permiso: true,
      autorizacionNotarial: true
    },
    status: 'revision',
    fechaCreacion: '2026-06-17T09:15:00',
    ultimaActualizacion: '2026-06-17T11:45:00'
  },
  {
    id: '3',
    numeroSolicitud: 'TR-2026-00003',
    fechaViaje: '2026-06-22',
    pasoFronterizo: 'Cardenal Samoré - Osorno',
    paisOrigen: 'Chile',
    paisDestino: 'Argentina',
    tipoViaje: 'salida',
    pasajero: {
      run: '15.876.543-2',
      nombre: 'Diego Ramírez Contreras',
      nacionalidad: 'Chilena',
      pasaporte: 'CH8765432'
    },
    vehiculo: {
      patente: 'WXYZ98',
      marca: 'Chevrolet',
      modelo: 'Cruze 2019'
    },
    declaracionSAG: {
      alimentos: false,
      productosAnimales: false,
      productosVegetales: false
    },
    documentos: {
      pasaporte: true,
      seguro: false,
      permiso: true,
      autorizacionNotarial: false
    },
    status: 'observado',
    observaciones: 'Falta seguro obligatorio del vehículo',
    fechaCreacion: '2026-06-16T15:20:00',
    ultimaActualizacion: '2026-06-17T08:30:00',
    funcionarioRevisor: 'Carlos Muñoz'
  },
  {
    id: '4',
    numeroSolicitud: 'TR-2026-00004',
    fechaViaje: '2026-06-28',
    pasoFronterizo: 'Jama - Antofagasta',
    paisOrigen: 'Argentina',
    paisDestino: 'Chile',
    tipoViaje: 'ingreso',
    pasajero: {
      run: '20.111.222-3',
      nombre: 'Sofía Martínez López',
      nacionalidad: 'Argentina'
    },
    declaracionSAG: {
      alimentos: false,
      productosAnimales: false,
      productosVegetales: false
    },
    documentos: {
      pasaporte: true,
      seguro: true,
      permiso: true,
      autorizacionNotarial: false
    },
    status: 'enviado',
    fechaCreacion: '2026-06-17T13:10:00',
    ultimaActualizacion: '2026-06-17T13:10:00'
  },
  {
    id: '5',
    numeroSolicitud: 'TR-2026-00005',
    fechaViaje: '2026-07-01',
    pasoFronterizo: 'Los Libertadores - Los Andes',
    paisOrigen: 'Chile',
    paisDestino: 'Argentina',
    tipoViaje: 'salida',
    pasajero: {
      run: '11.222.333-4',
      nombre: 'Roberto Castro Vera',
      nacionalidad: 'Chilena'
    },
    declaracionSAG: {
      alimentos: false,
      productosAnimales: false,
      productosVegetales: false
    },
    documentos: {
      pasaporte: false,
      seguro: false,
      permiso: false,
      autorizacionNotarial: false
    },
    status: 'borrador',
    fechaCreacion: '2026-06-17T16:00:00',
    ultimaActualizacion: '2026-06-17T16:00:00'
  }
];

export interface Notification {
  id: string;
  tipo: 'observacion' | 'alerta' | 'cambio-estado';
  titulo: string;
  mensaje: string;
  tramiteId?: string;
  fecha: string;
  leida: boolean;
}

export const mockNotifications: Notification[] = [
  {
    id: '1',
    tipo: 'observacion',
    titulo: 'Trámite Observado',
    mensaje: 'El trámite TR-2026-00003 ha sido observado por falta de documentación',
    tramiteId: '3',
    fecha: '2026-06-17T08:30:00',
    leida: false
  },
  {
    id: '2',
    tipo: 'cambio-estado',
    titulo: 'Trámite Aprobado',
    mensaje: 'El trámite TR-2026-00001 ha sido aprobado exitosamente',
    tramiteId: '1',
    fecha: '2026-06-16T14:20:00',
    leida: true
  },
  {
    id: '3',
    tipo: 'alerta',
    titulo: 'Declaración SAG Pendiente',
    mensaje: 'El trámite TR-2026-00002 requiere revisión especial por declaración de productos agrícolas',
    tramiteId: '2',
    fecha: '2026-06-17T11:45:00',
    leida: false
  }
];

export const getStatusColor = (status: TramiteStatus): string => {
  const colors: Record<TramiteStatus, string> = {
    borrador: 'bg-gray-100 text-gray-800',
    enviado: 'bg-blue-100 text-blue-800',
    revision: 'bg-yellow-100 text-yellow-800',
    observado: 'bg-orange-100 text-orange-800',
    aprobado: 'bg-green-100 text-green-800',
    rechazado: 'bg-red-100 text-red-800'
  };
  return colors[status];
};

export const getStatusLabel = (status: TramiteStatus): string => {
  const labels: Record<TramiteStatus, string> = {
    borrador: 'Borrador',
    enviado: 'Enviado',
    revision: 'En Revisión',
    observado: 'Observado',
    aprobado: 'Aprobado',
    rechazado: 'Rechazado'
  };
  return labels[status];
};
