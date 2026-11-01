/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import 'chart.js/auto';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Pie } from 'react-chartjs-2';
import { Card, Col, Row, Space, Spin, Statistic, message } from 'antd';
import { useAuth } from '../../Hooks';
import { process, SAVE } from '../../Service/Api';
const aDatos = {
  morales: 0,
  fisicas: 0,
  bajas: 0,
};

export const InitialScreen = () => {
  const [{ user }] = useAuth();
  const [oDatos, setDatos] = useState(aDatos);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    const response = await process(SAVE, 'dashboard');
    if (response?.ok) {
      setDatos(response.data);
      setLoading(true);
    } else {
      message.error('Error al cargar datos iniciales ');
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const getStatics = type => {
    let total = oDatos.bajas + oDatos.fisicas + oDatos.morales;
    let activos = oDatos.fisicas + oDatos.morales;
    let bajas = oDatos.bajas;
    let porcentaje = 0;
    if (type === 1 && total > 0) {
      porcentaje = (activos * 100) / total;
    }
    if (type === 2 && total > 0) {
      porcentaje = (bajas * 100) / total;
    }
    return porcentaje;
  };
  const getValues = () => {
    return {
      labels: ['Fisicas', 'Morales', 'Inactivos'],
      datasets: [
        {
          label: 'Clientes',
          data: [oDatos.fisicas, oDatos.morales, oDatos.bajas],
          backgroundColor: ['#598EF7', '#985CE0', '#ED7E55'],
          hoverOffset: 0,
        },
      ],
    };
  };

  return (
    <div className="initial-screen">
      <Row>
        <Col span={24}>
          <h3>{`Bienvenido ${user.full_name}`}</h3>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <Card title="Grafico de No. de Clientes " size="small">
              {loading ? (
                <Pie data={getValues()} />
              ) : (
                <div className="example">
                  <Spin tip="Cargando..." size="large">
                    <div className="content" />
                  </Spin>
                </div>
              )}
            </Card>
          </Space>
        </Col>
        <Col span={12}>
          <Card title="Estadisticas" size="small">
            <Col span={10}>
              <Card bordered={false}>
                <Statistic
                  title="Clientes Activos"
                  value={getStatics(1)}
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<ArrowUpOutlined />}
                  suffix="%"
                />
              </Card>
            </Col>
            <Col span={10}>
              <Card bordered={false}>
                <Statistic
                  title="Clientes Inactivos"
                  value={getStatics(2)}
                  precision={2}
                  valueStyle={{ color: '#cf1322' }}
                  prefix={<ArrowDownOutlined />}
                  suffix="%"
                />
              </Card>
            </Col>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
