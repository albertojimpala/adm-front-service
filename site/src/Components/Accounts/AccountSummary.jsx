import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Col, DatePicker, Flex, Row, Statistic, Typography } from 'antd';
import dayjs from 'dayjs';
import { useFetchOne } from '../../Hooks';
import { ACCOUNT_TYPES } from '../../Utils/constants';

const { RangePicker } = DatePicker;

// saldo actual y entradas/salidas del periodo: banco vs caja chica
export const AccountSummary = ({ refreshKey }) => {
  const [aRange, setRange] = useState([
    dayjs().startOf('month'),
    dayjs().endOf('month'),
  ]);
  const [data, loading, update] = useFetchOne('accounts/summary', undefined, {
    from: aRange?.[0]?.format('YYYY-MM-DD'),
    to: aRange?.[1]?.format('YYYY-MM-DD'),
  });

  useEffect(() => {
    if (refreshKey) {
      update();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  return (
    <Card
      extra={
        <Flex align="center" gap={8}>
          Movimientos del
          <RangePicker
            allowEmpty={[true, true]}
            format="DD/MM/YYYY"
            onChange={setRange}
            value={aRange}
          />
        </Flex>
      }
      size="small"
      style={{ marginBottom: 16 }}
      title="Resumen"
    >
      <Row gutter={[16, 16]}>
        {Object.entries(ACCOUNT_TYPES).map(([sType, { label }]) => {
          const oTotals = data?.totals?.[sType] || {};
          return (
            <Col key={sType} md={10} xs={24}>
              <Typography.Text strong>{label}</Typography.Text>
              <Row gutter={[8, 8]}>
                <Col span={6}>
                  <Statistic
                    loading={loading}
                    prefix="$"
                    precision={2}
                    title="Saldo"
                    value={oTotals.balance}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    loading={loading}
                    prefix="$"
                    precision={2}
                    styles={{ content: { color: '#3f8600' } }}
                    title="Cobrado"
                    value={oTotals.collected}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    loading={loading}
                    prefix="$"
                    precision={2}
                    title="Entradas"
                    value={oTotals.totalIn}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    loading={loading}
                    prefix="$"
                    precision={2}
                    title="Salidas"
                    value={oTotals.totalOut}
                  />
                </Col>
              </Row>
            </Col>
          );
        })}
        <Col md={4} xs={24}>
          <Statistic
            loading={loading}
            prefix="$"
            precision={2}
            styles={{ content: { color: '#1677ff', fontWeight: 'bold' } }}
            title="Saldo total"
            value={data?.totals?.balance}
          />
        </Col>
      </Row>
    </Card>
  );
};

AccountSummary.propTypes = {
  refreshKey: PropTypes.number,
};
