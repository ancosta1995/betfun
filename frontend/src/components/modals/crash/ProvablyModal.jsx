import React from "react";
import { makeStyles, withStyles } from "@material-ui/core";

// MUI Components
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles(theme => ({
  modal: {
    "& div > div": {
      color: "#e4e4e4",
      fontFamily: "Poppins",
      fontSize: "13px",
      fontWeight: 500,
      letterSpacing: ".1em",
    },
    "& .MuiDialog-paperWidthSm": {
      scrollbarWidth: "none",
      width: "50%",
      background: "#1D2126",
      // border: "2px solid #2f3947",
      borderRadius: "20px",
      [theme.breakpoints.down("xs")]: {
        width: "100%",
        margin: "15px",
      },
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        margin: "15px",
      },
      [theme.breakpoints.down("md")]: {
        width: "100%",
        margin: "15px",
      },
    },
    "& .MuiFormLabel-root.Mui-disabled": {
      color: "#3a3f64",
    },
    "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline": {
      background: "#1D2126",
    },
    "& .MuiFormHelperText-root.Mui-disabled": {
      color: "#4960ed",
    },
  },
  vipTitle: {
    fontSize: 20,
    textAlign: "right",
    marginTop: "2rem",
    marginRight: "1rem",
    "& > span": {
      color: "#507afd",
    },
  },
  vipDesc: {
    width: "90%",
    color: "#373c5c",
    textAlign: "center",
    margin: "2rem auto",
    "& > a": {
      color: "#5f679a",
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
  titlePoppins: {
    fontFamily: "Poppins",
  },
  progressbox: {
    margin: "0 1rem",
    position: "relative",
    "& > div > .MuiOutlinedInput-root": {
      "& > input": {
      },
    },
    "& > div": {
      width: "100%",
      "& label": {
        color: "#fff",
      },
      "& label.Mui-focused": {
        color: "#4e7afd",
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
      background: "#4e7afd",
      color: "white",
      "&:hover": {
        background: "#4e7afd",
      },
      "& .MuiButton-label": {
      },
    },
    "& > img": {
      position: "absolute",
      top: -10,
      zIndex: 1000,
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
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    background: "#050614",
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

const Field = withStyles({
  root: {
    width: "100%",
    marginBottom: 20,
    "& label": {
      color: "#5f6368",
      fontFamily: "Poppins",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".1em",
    },
    "& label.Mui-focused": {
      color: "#5f6368",
      fontFamily: "Poppins",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".1em",
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
})(TextField);

const Provably = ({ open, handleClose, game }) => {
  const classes = useStyles();

  return (
    <Dialog
      className={classes.modal}
      onClose={handleClose}
      style={{ fontFamily: "Poppins", }}
      open={open}
    >
      <div className={classes.titleBox} onClose={handleClose} >
        <span style={{flex: "auto", fontSize: "1rem", color: "#E0E4EB" }}>Provably Fair</span>
        <svg className={classes.buttonIcon} style={{cursor: "pointer"}} onClick={() => handleClose()} fill="currentColor" tabIndex="-1" viewBox="0 0 320 512"><path d="M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z"></path></svg>
      </div>
      <div className={classes.content} >
        <Field
          className={classes.field}
          label="ROUND ID"
          value={game._id}
          variant="outlined"
        />
        <Field
          className={classes.field}
          label="PRIVATE HASH"
          value={game.privateHash}
          variant="outlined"
        />
        <Field
          className={classes.field}
          label="PRIVATE SEED"
          value={game.privateSeed ? game.privateSeed : "Not Revealed"}
          variant="outlined"
        />
        <Field
          className={classes.field}
          label="PUBLIC SEED"
          value={game.publicSeed ? game.publicSeed : "Not Generated"}
          variant="outlined"
        />
        <Field
          className={classes.field}
          label="CRASH POINT"
          value={game.crashPoint}
          variant="outlined"
        />
      </div>
    </Dialog>
  );
};

export default Provably;
