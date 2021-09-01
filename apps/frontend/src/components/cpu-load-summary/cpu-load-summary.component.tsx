import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { selectCpuLoadPeriodCounters } from '../../store/cpu-load/cpu-load-periods.selector';
import { useAppSelector } from '../../store/hooks';
import { stateLabelMapping } from '../cpu-load-table/cpu-load-table.component';

export const useStyles = makeStyles((theme) => ({
  root: {}
}));

function CpuLoadSummary() {
  const cpuLoadPeriodCounters = useAppSelector(selectCpuLoadPeriodCounters);

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="button" display="block">
        Summary
      </Typography>
      {cpuLoadPeriodCounters.map((row, index) => (
        <div key={index}>
          <b>{stateLabelMapping[row.state] || row.state}:</b> {row.count} time(s)
        </div>
      ))}
    </div>
  );
}

export default CpuLoadSummary;
