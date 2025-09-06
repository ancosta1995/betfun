import React, { useState, useEffect, Fragment } from "react";
import { Tab, makeStyles } from "@material-ui/core";
import { useToasts } from "react-toast-notifications";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  getUserAffiliatesData,
  updateUserAffiliateCode,
  claimUserAffiliateEarnings,
} from "../../../services/api.service";
import parseCommasToThousands from "../../../utils/parseCommasToThousands";
import Dialog from "@material-ui/core/Dialog";
import { changeWallet } from "../../../actions/auth";
import { motion } from "framer-motion";

import Background1 from "../../../assets/home/Background1.png";
import Background3 from "../../../assets/home/Background3.png";
import coin from "../../../assets/icons/coin.png";
import success from "../../../assets/success.wav";
import error from "../../../assets/sounds/error.mp3";

const errorAudio = new Audio(error);
const successAudio = new Audio(success);

const playSound = audioFile => {
  audioFile.play();
};

// Custom Styles
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
    backgroundColor: "#050614",
    marginTop: "0.5rem",
    display: "flex",
    padding: "0.5rem 0.5rem 0.5rem 1rem",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: "0.25rem",
    color: "rgb(208, 214, 225)",
    fontSize: "13px",
  },
  copyButton: {
    padding: "0.5rem 0.75rem",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    display: "flex",
    backgroundImage: `url(${Background1})`,
    color: "#fff",
    backgroundSize: "cover", 
    backgroundPosition: "right",
    borderRadius: "0.25rem",
    cursor: "pointer",
    userSelect: "none"
  },
  claimButton: {
    padding: "0.5rem 0.75rem",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    display: "flex",
    backgroundImage: `url(${Background3})`,
    color: "#fff",
    backgroundSize: "cover", 
    backgroundPosition: "right",
    borderRadius: "0.25rem",
    cursor: "pointer",
    userSelect: "none"
  }
}));

