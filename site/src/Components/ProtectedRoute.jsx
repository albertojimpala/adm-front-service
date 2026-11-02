import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Result } from 'antd';
import { usePermissions } from '../Hooks';

// los usuarios con rol client solo usan el portal
const homeOf = role => (role?.tag === 'client' ? '/portal' : '/dashboard');

// sistema interno: requiere sesion de un usuario que no sea cliente;
// si se indica module tambien requiere permiso de lectura
export const ProtectedRoute = ({ children, module }) => {
  const { token, role } = useSelector(state => state.auth);
  const { can } = usePermissions();

  if (!token) {
    return <Navigate replace to="/" />;
  }
  if (role?.tag === 'client') {
    return <Navigate replace to="/portal" />;
  }
  if (module && !can(module)) {
    return (
      <Result
        status="403"
        subTitle="No tienes permiso para ver esta sección"
        title="Sin acceso"
      />
    );
  }
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  module: PropTypes.string,
};

// portal de clientes: solo usuarios con rol client
export const ClientRoute = ({ children }) => {
  const { token, role } = useSelector(state => state.auth);

  if (!token) {
    return <Navigate replace to="/" />;
  }
  if (role?.tag !== 'client') {
    return <Navigate replace to="/dashboard" />;
  }
  return children;
};

ClientRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

// solo sin sesion (login)
export const PublicRoute = ({ children }) => {
  const { token, role } = useSelector(state => state.auth);
  return token ? <Navigate replace to={homeOf(role)} /> : children;
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
