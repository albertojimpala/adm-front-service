import PropTypes from 'prop-types';
import { Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePermissions } from '../../Hooks';
import { filterRoutesByPermission } from '../../Utils/menu';
import { flatRoutes } from '../../Utils/routes';

// onNavigate se llama despues de cambiar de pantalla (cierra el menu en movil)
export const DynamicMenu = ({ onNavigate, ...props }) => {
  const { can } = usePermissions();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const sPath = pathname.replace(/^\/dashboard\/?/, '');
  const oActive = flatRoutes.find(oRoute => oRoute.path === sPath);

  const items = filterRoutesByPermission(can).map(
    ({ key, icon, title, childs }) =>
      childs
        ? {
            key,
            icon,
            label: title,
            children: childs.map(oChild => ({
              key: oChild.key,
              icon: oChild.icon,
              label: oChild.title,
            })),
          }
        : { key, icon, label: title },
  );

  const onClick = ({ key }) => {
    const oRoute = flatRoutes.find(o => o.key === key);
    navigate(oRoute.path ? `/dashboard/${oRoute.path}` : '/dashboard');
    onNavigate?.();
  };

  return (
    <Menu
      className="menu-layout"
      defaultOpenKeys={['billing']}
      items={items}
      mode="inline"
      onClick={onClick}
      selectedKeys={oActive ? [oActive.key] : []}
      {...props}
    />
  );
};

DynamicMenu.propTypes = {
  onNavigate: PropTypes.func,
};
