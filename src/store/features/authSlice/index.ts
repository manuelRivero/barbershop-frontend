import {createSlice} from '@reduxjs/toolkit';
import {User} from '../../../types/user';

// Define a type for the slice state
interface State {
  user: User | null;
  token: string | null
}

// Define the initial state using that type
const initialState: State = {
  user: null,
  token: null
};

export const authSlice = createSlice({
  name: 'layout',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setToken: (state, action) =>{
      state.token = action.payload
    },
    setUser: (state, action) => {
      state.user = {...state.user, ...action.payload};
    },
    logout: state => {
      state.user = null;
    },
  },
});

export const {setUser, setToken, logout} = authSlice.actions;

export default authSlice.reducer;
