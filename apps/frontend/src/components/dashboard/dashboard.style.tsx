import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  dashboard: {},
  cpuLoadSection: {
    backgroundColor: '#252f3e',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    flex: 2,
    overflow: 'hidden'
  },
  cpuLoadDetailsSection: {
    flex: 3,
    paddingTop: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(4),
    borderRadius: '2rem'
  },
  fullHeight: {
    height: '100%'
  },
  fullWidth: {
    width: '100%'
  },
  container: {
    maxWidth: '960px',
    width: '100%'
  },
  overflowHidden: {
    overflow: 'hidden'
  },
  lightText: {
    color: 'white'
  }
}));