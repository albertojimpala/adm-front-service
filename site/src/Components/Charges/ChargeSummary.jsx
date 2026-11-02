import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Col, DatePicker, Flex, Row, Statistic } from 'antd';
import dayjs from 'dayjs';
import { useFetchOne } from '../../Hooks';

// facturado, cobrado y pendiente del periodo
export const ChargeSummary = ({ refreshKey }) => {
  const [period, setPeriod] = useState(dayjs());
  const [data, loading, update] = useFetchOne('charges/summary', undefined, {
    period: period.format('YYYY-MM'),
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
          Periodo
          <DatePicker
            allowClear={false}
            format="MMMM YYYY"
            onChange={setPeriod}
            picker="month"
            value={period}
          />
        </Flex>
      }
      size="small"
      style={{ marginBottom: 16 }}
      title="Resumen del periodo"
    >
      <Row gutter={[12, 12]}>
        <Col md={6} xs={12}>
          <Statistic loading={loading} title="Cargos" value={data?.charges} />
        </Col>
        <Col md={6} xs={12}>
          <Statistic
            loading={loading}
            prefix="$"
            precision={2}
            title="Facturado"
            value={data?.billed}
          />
        </Col>
        <Col md={6} xs={12}>
          <Statistic
            loading={loading}
            prefix="$"
            precision={2}
            styles={{ content: { color: '#3f8600' } }}
            title="Cobrado"
            value={data?.collected}
          />
        </Col>
        <Col md={6} xs={12}>
          <Statistic
            loading={loading}
            prefix="$"
            precision={2}
            styles={{ content: { color: '#cf1322' } }}
            title="Pendiente"
            value={data?.pending}
          />
        </Col>
      </Row>
    </Card>
  );
};

ChargeSummary.propTypes = {
  refreshKey: PropTypes.number,
};
