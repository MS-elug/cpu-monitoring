import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { selectCpuLoadPeriodsSorted } from '../../store/cpu-load/cpu-load-periods.selector';
import { useAppSelector } from '../../store/hooks';
import { useMemo } from 'react';
import { CPUPeriod, CPUState, selectCpuLoadStatus } from '../../store/cpu-load/cpu-load-slice';

export const stateLabelMapping: { [key in CPUState]: string } = {
  heavy: 'Heavy Load',
  recovered: 'Recovered',
  initial: 'Initial'
};

interface Row {
  state: string;
  startDate: string;
  endDate: string;
  duration: string;
}
function createData(period: CPUPeriod): Row {
  const startDate = period.startTime ? new Date(period.startTime) : undefined;
  const endDate = period.endTime ? new Date(period.endTime) : undefined;
  const duration = !endDate || !startDate ? -1 : Math.trunc(endDate.getTime() - startDate.getTime()) / 1000;

  return {
    state: stateLabelMapping[period.state] || period.state,
    startDate: startDate ? startDate.toLocaleString() : '-',
    endDate: endDate ? endDate.toLocaleString() : '-',
    duration: duration !== -1 ? String(Math.trunc(duration / 60)) + 'm' + String(duration - 60 * Math.trunc(duration / 60) + 's') : '-'
  };
}

export const useStyles = makeStyles((theme) => ({
  root: {
    lineHeight: '2rem',
    fontSize: '2rem'
  },
  table: {
    minWidth: 650
  },
  explanations: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
}));

function CpuLoadTable() {
  const cpuLoadStatus = useAppSelector(selectCpuLoadStatus);
  const cpuLoadPeriods = useAppSelector(selectCpuLoadPeriodsSorted);

  // Cache using react hooks to avoid too much processing on re-rendering
  const rows = useMemo((): Row[] => {
    // Create rows data from periods
    const periodsReversed = [...cpuLoadPeriods].reverse(); // Create a new array,  because reverse is a mutable function
    const rows = periodsReversed.map(createData);
    rows.unshift(createData({ state: cpuLoadStatus, startTime: rows.length !== 0 ? periodsReversed[0].endTime : undefined, endTime: undefined }));
    return rows;
  }, [cpuLoadStatus, cpuLoadPeriods]);

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="button" display="block">
        History
      </Typography>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>CPU State</TableCell>
              <TableCell align="right">Start Time</TableCell>
              <TableCell align="right">End Time</TableCell>
              <TableCell align="right">Duration</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {row.state}
                </TableCell>
                <TableCell align="right">{row.startDate}</TableCell>
                <TableCell align="right">{row.endDate}</TableCell>
                <TableCell align="right">{row.duration}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className={classes.explanations}>
        <Typography variant="caption" display="block">
          (*) Explanations
          <br />
          - A CPU is considered under high average load when it has exceeded 1 for 2 minutes or more.
          <br />
          - A CPU is considered recovered from high average load when it drops below 1 for 2 minutes or more.
          <br />- A CPU is considered in initial mode when there is not enought data to compute the state.
        </Typography>
      </div>
    </div>
  );
}

export default CpuLoadTable;
