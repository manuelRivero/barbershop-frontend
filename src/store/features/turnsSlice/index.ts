import {createSlice} from '@reduxjs/toolkit';
import {Service} from '../../../types/services';
import {services} from '../../../dummy-data/services';
import { Event } from '../../../types/turns';


// Define a type for the slice state
interface State {
  turns :Event[]
}

// Define the initial state using that type
const initialState: State = {
  turns:[]
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
    }
  },
});

export const {setCompleteTurn, addTurn} = turnsSlice.actions;

export default turnsSlice.reducer;