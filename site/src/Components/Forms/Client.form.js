import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Col, Divider, Form, Input, Row, Select } from 'antd';
import { useFetchRegimes } from '../../Hooks/Regime.hook';

export const ClientForm = ({ formRef, onSubmit, oClient }) => {
  const [regimes, loading] = useFetchRegimes();
  const [sType, setType] = useState('');

  useEffect(() => {
    if (oClient.person_type) {
      setType(oClient.person_type);
    }
  }, [oClient]);

  function selectPersonType(e) {
    console.log(formRef);
    setType(e);
  }

  return (
    <Form
      form={formRef}
      layout="vertical"
      name="ClientForm"
      onFinish={onSubmit}
    >
      <Row gutter={[12, 12]}>
        <Col span={12}>
          <Form.Item
            label="RFC"
            name="rfc"
            rules={[{ required: true, message: 'Campo requerido' }]}
          >
            <Input type="text" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Tipo de Persona" name="person_type">
            <Select
              placeholder="Selecciona un tipo de persona"
              onChange={selectPersonType}
            >
              <Select.Option value={'F'}>Fisica</Select.Option>
              <Select.Option value={'M'}>Moral</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      {sType === 'F' ? (
        <Row gutter={[12, 12]}>
          <Col span={12}>
            <Form.Item
              label="Nombre(s)"
              name="name"
              rules={[{ required: false }]}
            >
              <Input type="text" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Apellido Paterno"
              name="last_name"
              rules={[{ required: false }]}
            >
              <Input type="text" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Apellido Materno"
              name="mother_name"
              rules={[{ required: false }]}
            >
              <Input type="text" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="CURP" name="curp" rules={[{ required: false }]}>
              <Input type="text" />
            </Form.Item>
          </Col>
        </Row>
      ) : (
        <Row gutter={[12, 12]}>
          <Col span={24}>
            <Form.Item
              label="Razon Social"
              name="trade_name"
              rules={[{ required: false }]}
            >
              <Input type="text" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Razon Social Facturacion"
              name="invoice_name"
              rules={[{ required: false }]}
            >
              <Input type="text" />
            </Form.Item>
          </Col>
        </Row>
      )}

      <Row gutter={[12, 12]}>
        <Col span={12}>
          <Form.Item
            label="Registro Patronal"
            name="regpat"
            rules={[{ required: false }]}
          >
            <Input type="text" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Contraseña CIEC"
            name="ciec"
            rules={[{ required: true }]}
          >
            <Input type="text" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Nombre de la Base de Datos"
            name="db_name"
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
        <Col span={24}>
          <Form.Item label="Regimen Fiscal" name="regimen_id">
            <Select loading={loading} placeholder="Selecciona un Regimen">
              {regimes?.data.map(oRol => (
                <Select.Option key={oRol.code} value={oRol.code}>
                  {oRol.description}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Divider>Datos de Contacto</Divider>
      <Row gutter={[12, 12]}>
        <Col span={12}>
          <Form.Item
            label="Telefono Fijo o Principal"
            name="phone"
            rules={[{ required: true, message: 'Campo requerido' }]}
          >
            <Input type="text" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Telefono Celular o Secundario"
            name="movil"
            rules={[{ required: true, message: 'Campo requerido' }]}
          >
            <Input type="text" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Correo Electronico"
            name="email"
            rules={[{ required: true, message: 'Campo requerido' }]}
          >
            <Input type="text" />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

ClientForm.propTypes = {
  formRef: PropTypes.object,
  onSubmit: PropTypes.func,
  oClient: PropTypes.object,
};
