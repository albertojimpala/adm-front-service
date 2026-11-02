import { CrudTable } from '../Atoms/CrudTable';
import { statusColumn } from '../Atoms/StatusTag';
import { RegimeForm } from '../Forms';
import { usePermissions } from '../../Hooks';
import { STATUS_OPTIONS } from '../../Utils/constants';

const columns = [
  { dataIndex: 'code', title: 'Clave' },
  { dataIndex: 'description', title: 'Descripción' },
  statusColumn,
];

const searchElements = [
  { label: 'Descripción', name: 'description' },
  { label: 'Clave', name: 'code' },
  { label: 'Estatus', name: 'status', type: 'select', options: STATUS_OPTIONS },
];

export const RegimeTable = () => {
  // en la API solo el usuario super puede crear o modificar regimenes
  const { isSuper } = usePermissions();

  return (
    <CrudTable
      columns={columns}
      entityLabel="régimen"
      FormComponent={RegimeForm}
      model="regimes"
      module="regimes"
      permissions={{ create: isSuper, update: isSuper, delete: isSuper }}
      searchElements={searchElements}
      title="Regímenes fiscales"
      toPayload={({ code, description, status }) => ({
        code,
        description,
        status,
      })}
    />
  );
};
