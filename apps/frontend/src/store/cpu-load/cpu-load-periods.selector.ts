import { RootState } from '..';
import { CPUPeriod, CPUState } from './cpu-load-slice';

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
export const selectCpuLoadPeriods = (state: RootState) => state.cpuLoad.periods;

export const selectCpuLoadPeriodCounters = (state: RootState) => {
  const summary = state.cpuLoad.periods.reduce((acc, period) => {
    if (!acc[period.state]) {
      acc[period.state] = 0;
    }
    acc[period.state]++;
    return acc;
  }, {} as { [key in CPUState]: number });

  return ['recovered', 'heavy'].map((key) => {
    return { state: key as CPUState, count: summary[key as CPUState] || 0 };
  });
};
