import React from 'react';
import {
  ContactsOutlined,
  HomeOutlined,
  HddOutlined,
  FileOutlined,
  TeamOutlined,
  ProfileOutlined,
  UserOutlined,
  SolutionOutlined,
} from '@ant-design/icons';

export const Routes = [
  {
    title: 'Home',
    slug: 'home',
    path: '/',
    icon: <HomeOutlined />,
    roles: ['admin', 'Dev'],
    childs: [],
    optionalIcon: true,
  },
  {
    title: 'Usuarios',
    slug: 'users',
    path: '/users',
    icon: <TeamOutlined className="anticon" />,
    roles: ['admin', 'Dev'],
    childs: [],
    optionalIcon: true,
  },
  {
    title: 'Clientes',
    slug: 'clients',
    path: '/clients',
    icon: <UserOutlined />,
    roles: ['admin', 'Dev', 'level_1'],
    childs: [],
    optionalIcon: true,
  },
  {
    title: 'Archivos',
    slug: 'files',
    path: '/files',
    icon: <FileOutlined />,
    roles: ['admin', 'Dev'],
    childs: [],
    optionalIcon: true,
  },
  {
    title: 'Accesos',
    slug: 'Accesos',
    path: '/access',
    icon: <ContactsOutlined />,
    roles: ['admin', 'Dev', 'level_1'],
    childs: [],
    optionalIcon: true,
  },

  {
    title: 'Cuentas Contables',
    slug: 'accounts',
    path: '/accounts',
    icon: <SolutionOutlined />,
    roles: ['admin', 'Dev', 'level_1'],
    childs: [],
    optionalIcon: true,
  },

  {
    title: 'Saldos de Cuentas',
    slug: 'balances',
    path: '/balances',
    icon: <SolutionOutlined />,
    roles: ['admin', 'Dev', 'level_1'],
    childs: [],
    optionalIcon: true,
  },

  {
    title: 'Reportes',
    slug: 'reports',
    path: '/reports',
    icon: <SolutionOutlined />,
    roles: ['admin', 'Dev', 'level_1'],
    childs: [],
    optionalIcon: true,
  },

  {
    title: 'Catalogos',
    slug: 'catalogs',
    path: '',
    icon: <ProfileOutlined />,
    roles: ['admin', 'Dev'],
    childs: [
      {
        title: 'Regimenes',
        slug: 'regimes',
        path: '/regimes',
        icon: <HddOutlined />,
        roles: ['admin', 'Dev', 'level_1'],
        childs: [],
        optionalIcon: true,
      },
    ],
    optionalIcon: true,
  },
];
