import PropTypes from 'prop-types';
import { Space, Tag } from 'antd';
import dayjs from 'dayjs';
import { PAYMENT_STATUS } from '../../Utils/constants';

export const ChargeStatusTag = ({ charge }) => {
  if (charge.status !== 1) {
    return <Tag color="default">Cancelado</Tag>;
  }
  const oStatus = PAYMENT_STATUS[charge.paymentStatus] || {};
  const bOverdue =
    charge.paymentStatus !== 'paid' &&
    dayjs(charge.dueDate).isBefore(dayjs(), 'day');
  return (
    <Space size={4}>
      <Tag color={oStatus.color}>{oStatus.label}</Tag>
      {bOverdue && <Tag color="red">Vencido</Tag>}
    </Space>
  );
};

ChargeStatusTag.propTypes = {
  charge: PropTypes.object.isRequired,
};
