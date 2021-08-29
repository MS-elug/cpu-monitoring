import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import { CPULoad } from '@monitoring/api-client';
import { monitoringPeriod, monitoringTimeWindow } from '../../environement/environement';

/** Compute max data storage */
const maxLength = Math.trunc(monitoringTimeWindow / monitoringPeriod);

// Define a type for the slice state
type CpuState = CPULoad[];

// Define the initial state
const initialState: CpuState = [] as CPULoad[];

export const cpuLoadSlice = createSlice({
  name: 'cpu-load',
  initialState,
  reducers: {
    push: (state, action: PayloadAction<CPULoad>) => {
      if (state.length === maxLength) {
        state.shift();
      }
      state.push(action.payload);
    },
    clear: (state) => {
      state.splice(0);
    }
  }
});

// Action creators are generated for each case reducer function
export const { push, clear } = cpuLoadSlice.actions;

// Default selector to get the data
export const selectCpuLoad = (state: RootState) => state.cpuLoad;

// Selector to get the data sorted by date
function compareCpuLoadByTime(a: CPULoad, b: CPULoad) {
  return new Date(a.time).getTime() - new Date(b.time).getTime();
}
export const selectCpuLoadSorted = (state: RootState) => [...state.cpuLoad].sort(compareCpuLoadByTime);

export default cpuLoadSlice.reducer;