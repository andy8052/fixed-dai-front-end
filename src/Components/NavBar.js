import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'

import MenuIcon from '@material-ui/icons/Menu'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet'
import TransformIcon from '@material-ui/icons/Transform'

import { Link } from 'react-router-dom'
import ConnectButton from './ConnectButton'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1,
    color: 'white',
    paddingRight: '5%'
  }
}))

export default function NavBar() {
  const classes = useStyles()

  const [anchorEl, setAnchorEl] = React.useState(null)

  function handleClick(event) {
    setAnchorEl(event.currentTarget)
  }

  function handleClose() {
    setAnchorEl(null)
  }

  const StyledMenu = withStyles({
    paper: {
      border: '1px solid #d3d4d5'
    }
  })(props => (
    <Menu
      elevation={0}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
      {...props}
    />
  ))

  const StyledMenuItem = withStyles(theme => ({
    root: {
      '&:focus': {
        backgroundColor: theme.palette.primary.main,
        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
          color: theme.palette.common.white
        }
      }
    }
  }))(MenuItem)

  return (
    <React.Fragment>
      <AppBar position={'fixed'} color={'primary'}>
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="Menu"
            aria-controls="customized-menu"
            aria-haspopup="true"
            variant="contained"
            onClick={handleClick}
          >
            <MenuIcon />
          </IconButton>
          <StyledMenu
            id="customized-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <Link to="/lend" style={{ textDecoration: 'none' }}>
              <StyledMenuItem>
                <ListItemIcon>
                  <AccountBalanceWalletIcon />
                </ListItemIcon>
                <ListItemText primary="Lend" />
              </StyledMenuItem>
            </Link>
            <Link to="/borrow" style={{ textDecoration: 'none' }}>
              <StyledMenuItem>
                <ListItemIcon>
                  <TransformIcon />
                </ListItemIcon>
                <ListItemText primary="Borrow" />
              </StyledMenuItem>
            </Link>
          </StyledMenu>
          <Typography variant="h6" className={classes.title} align="center">
            RateSwap
          </Typography>
          <div
            style={{
              position: 'absolute',
              right: '20px',
              marginTop: '10px'
            }}
          >
            <ConnectButton />
          </div>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  )
}
