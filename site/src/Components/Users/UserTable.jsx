import { Tag } from 'antd';
import { CrudTable } from '../Atoms/CrudTable';
import { statusColumn } from '../Atoms/StatusTag';
import { UserForm } from '../Forms';
import { STATUS_OPTIONS } from '../../Utils/constants';
import { formatDate } from '../../Utils/format';

const columns = [
  { dataIndex: 'username', title: 'Usuario' },
  { dataIndex: 'email', title: 'Email' },
  {
    dataIndex: 'role',
    title: 'Rol',
    render: oRole =>
      oRole && (
        <Tag color={oRole.tag === 'client' ? 'cyan' : undefined}>
          {oRole.description}
        </Tag>
      ),
  },
  {
    key: 'link',
    title: 'Ligado a',
    render: (_, row) =>
      row.client
        ? `Cliente: ${row.client.name}`
        : row.employee
          ? `Empleado: ${row.employee.firstName} ${row.employee.lastName}`
          : '',
  },
  {
    dataIndex: 'isActive',
    title: 'Cuenta',
    render: bActive =>
      bActive ? <Tag color="green">Activada</Tag> : <Tag>Sin activar</Tag>,
  },
  { dataIndex: 'createdAt', title: 'Alta', render: formatDate },
  statusColumn,
];

const searchElements = [
  { label: 'Usuario', name: 'username' },
  { label: 'Email', name: 'email' },
  {
    label: 'Tipo',
    name: 'type',
    type: 'select',
    options: [
      { value: 'staff', label: 'Internos' },
      { value: 'client', label: 'Clientes (portal)' },
    ],
  },
  { label: 'Estatus', name: 'status', type: 'select', options: STATUS_OPTIONS },
];

export const UserTable = () => (
  <CrudTable
    columns={columns}
    entityLabel="usuario"
    FormComponent={UserForm}
    model="users"
    modalWidth={680}
    module="users"
    searchElements={searchElements}
    title="Usuarios"
    toForm={row => ({
      username: row.username,
      email: row.email,
      roleId: row.role?.id,
      clientId: row.clientId,
      employeeId: row.employeeId,
      status: row.status,
    })}
    toPayload={(
      { username, email, password, roleId, clientId, employeeId, status },
      selected,
    ) => ({
      username,
      email,
      roleId,
      status,
      // al editar se mandan en null para desligar
      clientId: clientId || (selected ? null : undefined),
      employeeId: employeeId || (selected ? null : undefined),
      // en edicion solo se manda si se capturo una nueva
      ...(password ? { password } : {}),
    })}
  />
);
