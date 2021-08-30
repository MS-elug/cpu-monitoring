import { useEffect, useState } from 'react';
import { cpuAlertService } from '../../services/cpu-alert.service';
import Alert, { Color } from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import { notificationService } from '../../services/notification.service';
import { useAppSelector } from '../../store/hooks';
import { selectConfigDisplayAlerts } from '../../store/config/config-slice';
import { skip } from 'rxjs/operators';

interface AlertMessage {
  open: boolean;
  text: string;
  severity: Color;
}

const audioAlertURI = '/assets/sounds/alert.mp3';
const audioNotificationURI = '/assets/sounds/notification.mp3';
function playAudio(audioURI: string) {
  new Audio(audioURI).play();
}

function CpuLoadAlert() {
  // State to store snacl bar message display
  const [message, setMessage] = useState<AlertMessage | undefined>();
  const alertEnabled = useAppSelector(selectConfigDisplayAlerts);

  useEffect(() => {
    // If alerts are disabled, exit
    if (!alertEnabled) {
      setMessage(undefined);
      return;
    }

    const subcription = cpuAlertService
      .getState$()
      .pipe(skip(1)) // Skip the first item because it's a behavior subject, we are interested by state change only
      .subscribe((status) => {
        let msg: AlertMessage | undefined;
        let audioUrl: string | undefined;
        if (status === 'heavy') {
          msg = { open: true, text: `ALERT - CPU heavy load detection`, severity: 'error' };
          audioUrl = audioAlertURI;
        } else if (status === 'recovered') {
          msg = { open: true, text: `ALERT - CPU recovered from heavy load`, severity: 'success' };
          audioUrl = audioNotificationURI;
        }

        if (msg) {
          // Use browser notification
          if (notificationService.enabled) {
            notificationService.notify('CPU MONITORING ALERT', { body: msg.text });
          }
          // Use UI snackbar
          setMessage(msg);

          // Play sound
          if (audioUrl) {
            playAudio(audioUrl);
          }
        }
      });

    return () => {
      subcription.unsubscribe();
    };
  }, [alertEnabled]);

  const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
    if (!message || reason === 'clickaway') {
      return;
    }
    setMessage({ ...message, open: false });
  };

  return (
    <div>
      {message && (
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
          autoHideDuration={6000}
          open={message.open}
          onClose={handleClose}
        >
          <Alert variant="filled" onClose={handleClose} severity={message.severity}>
            {message.text}
          </Alert>
        </Snackbar>
      )}
    </div>
  );
}

export default CpuLoadAlert;
