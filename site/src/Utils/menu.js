import { Routes } from './routes';

export const filterRoutesByRol = rol => {
  return Routes.filter(route => route.roles.includes(rol));
};
