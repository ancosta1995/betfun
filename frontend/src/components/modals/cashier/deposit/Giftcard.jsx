import React, { useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core";
import { useToasts } from "react-toast-notifications";
import { connect } from "react-redux";
import { claimGiftcardCode } from "../../../../services/api.service";
import { changeWallet } from "../../../../actions/auth";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import coin from "../../../../assets/icons/coin.png";
import kinguin from  "../../../../assets/cashier/kinguin.png";
import { motion } from "framer-motion";

import k3 from  "../../../../assets/cashier/k3.png";
import k5 from  "../../../../assets/cashier/k5.png";
import k10 from  "../../../../assets/cashier/k10.png";
import k15 from  "../../../../assets/cashier/k15.png";
import k20 from  "../../../../assets/cashier/k20.png";
import k50 from  "../../../../assets/cashier/k50.png";
import k100 from  "../../../../assets/cashier/k100.png";


const Input = withStyles({
  root: {
    width: "100%",
    marginTop: "auto",
    background: "#0A0B1C",
    borderRadius: "5px",
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
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".1em",
      padding: "0rem 1rem",
    },
    "& div": {
      height: "2.5rem",
      borderRadius: 4,
    },
    "&:hover": {
    }
  }
})(TextField);

const useStyles = makeStyles(theme => ({
  modal: {
    fontFamily: "Poppins",
    width: "100%",
    maxWidth: "800px"
  },
  titleBox: {
    display: "flex",
    alignItems: "center",
    paddingTop: "1em",
    paddingLeft: "1.5em",
    paddingRight: "1em",
    fontFamily: "Poppins", 
    justifyContent: "center",
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
  conversionContainer: {
    backgroundColor: "#101123",
    border: "1px solid transparent",
    display: "flex",
    alignItems: "center",
    padding: "1rem",
    borderRadius: "0.25rem",
    flexDirection: "column"
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%"
  },
  coinHeader: {
    display: "flex",
    alignItems: "center",
    color: "#fff",
    fontSize: "1.25rem",
    gap: "0.5rem"
  },
  coinImage: {
    height: 30,
    width: 30
  },
  converterContainer: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    gap: "0.5rem",
  },
  finalContainer: {
    border: "1px solid transparent",
    display: "flex",
    alignItems: "center",
    borderRadius: "0.25rem",
    marginTop: "1rem",
    flexDirection: "column"
  },
  termsContainer: {
    display: "flex",
    flexDirection: "row",
    padding: "0.75rem 0",
    alignItems: "center"
  },
  termsCheckbox: {
    maxHeight: 25,
    maxWidth: 25,
    minHeight: 25,
    minWidth: 25,
    borderRadius: "5px",
    transition: "all .3s ease",
    display: "flex",
    padding: "0.5rem",
    alignItems: "center",
    justifyContent: "center"
  },
  terms: {
    fontSize: "12px",
    color: "rgb(208, 214, 225)",
    marginLeft: "0.5rem",
    textAlign: "left",
  },
  confirmButton: {
    backgroundColor: "hsl(215, 75%, 50%)",
    width: "100%",
    padding: "0.5rem 0.75rem",
    marginTop: 0,
    color: "#fff",
    fontSize: "17px",
    textAlign: "center",
    fontWeight: 500,
    borderRadius: "0.25rem",
    cursor: "pointer",
    transition: "all .3s ease",
    "&:hover": {

    }
  },
  inputIcon: {
    marginTop: "0 !important",
    color: "#fff",
    background: "transparent !important",
  },
  popupButton: {
    position: "absolute",
    top: 0,
    left: "50%",
    flex: "none",
    border: "none",
    cursor: "pointer",
    height: "2.25rem",
    display: "inline-flex",
    outline: "none",
    padding: "0 0.75rem",
    alignItems: "center",
    fontWeight: "bold",
    userSelect: "none",
    whiteSpace: "nowrap",
    willChange: "opacity",
    borderRadius: "0.25rem",
    justifyContent: "center",
    transitionDuration: "350ms",
    fontWeight: 500,
    color: "#9E9FBD",
    backgroundColor: "hsla(220, 100%, 82%, 0)",
    "&:hover": {
      backgroundColor: "#313A4D",
      filter: "brightness(130%)"
    }
  },
  buttonIcon: {
    marginRight: ".5em",
    fill: "#9E9FBD",
    flex: "none",
    display: "inline-block",
    outline: "none",
  },
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    margin: "0 3rem 0 0 "
  },
  giftcardsContainer: {
    backgroundColor: "#101123",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(30%, 1fr))", 
    gap: "0.5rem", 
    padding: "1rem",
    borderRadius: "0.25rem",
    overflowX: "auto", 
    alignItems: "center", 
    justifyContent: "center", 
  },
  kinguinImage: {
    maxWidth: "100%", 
    height: "auto", 
    borderRadius: "0.25rem",
    cursor: "pointer"
  }
  
  
  
}));

