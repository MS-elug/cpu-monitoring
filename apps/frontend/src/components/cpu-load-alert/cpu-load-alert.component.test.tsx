import React from 'react';
import { act, screen } from '@testing-library/react';
import CpuLoadAlert from './cpu-load-alert.component';
import { render } from '../../utils/test-utils';
import { IPreloadedState, storeBuilder } from '../../store';
import { cpuLoadSlice } from '../../store/cpu-load/cpu-load-slice';
import { notificationService } from '../../services/notification.service';
import { audioService } from '../../services/audio.service';

afterEach(() => {
  jest.restoreAllMocks();
});

test('display and sound alert for heavy load', () => {
  const preloadedStoreState = { cpuLoad: { data: [], periods: [], status: 'initial' }, config: { displayAlerts: true, muteAlerts: false } } as IPreloadedState;
  const store = storeBuilder(preloadedStoreState);

  jest.spyOn(notificationService, 'notify');
  jest.spyOn(audioService, 'play').mockReturnValue(true);
  render(<CpuLoadAlert />, store);

  expect(screen.queryByText(/ALERT -/i)).toBeNull();
  expect(notificationService.notify).toHaveBeenCalledTimes(0);
  expect(audioService.play).toHaveBeenCalledTimes(0);

  // Trigger an state change to heavy load
  act(() => {
    store.dispatch(cpuLoadSlice.actions.setStatus('heavy'));
  });

  expect(screen.queryByText(/ALERT - CPU heavy load detection/i)).toBeInTheDocument();
  expect(notificationService.notify).toHaveBeenCalledTimes(1);
  expect(audioService.play).toHaveBeenCalledWith('alert');
});

test('display and sound alert for recovered load', () => {
  const preloadedStoreState = { cpuLoad: { data: [], periods: [], status: 'heavy' }, config: { displayAlerts: true, muteAlerts: false } } as IPreloadedState;
  const store = storeBuilder(preloadedStoreState);

  jest.spyOn(notificationService, 'notify');
  jest.spyOn(audioService, 'play').mockReturnValue(true);;

  render(<CpuLoadAlert />, store);

  expect(screen.queryByText(/ALERT -/i)).toBeNull();
  expect(notificationService.notify).toHaveBeenCalledTimes(0);
  expect(audioService.play).toHaveBeenCalledTimes(0);

  // Trigger an state change to recovered
  act(() => {
    store.dispatch(cpuLoadSlice.actions.setStatus('recovered'));
  });

  expect(screen.queryByText(/ALERT - CPU recovered from heavy load/i)).toBeInTheDocument();
  expect(notificationService.notify).toHaveBeenCalledTimes(1);
  expect(audioService.play).toHaveBeenCalledWith('notification');
});


test('display and sound alert for heavy load alert after a recovery', () => {
  const preloadedStoreState = { cpuLoad: { data: [], periods: [], status: 'recovered' }, config: { displayAlerts: true, muteAlerts: false } } as IPreloadedState;
  const store = storeBuilder(preloadedStoreState);

  jest.spyOn(notificationService, 'notify');
  jest.spyOn(audioService, 'play').mockReturnValue(true);;

  render(<CpuLoadAlert />, store);

  expect(screen.queryByText(/ALERT -/i)).toBeNull();
  expect(notificationService.notify).toHaveBeenCalledTimes(0);
  expect(audioService.play).toHaveBeenCalledTimes(0);

  // Trigger an state change to heavy
  act(() => {
    store.dispatch(cpuLoadSlice.actions.setStatus('heavy'));
  });

  expect(screen.queryByText(/ALERT - CPU heavy load detection/i)).toBeInTheDocument();
  expect(notificationService.notify).toHaveBeenCalledTimes(1);
  expect(audioService.play).toHaveBeenCalledWith('alert');
});
