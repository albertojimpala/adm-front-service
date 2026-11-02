import { useState } from 'react';
import {
  Button,
  Flex,
  Layout,
  Popconfirm,
  Tabs,
  Tooltip,
  Typography,
} from 'antd';
import { EditOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth, useFetchOne } from '../../Hooks';
import logo from '../../Assets/img/cidoa_logo.png';
import { ClientGeneral } from '../Clients/ClientGeneral';
import { ClientPendingCharges } from '../Receivables/ClientPendingCharges';
import { ClientStatement } from '../Receivables/ClientStatement';
import { ContactModal } from './ContactModal';
import { PortalCharges } from './PortalCharges';
import { PortalPayments } from './PortalPayments';
import { ClientJobs } from '../Jobs/ClientJobs';
import { UserProfile } from '../Profile/UserProfile';

const { Content, Footer, Header } = Layout;

// portal del cliente: solo consulta su informacion y edita su contacto
export const PortalContainer = () => {
  const [{ user }, , logout] = useAuth();
  const [client, , update] = useFetchOne('portal/me');
  const [editing, setEditing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const onContactSaved = () => {
    update();
    setRefreshKey(n => n + 1);
  };

  return (
    <Layout className="screen portal">
      <Header className="site-header portal-header">
        <Flex align="center" justify="space-between">
          <img alt="logo" className="portal-logo" src={logo} />
          <Flex align="center" gap={16}>
            <Typography.Text>
              <UserOutlined /> {client?.name || user?.username}
            </Typography.Text>
            <Popconfirm
              cancelText="Cancelar"
              okText="Sí"
              onConfirm={logout}
              placement="bottomRight"
              title="¿Desea cerrar sesión?"
            >
              <Tooltip placement="left" title="Cerrar sesión">
                <Button icon={<LogoutOutlined />} type="text" />
              </Tooltip>
            </Popconfirm>
          </Flex>
        </Flex>
      </Header>
      <Content className="site-content">
        <Typography.Title level={3}>Mi cuenta</Typography.Title>
        <Tabs
          destroyOnHidden
          items={[
            {
              key: 'general',
              label: 'Mis datos y servicios',
              children: (
                <ClientGeneral
                  extra={
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => setEditing(true)}
                    >
                      Editar email y teléfono
                    </Button>
                  }
                  key={refreshKey}
                  model="portal/me"
                />
              ),
            },
            {
              key: 'balance',
              label: 'Adeudo',
              children: <ClientPendingCharges model="portal/balance" />,
            },
            { key: 'charges', label: 'Cargos', children: <PortalCharges /> },
            { key: 'payments', label: 'Pagos', children: <PortalPayments /> },
            {
              key: 'jobs',
              label: 'Trabajos',
              children: <ClientJobs model="portal/jobs" />,
            },
            {
              key: 'statement',
              label: 'Estado de cuenta',
              children: <ClientStatement model="portal/statement" />,
            },
            { key: 'profile', label: 'Mi usuario', children: <UserProfile /> },
          ]}
        />
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Copyright ©{' '}
        <a href="http://www.haylex.mx">HAYLEX Consultoría Legal y Contable</a>{' '}
        {new Date().getFullYear()}
      </Footer>
      <ContactModal
        client={editing ? client : null}
        onClose={() => setEditing(false)}
        onSaved={onContactSaved}
      />
    </Layout>
  );
};
