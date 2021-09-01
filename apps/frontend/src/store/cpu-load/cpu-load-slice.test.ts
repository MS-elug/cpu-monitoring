import { CPULoad } from '@monitoring/api-client';
import { RootState } from '..';
import { selectCpuLoadDataSorted } from './cpu-load-slice';

function testDataForStore(cpuLoads: CPULoad[]): RootState {
  return {
    cpuLoad: {
      data: cpuLoads,
      status: 'initial',
      periods: []
    },
    config: {
      displayAlerts: true,
      muteAlerts: true
    }
  };
}

test('select cpu Load sorted by time', () => {
  const storeData = testDataForStore([
    { time: '2021-09-29T10:01:25.000Z', average: 0 },
    { time: '2021-09-29T10:01:15.000Z', average: 0 },
    { time: '2021-09-29T10:01:35.000Z', average: 0 }
  ]);

  const select = selectCpuLoadDataSorted(storeData);
  expect(select).toEqual([
    { time: '2021-09-29T10:01:15.000Z', average: 0 },
    { time: '2021-09-29T10:01:25.000Z', average: 0 },
    { time: '2021-09-29T10:01:35.000Z', average: 0 }
  ]);
});
