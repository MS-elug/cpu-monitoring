import { makeStyles } from '@material-ui/core/styles';

/** override rickshaw default style */
export const useStyles = makeStyles((theme) => ({
  graphContainer: {
    '& .rickshaw_graph .y_grid .tick line': {
      stroke: 'rgb(255,255,255,0.3)'
    },
    '& .rickshaw_graph .tick text': {
      fill: 'rgb(255,255,255,0.8)',
      opacity: 1,
      fontSize: '1.1em'
    },
    '& .rickshaw_graph .x_tick': {
      borderLeftColor: 'rgb(255,255,255,0.3)'
    },
    '& .rickshaw_graph .title': {
      color: 'white',
      fontSize: '1.1em',
      opacity: 0.8
    }
  }
}));
