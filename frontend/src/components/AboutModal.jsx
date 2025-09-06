import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";

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
      width: "100%",
      maxWidth: "800px",
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
    "& img": {
      width: "5rem",
      marginBottom: "1rem",
    },
    "& h1": {
      margin: "0 0 2rem 0",
      color: "#b9b9b9",
      fontFamily: "Poppins",
      fontSize: "19px",
      fontWeight: 500,
    },
    "& b": {
      color: "#9d9d9d",
      fontFamily: "Poppins",
      fontSize: "16px",
      fontWeight: 500,
      letterSpacing: ".005em",
    },
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
  ol: {
    marginBlockEnd: 0,
    marginBlockStart: "1em",
    paddingInlineStart: "2em",
    color: "hsl(220, 22%, 90%)"
  }
}));

const About = ({ open, handleClose }) => {
  const classes = useStyles();

  return (
    <Dialog
      className={classes.modal}
      onClose={handleClose}
      style={{ fontFamily: "Poppins", }}
      open={open}
    >
      <div className={classes.titleBox} onClose={handleClose} >
        <span style={{flex: "auto", fontSize: "1.5rem", color: "#E0E4EB" }}>About</span>
        <svg className={classes.buttonIcon} style={{cursor: "pointer"}} onClick={() => handleClose()} fill="currentColor" tabIndex="-1" viewBox="0 0 320 512"><path d="M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z"></path></svg>
      </div>
      <div className={classes.content} >
        <p> betfun.gg is an innovative Social Arcade tailored to the real items case opening experience. </p>
        <p> It's our mission for consumer satisfaction, and we are tired of the bullshit of the current industry. </p>
        <p> On betfun.gg you will find provably fair gamemodes, seamless crypto withdraws, rewards for all levels of player, and an amazing GUI. </p>
        <p> We are tired of the predatory features and practices in this scene, we are fullsending our way into a cleaner and more transparent space. </p>
        <p> Join our mission, Join betfun.gg </p>
      </div> 
    </Dialog>
  );
};

export default About;
