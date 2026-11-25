import { Alert, Button, Card, Checkbox, Form, Input, Typography } from 'antd';
import { LockOutlined, LoginOutlined, MailOutlined } from '@ant-design/icons';
import { useAuth } from '../../Hooks';
import { rememberedEmail } from '../../Redux/store';
import logo from '../../Assets/img/cidoa_logo.png';

export const LoginScreen = () => {
  const [, login, , error, loading] = useAuth();
  // si la ultima vez se marco "Recordarme", se prellena el correo
  const sSavedEmail = rememberedEmail();

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
          initialValues={{ email: sSavedEmail, remember: Boolean(sSavedEmail) }}
          layout="vertical"
          name="login"
          onFinish={({ email, password, remember }) =>
            login(email, password, remember)
          }
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
          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Recordarme</Checkbox>
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
