import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';
import { encryptTransform } from 'redux-persist-transform-encrypt';
import auth from './reducers/auth';

const REMEMBER_KEY = 'adm-remember';
const REMEMBER_EMAIL_KEY = 'adm-remember-email';

/*
 * "Recordarme": con la casilla marcada la sesion se guarda en localStorage y sobrevive
 * a cerrar el navegador; sin marcar va a sessionStorage y se pierde al cerrar la
 * pestaña. El adaptador es propio porque el default de redux-persist/lib/storage es
 * CJS y Vite lo entrega envuelto, lo que deja la app en blanco.
 */
const safe = fn => {
  try {
    return fn();
  } catch {
    // almacenamiento bloqueado (modo privado, politicas del navegador)
    return null;
  }
};

export const isRemembered = () =>
  safe(() => window.localStorage.getItem(REMEMBER_KEY)) === '1';

const target = () =>
  isRemembered() ? window.localStorage : window.sessionStorage;
const other = () =>
  isRemembered() ? window.sessionStorage : window.localStorage;

const storage = {
  getItem: key => Promise.resolve(safe(() => target().getItem(key))),
  setItem: (key, value) =>
    Promise.resolve(
      safe(() => {
        target().setItem(key, value);
        // nunca quedan dos copias: la sesion vive solo donde se eligio
        other().removeItem(key);
      }),
    ),
  removeItem: key =>
    Promise.resolve(
      safe(() => {
        window.localStorage.removeItem(key);
        window.sessionStorage.removeItem(key);
      }),
    ),
};

// se llama al iniciar sesion, antes de guardar el usuario
export const setRemember = (remember, email) =>
  safe(() => {
    if (remember) {
      window.localStorage.setItem(REMEMBER_KEY, '1');
      window.localStorage.setItem(REMEMBER_EMAIL_KEY, email);
    } else {
      window.localStorage.removeItem(REMEMBER_KEY);
      window.localStorage.removeItem(REMEMBER_EMAIL_KEY);
    }
  });

// correo para prellenar el login cuando se marco "Recordarme"
export const rememberedEmail = () =>
  safe(() => window.localStorage.getItem(REMEMBER_EMAIL_KEY)) || '';

const persistConfig = {
  key: 'adm-v2.0',
  storage,
  whitelist: ['auth'],
  transforms: [
    encryptTransform({
      secretKey: import.meta.env.VITE_SECURE_TOKEN || 'adm-front-service',
      onError: error => console.log(error),
    }),
  ],
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({ auth }),
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
