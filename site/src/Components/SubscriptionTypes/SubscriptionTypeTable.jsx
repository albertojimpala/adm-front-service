import { CrudTable } from '../Atoms/CrudTable';
import { statusColumn } from '../Atoms/StatusTag';
import { SubscriptionTypeForm } from '../Forms';
import { STATUS_OPTIONS } from '../../Utils/constants';
import { formatMoney } from '../../Utils/format';

const columns = [
  { dataIndex: 'code', title: 'Código' },
  { dataIndex: 'description', title: 'Descripción' },
  {
    dataIndex: 'basePrice',
    title: 'Cuota base',
    align: 'right',
    render: formatMoney,
  },
  {
    dataIndex: 'discountPercent',
    title: 'Descuento en servicios',
    align: 'right',
    render: n => `${n}%`,
  },
  statusColumn,
];

const searchElements = [
  { label: 'Descripción', name: 'description' },
  { label: 'Código', name: 'code' },
  { label: 'Estatus', name: 'status', type: 'select', options: STATUS_OPTIONS },
];

export const SubscriptionTypeTable = () => (
  <CrudTable
    columns={columns}
    entityLabel="tipo de suscripción"
    FormComponent={SubscriptionTypeForm}
    model="subscription-types"
    module="subscriptions"
    searchElements={searchElements}
    title="Tipos de suscripción"
    toPayload={({ code, description, basePrice, discountPercent, status }) => ({
      code,
      description,
      basePrice,
      discountPercent,
      status,
    })}
  />
);
