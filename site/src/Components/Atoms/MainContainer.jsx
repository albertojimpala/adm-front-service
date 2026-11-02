import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  Button,
  Drawer,
  Flex,
  Grid,
  Layout,
  Popconfirm,
  Tooltip,
  Typography,
} from 'antd';
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../Hooks';
import logo from '../../Assets/img/cidoa_logo.png';
import { DynamicMenu } from './DynamicMenu';

const { Content, Footer, Header, Sider } = Layout;

export const MainContainer = () => {
  const [isCollapsed, setCollapsed] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [{ user, role }, , logout] = useAuth();
  const navigate = useNavigate();
  // en pantallas chicas el menu se abre como drawer para no quitarle espacio al contenido
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.lg;

  const oLogo = (
    <div className="logo">
      <img alt="logo" src={logo} width="100%" />
    </div>
  );

  return (
    <>
      {isMobile ? (
        <Drawer
          className="menu-drawer"
          closable={false}
          onClose={() => setMenuOpen(false)}
          open={isMenuOpen}
          placement="left"
          size={260}
        >
          {oLogo}
          <DynamicMenu onNavigate={() => setMenuOpen(false)} />
        </Drawer>
      ) : (
        <Sider
          className="sider-layout"
          collapsed={isCollapsed}
          collapsible
          onCollapse={setCollapsed}
          trigger={null}
          width={230}
        >
          {oLogo}
          <DynamicMenu />
        </Sider>
      )}
      <Layout className="site-layout">
        <Header className="site-header">
          <Flex align="center" justify="space-between">
            {isMobile ? (
              <Button
                icon={<MenuOutlined />}
                onClick={() => setMenuOpen(true)}
                type="text"
              />
            ) : (
              <Button
                icon={
                  isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                }
                onClick={() => setCollapsed(!isCollapsed)}
                type="text"
              />
            )}
            <Flex align="center" gap={16}>
              <Tooltip title="Mi perfil">
                <Button
                  className="header-user"
                  icon={<UserOutlined />}
                  onClick={() => navigate('/dashboard/profile')}
                  type="text"
                >
                  <Typography.Text ellipsis>
                    {user?.username}{' '}
                    {role?.description && screens.sm && (
                      <Typography.Text type="secondary">
                        · {role.description}
                      </Typography.Text>
                    )}
                  </Typography.Text>
                </Button>
              </Tooltip>
              <Popconfirm
                cancelText="Cancelar"
                okText="Sí"
                onConfirm={logout}
                placement="bottomRight"
                title="¿Desea cerrar sesión?"
              >
                <Tooltip title="Cerrar sesión" placement="left">
                  <Button icon={<LogoutOutlined />} type="text" />
                </Tooltip>
              </Popconfirm>
            </Flex>
          </Flex>
        </Header>
        <Content className="site-content">
          <Outlet />
        </Content>
        <Footer className="site-footer">
          Copyright ©{' '}
          <a href="http://www.haylex.mx">HAYLEX Consultoría Legal y Contable</a>{' '}
          {new Date().getFullYear()}
        </Footer>
      </Layout>
    </>
  );
};
