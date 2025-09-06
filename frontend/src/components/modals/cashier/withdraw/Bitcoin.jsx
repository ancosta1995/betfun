import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { useToasts } from "react-toast-notifications";
import { connect } from "react-redux";
import { withdrawCrypto } from "../../../../services/api.service";
import PropTypes from "prop-types";
import { changeWallet } from "../../../../actions/auth";

// MUI Components
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import error from "../../../../assets/sounds/error.mp3";
import Dialog from "@material-ui/core/Dialog";

import bitcoin from "../../../../assets/btcdepwith.svg";

const errorAudio = new Audio(error);

const playSound = audioFile => {
  audioFile.play();
};

const useStyles = makeStyles(theme => ({
  modal: {
    fontFamily: "Poppins",
    maxWidth: "100% !important",
    "& .MuiDialog-paperWidthSm": {
      scrollbarWidth: "none",
      maxWidth: "450px !important",
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
 
  value: {
    position: "relative",
    width: "100%",
    color: "#cfcfd0",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      color: "#cfcfd0",
    },
    "& > div": {
      width: "100%",
      color: "#cfcfd0",
      "& > div": {
        background: "#050614 !important",
        color: "#cfcfd0",
      },
      "& > div > input": {
        color: "#cfcfd0",
        width: "70%",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },
    },
    "& button": {
      color: "#e4e4e4",
      fontFamily: "Poppins",
      fontSize: "13px",
      fontWeight: 500,
      letterSpacing: ".1em",
      backgroundColor: "#2f3947 !important",
      position: "absolute",
      right: 0,
      top: "0.65rem",
      width: "6rem",
    },
  },
  Depvalue: {
    position: "relative",
    width: "75%",
    color: "#cfcfd0",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      color: "#cfcfd0",
    },
    "& > div": {
      width: "100%",
      "& > div": {
        background: "#050614 !important",
        color: "#cfcfd0",
      },
      "& > div > input": {
        width: "70%",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        color: "#cfcfd0",
      },
    },
    "& button": {
      color: "#e4e4e4",
      fontFamily: "Poppins",
      fontSize: "13px",
      fontWeight: 500,
      letterSpacing: ".1em",
      backgroundColor: "#1d76bd !important",
      position: "absolute",
      right: 0,
      top: "0.65rem",
      width: "6rem",
    },
  },
  withdraw: {
    color: "#e4e4e4",
    fontFamily: "Poppins",
    fontSize: "14px",
    fontWeight: 500,
    letterSpacing: ".1em",
    backgroundColor: "hsl(230, 50%, 50%) !important",
    width: "100%",
    marginTop: "1rem",
    height: "3rem",
  },
  qr: {
    position: "absolute",
    width: 140,
    marginRight: "1rem",
    right: 0,
    top: 0,
    background: "white",
    borderRadius: 5,
    padding: "0.5rem",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  qrcopy: {
    height: 140,
    width: 140,
    marginLeft: "2em",
    background: "white",
    borderRadius: 5,
    padding: "0.5rem",
  },
  flexbox: {
    display: "flex",
    alignItems: "center",
    "& img": {
      margin: "0 0 0 2em",
    },
  },
  cryptocolor: {
    color: "#f8931a",
  },
}));

const Bitcoin = ({ user, changeWallet, open, handleClose }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();
  const [withdrawing, setWithdrawing] = useState(false);
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  // TextField onChange event handler
  const addressOnChange = e => {
    setAddress(e.target.value);
  };

  // TextField onChange event handler
  const amountOnChange = e => {
    setAmount(e.target.value);
  };

  // Button onClick event handler
  const onClick = async () => {
    setWithdrawing(true);
    try {
      const response = await withdrawCrypto("BTC", address, parseFloat(amount));

      // Update state
      setWithdrawing(false);
      changeWallet({ amount: -Math.abs(response.siteValue) });

      // Check transaction status
      if (response.state === 1) {
        addToast(
          `Successfully withdrawn ${response.siteValue.toFixed(
            2
          )} credits for ${response.cryptoValue.toFixed(
            8
          )} Bitcoin! Your withdrawal should manual confirm within a few minutes!`,
          { appearance: "success" }
        );
      } else {
        addToast(
          `Successfully withdrawn ${response.siteValue.toFixed(
            2
          )} credits for Bitcoin! Your withdrawal should manual confirm within a few minutes!`,
          { appearance: "success" }
        );
      }
    } catch (error) {
      setWithdrawing(false);

      // If user generated error
      if (error.response && error.response.data && error.response.data.errors) {
        // Loop through each error
        for (
          let index = 0;
          index < error.response.data.errors.length;
          index++
        ) {
          const validationError = error.response.data.errors[index];
          addToast(validationError.msg, { appearance: "error" });
        }
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.error
      ) {
        addToast(error.response.data.error, { appearance: "error" });
        playSound(errorAudio);
      } else {
        console.log("There was an error while withdrawing crypto:", error);
        addToast(
          "There was an error while requesting this withdrawal. Please try again later!",
          { appearance: "error" }
        );
        playSound(errorAudio);
      }
    }
  };

  return (
    <Dialog
      className={classes.modal}
      onClose={handleClose}
      open={open}
    >
      <div className={classes.titleBox} onClose={handleClose} >
        <span style={{flex: "auto", fontSize: "1.5rem", color: "#E0E4EB", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <img src={bitcoin} style={{height: 30, width: 30}} />
          Bitcoin Withdraw
        </span>
        <svg className={classes.buttonIcon} style={{cursor: "pointer"}} onClick={() => handleClose()} fill="currentColor" tabIndex="-1" viewBox="0 0 320 512"><path d="M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z"></path></svg>
      </div>
      <div className={classes.content}>
        <TextField
          label="YOUR BITCOIN ADDRESS"
          variant="outlined"
          value={address}
          onChange={addressOnChange}
        />
        <TextField
          label="MIN. $5.00"
          variant="outlined"
          value={amount}
          onChange={amountOnChange}
        />
      </div>
    </Dialog>
  );
};

Bitcoin.propTypes = {
  user: PropTypes.object,
  changeWallet: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, { changeWallet })(Bitcoin);
