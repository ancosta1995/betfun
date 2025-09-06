import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { connect } from "react-redux";
import { changeWallet } from "../../../../actions/auth";
import PropTypes from "prop-types";

// MUI Components
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

const useStyles = makeStyles(theme => ({
  modal: {
    fontFamily: "Poppins",
    maxWidth: "100% !important",
    "& .MuiDialog-paperWidthSm": {
      scrollbarWidth: "none",
      maxWidth: "500px !important",
      width: "100%",
      background: "#050614",
      borderRadius: "0.5em",
      [theme.breakpoints.down("xs")]: {
        width: "100%",
        margin: "15px",
        marginTop: "80px",
        maxHeight: "80%",
      },
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        margin: "15px",
        marginTop: "80px",
        maxHeight: "80%",
      },
      [theme.breakpoints.down("md")]: {
        width: "100%",
        margin: "15px",
        marginTop: "80px",
        maxHeight: "80%",
      },
    },
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
  vipTitle: {
    fontFamily: "Poppins",
    fontSize: 20,
    textAlign: "right",
    marginTop: "2rem",
    marginRight: "1rem",
    "& > span": {
      color: "#e4e4e4",
      fontFamily: "Poppins",
    },
  },
  vipDesc: {
    width: "90%",
    color: "#e4e4e4",
    fontFamily: "Poppins",
    fontSize: "14px",
    fontWeight: 500,
    letterSpacing: ".05em",
    marginTop: "30px",
    marginLeft: "20px",
    "& > a": {
      color: "#2196F3",
      fontFamily: "Poppins",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".05em",
      textDecoration: "none",
    },
  },
  buttontest: {
    color: "#e4e4e4",
    fontFamily: "Poppins",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: ".1em",
  },
  progressbox: {
    margin: "0 1rem",
    position: "relative",
    "& > div > .MuiOutlinedInput-root": {
      "& > input": {},
    },
    "& > div": {
      width: "100%",
      "& label": {
        color: "#5f6368",
        fontFamily: "Poppins",
        fontSize: "14px",
        fontWeight: 500,
        letterSpacing: ".1em",
      },
      "& label.Mui-focused": {
        color: "#5f6368",
      },
      "& .MuiInput-underline:after": {
        border: "1px solid #2f3947",
        borderRadius: "6px",
      },
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          border: "1px solid #2f3947",
          borderRadius: "6px",
        },
        "&:hover fieldset": {
          border: "1px solid #2f3947",
          borderRadius: "6px",
        },
        "&.Mui-focused fieldset": {
          border: "1px solid #2f3947",
          borderRadius: "6px",
        },
      },
    },
    "& > button": {
      position: "absolute",
      right: 10,
      top: 10,
      width: "7rem",
      background: "#1a90d1",
      color: "#ffffff",
      "&:hover": {
        background: "#1a90d1",
      },
      "& .MuiButton-label": {},
    },
    "& > img": {
      position: "absolute",
      top: -10,
      zIndex: 1000,
    },
  },
  text: {
    color: "#9E9FBD",
    fontFamily: "Poppins",
    padding: "0 0 1rem 0"
  }
}));

const SkinsBackDeposit = ({ open, handleClose, changeWallet, url }) => {
  // Declare State
  const classes = useStyles();

  const [iframeURL, setIframeURL] = useState("");

  useEffect(() => {
    if (url) {
      setIframeURL(url);
      //console.log(url);
    }
  }, [url]);

  // Button onClick event handler
  const onClick = () => {
    setTimeout(() => {
      window.open(iframeURL);
    }, 200)
  };

  return (
    <Dialog
      className={classes.modal}
      onClose={handleClose}
      open={open}
    >
      <div className={classes.titleBox} onClose={handleClose} >
        <span style={{flex: "auto", fontSize: "1.5rem", color: "#E0E4EB" }}>Skins Deposit</span>
        <svg className={classes.buttonIcon} style={{cursor: "pointer"}} onClick={() => handleClose()} fill="currentColor" tabIndex="-1" viewBox="0 0 320 512"><path d="M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z"></path></svg>
      </div>
      <div className={classes.content} >
        <div className={classes.text}>Click continue to deposit CS:GO / RUST / DOTA2 items</div>
        <Button
          autoFocus
          disableRipple
          onClick={onClick}
          className={classes.buttontest}
          style={{ background: "hsl(215, 75%, 50%)", textTransform: "none" }}
          color="primary"
        >
          Continue
        </Button>
        <br />
      </div>
    </Dialog>
  );
};

SkinsBackDeposit.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  changeWallet: PropTypes.func.isRequired,
};

export default connect(() => ({}), { changeWallet })(SkinsBackDeposit);