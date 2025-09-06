import React from "react";
import { makeStyles, withStyles } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";

const useStyles = makeStyles(theme => ({
  modal: {
    "& .MuiDialog-paperWidthSm": {
      scrollbarWidth: "none",
      width: "50%",
      background: "#050614",
      borderRadius: "0.5em",
      color: "#fff",
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
    padding: "1.5em 1.5em 1.5em 1.5em",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    scrollbarWidth: "none",
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
  statsContainer: {
    display: "flex",
    flexDirection: "row",
    gap: "1rem",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },

  },
  amount: {
    color: "#fff",
    fontSize: "18px",
    display: "flex",
    alignItems: "center",
    gap: "0.3rem"
  },
  description: {
    color: "#C0C1DE",
    fontSize: "11px"
  },
  container: {
    backgroundColor: "#101123",
    display: "flex",
    flexDirection: "column",
    alignItems: "left",
    width: "100%",
    borderRadius: "0.25rem",
    padding: "1rem",
    gap: "0.25rem"
  },
  linkBox: {
    backgroundColor: "#101123",
    display: "flex",
    padding: "1rem",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: "0.25rem",
    color: "rgb(208, 214, 225)",
    fontSize: "13px",
  },
}));


const Provably = ({ open, handleClose, blockHash, serverSeed, serverSeedHash, blockNumber }) => {
  const classes = useStyles();

  return (
    <Dialog
      className={classes.modal}
      onClose={handleClose}
      open={open}
    >
      <div className={classes.titleBox} onClose={handleClose} >
        <span style={{flex: "auto", fontSize: "1.5rem", color: "#E0E4EB" }}>Provably Fair</span>
        <svg className={classes.buttonIcon} style={{cursor: "pointer"}} onClick={() => handleClose()} fill="currentColor" tabIndex="-1" viewBox="0 0 320 512"><path d="M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z"></path></svg>
      </div>
      <div className={classes.content}>
          <div style={{display: "flex", flexDirection: "column", gap: "0.2rem"}}>
            <span>Server Seed Hashed</span>
            <div className={classes.linkBox}>
              {serverSeedHash}
            </div>
          </div>
          
          <div style={{display: "flex", flexDirection: "column", gap: "0.2rem"}}>
            <span>Server Seed</span>
            <div className={classes.linkBox}>
              {serverSeed}
            </div>
          </div>
          
          <div style={{display: "flex", flexDirection: "column", gap: "0.2rem"}}>
            <span>EOS Block</span>
            <div className={classes.linkBox}>
              {blockNumber}
            </div>
          </div>
          
          <div style={{display: "flex", flexDirection: "column", gap: "0.2rem"}}>
            <span>EOS Block Hash</span>
            <div className={classes.linkBox}>
              {blockHash}
            </div>
          </div>
        </div> 
    </Dialog>
  );
};

export default Provably;