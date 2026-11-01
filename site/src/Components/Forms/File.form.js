import React from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Form, Input, Row, Select, Upload } from 'antd';
import { useFetchClients } from '../../Hooks/Client.hook';
import { UploadOutlined } from '@ant-design/icons';
export const FileForm = ({ formRef, onSubmit }) => {
  const [clients, loading] = useFetchClients();
  const normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  const dummyRequest = ({ onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };
  return (
    <Form form={formRef} layout="vertical" name="FileForm" onFinish={onSubmit}>
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
      </Row>

      <Row gutter={[12, 12]}>
        <Col span={24}>
          <Form.Item label="Tipo de Acceso" name="type">
            <Select placeholder="Selecciona un tipo">
              <Select.Option value={0}>FIEL</Select.Option>
              <Select.Option value={1}>CSD</Select.Option>
              <Select.Option value={2}>IDSE</Select.Option>
              <Select.Option value={3}>Documentos PDF</Select.Option>
              <Select.Option value={4}>OTROS</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label="Documento"
            name="file"
            getValueFromEvent={normFile}
            noStyle
            valuePropName="fileList"
          >
            <Upload customRequest={dummyRequest} maxCount={1}>
              <Button icon={<UploadOutlined />}>Click para Subir</Button>
            </Upload>
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            label="Descripcion del Archivo"
            name="description"
            rules={[{ required: false }]}
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

FileForm.propTypes = {
  formRef: PropTypes.object,
  onSubmit: PropTypes.func,
  oClient: PropTypes.object,
};
