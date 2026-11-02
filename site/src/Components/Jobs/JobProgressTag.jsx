import PropTypes from 'prop-types';
import { Space, Tag } from 'antd';
import dayjs from 'dayjs';
import { JOB_PROGRESS } from '../../Utils/constants';

export const JobProgressTag = ({ job }) => {
  const oProgress = JOB_PROGRESS[job.progress] || {};
  const bOverdue =
    job.progress !== 'finished' &&
    job.dueDate &&
    dayjs(job.dueDate).isBefore(dayjs(), 'day');

  return (
    <Space size={4}>
      <Tag color={oProgress.color}>{oProgress.label}</Tag>
      {bOverdue && <Tag color="red">Vencido</Tag>}
    </Space>
  );
};

JobProgressTag.propTypes = {
  job: PropTypes.object.isRequired,
};
