import React, { Fragment, useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useToasts } from "react-toast-notifications";
import {
  getUserAffiliatesData,
  redeemAffiliateCode,
} from "../../../services/api.service";
import { changeWallet } from "../../../actions/auth";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { motion } from "framer-motion";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";

import success from "../../../assets/success.wav";
import error from "../../../assets/sounds/error.mp3";

const errorAudio = new Audio(error);
const successAudio = new Audio(success);

const playSound = audioFile => {
  audioFile.play();
};

// Custom Styled Component
const ColorCircularProgress = withStyles({
  root: {
    color: "#fff !important",
  },
})(CircularProgress);

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
    "& .MuiDialog-paperWidthSm": {
      scrollbarWidth: "none",
      background: "#050614",
      borderRadius: "0.5em",
      maxWidth: "800px",
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
    padding: "1.5em",
    display: "block",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
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
    fontSize: 20,
    textAlign: "right",
    fontFamily: "Poppins",
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
    fontWeight: 300,
    letterSpacing: ".05em",
    textAlign: "left",
    "& > a": {
      color: "#e4e4e4",
      fontFamily: "Poppins",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".05em",
      textDecoration: "none",
    },
    "& b": {
      fontFamily: "Poppins",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".05em",
      color: "hsl(215, 75%, 50%)",
      textDecoration: "none",
    },
  },
  buttontest: {
    textTransform: "none",
    color: "#e4e4e4",
    backgroundColor: "#2871FF",
    fontFamily: "Poppins",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: ".1em",
  },
  titlePoppins: {
    fontFamily: "Poppins",
  },
  progressbox: {
    width: "100%",
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
        color: "#fff",
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
    "& > button": {
      position: "absolute",
      right: 10,
      top: 10,
      width: "7rem",
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
  loader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "15rem",
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

const Free = ({ open, handleClose, changeWallet, code: suppliedCode }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();

  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [affiliateData, setAffiliateData] = useState(null);
  const [code, setCode] = useState("");

  // TextField onChange event handler
  const onChange = e => {
    setCode(e.target.value);
  };

  // Button onClick event handler
  const onClick = async () => {
    setRedeeming(true);
    try {
      const affiliator = await redeemAffiliateCode(code);

      // Update state
      setAffiliateData(state => ({
        ...state,
        currentlySupporting: affiliator,
      }));
      setRedeeming(false);

      // If free money was claimed (first redeem)
      if (affiliator.freeMoneyClaimed) {
        addToast("You have successfully claimed your free 0.25 coins!", {
          appearance: "success",
        });
        changeWallet({ amount: 0.25 });
        playSound(successAudio);
      } else {
        addToast("Successfully updated your dynamic affiliator code!", {
          appearance: "success",
        });
        playSound(successAudio);
      }
    } catch (error) {
      setRedeeming(false);
      console.log(
        "There was an error while trying to redeem affiliate code:",
        error
      );

      // If this was validation error
      if (error.response && error.response.data && error.response.data.errors) {
        // Loop through errors
        error.response.data.errors.forEach(error =>
          addToast(error.msg, { appearance: "error" })
        );
        playSound(errorAudio);
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.error
      ) {
        // If this was user caused error
        addToast(error.response.data.error, { appearance: "error" });
        playSound(errorAudio);
      } else {
        addToast("Unknown error happened, please contact administrators!", {
          appearance: "error",
        });
        playSound(errorAudio);
      }
    }
  };

  // componentDidMount
  useEffect(() => {
    // Fetch current affiliate data from API
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getUserAffiliatesData();

        // If user has claimed affiliate code
        if (data.currentlySupporting) {
          // Make sure it's not set by affiliate link
          setCode(state =>
            state === "" ? data.currentlySupporting.code : state
          );
        }

        // Update state
        setAffiliateData(data);
        setLoading(false);
      } catch (error) {
        console.log(
          "There was an error while loading user affiliate data:",
          error
        );
        addToast(
          "There was an error while getting your affiliate data, please try again later!",
          { appearance: "error" }
        );
        playSound(errorAudio);
      }
    };

    // If modal is opened, fetch data
    if (open) {
      fetchData();
    } else {
      // When modal is closed, reset code
      setCode("");
    }
  }, [addToast, open]);

  // If affiliate code was supplied
  useEffect(() => {
    if (suppliedCode) {
      setCode(suppliedCode);
      addToast("Detected affiliate link! Redirected you to affiliates page!", {
        appearance: "success",
      });
      playSound(successAudio);
    }
  }, [addToast, suppliedCode]);

  return (
    <Dialog
      className={classes.modal}
      onClose={handleClose}
      open={open}
      style={{ fontFamily: "Poppins", }}
    >
      <div className={classes.titleBox} onClose={handleClose} >
        <span style={{flex: "auto", fontSize: "1.5rem", color: "#E0E4EB" }}>Claim Affiliate Code</span>
        <svg className={classes.buttonIcon} style={{cursor: "pointer"}} onClick={() => handleClose()} fill="currentColor" tabIndex="-1" viewBox="0 0 320 512"><path d="M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z"></path></svg>
      </div>
      <div className={classes.content} >
        {loading ? (
          <div className={classes.loader}>
            <ColorCircularProgress />
          </div>
        ) : (
          <>
            {affiliateData.currentlySupporting && (
              <h4 className={classes.vipDesc}>
                You are currently supporting{" "}
                <b>{affiliateData.currentlySupporting.username}</b>.
              </h4>
            )}
            <Input
              type="text"
              variant="filled"
              value={code}
              onChange={onChange}
              InputProps={{
                endAdornment: (
                  <motion.span whileTap={{ scale: 0.97 }} className={classes.textFeildButton} onClick={() => onClick()}>Claim Code</motion.span>
                ),
              }}
            />
            <p>Enter a code to support your affiliate and gain a free 0.25 in coins!</p>
          </>
        )}
      </div>
    </Dialog>
  );
};

Free.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  changeWallet: PropTypes.func.isRequired,
};

export default connect(() => ({}), { changeWallet })(Free);
