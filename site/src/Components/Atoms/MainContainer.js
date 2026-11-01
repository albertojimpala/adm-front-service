import React, { useState } from 'react';
import { Button, Layout, Popconfirm, Row } from 'antd';
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import SubRouter from './SubRouter';
import { DynamicMenu } from './DynamicMenu';
import { useAuth } from '../../Hooks';
import logo from '../../Assets/img/cidoa_logo.png';
import { Footer } from 'antd/lib/layout/layout';

const { Content, Header, Sider } = Layout;

export const MainContainer = () => {
  const [isCollapsed, setCollapsed] = useState(false);
  const [, , logout] = useAuth();

  const toggle = () => setCollapsed(!isCollapsed);

  return (
    <>
      <Sider
        className="sider-layout"
        collapsible
        collapsed={isCollapsed}
        trigger={null}
      >
        <div className="logo">
          <img src={logo} width="100%" />
        </div>
        <DynamicMenu />
      </Sider>
      <Layout className="site-layout">
        <div className="wrapper">
          <Header className="site-layout-background" style={{ padding: 0 }}>
            <Row
              align="middle"
              justify="space-between"
              style={{ marginRight: '10px' }}
            >
              {isCollapsed ? (
                <MenuUnfoldOutlined className="trigger" onClick={toggle} />
              ) : (
                <MenuFoldOutlined className="trigger" onClick={toggle} />
              )}
              <Popconfirm
                cancelText="Cancelar"
                okText="Si"
                onConfirm={() => logout()}
                placement="topRight"
                title="Desea cerrar sesión?"
              >
                <LogoutOutlined />
              </Popconfirm>
            </Row>
          </Header>
          <Content
            className="site-layout-background"
            style={{
              margin: '24px 16px',
              padding: 24,
            }}
          >
            <SubRouter />
          </Content>
        </div>
        <Footer style={{ textAlign: 'center' }}>
          {'Copyright © '}
          <Button type="link"> HAYLEX Consultoria Legal y Contable</Button>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Footer>
      </Layout>
    </>
  );
};
