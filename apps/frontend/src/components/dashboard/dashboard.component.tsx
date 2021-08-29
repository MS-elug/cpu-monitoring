import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import CpuLoadTimeSeries from '../cpu-load-time-series/cpu-load-time-series.component';
import CpuLoadTable from '../cpu-load-table/cpu-load-table.component';
import clsx from 'clsx';
import { Typography } from '@material-ui/core';
import { useStyles } from './dashboard.style';
import CpuLoadSnapshot from '../cpu-load-snapshot/cpu-load-snapshot';
import CpuLoadSummary from '../cpu-load-summary/cpu-load-summary';

function Dashboard() {
  const classes = useStyles();

  return (
    <Grid container direction="column" alignItems="stretch" className={clsx(classes.dashboard, classes.fullHeight)}>
      <Grid item xs={12} className={classes.cpuLoadSection}>
        <Grid container direction="row" justifyContent="center" alignItems="flex-start" className={classes.fullHeight}>
          <Grid item xs={8} className={clsx(classes.fullHeight, classes.container)}>
            <Grid container direction="column" alignItems="stretch" className={clsx(classes.fullHeight)}>
              <Grid item>
                <Typography variant="h6" gutterBottom className={classes.lightText}>
                  CPU Monitoring Dashboard
                </Typography>
              </Grid>
              <Grid item style={{ flexGrow: 1 }} className={clsx(classes.fullWidth, classes.overflowHidden)}>
                <CpuLoadTimeSeries className={classes.fullHeight}></CpuLoadTimeSeries>
              </Grid>
            </Grid>
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
            <Grid container direction="column" justifyContent="center" alignItems="stretch" spacing={2}>
              <Grid item>
                <Paper className={clsx(classes.paper, classes.rightSection)}>
                  <CpuLoadSnapshot></CpuLoadSnapshot>
                </Paper>
              </Grid>
              <Grid item>
                <Paper className={clsx(classes.paper, classes.rightSection)}>
                  <CpuLoadSummary></CpuLoadSummary>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Dashboard;
