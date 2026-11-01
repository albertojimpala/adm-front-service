import { useState } from 'react';
import { persistor } from '../Redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { Auth } from '../Redux/reducers/auth';
import { App } from '../Redux/reducers/app';
import { login } from '../Service/Api';

export const useAuth = () => {
  const { auth } = useSelector(state => ({ auth: state.auth }));
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const post = async (username, password) => {
    setLoading(true);
    dispatch(Auth.authRequest());
    let response = await login(username, password);

    setLoading(false);
    if (response?.ok) {
      let { accessToken, user } = response.data;
      dispatch(
        Auth.authSuccess(accessToken, user, {
          rol: user.rol,
          rol_id: user.rol_id,
          rol_name: user.rol_name,
        })
      );
    } else {
      dispatch(Auth.authFailure());
      setError(response.data?.message || 'Error  in login');
    }
  };

  const logout = () => {
    dispatch(Auth.authClear());
    dispatch(App.appClear());
    persistor.flush();
    persistor.purge();
  };

  return [auth, post, logout, error, loading];
};
