import {createSlice} from '@reduxjs/toolkit';
import {Service} from '../../../types/services';
import {services} from '../../../dummy-data/services';
import { Event } from '../../../types/turns';


// Define a type for the slice state
interface State {
  turns :Event[]
  userTurn : Event | null
}

// Define the initial state using that type
const initialState: State = {
  turns:[],
  userTurn: null
};

export const turnsSlice = createSlice({
  name: 'turns',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setCompleteTurn : (state, action) => {
      const targetTurn = state.turns.findIndex(e => action.payload._id)
      state.turns[targetTurn].status = "COMPLETE"
    },
    addTurn : (state, action) =>{ 
      state.turns.push(action.payload)
    },
    resetAllturns : (state) => {
      state.turns = []
    },
    initTurns: (state, action) => {
      state.turns = action.payload
    },
    setUserTurn : (state, action) => {
      state.userTurn = action.payload
    },
    resetUserTurn : (state) => {
      state.userTurn = null
    }
  },
});

export const {setCompleteTurn, addTurn, resetAllturns, initTurns, setUserTurn, resetUserTurn} = turnsSlice.actions;

export default turnsSlice.reducer;
