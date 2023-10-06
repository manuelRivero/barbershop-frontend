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
  services: [],
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
    removeService: (state, action) => {
      state.services = state.services.filter(e => e._id !== action.payload._id)
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
    },
    addAllServices : (state, action) => {
      state.services = action.payload
    }
  },
});

export const {addService, addAllServices, removeService, editService, setServiceForEdition, toggleCreateServiceModal} = servicesSlice.actions;

export default servicesSlice.reducer;
