import { useState } from 'react';
import { Button, Tag, Tooltip } from 'antd';
import { DollarOutlined, StopOutlined } from '@ant-design/icons';
import { usePermissions } from '../../Hooks';
import {
  ACCOUNT_TYPES,
  PAYMENT_METHODS,
  toOptions,
} from '../../Utils/constants';
import { formatDate, formatMoney, formatPeriod } from '../../Utils/format';
import { CrudTable } from '../Atoms/CrudTable';
import { ClientSelect } from '../Atoms/RemoteSelect';
import { CancelPaymentModal } from './CancelPaymentModal';
import { PaymentModal } from './PaymentModal';
import { ReceiptButton } from '../Atoms/ReceiptButton';

const columns = [
  { dataIndex: 'receiptNumber', title: 'Folio' },
  { dataIndex: 'paymentDate', title: 'Fecha', render: formatDate },
  { dataIndex: ['client', 'name'], title: 'Cliente' },
  { dataIndex: ['charge', 'period'], title: 'Periodo', render: formatPeriod },
  {
    dataIndex: 'account',
    title: 'Cuenta',
    render: oAccount =>
      oAccount && (
        <>
          {oAccount.name}{' '}
          <Tag color={ACCOUNT_TYPES[oAccount.type]?.color}>
            {ACCOUNT_TYPES[oAccount.type]?.label}
          </Tag>
        </>
      ),
  },
  {
    dataIndex: 'method',
    title: 'Forma',
    render: sMethod => PAYMENT_METHODS[sMethod],
  },
  { dataIndex: 'reference', title: 'Referencia' },
  {
    dataIndex: 'amount',
    title: 'Monto',
    align: 'right',
    render: n => <strong>{formatMoney(n)}</strong>,
  },
  {
    dataIndex: 'status',
    title: 'Estatus',
    render: (nStatus, row) =>
      nStatus === 1 ? (
        <Tag color="green">Aplicado</Tag>
      ) : (
        <Tooltip title={row.cancelReason}>
          <Tag color="red">Cancelado</Tag>
        </Tooltip>
      ),
  },
];

const searchElements = [
  { label: 'Folio', name: 'receiptNumber', span: 3 },
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
  { label: 'Fecha de pago', name: 'dates', type: 'range' },
  {
    label: 'Banco / caja chica',
    name: 'accountType',
    type: 'select',
    options: toOptions(ACCOUNT_TYPES),
    span: 4,
  },
  {
    label: 'Forma de pago',
    name: 'method',
    type: 'select',
    options: toOptions(PAYMENT_METHODS),
    span: 4,
  },
  {
    label: 'Estatus',
    name: 'status',
    type: 'select',
    options: [{ value: 1, label: 'Aplicados' }],
    span: 3,
  },
];

export const PaymentTable = () => {
  const { can } = usePermissions();
  const [refreshKey, setRefreshKey] = useState(0);
  const [create, setCreate] = useState(false);
  const [cancel, setCancel] = useState(null);

  const refresh = () => setRefreshKey(n => n + 1);

  return (
    <>
      <CrudTable
        columns={columns}
        entityLabel="pago"
        headerActions={
          can('payments', 'create') && (
            <Button
              icon={<DollarOutlined />}
              onClick={() => setCreate(true)}
              type="primary"
            >
              Registrar pago
            </Button>
          )
        }
        model="payments"
        module="payments"
        permissions={{ create: false, update: false, delete: false }}
        refreshKey={refreshKey}
        rowActions={row => (
          <>
            <ReceiptButton payment={row} />
            {can('payments', 'delete') && row.status === 1 && (
              <Tooltip title="Cancelar pago">
                <Button
                  danger
                  icon={<StopOutlined />}
                  onClick={() => setCancel(row)}
                />
              </Tooltip>
            )}
          </>
        )}
        searchElements={searchElements}
        title="Pagos"
      />
      <PaymentModal
        onClose={() => setCreate(false)}
        onSaved={refresh}
        open={create}
      />
      <CancelPaymentModal
        onClose={() => setCancel(null)}
        onSaved={refresh}
        payment={cancel}
      />
    </>
  );
};
