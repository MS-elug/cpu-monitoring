import { useEffect } from 'react';
import Dashboard from './components/dashboard/dashboard.component';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  body: {
    backgroundColor: theme.palette.background.default
  },
  app: {
    width: "100%",
    height: "100vh",
    overflow:"hidden"
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
      <Dashboard />
    </div>
  );
}

export default App;
