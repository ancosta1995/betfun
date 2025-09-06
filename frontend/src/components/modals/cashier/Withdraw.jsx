import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core";
import { withdrawCrypto } from "../../../services/api.service";
import { changeWallet } from "../../../actions/auth";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import cutDecimalPoints from "../../../utils/cutDecimalPoints";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

// MUI Components
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import solimg from "../../../assets/cashier/solanalogo.png";

// Components
import Bitcoin from "./withdraw/Bitcoin";
import Ethereum from "./withdraw/Ethereum";
import Litecoin from "./withdraw/Litecoin";

// Assets
import bitcoin from "../../../assets/cashier/bitcoin.png";
import ethereum from "../../../assets/cashier/ether.png";
import litecoin from "../../../assets/cashier/litecoin.png";
import cashapp from "../../../assets/cashier/cashapp.png";
import coin from "../../../assets/icons/coin.png";
import error from "../../../assets/sounds/error.mp3";

const errorAudio = new Audio(error);

const playSound = audioFile => {
  audioFile.play();
};

const Input = withStyles({
  root: {
    width: "100%",
    marginTop: "auto",
    border: "1px solid transparent",
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
      padding: "0rem 0rem",
    },
    "& div": {
      height: "2.5rem",
      borderRadius: 4,
    },
    "&:hover": {
    }
  }
})(TextField);

