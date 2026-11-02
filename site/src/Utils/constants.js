export const STATUS_OPTIONS = [
  { value: 1, label: 'Activo' },
  { value: 0, label: 'Inactivo' },
];

export const PAYMENT_STATUS = {
  pending: { label: 'Pendiente', color: 'orange' },
  partial: { label: 'Parcial', color: 'blue' },
  paid: { label: 'Pagado', color: 'green' },
};

export const PAYMENT_METHODS = {
  cash: 'Efectivo',
  transfer: 'Transferencia',
  deposit: 'Depósito',
  card: 'Tarjeta',
  check: 'Cheque',
};

export const ACCOUNT_TYPES = {
  bank: { label: 'Banco', color: 'geekblue' },
  petty_cash: { label: 'Caja chica', color: 'gold' },
};

export const MOVEMENT_TYPES = {
  in: { label: 'Entrada', color: 'green' },
  out: { label: 'Salida', color: 'red' },
};

export const MOVEMENT_CATEGORIES = {
  payment: 'Pago de cliente',
  payment_cancel: 'Cancelación de pago',
  transfer: 'Traspaso',
  expense: 'Gasto',
  income: 'Otro ingreso',
  adjustment: 'Ajuste',
};

// avance de los trabajos, en el orden en que normalmente ocurre
export const JOB_PROGRESS = {
  started: { label: 'Iniciado', color: 'default' },
  pending: { label: 'Pendiente', color: 'orange' },
  in_progress: { label: 'En proceso', color: 'processing' },
  in_review: { label: 'En revisión', color: 'purple' },
  finished: { label: 'Finalizado', color: 'success' },
};

// sugerencias para las cuentas de acceso de los clientes, se puede escribir cualquier otra
export const GOVERNMENT_PLATFORMS = [
  {
    name: 'SAT',
    label: 'Servicio de Administración Tributaria',
    url: 'https://www.sat.gob.mx',
  },
  {
    name: 'IMSS',
    label: 'Instituto Mexicano del Seguro Social',
    url: 'https://www.imss.gob.mx',
  },
  {
    name: 'IDSE',
    label: 'IMSS desde su empresa',
    url: 'https://idse.imss.gob.mx',
  },
  {
    name: 'SIPARE',
    label: 'Pago de cuotas obrero patronales',
    url: 'https://sipare.imss.gob.mx',
  },
  {
    name: 'INFONAVIT',
    label: 'Portal empresarial',
    url: 'https://empresarios.infonavit.org.mx',
  },
  {
    name: 'FONACOT',
    label: 'Instituto del Fondo Nacional para el Consumo de los Trabajadores',
    url: 'https://www.fonacot.gob.mx',
  },
  {
    name: 'REPSE',
    label: 'Registro de prestadoras de servicios especializados',
    url: 'https://repse.stps.gob.mx',
  },
  {
    name: 'FINANZAS ESTATAL',
    label: 'Impuesto sobre nómina y contribuciones estatales',
    url: '',
  },
];

export const AGING_BUCKETS = {
  current: 'Al corriente',
  days1to30: '1 a 30 días',
  days31to60: '31 a 60 días',
  days61to90: '61 a 90 días',
  over90: 'Más de 90 días',
};

// modulos de permisos que valida la API (@Auth(roles, modulo, acciones))
export const PERMISSION_MODULES = {
  jobs: 'Trabajos',
  companies: 'Compañías',
  employees: 'Empleados',
  positions: 'Puestos',
  clients: 'Clientes',
  credentials: 'Cuentas de acceso de clientes',
  services: 'Servicios',
  subscriptions: 'Tipos de suscripción',
  charges: 'Cargos',
  payments: 'Pagos',
  accounts: 'Cuentas',
  receivables: 'Cuentas por cobrar',
  regimes: 'Regímenes',
  users: 'Usuarios',
  roles: 'Roles',
};

export const PERMISSION_ACTIONS = {
  read: 'Ver',
  create: 'Crear',
  update: 'Editar',
  delete: 'Eliminar',
};

export const toOptions = oMap =>
  Object.entries(oMap).map(([value, label]) => ({
    value,
    label: typeof label === 'string' ? label : label.label,
  }));
