import { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Modal } from 'antd';
import { UPDATE, process } from '../../Service/Api';
import { feedback } from '../../Utils/feedback';
import { showError } from '../../Utils/errors';

// lo unico que el cliente puede modificar: email y telefono
export const ContactModal = ({ client, onClose, onSaved }) => {
  const [formRef] = Form.useForm();
  const [saving, setSaving] = useState(false);

  const _handleSubmit = async ({ email, phone }) => {
    setSaving(true);
    const response = await process(UPDATE, 'portal/me', {
      ...(email ? { email } : {}),
      ...(phone ? { phone } : {}),
    });
    setSaving(false);
    if (response?.ok) {
      feedback.message.success('Datos de contacto actualizados');
      onClose();
      onSaved?.();
    } else {
      showError(response, 'Error al actualizar los datos');
    }
  };

  return (
    <Modal
      cancelText="Cancelar"
      centered
      destroyOnHidden
      okButtonProps={{ loading: saving }}
      okText="Guardar"
      onCancel={onClose}
      onOk={() => formRef.submit()}
      open={Boolean(client)}
      title="Datos de contacto"
    >
      <Form
        form={formRef}
        initialValues={{ email: client?.email, phone: client?.phone }}
        layout="vertical"
        onFinish={_handleSubmit}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ type: 'email', message: 'Email no válido' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Teléfono" name="phone" rules={[{ max: 20 }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

ContactModal.propTypes = {
  client: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSaved: PropTypes.func,
};
