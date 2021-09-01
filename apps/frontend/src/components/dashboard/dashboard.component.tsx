import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import CpuLoadTimeSeries from '../cpu-load-time-series/cpu-load-time-series.component';
import CpuLoadTable from '../cpu-load-table/cpu-load-table.component';
import clsx from 'clsx';
import { Typography } from '@material-ui/core';
import { useStyles } from './dashboard.style';
import CpuLoadSnapshot from '../cpu-load-snapshot/cpu-load-snapshot.component';
import CpuLoadSummary from '../cpu-load-summary/cpu-load-summary.component';

function Dashboard() {
  const classes = useStyles();

  return (
    <div className={classes.dashboard}>
      <div className={classes.topSection}>
        <div className={clsx(classes.container, classes.graphBox)}>
          <Typography variant="h6" gutterBottom className={classes.lightText}>
            CPU Average Load (over 1m)
          </Typography>
          <div style={{ flexGrow: 1, flexBasis: 0 }}>
            <CpuLoadTimeSeries className={classes.fullHeight}></CpuLoadTimeSeries>
          </div>
        </div>
      </div>
      <div className={classes.bottomSection}>
        <div className={clsx(classes.container, classes.dataBox)}>
          <Grid container direction="row" justifyContent="space-between" alignItems="stretch" spacing={2}>
            <Grid item xs={12} lg={3}>
              <Grid container direction="row" justifyContent="space-between" alignItems="stretch" spacing={2}>
                <Grid item xs={6} lg={12}>
                  <Paper className={clsx(classes.paper)}>
                    <CpuLoadSnapshot></CpuLoadSnapshot>
                  </Paper>
                </Grid>
                <Grid item xs={6} lg={12}>
                  <Paper className={clsx(classes.paper)}>
                    <CpuLoadSummary></CpuLoadSummary>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} lg={9}>
              <Paper className={classes.paper}>
                <CpuLoadTable></CpuLoadTable>
              </Paper>

              <Paper className={clsx(classes.paper, classes.explanations)}>
                <Typography variant="button" display="block">
                  Explanations
                </Typography>
                <Typography variant="caption" display="block">
                  <ul>
                    <li>A CPU is considered under high average load when it has exceeded 1 for 2 minutes or more.</li>
                    <li>A CPU is considered recovered from high average load when it drops below 1 for 2 minutes or more.</li>
                    <li>A CPU is considered in initial mode when its state hasn't change since the start of monitoring.</li>
                  </ul>
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
