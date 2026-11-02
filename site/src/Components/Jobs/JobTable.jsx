import { useState } from 'react';
import { Button, Tooltip } from 'antd';
import { EyeOutlined, RiseOutlined } from '@ant-design/icons';
import { usePermissions } from '../../Hooks';
import { JOB_PROGRESS, toOptions } from '../../Utils/constants';
import { formatDate, formatPeriod } from '../../Utils/format';
import { CrudTable } from '../Atoms/CrudTable';
import { ClientSelect, EmployeeSelect } from '../Atoms/RemoteSelect';
import { JobForm, jobToForm, jobToPayload } from '../Forms';
import { JobDetail } from './JobDetail';
import { JobProgressTag } from './JobProgressTag';
import { JobSummary } from './JobSummary';
import { ProgressModal } from './ProgressModal';

const columns = [
  { dataIndex: 'title', title: 'Trabajo' },
  { dataIndex: ['client', 'name'], title: 'Cliente' },
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
];

const searchElements = [
  { label: 'Trabajo', name: 'search' },
  {
    label: 'Compañía',
    name: 'companyId',
    type: 'remote',
    props: { model: 'companies', getLabel: o => o.tradeName || o.name },
  },
  {
    label: 'Cliente',
    name: 'clientId',
    render: () => <ClientSelect placeholder="Todos" />,
  },
  {
    label: 'Responsable',
    name: 'employeeId',
    render: () => <EmployeeSelect placeholder="Todos" />,
  },
  {
    label: 'Avance',
    name: 'progress',
    type: 'select',
    options: toOptions(JOB_PROGRESS),
    span: 4,
  },
  {
    label: 'Vencidos',
    name: 'overdue',
    type: 'select',
    options: [{ value: 'true', label: 'Solo vencidos' }],
    span: 4,
  },
];

export const JobTable = () => {
  const { can } = usePermissions();
  const [refreshKey, setRefreshKey] = useState(0);
  const [detail, setDetail] = useState(null);
  const [progress, setProgress] = useState(null);

  const refresh = () => setRefreshKey(n => n + 1);

  return (
    <>
      <JobSummary refreshKey={refreshKey} />
      <CrudTable
        columns={columns}
        defaultQueries={{ status: 1 }}
        deleteText="Eliminar"
        drawer={<JobDetail job={detail} onClose={() => setDetail(null)} />}
        entityLabel="trabajo"
        FormComponent={JobForm}
        model="jobs"
        modalWidth={720}
        module="jobs"
        onChanged={refresh}
        refreshKey={refreshKey}
        rowActions={row => (
          <>
            <Tooltip title="Detalle e historial">
              <Button icon={<EyeOutlined />} onClick={() => setDetail(row)} />
            </Tooltip>
            {can('jobs', 'update') && (
              <Tooltip title="Cambiar avance">
                <Button
                  icon={<RiseOutlined />}
                  onClick={() => setProgress(row)}
                />
              </Tooltip>
            )}
          </>
        )}
        searchElements={searchElements}
        title="Trabajos"
        toForm={jobToForm}
        toPayload={jobToPayload}
      />
      <ProgressModal
        job={progress}
        onClose={() => setProgress(null)}
        onSaved={refresh}
      />
    </>
  );
};
