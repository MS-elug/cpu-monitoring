import { CPULoad } from '@monitoring/api-client';
import { RootState } from '../index';
import { selectCpuLoadDataSorted } from './cpu-load-slice';

/** Selector of the latest measure */
export const selectCpuLoadLast = (state: RootState): CPULoad | null => {
  const measures = selectCpuLoadDataSorted(state);
  return measures.length > 0 ? measures.slice(-1)[0] : null;
};
