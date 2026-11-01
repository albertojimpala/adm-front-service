import React from 'react';
import PropTypes from 'prop-types';
import { Col, Form, Input, Row, Select } from 'antd';
import { useFetchRoles } from '../../Hooks/Role.hook';

export const UserForm = ({ formRef, onSubmit }) => {
  const [roles, loading] = useFetchRoles();

  return (
    <Form form={formRef} layout="vertical" name="UserForm" onFinish={onSubmit}>
      <Row gutter={[12, 12]}>
        <Col span={12}>
          <Form.Item
            label="Usuario"
            name="username"
            rules={[{ required: true, message: 'Campo requerido' }]}
          >
            <Input type="text" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Campo requerido' }]}
          >
            <Input type="email" />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item
            label="Nombre"
            name="full_name"
            rules={[{ required: true, message: 'Campo requerido' }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[12, 12]}>
        <Col span={12}>
          <Form.Item label="Contraseña" name="password">
            <Input type="password" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Repetir contraseña" name="rpassword">
            <Input type="password" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[12, 12]}>
        <Col span={12}>
          <Form.Item label="Estatus" name="status">
            <Select>
              <Select.Option value={0}>Inactivo</Select.Option>
              <Select.Option value={1}>Activo</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Rol" name="rol_id">
            <Select loading={loading}>
              {roles?.data.map(oRol => (
                <Select.Option key={oRol.id} value={oRol.id}>
                  {oRol.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

UserForm.propTypes = {
  formRef: PropTypes.object,
  onSubmit: PropTypes.func,
};
