import { CPULoad } from '@monitoring/api-client';
import { RootState } from '..';
import { selectCpuLoadTrend } from './cpu-load-trend.selector';

function testDataForStore(cpuLoad: CPULoad[]): RootState {
  return {
    cpuLoad: {
      data: cpuLoad,
      status: 'initial',
      periods: []
    },
    config: {
      displayAlerts: true,
      muteAlerts: true
    }
  };
}

test('positive trend detection', () => {
  const storeData = testDataForStore([
    { time: '2021-09-29T10:01:15.000Z', average: 1.5 },
    { time: '2021-09-29T10:01:25.000Z', average: 1.2 },
    { time: '2021-09-29T10:01:35.000Z', average: 0.8 },
    { time: '2021-09-29T10:01:45.000Z', average: 0.2 },
    { time: '2021-09-29T10:01:55.000Z', average: 1.4 },
    { time: '2021-09-29T10:02:05.000Z', average: 1.3 },
    { time: '2021-09-29T10:02:15.000Z', average: 1.3 },
    { time: '2021-09-29T10:02:25.000Z', average: 1.5 }
  ]);

  const select = selectCpuLoadTrend(storeData);
  expect(select).toEqual("+");
});

test('negative trend detection', () => {
  const storeData = testDataForStore([
    { time: '2021-09-29T10:01:15.000Z', average: 1.5 },
    { time: '2021-09-29T10:01:25.000Z', average: 1.2 },
    { time: '2021-09-29T10:01:35.000Z', average: 0.8 },
    { time: '2021-09-29T10:01:45.000Z', average: 1.5 },
    { time: '2021-09-29T10:01:55.000Z', average: 1.2 },
    { time: '2021-09-29T10:02:05.000Z', average: 0.8 },
    { time: '2021-09-29T10:02:15.000Z', average: 0.5 },
    { time: '2021-09-29T10:02:25.000Z', average: 0.5 }
  ]);

  const select = selectCpuLoadTrend(storeData);
  expect(select).toEqual("-");
});

test('same trend detection', () => {
  const storeData = testDataForStore([
    { time: '2021-09-29T10:01:15.000Z', average: 0.4 },
    { time: '2021-09-29T10:01:25.000Z', average: 0.5 },
    { time: '2021-09-29T10:01:35.000Z', average: 0.8 },
    { time: '2021-09-29T10:01:45.000Z', average: 0.5 },
    { time: '2021-09-29T10:01:55.000Z', average: 0.7 },
    { time: '2021-09-29T10:02:05.000Z', average: 0.5 },
    { time: '2021-09-29T10:02:15.000Z', average: 0.6 },
    { time: '2021-09-29T10:02:25.000Z', average: 0.5 }
  ]);

  const select = selectCpuLoadTrend(storeData);
  expect(select).toEqual("=");
});