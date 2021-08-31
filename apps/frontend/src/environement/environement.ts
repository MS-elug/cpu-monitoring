/** Debug mode */
export const debugMode = true;
/** Time window for monitoring in s */
export const monitoringTimeWindow = 10 * 60 * 1000; // 10 minutes
/** Period for monitoring */
export const monitoringPeriod = 10 * 1000; // 10 second
/** Minimum period to consider cpu state change from heavy load to recovered */
export const minPeriodStateDetection = 2 * 60 * 1000; // 2 minutes
/** Maximum number of last periods to keep in memory */
export const maxPeriodChangeStorage = 100;
/** Define if native browser notification can be used */
export const useBrowserNotification = true;
/** Enable persistency of compatible store's slices*/
export const enablePersistantStore = true;
