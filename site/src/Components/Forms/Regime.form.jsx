import PropTypes from 'prop-types';
import { Col, Form, Input, Row, Select } from 'antd';
import { STATUS_OPTIONS } from '../../Utils/constants';

export const RegimeForm = ({ formRef, onSubmit, initialValues }) => (
  <Form
    form={formRef}
    initialValues={initialValues || { status: 1 }}
    layout="vertical"
    name="RegimeForm"
    onFinish={onSubmit}
  >
    <Row gutter={[12, 0]}>
      <Col xs={24} sm={8}>
        <Form.Item
          label="Clave"
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
        <Form.Item label="Estatus" name="status" rules={[{ required: true }]}>
          <Select options={STATUS_OPTIONS} />
        </Form.Item>
      </Col>
    </Row>
  </Form>
);

RegimeForm.propTypes = {
  formRef: PropTypes.object,
  onSubmit: PropTypes.func,
  initialValues: PropTypes.object,
};
