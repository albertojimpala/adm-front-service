import { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Col, DatePicker, Flex, Row, Statistic, Table, Tag } from 'antd';
import dayjs from 'dayjs';
import { useFetchOne } from '../../Hooks';
import { formatDate, formatMoney } from '../../Utils/format';

const { RangePicker } = DatePicker;

// los movimientos no tienen id unico, se numeran para la tabla
const withKeys = (aRows = []) =>
  aRows.map((oRow, nIndex) => ({ ...oRow, key: nIndex }));

// estado de cuenta: cargos y pagos con saldo acumulado
// model permite usar la ruta del portal (portal/statement)
export const ClientStatement = ({ clientId, model }) => {
  const [aRange, setRange] = useState([dayjs().startOf('year'), dayjs()]);
  const [data, loading] = useFetchOne(
    model || `receivables/clients/${clientId}/statement`,
    undefined,
    {
      from: aRange?.[0]?.format('YYYY-MM-DD'),
      to: aRange?.[1]?.format('YYYY-MM-DD'),
    },
  );

  const columns = [
    { dataIndex: 'date', title: 'Fecha', render: formatDate },
    {
      dataIndex: 'type',
      title: 'Tipo',
      render: sType =>
        sType === 'charge' ? (
          <Tag color="orange">Cargo</Tag>
        ) : (
          <Tag color="green">Pago</Tag>
        ),
    },
    { dataIndex: 'concept', title: 'Concepto' },
    {
      dataIndex: 'charge',
      title: 'Cargo',
      align: 'right',
      render: n => (n ? formatMoney(n) : ''),
    },
    {
      dataIndex: 'payment',
      title: 'Abono',
      align: 'right',
      render: n => (n ? formatMoney(n) : ''),
    },
    {
      dataIndex: 'balance',
      title: 'Saldo',
      align: 'right',
      render: n => <strong>{formatMoney(n)}</strong>,
    },
  ];

  return (
    <div>
      <Flex justify="end" style={{ marginBottom: 12 }}>
        <RangePicker
          allowEmpty={[true, true]}
          format="DD/MM/YYYY"
          onChange={setRange}
          value={aRange}
        />
      </Flex>
      <Row gutter={[12, 12]}>
        {[
          ['Saldo inicial', data?.openingBalance],
          ['Cargos', data?.totalCharges],
          ['Pagos', data?.totalPayments],
          ['Saldo final', data?.closingBalance],
        ].map(([sTitle, nValue]) => (
          <Col key={sTitle} span={6}>
            <Card size="small">
              <Statistic
                loading={loading}
                prefix="$"
                precision={2}
                title={sTitle}
                value={nValue}
              />
            </Card>
          </Col>
        ))}
      </Row>
      <Table
        columns={columns}
        dataSource={withKeys(data?.movements)}
        loading={loading}
        pagination={false}
        rowKey="key"
        size="small"
        style={{ marginTop: 16 }}
      />
    </div>
  );
};

ClientStatement.propTypes = {
  clientId: PropTypes.string,
  model: PropTypes.string,
};
