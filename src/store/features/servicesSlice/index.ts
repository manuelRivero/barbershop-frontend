import { createSlice } from '@reduxjs/toolkit'
import { Service } from '../../../types/services'
import { services } from '../../../dummy-data/services'

// Define a type for the slice state
interface State {
  services: Service[]
}

// Define the initial state using that type
const initialState: State = {
  services: services,
}

export const servicesSlice = createSlice({
  name: 'services',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addService: (state, action) => {
      state.services.push(action.payload)
    },
  },
})

export const { addService } = servicesSlice.actions

export default servicesSlice.reducer