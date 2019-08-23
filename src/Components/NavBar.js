import React, {lazy, Suspense} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function NavBar(){
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
    console.log('menu button clicked')
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return(
    <React.Fragment>
        <AppBar
          position={'fixed'}
          color={'primary'}
        >
          <Toolbar>
            <Typography 
              variant="h6" 
              className={classes.title}
              align='center'
            >
              CDP Exchange Rate Swaps
            </Typography>
          </Toolbar>
        </AppBar>
    </React.Fragment>

  )
}