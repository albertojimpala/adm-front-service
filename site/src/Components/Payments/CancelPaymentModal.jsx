import { useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Form, Input, Modal } from 'antd';
import { SAVE, process } from '../../Service/Api';
import { feedback } from '../../Utils/feedback';
import { showError } from '../../Utils/errors';
import { formatMoney } from '../../Utils/format';

// cancela un pago: regresa el saldo al cargo y saca el dinero de la cuenta
export const CancelPaymentModal = ({ payment, onClose, onSaved }) => {
  const [formRef] = Form.useForm();
  const [saving, setSaving] = useState(false);

  const _handleSubmit = async ({ reason }) => {
    setSaving(true);
    const response = await process(SAVE, `payments/${payment.id}/cancel`, {
      reason,
    });
    setSaving(false);
    if (response?.ok) {
      feedback.message.success('Pago cancelado');
      onClose();
      onSaved?.();
    } else {
      showError(response, 'Error al cancelar el pago');
    }
  };

  return (
    <Modal
      cancelText="Cerrar"
      centered
      destroyOnHidden
      okButtonProps={{ danger: true, loading: saving }}
      okText="Cancelar pago"
      onCancel={onClose}
      onOk={() => formRef.submit()}
      open={Boolean(payment)}
      title="Cancelar pago"
    >
      {payment && (
        <Alert
          showIcon
          style={{ marginBottom: 16 }}
          title={`Se regresarán ${formatMoney(payment.amount)} al saldo del cargo y se registrará una salida en ${payment.account?.name}.`}
          type="warning"
        />
      )}
      <Form form={formRef} layout="vertical" onFinish={_handleSubmit}>
        <Form.Item
          label="Motivo"
          name="reason"
          rules={[{ required: true, message: 'Campo requerido' }, { max: 250 }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

CancelPaymentModal.propTypes = {
  payment: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSaved: PropTypes.func,
};
