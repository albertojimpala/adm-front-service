import React from 'react';
import PropTypes from 'prop-types';
import { Col, Form, Input, Row, Select } from 'antd';

export const RegimeForm = ({ formRef, onSubmit }) => {
  return (
    <Form
      form={formRef}
      layout="vertical"
      name="RegimeForm"
      onFinish={onSubmit}
    >
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={12}>
          <Form.Item label="Descripcion" name="description">
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Codigo" name="code">
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Nivel" name="type">
            <Select>
              <Select.Option value={0}>Fisicas</Select.Option>
              <Select.Option value={1}>Morales</Select.Option>
              <Select.Option value={2}>Ambos</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Estatus" name="status">
            <Select>
              <Select.Option value={0}>Inactivo</Select.Option>
              <Select.Option value={1}>Activo</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

RegimeForm.propTypes = {
  formRef: PropTypes.object,
  onSubmit: PropTypes.func,
};
