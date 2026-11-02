import PropTypes from 'prop-types';
import { Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { STATUS_OPTIONS } from '../../Utils/constants';
import { moneyInputProps } from '../../Utils/format';

export const SubscriptionTypeForm = ({
  formRef,
  onSubmit,
  initialValues,
  isEdit,
}) => (
  <Form
    form={formRef}
    initialValues={initialValues || { basePrice: 0, discountPercent: 0 }}
    layout="vertical"
    name="SubscriptionTypeForm"
    onFinish={onSubmit}
  >
    <Row gutter={[12, 0]}>
      <Col xs={24} sm={8}>
        <Form.Item
          label="Código"
          name="code"
          rules={[{ required: true, message: 'Campo requerido' }, { max: 20 }]}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col xs={24} sm={16}>
        <Form.Item
          label="Descripción"
          name="description"
          rules={[{ required: true, message: 'Campo requerido' }, { max: 100 }]}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col xs={24} sm={12}>
        <Form.Item
          extra="Cuota fija mensual"
          label="Cuota base"
          name="basePrice"
        >
          <InputNumber {...moneyInputProps} />
        </Form.Item>
      </Col>
      <Col xs={24} sm={12}>
        <Form.Item
          extra="Se aplica sobre el total de servicios"
          label="Descuento"
          name="discountPercent"
        >
          <InputNumber
            max={100}
            min={0}
            precision={2}
            style={{ width: '100%' }}
            suffix="%"
          />
        </Form.Item>
      </Col>
      {isEdit && (
        <Col xs={24} sm={12}>
          <Form.Item label="Estatus" name="status">
            <Select options={STATUS_OPTIONS} />
          </Form.Item>
        </Col>
      )}
    </Row>
  </Form>
);

SubscriptionTypeForm.propTypes = {
  formRef: PropTypes.object,
  onSubmit: PropTypes.func,
  initialValues: PropTypes.object,
  isEdit: PropTypes.bool,
};
