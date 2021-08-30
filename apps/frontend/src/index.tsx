import React from 'react';
import ReactDOM from 'react-dom';
import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { defaultTheme } from './themes/default/default.theme';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import '@fontsource/roboto';

import { Provider } from 'react-redux';
import store from './store';
import { cpuMonitoringService } from './services/cpu-monitoring.service';
import { cpuLoadSlice } from './store/cpu-load/cpu-load-slice';
import { cpuAlertService } from './services/cpu-alert.service';
import { debugMode, monitoringPeriod } from './environement/environement';
import { notificationService } from './services/notification.service';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline>
        <Provider store={store}>
          <App />
        </Provider>
      </CssBaseline>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);


// ------------------------------------------
// SERVICES INITIALIZATION

// Automatically start the monitoring on start
cpuMonitoringService.startMonitoring();

// Link CPU Monitoring service with the store
cpuMonitoringService.getCpuLoad$().subscribe((cpuLoad) => {
  store.dispatch(cpuLoadSlice.actions.pushData(cpuLoad));
  cpuAlertService.onData(cpuLoad);
});

// Link the CPU Alert service with the store
cpuAlertService.getState$().subscribe((status) => {
  store.dispatch(cpuLoadSlice.actions.setStatus(status));
});
cpuAlertService.getStatePeriod$().subscribe((period) => {
  store.dispatch(cpuLoadSlice.actions.pushPeriod(period));
});

// Register the notification service
notificationService.registerNativeNotificationATStartup();

// Some debug commands for local development
if (debugMode) {
  /// Freeze the monitoring and generate fake cpu load for the future
  // eg: To simulate an heavy and then recovery period
  //     window.simulateAlert(true, 21*60*1000);window.simulateAlert(false, 21*60*1000);window.simulateAlert(true, 21*60*1000);
  let lastTime: number | undefined;
  (window as any).simulateAlert = (heavy: boolean, duration = 30 * 60 * 1000) => {
    if (!lastTime) {
      cpuMonitoringService.stopMonitoring();
    }
    const initialTime = lastTime ? lastTime : Date.now();
    for (let i = 0; i < Math.trunc(duration / monitoringPeriod); i++) {
      const cpuLoad = {
        time: new Date(initialTime + i * monitoringPeriod).toISOString(),
        average: (heavy ? 1.5 : 0.5) + Math.random() * 0.2
      };
      cpuMonitoringService.onData(cpuLoad);
      lastTime = new Date(cpuLoad.time).getTime();
    }
  };
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
