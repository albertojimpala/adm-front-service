import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Tooltip } from 'antd';
import { FilePdfOutlined } from '@ant-design/icons';
import { openPdf } from '../../Service/Api';
import { showError } from '../../Utils/errors';

// abre el recibo de pago en PDF; en el portal usa la ruta del cliente
export const ReceiptButton = ({ payment, portal = false, label, ...props }) => {
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    setLoading(true);
    const response = await openPdf(
      `${portal ? 'portal/' : ''}payments/${payment.id}/receipt`,
      `recibo-${payment.receiptNumber || payment.id}.pdf`,
    );
    setLoading(false);
    if (!response?.ok) {
      showError(response, 'No se pudo generar el recibo');
    }
  };

  const oButton = (
    <Button
      icon={<FilePdfOutlined />}
      loading={loading}
      onClick={onClick}
      {...props}
    >
      {label}
    </Button>
  );

  return label ? oButton : <Tooltip title="Recibo PDF">{oButton}</Tooltip>;
};

ReceiptButton.propTypes = {
  payment: PropTypes.object.isRequired,
  portal: PropTypes.bool,
  label: PropTypes.node,
};
