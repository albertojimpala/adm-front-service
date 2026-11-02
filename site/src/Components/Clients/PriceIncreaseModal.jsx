import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Modal, Result, Table, Tabs } from 'antd';
import { SAVE, process } from '../../Service/Api';
import { showError } from '../../Utils/errors';
import { formatMoney } from '../../Utils/format';
import { PriceIncreaseForm, priceIncreaseToPayload } from '../Forms';

const withKeys = (aRows = []) =>
  aRows.map((oRow, nIndex) => ({ ...oRow, key: nIndex }));

// incremento anual masivo de precios
export const PriceIncreaseModal = ({ open, onClose, onSaved }) => {
  const [formRef] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);

  const close = () => {
    setResult(null);
    onClose();
  };

  const _handleSubmit = async values => {
    setSaving(true);
    const response = await process(
      SAVE,
      'clients/price-increase',
      priceIncreaseToPayload(values),
    );
    setSaving(false);
    if (response?.ok) {
      setResult(response.data);
      onSaved?.();
    } else {
      showError(response, 'Error al aplicar el incremento');
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
                Aplicar incremento
              </Button>,
            ]
      }
      onCancel={close}
      open={open}
      title="Incremento anual de precios"
      width={760}
    >
      {result ? (
        <>
          <Result
            status="success"
            subTitle={`${result.updatedCount} precios actualizados, ${result.skippedCount} sin cambios`}
            title={`Precios ${result.year} aplicados`}
          />
          <Tabs
            items={[
              {
                key: 'updated',
                label: `Actualizados (${result.updatedCount})`,
                children: (
                  <Table
                    columns={[
                      { dataIndex: 'clientName', title: 'Cliente' },
                      { dataIndex: 'service', title: 'Servicio' },
                      {
                        dataIndex: 'previousPrice',
                        title: 'Anterior',
                        align: 'right',
                        render: formatMoney,
                      },
                      {
                        dataIndex: 'newPrice',
                        title: 'Nuevo',
                        align: 'right',
                        render: formatMoney,
                      },
                    ]}
                    dataSource={withKeys(result.updated)}
                    pagination={{ pageSize: 8 }}
                    rowKey="key"
                    size="small"
                  />
                ),
              },
              {
                key: 'skipped',
                label: `Sin cambios (${result.skippedCount})`,
                children: (
                  <Table
                    columns={[
                      { dataIndex: 'clientName', title: 'Cliente' },
                      { dataIndex: 'service', title: 'Servicio' },
                      { dataIndex: 'reason', title: 'Motivo' },
                    ]}
                    dataSource={withKeys(result.skipped)}
                    pagination={{ pageSize: 8 }}
                    rowKey="key"
                    size="small"
                  />
                ),
              },
            ]}
          />
        </>
      ) : (
        <PriceIncreaseForm formRef={formRef} onSubmit={_handleSubmit} />
      )}
    </Modal>
  );
};

PriceIncreaseModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSaved: PropTypes.func,
};
