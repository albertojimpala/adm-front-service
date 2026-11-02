import { createSlice } from '@reduxjs/toolkit';

const INITIAL_STATE = {
  token: '',
  refreshToken: '',
  user: {},
  role: {},
};

const authSlice = createSlice({
  name: 'auth',
  initialState: INITIAL_STATE,
  reducers: {
    authSuccess: (state, { payload }) => ({ ...state, ...payload }),
    authClear: () => INITIAL_STATE,
  },
});

export const { authSuccess, authClear } = authSlice.actions;

export default authSlice.reducer;
