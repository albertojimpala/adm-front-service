import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Col, Row, Statistic, Table, Tag, Tooltip } from 'antd';
import { DollarOutlined } from '@ant-design/icons';
import { useFetchOne, usePermissions } from '../../Hooks';
import { PAYMENT_STATUS } from '../../Utils/constants';
import { formatDate, formatMoney, formatPeriod } from '../../Utils/format';
import { PaymentModal } from '../Payments/PaymentModal';
import { AgingTags } from './AgingTags';

// adeudo de un cliente: cargos con saldo pendiente
// model permite usar la ruta del portal (portal/balance)
export const ClientPendingCharges = ({ clientId, model, onChanged }) => {
  const { can } = usePermissions();
  const [data, loading, update] = useFetchOne(
    model || 'receivables/clients',
    model ? undefined : clientId,
  );
  const [paying, setPaying] = useState(null);

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
      dataIndex: 'balance',
      title: 'Saldo',
      align: 'right',
      render: n => <strong>{formatMoney(n)}</strong>,
    },
    {
      dataIndex: 'daysOverdue',
      title: 'Atraso',
      render: nDays =>
        nDays > 0 ? (
          <Tag color="red">{nDays} días</Tag>
        ) : (
          <Tag color="green">Al corriente</Tag>
        ),
    },
    {
      dataIndex: 'paymentStatus',
      title: 'Estatus',
      render: sStatus => (
        <Tag color={PAYMENT_STATUS[sStatus]?.color}>
          {PAYMENT_STATUS[sStatus]?.label}
        </Tag>
      ),
    },
    ...(can('payments', 'create')
      ? [
          {
            key: 'actions',
            width: 1,
            render: (_, row) => (
              <Tooltip title="Registrar pago">
                <Button
                  icon={<DollarOutlined />}
                  onClick={() => setPaying({ ...row, client: data?.client })}
                />
              </Tooltip>
            ),
          },
        ]
      : []),
  ];

  return (
    <div>
      <Row gutter={[12, 12]}>
        <Col xs={12} md={6}>
          <Card size="small">
            <Statistic
              loading={loading}
              prefix="$"
              precision={2}
              title="Saldo total"
              value={data?.balance}
            />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card size="small">
            <Statistic
              loading={loading}
              prefix="$"
              precision={2}
              styles={{
                content: {
                  color: data?.overdueBalance ? '#cf1322' : undefined,
                },
              }}
              title="Vencido"
              value={data?.overdueBalance}
            />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card size="small">
            <Statistic
              loading={loading}
              title="Cargos pendientes"
              value={data?.pendingCharges}
            />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card size="small">
            <Statistic
              loading={loading}
              title="Vencimiento más antiguo"
              value={data?.oldestDueDate ? formatDate(data.oldestDueDate) : '-'}
            />
          </Card>
        </Col>
        <Col span={24}>
          <AgingTags aging={data?.aging} />
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={data?.charges || []}
        loading={loading}
        pagination={false}
        rowKey="id"
        scroll={{ x: 'max-content' }}
        size="small"
        style={{ marginTop: 16 }}
      />
      <PaymentModal
        charge={paying}
        onClose={() => setPaying(null)}
        onSaved={() => {
          update();
          onChanged?.();
        }}
        open={Boolean(paying)}
      />
    </div>
  );
};

ClientPendingCharges.propTypes = {
  clientId: PropTypes.string,
  model: PropTypes.string,
  onChanged: PropTypes.func,
};
