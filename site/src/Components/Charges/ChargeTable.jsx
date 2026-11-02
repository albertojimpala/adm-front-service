import { useState } from 'react';
import { Button, Tooltip } from 'antd';
import {
  DollarOutlined,
  EyeOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { usePermissions } from '../../Hooks';
import { PAYMENT_STATUS, toOptions } from '../../Utils/constants';
import { formatDate, formatMoney, formatPeriod } from '../../Utils/format';
import { CrudTable } from '../Atoms/CrudTable';
import { ClientSelect } from '../Atoms/RemoteSelect';
import { ChargeForm, chargeToForm, chargeToPayload } from '../Forms';
import { PaymentModal } from '../Payments/PaymentModal';
import { ChargeDetail } from './ChargeDetail';
import { ChargeStatusTag } from './ChargeStatusTag';
import { ChargeSummary } from './ChargeSummary';
import { GenerateChargesModal } from './GenerateChargesModal';

const columns = [
  { dataIndex: ['client', 'name'], title: 'Cliente' },
  { dataIndex: 'period', title: 'Periodo', render: formatPeriod },
  { dataIndex: 'dueDate', title: 'Vence', render: formatDate },
  { dataIndex: 'total', title: 'Total', align: 'right', render: formatMoney },
  {
    dataIndex: 'paidAmount',
    title: 'Pagado',
    align: 'right',
    render: formatMoney,
  },
  {
    key: 'balance',
    title: 'Saldo',
    align: 'right',
    render: (_, row) => (
      <strong>{formatMoney(row.total - row.paidAmount)}</strong>
    ),
  },
  {
    key: 'status',
    title: 'Estatus',
    render: (_, row) => <ChargeStatusTag charge={row} />,
  },
];

const searchElements = [
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
  { label: 'Periodo', name: 'period', type: 'month', span: 4 },
  {
    label: 'Estatus de pago',
    name: 'paymentStatus',
    type: 'select',
    options: toOptions(PAYMENT_STATUS),
    span: 4,
  },
  {
    label: 'Vencidos',
    name: 'overdue',
    type: 'select',
    options: [{ value: 'true', label: 'Solo vencidos' }],
    span: 4,
  },
  {
    label: 'Estatus',
    name: 'status',
    type: 'select',
    options: [{ value: 1, label: 'Activos' }],
    span: 3,
  },
];

export const ChargeTable = () => {
  const { can } = usePermissions();
  const [refreshKey, setRefreshKey] = useState(0);
  const [generate, setGenerate] = useState(false);
  const [detail, setDetail] = useState(null);
  const [paying, setPaying] = useState(null);

  const refresh = () => setRefreshKey(n => n + 1);

  return (
    <>
      <ChargeSummary refreshKey={refreshKey} />
      <CrudTable
        canDeleteRow={row => row.status === 1 && row.paidAmount === 0}
        columns={columns}
        deleteText="Cancelar"
        drawer={
          <ChargeDetail charge={detail} onClose={() => setDetail(null)} />
        }
        entityLabel="cargo"
        FormComponent={ChargeForm}
        headerActions={
          can('charges', 'create') && (
            <Button
              icon={<ThunderboltOutlined />}
              onClick={() => setGenerate(true)}
              type="primary"
            >
              Generar cargos
            </Button>
          )
        }
        model="charges"
        module="charges"
        onChanged={refresh}
        permissions={{ create: false }}
        refreshKey={refreshKey}
        rowActions={row => (
          <>
            <Tooltip title="Detalle">
              <Button icon={<EyeOutlined />} onClick={() => setDetail(row)} />
            </Tooltip>
            {can('payments', 'create') &&
              row.status === 1 &&
              row.paymentStatus !== 'paid' && (
                <Tooltip title="Registrar pago">
                  <Button
                    icon={<DollarOutlined />}
                    onClick={() => setPaying(row)}
                  />
                </Tooltip>
              )}
          </>
        )}
        searchElements={searchElements}
        title="Cargos mensuales"
        toForm={chargeToForm}
        toPayload={chargeToPayload}
      />
      <GenerateChargesModal
        onClose={() => setGenerate(false)}
        onSaved={refresh}
        open={generate}
      />
      <PaymentModal
        charge={paying}
        onClose={() => setPaying(null)}
        onSaved={refresh}
        open={Boolean(paying)}
      />
    </>
  );
};
