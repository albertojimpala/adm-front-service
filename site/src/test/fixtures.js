// respuestas de ejemplo con la misma forma que regresa la API
const meta = total => ({ total, page: 1, limit: 10, totalPages: 1 });
const list = aData => ({
  ok: true,
  status: 200,
  data: { meta: meta(aData.length), data: aData },
});
const one = oData => ({ ok: true, status: 200, data: oData });

const service = {
  id: 's1',
  code: 'FACT',
  description: 'Facturación',
  price: 100,
  status: 1,
};
const subscriptionType = {
  id: 'st1',
  code: 'BAS',
  description: 'Básica',
  basePrice: 0,
  discountPercent: 0,
  status: 1,
};
const regime = {
  id: 'r1',
  code: '601',
  description: 'General de Ley',
  status: 1,
};
const account = {
  id: 'a1',
  name: 'BBVA',
  type: 'bank',
  bankName: 'BBVA',
  balance: 1500,
  status: 1,
};
const pettyCash = {
  id: 'a2',
  name: 'Caja',
  type: 'petty_cash',
  balance: 300,
  status: 1,
};

const company = {
  id: 'co1',
  name: 'Haylex Consultoría Legal y Contable SC',
  tradeName: 'Haylex',
  rfc: 'HCL150310AB1',
  status: 1,
  regime,
};
const position = {
  id: 'po1',
  description: 'Contador general',
  companyId: 'co1',
  company,
  status: 1,
};

const client = {
  companyId: 'co1',
  company,
  id: 'c1',
  name: 'Cliente Uno SA de CV',
  rfc: 'CUN010101AAA',
  email: 'cliente@correo.com',
  billingDay: 5,
  startDate: '2025-01-01',
  status: 1,
  subscriptionType,
  regime,
  services: [
    {
      id: 'cs1',
      serviceId: 's1',
      quantity: 1,
      status: 1,
      service,
      prices: [
        { id: 'p1', year: 2025, price: 100 },
        { id: 'p2', year: 2026, price: 200 },
      ],
    },
  ],
  monthlyCharge: {
    year: 2026,
    baseAmount: 0,
    servicesAmount: 200,
    discountPercent: 0,
    discountAmount: 0,
    total: 200,
    lines: [
      {
        serviceId: 's1',
        description: 'Facturación',
        quantity: 1,
        unitPrice: 200,
        priceYear: 2026,
        amount: 200,
      },
    ],
  },
};

const charge = {
  id: 'ch1',
  clientId: 'c1',
  client,
  period: '2026-01',
  dueDate: '2026-01-05',
  total: 700,
  paidAmount: 300,
  paymentStatus: 'partial',
  status: 1,
  details: [
    {
      id: 'd1',
      description: 'Facturación',
      quantity: 1,
      unitPrice: 200,
      amount: 200,
    },
  ],
  payments: [
    {
      id: 'pay1',
      paymentDate: '2026-01-05',
      method: 'cash',
      amount: 300,
      status: 1,
      account: pettyCash,
    },
  ],
};

const payment = {
  id: 'pay1',
  receiptNumber: 'HAY-000001',
  paymentDate: '2026-01-05',
  method: 'cash',
  amount: 300,
  status: 1,
  client,
  charge,
  account: pettyCash,
};
const aging = {
  current: 0,
  days1to30: 0,
  days31to60: 0,
  days61to90: 0,
  over90: 400,
};

