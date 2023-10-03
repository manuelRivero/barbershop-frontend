import {createSlice} from '@reduxjs/toolkit';
import {Service} from '../../../types/services';
import {services} from '../../../dummy-data/services';

// Define a type for the slice state
interface State {
  services: Service[];
  serviceForEdition: Service | null;
  showCreateServiceModal: boolean
}

// Define the initial state using that type
const initialState: State = {
  services: services,
  serviceForEdition: null,
  showCreateServiceModal: false
};

export const servicesSlice = createSlice({
  name: 'services',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addService: (state, action) => {
      state.services.push(action.payload);
    },
    setServiceForEdition: (state, action) => {
      state.serviceForEdition = action.payload;
      state.showCreateServiceModal = true
    },
    toggleCreateServiceModal : (state, action) => {
      state.showCreateServiceModal = action.payload
    },
    editService : (state, action) => {
      const targetService = state.services.findIndex(e => e._id === action.payload._id)
      state.services[targetService] = action.payload
    }
  },
});

export const {addService, editService, setServiceForEdition, toggleCreateServiceModal} = servicesSlice.actions;

export default servicesSlice.reducer;
