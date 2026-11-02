import PropTypes from 'prop-types';
import { Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { STATUS_OPTIONS } from '../../Utils/constants';
import { moneyInputProps } from '../../Utils/format';

export const ServiceForm = ({ formRef, onSubmit, initialValues, isEdit }) => (
  <Form
    form={formRef}
    initialValues={initialValues}
    layout="vertical"
    name="ServiceForm"
    onFinish={onSubmit}
  >
    <Row gutter={[12, 0]}>
      <Col span={8}>
        <Form.Item
          label="Código"
          name="code"
          rules={[{ required: true, message: 'Campo requerido' }, { max: 20 }]}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col span={16}>
        <Form.Item
          label="Descripción"
          name="description"
          rules={[{ required: true, message: 'Campo requerido' }, { max: 250 }]}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          extra="Precio de catálogo. Cada cliente puede tener su propio precio por año."
          label="Precio mensual"
          name="price"
          rules={[{ required: true, message: 'Campo requerido' }]}
        >
          <InputNumber {...moneyInputProps} />
        </Form.Item>
      </Col>
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

ServiceForm.propTypes = {
  formRef: PropTypes.object,
  onSubmit: PropTypes.func,
  initialValues: PropTypes.object,
  isEdit: PropTypes.bool,
};
