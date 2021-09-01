import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  dashboard: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%'
  },
  topSection: {
    flexGrow: 1,
    flexBasis: 0,
    backgroundColor: '#252f3e',
    display: 'flex',
    justifyContent: 'center',
    paddingBottom: theme.spacing(2)  
  },
  graphBox: {
    display: 'flex',
    flexDirection: 'column'
  },
  bottomSection: {
    flexGrow: 2,
    flexBasis: 0,
    display: 'flex',
    justifyContent: 'center',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    overflowY: 'auto'
  },
  dataBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  container: {
    width: '80%',
    maxWidth: '960px'
  },
  paper: {
    padding: theme.spacing(2),
    borderRadius: '1rem',
    minHeight: '100px'
  },
  fullHeight: {
    height: '100%'
  },
  lightText: {
    color: 'white'
  },
  explanations: {
    marginTop: theme.spacing(2)
  }
}));
