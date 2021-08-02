import React, { useState, useEffect } from "react";

// material ui
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
// redux
import { connect } from "react-redux";
import { logout } from "../../actions/authActions";
// others
import { Link, useHistory, useLocation } from "react-router-dom";
import decode from 'jwt-decode';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  userName: {
    display: "flex",
    alignItems: "center",
  },
}));

function NavBar(props) {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));

  //use when redirected
  useEffect(() => {
    // check for expired token
    const token = user?.token;
    if(token) {
      const decodedToken = decode(token);
      if(decodedToken.exp * 1000 < new Date().getTime())
        handleLogout();
    }
    setUser(JSON.parse(localStorage.getItem("profile")));
  }, [location]);

  const handleLogout = () => {
    props.logout(history);
    setUser(null);
  };

  // menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openProf = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={openProf}
          >
            {user?.result ? (
              <Avatar
                className={classes.avatar}
                alt={user?.result.name}
                src={user?.result.imageUrl}
              >
                {user?.result.name.charAt(0)}
              </Avatar>
            ) : (
              <Avatar className={classes.avatar}>?</Avatar>
            )}
          </IconButton>
          <Button
            component={Link}
            to="/"
            color="inherit"
            className={classes.title}
          >
            <Typography variant="h6">BookFace</Typography>
          </Button>
          {user?.result ? (
            <Button color="inherit" onClick={handleLogout}>Logout</Button>):
            (<Button component={Link} to="/auth" color="inherit">Login</Button>
          )}
        </Toolbar>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem>
            <Typography className={classes.userName} variant="h6">
              {user?.result ? (`logged in as: ${user?.result?.name}`):("Sign in or sign up to join the community!")}
            </Typography>
          </MenuItem>
        </Menu>
      </AppBar>
    </div>
  );
}

const mapStateToProps = (state) => ({
  authData: state.authReducer.authData,
});

export default connect(mapStateToProps, {logout})(NavBar);
