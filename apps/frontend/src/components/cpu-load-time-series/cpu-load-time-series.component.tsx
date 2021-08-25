import { map } from 'rxjs/operators';
import { cpuMonitoringService } from '../../services/cpu-monitoring.service';
import GraphTimeSeriesStream from '../graph-time-series-stream/graph-time-series-stream.component';

const timeInterval = cpuMonitoringService.pollingPeriod;
const timeWindow = 10 * 60 * 1000;

interface Props {
  className?: string;
}
function CpuLoadTimeSeries(props: Props) {
  const { className } = props;
  const value$ = cpuMonitoringService.getCpuLoad$().pipe(
    map((cpuLoad) => {
      // Check if there were an issue to get the average
      const invalidAverage = cpuLoad.average < 0;
      // In case of error for average computation, display a 0 value
      return { x: new Date(cpuLoad.time).getTime(), y: invalidAverage ? 0 : cpuLoad.average };
    })
  );

  return <GraphTimeSeriesStream className={className} $value={value$} valueName={'average load (last 1m)'} timeInterval={timeInterval} timeWindow={timeWindow}></GraphTimeSeriesStream>;
}

export default CpuLoadTimeSeries;
