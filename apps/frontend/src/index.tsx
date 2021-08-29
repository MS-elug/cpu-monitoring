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

// Automatically start the monitoring on start
cpuMonitoringService.startMonitoring();

// Link CPU Monitoring service with the store
cpuMonitoringService.getCpuLoad$().subscribe((cpuLoad) => {
  store.dispatch(cpuLoadSlice.actions.push(cpuLoad));
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
