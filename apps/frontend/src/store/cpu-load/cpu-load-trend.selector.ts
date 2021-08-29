import { RootState } from "../index";
import { selectCpuLoadSorted } from "./cpu-load-slice";

// Old fashion import / the module doesn't support import
const regression = require('regression');

// Selector to get the cpu load average trend
export type CpuLoadTrendType = '-' | '+' | '=';

export const selectCpuLoadTrend = (state: RootState): CpuLoadTrendType | null => {
  // Define the number of measures needed to compute a trend
  const numberOfMeasures = 5;
  const measures = selectCpuLoadSorted(state)
    .slice(-1 - numberOfMeasures, -1) // Take the last N measures
    .map((cpuLoad) => [new Date(cpuLoad.time).getTime(), cpuLoad.average * 10000000000]); // Magic number to avoid precisions issues whith later computing, can be improved !

  if (measures.length < numberOfMeasures) {
    return null;
  }

  const result = regression.linear(measures);
  const slope = result.equation[0];
  const threshold = 0.1;
  if (slope > threshold) {
    return '+';
  } else if (slope < threshold) {
    return '-';
  }
  return '=';
};
