import { Routes } from './routes';

// filtra el menu segun los permisos de lectura del rol
export const filterRoutesByPermission = can =>
  Routes.map(oRoute =>
    oRoute.childs
      ? {
          ...oRoute,
          childs: oRoute.childs.filter(oChild => can(oChild.module)),
        }
      : oRoute,
  ).filter(oRoute =>
    oRoute.childs
      ? oRoute.childs.length > 0
      : !oRoute.module || can(oRoute.module),
  );
