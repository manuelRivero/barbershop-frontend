import {createSlice} from '@reduxjs/toolkit';
import {Barber} from '../../../types/barber';

interface User extends Barber {
  token: string | null;
}

// Define a type for the slice state
interface State {
  user: User | null;
}

// Define the initial state using that type
const initialState: State = {
  user: null,
};

export const authSlice = createSlice({
  name: 'layout',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = {...state.user, ...action.payload};
    },
    logout: state => {
      state.user = null;
    },
  },
});

export const {setUser, logout} = authSlice.actions;

export default authSlice.reducer;
