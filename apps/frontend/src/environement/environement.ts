/** Time window for monitoring in s */
export const monitoringTimeWindow = 10 * 60 * 1000; // 10 minutes
/** Period for monitoring */
export const monitoringPeriod = 1 * 1000; // 1 second
/** Minimum period to consider cpu state change from heavy load to recovered */
export const minPeriodStateDetecttion = 2 * 60 * 1000; // 2 minutes