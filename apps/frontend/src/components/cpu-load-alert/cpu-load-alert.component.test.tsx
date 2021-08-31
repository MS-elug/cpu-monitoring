import React from 'react';
import { act, screen } from '@testing-library/react';
import CpuLoadAlert from './cpu-load-alert.component';
import { render } from '../../utils/test-utils';
import { IPreloadedState, storeBuilder } from '../../store';
import { cpuLoadSlice } from '../../store/cpu-load/cpu-load-slice';

test('display heavy load alert', () => {
  const preloadedStoreState = { cpuLoad: { data: [], periods: [], status: 'initial' }, config: { displayAlerts: true, muteAlerts: true } } as IPreloadedState;
  const store = storeBuilder(preloadedStoreState);
  render(<CpuLoadAlert />, store);

  expect(screen.queryByText(/ALERT - CPU heavy load detection/i)).toBeNull();

  act(() => {
    store.dispatch(cpuLoadSlice.actions.setStatus('heavy'));
  });

  expect(screen.queryByText(/ALERT - CPU heavy load detection/i)).toBeInTheDocument();
});


test('display recovered load alert', () => {
  const preloadedStoreState = { cpuLoad: { data: [], periods: [], status: 'heavy' }, config: { displayAlerts: true, muteAlerts: true } } as IPreloadedState;
  const store = storeBuilder(preloadedStoreState);
  render(<CpuLoadAlert />, store);

  expect(screen.queryByText(/ALERT - CPU recovered from heavy load/i)).toBeNull();

  act(() => {
    store.dispatch(cpuLoadSlice.actions.setStatus('recovered'));
  });

  expect(screen.queryByText(/ALERT - CPU recovered from heavy load/i)).toBeInTheDocument();
});

test('play heavy load alert sound', () => {
  // https://redux.js.org/usage/writing-tests
  // https://blog.krawaller.se/posts/unit-testing-react-redux-components/
  // https://www.toptal.com/react/testing-react-hooks-tutorial
});
