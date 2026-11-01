import React, { useState } from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  InputNumber,
  message,
  Space,
  Select,
  Row,
} from 'antd';
import { useFetchClients } from '../../Hooks/Client.hook';
import { DownloadOutlined } from '@ant-design/icons';
import { process, SAVE } from '../../Service/Api';
import { getServer } from '../../Utils/url';

const oValors = {
  type: null,
  month: null,
  year: null,
  id_client: '',
};
export const ReportTable = () => {
  const [oValor, setValor] = useState(oValors);
  const [oArchivo, setArchivo] = useState(null);
  const [clients, loading] = useFetchClients();
  const onChange = value => {
    setValor({ ...oValor, month: value });
  };

  const onChange2 = value => {
    setValor({ ...oValor, id_client: value });
  };

  const onChange3 = value => {
    setValor({ ...oValor, type: value });
  };

  const sendData = async () => {
    let response;
    response = await process(SAVE, 'reports', oValor);
    if (response?.ok) {
      message.success('Exito');
      setArchivo(response.data);
    } else {
      console.log(response);
      message.error('Error al Generar');
    }
  };

  return (
    <div>
      <Row justify="space-between">
        <Col>
          <h3>Reporte Balance General</h3>
        </Col>
      </Row>

      <Card title="Generar Balance General">
        <Space direction="vertical">
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col span={12}>
              <Form.Item label="Mes" required>
                <Select
                  showSearch
                  placeholder="Selecciona mes"
                  optionFilterProp="children"
                  onChange={onChange}
                  options={[
                    {
                      value: 1,
                      label: 'Enero',
                    },
                    {
                      value: 2,
                      label: 'Febrero',
                    },
                    {
                      value: 3,
                      label: 'Marzo',
                    },
                    {
                      value: 4,
                      label: 'Abril',
                    },
                    {
                      value: 5,
                      label: 'Mayo',
                    },
                    {
                      value: 6,
                      label: 'Junio',
                    },
                    {
                      value: 7,
                      label: 'Julio',
                    },
                    {
                      value: 8,
                      label: 'Agosto',
                    },
                    {
                      value: 9,
                      label: 'Septiembre',
                    },
                    {
                      value: 10,
                      label: 'Octubre',
                    },
                    {
                      value: 11,
                      label: 'Noviembre',
                    },
                    {
                      value: 12,
                      label: 'Diciembre',
                    },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Ejercicio" required>
                <InputNumber
                  min={2015}
                  placeholder="Ejercicio"
                  value={oValor.year}
                  onChange={value => setValor({ ...oValor, year: value })}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Cliente" required>
                <Select
                  loading={loading}
                  placeholder="Selecciona un cliente"
                  onChange={onChange2}
                >
                  {clients?.data.map(oCliente => (
                    <Select.Option key={oCliente.id} value={oCliente.id}>
                      {oCliente.trade_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Tipo de Reporte" required>
                <Select
                  showSearch
                  placeholder="Selecciona un Tipo"
                  optionFilterProp="children"
                  onChange={onChange3}
                  options={[
                    {
                      value: 1,
                      label: 'Balance General',
                    },
                  ]}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item>
                <Button type="primary" onClick={() => sendData()}>
                  <DownloadOutlined />
                  Generar
                </Button>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col>
              {oArchivo && (
                <Form.Item>
                  <a
                    target="_blank"
                    href={`${getServer()}` + `/` + `${oArchivo.url}`}
                    rel="noreferrer"
                  >
                    Descargar <DownloadOutlined />
                  </a>
                </Form.Item>
              )}
            </Col>
          </Row>
        </Space>
      </Card>
    </div>
  );
};
