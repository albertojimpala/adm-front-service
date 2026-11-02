import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, Col, Row, Statistic } from 'antd';
import { useFetchOne } from '../../Hooks';
import { JOB_PROGRESS } from '../../Utils/constants';

const COLORS = {
  started: '#8c8c8c',
  pending: '#fa8c16',
  in_progress: '#1677ff',
  in_review: '#722ed1',
  finished: '#52c41a',
};

// trabajos activos por avance
export const JobSummary = ({ refreshKey }) => {
  const [data, loading, update] = useFetchOne('jobs/summary');

  useEffect(() => {
    if (refreshKey) {
      update();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  return (
    <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
      {Object.entries(JOB_PROGRESS).map(([sKey, { label }]) => (
        <Col key={sKey} lg={4} sm={8} xs={12}>
          <Card size="small">
            <Statistic
              loading={loading}
              styles={{ content: { color: COLORS[sKey] } }}
              title={label}
              value={
                data?.byProgress?.find(o => o.progress === sKey)?.count ?? 0
              }
            />
          </Card>
        </Col>
      ))}
      <Col lg={4} sm={8} xs={12}>
        <Card size="small">
          <Statistic
            loading={loading}
            styles={{ content: { color: '#cf1322' } }}
            title="Vencidos"
            value={data?.overdue ?? 0}
          />
        </Card>
      </Col>
    </Row>
  );
};

JobSummary.propTypes = {
  refreshKey: PropTypes.number,
};
