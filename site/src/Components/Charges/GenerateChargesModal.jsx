import { useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, Form, Modal, Result, Table } from 'antd';
import { SAVE, process } from '../../Service/Api';
import { showError } from '../../Utils/errors';
import { formatMoney, formatPeriod } from '../../Utils/format';
import { GenerateChargesForm } from '../Forms';

export const GenerateChargesModal = ({ open, onClose, onSaved }) => {
  const [formRef] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);

  const close = () => {
    setResult(null);
    onClose();
  };

  const _handleSubmit = async ({ period, clientId }) => {
    setSaving(true);
    const response = await process(SAVE, 'charges/generate', {
      period: period.format('YYYY-MM'),
      ...(clientId ? { clientId } : {}),
    });
    setSaving(false);
    if (response?.ok) {
      setResult(response.data);
      onSaved?.();
    } else {
      showError(response, 'Error al generar los cargos');
    }
  };

  return (
    <Modal
      centered
      destroyOnHidden
      footer={
        result
          ? [
              <Button key="close" onClick={close} type="primary">
                Cerrar
              </Button>,
            ]
          : [
              <Button key="cancel" onClick={close}>
                Cancelar
              </Button>,
              <Button
                key="ok"
                loading={saving}
                onClick={() => formRef.submit()}
                type="primary"
              >
                Generar
              </Button>,
            ]
      }
      onCancel={close}
      open={open}
      title="Generar cargos mensuales"
      width={680}
    >
      {result ? (
        <>
          <Result
            status={result.generatedCount ? 'success' : 'info'}
            subTitle={`Total facturado: ${formatMoney(result.totalAmount)}`}
            title={`${result.generatedCount} cargos generados para ${formatPeriod(result.period)}`}
          />
          {result.skipped.length > 0 && (
            <Table
              columns={[
                { dataIndex: 'name', title: 'Cliente omitido' },
                { dataIndex: 'reason', title: 'Motivo' },
              ]}
              dataSource={result.skipped}
              pagination={{ pageSize: 6 }}
              rowKey="clientId"
              scroll={{ x: 'max-content' }}
              size="small"
            />
          )}
        </>
      ) : (
        <>
          <Alert
            showIcon
            style={{ marginBottom: 16 }}
            title="Se calcula la mensualidad de cada cliente con los precios del año del periodo. Los clientes que ya tienen cargo en ese periodo se omiten."
            type="info"
          />
          <GenerateChargesForm formRef={formRef} onSubmit={_handleSubmit} />
        </>
      )}
    </Modal>
  );
};

GenerateChargesModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSaved: PropTypes.func,
};
