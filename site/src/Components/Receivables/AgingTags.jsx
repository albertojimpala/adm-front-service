import PropTypes from 'prop-types';
import { Space, Tag } from 'antd';
import { AGING_BUCKETS } from '../../Utils/constants';
import { formatMoney } from '../../Utils/format';

const AGING_COLORS = {
  current: 'green',
  days1to30: 'gold',
  days31to60: 'orange',
  days61to90: 'volcano',
  over90: 'red',
};

// antiguedad de saldos
export const AgingTags = ({ aging = {} }) => (
  <Space size={[4, 4]} wrap>
    {Object.entries(AGING_BUCKETS).map(([sKey, sLabel]) => (
      <Tag color={aging[sKey] ? AGING_COLORS[sKey] : undefined} key={sKey}>
        {sLabel}: {formatMoney(aging[sKey])}
      </Tag>
    ))}
  </Space>
);

AgingTags.propTypes = {
  aging: PropTypes.object,
};

export const agingColumns = Object.entries(AGING_BUCKETS).map(
  ([sKey, sLabel]) => ({
    dataIndex: ['aging', sKey],
    title: sLabel,
    align: 'right',
    render: nValue =>
      nValue ? (
        <span style={{ color: sKey === 'current' ? undefined : '#cf1322' }}>
          {formatMoney(nValue)}
        </span>
      ) : (
        '-'
      ),
  }),
);
