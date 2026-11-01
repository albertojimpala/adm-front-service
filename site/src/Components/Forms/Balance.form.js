import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { SearchSelector } from '../Atoms/SearchSelector';
import { generateQueries } from '../../Utils/query';
import { Col, Form, Input, Row, Select, Switch, Button, Upload } from 'antd';
import { useFetchClients } from '../../Hooks/Client.hook';
import { useFetchAccounts } from '../../Hooks/Account.hook';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { UploadOutlined } from '@ant-design/icons';

const aClientSearch = [
  {
    name: 'name',
    type: 'input',
  },
  {
    name: 'status',
    type: 'select',
  },
];

export const BalanceForm = ({ formRef, onSubmit, updating }) => {
  const [clients, loading, clientsQuery] = useFetchClients();
  const [accounts, accountsLoading, accountsQuery] =
    useFetchAccounts('status=1');
  const [oClient, setClient] = useState('');
  const [oMasivo, setMasivo] = useState(false);
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
  useEffect(() => {
    if (oClient) {
      accountsQuery(`client_id=${oClient}`, 0, 50);
    }
  }, [oClient]);

  const handleSearchClient = s => {
    if (s.length > 3) {
      let sQueries = generateQueries(
        { trade_name: s, status: 1 },
        aClientSearch
      );
      clientsQuery(sQueries, 0, 50);
    }
  };

  return (
    <Form
      form={formRef}
      layout="vertical"
      name="BalanceForm"
      onFinish={onSubmit}
    >
      {updating ? (
        <Row gutter={[24]}>
          <Col span={24}>
            <Form.Item label="Deseas Realizar carga masiva?">
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                checked={oMasivo}
                onChange={() => {
                  setMasivo(!oMasivo);
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      ) : (
        <></>
      )}

      {oMasivo === false ? (
        <>
          <Row gutter={[24]}>
            <Col span={24}>
              <Form.Item label="Cliente" name="client_id">
                <SearchSelector
                  handleSearch={debounce(handleSearchClient, 300)}
                  loading={loading}
                  placeholder="Buscar Cliente"
                  onChange={setClient}
                >
                  {clients?.data.map(oCli => (
                    <Select.Option key={oCli.id} value={oCli.id}>
                      {oCli.trade_name}
                    </Select.Option>
                  ))}
                </SearchSelector>
              </Form.Item>
            </Col>

            {oClient ? (
              <Col span={24}>
                <Form.Item label="Cuentas" name="account_id">
                  <Select
                    loading={accountsLoading}
                    placeholder="Selecciona una Cuenta"
                  >
                    {accounts?.data.map(oAcount => (
                      <Select.Option key={oAcount.id} value={oAcount.id}>
                        {oAcount.description}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            ) : (
              <></>
            )}
          </Row>

          <Row gutter={[12, 12]}>
            <Col span={12}>
              <Form.Item
                label="Ejercicio"
                name="year"
                rules={[{ required: true }]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Mes" name="month" rules={[{ required: true }]}>
                <Input type="number" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[12, 12]}>
            <Col span={12}>
              <Form.Item
                label="Saldo de Cuenta"
                name="balance"
                rules={[{ required: true }]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[12, 12]}>
            <Col span={12}>
              <Form.Item label="Contabilizable ?" name="type">
                <Select placeholder="Selecciona">
                  <Select.Option value={1}>Si</Select.Option>
                  <Select.Option value={0}>No</Select.Option>
                </Select>
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
      ) : (
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
              label="Documento"
              name="files"
              getValueFromEvent={normFile}
              noStyle
              valuePropName="fileList"
            >
              <Upload customRequest={dummyRequest} maxCount={1}>
                <Button icon={<UploadOutlined />}>Click para Subir</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      )}
    </Form>
  );
};

BalanceForm.propTypes = {
  formRef: PropTypes.object,
  onSubmit: PropTypes.func,
  updating: PropTypes.bool,
};
