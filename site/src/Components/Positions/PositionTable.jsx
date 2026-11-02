import { CrudTable } from '../Atoms/CrudTable';
import { statusColumn } from '../Atoms/StatusTag';
import { PositionForm } from '../Forms';
import { STATUS_OPTIONS } from '../../Utils/constants';

const columns = [
  { dataIndex: 'description', title: 'Puesto' },
  { dataIndex: ['company', 'name'], title: 'Compañía' },
  statusColumn,
];

const searchElements = [
  { label: 'Puesto', name: 'description' },
  {
    label: 'Compañía',
    name: 'companyId',
    type: 'remote',
    props: { model: 'companies', getLabel: o => o.tradeName || o.name },
  },
  { label: 'Estatus', name: 'status', type: 'select', options: STATUS_OPTIONS },
];

export const PositionTable = () => (
  <CrudTable
    columns={columns}
    entityLabel="puesto"
    FormComponent={PositionForm}
    model="positions"
    module="positions"
    searchElements={searchElements}
    title="Puestos"
    toForm={row => ({
      description: row.description,
      companyId: row.companyId,
      status: row.status,
    })}
    toPayload={({ description, companyId, status }) => ({
      description,
      companyId,
      status,
    })}
  />
);
