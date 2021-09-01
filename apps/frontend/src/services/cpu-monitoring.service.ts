import { Subject, interval, Subscription, switchMap, of, merge } from 'rxjs';
import { CpuApi, CPULoad } from '@monitoring/api-client';
import { axiosAsObservable } from '../utils/axios-as-observable';
import { monitoringPeriod } from '../environement/environement';

/** Service in charge to call the backend to get CPU Load at regular interval */
class CpuMonitoringService {
  /** Keep state of polling activity */
  private pollingSubcription: Subscription | null = null;

  /** private subject for cpu load data */
  private $cpuLoad: Subject<CPULoad> = new Subject();

  private cpuApi: CpuApi = new CpuApi();

  getCpuLoad$() {
    return this.$cpuLoad.asObservable();
  }

  onData(cpuLoad: CPULoad) {
    // Emit value
    this.$cpuLoad.next(cpuLoad);
  }

  startMonitoring(): void {
    // Check polling is already started
    if (this.pollingSubcription !== null) {
      return;
    }

    /**
     * Start polling of cpu average from backend
     * Also automatically cancel HTTP request when a new polling starts and emits an average with value -1.
     * In case of issue to reach the backend, an average with value -1 is emitted.
     */
    this.pollingSubcription = merge(of(0), interval(monitoringPeriod))
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
        this.onData(cpuLoad);
        // Log any connectivity error
        if (cpuLoad.average === -1) {
          console.error(`CPU Load data cannot be collected from backend`);
        }
      });
  }

  stopMonitoring(): void {
    // Check polling is already started
    if (this.pollingSubcription === null) {
      return;
    }
    this.pollingSubcription.unsubscribe();
    this.pollingSubcription = null;
  }

}

// Export the service as a singleton
export const cpuMonitoringService = new CpuMonitoringService();
