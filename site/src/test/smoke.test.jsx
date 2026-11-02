import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { fixtures } from './fixtures';

// la API se simula con fixtures, se registran las llamadas
const calls = [];
vi.mock('../Service/Api', async importOriginal => {
  const original = await importOriginal();
  return {
    ...original,
    login: vi.fn(),
    logout: vi.fn(async () => ({ ok: true })),
    getFile: vi.fn(async () => ({ ok: true, status: 200, data: new Blob() })),
    uploadFile: vi.fn(async () => ({ ok: true, status: 201, data: {} })),
    openPdf: vi.fn(async path => {
      calls.push({ operation: 'PDF', sKey: path });
      return { ok: true, status: 200 };
    }),
    process: vi.fn(async (operation, model, payload, params = {}) => {
      const sKey = params?.id ? `${model}/${params.id}` : model;
      calls.push({ operation, sKey, payload, queries: params?.queries });
      if (operation !== 'GET' && operation !== 'FIND') {
        return { ok: true, status: 200, data: {} };
      }
      return (
        fixtures[sKey] || {
          ok: false,
          status: 404,
          data: { message: `sin fixture ${sKey}` },
        }
      );
    }),
  };
});

// chart.js necesita canvas, en la prueba basta con un div
vi.mock('react-chartjs-2', () => ({ Bar: () => <div>grafica</div> }));

let App;
let store;
const errors = [];

beforeAll(async () => {
  const oStore = await import('../Redux/store');
  const { authSuccess } = await import('../Redux/reducers/auth');
  store = oStore.store;
  store.dispatch(
    authSuccess({
      token: 'token',
      user: { id: 'u1', username: 'admin' },
      role: { tag: 'super', description: 'Super', permissions: ['{}'] },
    }),
  );
  App = (await import('../App')).default;

  // cualquier error o advertencia de React/antd (props deprecadas, keys, etc.) hace fallar la prueba
  vi.spyOn(console, 'error').mockImplementation((...args) =>
    errors.push(args.join(' ')),
  );
  vi.spyOn(console, 'warn').mockImplementation((...args) =>
    errors.push(args.join(' ')),
  );
});

afterEach(() => {
  cleanup();
  const aErrors = errors.splice(0);
  calls.length = 0;
  expect(aErrors).toEqual([]);
});

const renderAt = sPath => {
  window.history.pushState({}, '', sPath);
  return render(<App />);
};

const SCREENS = [
  ['/dashboard', 'Bienvenido admin'],
  ['/dashboard/clients', 'Cliente Uno SA de CV'],
  ['/dashboard/charges', 'Resumen del periodo'],
  ['/dashboard/payments', 'Registrar pago'],
  ['/dashboard/receivables', 'Total por cobrar'],
  ['/dashboard/accounts', 'Saldo total'],
  ['/dashboard/services', 'Facturación'],
  ['/dashboard/subscription-types', 'Básica'],
  ['/dashboard/regimes', 'General de Ley'],
  ['/dashboard/users', 'admin@correo.com'],
  ['/dashboard/roles', 'Acceso total'],
  ['/dashboard/companies', 'HCL150310AB1'],
  ['/dashboard/employees', 'mariana@example.com'],
  ['/dashboard/positions', 'Contador general'],
  ['/dashboard/jobs', 'Contabilidad 2026-10'],
];

describe('pantallas', () => {
  it.each(SCREENS)('%s carga sin errores', async (sPath, sText) => {
    renderAt(sPath);
    expect((await screen.findAllByText(sText)).length).toBeGreaterThan(0);
  });
});

