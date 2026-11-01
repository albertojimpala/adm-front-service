import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import auth from './auth';
import app from './app';
import error from './error';

const reducer = history =>
  combineReducers({
    router: connectRouter(history),
    app,
    auth,
    error,
  });

export default reducer;
