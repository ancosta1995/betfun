import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { NavLink as Link } from "react-router-dom";

// Imports for isAuthenticated
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter, Redirect } from "react-router-dom";

// REcaptcha for Login & Register
import ReCAPTCHA from "react-google-recaptcha";

// API Services
import { tryLoginUser, tryRegisterUser, RECAPTCHA_SITE_KEY, tryForgotPassword, tryResetPassword } from "../../../services/api.service";

// notification
import { useToasts } from "react-toast-notifications";

// MUI Containers
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grow from '@material-ui/core/Grow';

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import InputAdornment from "@material-ui/core/InputAdornment";
import Input from "@material-ui/core/Input";
import IconButton from "@material-ui/core/IconButton";
import { useEffect } from "react";

import Terms from "../TermsModal";

// Custom Styles
const useStyles = makeStyles(theme => ({
  inputs: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    fontFamily: "Poppins",
    fontWeight: "500",
    color: "#e0e0e0",
    transitionDuration: "200ms",
    "& > div": {
      transitionDuration: "200ms",
      "& label": {
        color: "#e0e0e0",
        fontFamily: "Poppins",
        fontSize: "14px",
        fontWeight: 300,
        letterSpacing: ".1em",
        transitionDuration: "200ms",
      },
      "& label.Mui-focused": {
        color: "#e0e0e0",
        fontFamily: "Poppins",
        fontWeight: "300",
        transitionDuration: "200ms",
      },
      "& .MuiInput-underline:after": {
        border: "2px solid #3d5564",
        fontFamily: "Poppins",
        fontWeight: "300",
        transitionDuration: "200ms",
      },
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          border: "1px solid transparent",
          fontFamily: "Poppins",
          fontWeight: "300",
          transitionDuration: "200ms",
        },
        "&:hover fieldset": {
          border: "1px solid transparent",
          fontFamily: "Poppins",
          fontWeight: "300",
          transitionDuration: "200ms",
        },
        "&.Mui-focused fieldset": {
          border: "1px solid hsl(220, 22%, 62%)",
          fontFamily: "Poppins",
          fontWeight: "300",
          transitionDuration: "200ms",
        },
      },
      "& .MuiInput-root": {
        border: "1px solid hsl(220, 22%, 62%)",
        fontFamily: "Poppins",
        fontWeight: "300",
        transitionDuration: "200ms",
      },
      "&.MuiInputBase-root": {
        backgroundColor: "#101123",
        
        borderRadius: "6px",
        marginBottom: "10px",
        color: "#e0e0e0",
        fontFamily: "Poppins",
        fontWeight: "300",
        padding: "10px 10px",
        border: "1px solid transparent",
        "& > div > input": {
          color: "#e0e0e0",
          fontFamily: "Poppins",
          fontWeight: "300",
          border: "1px solid hsl(220, 22%, 62%)",
        },
      },
      "& > div > input": {
        backgroundColor: "#101123",
        borderRadius: "6px",
        transitionDuration: "200ms",
        color: "#e0e0e0",
        fontFamily: "Poppins",
        fontWeight: "300",
      },
    },
    "& > div > div": {
      background: "#1D2126 !important",
      color: "#e0e0e0",
      fontFamily: "Poppins",
      fontWeight: "300",
      marginBottom: "10px",
      borderRadius: "6px",
    },
  },
  root: {
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("xs")]: {
      minHeight: "1rem",
    },
    [theme.breakpoints.down("sm")]: {
      minHeight: "1rem",
    },
    [theme.breakpoints.down("md")]: {
      minHeight: "1rem",
    },
  },
  lastupdate: {
    color: "#5f6368",
    fontFamily: "Poppins",
    fontSize: "14px",
    fontWeight: 400,
    letterSpacing: ".005em",
  },
  counterup: {
    color: "#9d9d9d",
    fontFamily: "Poppins",
    fontSize: "14px",
    fontWeight: 400,
    letterSpacing: ".005em",
  },
  buttonregister: {
    color: "#ffffff",
    width: "40%",
    fontSize: "13px",
    background: "#707479",
    fontFamily: "Poppins",
    fontWeight: "500",
    letterSpacing: ".02em",
    "&:hover": {
      opacity: "0.9",
      background: "#707479",
    },
  },
  buttonlogin: {
    color: "#ffffff",
    width: "100%",
    fontSize: "13px",
    background: "hsl(215, 75%, 50%)",
    fontFamily: "Poppins",
    fontWeight: "500",
    letterSpacing: ".02em",
    transition: "all 200ms",
    textTransform: "none",
    "&:hover": {
      opacity: "0.75",
      background: "hsl(215, 75%, 50%)",
    },
  },
  sectionOR: {
    maxWidth: "200px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifySelf: "center",
    "& p": {
      width: "100%",
      textAlign: "center",
      borderBottom: "1px solid #636567",
      lineHeight: "0.1em",
      margin: "10px 0 20px",
    },
    "& p span": {
      background: "#050614",
      padding: "0 10px",
    },
  },
  steam: {
    fontFamily: "Poppins",
    textTransform: "capitalize",
    background: "#3d5564",
    color: "white",
    marginLeft: "auto",
    marginTop: "20px",
    marginBottom: "10px",
    "&:hover": {
      opacity: "0.9",
      background: "#3d5564",
    },
  },
  google: {
    fontFamily: "Poppins",
    textTransform: "capitalize",
    marginLeft: "10px",
    marginTop: "10px",
    background: "#3d5564",
    color: "white",
    "&:hover": {
      opacity: "0.9",
      background: "#3d5564",
    },
  },
  noLink: {
    textDecoration: "none",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    color: "#5f6368",
    fontFamily: "Poppins",
    fontSize: "14px",
    fontWeight: 400,
    letterSpacing: ".005em",
    "& img": {
      width: "5rem",
      marginBottom: "1rem",
    },
    "& h1": {
      // fontSize: 50,
      margin: "0",
      color: "#b9b9b9",
      fontFamily: "Poppins",
      fontSize: "19px",
      fontWeight: 500,
      letterSpacing: ".005em",
    },
    "& b": {
      color: "#9d9d9d",
      fontFamily: "Poppins",
      fontSize: "16px",
      fontWeight: 500,
      letterSpacing: ".005em",
    },
  },
  tos: {
    color: "#9E9FBD",
    border: "0.125em solid #272847",
    padding: "0.5em 0.75em",
    fontSize: "0.875rem",
    borderRadius: "0.5em",
    margin: "0.5rem 0 1rem 0"
  }
}));

