import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  root: {
    lineHeight: '2rem',
    fontSize: '2rem'
  },
  table: {
    minWidth: 650
  },
  explanations: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  heavyLoadRow: {
    backgroundColor: 'rgb(253, 236, 234)'
  },
  recoveredLoadRow: {
    backgroundColor: 'rgb(237, 247, 237)'
  }
}));
