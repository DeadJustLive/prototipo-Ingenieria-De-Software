export type ExpedienteFronterizo = {
  id: string;
  run: string;
  nombre: string;
  nacionalidad: string;
  fechaViaje: string;
  pasoFronterizo: string;
  destino: string;
  estado: string;
  vehiculo?: string;
  productosRegulados?: boolean;
  simularCaida?: boolean;
};

const STORAGE_KEY = 'aduanas_expedientes';

const expedientesIniciales: ExpedienteFronterizo[] = [
  {
    id: 'SOL-2026-001245',
    run: '12.345.678-9',
    nombre: 'Juan Pérez González',
    nacionalidad: 'Chilena',
    fechaViaje: '2026-07-15',
    pasoFronterizo: 'Los Libertadores',
    destino: 'Argentina',
    estado: 'En revisión',
    vehiculo: 'ABCD-12',
    productosRegulados: false,
  },
  {
    id: 'SOL-2026-001246',
    run: '18.765.432-1',
    nombre: 'María López Rojas',
    nacionalidad: 'Chilena',
    fechaViaje: '2026-07-20',
    pasoFronterizo: 'Cardenal Samoré',
    destino: 'Argentina',
    estado: 'Observado',
    vehiculo: 'Sin vehículo',
    productosRegulados: true,
  },
  {
    id: 'SOL-2026-001247',
    run: '11.111.111-1',
    nombre: 'Caso Sistema Externo Caído',
    nacionalidad: 'Chilena',
    fechaViaje: '2026-08-01',
    pasoFronterizo: 'Los Libertadores',
    destino: 'Argentina',
    estado: 'Pendiente de sincronización',
    vehiculo: 'ZXCV-99',
    productosRegulados: false,
    simularCaida: true,
  },
];

function inicializarSiCorresponde() {
  const existentes = localStorage.getItem(STORAGE_KEY);
  if (!existentes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expedientesIniciales));
  }
}

export function obtenerExpedientes(): ExpedienteFronterizo[] {
  inicializarSiCorresponde();
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function buscarExpedientePorRun(run: string): ExpedienteFronterizo | null {
  const normalizado = run.trim().toLowerCase();
  return (
    obtenerExpedientes().find(
      (exp) => exp.run.trim().toLowerCase() === normalizado
    ) || null
  );
}

export function guardarExpediente(expediente: ExpedienteFronterizo) {
  const expedientes = obtenerExpedientes();

  const index = expedientes.findIndex((exp) => exp.id === expediente.id);

  if (index >= 0) {
    expedientes[index] = expediente;
  } else {
    expedientes.push(expediente);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(expedientes));
}

export function generarIdSolicitud() {
  const numero = obtenerExpedientes().length + 1;
  return `SOL-2026-${String(numero).padStart(6, '0')}`;
}