import { CrudTable } from '../Atoms/CrudTable';
import { statusColumn } from '../Atoms/StatusTag';
import { ServiceForm } from '../Forms';
import { STATUS_OPTIONS } from '../../Utils/constants';
import { formatMoney } from '../../Utils/format';

const columns = [
  { dataIndex: 'code', title: 'Código' },
  { dataIndex: 'description', title: 'Descripción' },
  {
    dataIndex: 'price',
    title: 'Precio mensual',
    align: 'right',
    render: formatMoney,
  },
  statusColumn,
];

const searchElements = [
  { label: 'Descripción', name: 'description' },
  { label: 'Código', name: 'code' },
  { label: 'Estatus', name: 'status', type: 'select', options: STATUS_OPTIONS },
];

export const ServiceTable = () => (
  <CrudTable
    columns={columns}
    entityLabel="servicio"
    FormComponent={ServiceForm}
    model="services"
    module="services"
    searchElements={searchElements}
    title="Servicios"
    toPayload={({ code, description, price, status }) => ({
      code,
      description,
      price,
      status,
    })}
  />
);
