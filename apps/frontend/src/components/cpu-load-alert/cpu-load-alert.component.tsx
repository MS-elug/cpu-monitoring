import { useEffect, useState } from 'react';
import Alert, { Color } from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import { notificationService } from '../../services/notification.service';
import { useAppSelector } from '../../store/hooks';
import { selectConfigDisplayAlerts, selectConfigMuteAlerts } from '../../store/config/config-slice';
import { CPUState, selectCpuLoadStatus } from '../../store/cpu-load/cpu-load-slice';
import { audios, audioService, AudioService } from '../../services/audio.service';

interface AlertMessage {
  open: boolean;
  text: string;
  severity: Color;
}

function CpuLoadAlert() {
  // State to control snackbar message display
  const [message, setMessage] = useState<AlertMessage | undefined>();
  const displayAlerts = useAppSelector(selectConfigDisplayAlerts);
  const muteAlerts = useAppSelector(selectConfigMuteAlerts);
  const cpuLoadStatus = useAppSelector(selectCpuLoadStatus);
  const [previousCpuLoadStatus, setPreviousCpuLoadStatus] = useState<CPUState | undefined>();

  useEffect(() => {
    // If alerts are disabled, exit
    if (!displayAlerts) {
      setMessage(undefined);
      return;
    }

    // Don't react on same status update
    if (!previousCpuLoadStatus) {
      setPreviousCpuLoadStatus(cpuLoadStatus);
    }
    if (!previousCpuLoadStatus || previousCpuLoadStatus === cpuLoadStatus) {
      return;
    }

    let msg: AlertMessage | undefined;
    let audioFile: audios | undefined;
    if (cpuLoadStatus === 'heavy') {
      msg = { open: true, text: `ALERT - CPU heavy load detection`, severity: 'error' };
      audioFile = 'alert';
    } else if (cpuLoadStatus === 'recovered') {
      msg = { open: true, text: `ALERT - CPU recovered from heavy load`, severity: 'success' };
      audioFile = 'notification';
    }

    if (msg) {
      // Use browser notification
      if (notificationService.enabled) {
        notificationService.notify('CPU MONITORING ALERT', { body: msg.text });
      }
      // Display alert in a UI snackbar
      setMessage(msg);

      // Play sound
      if (!muteAlerts && audioFile) {
        audioService.play(audioFile);
      }
    }
  }, [displayAlerts, muteAlerts, cpuLoadStatus, previousCpuLoadStatus]);

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
