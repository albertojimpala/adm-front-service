import { useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Flex,
  Form,
  Modal,
  Row,
  Spin,
  Tag,
  Typography,
} from 'antd';
import { KeyOutlined, UserOutlined } from '@ant-design/icons';
import { UPDATE, process } from '../../Service/Api';
import { useFetchOne } from '../../Hooks';
import { feedback } from '../../Utils/feedback';
import { showError } from '../../Utils/errors';
import { formatDate } from '../../Utils/format';
import { StatusTag } from '../Atoms/StatusTag';
import { ChangePasswordForm } from '../Forms';

// tipo de usuario segun su rol y a quien esta ligado
const profileType = oProfile => {
  if (oProfile.role?.tag === 'super') {
    return { label: 'Super administrador', color: 'gold' };
  }
  if (oProfile.client) {
    return { label: 'Cliente', color: 'blue' };
  }
  if (oProfile.employee) {
    return { label: 'Empleado', color: 'green' };
  }
  return { label: 'Usuario', color: 'default' };
};

const employeeItems = oEmployee => [
  {
    label: 'Nombre',
    children: `${oEmployee.firstName} ${oEmployee.lastName}`,
  },
  { label: 'Puesto', children: oEmployee.position?.description },
  { label: 'Compañía', children: oEmployee.company?.name },
  { label: 'Email', children: oEmployee.email },
  { label: 'Teléfono', children: oEmployee.phone },
  { label: 'RFC', children: oEmployee.rfc },
  { label: 'CURP', children: oEmployee.curp },
  { label: 'Fecha de ingreso', children: formatDate(oEmployee.hireDate) },
];

const clientItems = oClient => [
  { label: 'Nombre o razón social', children: oClient.name },
  { label: 'Nombre comercial', children: oClient.tradeName },
  { label: 'RFC', children: oClient.rfc },
  { label: 'Régimen', children: oClient.regime?.description },
  { label: 'Suscripción', children: oClient.subscriptionType?.description },
  { label: 'Atendido por', children: oClient.company?.name },
  { label: 'Contacto', children: oClient.contactName },
  { label: 'Email', children: oClient.email },
  { label: 'Teléfono', children: oClient.phone },
];

// perfil del usuario de la sesion y cambio de contraseña, sirve para el sistema y el portal
export const UserProfile = () => {
  const [profile, loading] = useFetchOne('auth/profile');
  const [isChanging, setChanging] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formRef] = Form.useForm();

  if (!profile) {
    return <Spin />;
  }

  const oType = profileType(profile);

  const _handleSubmit = async ({ currentPassword, newPassword }) => {
    setSaving(true);
    const response = await process(UPDATE, 'auth/change-password', {
      currentPassword,
      newPassword,
    });
    setSaving(false);
    if (response?.ok) {
      feedback.message.success('Contraseña actualizada');
      setChanging(false);
    } else {
      showError(response, 'Error al cambiar la contraseña');
    }
  };

  return (
    <Spin spinning={loading}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Flex align="center" gap={16} justify="space-between" wrap>
              <Flex align="center" gap={16}>
                <Avatar icon={<UserOutlined />} size={56} />
                <div>
                  <Typography.Title level={4} style={{ margin: 0 }}>
                    {profile.username}
                  </Typography.Title>
                  <Typography.Text type="secondary">
                    {profile.email}
                  </Typography.Text>
                  <div>
                    <Tag color={oType.color}>{oType.label}</Tag>
                  </div>
                </div>
              </Flex>
              <Button icon={<KeyOutlined />} onClick={() => setChanging(true)}>
                Cambiar contraseña
              </Button>
            </Flex>
          </Card>
        </Col>
        <Col lg={profile.employee || profile.client ? 10 : 24} xs={24}>
          <Card title="Cuenta de acceso">
            <Descriptions
              column={1}
              items={[
                { label: 'Usuario', children: profile.username },
                { label: 'Email', children: profile.email },
                { label: 'Rol', children: profile.role?.description },
                {
                  label: 'Estatus',
                  children: <StatusTag status={profile.status} />,
                },
                { label: 'Alta', children: formatDate(profile.createdAt) },
              ]}
            />
            {profile.role?.tag === 'super' && (
              <Typography.Text type="secondary">
                Tiene acceso a todos los módulos del sistema.
              </Typography.Text>
            )}
          </Card>
        </Col>
        {profile.employee && (
          <Col lg={14} xs={24}>
            <Card title="Datos del empleado">
              <Descriptions
                column={{ xs: 1, sm: 2 }}
                items={employeeItems(profile.employee)}
              />
            </Card>
          </Col>
        )}
        {profile.client && (
          <Col lg={14} xs={24}>
            <Card title="Datos del cliente">
              <Descriptions
                column={{ xs: 1, sm: 2 }}
                items={clientItems(profile.client)}
              />
            </Card>
          </Col>
        )}
      </Row>

      <Modal
        cancelText="Cancelar"
        centered
        destroyOnHidden
        okButtonProps={{ loading: saving }}
        okText="Guardar"
        onCancel={() => setChanging(false)}
        onOk={() => formRef.submit()}
        open={isChanging}
        title="Cambiar contraseña"
      >
        <ChangePasswordForm formRef={formRef} onSubmit={_handleSubmit} />
      </Modal>
    </Spin>
  );
};
