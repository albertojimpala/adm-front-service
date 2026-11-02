import { useState } from 'react';
import {
  Button,
  Card,
  Col,
  Row,
  Statistic,
  Table,
  Tooltip,
  Typography,
} from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useFetchList, useFetchOne } from '../../Hooks';
import { formatDate, formatMoney } from '../../Utils/format';
import { ScreenHeader } from '../Atoms/ScreenHeader';
import { SearchBar } from '../Atoms/SearchBar';
import { AgingTags, agingColumns } from './AgingTags';
import { ReceivableDetail } from './ReceivableDetail';

const searchElements = [
  { label: 'Cliente o RFC', name: 'search' },
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
    label: 'Solo vencidos',
    name: 'onlyOverdue',
    type: 'select',
    options: [{ value: 'true', label: 'Sí' }],
  },
];

const SORTABLE = ['name', 'balance', 'overdueBalance', 'oldestDueDate'];

export const ReceivableTable = () => {
  const [summary, loadingSummary, updateSummary] = useFetchOne(
    'receivables/summary',
  );
  const [data, loading, change, update] = useFetchList('receivables', {
    sort: 'balance',
    order: 'DESC',
  });
  const [filters, setFilters] = useState({});
  const [selected, setSelected] = useState(null);

  const columns = [
    {
      dataIndex: 'name',
      key: 'name',
      title: 'Cliente',
      sorter: true,
      render: (sName, row) => (
        <>
          <Typography.Text strong>{sName}</Typography.Text>
          <br />
          <Typography.Text type="secondary">{row.rfc}</Typography.Text>
        </>
      ),
    },
    { dataIndex: 'pendingCharges', title: 'Cargos', align: 'center' },
    {
      dataIndex: 'balance',
      key: 'balance',
      title: 'Saldo',
      align: 'right',
      sorter: true,
      defaultSortOrder: 'descend',
      render: n => <strong>{formatMoney(n)}</strong>,
    },
    {
      dataIndex: 'overdueBalance',
      key: 'overdueBalance',
      title: 'Vencido',
      align: 'right',
      sorter: true,
      render: n => (
        <span style={{ color: n ? '#cf1322' : undefined }}>
          {formatMoney(n)}
        </span>
      ),
    },
    ...agingColumns,
    {
      dataIndex: 'oldestDueDate',
      key: 'oldestDueDate',
      title: 'Más antiguo',
      sorter: true,
      render: formatDate,
    },
    {
      key: 'actions',
      fixed: 'right',
      width: 1,
      render: (_, row) => (
        <Tooltip title="Ver adeudo y estado de cuenta">
          <Button icon={<EyeOutlined />} onClick={() => setSelected(row)} />
        </Tooltip>
      ),
    },
  ];

  const _handleSearch = oQueries => {
    setFilters(oQueries);
    change(oQueries);
  };

  const _handleTableChange = (oPagination, _filters, oSorter) => {
    const sSort =
      SORTABLE.includes(oSorter?.columnKey) && oSorter.order
        ? oSorter.columnKey
        : 'balance';
    const sOrder = oSorter?.order === 'ascend' ? 'ASC' : 'DESC';
    change(
      { ...filters, sort: sSort, order: sOrder, limit: oPagination.pageSize },
      oPagination.current,
    );
  };

  const refresh = () => {
    update();
    updateSummary();
  };

  return (
    <div>
      <ScreenHeader title="Cuentas por cobrar" />
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        <Col md={6} xs={12}>
          <Card size="small">
            <Statistic
              loading={loadingSummary}
              prefix="$"
              precision={2}
              title="Total por cobrar"
              value={summary?.balance}
            />
          </Card>
        </Col>
        <Col md={6} xs={12}>
          <Card size="small">
            <Statistic
              loading={loadingSummary}
              prefix="$"
              precision={2}
              styles={{ content: { color: '#cf1322' } }}
              title="Vencido"
              value={summary?.overdueBalance}
            />
          </Card>
        </Col>
        <Col md={6} xs={12}>
          <Card size="small">
            <Statistic
              loading={loadingSummary}
              title="Clientes con adeudo"
              value={summary?.clients}
            />
          </Card>
        </Col>
        <Col md={6} xs={12}>
          <Card size="small">
            <Statistic
              loading={loadingSummary}
              title="Clientes con atraso"
              value={summary?.overdueClients}
            />
          </Card>
        </Col>
        <Col span={24}>
          <AgingTags aging={summary?.aging} />
        </Col>
      </Row>

      <SearchBar elements={searchElements} handleSearch={_handleSearch} />

      <Table
        columns={columns}
        dataSource={data.data}
        loading={loading}
        onChange={_handleTableChange}
        pagination={{
          current: data.meta?.page,
          pageSize: data.meta?.limit,
          total: data.meta?.total,
          showSizeChanger: true,
          showTotal: nTotal => `${nTotal} clientes`,
        }}
        rowKey="clientId"
        scroll={{ x: 'max-content' }}
      />

      <ReceivableDetail
        client={selected}
        onChanged={refresh}
        onClose={() => setSelected(null)}
      />
    </div>
  );
};
