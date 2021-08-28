import { Subject, interval, Subscription, switchMap } from 'rxjs';
import { CpuApi, CPULoad } from '@monitoring/api-client';
import { axiosAsObservable } from '../utils/axios-as-observable';

class CpuMonitoringService {
  /** Set polling time interval to 10s*/
  public readonly pollingPeriod = 1 * 1000;

  /** Keep state of polling activity */
  private pollingSubcription: Subscription | null = null;

  /** private subject for cpu load data */
  private $cpuLoad: Subject<CPULoad> = new Subject();

  private cpuApi = new CpuApi();

  constructor() {
    // Automatically start the monitoring
    this.startMonitoring();
  }

  getCpuLoad$() {
    return this.$cpuLoad.asObservable();
  }

  startMonitoring(): void {
    // Check is state change
    if (this.pollingSubcription !== null) {
      return;
    }

    /**
     * Start polling of cpu average from backend
     * Also automatically cancel HTTP request when a new polling starts and emits an average with value -1. 
     * In case of issue to reach the backend, an average with value -1 is emitted.
     */
    this.pollingSubcription = interval(this.pollingPeriod)
      .pipe(
        switchMap(() => {
          // In case of orror or timeout returns a -1 average value
          const valueOnError = {
            time: new Date().toISOString(),
            average: -1
          };
          return axiosAsObservable(this.cpuApi.getLoad(), valueOnError, valueOnError);
        })
      )
      .subscribe((cpuLoad) => {
        // Emit value
        this.$cpuLoad.next(cpuLoad);
        // Log any connectivity error
        if(cpuLoad.average === -1){
            console.error(`CPU Load data cannot be collected from backend`);
        }
      });
  }

  stopMonitoring(): void {
    // Check is state change
    if (this.pollingSubcription === null) {
      return;
    }
    this.pollingSubcription.unsubscribe();
    this.pollingSubcription = null;
  }
}

// Export the service as a singleton
export const cpuMonitoringService = new CpuMonitoringService();
