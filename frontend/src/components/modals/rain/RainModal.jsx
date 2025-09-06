import React from "react";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import ReCAPTCHA from "react-google-recaptcha";
import { RECAPTCHA_SITE_KEY } from "../../../services/api.service";

// MUI Components
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import CircularProgress from "@material-ui/core/CircularProgress";
import DialogContent from "@material-ui/core/DialogContent";

// Custom Styles
const useStyles = makeStyles(theme => ({
  modal: {
    "& div > div": {
      color: "#e4e4e4",
      fontFamily: "Poppins",
      fontSize: "13px",
      fontWeight: 300,
    },
    "& .MuiDialog-paperWidthSm": {
      scrollbarWidth: "none",
      width: "20%",
      background: "#050614",
      // border: "2px solid #2f3947",
      borderRadius: "20px",
      [theme.breakpoints.down("xs")]: {
        width: "100%",
        height: "25%",
        marginTop: "50px",
        margin: "15px",
      },
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        height: "25%",
        marginTop: "20px",
        margin: "15px",
      },
      [theme.breakpoints.down("md")]: {
        width: "100%",
        height: "25%",
        marginTop: "50px",
        margin: "15px",
      },
    },
  },
  captcha: {
  },
  loader: {
    width: "304px",
    height: "48px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttontest: {
    color: "#e4e4e4",
    fontFamily: "Poppins",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: ".1em",
  },
  titlePoppins: {
    fontFamily: "Poppins",
  },
  titleBox: {
    display: "flex",
    boxShadow: "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
    alignItems: "center",
    paddingTop: "1em",
    paddingLeft: "1.5em",
    paddingRight: "1em",
    paddingBottom: "1em",
    fontFamily: "Poppins", 
    backgroundColor: "#101123", 
    justifyContent: "space-between",
    width: "100%"
  },
  content: {
    padding: "1.5em",
    display: "block",
    alignItems: "center",
    justifyContent: "center",
    display: "flex"
  },
  buttonIcon: {
    color: "#9E9FBD",
    marginRight: ".5em",
    fill: "currentColor",
    flex: "none",
    width: "1.25em",
    height: "1.25em",
    display: "inline-block",
    outline: "none",
  },
}));

// Custom Styled Component
const ColorCircularProgress = withStyles({
  root: {
    color: "#4f79fd !important",
  },
})(CircularProgress);

const Help = ({ open, handleClose, onChange, loading }) => {
  // Declare State
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      className={classes.modal}
      onClose={handleClose}
      fullScreen={fullScreen}
      open={open}
      style={{ fontFamily: "Poppins", }}
    >
      <div className={classes.titleBox} onClose={handleClose} >
        <span style={{flex: "auto", fontSize: "1.5rem", color: "#E0E4EB" }}>Join Rain</span>
        <svg className={classes.buttonIcon} style={{cursor: "pointer"}} onClick={() => handleClose()} fill="currentColor" tabIndex="-1" viewBox="0 0 320 512"><path d="M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z"></path></svg>
      </div>
      <div className={classes.content}>
        {loading ? (
            <Box className={classes.loader}>
              <ColorCircularProgress />
            </Box>
        ) : (
          <ReCAPTCHA
            className={classes.captcha}
            onChange={onChange}
            sitekey={RECAPTCHA_SITE_KEY}
          />
        )}
      </div>
    </Dialog>
  );
};

export default Help;
