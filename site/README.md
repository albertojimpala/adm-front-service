# adm-front-service

Front de administración para [api-base-service](../../api-base-service): clientes, servicios y precios por año, cargos mensuales, pagos, cuentas por cobrar, bancos y caja chica, catálogos, usuarios y roles.

**Stack:** React 19 · [Ant Design 6.6.8](https://ant.design/) · Vite · React Router 7 · Redux Toolkit + redux-persist · apisauce · dayjs · Chart.js

## Requisitos

- Node.js 20.19 o superior (22 LTS recomendado)
- Yarn 1 (`npm install -g yarn`)
- La API corriendo (ver el README de `api-base-service`)

## Levantar el proyecto

1. Instalar dependencias:

   ```bash
   yarn install
   ```

2. Copiar las variables de entorno y ajustarlas:

   ```bash
   cp .env.example .env
   ```

   | Variable | Ejemplo | Descripción |
   |---|---|---|
   | `VITE_API_URL` | `http://localhost:3000/api` | URL de la API, con el prefijo `/api`. |
   | `VITE_SECURE_TOKEN` | — | Llave con la que se cifra la sesión guardada en el navegador. |

3. En el `.env` de la API, permitir el origen del front:

   ```
   CORS_ORIGIN=http://localhost:5173
   ```

4. Levantar en modo desarrollo:

   ```bash
   yarn dev
   ```

   Abre `http://localhost:5173` e ingresa con el usuario super que creaste en la API.

## Scripts

```bash
yarn dev       # servidor de desarrollo (http://localhost:5173)
yarn build     # compila a build/
yarn preview   # sirve lo compilado
yarn test      # pruebas (Vitest)
yarn lint      # eslint
yarn format    # prettier
```

## Pantallas

| Menú | Ruta | Módulo de permisos | Qué hace |
|---|---|---|---|
| Inicio | `/dashboard` | — | Por cobrar, vencido, saldo en bancos y caja chica, cobranza del mes y antigüedad de saldos |
| Clientes | `/dashboard/clients` | `clients` | Alta y edición con compañía, encargado y servicios. El detalle muestra la mensualidad por año, los servicios con su historial de precios, los trabajos, el adeudo y el estado de cuenta. Incluye el incremento anual de precios. |
| Trabajos | `/dashboard/jobs` | `jobs` | Trabajos de todos los clientes, con resumen por avance. Se filtran por compañía, cliente, responsable, avance y vencidos. Cambiar el avance (iniciado → pendiente → en proceso → en revisión → finalizado) pide un comentario opcional, y el detalle muestra el historial. |
| Cobranza › Cargos mensuales | `/dashboard/charges` | `charges` | Generar cargos de un periodo, resumen del periodo, detalle, editar vencimiento o notas, cancelar y registrar pago |
| Cobranza › Pagos | `/dashboard/payments` | `payments` | Registrar pagos contra un cargo hacia banco o caja chica, y cancelarlos con motivo. Cada pago tiene folio y botón de **recibo en PDF**, que también aparece al registrar el pago y en el detalle del cargo. Se puede buscar por folio. |
| Cobranza › Cuentas por cobrar | `/dashboard/receivables` | `receivables` | Adeudo por cliente con antigüedad de saldos, cargos pendientes y estado de cuenta |
| Bancos y caja chica | `/dashboard/accounts` | `accounts` | Cuentas, resumen banco vs caja chica, movimientos, gastos, ingresos, ajustes y traspasos |
| Catálogos | `/dashboard/services`, `/subscription-types`, `/regimes` | `services`, `subscriptions`, `regimes` | Catálogos. Los regímenes solo los modifica el usuario super, igual que en la API. |
| Administración › Compañías, Empleados, Puestos | `/dashboard/companies`, `/employees`, `/positions` | `companies`, `employees`, `positions` | Compañías con logo y prefijo de folio (el logo se cambia al editar la compañía), y empleados y puestos de cada compañía. Cada cliente pertenece a una compañía. |
| Administración › Usuarios, Roles | `/dashboard/users`, `/roles` | `users`, `roles` | Usuarios ligados a un empleado o a un cliente, y roles con una matriz de permisos por módulo |
| Portal de clientes | `/portal` | rol `client` | Mis datos y servicios, adeudo, cargos, pagos con su recibo PDF, trabajos con su avance, y estado de cuenta. Solo puede editar su email y teléfono. |

El menú y los botones de crear, editar y eliminar se muestran según los permisos del rol. El rol `super` ve todo. La API además valida el `tag` del rol (`admin` o `users`), así que los roles internos deben usar uno de esos dos tags.

Los usuarios con rol `client` entran directo a `/portal` y no pueden abrir ninguna pantalla de `/dashboard`. Si un usuario interno intenta abrir `/portal`, regresa al sistema. Para dar acceso a un cliente, en **Administración › Usuarios** crea un usuario con el rol de cliente y elige el cliente.

Clientes, cargos, pagos y cuentas por cobrar se pueden filtrar por compañía.

## Estructura

```
src/
  main.jsx, App.jsx        punto de entrada y providers (Redux, antd, router)
  Components/
    Atoms/                 layout, menú, CrudTable, SearchBar, selects remotos
    Forms/                 formularios de antd por recurso
    <Módulo>/              tablas, drawers y modales de cada módulo
  Screens/                 una pantalla por ruta
  Hooks/                   useAuth, usePermissions, useFetchList, useFetchOne
  Service/Api.js           cliente de la API (agrega el token y cierra sesión con 401)
  Redux/                   sesión persistida y cifrada
  Utils/                   rutas del menú, formatos, constantes, errores
  test/                    pruebas de humo con la API simulada
```

Para agregar un catálogo simple basta con un formulario en `Forms/` y una tabla con `CrudTable`; ver por ejemplo `Components/Services/ServiceTable.jsx`.

## Pruebas

`yarn test` monta la aplicación en jsdom con la API simulada (`src/test/fixtures.js`), recorre todas las pantallas y abre los modales y drawers principales. Falla si React o antd reportan cualquier error o advertencia en consola, por ejemplo una prop deprecada.
