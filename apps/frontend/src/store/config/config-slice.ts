import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../index';

// Define a type for the slice state
type ConfigState = {
  displayAlerts: boolean;
};

// Define the initial state
const initialState: ConfigState = {
  displayAlerts: true
};

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    enableAlerts: (state) => {
      state.displayAlerts = true;
    },
    disableAlerts: (state) => {
      state.displayAlerts = false;
    }
  }
});

// Action creators are generated for each case reducer function
export const { enableAlerts, disableAlerts } = configSlice.actions;

// Default selector to get the data
export const selectConfig = (state: RootState) => state.config;

export const selectConfigDisplayAlerts = (state: RootState) => {
  return selectConfig(state).displayAlerts;
};

export default configSlice.reducer;
