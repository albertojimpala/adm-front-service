import PropTypes from 'prop-types';
import { Form, Input } from 'antd';

// mismas reglas que valida la API (ChangePasswordDto)
const PASSWORD_RULES = [
  { required: true, message: 'Campo requerido' },
  { min: 8, message: 'Mínimo 8 caracteres' },
  { max: 50 },
  {
    pattern: /(?=.*\d)(?=.*[A-Z])(?=.*[a-z])/,
    message: 'Debe tener una mayúscula, una minúscula y un número',
  },
];

export const ChangePasswordForm = ({ formRef, onSubmit }) => (
  <Form
    autoComplete="off"
    form={formRef}
    layout="vertical"
    name="ChangePasswordForm"
    onFinish={onSubmit}
  >
    <Form.Item
      label="Contraseña actual"
      name="currentPassword"
      rules={[{ required: true, message: 'Campo requerido' }]}
    >
      <Input.Password autoComplete="current-password" />
    </Form.Item>
    <Form.Item
      extra="Mínimo 8 caracteres, con mayúscula, minúscula y número"
      label="Nueva contraseña"
      name="newPassword"
      rules={PASSWORD_RULES}
    >
      <Input.Password autoComplete="new-password" />
    </Form.Item>
    <Form.Item
      dependencies={['newPassword']}
      label="Confirmar nueva contraseña"
      name="confirmPassword"
      rules={[
        { required: true, message: 'Campo requerido' },
        ({ getFieldValue }) => ({
          validator: (_, value) =>
            !value || value === getFieldValue('newPassword')
              ? Promise.resolve()
              : Promise.reject(new Error('Las contraseñas no coinciden')),
        }),
      ]}
    >
      <Input.Password autoComplete="new-password" />
    </Form.Item>
  </Form>
);

ChangePasswordForm.propTypes = {
  formRef: PropTypes.object,
  onSubmit: PropTypes.func,
};
