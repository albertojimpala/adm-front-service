import immutable from 'seamless-immutable';
import { createActions, createReducer } from 'reduxsauce';

const { Creators, Types } = createActions({
  authRequest: [],
  authSuccess: ['token', 'user', 'role'],
  authFailure: ['error'],
  authClear: [],
});

const INITIAL_STATE = immutable({
  token: '',
  user: {},
  role: {},
  error: false,
  errorMessage: null,
});

function success(state, action) {
  let { role, token, user } = action;
  return state.merge({
    error: false,
    errorMessage: null,
    loading: false,
    role,
    token,
    user,
  });
}

function request(state) {
  return state.merge({ loading: true, error: false, errorMessage: null });
}

function failure(state, action) {
  let { error } = action;
  return state.merge({
    error: true,
    errorMessage: error,
    loading: false,
  });
}

function clear() {
  return INITIAL_STATE;
}

const HANDLERS = {
  [Types.AUTH_REQUEST]: request,
  [Types.AUTH_SUCCESS]: success,
  [Types.AUTH_FAILURE]: failure,
  [Types.AUTH_CLEAR]: clear,
};

export const Auth = Creators;

export const authTypes = Types;

export default createReducer(INITIAL_STATE, HANDLERS);
