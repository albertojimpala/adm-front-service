import {
  AppstoreOutlined,
  CarryOutOutlined,
  ApartmentOutlined,
  BankOutlined,
  IdcardOutlined,
  SolutionOutlined,
  DollarOutlined,
  FileTextOutlined,
  HomeOutlined,
  ProfileOutlined,
  SafetyOutlined,
  SettingOutlined,
  TagsOutlined,
  TeamOutlined,
  UserOutlined,
  WalletOutlined,
} from '@ant-design/icons';

// menu de la aplicacion, module es el modulo de permisos que valida la API
export const Routes = [
  { key: 'home', path: '', title: 'Inicio', icon: <HomeOutlined /> },
  {
    key: 'clients',
    path: 'clients',
    title: 'Clientes',
    icon: <UserOutlined />,
    module: 'clients',
  },
  {
    key: 'billing',
    title: 'Cobranza',
    icon: <DollarOutlined />,
    childs: [
      {
        key: 'charges',
        path: 'charges',
        title: 'Cargos mensuales',
        icon: <FileTextOutlined />,
        module: 'charges',
      },
      {
        key: 'payments',
        path: 'payments',
        title: 'Pagos',
        icon: <WalletOutlined />,
        module: 'payments',
      },
      {
        key: 'receivables',
        path: 'receivables',
        title: 'Cuentas por cobrar',
        icon: <ProfileOutlined />,
        module: 'receivables',
      },
    ],
  },
  {
    key: 'jobs',
    path: 'jobs',
    title: 'Trabajos',
    icon: <CarryOutOutlined />,
    module: 'jobs',
  },
  {
    key: 'accounts',
    path: 'accounts',
    title: 'Bancos y caja chica',
    icon: <BankOutlined />,
    module: 'accounts',
  },
  {
    key: 'catalogs',
    title: 'Catálogos',
    icon: <AppstoreOutlined />,
    childs: [
      {
        key: 'services',
        path: 'services',
        title: 'Servicios',
        icon: <TagsOutlined />,
        module: 'services',
      },
      {
        key: 'subscription-types',
        path: 'subscription-types',
        title: 'Tipos de suscripción',
        icon: <TagsOutlined />,
        module: 'subscriptions',
      },
      {
        key: 'regimes',
        path: 'regimes',
        title: 'Regímenes fiscales',
        icon: <TagsOutlined />,
        module: 'regimes',
      },
    ],
  },
  {
    key: 'admin',
    title: 'Administración',
    icon: <SettingOutlined />,
    childs: [
      {
        key: 'companies',
        path: 'companies',
        title: 'Compañías',
        icon: <ApartmentOutlined />,
        module: 'companies',
      },
      {
        key: 'employees',
        path: 'employees',
        title: 'Empleados',
        icon: <IdcardOutlined />,
        module: 'employees',
      },
      {
        key: 'positions',
        path: 'positions',
        title: 'Puestos',
        icon: <SolutionOutlined />,
        module: 'positions',
      },
      {
        key: 'users',
        path: 'users',
        title: 'Usuarios',
        icon: <TeamOutlined />,
        module: 'users',
      },
      {
        key: 'roles',
        path: 'roles',
        title: 'Roles',
        icon: <SafetyOutlined />,
        module: 'roles',
      },
    ],
  },
];

// todas las rutas con path (sin los grupos del menu)
export const flatRoutes = Routes.flatMap(oRoute =>
  oRoute.childs ? oRoute.childs : [oRoute],
);
