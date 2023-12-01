import {createSlice} from '@reduxjs/toolkit';
import {Service} from '../../../types/services';
import {services} from '../../../dummy-data/services';
import { Socket } from 'socket.io-client';

interface InfoModal {
  title:string;
  type:"error" | "success" | "info";
  hasCancel: boolean;
  cancelCb: ()=>void | null;
  hasSubmit: boolean;
  submitCb: ()=>void | null;
  hideOnAnimationEnd: boolean;
  submitData?:{
    background: string,
    text: string,
    hasLoader?:boolean
  } | null ;
  cancelData?:{
    background: string,
    text:string
  } | null
}

// Define a type for the slice state
interface State {
  infoModal: InfoModal | null;
  socket: Socket | null
}

// Define the initial state using that type
const initialState: State = {
  infoModal:null,
  socket:null
};

export const layoutSlice = createSlice({
  name: 'layout',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    showInfoModal : (state, action) => {
      state.infoModal = action.payload
    },
    hideInfoModal : (state) => {
      state.infoModal = null
    },
    setSocket : (state, action) => {
      state.socket = action.payload
    },
    removeSocket: (state) => {
      state.socket = null
    }
  },
});

export const {showInfoModal, hideInfoModal, setSocket, removeSocket} = layoutSlice.actions;

export default layoutSlice.reducer;
