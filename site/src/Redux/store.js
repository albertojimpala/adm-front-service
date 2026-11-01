import { persistReducer, persistStore } from 'redux-persist';
import {
  seamlessImmutableReconciler,
  seamlessImmutableTransformCreator,
} from 'redux-persist-seamless-immutable';
import { encryptTransform } from 'redux-persist-transform-encrypt';
import { applyMiddleware, compose, createStore } from 'redux';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import storage from 'redux-persist/lib/storage';
import Logger from 'redux-logger';
import thunk from 'redux-thunk';
import reducer from './reducers';

if (process.env.REACT_APP_LOGS === 'production') {
  const warningTitleCSS = 'color: #0054FF; font-size: 40px; font-weight: bold;';
  const warningDescCSS = 'font-size: 18px;';
  console.log('%cStop!', warningTitleCSS);
  console.log(
    '%cThis is a browser feature intended for developers. If you have any questions please refer to our official channels',
    warningDescCSS
  );
  console.log('%cSee https://umo.chat/ for more information.', warningDescCSS);
}

export const history = createBrowserHistory({
  initialEntries: [{ state: { key: 'home' } }],
});

const transformerConfig = {
  whitelistPerReducer: {
    auth: ['token', 'user', 'role'],
    app: ['app'],
  },
};

const persistConfig = {
  key: 'thc-v1.0',
  storage,
  stateReconciler: seamlessImmutableReconciler,
  transforms: [
    seamlessImmutableTransformCreator(transformerConfig),
    encryptTransform({
      secretKey: process.env.REACT_APP_SECURE_TOKEN || 'ows-site-service',
      onError: function (error) {
        // Handle the error.
        console.log(error);
      },
    }),
  ],
  whitelist: ['auth', 'app'],
};

const persistedReducer = persistReducer(persistConfig, reducer(history));

/* eslint-disable */
export const store =
  process.env.REACT_APP_LOGS === 'production'
    ? createStore(
      persistedReducer,
      compose(applyMiddleware(routerMiddleware(history), thunk))
    ) : createStore(
      persistedReducer,
      compose(applyMiddleware(routerMiddleware(history), Logger, thunk))
    );
/* eslint-enable */

export const persistor = persistStore(store);
