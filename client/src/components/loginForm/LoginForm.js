import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import { indigo, pink, red, teal } from '@material-ui/core/colors';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import {
  createMuiTheme,
  makeStyles,
  MuiThemeProvider,
} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import {
  orgId,
  userId,
  userInfo,
  orgInfo,
  eventSelectionButton
} from '../../actions';
import ToggleSwitch from '../../components/toggleSwitch/ToggleSwitch';
import { getOrgLogin, getOrgByLoginId } from '../../services/OrgsAPI';
import { getUserLogin, getUserByLoginId } from '../../services/UsersAPI';

export default function LoginForm () {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState(null);
  const [user, setUser] = useState({ email: '', password: '' });
  const { from } = location.state || { from: { pathname: '/' } };

  function updateUser (event) {
    setUser({
      ...user,
      [event.target.name]: event.target.value,
    });
  }

  function resetInputFields () {
    return setUser({
      email: '',
      password: '',
    });
  }

  async function handleSubmit (event) {
    event.preventDefault();
    setLoading(true);
    let authToken;
    let loggedUser;

    if (checked) {
      authToken = await getOrgLogin({
        org_email: user.email,
        org_password: user.password,
      });
    } else {
      authToken = await getUserLogin({
        user_email: user.email,
        user_password: user.password
      });
    };

    if (authToken === 'Invalid email') {
      setMessage('Invalid email or password. Make sure you log in with the correct account type');
      setError(true);
      console.log('Invalid email');
    } else if (authToken === 'Invalid password') {
      setMessage('Invalid email or password. Make sure you log in with the correct account type');
      setError(true);
      console.log('Invalid password');
    } else {
      setMessage('Succesfully logged in!');
      localStorage.setItem('altruize-token', authToken);
      if (checked) {
        loggedUser = await getOrgByLoginId();
      } else {
        loggedUser = await getUserByLoginId();
      };


      checked ? dispatch(orgId(loggedUser.id)) : dispatch(userId(loggedUser.id));
      checked ? dispatch(orgInfo(loggedUser)) : dispatch(userInfo(loggedUser));
      checked && dispatch(eventSelectionButton('MY EVENTS'));

      setTimeout(() => history.replace(from), 700);
    }

    resetInputFields();
    setTimeout(() => {
      setLoading(false);
      setError(false);
      setMessage(null);
    }, 3000);
  }

  const toggleChecked = () => {
    setChecked(!checked);
  };

  return (
    <MuiThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Avatar className={checked ? classes.avatarNGO : classes.avatarUser}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Log in
          </Typography>
          <Typography className={classes.caption} variant="caption">
            {checked
              ? 'Login as a NGO, if you are a Person, flip the switch'
              : 'Login as a Person, if you are an NGO, flip the switch.'}
          </Typography>
          <ToggleSwitch toggleChecked={toggleChecked} checked={checked} />
          <form className={classes.form} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  name="email"
                  type="email"
                  label="Email Address"
                  autoComplete="email"
                  value={user.email}
                  onChange={(event) => updateUser(event)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="password"
                  value={user.password}
                  onChange={(event) => updateUser(event)}
                />
              </Grid>
              {loading ?
                <Typography className={error ? classes.error : classes.success} variant="caption">
                  {message}
                </Typography>
                : null}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className={checked ? classes.submitNGO : classes.submit}
            >
              Log In
            </Button>
            <Grid container justify="center">
              <Grid item>
                <Link style={{fontSize: '12px'}} to="/signUp">You don't have an account yet? Sign up</Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </MuiThemeProvider>
  );
}

const theme = createMuiTheme({
  palette: {
    primary: teal,
    secondary: pink,
  },
});

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatarUser: {
    margin: theme.spacing(1),
    backgroundColor: teal[200],
  },
  avatarNGO: {
    margin: theme.spacing(1),
    backgroundColor: pink[200],
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  caption: {
    margin: theme.spacing(2),
  },
  error: {
    margin: theme.spacing(2),
    color: 'red',
    textAlign: 'center',
  },
  success: {
    margin: theme.spacing(2),
    color: 'green',
    textAlign: 'center',
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: teal[500],
    color: 'white',
  },
  submitNGO: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: pink[500],
    color: 'white',
  }
}));
