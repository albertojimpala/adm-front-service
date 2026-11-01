import immutable from 'seamless-immutable';
import { createReducer, createActions } from 'reduxsauce';

const { Creators, Types } = createActions({
  appDrawer: ['drawer'],
  appClear: [],
});

const INITIAL_STATE = immutable({
  drawer: false,
  error: false,
  errorMessage: null,
});

function drawer(state, action) {
  return state.merge({
    drawer: action.drawer,
  });
}

function clear() {
  return INITIAL_STATE;
}

const HANDLERS = {
  [Types.APP_CLEAR]: clear,
  [Types.APP_DRAWER]: drawer,
};

export const App = Creators;

export const appTypes = Types;

export default createReducer(INITIAL_STATE, HANDLERS);
