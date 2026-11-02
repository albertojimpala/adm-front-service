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

// adaptador de localStorage; el default de redux-persist/lib/storage es CJS y
// Vite lo entrega envuelto, lo que deja la app en blanco
const storage = {
  getItem: key => Promise.resolve(window.localStorage.getItem(key)),
  setItem: (key, value) =>
    Promise.resolve(window.localStorage.setItem(key, value)),
  removeItem: key => Promise.resolve(window.localStorage.removeItem(key)),
};

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
