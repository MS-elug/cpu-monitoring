import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import TrendingFlatIcon from '@material-ui/icons/TrendingFlat';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import { selectCpuLoadLast } from '../../store/cpu-load/cpu-load-last.selector';
import { selectCpuLoadTrend } from '../../store/cpu-load/cpu-load-trend.selector';
import { useAppSelector } from '../../store/hooks';


export const useStyles = makeStyles((theme) => ({
  root: {
    lineHeight: '2rem',
    fontSize: '2rem'
  }
}));

function CpuLoadSnapshot() {

  const cpuLoadLast = useAppSelector(selectCpuLoadLast);
  const cpuLoadTrend = useAppSelector(selectCpuLoadTrend);
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="button" display="block">
        Actual Average Load
      </Typography>
      {cpuLoadLast ? (cpuLoadLast.average * 100).toFixed(2) + "%" : "N/A"}
      {cpuLoadTrend === '+' && <TrendingUpIcon style={{ color: 'red' }} />}
      {cpuLoadTrend === '-' && <TrendingDownIcon style={{ color: 'green' }} />}
      {cpuLoadTrend === '=' && <TrendingFlatIcon style={{ color: 'green' }} />}
    </div>
  );
}

export default CpuLoadSnapshot;
