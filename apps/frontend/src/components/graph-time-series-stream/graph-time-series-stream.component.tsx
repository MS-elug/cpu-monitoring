import { useEffect, useRef } from 'react';
import { useStyles } from './graph-time-series-stream.style';
import { fromEvent, Subscription, asyncScheduler, Observable } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import clsx from 'clsx';
import format from 'date-fns/format';
import 'rickshaw/rickshaw.css';

// Old fashion import / the module doesn't support import
const Rickshaw = require('rickshaw');

interface Props {
  timeWindow: number;
  timeInterval: number;
  value$: Observable<{ x: number; y: number }>;
  valueName: string;
  className?: string;
}

/** Configure and re-render the graph with the new configuration */
function configureGraph(graph: any, containerEl: HTMLDivElement) {
  // Compute the new size of the viewport
  const containerRect = containerEl.getBoundingClientRect();
  // Update graph
  graph.configure({
    width: containerRect.width,
    height: containerRect.height
  });
  graph.render();
}

/** Component to display Streamed TimeSeries  */
function GraphTimeSeriesStream(props: Props) {
  const classes = useStyles();
  const { value$, valueName, timeWindow, timeInterval, className } = props;

  const graphContainerElRef = useRef<HTMLDivElement | null>(null);
  const chartElRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const graphContainerEl = graphContainerElRef.current;
    const chartEl = chartElRef.current;

    // If ref element not found in DOM, do nothing (it should never happen)
    if (!graphContainerEl || !chartEl) {
      return;
    }

    // In case of invalid configuration do not display the graph
    if (timeWindow < timeInterval) {
      return;
    }

    // Prepare to store observable subcriptions
    let subscription: Subscription = new Subscription();

    // Compute the number of data to be displayed
    const maxDataPoints = Math.trunc(timeWindow / timeInterval);

    // At initialisation, get the current time
    const now = Date.now() / 1000;

    // Add data to graph when a new value is emitted
    subscription.add(
      value$.subscribe((value) => {
        const data = { [valueName]: value.y };
        graph.series.addData(data);
        graph.render();
      })
    );

    // Create a Graph
    const graph = new Rickshaw.Graph({
      element: chartEl,
      renderer: 'area',
      interpolation: 'linear',
      stroke: true,
      series: new Rickshaw.Series.FixedDuration([{ color: 'steelblue', name: valueName }], undefined, {
        timeInterval,
        maxDataPoints,
        timeBase: now
      })
    });
    configureGraph(graph, graphContainerEl);

    // Create a mouse hover interaction
    const hoverDetail = new Rickshaw.Graph.HoverDetail({
      graph: graph,
      xFormatter: (x: number) => {
        return format(new Date(x * 1000), 'HH:mm:ss');
      }
    });

    // Create a X Axis timeline legend
    const xAxis = new Rickshaw.Graph.Axis.Time({
      graph: graph,
      timeFixture: new Rickshaw.Fixtures.Time.Local(),
      timeUnit: {
        name: 'minute',
        seconds: 60,
        formatter: function (d: any) {
          return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
        }
      }
    });
    // Render the xAxis
    xAxis.render();

    // Create a Y axis
    const yAxis = new Rickshaw.Graph.Axis.Y({
      graph: graph
    });
    // Render the graph
    yAxis.render();

    // Create a Observable on the windows size + throttle to avoid redrawing performance issues
    const $resize = fromEvent(window, 'resize').pipe(throttleTime(100, asyncScheduler, { leading: true, trailing: true }));
    // Subscribe to window resize event and redraw the graph
    subscription.add(
      $resize.subscribe(() => {
        configureGraph(graph, graphContainerEl);
      })
    );

    return () => {
      // Properly unsubscribe listeners
      subscription.unsubscribe();
      hoverDetail._removeListeners();

      // CLean the chart SVG rendering
      while (chartEl && chartEl.firstChild) {
        chartEl.removeChild(chartEl.firstChild);
      }
    };
  }, [value$, timeInterval, timeWindow, valueName]);

  return (
    <div ref={graphContainerElRef} className={clsx(classes.graphContainer, className)}>
      <div ref={chartElRef}></div>
    </div>
  );
}

export default GraphTimeSeriesStream;
