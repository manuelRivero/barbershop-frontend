import {turnsApi} from './../../../api/turnsApi/index';
import {createSlice} from '@reduxjs/toolkit';
import {Service} from '../../../types/services';
import {services} from '../../../dummy-data/services';
import {Event} from '../../../types/turns';

// Define a type for the slice state
interface State {
  turns: Event[];
  userTurn: Event | null;
}

// Define the initial state using that type
const initialState: State = {
  turns: [],
  userTurn: null,
};

export const turnsSlice = createSlice({
  name: 'turns',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setCompleteTurn: (state, action) => {
      const targetTurn = state.turns.findIndex(
        e => e._id === action.payload._id,
      );
      state.turns[targetTurn].status = 'COMPLETE';
    },
    addTurn: (state, action) => {
      state.turns.push(action.payload);
    },
    resetAllturns: state => {
      state.turns = [];
    },
    initTurns: (state, action) => {
      state.turns = action.payload;
    },
    setUserTurn: (state, action) => {
      state.userTurn = action.payload;
    },
    resetUserTurn: state => {
      state.userTurn = null;
    },
    changeTurnPhone: (state, action) => {
      const {turnId, phone} = action.payload;
      const turnList = [...state.turns];
      const targetTurn = turnList.findIndex((e:Event) => e._id === turnId)
      if(targetTurn >= 0){
        if(turnList[targetTurn].user){
          turnList[targetTurn].user.phone = phone
        }
      }
      state.turns = turnList;
    },
    deleteTurn: (state, action) => {
      const targetTurn = state.turns.findIndex(e => e._id === action.payload);
      state.turns[targetTurn].status = 'CANCELED';
    },
  },
  extraReducers: builder => {
    builder
      .addMatcher(
        turnsApi.endpoints.getTurns.matchFulfilled,
        (state, action) => {
          console.log('set state', action.payload);
          state.turns = action.payload;
        },
      )
      .addMatcher(
        turnsApi.endpoints.getActiveTurn.matchFulfilled,
        (state, action) => {
          if (action.payload && action.payload.length > 0) {
            state.userTurn = action.payload[0];
          } else if (action.payload && action.payload.length <= 0) {
            state.userTurn = null;
          }
        },
      );
  },
});

export const {
  setCompleteTurn,
  addTurn,
  resetAllturns,
  initTurns,
  setUserTurn,
  resetUserTurn,
  deleteTurn,
  changeTurnPhone
} = turnsSlice.actions;

export default turnsSlice.reducer;
