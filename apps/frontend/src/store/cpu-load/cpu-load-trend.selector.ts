import { RootState } from '../index';
import { selectCpuLoadDataSorted } from './cpu-load-slice';

// Old fashion import / the module doesn't support import
const regression = require('regression');

// Selector to get the cpu load average trend
export type CpuLoadTrendType = '-' | '+' | '=';

export const selectCpuLoadTrend = (state: RootState): CpuLoadTrendType | null => {
  // Define the number of measures needed to compute a trend
  const numberOfMeasures = 5;
  const measures = selectCpuLoadDataSorted(state).slice(-1 - numberOfMeasures); // Take the last N measures

  if (measures.length < numberOfMeasures) {
    return null;
  }
  // Remove initial time to avoid number "float manipulation issues" with big number
  const firstMeasureTime = new Date(measures[0].time).getTime();
  // Convert time in s and load in percent to build threshold
  const normalizedMeasures = measures.map((cpuLoad) => [Math.trunc((new Date(cpuLoad.time).getTime() - firstMeasureTime) / 1000), cpuLoad.average]);

  const result = regression.linear(normalizedMeasures, { precision: 6 });
  const slope = result.equation[0];

  const threshold = 0.01; // 0.1 load unit per 10 second
  if (slope > threshold) {
    return '+';
  } else if (slope < -threshold) {
    return '-';
  }
  return '=';
};
