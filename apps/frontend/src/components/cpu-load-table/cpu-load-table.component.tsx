import { TablePagination, Typography } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { selectCpuLoadPeriodsSorted } from '../../store/cpu-load/cpu-load-periods.selector';
import { useAppSelector } from '../../store/hooks';
import { useMemo, useState } from 'react';
import { CPUPeriod, CPUState, selectCpuLoadStatus } from '../../store/cpu-load/cpu-load-slice';
import clsx from 'clsx';
import { useStyles } from './cpu-load-table.component.style';

export const stateLabelMapping: { [key in CPUState]: string } = {
  heavy: 'Heavy Load',
  recovered: 'Recovered',
  initial: 'Initial'
};

interface Row {
  stateCode: CPUState;
  stateLabel: string;
  startDate: string;
  endDate: string;
  duration: string;
}
/** Convert cpu period data to row data */
function createData(period: CPUPeriod): Row {
  const startDate = period.startTime ? new Date(period.startTime) : undefined;
  const endDate = period.endTime ? new Date(period.endTime) : undefined;
  const duration = !endDate || !startDate ? -1 : Math.trunc(endDate.getTime() - startDate.getTime()) / 1000;

  return {
    stateCode: period.state,
    stateLabel: stateLabelMapping[period.state] || period.state,
    startDate: startDate ? startDate.toLocaleString() : '-',
    endDate: endDate ? endDate.toLocaleString() : '-',
    duration: duration !== -1 ? String(Math.trunc(duration / 60)) + 'm' + String(duration - 60 * Math.trunc(duration / 60) + 's') : '-'
  };
}

function CpuLoadTable() {
  const classes = useStyles();
  
  const cpuLoadStatus = useAppSelector(selectCpuLoadStatus);
  const cpuLoadPeriods = useAppSelector(selectCpuLoadPeriodsSorted);

  const [page, setPage] = useState(0);
  const rowsPerPage = 5;
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Cache using react hooks to avoid too much processing on re-rendering
  const rows = useMemo((): Row[] => {
    // Create rows data from periods
    const periodsReversed = [...cpuLoadPeriods].reverse(); // Create a new array,  because reverse is a mutable function
    const rows = periodsReversed.map(createData);
    rows.unshift(createData({ state: cpuLoadStatus, startTime: rows.length !== 0 ? periodsReversed[0].endTime : undefined, endTime: undefined }));
    return rows;
  }, [cpuLoadStatus, cpuLoadPeriods]);
  // Compute the number of empty row to display when there is not enought data
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

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
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
              <TableRow key={index} className={clsx(row.stateCode === 'heavy' && classes.heavyLoadRow, row.stateCode === 'recovered' && classes.recoveredLoadRow)}>
                <TableCell component="th" scope="row">
                  {row.stateLabel}
                </TableCell>
                <TableCell align="right">{row.startDate}</TableCell>
                <TableCell align="right">{row.endDate}</TableCell>
                <TableCell align="right">{row.duration}</TableCell>
              </TableRow>
            ))}

            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={4} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination component="div" count={rows.length} rowsPerPageOptions={[rowsPerPage]} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} />
    </div>
  );
}

export default CpuLoadTable;