const Giftcard = ({ changeWallet, handleClose }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();
  const [redeeming, setRedeeming] = useState(false);
  const [GiftcardCode, setGiftcardCode] = useState("");

  // TextField onChange event handler
  const onChange = e => {
    setGiftcardCode(e.target.value);
  };

  // Button onClick event handler
  const onClick = async () => {
    setRedeeming(true);
    try {
      const response = await claimGiftcardCode(GiftcardCode);

      // Update state
      setRedeeming(false);
      addToast(response.message, { appearance: "success" });
      changeWallet({ amount: response.payout });
    } catch (error) {
      setRedeeming(false);

      if (error.response && error.response.data && error.response.data.errors) {
        for (let index = 0; index < error.response.data.errors.length; index++) {
          const validationError = error.response.data.errors[index];
          addToast(validationError.msg, { appearance: "error" });
        }
      } else if (error.response && error.response.data && error.response.data.error) {
        addToast(error.response.data.error, { appearance: "error" });
      } else {
        console.log("There was an error while claiming Giftcard:", error);
        addToast("There was an error while claiming this Giftcard code. Please try again later!", { appearance: "error" });
      }
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.popupButton} onClick={() => handleClose()}>
        <svg className={classes.buttonIcon} stroke="currentColor" fill="currentColor" strokeWidth="1" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"></path></svg>
        Back
      </div>
      <div className={classes.modal}>
        <div className={classes.titleBox} >
          <span style={{flex: "auto", fontSize: "1.5rem", justifyContent: "center", color: "#E0E4EB", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <img src={kinguin} style={{width: 40}}/>
            GiftCard Deposit
          </span>
        </div>
        <div className={classes.content}>
          <div className={classes.giftcardsContainer}>
            <a href="https://www.kinguin.net/category/222223/solanaspin-com-5-gift-card?referrer=betfun.gg">
              <img src={k5} className={classes.kinguinImage}/>
            </a>  
            <a href="https://www.kinguin.net/category/222233/solanaspin-com-10-gift-card?referrer=betfun.gg">
              <img src={k10} className={classes.kinguinImage}/>
            </a>  
            <a href="https://www.kinguin.net/category/222234/solanaspin-com-15-gift-card?referrer=betfun.gg">
              <img src={k15} className={classes.kinguinImage}/>
            </a>  
            <a href="https://www.kinguin.net/category/222235/solanaspin-com-20-gift-card?referrer=betfun.gg">
              <img src={k20} className={classes.kinguinImage}/>
            </a>  
            <a href="https://www.kinguin.net/category/222237/solanaspin-com-50-gift-card?referrer=betfun.gg">
              <img src={k50} className={classes.kinguinImage}/>
            </a>  
            <a href="https://www.kinguin.net/category/222240/solanaspin-com-100-gift-card?referrer=betfun.gg">
              <img src={k100} className={classes.kinguinImage}/>
            </a>  
          </div>
          <div className={classes.conversionContainer} style={{marginTop: "1rem"}}>
            <div className={classes.topBar}>
              <div className={classes.coinHeader}>
                Enter Code:
              </div>
            </div>
            <p style={{color: "rgb(208, 214, 225"}}>Enter the redemtion code in the box attached. Make sure to remove any and all spaces found at the start of end of the message.</p>
            <div className={classes.converterContainer}>
              <Input
                label=""
                variant="filled"
                value={GiftcardCode}
                onChange={(e) => setGiftcardCode(e.target.value)}
              />
            </div>
          </div>
          <div className={classes.finalContainer}>
            <motion.div
              whileTap={{ scale: 0.97 }}
              className={classes.confirmButton}
              style={{
                pointerEvents: redeeming ? "none" : "all",
                opacity: redeeming ? 0.5 : 1,
                cursor: redeeming ? "not-allowed" : "pointer"
              }}
              onClick={onClick}
            >
              {redeeming ? 'Verifying...' : 'Verify'}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

Giftcard.propTypes = {
  changeWallet: PropTypes.func.isRequired,
};

export default connect(() => ({}), { changeWallet })(Giftcard);