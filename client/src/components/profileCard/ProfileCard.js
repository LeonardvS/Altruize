import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import { pink, teal, grey } from '@material-ui/core/colors';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import {
  createMuiTheme,
  makeStyles,
  MuiThemeProvider,
} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import React, { useState, useEffect } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import ClearIcon from '@material-ui/icons/Clear';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../../services/UsersAPI';
import { userInfo } from '../../actions';

export default function SignUp() {
  const classes = useStyles();
  const userProfileInfo = useSelector((state) => state.userInfo);
  const [userName, setUserName] = useState('');
  const [address, setAddress] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [profilePic, setProfilePic] = useState(
    'https://media-exp1.licdn.com/dms/image/C4D03AQEuhw7UQwbX5A/profile-displayphoto-shrink_200_200/0?e=1594252800&v=beta&t=CJ7wNArHAR2JQhlbCWOaTUh2i6JjK6YiuR9bQD3GPCo'
  );

  const dispatch = useDispatch();

  useEffect(() => {
    setUserName(userProfileInfo.user_name);
    setAddress(userProfileInfo.address);
    setAboutMe(userProfileInfo.about_me);
    setEmail(userProfileInfo.email);
    setPassword(userProfileInfo.password);
    setProfilePic(userProfileInfo.profile_pic);
  }, [userProfileInfo, editMode]);

  const handleEditMode = () => {
    setEditMode(!editMode);
  };
  const handleUserName = (e) => {
    setUserName(e.target.value);
  };

  const handleAddress = (e) => {
    setAddress(e.target.value);
  };

  const handleAboutMe = (e) => {
    setAboutMe(e.target.value);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      user_id: userProfileInfo.id,
      user_name: userName,
      about_me: aboutMe,
      email: email,
      password: password,
      address: address,
      profile_pic: profilePic,
    };
    const updatedUser = await updateUser(body);
    dispatch(userInfo(updatedUser[1][0]));
    setEditMode(!editMode);
  };

  const handleProfilepic = (e) => {
    setProfilePic(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <MuiThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <input
            accept="image/*"
            disabled={editMode ? false : true}
            className={classes.addphoto}
            id="add-image-file"
            type="file"
            onChange={handleProfilepic}
          />
          <label htmlFor="add-image-file">
            <Avatar
              className={classes.avatar}
              alt={userName}
              src={profilePic}
            />
          </label>
          <div>
            <Button
              variant="contained"
              color={editMode ? 'grey' : 'primary'}
              className={editMode ? classes.discard : classes.edit}
              startIcon={editMode ? <ClearIcon /> : <EditIcon />}
              onClick={handleEditMode}
            >
              {editMode ? 'Discard changes' : 'Edit Profile'}
            </Button>
          </div>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  onChange={handleUserName}
                  name="User Name"
                  value={userName}
                  variant="outlined"
                  disabled={editMode ? false : true}
                  required
                  fullWidth
                  id="user_name"
                  label="User Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  onChange={handleAddress}
                  variant="outlined"
                  value={address}
                  required
                  fullWidth
                  disabled={editMode ? false : true}
                  id="location"
                  label="Location"
                  name="location"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  onChange={handleAboutMe}
                  value={aboutMe}
                  required
                  fullWidth
                  multiline
                  rows={2}
                  rowsMax={4}
                  disabled={editMode ? false : true}
                  name="about"
                  label="About me"
                  id="multiline"
                />
              </Grid>
              <Grid item xs={12}>
                <ExpansionPanel>
                  <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography className={classes.heading}>
                      Account Settings
                    </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      disabled={editMode ? false : true}
                      onChange={handleEmail}
                      id="email"
                      label="Email"
                      name="email"
                      value={email}
                      autoComplete="email"
                    />
                  </ExpansionPanelDetails>
                  <ExpansionPanelDetails>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      disabled={editMode ? false : true}
                      id="Password"
                      onChange={handlePassword}
                      label="Password"
                      name="password"
                      type="password"
                      value={password}
                      autoComplete="current-password"
                    />
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              </Grid>
              {editMode ? (
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color={editMode ? 'secondary' : 'primary'}
                  className={classes.submit}
                  startIcon={editMode ? <SaveIcon /> : <EditIcon />}
                  onClick={handleSubmit}
                >
                  {editMode ? 'Save changes' : 'Edit Profile'}
                </Button>
              ) : null}
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
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(10),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  addphoto: {
    display: 'none',
  },
  avatar: {
    width: theme.spacing(12),
    height: theme.spacing(12),
    marginBottom: theme.spacing(3),
  },
  edit: {
    margin: theme.spacing(3),
    backgroundColor: 'primary',
    color: 'white',
  },
  discard: {
    margin: theme.spacing(3),
    backgroundColor: grey.A200,
    color: 'white',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  caption: {
    margin: theme.spacing(2),
  },
  submit: {
    margin: theme.spacing(3, 10, 2),
    backgroundColor: pink[500],
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));