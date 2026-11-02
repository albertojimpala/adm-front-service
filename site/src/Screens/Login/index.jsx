import { Alert, Button, Card, Form, Input, Typography } from 'antd';
import { LockOutlined, LoginOutlined, MailOutlined } from '@ant-design/icons';
import { useAuth } from '../../Hooks';
import logo from '../../Assets/img/cidoa_logo.png';

export const LoginScreen = () => {
  const [, login, , error, loading] = useAuth();

  return (
    <div className="login-screen">
      <Card className="login-card">
        <img alt="logo" className="login-logo" src={logo} />
        <Typography.Title level={4} style={{ textAlign: 'center' }}>
          Ingresar
        </Typography.Title>
        {error && (
          <Alert
            showIcon
            style={{ marginBottom: 16 }}
            title={error}
            type="error"
          />
        )}
        <Form
          layout="vertical"
          name="login"
          onFinish={({ email, password }) => login(email, password)}
        >
          <Form.Item
            label="Correo electrónico"
            name="email"
            rules={[
              { required: true, message: 'Campo requerido' },
              { type: 'email', message: 'Correo no válido' },
            ]}
          >
            <Input autoComplete="email" autoFocus prefix={<MailOutlined />} />
          </Form.Item>
          <Form.Item
            label="Contraseña"
            name="password"
            rules={[{ required: true, message: 'Campo requerido' }]}
          >
            <Input.Password
              autoComplete="current-password"
              prefix={<LockOutlined />}
            />
          </Form.Item>
          <Button
            block
            htmlType="submit"
            icon={<LoginOutlined />}
            loading={loading}
            type="primary"
          >
            Entrar
          </Button>
        </Form>
        <Typography.Paragraph className="copyright" type="secondary">
          Copyright ©{' '}
          <a href="http://www.haylex.mx">HAYLEX Consultoría Legal y Contable</a>{' '}
          {new Date().getFullYear()}
        </Typography.Paragraph>
      </Card>
    </div>
  );
};
