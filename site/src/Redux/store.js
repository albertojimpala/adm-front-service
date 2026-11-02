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
import storage from 'redux-persist/lib/storage';
import { encryptTransform } from 'redux-persist-transform-encrypt';
import auth from './reducers/auth';

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
