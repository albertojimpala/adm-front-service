import React from 'react';
import { Menu } from 'antd';

import { useAuth, useNavigation } from '../../Hooks';
import { filterRoutesByRol } from '../../Utils/menu';

export const DynamicMenu = ({ ...props }) => {
  const [{ role }] = useAuth();
  const [{ pathname }, nav] = useNavigation();

  const _getActive = () => {
    return pathname.replace('/dashboard', '') || '';
  };

  const _renderRoutes = () => {
    const routes = filterRoutesByRol(role.rol);

    return routes.map(({ childs, icon, path, slug, title }) => {
      return childs.length === 0 ? (
        <Menu.Item
          icon={icon}
          key={slug}
          onClick={() => nav(`/dashboard${path}`)}
        >
          {title}
        </Menu.Item>
      ) : (
        <Menu.SubMenu key={slug} title={title}>
          {childs.map(oChild => (
            <Menu.Item
              icon={icon}
              key={path + oChild.path}
              onClick={() => nav(`/dashboard${path}${oChild.path}`)}
            >
              {oChild.title}
            </Menu.Item>
          ))}
        </Menu.SubMenu>
      );
    });
  };

  return (
    <Menu
      mode="inline"
      selectedKeys={[_getActive()]}
      className="menu-layout"
      {...props}
    >
      {_renderRoutes()}
    </Menu>
  );
};
