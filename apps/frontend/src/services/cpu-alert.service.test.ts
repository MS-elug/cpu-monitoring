import { cpuAlertService } from './cpu-alert.service';
import { CPULoad } from '@monitoring/api-client';
import { CPUPeriod, CPUState } from '../store/cpu-load/cpu-load-slice';

interface CPULoadTestData extends CPULoad {
  stateExpected: CPUState;
  emittedState: string | null;
  emittedPeriod: CPUPeriod | null;
}

/** Reusable expect runner to repeat on multiple test data */
function expectRunner(testData: CPULoadTestData[]) {
  let emittedState: CPUState | null = null;
  let subscription = cpuAlertService.getState$().subscribe((state) => {
    emittedState = state;
  });
  emittedState = null;

  let emittedPeriod: CPUPeriod | null = null;
  subscription.add(
    cpuAlertService.getStatePeriod$().subscribe((period) => {
      emittedPeriod = period;
    })
  );
  emittedPeriod = null;

  try {
    testData.forEach((cpuLoadTestData) => {
      // Stream data to cpu alert service
      cpuAlertService.onData(cpuLoadTestData);
      // Assert state (adding time in the expect string to ease the debugging in case of test failure)
      expect(`${cpuLoadTestData.time}:${cpuAlertService.getState()}`).toBe(`${cpuLoadTestData.time}:${cpuLoadTestData.stateExpected}`);
      expect(`${cpuLoadTestData.time}:${emittedState}`).toBe(`${cpuLoadTestData.time}:${cpuLoadTestData.emittedState}`);
      expect(`${cpuLoadTestData.time}:${JSON.stringify(emittedPeriod)}`).toBe(`${cpuLoadTestData.time}:${JSON.stringify(cpuLoadTestData.emittedPeriod)}`);

      emittedState = null;
      emittedPeriod = null;
    });
  } finally {
    subscription.unsubscribe();
  }
}

beforeEach(() => {
  cpuAlertService.updateConfig(2*60*1000);
});

afterEach(() => {
  cpuAlertService.reset();
});


test('shoud detect heavy load status', () => {
  cpuAlertService.init('recovered', null, null);

  const testData: CPULoadTestData[] = [
    { time: '2021-09-29T10:01:15.000Z', average: 0.2, stateExpected: 'recovered' as CPUState, emittedState: null, emittedPeriod: null },
    { time: '2021-09-29T10:01:20.000Z', average: 1.2, stateExpected: 'recovered' as CPUState, emittedState: null, emittedPeriod: null },
    {
      time: '2021-09-29T10:03:21.000Z',
      average: 1.2,
      stateExpected: 'heavy' as CPUState,
      emittedState: 'heavy',
      emittedPeriod: { state: 'recovered' as CPUState, startTime: undefined, endTime: '2021-09-29T10:01:20.000Z' }
    }
  ];

  expectRunner(testData);
});

test('shoud not detect heavy load status', () => {
  cpuAlertService.init('recovered', null, null);

  const testData: CPULoadTestData[] = [
    { time: '2021-09-29T10:01:15.000Z', average: 0.2, stateExpected: 'recovered' as CPUState, emittedState: null, emittedPeriod: null },
    { time: '2021-09-29T10:01:20.000Z', average: 1.2, stateExpected: 'recovered' as CPUState, emittedState: null, emittedPeriod: null },
    { time: '2021-09-29T10:03:21.000Z', average: 0.2, stateExpected: 'recovered' as CPUState, emittedState: null, emittedPeriod: null }
  ];

  expectRunner(testData);
});

test('shoud not change initial state to recovery load status', () => {
  cpuAlertService.init('initial', null, null);

  const testData: CPULoadTestData[] = [
    { time: '2021-09-29T10:01:15.000Z', average: 0.2, stateExpected: 'initial' as CPUState, emittedState: null, emittedPeriod: null },
    { time: '2021-09-29T10:01:20.000Z', average: 1.2, stateExpected: 'initial' as CPUState, emittedState: null, emittedPeriod: null },
    { time: '2021-09-29T10:03:21.000Z', average: 0.2, stateExpected: 'initial' as CPUState, emittedState: null, emittedPeriod: null },
    { time: '2021-09-29T10:06:21.000Z', average: 0.2, stateExpected: 'initial' as CPUState, emittedState: null, emittedPeriod: null }
  ];

  expectRunner(testData);
});

test('shoud detect recovery load status', () => {
  cpuAlertService.init('heavy', { time: '2021-09-29T10:01:00.000Z', average: 1.2 }, null);

  const testData: CPULoadTestData[] = [
    { time: '2021-09-29T10:01:15.000Z', average: 1.8, stateExpected: 'heavy' as CPUState, emittedState: null, emittedPeriod: null },
    { time: '2021-09-29T10:01:20.000Z', average: 0.2, stateExpected: 'heavy' as CPUState, emittedState: null, emittedPeriod: null },
    {
      time: '2021-09-29T10:03:25.000Z',
      average: 0.2,
      stateExpected: 'recovered' as CPUState,
      emittedState: 'recovered',
      emittedPeriod: { state: 'heavy' as CPUState, startTime: '2021-09-29T10:01:00.000Z', endTime: '2021-09-29T10:01:20.000Z' }
    }
  ];

  expectRunner(testData);
});

test('shoud not detect recovery load status', () => {
  cpuAlertService.init('heavy', { time: '2021-09-29T10:01:00.000Z', average: 1.2 }, null);

  const testData: CPULoadTestData[] = [
    { time: '2021-09-29T10:01:15.000Z', average: 1.8, stateExpected: 'heavy' as CPUState, emittedState: null, emittedPeriod: null },
    { time: '2021-09-29T10:01:20.000Z', average: 0.2, stateExpected: 'heavy' as CPUState, emittedState: null, emittedPeriod: null },
    { time: '2021-09-29T10:03:25.000Z', average: 1.2, stateExpected: 'heavy' as CPUState, emittedState: null, emittedPeriod: null }
  ];

  expectRunner(testData);
});

test('shoud detect several load status change', () => {
  cpuAlertService.init('initial', null, null);

  const testData: CPULoadTestData[] = [
    { time: '2021-09-29T10:01:10.000Z', average: 1.8, stateExpected: 'initial' as CPUState, emittedState: null, emittedPeriod: null },
    { time: '2021-09-29T10:01:20.000Z', average: 1.2, stateExpected: 'initial' as CPUState, emittedState: null, emittedPeriod: null },
    {
      time: '2021-09-29T10:03:25.000Z',
      average: 1.2,
      stateExpected: 'heavy' as CPUState,
      emittedState: 'heavy',
      emittedPeriod: { state: 'initial' as CPUState, startTime: undefined, endTime: '2021-09-29T10:01:10.000Z' }
    },
    { time: '2021-09-29T10:04:25.000Z', average: 0.2, stateExpected: 'heavy' as CPUState, emittedState: null, emittedPeriod: null },
    { time: '2021-09-29T10:05:25.000Z', average: 0.2, stateExpected: 'heavy' as CPUState, emittedState: null, emittedPeriod: null },
    {
      time: '2021-09-29T10:06:25.000Z',
      average: 0.2,
      stateExpected: 'recovered' as CPUState,
      emittedState: 'recovered',
      emittedPeriod: { state: 'heavy' as CPUState, startTime: '2021-09-29T10:01:10.000Z', endTime: '2021-09-29T10:04:25.000Z' }
    },
    { time: '2021-09-29T10:07:25.000Z', average: 0.2, stateExpected: 'recovered' as CPUState, emittedState: null, emittedPeriod: null }
  ];

  expectRunner(testData);
});
