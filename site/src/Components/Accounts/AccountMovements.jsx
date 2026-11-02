import PropTypes from 'prop-types';
import { Drawer, Table, Tag, Typography } from 'antd';
import { useFetchList } from '../../Hooks';
import {
  MOVEMENT_CATEGORIES,
  MOVEMENT_TYPES,
  toOptions,
} from '../../Utils/constants';
import { formatDate, formatMoney } from '../../Utils/format';
import { SearchBar } from '../Atoms/SearchBar';

const searchElements = [
  { label: 'Fecha', name: 'dates', type: 'range', span: 8 },
  {
    label: 'Tipo',
    name: 'type',
    type: 'select',
    options: toOptions(MOVEMENT_TYPES),
    span: 5,
  },
  {
    label: 'Categoría',
    name: 'category',
    type: 'select',
    options: toOptions(MOVEMENT_CATEGORIES),
    span: 7,
  },
];

const columns = [
  { dataIndex: 'movementDate', title: 'Fecha', render: formatDate },
  {
    dataIndex: 'type',
    title: 'Tipo',
    render: sType => (
      <Tag color={MOVEMENT_TYPES[sType]?.color}>
        {MOVEMENT_TYPES[sType]?.label}
      </Tag>
    ),
  },
  {
    dataIndex: 'category',
    title: 'Categoría',
    render: sCategory => MOVEMENT_CATEGORIES[sCategory],
  },
  { dataIndex: 'concept', title: 'Concepto' },
  {
    dataIndex: 'amount',
    title: 'Monto',
    align: 'right',
    render: (nAmount, row) => (
      <Typography.Text type={row.type === 'in' ? 'success' : 'danger'}>
        {row.type === 'in' ? '+' : '-'}
        {formatMoney(nAmount)}
      </Typography.Text>
    ),
  },
  {
    dataIndex: 'balanceAfter',
    title: 'Saldo',
    align: 'right',
    render: formatMoney,
  },
];

const MovementList = ({ accountId }) => {
  const [data, loading, change, , { changePage }] = useFetchList(
    `accounts/${accountId}/movements`,
    {
      limit: 20,
    },
  );

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
          showSizeChanger: true,
          onChange: changePage,
        }}
        rowKey="id"
        size="small"
      />
    </>
  );
};

MovementList.propTypes = {
  accountId: PropTypes.string.isRequired,
};

export const AccountMovements = ({ account, onClose }) => (
  <Drawer
    destroyOnHidden
    onClose={onClose}
    open={Boolean(account)}
    size={900}
    title={
      account &&
      `Movimientos de ${account.name} · saldo ${formatMoney(account.balance)}`
    }
  >
    {account && <MovementList accountId={account.id} />}
  </Drawer>
);

AccountMovements.propTypes = {
  account: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};
