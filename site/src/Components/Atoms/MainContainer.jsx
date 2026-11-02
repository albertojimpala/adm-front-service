import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Button, Flex, Layout, Popconfirm, Tooltip, Typography } from 'antd';
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../Hooks';
import logo from '../../Assets/img/cidoa_logo.png';
import { DynamicMenu } from './DynamicMenu';

const { Content, Footer, Header, Sider } = Layout;

export const MainContainer = () => {
  const [isCollapsed, setCollapsed] = useState(false);
  const [{ user, role }, , logout] = useAuth();

  return (
    <>
      <Sider
        breakpoint="lg"
        className="sider-layout"
        collapsed={isCollapsed}
        collapsible
        onCollapse={setCollapsed}
        trigger={null}
        width={230}
      >
        <div className="logo">
          <img alt="logo" src={logo} width="100%" />
        </div>
        <DynamicMenu />
      </Sider>
      <Layout className="site-layout">
        <Header className="site-header">
          <Flex align="center" justify="space-between">
            <Button
              icon={isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!isCollapsed)}
              type="text"
            />
            <Flex align="center" gap={16}>
              <Typography.Text>
                <UserOutlined /> {user?.username}{' '}
                {role?.description && (
                  <Typography.Text type="secondary">
                    · {role.description}
                  </Typography.Text>
                )}
              </Typography.Text>
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
        <Footer style={{ textAlign: 'center' }}>
          Copyright ©{' '}
          <a href="http://www.haylex.mx">HAYLEX Consultoría Legal y Contable</a>{' '}
          {new Date().getFullYear()}
        </Footer>
      </Layout>
    </>
  );
};
