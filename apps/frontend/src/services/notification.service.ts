import { useBrowserNotification } from '../environement/environement';

/** Service to display browser notifications */
class NotificationService {
  private _enabled: boolean = useBrowserNotification;

  /** Return true if the service is enabled  */
  get enabled() {
    return this._enabled;
  }

  /** Return true if the service is enabled and browser permission granted */
  get actived() {
    return this.enabled && this.isPermissionGranted();
  }

  /** Enable the service */
  enable() {
    this._enabled = true;
  }

  /** Disable the service */
  disable() {
    this._enabled = false;
  }

  /** Ask for permission at application start */
  registerNativeNotificationATStartup() {
    if (!this.enabled) {
      return;
    }
    window.addEventListener('load', () => {
      // Check if Browser supports Notification
      if (!window.Notification) {
        return;
      }

      // Check if user has not yet granted the access ask for it
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    });
  }

  /** Requestion permission to user */
  requestPermission() {
    Notification.requestPermission();
  }

  /** Check if Permission is granted */
  isPermissionGranted() {
    return window.Notification && Notification.permission === 'granted';
  }

  /**
   * Display a browser notification
   * @returns {boolean} true if the notification has been shown to user. False if the notification couldn't be displayed
   */
  notify(title: string, options?: NotificationOptions) {
    if (!this.enabled) {
      return false;
    }
    // Check if Browser supports Notification
    if (!window.Notification) {
      return false;
    }

    if (window.Notification && Notification.permission === 'granted') {
      new Notification(title, options);
    } else if (window.Notification && Notification.permission !== 'denied') {
      Notification.requestPermission((status) => {
        if (status === 'granted') {
          new Notification(title, options);
        }
      });
    } else {
      return false;
    }

    return true;
  }
}

// Export the service as a singleton
export const notificationService = new NotificationService();
