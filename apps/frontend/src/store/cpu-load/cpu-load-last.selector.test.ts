import { RootState } from '..';
import { CPULoad } from '@monitoring/api-client';
import { selectCpuLoadLast } from './cpu-load-last.selector';

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

test('select last cpu load data', () => {
  const storeData = testDataForStore([
    { time: '2021-09-29T10:01:25.000Z', average: 0 },
    { time: '2021-09-29T10:01:27.000Z', average: 0 },
    { time: '2021-09-29T10:01:23.000Z', average: 0 },
    { time: '2021-09-29T10:01:22.000Z', average: 0 }
  ]);

  const select = selectCpuLoadLast(storeData);
  expect(select).toEqual({ time: '2021-09-29T10:01:27.000Z', average: 0 });
});
