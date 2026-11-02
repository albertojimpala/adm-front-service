import { Table, Tag } from 'antd';
import { useFetchList } from '../../Hooks';
import { ACCOUNT_TYPES, PAYMENT_METHODS } from '../../Utils/constants';
import { formatDate, formatMoney, formatPeriod } from '../../Utils/format';
import { SearchBar } from '../Atoms/SearchBar';
import { ReceiptButton } from '../Atoms/ReceiptButton';

const searchElements = [
  { label: 'Fecha de pago', name: 'dates', type: 'range', span: 10 },
];

const columns = [
  { dataIndex: 'receiptNumber', title: 'Folio' },
  { dataIndex: 'paymentDate', title: 'Fecha', render: formatDate },
  { dataIndex: ['charge', 'period'], title: 'Periodo', render: formatPeriod },
  {
    dataIndex: 'method',
    title: 'Forma de pago',
    render: sMethod => PAYMENT_METHODS[sMethod],
  },
  {
    dataIndex: 'account',
    title: 'Depositado en',
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
  { dataIndex: 'reference', title: 'Referencia' },
  {
    dataIndex: 'amount',
    title: 'Monto',
    align: 'right',
    render: n => <strong>{formatMoney(n)}</strong>,
  },
  {
    key: 'receipt',
    width: 1,
    render: (_, row) => <ReceiptButton payment={row} portal />,
  },
];

// pagos aplicados del cliente
export const PortalPayments = () => {
  const [data, loading, change, , { changePage }] =
    useFetchList('portal/payments');

  return (
    <>
      <SearchBar elements={searchElements} handleSearch={change} />
      <Table
        columns={columns}
        dataSource={data.data}
        loading={loading}
        pagination={{
          current: data.meta?.page,
          pageSize: data.meta?.limit,
          total: data.meta?.total,
          onChange: changePage,
        }}
        rowKey="id"
        scroll={{ x: 'max-content' }}
      />
    </>
  );
};
