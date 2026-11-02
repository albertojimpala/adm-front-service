import { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
} from 'antd';
import dayjs from 'dayjs';
import { useFetchOne } from '../../Hooks';
import { PAYMENT_METHODS, toOptions } from '../../Utils/constants';
import { formatMoney, formatPeriod, moneyInputProps } from '../../Utils/format';
import { AccountSelect, ClientSelect } from '../Atoms/RemoteSelect';

const chargeBalance = oCharge =>
  Math.round((oCharge.total - oCharge.paidAmount) * 100) / 100;

export const PaymentForm = ({ formRef, onSubmit, charge }) => {
  const sClientId = Form.useWatch('clientId', formRef);
  const sChargeId = Form.useWatch('chargeId', formRef);

  // cargos con saldo del cliente seleccionado
  const [chargesData, loadingCharges] = useFetchOne(
    'charges',
    undefined,
    {
      clientId: sClientId,
      status: 1,
      limit: 100,
      sort: 'dueDate',
      order: 'ASC',
    },
    Boolean(sClientId) && !charge,
  );

  const aCharges = useMemo(
    () =>
      charge
        ? [charge]
        : (chargesData?.data || []).filter(
            oCharge => oCharge.paymentStatus !== 'paid',
          ),
    [charge, chargesData],
  );
  const oSelectedCharge = aCharges.find(oCharge => oCharge.id === sChargeId);
  const nBalance = oSelectedCharge ? chargeBalance(oSelectedCharge) : undefined;

  return (
    <Form
      form={formRef}
      initialValues={{
        clientId: charge?.clientId,
        chargeId: charge?.id,
        amount: charge ? chargeBalance(charge) : undefined,
        method: 'transfer',
        paymentDate: dayjs(),
      }}
      layout="vertical"
      name="PaymentForm"
      onFinish={onSubmit}
    >
      <Row gutter={[12, 0]}>
        {charge ? (
          <Col span={24}>
            <Alert
              showIcon
              style={{ marginBottom: 16 }}
              title={`${charge.client?.name || ''} · ${formatPeriod(charge.period)} · saldo ${formatMoney(
                chargeBalance(charge),
              )}`}
              type="info"
            />
            <Form.Item hidden name="chargeId">
              <Input />
            </Form.Item>
          </Col>
        ) : (
          <>
            <Col span={12}>
              <Form.Item
                label="Cliente"
                name="clientId"
                rules={[{ required: true, message: 'Campo requerido' }]}
              >
                <ClientSelect
                  onChange={() =>
                    formRef.setFieldsValue({
                      chargeId: undefined,
                      amount: undefined,
                    })
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Cargo"
                name="chargeId"
                rules={[{ required: true, message: 'Campo requerido' }]}
              >
                <Select
                  disabled={!sClientId}
                  loading={loadingCharges}
                  notFoundContent="El cliente no tiene cargos pendientes"
                  onChange={sId => {
                    const oCharge = aCharges.find(o => o.id === sId);
                    formRef.setFieldsValue({
                      amount: oCharge ? chargeBalance(oCharge) : undefined,
                    });
                  }}
                  options={aCharges.map(oCharge => ({
                    value: oCharge.id,
                    label: `${formatPeriod(oCharge.period)} · saldo ${formatMoney(chargeBalance(oCharge))}`,
                  }))}
                  placeholder="Selecciona el cargo"
                />
              </Form.Item>
            </Col>
          </>
        )}
        <Col span={12}>
          <Form.Item
            extra={
              nBalance !== undefined
                ? `Saldo del cargo: ${formatMoney(nBalance)}`
                : undefined
            }
            label="Monto"
            name="amount"
            rules={[
              { required: true, message: 'Campo requerido' },
              {
                validator: (_, value) =>
                  nBalance !== undefined && value > nBalance
                    ? Promise.reject(
                        new Error('El monto excede el saldo del cargo'),
                      )
                    : Promise.resolve(),
              },
            ]}
          >
            <InputNumber {...moneyInputProps} min={0.01} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Fecha de pago"
            name="paymentDate"
            rules={[{ required: true, message: 'Campo requerido' }]}
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Forma de pago"
            name="method"
            rules={[{ required: true, message: 'Campo requerido' }]}
          >
            <Select options={toOptions(PAYMENT_METHODS)} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            extra="Banco o caja chica donde entra el dinero"
            label="Cuenta destino"
            name="accountId"
            rules={[{ required: true, message: 'Campo requerido' }]}
          >
            <AccountSelect />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Referencia" name="reference" rules={[{ max: 100 }]}>
            <Input placeholder="Folio SPEI, autorización, etc." />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Notas" name="notes">
            <Input />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

PaymentForm.propTypes = {
  formRef: PropTypes.object,
  onSubmit: PropTypes.func,
  charge: PropTypes.object,
};

export const paymentToPayload = ({
  chargeId,
  accountId,
  amount,
  method,
  paymentDate,
  reference,
  notes,
}) => ({
  chargeId,
  accountId,
  amount,
  method,
  paymentDate: paymentDate?.format('YYYY-MM-DD'),
  ...(reference ? { reference } : {}),
  ...(notes ? { notes } : {}),
});
