import { Space, Tag, Tooltip } from 'antd';
import { CrudTable } from '../Atoms/CrudTable';
import { statusColumn } from '../Atoms/StatusTag';
import { RoleForm, parseRolePermissions } from '../Forms';
import {
  PERMISSION_ACTIONS,
  PERMISSION_MODULES,
  STATUS_OPTIONS,
} from '../../Utils/constants';

const columns = [
  { dataIndex: 'description', title: 'Descripción' },
  {
    dataIndex: 'tag',
    title: 'Tag',
    render: sTag => (
      <Tag color={sTag === 'super' ? 'purple' : 'blue'}>{sTag}</Tag>
    ),
  },
  {
    dataIndex: 'permissions',
    title: 'Permisos',
    render: (aPermissions, row) => {
      if (row.tag === 'super') {
        return <Tag color="purple">Acceso total</Tag>;
      }
      const oPermissions = parseRolePermissions(aPermissions);
      return (
        <Space size={[4, 4]} wrap>
          {Object.entries(oPermissions)
            .filter(([, oActions]) => Object.values(oActions).some(Boolean))
            .map(([sModule, oActions]) => (
              <Tooltip
                key={sModule}
                title={Object.keys(PERMISSION_ACTIONS)
                  .filter(sAction => oActions[sAction])
                  .map(sAction => PERMISSION_ACTIONS[sAction])
                  .join(', ')}
              >
                <Tag>{PERMISSION_MODULES[sModule] || sModule}</Tag>
              </Tooltip>
            ))}
        </Space>
      );
    },
  },
  statusColumn,
];

const searchElements = [
  { label: 'Descripción', name: 'description' },
  { label: 'Tag', name: 'tag' },
  { label: 'Estatus', name: 'status', type: 'select', options: STATUS_OPTIONS },
];

export const RoleTable = () => (
  <CrudTable
    columns={columns}
    entityLabel="rol"
    FormComponent={RoleForm}
    model="roles"
    modalWidth={760}
    module="roles"
    searchElements={searchElements}
    title="Roles"
    toForm={row => ({
      description: row.description,
      tag: row.tag,
      status: row.status,
      permissions: parseRolePermissions(row.permissions),
    })}
    // la API guarda los permisos como un arreglo con un solo JSON
    toPayload={({ description, tag, status, permissions }) => ({
      description,
      tag,
      status,
      permissions: [JSON.stringify(permissions || {})],
    })}
  />
);
