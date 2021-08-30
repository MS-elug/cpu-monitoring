import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import { makeStyles } from '@material-ui/core';
import { configSlice, selectConfigDisplayAlerts, selectConfigMuteAlerts } from '../../store/config/config-slice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

const useStyles = makeStyles((theme) => ({
  root: {
    color: 'white',
    cursor: 'pointer'
  }
}));

function CpuLoadNotificationControl() {
  const dispatch = useAppDispatch();
  const displayAlerts = useAppSelector(selectConfigDisplayAlerts);
  const muteAlerts = useAppSelector(selectConfigMuteAlerts);
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {!displayAlerts && (
        <div title="Alerts not enabled, click here to activate">
          <NotificationsOffIcon
            onClick={() => {
              dispatch(configSlice.actions.enableAlerts());
            }}
          />
        </div>
      )}

      {displayAlerts && (
        <div title="Alerts enabled, click here to disable">
          <NotificationsActiveIcon
            onClick={() => {
              dispatch(configSlice.actions.disableAlerts());
            }}
          />
        </div>
      )}
      
      {displayAlerts && muteAlerts && (
        <div title="Unmute alerts">
          <VolumeOffIcon
            onClick={() => {
              dispatch(configSlice.actions.unmuteAlerts());
            }}
          />
        </div>
      )}
      {displayAlerts && !muteAlerts && (
        <div title="Mute alerts">
          <VolumeUpIcon
            onClick={() => {
              dispatch(configSlice.actions.muteAlerts());
            }}
          />
        </div>
      )}
    </div>
  );
}

export default CpuLoadNotificationControl;
