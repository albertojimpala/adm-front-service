import PropTypes from 'prop-types';
import { Col, DatePicker, Form, Input, InputNumber, Row, Select } from 'antd';
import dayjs from 'dayjs';
import {
  ACCOUNT_TYPES,
  MOVEMENT_CATEGORIES,
  MOVEMENT_TYPES,
  STATUS_OPTIONS,
  toOptions,
} from '../../Utils/constants';
import { moneyInputProps } from '../../Utils/format';
import { AccountSelect } from '../Atoms/RemoteSelect';

export const AccountForm = ({ formRef, onSubmit, initialValues, isEdit }) => {
  const sType = Form.useWatch('type', formRef) || initialValues?.type;

  return (
    <Form
      form={formRef}
      initialValues={initialValues || { type: 'bank', initialBalance: 0 }}
      layout="vertical"
      name="AccountForm"
      onFinish={onSubmit}
    >
      <Row gutter={[12, 0]}>
        <Col span={14}>
          <Form.Item
            label="Nombre"
            name="name"
            rules={[
              { required: true, message: 'Campo requerido' },
              { max: 100 },
            ]}
          >
            <Input placeholder="Ej. BBVA empresarial" />
          </Form.Item>
        </Col>
        <Col span={10}>
          <Form.Item label="Tipo" name="type" rules={[{ required: true }]}>
            <Select disabled={isEdit} options={toOptions(ACCOUNT_TYPES)} />
          </Form.Item>
        </Col>
        {sType === 'bank' && (
          <>
            <Col span={12}>
              <Form.Item label="Banco" name="bankName" rules={[{ max: 100 }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Número de cuenta"
                name="accountNumber"
                rules={[{ max: 30 }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="CLABE"
                name="clabe"
                rules={[{ len: 18, message: 'La CLABE tiene 18 dígitos' }]}
              >
                <Input maxLength={18} />
              </Form.Item>
            </Col>
          </>
        )}
        {!isEdit && (
          <Col span={12}>
            <Form.Item
              extra="Se registra como movimiento de ajuste"
              label="Saldo inicial"
              name="initialBalance"
            >
              <InputNumber {...moneyInputProps} />
            </Form.Item>
          </Col>
        )}
        {isEdit && (
          <Col span={12}>
            <Form.Item label="Estatus" name="status">
              <Select options={STATUS_OPTIONS} />
            </Form.Item>
          </Col>
        )}
      </Row>
    </Form>
  );
};

AccountForm.propTypes = {
  formRef: PropTypes.object,
  onSubmit: PropTypes.func,
  initialValues: PropTypes.object,
  isEdit: PropTypes.bool,
};

export const accountToPayload = (values, selected) => {
  const { name, type, bankName, accountNumber, clabe, initialBalance, status } =
    values;
  const oBank =
    type === 'bank' || selected?.type === 'bank'
      ? { bankName, accountNumber, clabe }
      : {};
  const oPayload = { name, ...oBank };
  Object.keys(oPayload).forEach(sKey => {
    if (oPayload[sKey] === '' || oPayload[sKey] === undefined) {
      delete oPayload[sKey];
    }
  });
  return selected
    ? { ...oPayload, status }
    : { ...oPayload, type, initialBalance: initialBalance || 0 };
};

// movimiento manual: gastos de caja chica, otros ingresos o ajustes
export const MovementForm = ({ formRef, onSubmit }) => (
  <Form
    form={formRef}
    initialValues={{ type: 'out', category: 'expense', movementDate: dayjs() }}
    layout="vertical"
    name="MovementForm"
    onFinish={onSubmit}
  >
    <Row gutter={[12, 0]}>
      <Col span={12}>
        <Form.Item label="Tipo" name="type" rules={[{ required: true }]}>
          <Select options={toOptions(MOVEMENT_TYPES)} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Categoría"
          name="category"
          rules={[{ required: true }]}
        >
          <Select
            options={['expense', 'income', 'adjustment'].map(value => ({
              value,
              label: MOVEMENT_CATEGORIES[value],
            }))}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Monto"
          name="amount"
          rules={[{ required: true, message: 'Campo requerido' }]}
        >
          <InputNumber {...moneyInputProps} min={0.01} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Fecha"
          name="movementDate"
          rules={[{ required: true, message: 'Campo requerido' }]}
        >
          <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item
          label="Concepto"
          name="concept"
          rules={[{ required: true, message: 'Campo requerido' }, { max: 250 }]}
        >
          <Input placeholder="Ej. papelería" />
        </Form.Item>
      </Col>
    </Row>
  </Form>
);

MovementForm.propTypes = {
  formRef: PropTypes.object,
  onSubmit: PropTypes.func,
};

// traspaso entre cuentas, ej. depositar la caja chica al banco
export const TransferForm = ({ formRef, onSubmit }) => (
  <Form
    form={formRef}
    initialValues={{ movementDate: dayjs() }}
    layout="vertical"
    name="TransferForm"
    onFinish={onSubmit}
  >
    <Row gutter={[12, 0]}>
      <Col span={12}>
        <Form.Item
          label="De la cuenta"
          name="fromAccountId"
          rules={[{ required: true, message: 'Campo requerido' }]}
        >
          <AccountSelect />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          dependencies={['fromAccountId']}
          label="A la cuenta"
          name="toAccountId"
          rules={[
            { required: true, message: 'Campo requerido' },
            ({ getFieldValue }) => ({
              validator: (_, value) =>
                value && value === getFieldValue('fromAccountId')
                  ? Promise.reject(new Error('Debe ser otra cuenta'))
                  : Promise.resolve(),
            }),
          ]}
        >
          <AccountSelect />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Monto"
          name="amount"
          rules={[{ required: true, message: 'Campo requerido' }]}
        >
          <InputNumber {...moneyInputProps} min={0.01} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Fecha"
          name="movementDate"
          rules={[{ required: true, message: 'Campo requerido' }]}
        >
          <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item label="Concepto" name="concept" rules={[{ max: 250 }]}>
          <Input placeholder="Ej. Depósito de caja chica al banco" />
        </Form.Item>
      </Col>
    </Row>
  </Form>
);

TransferForm.propTypes = {
  formRef: PropTypes.object,
  onSubmit: PropTypes.func,
};
