import React, { useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { chatSocket } from "../../../services/websocket.service";
import TextField from "@material-ui/core/TextField";
import { motion } from "framer-motion";
import Dialog from "@material-ui/core/Dialog";

const Input = withStyles({
  root: {
    width: "100%",
    marginTop: "auto",
    background: "#101123",
    borderRadius: "0.25rem",
    overflow: "hidden",
    "& :before": {
      display: "none",
    },
    "& :after": {
      display: "none",
    },
    "& label": {
      color: "#323956",
      fontSize: 15,
    },
    "& div input": {
      color: "#e4e4e4",
      fontFamily: "Poppins",
      fontSize: "12px",
      fontWeight: 500,
      letterSpacing: ".1em",
      padding: "0.5rem 1rem",
    },
    "& div": {
      height: "3rem",
      borderRadius: 4,
      paddingRight: 0
    },
    "&:hover": {
    }
  }
})(TextField);

// Custom Styles
const useStyles = makeStyles(theme => ({
  modal: {
    minHeight: "35rem",
    width: "100%",
    "& .MuiDialog-paperWidthSm": {
      scrollbarWidth: "none",
      background: "#050614",
      borderRadius: "0.5em",
      color: "#fff",
      maxWidth: "80%", // Update this to fit better on smaller screens
      maxHeight: "90%", // Update this to fit better on smaller screens
      [theme.breakpoints.down("xs")]: {
        width: "90%", // Update width for extra small screens
        margin: "15px",
        marginTop: "80px",
        maxHeight: "80%",
      },
      [theme.breakpoints.down("sm")]: {
        width: "90%", // Update width for small screens
        margin: "15px",
        marginTop: "80px",
        maxHeight: "80%",
      },
      [theme.breakpoints.down("md")]: {
        width: "90%", // Update width for medium screens
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
  buttontest: {
    color: "#e4e4e4",
    fontFamily: "Poppins",
    fontSize: "13px",
    fontWeight: 300,
  },
  buttontesttt: {
    color: "#e4e4e4",
    fontFamily: "Poppins",
    fontSize: "13px",
    fontWeight: 300,
    marginLeft: "20px",
    marginTop: "10px",
    backgroundColor: "hsl(215, 75%, 50%) !important",
    textTransform: "none",
    [theme.breakpoints.up("sm")]: {
      marginLeft: "0px",
    },
  },
  avatar: {
    width: 35,
    height: 35,
    marginTop: "15.5px",
  },
  progressbox: {
    margin: "0 1rem",
    position: "relative",
    "& > div > .MuiOutlinedInput-root": {
      "& > input": {
      },
      "& > .MuiOutlinedInput-input": {
        color: "#fff"
      }
    },
    "& > div": {
      width: "100%",
      color: "#fff",
      "& label": {
        color: "#5f6368",
        fontFamily: "Poppins",
        fontSize: "14px",
        fontWeight: 300,
      },
      "& label.Mui-focused": {
        color: "#5f6368",
        fontFamily: "Poppins",
        fontSize: "14px",
        fontWeight: 300,
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
      background: "#1e72b6",
      color: "#e4e4e4",
      "&:hover": {
        background: "#1e72b6",
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
  titlePoppins: {
    fontFamily: "Poppins",
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
  textFeildButton: {
    borderRadius: "0.25rem",
    backgroundColor: "hsl(215, 75%, 50%)",
    padding: "0.25rem 0.5rem",
    textAlign: "center",
    color: "#fff",
    fontWeight: 500,
    fontSize: "12px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "2.5rem",
    margin: "0.25rem",
    width: "8rem",
    fontFamily: "Poppins"
  }
}));

const TipRainModal = ({ open, handleClose }) => {
  const classes = useStyles();

  const [amount, setAmount] = useState("");

  const onChange = e => {
    setAmount(e.target.value);
  };

  const onClick = () => {
    chatSocket.emit(
      "send-chat-message",
      `/tip-rain ${amount}`
    );
    setAmount("");
    handleClose();
  };

  return (
    <Dialog
      className={classes.modal}
      onClose={handleClose}
      style={{ fontFamily: "Poppins", }}
      open={open}
    >
      <div className={classes.titleBox} onClose={handleClose} >
        <span style={{flex: "auto", fontSize: "1.5rem", color: "#E0E4EB" }}>Tip Rain</span>
        <svg className={classes.buttonIcon} style={{cursor: "pointer"}} onClick={() => handleClose()} fill="currentColor" tabIndex="-1" viewBox="0 0 320 512"><path d="M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z"></path></svg>
      </div>
      <div className={classes.content} >
        <Input
          type="number"
          variant="filled"
          value={amount}
          onChange={onChange}
          InputProps={{
            endAdornment: (
              <motion.span whileTap={{ scale: 0.97 }} className={classes.textFeildButton} onClick={() => onClick()}>Tip Rain</motion.span>
            ),
          }}
        />
        <p>Your amount will be added to the current pot.</p>
      </div>
    </Dialog>
  );
};

export default TipRainModal;
