import React from 'react';
import PropTypes from 'prop-types';
import { Col, Form, Input, Row, Select } from 'antd';
import { useFetchClients } from '../../Hooks/Client.hook';

export const AccountForm = ({ formRef, onSubmit }) => {
  const [clients, loading] = useFetchClients();

  return (
    <Form
      form={formRef}
      layout="vertical"
      name="AccountForm"
      onFinish={onSubmit}
    >
      <>
        <Row gutter={[24]}>
          <Col span={24}>
            <Form.Item label="Cliente" name="client_id">
              <Select loading={loading} placeholder="Selecciona un cliente">
                {clients?.data.map(oCliente => (
                  <Select.Option key={oCliente.id} value={oCliente.id}>
                    {oCliente.trade_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Descripcion"
              name="description"
              rules={[{ required: true, message: 'Campo requerido' }]}
            >
              <Input
                type="text"
                placeholder="Ingresa Nombre o Descripcion de la Cuenta"
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Cuenta"
              name="account"
              rules={[{ required: true, message: 'Campo requerido' }]}
            >
              <Input
                type="text"
                placeholder="Ingresa Numero de cuenta sin '-'"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[12, 12]}>
          <Col span={12}>
            <Form.Item
              label="Nivel de Cuenta"
              name="major"
              rules={[{ required: true, message: 'Campo requerido' }]}
            >
              <Select placeholder="Nivel de la Cuenta">
                <Select.Option value={1}>Primer- Mayor</Select.Option>
                <Select.Option value={2}>Segundo</Select.Option>
                <Select.Option value={3}>Tercero</Select.Option>
                <Select.Option value={4}>Cuarto</Select.Option>
                <Select.Option value={5}>Quinto</Select.Option>
                <Select.Option value={6}>Sexto</Select.Option>
                <Select.Option value={7}>Septimo</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Codigo SAT"
              name="sat_code"
              rules={[{ required: true, message: 'Campo requerido' }]}
            >
              <Input type="text" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[12, 12]}>
          <Col span={12}>
            <Form.Item
              label="Afectable"
              name="type"
              rules={[{ required: true, message: 'Campo requerido' }]}
            >
              <Select placeholder="Afectable">
                <Select.Option value={0}>No</Select.Option>
                <Select.Option value={1}>Si</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Tipo de Cuenta"
              name="type_c"
              rules={[{ required: true, message: 'Campo requerido', max: 1 }]}
            >
              <Input type="text" placeholder="Ingresa Tipo de Cuenta" />
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
      </>
    </Form>
  );
};

AccountForm.propTypes = {
  formRef: PropTypes.object,
  onSubmit: PropTypes.func,
  updating: PropTypes.bool,
};