export const fixtures = {
  companies: list([company]),
  positions: list([position]),
  employees: list([
    {
      id: 'e1',
      firstName: 'Mariana',
      lastName: 'López Torres',
      email: 'mariana@example.com',
      companyId: 'co1',
      company,
      positionId: 'po1',
      position,
      status: 1,
    },
  ]),
  clients: list([client]),
  'clients/c1': one(client),
  services: list([service]),
  'subscription-types': list([subscriptionType]),
  regimes: list([regime]),
  users: list([
    {
      id: 'u1',
      username: 'admin',
      email: 'admin@correo.com',
      status: 1,
      isActive: true,
      role: { id: 'ro1', description: 'Super' },
    },
  ]),
  roles: list([
    {
      id: 'ro1',
      description: 'Super',
      tag: 'super',
      permissions: ['{}'],
      status: 1,
    },
    {
      id: 'ro2',
      description: 'Admin',
      tag: 'admin',
      permissions: ['{"clients":{"read":true,"create":true}}'],
      status: 1,
    },
  ]),
  accounts: list([account, pettyCash]),
  'accounts/summary': one({
    totals: {
      bank: { balance: 1500, totalIn: 1500, totalOut: 0, collected: 300 },
      petty_cash: { balance: 300, totalIn: 300, totalOut: 0, collected: 300 },
      balance: 1800,
    },
    data: [],
  }),
  'accounts/a1/movements': list([
    {
      id: 'm1',
      movementDate: '2026-01-05',
      type: 'in',
      category: 'payment',
      concept: 'Pago',
      amount: 300,
      balanceAfter: 300,
    },
  ]),
  charges: list([charge]),
  'charges/ch1': one(charge),
  'charges/summary': one({
    period: '2026-11',
    charges: 1,
    billed: 700,
    collected: 300,
    pending: 400,
    byStatus: [],
  }),
  payments: list([payment]),
  receivables: list([
    {
      clientId: 'c1',
      name: client.name,
      rfc: client.rfc,
      pendingCharges: 1,
      balance: 400,
      overdueBalance: 400,
      oldestDueDate: '2026-01-05',
      aging,
    },
  ]),
  'receivables/summary': one({
    asOf: '2026-11-01',
    clients: 1,
    overdueClients: 1,
    balance: 400,
    overdueBalance: 400,
    aging,
  }),
  'receivables/clients/c1': one({
    client,
    pendingCharges: 1,
    balance: 400,
    overdueBalance: 400,
    overdueCharges: 1,
    oldestDueDate: '2026-01-05',
    aging,
    charges: [{ ...charge, balance: 400, daysOverdue: 300 }],
  }),
  'receivables/clients/c1/statement': one({
    openingBalance: 0,
    totalCharges: 700,
    totalPayments: 300,
    closingBalance: 400,
    movements: [
      {
        date: '2026-01-05',
        type: 'charge',
        concept: 'Mensualidad 2026-01',
        reference: 'ch1',
        charge: 700,
        payment: 0,
        balance: 700,
      },
      {
        date: '2026-01-05',
        type: 'payment',
        concept: 'Pago',
        reference: 'pay1',
        charge: 0,
        payment: 300,
        balance: 400,
      },
    ],
  }),
};

fixtures['portal/me'] = fixtures['clients/c1'];
fixtures['portal/balance'] = fixtures['receivables/clients/c1'];
fixtures['portal/statement'] = fixtures['receivables/clients/c1/statement'];
fixtures['portal/charges'] = fixtures.charges;
fixtures['portal/charges/ch1'] = fixtures['charges/ch1'];
fixtures['portal/payments'] = fixtures.payments;

const employee = fixtures.employees.data.data[0];
const job = {
  id: 'j1',
  clientId: 'c1',
  client,
  employeeId: 'e1',
  employee,
  title: 'Contabilidad 2026-10',
  period: '2026-10',
  dueDate: '2026-11-17',
  progress: 'in_progress',
  status: 1,
};
fixtures.jobs = list([job]);
fixtures['jobs/j1'] = one({
  ...job,
  history: [
    {
      id: 'h1',
      fromProgress: null,
      toProgress: 'started',
      comment: 'Trabajo registrado',
      userName: 'Sofía Ramírez',
      createdAt: '2026-10-01T10:00:00',
    },
    {
      id: 'h2',
      fromProgress: 'started',
      toProgress: 'in_progress',
      comment: 'Documentación recibida',
      userName: 'Sofía Ramírez',
      createdAt: '2026-10-05T10:00:00',
    },
  ],
});
fixtures['jobs/summary'] = one({
  total: 1,
  overdue: 0,
  byProgress: [
    { progress: 'started', count: 0 },
    { progress: 'pending', count: 0 },
    { progress: 'in_progress', count: 1 },
    { progress: 'in_review', count: 0 },
    { progress: 'finished', count: 0 },
  ],
});
fixtures['portal/jobs'] = fixtures.jobs;
fixtures['portal/jobs/j1'] = fixtures['jobs/j1'];
