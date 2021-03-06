import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

// Define a type for the slice state
export type ConfigState = {
  displayAlerts: boolean;
  muteAlerts: boolean;
};

// Define the initial state
const initialState: ConfigState = {
  displayAlerts: true,
  muteAlerts: false
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
    },
    muteAlerts: (state) => {
      state.muteAlerts = true;
    },
    unmuteAlerts: (state) => {
      state.muteAlerts = false;
    },
    hydrate: (state, action: PayloadAction<ConfigState>) => {
      // Replace state by the full content of payload
      return action.payload;
    }
  }
});

// Action creators are generated for each case reducer function
export const { enableAlerts, disableAlerts, muteAlerts, unmuteAlerts, hydrate } = configSlice.actions;

// Default selector to get the data
export const selectConfig = (state: RootState) => state.config;

export const selectConfigDisplayAlerts = (state: RootState) => {
  return selectConfig(state).displayAlerts;
};

export const selectConfigMuteAlerts = (state: RootState) => {
  return selectConfig(state).muteAlerts;
};

export default configSlice.reducer;
