import PropTypes from 'prop-types';
import { Card, Descriptions, Drawer, Spin, Table, Tag } from 'antd';
import { useFetchOne } from '../../Hooks';
import { ACCOUNT_TYPES, PAYMENT_METHODS } from '../../Utils/constants';
import { formatDate, formatMoney, formatPeriod } from '../../Utils/format';
import { ChargeStatusTag } from './ChargeStatusTag';
import { ReceiptButton } from '../Atoms/ReceiptButton';

const ChargeInfo = ({ chargeId, model }) => {
  const [charge, loading] = useFetchOne(model, chargeId);

  if (!charge) {
    return <Spin />;
  }

  return (
    <Spin spinning={loading}>
      <Descriptions
        bordered
        column={2}
        items={[
          { label: 'Cliente', children: charge.client?.name, span: 2 },
          { label: 'Periodo', children: formatPeriod(charge.period) },
          { label: 'Vence', children: formatDate(charge.dueDate) },
          { label: 'Suscripción', children: charge.subscriptionDescription },
          { label: 'Estatus', children: <ChargeStatusTag charge={charge} /> },
          { label: 'Cuota base', children: formatMoney(charge.baseAmount) },
          { label: 'Servicios', children: formatMoney(charge.servicesAmount) },
          { label: 'Descuento', children: formatMoney(charge.discountAmount) },
          {
            label: 'Total',
            children: <strong>{formatMoney(charge.total)}</strong>,
          },
          { label: 'Pagado', children: formatMoney(charge.paidAmount) },
          {
            label: 'Saldo',
            children: (
              <strong>{formatMoney(charge.total - charge.paidAmount)}</strong>
            ),
          },
          ...(charge.notes
            ? [{ label: 'Notas', children: charge.notes, span: 2 }]
            : []),
        ]}
        size="small"
      />

      <Card size="small" style={{ marginTop: 16 }} title="Detalle">
        <Table
          columns={[
            { dataIndex: 'description', title: 'Concepto' },
            { dataIndex: 'quantity', title: 'Cantidad', align: 'center' },
            {
              dataIndex: 'unitPrice',
              title: 'Precio',
              align: 'right',
              render: formatMoney,
            },
            {
              dataIndex: 'amount',
              title: 'Importe',
              align: 'right',
              render: formatMoney,
            },
          ]}
          dataSource={charge.details || []}
          pagination={false}
          rowKey="id"
          scroll={{ x: 'max-content' }}
          size="small"
        />
      </Card>

      <Card size="small" style={{ marginTop: 16 }} title="Pagos">
        <Table
          columns={[
            { dataIndex: 'receiptNumber', title: 'Folio' },
            { dataIndex: 'paymentDate', title: 'Fecha', render: formatDate },
            {
              dataIndex: 'method',
              title: 'Forma',
              render: sMethod => PAYMENT_METHODS[sMethod],
            },
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
            { dataIndex: 'reference', title: 'Referencia' },
            {
              dataIndex: 'amount',
              title: 'Monto',
              align: 'right',
              render: formatMoney,
            },
            {
              dataIndex: 'status',
              title: 'Estatus',
              render: (nStatus, row) =>
                nStatus === 1 ? (
                  <Tag color="green">Aplicado</Tag>
                ) : (
                  <Tag title={row.cancelReason}>Cancelado</Tag>
                ),
            },
            {
              key: 'receipt',
              width: 1,
              render: (_, row) => (
                <ReceiptButton
                  payment={row}
                  portal={model.startsWith('portal')}
                  size="small"
                />
              ),
            },
          ]}
          dataSource={charge.payments || []}
          locale={{ emptyText: 'Sin pagos' }}
          pagination={false}
          rowKey="id"
          scroll={{ x: 'max-content' }}
          size="small"
        />
      </Card>
    </Spin>
  );
};

ChargeInfo.propTypes = {
  chargeId: PropTypes.string.isRequired,
  model: PropTypes.string.isRequired,
};

// model permite usar la ruta del portal (portal/charges)
export const ChargeDetail = ({ charge, onClose, model = 'charges' }) => (
  <Drawer
    destroyOnHidden
    onClose={onClose}
    open={Boolean(charge)}
    size="min(820px, 100vw)"
    title="Detalle del cargo"
  >
    {charge && <ChargeInfo chargeId={charge.id} model={model} />}
  </Drawer>
);

ChargeDetail.propTypes = {
  charge: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  model: PropTypes.string,
};
