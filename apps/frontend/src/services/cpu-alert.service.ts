import { CPULoad } from '@monitoring/api-client';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { minPeriodStateDetection } from '../environement/environement';
import { CPUPeriod, CPUState } from '../store/cpu-load/cpu-load-slice';

/** Service in charge to detect state change */
class CpuAlertService {
  private state$: BehaviorSubject<CPUState> = new BehaviorSubject<CPUState>('initial');
  private statePeriod$: Subject<CPUPeriod> = new Subject<CPUPeriod>();
  private firstHeavyLoad: CPULoad | null = null;
  private firstRecoveredLoad: CPULoad | null = null;

  private minPeriodStateDetection = minPeriodStateDetection;

  getState(): CPUState {
    return this.state$.getValue();
  }

  getState$(): Observable<CPUState> {
    return this.state$.asObservable();
  }

  getStatePeriod$(): Observable<CPUPeriod> {
    return this.statePeriod$.asObservable();
  }

  init(state: CPUState, firstHeavyLoad: CPULoad | null, firstRecoveredLoad: CPULoad | null) {
    this.state$.next(state);
    this.firstHeavyLoad = firstHeavyLoad;
    this.firstRecoveredLoad = firstRecoveredLoad;
  }

  reset() {
    this.state$.next('initial');
    this.firstHeavyLoad = null;
    this.firstRecoveredLoad = null;
    this.minPeriodStateDetection = minPeriodStateDetection;
  }

  updateConfig(minPeriodStateDetection: number) {
    this.minPeriodStateDetection = minPeriodStateDetection;
  }

  onData(cpuLoad: CPULoad) {
    const state = this.state$.getValue();
    if (state === 'recovered' || state === 'initial') {
      // Detection of rising edge
      if (cpuLoad.average >= 1) {
        // Keep first heavy load detection
        if (!this.firstHeavyLoad) {
          this.firstHeavyLoad = cpuLoad;
        }
        // Detect if the heavy state lasted for more than 2 minutes without interruption
        if (new Date(cpuLoad.time).getTime() - new Date(this.firstHeavyLoad.time).getTime() >= minPeriodStateDetection) {
          this.state$.next('heavy');
          // Last state change, broadcast the details
          this.statePeriod$.next({
            state,
            startTime: this.firstRecoveredLoad?.time,
            endTime: this.firstHeavyLoad.time
          });
        }
      } else {
        // Heavy start reset
        this.firstHeavyLoad = null;
      }
    } else if (state === 'heavy') {
      // Detection of falling edge
      if (cpuLoad.average < 1) {
        if (!this.firstRecoveredLoad) {
          this.firstRecoveredLoad = cpuLoad;
        }

        // Detect if the recovery state lasted for more than 2 minutes without interruption
        if (new Date(cpuLoad.time).getTime() - new Date(this.firstRecoveredLoad.time).getTime() >= minPeriodStateDetection) {
          this.state$.next('recovered');
          // Last state change, broadcast the details
          this.statePeriod$.next({
            state,
            startTime: this.firstHeavyLoad?.time,
            endTime: this.firstRecoveredLoad.time
          });
        }
      } else {
        // Recovery start reset
        this.firstRecoveredLoad = null;
      }
    }
  }
}

// Export the service as a singleton
export const cpuAlertService = new CpuAlertService();