const Affiliates = ({ isLoading, user, isAuthenticated, open, handleClose, }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [affiliatesData, setAffiliatesData] = useState(null);
  const [affiliateCode, setAffiliateCode] = useState("Loading...");

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getUserAffiliatesData();

      // Update state
      setAffiliatesData(data);
      setAffiliateCode(data.affiliateCode);
      setLoading(false);
    } catch (error) {
      console.log(
        "There was an error while loading user affiliates data:",
        error
      );
    }
  };

  const saveAffiliateCode = async () => {
    setSaving(true);
    try {
      const response = await updateUserAffiliateCode(affiliateCode);

      // Update state
      setSaving(false);
      setAffiliateCode(response.newAffiliateCode);
      setAffiliatesData(state =>
        state ? { ...state, affiliateCode: response.newAffiliateCode } : null
      );
      addToast("Successfully updated your affiliate code!", {
        appearance: "success",
      });
      playSound(successAudio);
    } catch (error) {
      setSaving(false);

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
        console.log(
          "There was an error while updating user affiliate code:",
          error
        );
        addToast(
          "There was an error while updating your affiliate code. Please try again later!",
          { appearance: "error" }
        );
        playSound(errorAudio);
      }
    }
  };

  const claimEarnings = async () => {
    setClaiming(true);
    try {
      const response = await claimUserAffiliateEarnings();

      // Update state
      setClaiming(false);
      setAffiliatesData(state =>
        state ? { ...state, affiliateMoneyAvailable: 0 } : null
      );
      addToast(`Successfully claimed ${response.claimedAmount} credits!`, {
        appearance: "success",
      });
      playSound(successAudio);

      // Update redux state
      changeWallet({ amount: response.claimedAmount });
    } catch (error) {
      setClaiming(false);

      // Check if user caused this error
      if (error.response && error.response.data && error.response.data.error) {
        addToast(error.response.data.error, { appearance: "error" });
        playSound(errorAudio);
      } else {
        console.log(
          "There was an error while claiming user affiliate earnings:",
          error
        );
        addToast(
          "There was an error while claiming your affiliate earnings. Please try again later!",
          { appearance: "error" }
        );
        playSound(errorAudio);
      }
    }
  };

  const onChange = (e, newValue) => {
    setAffiliateCode(e.target.value);
  };

  const copyLink = () => {
    const link = affiliatesData?.affiliateLink;
    navigator.clipboard.writeText(link)
      .then(() => {
        addToast("Successfully copied affiliate link.", { appearance: "success" });
      })
      .catch((error) => {
        addToast("Failed to copy affiliate link", { appearance: "error" });
        console.error("Error copying text to clipboard:", error);
      });
  };

  useEffect(() => {
    if (!isLoading && isAuthenticated && open) fetchData();
  }, [isLoading, isAuthenticated, open]);

  return (
      <Dialog
        className={classes.modal}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >    
        <div className={classes.titleBox} onClose={handleClose} >
          <span style={{flex: "auto", fontSize: "1.5rem", color: "#E0E4EB" }}>Affiliates</span>
          <svg className={classes.buttonIcon} style={{cursor: "pointer"}} onClick={() => handleClose()} fill="currentColor" tabIndex="-1" viewBox="0 0 320 512"><path d="M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z"></path></svg>
        </div>
        <div className={classes.content}>
          {
            !user || !isAuthenticated ? (
              <div style={{display: "flex", color: "#9E9FBD", gap: "0.2rem"}}>
                Please{" "}<a style={{color: "inherit", textTransform: "none"}}>log in</a>{" "}to view your affiliates.
              </div>
            ) : (
              <>
                <div className={classes.statsContainer}>
                  <div className={classes.container}>
                    <div className={classes.amount}>
                      <img style={{height: 17, width: 17}} src={coin} />
                      {loading ? "Loading..." : parseCommasToThousands((affiliatesData?.totalDeposited ?? 0).toFixed(2))}

                    </div>
                    <div className={classes.description}>Total deposits</div>
                  </div>
                  <div className={classes.container}>
                    <div className={classes.amount}>
                      <img style={{height: 17, width: 17}} src={coin} />
                      {loading ? "Loading..." : parseCommasToThousands((affiliatesData?.totalWagered ?? 0).toFixed(2))}
                      </div>
                    <div className={classes.description}>Total wagered</div>
                  </div>
                  <div className={classes.container}>
                    <div className={classes.amount}>
                      {loading ? "Loading..." : parseCommasToThousands(affiliatesData.usersAffiliated)}
                    </div>
                    <div className={classes.description}>Current users</div>
                  </div>
                </div>
                <div className={classes.container} style={{background:"linear-gradient(to right, rgba(32, 112, 223, 0.1) 0%, rgba(253, 27, 98, 0) 100%) #101123"}}>
                  <div style={{color: "hsl(215, 75%, 50%)", fontSize: "18px", fontWeight: 500}}>Share your referral link</div>
                  <div className={classes.description}>Users will automatically be prompted to claim your code when they click this link.</div>
                  <div className={classes.linkBox}>
                  <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: "14px", fontWeight: 400 }}>
                  {loading ? "Loading..." : affiliatesData.affiliateLink}
</div>
                    <motion.div whileTap={{ scale: 0.97 }} className={classes.copyButton} onClick={() => copyLink()}>Copy</motion.div>
                  </div>
                </div>

                <div className={classes.container} style={{background:"linear-gradient(to right, rgba(227, 200, 94, 0.1) 0%, rgba(253, 27, 98, 0) 100%) #101123"}}>
                  <div style={{color: "#E3C85E", fontSize: "18px", fontWeight: 500}}>Affiliate earnings</div>
                  <div className={classes.description}>Cash out your affiliate earnings! Minimum cash out is 1.00 coins.</div>
                  <div className={classes.linkBox}>
                    <div style={{display: "flex", alignItems: "center", gap: "0.3rem"}}>
                      <img style={{height: 17, width: 17}} src={coin} />
                      <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: "14px", fontWeight: 500 }}>
  {loading ? "Loading..." : parseCommasToThousands(affiliatesData.affiliateMoneyAvailable.toFixed(2))}
</div>
                    </div>
                    <motion.div whileTap={{ scale: 0.97 }} className={classes.claimButton} onClick={() => claimEarnings()}>Claim</motion.div>
                  </div>
                </div>

                <div className={classes.container} style={{flexDirection: "row", justifyContent: "space-between"}}>
                  <div className={classes.description}>Total earned from referrals</div>
                  <div style={{display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "11px"}}>
                    <img style={{height: 13, width: 13}} src={coin} />
                    {loading ? "Loading..." : parseCommasToThousands(affiliatesData.affiliateMoney.toFixed(2))}
                  </div>
                </div>
                
              </>
            )
          }
        </div> 
      </Dialog>
  );
};

Affiliates.propTypes = {
  isAuthenticated: PropTypes.bool,
  isLoading: PropTypes.bool,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading,
  user: state.auth.user,
});

export default connect(mapStateToProps, { changeWallet })(Affiliates);