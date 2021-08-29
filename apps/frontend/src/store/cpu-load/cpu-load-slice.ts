import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import { CPULoad } from '@monitoring/api-client';
import { maxPeriodChangeStorage, monitoringPeriod, monitoringTimeWindow } from '../../environement/environement';

/** Compute max data storage */
const maxLength = Math.trunc(monitoringTimeWindow / monitoringPeriod);

export type CPUState = 'initial' | 'recovered' | 'heavy';

export interface CPUPeriod {
  state: CPUState;
  startTime: string | undefined;
  endTime: string | undefined;
}

// Define a type for the slice state
type CPULoadState = {
  data: CPULoad[];
  periods: CPUPeriod[];
  status: CPUState;
};


// Define the initial state
const initialState: CPULoadState = {
  data: [] as CPULoad[],
  periods: [] as CPUPeriod[],
  status: 'initial'
};

export const cpuLoadSlice = createSlice({
  name: 'cpu-load',
  initialState,
  reducers: {
    pushData: (state, action: PayloadAction<CPULoad>) => {
      if (state.data.length === maxLength) {
        state.data.shift();
      }
      state.data.push(action.payload);
    },
    clearData: (state) => {
      state.data.splice(0);
    },
    pushPeriod: (state, action: PayloadAction<CPUPeriod>) => {
      if (state.periods.length === maxPeriodChangeStorage) {
        state.periods.shift();
      }
      state.periods.push(action.payload);
    },
    clearPeriod: (state) => {
      state.data.splice(0);
    },
    setStatus: (state, action: PayloadAction<CPUState>) => {
      state.status = action.payload;
    }
  }
});

// Action creators are generated for each case reducer function
export const { pushData, clearData, pushPeriod, clearPeriod, setStatus } = cpuLoadSlice.actions;

// Default selector to get the data
export const selectCpuLoad = (state: RootState) => state.cpuLoad;

// Selector to get the data sorted by date
function compareCpuLoadByTime(a: CPULoad, b: CPULoad) {
  return new Date(a.time).getTime() - new Date(b.time).getTime();
}
export const selectCpuLoadDataSorted = (state: RootState) => [...state.cpuLoad.data].sort(compareCpuLoadByTime);

export const selectCpuLoadStatus = (state: RootState) => state.cpuLoad.status;

export default cpuLoadSlice.reducer;
