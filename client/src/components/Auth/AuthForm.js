import React, { useState } from "react";

// material ui
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
  Typography,
  Container,
  Link,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import { makeStyles } from "@material-ui/core/styles";
// google login
import { GoogleLogin } from "react-google-login";
// redux
import { connect } from "react-redux";
import { jwtLogin, jwtSignUp, gLogin } from "../../actions/authActions";
import { useHistory } from "react-router-dom";
// butter toast
import ButterToast, { Cinnamon } from "butter-toast";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submitBtn: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function AuthForm(props) {
  const classes = useStyles();
  const history = useHistory();

  // form data
  const [values, setValues] = useState(initialValues);
  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if(!isLogin) {
      if(values.password !== values.confirmPassword) {
        ButterToast.raise({
          content: (
            <Cinnamon.Crisp
              title="Passwords do not match!"
              scheme={Cinnamon.Crisp.SCHEME_RED}
              icon={<PriorityHighIcon />}
            />
          ),
        });
      } else { 
        const onFail = () => {
          ButterToast.raise({
            content: (
              <Cinnamon.Crisp
                title="Email already in use."
                scheme={Cinnamon.Crisp.SCHEME_RED}
                icon={<PriorityHighIcon />}
              />
            ),
          });
        }
        props.jwtSignUp(values, history, onFail); 
      }
    } 
    else {
      const onFail = () => {
        ButterToast.raise({
          content: (
            <Cinnamon.Crisp
              title="Invalid email or password."
              scheme={Cinnamon.Crisp.SCHEME_RED}
              icon={<PriorityHighIcon />}
            />
          ),
        });
      }
      props.jwtLogin(values, history, onFail);
    }
  };

  // show sign-in OR sign-up form
  const [isLogin, setIsLogin] = useState(true);
  const toggleForm = () => {
    setIsLogin((toggle) => !toggle);
    setShowPassword(false);
  };
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => {
    setShowPassword((toggle) => !toggle);
  };

  // google login
  const googleSucc = async (res) => {
    const result = res?.profileObj;
    const token = res?.tokenId;
    try {
      props.gLogin(result, token, history);
    } catch (err) {
      console.log(err);
    }
  };
  const googleFail = (err) => {
    ButterToast.raise({
      content: (
        <Cinnamon.Crisp
          title="Google sign-in failed!"
          scheme={Cinnamon.Crisp.SCHEME_RED}
          icon={<PriorityHighIcon />}
        />
      ),
    });
    console.log(err);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {isLogin ? "Sign In" : "Sign Up"}
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {!isLogin && (
              <React.Fragment>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    label="First Name"
                    name="firstName"
                    onChange={handleChange}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    onChange={handleChange}
                  />
                </Grid>
              </React.Fragment>
            )}
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Email Address"
                name="email"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                onChange={handleChange}
              />
            </Grid>
            {!isLogin && (
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  onChange={handleChange}
                />
              </Grid>
            )}
            <Grid>
              <FormControlLabel 
                control={<Checkbox checked={showPassword} onChange={togglePassword} name="showPassword" />}
                label="Show Password"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submitBtn}
          >
            {isLogin ? "Sign In" : "Sign Up"}
          </Button>
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12}>
              <GoogleLogin
                clientId="GOOGLE ID HERE"
                buttonText="Sign in with Google"
                onSuccess={googleSucc}
                onFailure={googleFail}
                cookiePolicy="single_host_origin"
              />
            </Grid>
          </Grid>
          <br />
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2" onClick={toggleForm}>
                {isLogin
                  ? "Don't have an account? Sign Up"
                  : "Already have an account? Sign In"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

const mapStateToProps = (state) => ({
  authData: state.authReducer.authData,
});

export default connect(mapStateToProps, { jwtSignUp, jwtLogin, gLogin })(
  AuthForm
);
