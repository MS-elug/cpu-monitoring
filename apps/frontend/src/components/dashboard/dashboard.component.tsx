import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import CpuLoadTimeSeries from '../cpu-load-time-series/cpu-load-time-series.component';
import CpuLoadTable from '../cpu-load-table/cpu-load-table.component';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  dashboard: {
  },
  cpuLoadSection: {
    backgroundColor: '#252f3e',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    flex:2,
    overflow: 'hidden'
  },
  cpuLoadDetailsSection: {
    flex:3,
    paddingTop: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(4)
  },
  fullHeight:{
    height: '100%',
  },
  overflowHidden: {
    overflow: 'hidden'
  }
}));

function Dashboard() {
  const classes = useStyles();

  return (
    <Grid container direction="column" alignItems="stretch" className={clsx(classes.dashboard, classes.fullHeight)}>
      <Grid item xs={12} className={classes.cpuLoadSection}>
        <Grid container direction="row" justifyContent="center" alignItems="flex-start" className={classes.fullHeight}>
          <Grid item xs={8} className={classes.fullHeight}>
            <CpuLoadTimeSeries className={classes.fullHeight}></CpuLoadTimeSeries>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} className={classes.cpuLoadDetailsSection}>
        <Grid container direction="row" justifyContent="center" alignItems="flex-start" spacing={2}>
          <Grid item>
            <Paper className={classes.paper}>
              <CpuLoadTable></CpuLoadTable>
            </Paper>
          </Grid>
          <Grid item>
            <Paper className={classes.paper}>test</Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Dashboard;
