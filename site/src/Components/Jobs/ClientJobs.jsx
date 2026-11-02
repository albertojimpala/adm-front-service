import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Space, Table, Tooltip } from 'antd';
import { EyeOutlined, RiseOutlined } from '@ant-design/icons';
import { useFetchList, usePermissions } from '../../Hooks';
import { JOB_PROGRESS, toOptions } from '../../Utils/constants';
import { formatDate, formatPeriod } from '../../Utils/format';
import { SearchBar } from '../Atoms/SearchBar';
import { JobDetail } from './JobDetail';
import { JobProgressTag } from './JobProgressTag';
import { ProgressModal } from './ProgressModal';

const searchElements = [
  {
    label: 'Avance',
    name: 'progress',
    type: 'select',
    options: toOptions(JOB_PROGRESS),
    span: 8,
  },
  { label: 'Periodo', name: 'period', type: 'month', span: 8 },
];

// trabajos de un cliente; en el portal (model portal/jobs) es solo consulta
export const ClientJobs = ({ clientId, model = 'jobs' }) => {
  const { can } = usePermissions();
  const bPortal = model.startsWith('portal');
  const oBaseQueries = bPortal ? {} : { clientId, status: 1 };
  const [data, loading, change, update, { changePage }] = useFetchList(
    model,
    oBaseQueries,
  );
  const [detail, setDetail] = useState(null);
  const [progress, setProgress] = useState(null);

  const columns = [
    { dataIndex: 'title', title: 'Trabajo' },
    {
      dataIndex: 'employee',
      title: 'Responsable',
      render: oEmployee =>
        oEmployee && `${oEmployee.firstName} ${oEmployee.lastName}`,
    },
    { dataIndex: 'period', title: 'Periodo', render: formatPeriod },
    { dataIndex: 'dueDate', title: 'Compromiso', render: formatDate },
    {
      key: 'progress',
      title: 'Avance',
      render: (_, row) => <JobProgressTag job={row} />,
    },
    {
      key: 'actions',
      width: 1,
      render: (_, row) => (
        <Space size="small">
          <Tooltip title="Detalle e historial">
            <Button icon={<EyeOutlined />} onClick={() => setDetail(row)} />
          </Tooltip>
          {!bPortal && can('jobs', 'update') && (
            <Tooltip title="Cambiar avance">
              <Button
                icon={<RiseOutlined />}
                onClick={() => setProgress(row)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <SearchBar
        elements={searchElements}
        handleSearch={oQueries => change({ ...oBaseQueries, ...oQueries })}
      />
      <Table
        columns={columns}
        dataSource={data.data}
        loading={loading}
        pagination={{
          current: data.meta?.page,
          pageSize: data.meta?.limit,
          total: data.meta?.total,
          onChange: changePage,
        }}
        rowKey="id"
        scroll={{ x: 'max-content' }}
        size="small"
      />
      <JobDetail job={detail} model={model} onClose={() => setDetail(null)} />
      <ProgressModal
        job={progress}
        onClose={() => setProgress(null)}
        onSaved={update}
      />
    </>
  );
};

ClientJobs.propTypes = {
  clientId: PropTypes.string,
  model: PropTypes.string,
};
