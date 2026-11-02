import { useState } from 'react';
import { Button, Table, Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useFetchList } from '../../Hooks';
import { PAYMENT_STATUS, toOptions } from '../../Utils/constants';
import { formatDate, formatMoney, formatPeriod } from '../../Utils/format';
import { SearchBar } from '../Atoms/SearchBar';
import { ChargeDetail } from '../Charges/ChargeDetail';
import { ChargeStatusTag } from '../Charges/ChargeStatusTag';

const searchElements = [
  { label: 'Periodo', name: 'period', type: 'month' },
  {
    label: 'Estatus de pago',
    name: 'paymentStatus',
    type: 'select',
    options: toOptions(PAYMENT_STATUS),
  },
];

// cargos mensuales del cliente
export const PortalCharges = () => {
  const [data, loading, change, , { changePage }] =
    useFetchList('portal/charges');
  const [detail, setDetail] = useState(null);

  const columns = [
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
    {
      key: 'actions',
      width: 1,
      render: (_, row) => (
        <Tooltip title="Detalle">
          <Button icon={<EyeOutlined />} onClick={() => setDetail(row)} />
        </Tooltip>
      ),
    },
  ];

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
      <ChargeDetail
        charge={detail}
        model="portal/charges"
        onClose={() => setDetail(null)}
      />
    </>
  );
};
