import { useEffect } from 'react';
import Dashboard from './components/dashboard/dashboard.component';
import { makeStyles } from '@material-ui/core/styles';
import CpuLoadAlert from './components/cpu-load-alert/cpu-load-alert.component';
import CpuLoadNotificationControl from './components/cpu-load-notification-control/cpu-load-notification-control.component';

const useStyles = makeStyles((theme) => ({
  body: {
    backgroundColor: theme.palette.background.default
  },
  app: {
    width: '100%',
    height: '100vh',
    overflow: 'hidden'
  },
  controls: {
    zIndex: 9999,
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
    height: '24px'
  }
}));

function App() {
  const classes = useStyles();

  useEffect(() => {
    // Add class on init
    document.body.classList.add(classes.body);
    return () => {
      // Remove class on destroy
      document.body.classList.remove(classes.body);
    };
  }, [classes]);

  return (
    <div className={classes.app}>
      <div className={classes.controls}>
        <CpuLoadNotificationControl />
      </div>
      <Dashboard />
      <CpuLoadAlert />
    </div>
  );
}

export default App;
