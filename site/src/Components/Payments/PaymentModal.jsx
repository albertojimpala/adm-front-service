import { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Modal } from 'antd';
import { SAVE, process } from '../../Service/Api';
import { feedback } from '../../Utils/feedback';
import { showError } from '../../Utils/errors';
import { PaymentForm, paymentToPayload } from '../Forms';
import { ReceiptButton } from '../Atoms/ReceiptButton';

// registra un pago; si recibe charge el cargo ya viene seleccionado
export const PaymentModal = ({ open, onClose, onSaved, charge }) => {
  const [formRef] = Form.useForm();
  const [saving, setSaving] = useState(false);

  const _handleSubmit = async values => {
    setSaving(true);
    const response = await process(SAVE, 'payments', paymentToPayload(values));
    setSaving(false);
    if (response?.ok) {
      feedback.notification.success({
        title: 'Pago registrado',
        description: response.data.receiptNumber
          ? `Folio ${response.data.receiptNumber}`
          : undefined,
        actions: <ReceiptButton label="Ver recibo" payment={response.data} />,
      });
      onClose();
      onSaved?.(response.data);
    } else {
      showError(response, 'Error al registrar el pago');
    }
  };

  return (
    <Modal
      cancelText="Cancelar"
      centered
      destroyOnHidden
      okButtonProps={{ loading: saving }}
      okText="Registrar pago"
      onCancel={onClose}
      onOk={() => formRef.submit()}
      open={open}
      title="Registrar pago"
      width={680}
    >
      <PaymentForm charge={charge} formRef={formRef} onSubmit={_handleSubmit} />
    </Modal>
  );
};

PaymentModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSaved: PropTypes.func,
  charge: PropTypes.object,
};
