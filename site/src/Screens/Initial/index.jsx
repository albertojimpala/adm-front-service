import 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import { Card, Col, Empty, Progress, Row, Statistic, Typography } from 'antd';
import dayjs from 'dayjs';
import { useAuth, useFetchOne, usePermissions } from '../../Hooks';
import { AGING_BUCKETS } from '../../Utils/constants';
import { formatMoney, formatPeriod } from '../../Utils/format';

const AGING_COLORS = ['#52c41a', '#fadb14', '#fa8c16', '#fa541c', '#f5222d'];

export const InitialScreen = () => {
  const [{ user }] = useAuth();
  const { can } = usePermissions();
  const sPeriod = dayjs().format('YYYY-MM');

  const [receivables, loadingReceivables] = useFetchOne(
    'receivables/summary',
    undefined,
    undefined,
    can('receivables', 'read'),
  );
  const [charges, loadingCharges] = useFetchOne(
    'charges/summary',
    undefined,
    { period: sPeriod },
    can('charges', 'read'),
  );
  const [accounts, loadingAccounts] = useFetchOne(
    'accounts/summary',
    undefined,
    {
      from: dayjs().startOf('month').format('YYYY-MM-DD'),
      to: dayjs().format('YYYY-MM-DD'),
    },
    can('accounts', 'read'),
  );

  const nCollectedPercent = charges?.billed
    ? Math.round((charges.collected / charges.billed) * 100)
    : 0;

  return (
    <div className="initial-screen">
      <Typography.Title
        level={3}
      >{`Bienvenido ${user?.username || ''}`}</Typography.Title>

      <Row gutter={[16, 16]}>
        {can('receivables', 'read') && (
          <>
            <Col lg={6} sm={12} xs={24}>
              <Card>
                <Statistic
                  loading={loadingReceivables}
                  prefix="$"
                  precision={2}
                  title="Por cobrar"
                  value={receivables?.balance}
                />
                <Typography.Text type="secondary">
                  {receivables?.clients || 0} clientes con adeudo
                </Typography.Text>
              </Card>
            </Col>
            <Col lg={6} sm={12} xs={24}>
              <Card>
                <Statistic
                  loading={loadingReceivables}
                  prefix="$"
                  precision={2}
                  styles={{ content: { color: '#cf1322' } }}
                  title="Vencido"
                  value={receivables?.overdueBalance}
                />
                <Typography.Text type="secondary">
                  {receivables?.overdueClients || 0} clientes con atraso
                </Typography.Text>
              </Card>
            </Col>
          </>
        )}
        {can('accounts', 'read') && (
          <>
            <Col lg={6} sm={12} xs={24}>
              <Card>
                <Statistic
                  loading={loadingAccounts}
                  prefix="$"
                  precision={2}
                  title="Saldo en bancos"
                  value={accounts?.totals?.bank?.balance}
                />
                <Typography.Text type="secondary">
                  Cobrado este mes:{' '}
                  {formatMoney(accounts?.totals?.bank?.collected)}
                </Typography.Text>
              </Card>
            </Col>
            <Col lg={6} sm={12} xs={24}>
              <Card>
                <Statistic
                  loading={loadingAccounts}
                  prefix="$"
                  precision={2}
                  title="Saldo en caja chica"
                  value={accounts?.totals?.petty_cash?.balance}
                />
                <Typography.Text type="secondary">
                  Cobrado este mes:{' '}
                  {formatMoney(accounts?.totals?.petty_cash?.collected)}
                </Typography.Text>
              </Card>
            </Col>
          </>
        )}

        {can('charges', 'read') && (
          <Col lg={8} xs={24}>
            <Card
              loading={loadingCharges}
              title={`Cobranza de ${formatPeriod(sPeriod)}`}
            >
              <div style={{ textAlign: 'center' }}>
                <Progress
                  percent={nCollectedPercent}
                  size={160}
                  type="dashboard"
                />
              </div>
              <Row gutter={8}>
                <Col span={12}>
                  <Statistic
                    prefix="$"
                    precision={2}
                    title="Facturado"
                    value={charges?.billed}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    prefix="$"
                    precision={2}
                    title="Cobrado"
                    value={charges?.collected}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        )}

        {can('receivables', 'read') && (
          <Col lg={16} xs={24}>
            <Card loading={loadingReceivables} title="Antigüedad de saldos">
              {receivables?.balance ? (
                <Bar
                  data={{
                    labels: Object.values(AGING_BUCKETS),
                    datasets: [
                      {
                        label: 'Saldo',
                        data: Object.keys(AGING_BUCKETS).map(
                          sKey => receivables.aging?.[sKey] || 0,
                        ),
                        backgroundColor: AGING_COLORS,
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        callbacks: { label: oItem => formatMoney(oItem.raw) },
                      },
                    },
                  }}
                />
              ) : (
                <Empty description="Sin saldos por cobrar" />
              )}
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};