const AddressInput = withStyles({
  root: {
    width: "100%",
    marginTop: "auto",
    border: "1px solid transparent",
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

// Custom Styles
const useStyles = makeStyles(theme => ({
  modal: {
    fontFamily: "Poppins",
    maxWidth: "100% !important",
    "& .MuiDialog-paperWidthSm": {
      scrollbarWidth: "none",
      maxWidth: "800px !important",
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
  sectionContainer: {
    gap: "0.5rem",
    gridTemplateColumns: "repeat(1,minmax(0,1fr))",
    width: "100%",
    display: "grid",
  },
  coin: {
    position: "absolute",
    top: 0,
    left: 0
  },
  grid: {
    gridTemplateColumns: "repeat(4,minmax(0,1fr))",
    gap: "0.5rem",
    width: "100%",
    display: "grid",
    outline: 0,
  },
  choiceBox: {
    cursor: "pointer",
    borderRadius: "0.25rem",
    height: "88px",
    width: "100%",
    backgroundColor: "#101123",
    padding: "1rem 0.75rem",
    display: "flex",
    alignItems: "center",
    border: "1px solid transparent",
    textAlign: "center",
    transitionDuration: "300ms",
    "&:hover": {
      filter: "brightness(130%)"
    },
    [theme.breakpoints.down("xs")]: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
  },
  optionImage: {
    maxHeight: "100%",
  },
  optionText: {
    color: "#fff",
    fontSize: "15px",
    marginLeft: "10px",
    [theme.breakpoints.down("xs")]: {
      display: "none"
    },
  },
  conversionContainer: {
    backgroundColor: "#101123",
    border: "1px solid transparent",
    display: "flex",
    alignItems: "center",
    padding: "1rem",
    borderRadius: "0.25rem",
    marginTop: "1rem",
    flexDirection: "column"
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
    width: "100%"
  },
  cashapp: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
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
  inputIcon: {
    marginTop: "0 !important",
    color: "#fff",
    background: "transparent !important",
  },
  addressContainer: {
    backgroundColor: "#101123",
    border: "1px solid transparent",
    display: "flex",
    alignItems: "center",
    padding: "1rem",
    borderRadius: "0.25rem",
    marginTop: "1rem",
    flexDirection: "column"
  },
  networkBox: {
    color: "#6CDE07",
    border: "1px solid #6CDE07",
    padding: "0.25rem",
    borderRadius: "0.25rem"
  },
  finalContainer: {
    backgroundColor: "#101123",
    border: "1px solid transparent",
    display: "flex",
    alignItems: "center",
    padding: "1rem",
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
  choiceBox: {
    userSelect: "none",
    cursor: "pointer",
    borderRadius: "0.5rem",
    height: "120px",
    width: "100%",
    backgroundColor: "#101123",
    padding: "0.5rem",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    gap: "0.75rem",
    textAlign: "center",
    transitionDuration: "300ms",
    position: "relative",
    zIndex: 1,
    "&:hover" : {
      "& > div": {
        opacity: 1
      },
    },
    [theme.breakpoints.down("xs")]: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
  },
  imageContainer: {
    backgroundColor: "#0A0B1C",
    borderRadius: "0.5rem",
    padding: "1rem",
    width: "100%",
    overflow: "visible",
    display: "flex",
    position: "relative",
    alignItems: "center",
    zIndex: 3,
    justifyContent: "center"
  },
  optionImage: {
    maxHeight: "100%",
    zIndex: 4
  },
  box: {
    userSelect: "none",
    cursor: "pointer",
    borderRadius: "0.5rem",
    height: "100px",
    width: "100%",
    backgroundColor: "#101123",
    padding: "0.5rem",
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    gap: "0.5rem",
    textAlign: "center",
    transitionDuration: "300ms",
    "&:hover": {
      filter: "brightness(125%)"
    },
    [theme.breakpoints.down("xs")]: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
  },
  image: {
    maxHeight: "100%",
    backgroundColor: "#0A0B1C",
    width: "70px",
    padding: "0.5rem",
    borderRadius: "0.5rem",
  },
  optionText: {
    color: "#fff",
    fontSize: "12px",
    zIndex: 3,
    [theme.breakpoints.down("xs")]: {
      display: "none"
    },
  },
  gradientSolana: {
    position: "absolute",
    borderRadius: "0.5rem",
    background: "radial-gradient(1247.5% 175% at 0% 0%, #3b08dc 0%, #BABABA 100%)",
    transition: "0.5s all",
    zIndex: 2,
    opacity: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  gradientBitcoin: {
    position: "absolute",
    borderRadius: "0.5rem",
    background: "radial-gradient(1247.5% 175% at 0% 0%, #101123 0%, #f4941c 100%)",
    transition: "0.5s all",
    zIndex: 2,
    opacity: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  gradientEthereum: {
    position: "absolute",
    borderRadius: "0.5rem",
    background: "radial-gradient(1247.5% 175% at 0% 0%, #101123 0%, #647cec 100%)",
    transition: "0.5s all",
    zIndex: 2,
    opacity: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  gradientLitecoin: {
    position: "absolute",
    borderRadius: "0.5rem",
    background: "radial-gradient(1247.5% 175% at 0% 0%, #101123 0%, #3389B9 100%)",
    transition: "0.5s all",
    zIndex: 2,
    opacity: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  gradientCASHAPP: {
    position: "absolute",
    borderRadius: "0.5rem",
    background: "radial-gradient(1247.5% 175% at 0% 0%, #101123 0%, #04d32c 100%)",
    transition: "0.5s all",
    zIndex: 2,
    opacity: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
}));

const Withdraw = ({ user, changeWallet }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();

  const [coinData, setCoinData] = useState({
    name: "Litecoin",
    slug: "LTC",
    network: "LTC",
    image: litecoin
  });
  const [coinPrice, setCoinPrice] = useState(39982.32)
  const [amount, setAmount] = useState(0);
  const [usd, setUsd] = useState(0);
  const [address, setAddress] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  const updateAmount = (val) => {
    const regex = /^[0-9]*$/;

    if (regex.test(val)) {
      setAmount(val);
      setUsd(cutDecimalPoints(val/2));
    }
   
  };

  const updateUsd = (val) => {
    const regex = /^[0-9]*$/;

    if (regex.test(val)) {
      setUsd(val);
      setAmount(cutDecimalPoints(val*2));
    }
    
  };
  
  const changeCoin = (coin) => {
    if(coin == "BTC") {
      setCoinData({
        name: "Bitcoin",
        slug: "BTC",
        network: "BTC",
        image: bitcoin
      });
    } else if(coin == "ETH") {
      setCoinData({
        name: "Ethereum",
        slug: "ETH",
        network: "ERC-20",
        image: ethereum
      });
    } else if(coin == "SOL") {
      setCoinData({
        name: "Solana",
        slug: "SOL",
        network: "Solana",
        image: solimg
      });
    }
     else if(coin == "LTC") {
      setCoinData({
        name: "Litecoin",
        slug: "LTC",
        network: "LTC",
        image: litecoin
      });
    } else if(coin == "CASHAPP") {
      setCoinData({
        name: "CashApp",
        slug: "CASH",
        network: "Cash",
        image: cashapp
      });
    }
  };

  const onClick = async () => {
    setWithdrawing(true);
    try {
      const response = await withdrawCrypto(coinData.slug, address, parseFloat(amount));

      // Update state
      changeWallet({ amount: -Math.abs(response.siteValue) });

      // Check transaction status
      if (response.state === 1) {
        addToast(
          `Successfully withdrawed ${response.siteValue.toFixed(
            2
          )} credits for ${response.usdValue.toFixed(
            8
          )} ${coinData.name}! Your withdrawal should manual confirm within a few minutes!`,
          { appearance: "success" }
        );
      } else {
        addToast(
          `Successfully withdrawed ${response.siteValue.toFixed(
            2
          )} credits for ${coinData.name}! Your withdrawal should manual confirm within a few minutes!`,
          { appearance: "success" }
        );
      }
      setWithdrawing(false);
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
    <div style={{maxWidth: "600px", margin: "0 auto"}}>
      <div className={classes.sectionContainer}>
        <h3 style={{color:"#fff", fontWeight: 500, margin: 0, padding: 0}}>Select a method</h3>
        <div className={classes.grid}>
          {/*<div className={classes.choiceBox} onClick={() => changeCoin("BTC")}>
            <div style={{opacity: coinData.slug == "BTC" ? 1 : 0}} className={classes.gradientBitcoin} />
            <div className={classes.imageContainer}>
              <img className={classes.optionImage} src={bitcoin} />
            </div>
            <span className={classes.optionText}>Bitcoin</span>
          </div>
          <div className={classes.choiceBox} onClick={() => changeCoin("ETH")}>
            <div style={{opacity: coinData.slug == "ETH" ? 1 : 0}} className={classes.gradientEthereum} />
            <div className={classes.imageContainer}>
              <img className={classes.optionImage} src={ethereum} />
            </div>
            <span className={classes.optionText}>Ethereum</span>
          </div>*/}
                    <div className={classes.choiceBox} onClick={() => changeCoin("SOL")}>
            <div style={{opacity: coinData.slug == "SOL" ? 1 : 0}} className={classes.gradientSolana} />
            <div className={classes.imageContainer}>
              <img className={classes.optionImage} src={"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAABOvAAATrwFj5o7DAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAA4FJREFUWIXFl01oXVUUhb91Xn4QRJuMSlVIjbR04EDaitY6atIkENsE/BkLbdJ0ULVG0IEOVFCwoVChIUkdOrH400JpTBoVAi3FqAO1FCU1iqEzk1iFJn33LAcvSZP47nv3kUL37Jyz2N+69+2z375wl0OViI01tIcdMfC0iA8L6gv7/GXCtRAZPzjGhJDvqIGhvd6cxNgrqQPYVEY+bfuMq8IHPcOaWpeBUy2uz8f4llAPUJPF7IqYxz6Z1IZ3Dp/TTMUGTrZ6ay7xWWBLheC1hElJ+7u+1M/FjkOxzYFm783l/e264QCm0dEXB5vcVNzfmhhq8rYoXwLuXzd8tZEbMWhXz4h+SjVwqsX1SfQEsPmOwm/TJpNq7VxZE1UrzxcLrhT8IjBdAfJeoG15ZRpz8/FN4OhtT4vR3+qGkPgqUFs0lfm6rk6tz5/WQhbyJ885NzvnT232rzlaSKxthy/oGqwoQuXja6lw+HG+Wh1Z4QAzc/HDInCAmpziK0uLAIUOJ2lfSq7rWO1HzuvvrPDBJvdi9aQr1GksWPwJ+lv8eIi+XExq/J4IP2SFIxqw3yflit/Oq52HRjVRBaDI7vR8egMyt/bM0gBPAQUDODailKYovdQ9ohNZ+f2tbgjRlzAbS/uMjywaAQU2pCt9fLDZnVkN9AxrKqB24N8y0g3LBhxLvrhg/PFQk5/IauLgiL7DegFIymmXCmWujO6eGPx5f6sbsprovqBzSEdLSGZhqRMqTJatHrMxJP5toDlm9QAukdNhctlAiIy75KUBICK9jpnKzCc+VrhF/48QGIfFPmCswWb/ATyYnk693aPqywr/qNmb8vhySs7prlE9JFR47sIM5zPpbPdXAj/R5vvyeDgFjuTPlubG5Rcfc+EYMF9Ef/76QjiSFT6w3dW1eZ8GHk2R3Az5sPwwq7rPwN7kONbLaw0A/2Q1ADwA7Eo/dl/3aK53abVqHkiqw9u5W34G07hiu407F7/W3ArvrtxYVfuFSUXtlO8LlYe5oaDOF7/RbKoBgO4RXZX1LJD57zdDzFnqLDYZp47lg3u8xfJZxNZ1ocWkE+07NKYrxY5T20/XmH5JavUk9nGK345ycRPcV7OgHWnwgr8MUZgX46ugDko2KwD+BH+RS8KxA1/p93K5K/44HWhmu8xuFBtt6gAkZnCYDIHxAyN8X8nH6V2P/wA8OVXfgv+0tgAAAABJRU5ErkJggg=="} />
            </div>
            <span className={classes.optionText}>Solana</span>
          </div>

          <div className={classes.choiceBox} onClick={() => changeCoin("LTC")}>
            <div style={{opacity: coinData.slug == "LTC" ? 1 : 0}} className={classes.gradientLitecoin} />
            <div className={classes.imageContainer}>
              <img className={classes.optionImage} src={litecoin} />
            </div>
            <span className={classes.optionText}>Litecoin</span>
          </div>
          <div className={classes.choiceBox} onClick={() => changeCoin("ETH")}>
            <div style={{opacity: coinData.slug == "ETH" ? 1 : 0}} className={classes.gradientEthereum} />
            <div className={classes.imageContainer}>
              <img className={classes.optionImage} src={ethereum} />
            </div>
            <span className={classes.optionText}>Ethereum</span>
          </div>

          <div className={classes.choiceBox} onClick={() => changeCoin("CASHAPP")}>
            <div style={{opacity: coinData.slug == "CASH" ? 1 : 0}} className={classes.gradientCASHAPP}/>
            <div className={classes.imageContainer}>
              <img className={classes.optionImage} src={cashapp} />
            </div>
            <span className={classes.optionText}>Cashapp</span>
          </div>
        </div>
      </div>

      <div className={classes.conversionContainer}>
        <div className={classes.topBar}>
          <div className={classes.coinHeader}>
            <img className={classes.coinImage} src={coinData.image} />
            {coinData.name} ({coinData.slug})
          </div>
          {/*<div style={{color: "rgb(208, 214, 225"}}>1 {coinData.slug} = ${coinPrice}</div>*/}
        </div>
        <p style={{color: "rgb(208, 214, 225"}}>Enter how many coins you would like to withdraw. {coinData.slug == "CASH" ? "A 3% fee is placed on the withdrawal to prevent users from abusing this as an exchanging service (fee is taken out of amount withdrawn)." : "The network fees will be added on top and vary based on the blockchain conditions."}</p>
        <div className={classes.converterContainer}>
          <Input
            label=""
            variant="filled"
            value={amount}
            onChange={(e) => updateAmount(e.target.value)}
            InputProps={{
              endAdornment: (<></>),
              startAdornment: (
                <InputAdornment
                  className={classes.inputIcon}
                  position="start"
                >
                  <img style={{height: 17, width: 17}} src={coin} />
                </InputAdornment>
              ),
            }}
          />
          <div style={{color: "rgb(208, 214, 225"}}>=</div>
          <Input
            label=""
            variant="filled"
            value={usd}
            onChange={(e) => updateUsd(e.target.value)}
            InputProps={{
              endAdornment: (<></>),
              startAdornment: (
                <InputAdornment
                  className={classes.inputIcon}
                  position="start"
                >
                 <svg height="17" width="17" fill="none" viewBox="0 0 96 96" class="svg-icon"><path d="M48 96c26.51 0 48-21.49 48-48S74.51 0 48 0 0 21.49 0 48s21.49 48 48 48Z" fill="#6CDE07"></path><path d="M51.52 73.32v6.56h-5.8V73.4c-7.56-.6-13.08-3.56-16.92-7.64l4.72-6.56c2.84 3 6.96 5.68 12.2 6.48V51.64c-7.48-1.88-15.4-4.64-15.4-14.12 0-7.4 6.04-13.32 15.4-14.12v-6.68h5.8v6.84c5.96.6 10.84 2.92 14.6 6.56l-4.88 6.32c-2.68-2.68-6.12-4.36-9.76-5.08v12.52c7.56 2.04 15.72 4.88 15.72 14.6 0 7.4-4.8 13.8-15.72 14.84h.04Zm-5.8-30.a96V31.04c-4.16.44-6.68 2.68-6.68 5.96 0 2.84 2.84 4.28 6.68 5.36ZM58.6 59.28c0-3.36-3-4.88-7.04-6.12v12.52c5-.72 7.04-3.64 7.04-6.4Z" fill="#1B3802"></path></svg>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <p style={{color: "rgb(208, 214, 225"}}>Your daily limit is 2,000.00 coins. VIPs have a higher limit.</p>
      </div>

      <div className={classes.addressContainer}>
        <div className={classes.topBar}>
          <div className={classes.coinHeader}>Input {coinData.slug == "CASH" ? <span className={classes.cashapp}>cashtag <span style={{fontSize: 12, opacity: 0.5}}>(ex: $solanaspin)</span></span>: "wallet address"}</div>
          <div className={classes.networkBox}>{coinData.network}</div>
        </div>
        <p style={{color: "rgb(208, 214, 225"}}>Always double-check the {coinData.slug == "CASH" ? "cashtag" : "address"} and the amount. We cannot recover funds sent to the wrong {coinData.slug == "CASH" ? "cashtag" : "address"}.</p>
        <div className={classes.converterContainer}>
          <AddressInput
            label=""
            variant="filled"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
      </div>

      <div className={classes.finalContainer}>
        <div className={classes.termsContainer}>
          <div 
            className={classes.termsCheckbox} 
            onClick={() => setAgreed(!agreed)}
            style={{ backgroundColor: agreed ? "hsl(215, 75%, 50%)" : "#4c4c4c" }}
          >
            {agreed ? <svg style={{transform: "scale(1.5)", margin: "auto 0",eight: "15px",width: "15px"}} fill="#fff" xmlns="http://www.w3.org/2000/svg" width="12" height="9" viewBox="0 0 12 9"><path d="M11.7801 0.21995C11.9205 0.360576 11.9994 0.5512 11.9994 0.74995C11.9994 0.948701 11.9205 1.13933 11.7801 1.27995L4.53007 8.52995C4.38944 8.6704 4.19882 8.74929 4.00007 8.74929C3.80132 8.74929 3.61069 8.6704 3.47007 8.52995L0.220066 5.27995C0.0876578 5.13769 0.0155543 4.94964 0.018911 4.75532C0.0222677 4.561 0.100823 4.37555 0.238066 4.23795C0.37567 4.10071 0.561119 4.02215 0.755436 4.0188C0.949753 4.01544 1.1378 4.08754 1.28007 4.21995L4.00007 6.93995L10.7201 0.21995C10.8607 0.0794997 11.0513 0.000610352 11.2501 0.000610352C11.4488 0.000610352 11.6394 0.0794997 11.7801 0.21995Z" fill="white"/></svg> : ""}
          </div>
          <div className={classes.terms}>I am aware that I will not receive a refund if I provide incorrect information. I have confirmed {coinData.slug == "CASH" ? "the correct cashtag." : "the network and my wallet address."}</div>
        </div>
        <motion.div 
          whileTap={{ scale: 0.97 }}
          className={classes.confirmButton}
          onClick={() => onClick()}
          style={{
            pointerEvents: agreed || withdrawing ? "all" : "none",
            opacity: agreed ? withdrawing ? 0.5 : 1 : 0.5,
            cursor: agreed || withdrawing ? "pointer" : "not-allowed"
          }}
        >
          {withdrawing ? "Confirming..." : "Confirm"}
        </motion.div>
      </div>
    </div>
  );
};

Withdraw.propTypes = {
  user: PropTypes.object,
  changeWallet: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, { changeWallet })(Withdraw);