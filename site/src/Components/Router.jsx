import { Navigate, Route, Routes } from 'react-router-dom';
import {
  AccountsScreen,
  ChargesScreen,
  ClientsScreen,
  CompaniesScreen,
  Dashboard,
  EmployeesScreen,
  InitialScreen,
  JobsScreen,
  LoginScreen,
  PaymentsScreen,
  PortalScreen,
  PositionsScreen,
  ProfileScreen,
  ReceivablesScreen,
  RegimesScreen,
  RolesScreen,
  ServicesScreen,
  SubscriptionTypesScreen,
  UsersScreen,
} from '../Screens';
import { flatRoutes } from '../Utils/routes';
import { ClientRoute, ProtectedRoute, PublicRoute } from './ProtectedRoute';

const SCREENS = {
  clients: ClientsScreen,
  charges: ChargesScreen,
  payments: PaymentsScreen,
  receivables: ReceivablesScreen,
  accounts: AccountsScreen,
  services: ServicesScreen,
  'subscription-types': SubscriptionTypesScreen,
  regimes: RegimesScreen,
  jobs: JobsScreen,
  companies: CompaniesScreen,
  employees: EmployeesScreen,
  positions: PositionsScreen,
  users: UsersScreen,
  roles: RolesScreen,
};

const Router = () => (
  <Routes>
    <Route
      element={
        <PublicRoute>
          <LoginScreen />
        </PublicRoute>
      }
      path="/"
    />
    <Route
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
      path="/dashboard"
    >
      <Route element={<InitialScreen />} index />
      <Route element={<ProfileScreen />} path="profile" />
      {flatRoutes
        .filter(oRoute => SCREENS[oRoute.key])
        .map(({ key, path, module }) => {
          const Screen = SCREENS[key];
          return (
            <Route
              element={
                <ProtectedRoute module={module}>
                  <Screen />
                </ProtectedRoute>
              }
              key={key}
              path={path}
            />
          );
        })}
    </Route>
    <Route
      element={
        <ClientRoute>
          <PortalScreen />
        </ClientRoute>
      }
      path="/portal"
    />
    <Route element={<Navigate replace to="/" />} path="*" />
  </Routes>
);

export default Router;
