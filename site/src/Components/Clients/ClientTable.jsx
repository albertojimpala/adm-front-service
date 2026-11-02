import { useState } from 'react';
import { Button, Tooltip, Typography } from 'antd';
import { EyeOutlined, RiseOutlined } from '@ant-design/icons';
import { usePermissions } from '../../Hooks';
import { STATUS_OPTIONS } from '../../Utils/constants';
import { CrudTable } from '../Atoms/CrudTable';
import { EmployeeSelect } from '../Atoms/RemoteSelect';
import { statusColumn } from '../Atoms/StatusTag';
import { ClientForm, clientToForm, clientToPayload } from '../Forms';
import { ClientDetail } from './ClientDetail';
import { PriceIncreaseModal } from './PriceIncreaseModal';

const columns = [
  {
    dataIndex: 'name',
    title: 'Cliente',
    render: (sName, row) => (
      <>
        <Typography.Text strong>{sName}</Typography.Text>
        {row.tradeName && (
          <>
            <br />
            <Typography.Text type="secondary">{row.tradeName}</Typography.Text>
          </>
        )}
      </>
    ),
  },
  {
    dataIndex: 'rfc',
    title: 'RFC',
    render: sRfc => sRfc && <Typography.Text copyable>{sRfc}</Typography.Text>,
  },
  {
    dataIndex: 'company',
    title: 'Compañía',
    render: oCompany => oCompany?.tradeName || oCompany?.name,
  },
  {
    dataIndex: 'manager',
    title: 'Encargado',
    render: oManager =>
      oManager && `${oManager.firstName} ${oManager.lastName}`,
  },
  { dataIndex: ['subscriptionType', 'description'], title: 'Suscripción' },
  { dataIndex: ['regime', 'description'], title: 'Régimen' },
  { dataIndex: 'phone', title: 'Teléfono' },
  { dataIndex: 'email', title: 'Email' },
  statusColumn,
];

const searchElements = [
  { label: 'Nombre o RFC', name: 'search' },
  {
    label: 'Encargado',
    name: 'managerId',
    render: () => <EmployeeSelect placeholder="Todos" />,
  },
  {
    label: 'Compañía',
    name: 'companyId',
    type: 'remote',
    props: { model: 'companies', getLabel: o => o.tradeName || o.name },
  },
  {
    label: 'Tipo de suscripción',
    name: 'subscriptionTypeId',
    type: 'remote',
    props: { model: 'subscription-types' },
  },
  {
    label: 'Régimen',
    name: 'regimeId',
    type: 'remote',
    props: { model: 'regimes' },
  },
  {
    label: 'Estatus',
    name: 'status',
    type: 'select',
    options: STATUS_OPTIONS,
    span: 4,
  },
];

export const ClientTable = () => {
  const { can } = usePermissions();
  const [detail, setDetail] = useState(null);
  const [priceIncrease, setPriceIncrease] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <CrudTable
        columns={columns}
        drawer={
          <ClientDetail
            client={detail}
            onChanged={() => setRefreshKey(n => n + 1)}
            onClose={() => setDetail(null)}
          />
        }
        entityLabel="cliente"
        FormComponent={ClientForm}
        headerActions={
          can('clients', 'update') && (
            <Button
              icon={<RiseOutlined />}
              onClick={() => setPriceIncrease(true)}
            >
              Incremento anual
            </Button>
          )
        }
        model="clients"
        modalWidth={820}
        module="clients"
        refreshKey={refreshKey}
        rowActions={row => (
          <Tooltip title="Detalle, servicios y adeudo">
            <Button icon={<EyeOutlined />} onClick={() => setDetail(row)} />
          </Tooltip>
        )}
        searchElements={searchElements}
        title="Clientes"
        toForm={clientToForm}
        toPayload={clientToPayload}
      />
      <PriceIncreaseModal
        onClose={() => setPriceIncrease(false)}
        open={priceIncrease}
      />
    </>
  );
};
