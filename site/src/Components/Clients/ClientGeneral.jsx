import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  Col,
  Descriptions,
  Flex,
  InputNumber,
  Row,
  Spin,
  Statistic,
  Table,
  Tag,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import { useFetchOne } from '../../Hooks';
import { formatDate, formatMoney } from '../../Utils/format';
import { StatusTag } from '../Atoms/StatusTag';
import { ClientServices } from './ClientServices';

// datos del cliente, mensualidad del año y servicios contratados
// model permite usar la ruta del portal (portal/me), extra agrega acciones arriba
export const ClientGeneral = ({ clientId, model, onChanged, extra }) => {
  const [nYear, setYear] = useState(dayjs().year());
  const [client, loading, update] = useFetchOne(
    model || 'clients',
    model ? undefined : clientId,
    {
      year: nYear,
    },
  );

  if (!client) {
    return <Spin />;
  }

  const oCharge = client.monthlyCharge || {};
  const sAddress = [client.address, client.city, client.state, client.zipCode]
    .filter(Boolean)
    .join(', ');

  const refresh = () => {
    update();
    onChanged?.();
  };

  return (
    <Spin spinning={loading}>
      {extra && (
        <Flex justify="end" style={{ marginBottom: 12 }}>
          {extra}
        </Flex>
      )}
      <Descriptions
        bordered
        column={{ xs: 1, sm: 2, lg: 3 }}
        items={[
          { label: 'Compañía', children: client.company?.name, span: 'filled' },
          {
            label: 'RFC',
            children: client.rfc && (
              <Typography.Text copyable>{client.rfc}</Typography.Text>
            ),
          },
          { label: 'Nombre comercial', children: client.tradeName },
          {
            label: 'Régimen',
            children:
              client.regime &&
              `${client.regime.code} - ${client.regime.description}`,
          },
          {
            label: 'Encargado',
            children: client.manager && (
              <>
                {client.manager.firstName} {client.manager.lastName}
                {client.manager.email && (
                  <Typography.Text type="secondary">
                    {' '}
                    · {client.manager.email}
                  </Typography.Text>
                )}
              </>
            ),
            span: 'filled',
          },
          {
            label: 'Suscripción',
            children: client.subscriptionType?.description,
          },
          { label: 'Día de pago', children: client.billingDay },
          { label: 'Alta', children: formatDate(client.startDate) },
          { label: 'Contacto', children: client.contactName },
          {
            label: 'Email',
            children: client.email && (
              <Typography.Text copyable>{client.email}</Typography.Text>
            ),
          },
          { label: 'Teléfono', children: client.phone },
          { label: 'Dirección', children: sAddress, span: 'filled' },
          { label: 'Estatus', children: <StatusTag status={client.status} /> },
          ...(client.notes
            ? [{ label: 'Notas', children: client.notes, span: 'filled' }]
            : []),
        ]}
        size="small"
      />

      <Card
        extra={
          <Flex align="center" gap={8}>
            Año
            <InputNumber
              max={2100}
              min={2000}
              onChange={n => n && setYear(n)}
              value={nYear}
            />
          </Flex>
        }
        size="small"
        style={{ marginTop: 16 }}
        title={`Mensualidad ${nYear}`}
      >
        <Row gutter={[12, 12]}>
          <Col span={6}>
            <Statistic
              prefix="$"
              precision={2}
              title="Cuota base"
              value={oCharge.baseAmount}
            />
          </Col>
          <Col span={6}>
            <Statistic
              prefix="$"
              precision={2}
              title="Servicios"
              value={oCharge.servicesAmount}
            />
          </Col>
          <Col span={6}>
            <Statistic
              prefix="-$"
              precision={2}
              title={`Descuento (${oCharge.discountPercent || 0}%)`}
              value={oCharge.discountAmount}
            />
          </Col>
          <Col span={6}>
            <Statistic
              prefix="$"
              precision={2}
              styles={{ content: { color: '#1677ff', fontWeight: 'bold' } }}
              title="Total mensual"
              value={oCharge.total}
            />
          </Col>
        </Row>
        <Table
          columns={[
            { dataIndex: 'description', title: 'Concepto' },
            { dataIndex: 'quantity', title: 'Cantidad', align: 'center' },
            {
              dataIndex: 'unitPrice',
              title: 'Precio',
              align: 'right',
              render: (nPrice, row) => (
                <>
                  {formatMoney(nPrice)}{' '}
                  {row.priceYear ? (
                    <Tag>{row.priceYear}</Tag>
                  ) : (
                    <Tag>catálogo</Tag>
                  )}
                </>
              ),
            },
            {
              dataIndex: 'amount',
              title: 'Importe',
              align: 'right',
              render: formatMoney,
            },
          ]}
          dataSource={oCharge.lines || []}
          pagination={false}
          rowKey="serviceId"
          size="small"
          style={{ marginTop: 12 }}
        />
      </Card>

      <Card
        size="small"
        style={{ marginTop: 16 }}
        title="Servicios contratados"
      >
        <ClientServices client={client} onChanged={refresh} year={nYear} />
      </Card>
    </Spin>
  );
};

ClientGeneral.propTypes = {
  clientId: PropTypes.string,
  model: PropTypes.string,
  extra: PropTypes.node,
  onChanged: PropTypes.func,
};