const Registration = ({ isAuthenticated }) => {
  // Declare State
  const classes = useStyles();

  const { addToast } = useToasts();

  const [terms, setTerms] = useState(false);

  const [isLoginFields, setLoginFields] = useState(true);

  // forgot password system
  const [forgotPassword, setForgotPassword] = useState(false);
  const [FGEmail, setFGEmail] = useState("");
  const [FGCode, setFGCode] = useState("");
  const [FGPassword, setFGPassword] = useState("");
  const [FGConfirmPassword, setFGConfirmPassword] = useState("");
  const [FGInput, setFGInput] = useState(false);
  const [FGPasswordInputs, setFGPasswordInputs] = useState(false);
  const [clickedBtn, setClickedBtn] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [email, setEmail] = useState("");

  // REcaptcha
  const [reCaptcha, setReCaptcha] = useState(null);
  const [sent, setSent] = useState(true);

  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // get query for forgot password
  useEffect(() => {
    if (window.location.search.indexOf("email=") === -1) return;
    let searchParams = window.location.search.split("?")[1].split("&");
    setForgotPassword(true);
    setFGInput(true);
    setFGPasswordInputs(true);
    searchParams.forEach(i => {
      let key = i.split("=")[0];
      let value = i.split("=")[1];

      switch (key) {
        default:
          break;
        case "email":
          setFGEmail(value);
          break;
        case "code":
          setFGCode(value);
          break;
      }
    });
  }, [addToast]);

  // Redirect if logged in
  if (isAuthenticated) return <Redirect to="/" />;

  // Forgot password inputs
  const onChangeFGEmail = e => {
    setFGEmail(e.target.value);
  };

  const onChangeFGCode = e => {
    setFGCode(e.target.value);
    if (e.target.value.length > 0) setFGPasswordInputs(true);
    else setFGPasswordInputs(false);
  };

  const onChangeFGPassword = e => {
    setFGPassword(e.target.value);
  };

  const onChangeFGConfirmPassword = e => {
    setFGConfirmPassword(e.target.value);
  };

  const resetForgotPassword = () => {
    setForgotPassword(false);
    setFGInput(false);
    setFGPasswordInputs(false);
    setFGEmail("");
    setFGCode("");
    setFGPassword("");
    setFGConfirmPassword("");
  };

  const onClickFGBtn = async () => {
    if (clickedBtn) return addToast("Please wait until you receive a response!", { appearance: "error" });
    setClickedBtn(true);
    if (FGInput && FGPasswordInputs) {
      if (FGPassword !== FGConfirmPassword) return [addToast("The passwords are not equal!", { appearance: "error" }), setClickedBtn(false)];
      let resp = await tryResetPassword(FGEmail, FGCode, FGPassword, reCaptcha);
      if (resp.recaptcha) resetCaptcha();
      if (resp.code) {
        setFGInput(false);
        setFGPasswordInputs(false);
        setFGCode("");
      }
      if (resp.error) return [addToast(resp.error, { appearance: "error" }), setClickedBtn(false)];
      addToast("You have successfully reset your password, try login in!", { appearance: "success" });
      resetForgotPassword();
      resetCaptcha();
      setClickedBtn(false);
      return;
    }
    let resp = await tryForgotPassword(FGEmail, reCaptcha);
    if (resp.recaptcha) resetCaptcha();
    if (resp.error) return [addToast(resp.error, { appearance: "error" }), setClickedBtn(false)];
    addToast("We've sent you an email containing the security code to reset your password!", { appearance: "success" });
    setFGInput(true);
    setClickedBtn(false);
  };

  // Input onChange event handler
  const onChangeUsername = e => {
    setUsername(e.target.value);
  };
  const onChangePassword = e => {
    setPassword(e.target.value);
  };
  const onChangePassword2 = e => {
    setPassword2(e.target.value);
  };
  const onChangeEmail = e => {
    setEmail(e.target.value);
  };

  // ReCAPTCHA onChange event handler
  const reCaptchaOnChange = value => {
    // Update state
    setReCaptcha(value);
  };

  // reset
  const resetCaptcha = () => {
    setSent(false);
    setSent(true);
  };

  // Goto on clicks
  const onClickGotoLogin = e => {
    setLoginFields(true);
    setForgotPassword(false);
    setFGInput(false);
    setFGPasswordInputs(false);
    emptyFields();
  };
  const onClickGotoRegister = e => {
    setLoginFields(false);
    emptyFields();
  };

  // On click - API endpoints

  const onClickRegister = async e => {
    if (password !== password2) return addToast("The passwords are not equal!", { appearance: "error" });
    let resp = await tryRegisterUser(username, password, email, reCaptcha);
    if (resp.recaptcha) resetCaptcha();
    if (resp.error) return addToast(resp.error, { appearance: "error" });
    addToast("You've successfully registered an account!", { appearance: "success" });
    setTimeout(() => {
      window.location.href = resp.redirect;
    }, 1000);
  };

  const onClickLogin = async e => {
    let resp = await tryLoginUser(email, password, reCaptcha);
    if (resp.recaptcha) resetCaptcha();
    if (resp.error) return addToast(resp.error, { appearance: "error" });
    if (resp.redirect) {
      addToast("You've been successfully logged in!", { appearance: "success" });
      setTimeout(() => {
        window.location.href = resp.redirect;
      }, 1000);
    }
  };

  // Empty fields
  const emptyFields = () => {
    setUsername("");
    setPassword("");
    setPassword2("");
    setEmail("");
  };

  return (
    <Box className={classes.root}>
      <Terms 
        open={terms}
        handleClose={() => setTerms(!terms)}
      />
      {(
        <div className={classes.container}>
          <Box className={classes.inputs}>
            <TextField
              name="email"
              type="email"
              variant="outlined"
              placeholder="Email"
              onChange={onChangeEmail}
              value={email}
            />
            <TextField
              name="username"
              variant="outlined"
              placeholder="Username"
              onChange={onChangeUsername}
              value={username}
            />
            <TextField
              name="password"
              type="password"
              variant="outlined"
              placeholder="Password"
              onChange={onChangePassword}
              value={password}
            />
            {/*<Input
              disableUnderline={true}
              name="password"
              type={values.showPassword ? "text" : "password"}
              variant="outlined"
              placeholder="Password*"
              onChange={onChangePassword}
              value={password}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    style={{ marginTop: "11px", color: "rgb(203 198 198)", }}
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />*/}
            <TextField
              name="password2"
              type="password"
              variant="outlined"
              placeholder="Repeat Password"
              onChange={onChangePassword2}
              value={password2}
            />
          </Box>
          <div className={classes.tos}>
            <p style={{ margin: 0}}>I agree and understand the <span style={{ textDecoration: "none", color: "rgb(58, 137, 235)", cursor: "pointer" }} onClick={() => setTerms(!terms)}>Terms & Conditions</span>.</p>
            <span >
              betfun.gg is protected by reCaptcha.
              <b><span style={{ fontSize: "13px", cursor: "pointer", }}> <a style={{ textDecoration: "none", color: "rgb(58, 137, 235)", }} href="https://policies.google.com/privacy?hl=en-GB" target="_blank" rel="noreferrer">Privacy Policy</a></span></b> and <b><span style={{ fontSize: "13px", cursor: "pointer", }}> <a style={{ textDecoration: "none", color: "rgb(58, 137, 235)", }} href="https://policies.google.com/terms?hl=en-GB" target="_blank" rel="noreferrer">Terms of Service</a></span></b> apply.
            </span>
          </div>
          <div style={{display: "flex", alignItems: "center", margin: "auto"}}>
            {sent ? <ReCAPTCHA
              className={classes.captcha}
              onChange={reCaptchaOnChange}
              sitekey={RECAPTCHA_SITE_KEY}
            /> : null}
          </div>
          
          <div style={{display: "flex", alignItems: "center", margin: "1.5em auto 0 auto"}}>
            <Button
              size="medium"
              color="primary"
              className={classes.buttonlogin}
              variant="contained"
              onClick={onClickRegister}
            >
              <span>Play Now</span>
            </Button>
          </div>

        </div>
      )}
    </Box >
  );
};

Registration.propTypes = {
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(withRouter(Registration));