import PropTypes from 'prop-types';
import { Descriptions, Drawer, Spin, Tag, Timeline, Typography } from 'antd';
import { useFetchOne } from '../../Hooks';
import { JOB_PROGRESS } from '../../Utils/constants';
import { formatDate, formatDateTime, formatPeriod } from '../../Utils/format';
import { JobProgressTag } from './JobProgressTag';

const TIMELINE_COLORS = {
  started: 'gray',
  pending: 'orange',
  in_progress: 'blue',
  in_review: 'purple',
  finished: 'green',
};

const JobInfo = ({ jobId, model }) => {
  const [job, loading] = useFetchOne(model, jobId);

  if (!job) {
    return <Spin />;
  }

  return (
    <Spin spinning={loading}>
      <Descriptions
        bordered
        column={2}
        items={[
          { label: 'Cliente', children: job.client?.name, span: 'filled' },
          { label: 'Avance', children: <JobProgressTag job={job} /> },
          {
            label: 'Responsable',
            children:
              job.employee &&
              `${job.employee.firstName} ${job.employee.lastName}`,
          },
          { label: 'Servicio', children: job.service?.description },
          { label: 'Periodo', children: formatPeriod(job.period) },
          { label: 'Inicio', children: formatDate(job.startDate) },
          { label: 'Fecha compromiso', children: formatDate(job.dueDate) },
          {
            label: 'Finalizado',
            children: formatDateTime(job.finishedAt),
            span: 'filled',
          },
          ...(job.description
            ? [
                {
                  label: 'Descripción',
                  children: job.description,
                  span: 'filled',
                },
              ]
            : []),
        ]}
        size="small"
      />

      <Typography.Title level={5} style={{ marginTop: 24 }}>
        Historial de avance
      </Typography.Title>
      <Timeline
        items={(job.history || []).map(oItem => ({
          key: oItem.id,
          color: TIMELINE_COLORS[oItem.toProgress],
          title: formatDateTime(oItem.createdAt),
          content: (
            <>
              <Tag color={JOB_PROGRESS[oItem.toProgress]?.color}>
                {JOB_PROGRESS[oItem.toProgress]?.label}
              </Tag>
              {oItem.userName && (
                <Typography.Text type="secondary">
                  {oItem.userName}
                </Typography.Text>
              )}
              {oItem.comment && <div>{oItem.comment}</div>}
            </>
          ),
        }))}
      />
    </Spin>
  );
};

JobInfo.propTypes = {
  jobId: PropTypes.string.isRequired,
  model: PropTypes.string.isRequired,
};

// model permite usar la ruta del portal (portal/jobs)
export const JobDetail = ({ job, onClose, model = 'jobs' }) => (
  <Drawer
    destroyOnHidden
    onClose={onClose}
    open={Boolean(job)}
    size={760}
    title={job?.title}
  >
    {job && <JobInfo jobId={job.id} model={model} />}
  </Drawer>
);

JobDetail.propTypes = {
  job: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  model: PropTypes.string,
};
