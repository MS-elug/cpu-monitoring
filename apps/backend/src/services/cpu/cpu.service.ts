import os from 'os';

// This library overrides the nodejs native method os.loadavg when os is windows
import 'loadavg-windows';

// Get number of CPUs
const cpus = os.cpus();

/** Get CPUs load in percentage ( 0% = no load, 100% = all CPUs are fully busy)  */
export function getAverageCpuLoad(): number {
  const pastLastMinuteCPUAverageLoad = os.loadavg()[0];
  const loadAverage = pastLastMinuteCPUAverageLoad / cpus.length;
  return loadAverage;
}
