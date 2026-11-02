import { CrudTable } from '../Atoms/CrudTable';
import { statusColumn } from '../Atoms/StatusTag';
import { EmployeeForm, employeeToForm, employeeToPayload } from '../Forms';
import { STATUS_OPTIONS } from '../../Utils/constants';
import { formatDate } from '../../Utils/format';

const columns = [
  {
    key: 'name',
    title: 'Nombre',
    render: (_, row) => `${row.firstName} ${row.lastName}`,
  },
  { dataIndex: ['company', 'name'], title: 'Compañía' },
  { dataIndex: ['position', 'description'], title: 'Puesto' },
  { dataIndex: 'email', title: 'Email' },
  { dataIndex: 'phone', title: 'Teléfono' },
  { dataIndex: 'hireDate', title: 'Ingreso', render: formatDate },
  statusColumn,
];

const searchElements = [
  { label: 'Nombre, email o RFC', name: 'search' },
  {
    label: 'Compañía',
    name: 'companyId',
    type: 'remote',
    props: { model: 'companies', getLabel: o => o.tradeName || o.name },
  },
  { label: 'Estatus', name: 'status', type: 'select', options: STATUS_OPTIONS },
];

export const EmployeeTable = () => (
  <CrudTable
    columns={columns}
    entityLabel="empleado"
    FormComponent={EmployeeForm}
    model="employees"
    modalWidth={760}
    module="employees"
    searchElements={searchElements}
    title="Empleados"
    toForm={employeeToForm}
    toPayload={employeeToPayload}
  />
);
