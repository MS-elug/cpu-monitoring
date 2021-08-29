import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { CPUState } from '../../services/cpu-alert.service';

import { selectCpuLoadPeriods } from '../../store/cpu-load/cpu-load-slice';
import { useAppSelector } from '../../store/hooks';
import { stateLabelMapping } from '../cpu-load-table/cpu-load-table.component';

export const useStyles = makeStyles((theme) => ({
  root: {}
}));

function CpuLoadSummary() {
  const cpuLoadPeriods = useAppSelector(selectCpuLoadPeriods);
  const summary = cpuLoadPeriods.reduce((acc, period) => {
    if (!acc[period.state]) {
      acc[period.state] = 0;
    }
    acc[period.state]++;
    return acc;
  }, {} as { [key in CPUState]: number });
  const rows = Object.keys(summary)
    .filter((key) => key !== 'initial')
    .map((key) => {
      return { state: key as CPUState, count: summary[key as CPUState] };
    });

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="button" display="block">
        Summary
      </Typography>
      {rows.map((row, index) => (
        <div key={index}>
          <b>{stateLabelMapping[row.state] || row.state}:</b> {row.count} time(s)
        </div>
      ))}
    </div>
  );
}

export default CpuLoadSummary;
