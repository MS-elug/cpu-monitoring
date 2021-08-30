import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import { makeStyles } from '@material-ui/core';
import { configSlice, selectConfigDisplayAlerts } from '../../store/config/config-slice';
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
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {!displayAlerts && (
        <div title="Alerts not enabled, click here to activate">
          <NotificationsOffIcon
            onClick={() => {
              dispatch(configSlice.actions.enableAlerts())
            }}
          />
        </div>
      )}

      {displayAlerts && (
        <div title="Alerts enabled, click here to disable">
          <NotificationsActiveIcon
            onClick={() => {
              dispatch(configSlice.actions.disableAlerts())
            }}
          />
        </div>
      )}
    </div>
  );
}

export default CpuLoadNotificationControl;
