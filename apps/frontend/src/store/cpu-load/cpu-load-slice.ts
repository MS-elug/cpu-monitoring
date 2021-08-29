import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import { CPULoad } from '@monitoring/api-client';
import { maxPeriodChangeStorage, monitoringPeriod, monitoringTimeWindow } from '../../environement/environement';
import { CPUPeriod } from '../../services/cpu-alert.service';

/** Compute max data storage */
const maxLength = Math.trunc(monitoringTimeWindow / monitoringPeriod);

export type CPULoadStatus = 'initial' | 'recovered' | 'heavy';

// Define a type for the slice state
type CPULoadState = {
  data: CPULoad[];
  periods: CPUPeriod[];
  status: CPULoadStatus;
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
    setStatus: (state, action: PayloadAction<CPULoadStatus>) => {
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

// Selector to get the periods sorted by date
function compareCpuPeriodByTime(a: CPUPeriod, b: CPUPeriod) {
  if (!a.startTime) {
    return -1;
  }
  if (!b.startTime) {
    return 1;
  }
  return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
}
export const selectCpuLoadPeriodsSorted = (state: RootState) => [...state.cpuLoad.periods].sort(compareCpuPeriodByTime);

export default cpuLoadSlice.reducer;
