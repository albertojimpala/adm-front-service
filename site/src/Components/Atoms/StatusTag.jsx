import PropTypes from 'prop-types';
import { Tag } from 'antd';

export const StatusTag = ({
  status,
  activeLabel = 'Activo',
  inactiveLabel = 'Inactivo',
}) =>
  status === 1 ? (
    <Tag color="green">{activeLabel}</Tag>
  ) : (
    <Tag color="red">{inactiveLabel}</Tag>
  );

StatusTag.propTypes = {
  status: PropTypes.number,
  activeLabel: PropTypes.string,
  inactiveLabel: PropTypes.string,
};

export const statusColumn = {
  dataIndex: 'status',
  title: 'Estatus',
  width: 100,
  render: status => <StatusTag status={status} />,
};
