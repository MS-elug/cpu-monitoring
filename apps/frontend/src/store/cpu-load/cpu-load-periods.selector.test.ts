import { selectCpuLoadPeriodsSorted } from './cpu-load-periods.selector';
import { RootState } from '..';
import { CPUPeriod } from './cpu-load-slice';

function testDataForStore(periods: CPUPeriod[]): RootState {
  return {
    cpuLoad: {
      data: [],
      status: 'initial',
      periods: periods
    },
    config: {
      displayAlerts: true,
      muteAlerts: true
    }
  };
}

test('compare CpuPeriod By Time', () => {
  const storeData = testDataForStore([
    { state: 'recovered', startTime: '2021-09-29T10:01:35.000Z', endTime: '2021-09-29T10:01:45.000Z' },
    { state: 'initial', startTime: '2021-09-29T10:01:15.000Z', endTime: '2021-09-29T10:01:25.000Z' },
    { state: 'heavy', startTime: '2021-09-29T10:01:25.000Z', endTime: '2021-09-29T10:01:35.000Z' }
  ]);

  const select = selectCpuLoadPeriodsSorted(storeData);
  expect(select).toEqual([
    { state: 'initial', startTime: '2021-09-29T10:01:15.000Z', endTime: '2021-09-29T10:01:25.000Z' },
    { state: 'heavy', startTime: '2021-09-29T10:01:25.000Z', endTime: '2021-09-29T10:01:35.000Z' },
    { state: 'recovered', startTime: '2021-09-29T10:01:35.000Z', endTime: '2021-09-29T10:01:45.000Z' }
  ]);
});