describe('flujos', () => {
  it('detalle de cliente muestra servicios y precio del año', async () => {
    renderAt('/dashboard/clients');
    await screen.findByText('Cliente Uno SA de CV');
    fireEvent.click(document.querySelector('.anticon-eye').closest('button'));
    expect(await screen.findByText('Servicios contratados')).toBeTruthy();
    expect(screen.getByText('Total mensual')).toBeTruthy();
    await waitFor(() =>
      expect(calls.some(c => c.sKey === 'clients/c1')).toBe(true),
    );
  });

  it('crear cliente manda el payload esperado', async () => {
    renderAt('/dashboard/clients');
    await screen.findByText('Cliente Uno SA de CV');
    fireEvent.click(screen.getByRole('button', { name: /Crear/ }));
    const oModal = await screen.findByRole('dialog');
    fireEvent.change(within(oModal).getByLabelText('Nombre o razón social'), {
      target: { value: 'Nuevo Cliente' },
    });
    fireEvent.change(within(oModal).getByLabelText('RFC'), {
      target: { value: 'nue010101abc' },
    });
    fireEvent.mouseDown(
      within(oModal).getByRole('combobox', { name: 'Compañía' }),
    );
    fireEvent.click(await screen.findByTitle('Haylex'));
    fireEvent.click(within(oModal).getByRole('button', { name: 'Crear' }));
    await waitFor(() =>
      expect(calls.some(c => c.operation === 'POST')).toBe(true),
    );
    const oCall = calls.find(c => c.operation === 'POST');
    expect(oCall.sKey).toBe('clients');
    expect(oCall.payload).toMatchObject({
      companyId: 'co1',
      name: 'Nuevo Cliente',
      rfc: 'NUE010101ABC',
      billingDay: 1,
    });
  });

  it('crear rol guarda los permisos como un JSON en arreglo', async () => {
    renderAt('/dashboard/roles');
    await screen.findByText('Acceso total');
    fireEvent.click(screen.getByRole('button', { name: /Crear/ }));
    const oModal = await screen.findByRole('dialog');
    fireEvent.change(within(oModal).getByLabelText('Descripción'), {
      target: { value: 'Cobranza' },
    });
    fireEvent.change(within(oModal).getByLabelText('Tag'), {
      target: { value: 'users' },
    });
    fireEvent.click(within(oModal).getByRole('checkbox', { name: 'Clientes' }));
    fireEvent.click(within(oModal).getByRole('button', { name: 'Crear' }));
    await waitFor(() =>
      expect(calls.some(c => c.operation === 'POST')).toBe(true),
    );
    const { payload } = calls.find(c => c.operation === 'POST');
    expect(payload.permissions).toHaveLength(1);
    expect(JSON.parse(payload.permissions[0]).clients).toEqual({
      read: true,
      create: true,
      update: true,
      delete: true,
    });
  });

  it('detalle de cuenta por cobrar muestra cargos y estado de cuenta', async () => {
    renderAt('/dashboard/receivables');
    await screen.findAllByText('Cliente Uno SA de CV');
    fireEvent.click(document.querySelector('.anticon-eye').closest('button'));
    expect(
      await screen.findByRole('tab', { name: 'Cargos pendientes' }),
    ).toBeTruthy();
    fireEvent.click(screen.getByRole('tab', { name: 'Estado de cuenta' }));
    expect(await screen.findByText('Saldo final')).toBeTruthy();
  });

  it.each([
    ['/dashboard/payments', 'Registrar pago', 'Cuenta destino'],
    ['/dashboard/charges', 'Generar cargos', 'Periodo'],
    ['/dashboard/accounts', 'Traspaso', 'De la cuenta'],
    ['/dashboard/clients', 'Incremento anual', 'Tipo de incremento'],
  ])('%s abre el modal %s', async (sPath, sButton, sField) => {
    renderAt(sPath);
    fireEvent.click(
      await screen.findByRole('button', { name: new RegExp(sButton) }),
    );
    const oModal = await screen.findByRole('dialog');
    expect(within(oModal).getByText(sField)).toBeTruthy();
  });

  it('drawers de cargo, movimientos y precio por año', async () => {
    renderAt('/dashboard/charges');
    await screen.findByText('Cliente Uno SA de CV');
    fireEvent.click(document.querySelector('.anticon-eye').closest('button'));
    expect(await screen.findByText('Detalle del cargo')).toBeTruthy();
    cleanup();

    renderAt('/dashboard/accounts');
    await screen.findAllByText('BBVA', { selector: 'td' });
    fireEvent.click(
      document.querySelector('.anticon-unordered-list').closest('button'),
    );
    expect(await screen.findByText(/Movimientos de BBVA/)).toBeTruthy();
    cleanup();

    renderAt('/dashboard/clients');
    await screen.findByText('Cliente Uno SA de CV');
    fireEvent.click(document.querySelector('.anticon-eye').closest('button'));
    await screen.findByText('Servicios contratados');
    fireEvent.click(
      document.querySelector('.anticon-calendar').closest('button'),
    );
    expect(
      await screen.findByText(/Precio por año de Facturación/),
    ).toBeTruthy();
  });

  it('usuario con rol client solo usa el portal', async () => {
    store.dispatch({
      type: 'auth/authSuccess',
      payload: {
        role: { tag: 'client', description: 'Cliente', permissions: ['{}'] },
      },
    });
    renderAt('/dashboard/clients');
    // se redirige al portal y nunca consulta endpoints internos
    expect(await screen.findByText('Mi cuenta')).toBeTruthy();
    expect(await screen.findAllByText('Cliente Uno SA de CV')).toBeTruthy();
    expect(window.location.pathname).toBe('/portal');
    expect(
      screen.queryByRole('button', { name: /Agregar servicio/ }),
    ).toBeNull();
    await waitFor(() =>
      expect(calls.some(c => c.sKey === 'portal/me')).toBe(true),
    );
    expect(calls.every(c => c.sKey.startsWith('portal/'))).toBe(true);

    // editar contacto manda solo email y telefono
    fireEvent.click(
      screen.getByRole('button', { name: /Editar email y teléfono/ }),
    );
    const oModal = await screen.findByRole('dialog');
    fireEvent.change(within(oModal).getByLabelText('Teléfono'), {
      target: { value: '5511112222' },
    });
    fireEvent.click(within(oModal).getByRole('button', { name: 'Guardar' }));
    await waitFor(() =>
      expect(calls.some(c => c.operation === 'PATCH')).toBe(true),
    );
    const oPatch = calls.find(c => c.operation === 'PATCH');
    expect(oPatch.sKey).toBe('portal/me');
    expect(Object.keys(oPatch.payload).sort()).toEqual(['email', 'phone']);

    for (const sTab of ['Adeudo', 'Cargos', 'Pagos', 'Estado de cuenta']) {
      fireEvent.click(screen.getByRole('tab', { name: sTab }));
    }
    expect(await screen.findByText('Saldo final')).toBeTruthy();

    store.dispatch({
      type: 'auth/authSuccess',
      payload: {
        role: { tag: 'super', description: 'Super', permissions: ['{}'] },
      },
    });
  });

  it('staff que entra a /portal regresa al sistema', async () => {
    renderAt('/portal');
    expect(await screen.findByText('Bienvenido admin')).toBeTruthy();
    expect(window.location.pathname).toBe('/dashboard');
  });

  it('usuario con rol client exige cliente en el formulario', async () => {
    fixtures.roles.data.data.push({
      id: 'ro3',
      description: 'Cliente (portal)',
      tag: 'client',
      permissions: ['{}'],
      status: 1,
    });
    renderAt('/dashboard/users');
    await screen.findByText('admin@correo.com');
    fireEvent.click(screen.getByRole('button', { name: /Crear/ }));
    const oModal = await screen.findByRole('dialog');
    expect(within(oModal).getByText('Empleado')).toBeTruthy();
    fireEvent.mouseDown(within(oModal).getByRole('combobox', { name: 'Rol' }));
    fireEvent.click(await screen.findByTitle('Cliente (portal)'));
    expect(await within(oModal).findByText(/Usuario del portal/)).toBeTruthy();
    expect(within(oModal).queryByText('Empleado')).toBeNull();
    fixtures.roles.data.data.pop();
  });

  it('cambiar avance de un trabajo y ver su historial', async () => {
    renderAt('/dashboard/jobs');
    await screen.findByText('Contabilidad 2026-10');
    fireEvent.click(document.querySelector('.anticon-rise').closest('button'));
    const oModal = await screen.findByRole('dialog');
    fireEvent.click(within(oModal).getByText('En revisión'));
    fireEvent.change(within(oModal).getByLabelText('Comentario'), {
      target: { value: 'Listo para revisar' },
    });
    fireEvent.click(
      within(oModal).getByRole('button', { name: 'Guardar avance' }),
    );
    await waitFor(() =>
      expect(calls.some(c => c.operation === 'PATCH')).toBe(true),
    );
    const oPatch = calls.find(c => c.operation === 'PATCH');
    expect(oPatch.sKey).toBe('jobs/j1/progress');
    expect(oPatch.payload).toEqual({
      progress: 'in_review',
      comment: 'Listo para revisar',
    });

    fireEvent.click(document.querySelector('.anticon-eye').closest('button'));
    expect(await screen.findByText('Historial de avance')).toBeTruthy();
    expect(await screen.findByText('Documentación recibida')).toBeTruthy();
  });

  it('recibo PDF desde pagos', async () => {
    renderAt('/dashboard/payments');
    await screen.findByText('HAY-000001');
    fireEvent.click(
      document.querySelector('.anticon-file-pdf').closest('button'),
    );
    await waitFor(() =>
      expect(calls.some(c => c.operation === 'PDF')).toBe(true),
    );
    expect(calls.find(c => c.operation === 'PDF').sKey).toBe(
      'payments/pay1/receipt',
    );
  });

  it('portal: trabajos y recibo con la ruta del cliente', async () => {
    store.dispatch({
      type: 'auth/authSuccess',
      payload: {
        role: { tag: 'client', description: 'Cliente', permissions: ['{}'] },
      },
    });
    renderAt('/portal');
    await screen.findByText('Mi cuenta');
    fireEvent.click(screen.getByRole('tab', { name: 'Trabajos' }));
    expect(await screen.findByText('Contabilidad 2026-10')).toBeTruthy();
    expect(document.querySelector('.anticon-rise')).toBeNull();

    fireEvent.click(screen.getByRole('tab', { name: 'Pagos' }));
    await screen.findByText('HAY-000001');
    fireEvent.click(
      document.querySelector('.anticon-file-pdf').closest('button'),
    );
    await waitFor(() =>
      expect(calls.some(c => c.operation === 'PDF')).toBe(true),
    );
    expect(calls.find(c => c.operation === 'PDF').sKey).toBe(
      'portal/payments/pay1/receipt',
    );
    expect(calls.every(c => c.sKey.startsWith('portal/'))).toBe(true);

    store.dispatch({
      type: 'auth/authSuccess',
      payload: {
        role: { tag: 'super', description: 'Super', permissions: ['{}'] },
      },
    });
  });

  it('usuario sin permiso no ve el modulo', async () => {
    store.dispatch({
      type: 'auth/authSuccess',
      payload: {
        role: { tag: 'users', permissions: ['{"clients":{"read":true}}'] },
      },
    });
    renderAt('/dashboard/accounts');
    expect(await screen.findByText('Sin acceso')).toBeTruthy();
    expect(screen.queryByText('Bancos y caja chica')).toBeNull();
    store.dispatch({
      type: 'auth/authSuccess',
      payload: {
        role: { tag: 'super', description: 'Super', permissions: ['{}'] },
      },
    });
  });
});
