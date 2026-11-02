import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authClear, authSuccess } from '../Redux/reducers/auth';
import { persistor } from '../Redux/store';
import { login, logout as apiLogout } from '../Service/Api';

export const useAuth = () => {
  const auth = useSelector(state => state.auth);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const post = async (email, password) => {
    setLoading(true);
    setError(null);
    const response = await login(email, password);
    setLoading(false);

    if (response?.ok) {
      const { access_token, refresh_token, user } = response.data;
      const { role = {}, ...oUser } = user;
      dispatch(
        authSuccess({
          token: access_token,
          refreshToken: refresh_token,
          user: oUser,
          role,
        }),
      );
    } else if (!response?.status) {
      setError('No se pudo conectar con el servidor');
    } else {
      setError('Correo o contraseña incorrectos');
    }
  };

  const logout = async () => {
    await apiLogout();
    dispatch(authClear());
    persistor.flush();
  };

  return [auth, post, logout, error, loading];
};

// lee el JSON de permisos del rol: ['{"clients":{"read":true}}']
const parsePermissions = aPermissions => {
  try {
    return JSON.parse(aPermissions?.[0] || '{}');
  } catch {
    return {};
  }
};

export const usePermissions = () => {
  const role = useSelector(state => state.auth.role);
  const isSuper = role?.tag === 'super';
  const oPermissions = parsePermissions(role?.permissions);

  // el usuario super tiene acceso a todo, igual que en la API
  const can = useCallback(
    (sModule, sAction = 'read') =>
      isSuper || Boolean(oPermissions?.[sModule]?.[sAction]),
    [isSuper, oPermissions],
  );

  return { can, isSuper };
};
