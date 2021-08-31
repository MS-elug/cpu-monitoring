import React from 'react';
import { screen } from '@testing-library/react';
import CpuLoadAlert from './cpu-load-alert.component';
import { render } from '../../utils/test-utils';

test('display heavy load alert', () => {
  const {container } = render(<CpuLoadAlert />, undefined, { cpuLoad: { data: [], periods: [], status: 'initial' }, config: { displayAlerts: true, muteAlerts: true } });
  // MuiSnackbar-root 

  const alertElement = screen.queryByText(/ALERT -/i);
  expect(alertElement).toBeNull();
});
