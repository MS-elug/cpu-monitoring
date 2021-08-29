import { CPULoad } from '@monitoring/api-client';
import { RootState } from '../index';
import { selectCpuLoadSorted } from './cpu-load-slice';

/** Selector of the latest measure */
export const selectCpuLoadLast = (state: RootState): CPULoad | null => {
  const measures = selectCpuLoadSorted(state);
  return measures.length > 0 ? measures.slice(-1)[0] : null;
};
