import React, { useState, useEffect } from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { cpuMonitoringService } from '../../services/cpu-monitoring.service';
import { map, bufferCount } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import TrendingFlatIcon from '@material-ui/icons/TrendingFlat';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';

// Old fashion import / the module doesn't support import
const regression = require('regression');

const trendOverLastNNumber = 5;

export const useStyles = makeStyles((theme) => ({
  root: {
    lineHeight: '2rem',
    fontSize: '2rem'
  }
}));

function CpuLoadSnapshot() {
  const [averageLoad, setAverageLoad] = useState<string>();
  const [trend, setTrend] = useState<number>(0);
  const classes = useStyles();

  useEffect(() => {
    const subscription = new Subscription();

    // Listen for average load
    subscription.add(
      cpuMonitoringService
        .getCpuLoad$()
        .pipe(map((cpuLoad) => (cpuLoad.average * 100).toFixed(2)))
        .subscribe(setAverageLoad)
    );

    // Build average trend
    subscription.add(
      cpuMonitoringService
        .getCpuLoad$()
        .pipe(
          map((cpuLoad) => [new Date(cpuLoad.time).getTime(), cpuLoad.average * 10000000000]), // Magic number to avoid precisions issues whith later computing, can be improved !
          bufferCount(trendOverLastNNumber, 1),
          map((averages) => {
            const result = regression.linear(averages);
            return result.equation[0];
          })
        )
        .subscribe(setTrend)
    );
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Compute the trend of CPU load since the last N values
  //const [trend] = useObservable(obs);
  return (
    <div className={classes.root}>
      <Typography variant="button" display="block">
        Actual Average Load
      </Typography>
      {averageLoad}% {trend > 0 ? <TrendingUpIcon style={{ color: 'red' }} /> : trend < 0 ? <TrendingDownIcon style={{ color: 'green' }} /> : <TrendingFlatIcon style={{ color: 'green' }} />}
    </div>
  );
}

export default CpuLoadSnapshot;
