import {createSlice} from '@reduxjs/toolkit';
import {Service} from '../../../types/services';
import {services} from '../../../dummy-data/services';

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
    text: string
  } | null ;
  cancelData?:{
    background: string,
    text:string
  } | null
}

// Define a type for the slice state
interface State {
  infoModal: InfoModal | null
}

// Define the initial state using that type
const initialState: State = {
  infoModal:null
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
  },
});

export const {showInfoModal, hideInfoModal} = layoutSlice.actions;

export default layoutSlice.reducer;
