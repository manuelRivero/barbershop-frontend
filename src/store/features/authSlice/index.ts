import {createSlice} from '@reduxjs/toolkit';
import {User} from '../../../types/user';
import { RootState } from '../..';
import { authApi } from '../../../api/authApi';

// Define a type for the slice state
interface State {
  user: User | null;
  token: string | null;
  refreshToken: string | null
}

// Define the initial state using that type
const initialState: State = {
  user: null,
  token: null,
  refreshToken: null
};

export const authSlice = createSlice({
  name: 'layout',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.getMe.matchFulfilled, (state, action) => {
        state.user = action.payload.data
    })
    .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
  })
  },
  reducers: {
    setToken: (state, action) =>{
      state.token = action.payload.token
      state.refreshToken = action.payload.refreshToken
    },
    setUser: (state, action) => {
      state.user = {...state.user, ...action.payload}
    },
    logout: state => {
      state.user = null;
      state.token = null;
    },
  },
});

export const {setUser, setToken, logout} = authSlice.actions;
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;

export default authSlice.reducer;
