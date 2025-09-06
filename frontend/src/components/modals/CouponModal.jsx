import React, { useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core";
import { useToasts } from "react-toast-notifications";
import { connect } from "react-redux";
import { claimCouponCode } from "../../services/api.service";
import { changeWallet } from "../../actions/auth";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";

import success from "../../assets/success.wav";
import error from "../../assets/error.wav";

const errorAudio = new Audio(error);
const successAudio = new Audio(success);

const playSound = audioFile => {
  audioFile.play();
};

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

const useStyles = makeStyles(theme => ({
  modal: {
    "& .MuiDialog-paperWidthSm": {
      scrollbarWidth: "none",
      width: "28%",
      background: "#050614",
      borderRadius: "0.5rem",
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
    width: "100%",
    color: "#e4e4e4",
    fontFamily: "Poppins",
    fontSize: "14px",
    fontWeight: 500,
    letterSpacing: ".05em",
    "& > a": {
      color: "hsl(215, 75%, 50%)",
      fontFamily: "Poppins",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".05em",
      textDecoration: "none",
    },
  },
  buttontest: {
    textTransform: "none",
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
        color: "#fff"
      },
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
      background: "hsl(215, 75%, 50%)",
      color: "#ffffff",
      "&:hover": {
        background: "hsl(215, 75%, 50%)",
      },
      "& .MuiButton-label": {
        textTransform: "none",
      },
    },
    "& > img": {
      position: "absolute",
      top: -10,
      zIndex: 1000,
    },
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

const Coupon = ({ open, handleClose, changeWallet }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();
  const [redeeming, setRedeeming] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  // TextField onChange event handler
  const onChange = e => {
    setCouponCode(e.target.value);
  };

  // Button onClick event handler
  const onClick = async () => {
    setRedeeming(true);
    try {
      const response = await claimCouponCode(couponCode);

      // Update state
      setRedeeming(false);
      addToast(response.message, { appearance: "success" });
      changeWallet({ amount: response.payout });
      playSound(successAudio);
    } catch (error) {
      setRedeeming(false);

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
          playSound(errorAudio);
        }
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.error
      ) {
        addToast(error.response.data.error, { appearance: "error" });
        playSound(errorAudio);
      } else {
        console.log("There was an error while claiming coupon:", error);
        addToast(
          "There was an error while claiming this coupon code. Please try again later!",
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
      style={{ fontFamily: "Poppins", }}
      open={open}
    >
      <div className={classes.titleBox} onClose={handleClose} >
        <span style={{flex: "auto", fontSize: "1.5rem", color: "#E0E4EB" }}>Coupon Code</span>
        <svg className={classes.buttonIcon} style={{cursor: "pointer"}} onClick={() => handleClose()} fill="currentColor" tabIndex="-1" viewBox="0 0 320 512"><path d="M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z"></path></svg>
      </div>
      <div className={classes.content}>
        <Input
          type="text"
          variant="filled"
          value={couponCode}
          onChange={onChange}
          InputProps={{
            endAdornment: (
              <motion.span whileTap={{ scale: 0.97 }} className={classes.textFeildButton} onClick={() => onClick()}>Redeem</motion.span>
            ),
          }}
        />
        <p className={classes.vipDesc}>You can find coupons by being active on our social media. You can find us on <a target="_blank" rel="noreferrer" href="https://twitter.com/solanaspincom">Twitter</a> or on <a href="https://t.me/solanaspin" target="_blank" rel="noreferrer">Discord</a>.</p>
      </div>
    </Dialog>
  );
};

Coupon.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  changeWallet: PropTypes.func.isRequired,
};

export default connect(() => ({}), { changeWallet })(Coupon);
