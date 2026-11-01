import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Col, Form, Input, Row, Select } from 'antd';
import { useFetchClients } from '../../Hooks/Client.hook';

export const AccessForm = ({ formRef, onSubmit }) => {
  const [clients, loading] = useFetchClients();
  const [sType, setType] = useState('');

  function selectType(e) {
    console.log(formRef);
    setType(e);
  }

  return (
    <Form
      form={formRef}
      layout="vertical"
      name="AccessForm"
      onFinish={onSubmit}
    >
      <Row gutter={[12, 12]}>
        <Col span={24}>
          <Form.Item label="Cliente" name="client_id">
            <Select loading={loading} placeholder="Selecciona un cliente">
              {clients?.data.map(oClient => (
                <Select.Option key={oClient.id} value={oClient.id}>
                  {oClient.trade_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Tipo de Acceso" name="type">
            <Select placeholder="Selecciona un tipo" onChange={selectType}>
              <Select.Option value={0}>FIEL</Select.Option>
              <Select.Option value={1}>IDSE</Select.Option>
              <Select.Option value={2}>Escritorio Virtual IMSS</Select.Option>
              <Select.Option value={3}>REPSE</Select.Option>
              <Select.Option value={4}>INFONAVIT</Select.Option>
              <Select.Option value={5}>CSD</Select.Option>
              <Select.Option value={6}>Facturacion</Select.Option>
              <Select.Option value={7}>Otro</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        {sType === 7 ? (
          <Col span={12}>
            <Form.Item
              label="Descripcion"
              name="description"
              rules={[{ required: sType === 7 ? true : false }]}
            >
              <Input type="text" />
            </Form.Item>
          </Col>
        ) : (
          <></>
        )}
      </Row>

      <Row gutter={[12, 12]}>
        <Col span={12}>
          <Form.Item label="Usuario" name="access" rules={[{ required: true }]}>
            <Input type="text" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Contrasena"
            name="password"
            rules={[{ required: true }]}
          >
            <Input type="text" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Estatus" name="status">
            <Select placeholder="Selecciona un estatus">
              <Select.Option value={0}>Inactivo</Select.Option>
              <Select.Option value={1}>Activo</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

AccessForm.propTypes = {
  formRef: PropTypes.object,
  onSubmit: PropTypes.func,
  oClient: PropTypes.object,
};
