import React, { useState, useEffect, Fragment } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { connect, useSelector, useStore } from "react-redux";
import { useToasts } from "react-toast-notifications";
import PropTypes from "prop-types";
import parseCommasToThousands from "../utils/parseCommasToThousands";
import cutDecimalPoints from "../utils/cutDecimalPoints";
import { useHistory } from 'react-router-dom';
import CircularProgress from "@material-ui/core/CircularProgress";
import { motion, AnimatePresence, animationControls } from "framer-motion";
import { Divider, Grow, Slide, useScrollTrigger } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { getCurrentSeedPair } from "../services/api.service";
import Provably from "../components/modals/upgrader/ProvablyModal";
import { upgraderSocket } from "../services/websocket.service";
import CountUp from 'react-countup';
import confetti from 'canvas-confetti';
import confettiSound1 from "../assets/small_celebration.wav";
import upgraderSound from "../assets/sounds/upgrader.mp3";

import Coin from "../assets/icons/coin.png";
import Gold from "../assets/colors/gold.png";
import Red from "../assets/colors/red.png";
import Purple from "../assets/colors/purple.png";
import Blue from "../assets/colors/blue.png";
import Grey from "../assets/colors/grey.png";
import GoldBG from "../assets/colors/goldbg.png";
import RedBG from "../assets/colors/redbg.png";
import PurpleBG from "../assets/colors/purplebg.png";
import BlueBG from "../assets/colors/bluebg.png";
import GreyBG from "../assets/colors/greybg.png";
import GoldBlob from "../assets/colors/goldblob.png";
import RedBlob from "../assets/colors/redblob.png";
import PurpleBlob from "../assets/colors/purpleblob.png";
import BlueBlob from "../assets/colors/blueblob.png";
import GreyBlob from "../assets/colors/greyblob.png";
import { items } from './items.js';
import { updateCurrency, DisplayFiat, updateFiat } from "../actions/auth";
import prices from '../components/Prices.json'; // Adjust the path as necessary

import { BetInput, useStyles, ColorCircularProgress } from "./upgraderstyle.js"; // Import BetInput and useStyles
const confettiAudio1 = new Audio(confettiSound1);
confettiAudio1.volume = 0.075;
const selectAudio = new Audio(upgraderSound);

const playSound = audioFile => {
  audioFile.play();
};

function calculateAngle(ticketNumber) {
  const maxTicketNumber = 1000000001;
  return (ticketNumber / maxTicketNumber) * 360;
};

function hexToRGBA(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};


const Upgrader = (props) => {

  const { user, isAuthenticated, selectedCurrency, selectedLogo, selectedFiatCurrency, DisplayFiat, updateCurrency, updateFiat, DisplayForFiat } = props;

  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();
  const history = useHistory();

  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [clientSeed, setClientSeed] = useState("clientseed");
  const [serverSeedHashed, setServerSeedHashed] = useState("serverseedhashed");
  const [nonce, setNonce] = useState(0);
  const [openProvably, setOpenProvably] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [betAmount, setBetAmount] = useState(0);
  const [isUnder, setIsUnder] = useState(true);
  const [rotateEndpoint, setRotateEndpoint] = useState(0);
  
  let ROTATE_ENDPOINT = 0;
  const [multiplier, setMultiplier] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [tickets, setTickets] = useState({
    low: 0,
    high: 0
  });
  const [lastTicket, setLastTicket] = useState(0);
  const [previous, setPrevious] = useState(0);
  const logoUrl = DisplayForFiat
? `https://shuffle.com/icons/fiat/${selectedFiatCurrency}.svg`
: selectedLogo;
  const [selectedItem, setSelectedItem] = useState({
    name: null,
    price: 0,
    image: null,
    color: null,
    blob: null,
    hex: null
  });
  const updateBetAmount = (percentages) => {
    const formattedAmount = (formatBalance(selectedItem.price, selectedCurrency, selectedFiatCurrency, DisplayForFiat));

    // Remove non-numeric characters (except for period and minus sign)
    const cleanFormattedPrice = formattedAmount.replace(/[^0-9.-]+/g, '');
    
    // Convert the cleaned string into a float
    const formattedPrice = parseFloat(cleanFormattedPrice) || 0;
    
    if (selectedItem && formattedPrice) {
      if (upgrading) return;
      if (!user || !isAuthenticated) return;
      if (!selectedItem.name) return;
      // const formattedAmount = (formatBalance(selectedItem.price, selectedCurrency, selectedFiatCurrency, DisplayForFiat));
      // const formattedPrice = parseCommasToThousands(formatBalance(selectedItem.price, selectedCurrency, selectedFiatCurrency, DisplayForFiat));
      // Calculate new bet amount based on the percentage of the selected item's price

// Calculate new bet amount
const newBetAmount = formattedPrice * (percentages / 100);

// Debugging output
console.log("formatted price", formattedPrice);
console.log("new bet amount", newBetAmount);
console.log("formatted amount", formattedAmount);

      // console.log("formatted", formattedAmount)

      // Format and update percentage value
      const formattedPercentage = parseCommasToThousands(
        ((newBetAmount / formattedPrice) * 100).toFixed(2)
      );
      setPercentage(formattedPercentage);
  
      // Set and format the bet amount
      setBetAmount(newBetAmount);
  
      // Calculate multiplier and format it
      const formattedMultiplier = parseCommasToThousands(
        ((formattedPrice / newBetAmount) * 0.9).toFixed(2)
      );
      setMultiplier(formattedMultiplier);
  
      // Update ticket range, using formatted percentage
      updateTicketRange(formattedPercentage, isUnder);

      console.log(formattedPrice)
    }
  };
  

  const updateTicketRange = (perc, under) => {
    const maxTicketNumber = 1;
    if (!under) {
      setTickets({
        low: Math.abs((perc / 100) * maxTicketNumber - 1),
        high: maxTicketNumber - 1,
      });
    } else {
      setTickets({
        low: maxTicketNumber - 1,
        high: (perc / 100) * maxTicketNumber,
      });
    }
  };
// Function to format the balance for display
const formatBalance = (usdPrice, selectedCurrency, selectedFiatCurrency, displayForFiat = false) => {
  // Access the prices for the selected cryptocurrency (e.g., BTC, ETH)
  const cryptoPrices = prices[selectedCurrency];

  if (displayForFiat) {
    // If displaying in fiat, convert directly from USD to the selected fiat currency
    const usdToFiatRate = prices['USDT'][selectedFiatCurrency]; // USDT/USD is 1:1 so we use it for fiat conversions

    if (usdToFiatRate <= 0) {
      throw new Error('Invalid conversion rate');
    }

    // Convert USD price directly to the selected fiat currency
    const fiatAmount = usdPrice * usdToFiatRate;

    // Format and return the fiat amount in the selected fiat currency
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: selectedFiatCurrency 
    }).format(fiatAmount);
  } else {
    // If displaying in crypto, convert USD price to the selected cryptocurrency amount
    const usdToCryptoRate = cryptoPrices['USD']; // Get the USD to crypto conversion rate

    if (usdToCryptoRate <= 0) {
      throw new Error('Invalid conversion rate');
    }

    // Convert USD price to the selected cryptocurrency amount (e.g., BTC amount)
    const cryptoAmount = usdPrice / usdToCryptoRate;

    // Format and return the crypto amount
    return new Intl.NumberFormat('en-US', { 
      minimumFractionDigits: 7,
      maximumFractionDigits: 8,
    }).format(cryptoAmount);
  }
};
// Function to get the true cryptocurrency amount based on the selected fiat currency
const getTrueCryptoAmount = (amount, selectedCurrency, selectedFiatCurrency) => {
  // Check if the selected cryptocurrency and fiat currency are supported in the prices data
  if (selectedCurrency in prices && selectedFiatCurrency in prices[selectedCurrency]) {
    const cryptoPriceInFiat = prices[selectedCurrency][selectedFiatCurrency]; // Get the price in the selected fiat currency
    if (cryptoPriceInFiat <= 0) {
      throw new Error('Invalid cryptocurrency price');
    }
    // Divide the amount by the price of the cryptocurrency in the selected fiat currency
    const trueAmount = amount / cryptoPriceInFiat;
    return trueAmount;
  } else {
    throw new Error('Currency or fiat not supported');
  }
};

  const triggerUpgrader = () => {
    try {
      setUpgrading(true);
      let amountToSend;
      if (DisplayForFiat) {
        // Calculate true cryptocurrency amount if DisplayForFiat is true
        amountToSend = getTrueCryptoAmount(betAmount, selectedCurrency, selectedFiatCurrency);
      } else {
        // Use the regular amount if DisplayForFiat is false
        amountToSend = betAmount;
      }
      const formattedPrice = getTrueCryptoAmount(selectedItem.price, selectedCurrency, selectedFiatCurrency);

  
      upgraderSocket.emit("upgrader:attempt", parseFloat(amountToSend), { ...selectedItem, price: formattedPrice }, isUnder, selectedCurrency);

          } catch (error) {
      addToast("An error occured when trying attempt the upgrade: " + error, { appearance: "error" });
    }
  };
  const formattedPrices = selectedItem.name 
  ? parseCommasToThousands(formatBalance(selectedItem.price, selectedCurrency, selectedFiatCurrency, DisplayForFiat)) 
  : "0.00";

  const triggerConfetti = () => {
    const containerCenter = document.querySelector(`#canvas-center`);
  
    if (containerCenter) {
      const confettiCenter = confetti.create(containerCenter, {
        resize: true,
      });
  
      playSound(confettiAudio1);
  
      confettiCenter({
        particleCount: 75,
        spread: 40,
        angle: 90,
        origin: {
          x: 0.5, 
          y: 1.1 
        },
      });
    }
  };

  const simulateAnimation = (data) => {
    const remainder = ROTATE_ENDPOINT % 360;
    const adding = 360 - remainder;
    const extra = 720 + ROTATE_ENDPOINT;
    const angle = calculateAngle(data.ticket)

    ROTATE_ENDPOINT = extra + angle + adding;
    setRotateEndpoint(ROTATE_ENDPOINT);
    setNonce(state => state + 1);
    setTimeout(() => {
      setPrevious(lastTicket)
      setLastTicket(data.ticket / 1000000001);
      if(data.success) triggerConfetti();
      setUpgrading(false);
    }, 5000);
  };

  const updateAll = (newBetAmount, newSliderValue, newPercentSelector) => {
    if(upgrading) return;
    if(!user || !isAuthenticated) return;
    if(!selectedItem.name) return;
    const formattedAmount = (formatBalance(selectedItem.price, selectedCurrency, selectedFiatCurrency, DisplayForFiat));

    // Remove non-numeric characters (except for period and minus sign)
    const cleanFormattedPrice = formattedAmount.replace(/[^0-9.-]+/g, '');
    
    // Convert the cleaned string into a float
    const formattedPrice = parseFloat(cleanFormattedPrice) || 0;
    
    if(betAmount != newBetAmount) {
      if(((newBetAmount / formattedPrice)*100).toFixed(2) > 80) return;
      setBetAmount(newBetAmount);
      newSliderValue = ((newBetAmount / user.wallet) * 100).toFixed(2);
      setSliderValue(newSliderValue);
    } else if(newSliderValue != sliderValue) {
      if((((user.wallet * (newSliderValue / 100) / formattedPrice)*100).toFixed(2) > 80)) return;
      setSliderValue(newSliderValue);
      newBetAmount = (user.wallet * (newSliderValue / 100)).toFixed(2);
      setBetAmount((user.wallet * (newSliderValue / 100)).toFixed(2));
    } else if(newPercentSelector != sliderValue) {
      if((((user.wallet * (newPercentSelector / 100) / formattedPrice)*100).toFixed(2) > 80)) return;
      setSliderValue(newPercentSelector);
      newBetAmount = (user.wallet * (newPercentSelector / 100)).toFixed(2);
      setBetAmount((user.wallet * (newPercentSelector / 100)).toFixed(2));
    }

    setMultiplier(parseCommasToThousands(((formattedPrice / newBetAmount)*.9).toFixed(2)));
    setPercentage(parseCommasToThousands((((newBetAmount / formattedPrice)*100)).toFixed(2)));
    updateTicketRange((((newBetAmount / formattedPrice)*100)).toFixed(2), isUnder);
  };

  useEffect(() => {
    playSound(selectAudio);
    setMultiplier(0);
    setPercentage(0);
    setBetAmount(0.00);
    setSliderValue(0);
    updateTicketRange(0, isUnder);
  }, [selectedItem]);

  useEffect(() => {
    updateTicketRange(percentage, isUnder);
  }, [isUnder]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCurrentSeedPair();
  
        setClientSeed(response.clientSeed);
        setServerSeedHashed(response.serverSeedHash);
        setNonce(response.nonce);

        setBetAmount(0.00);
        setSliderValue(0);

        setLoading(false);
      } catch (error) {
        addToast("An error has occured when trying to get seed pair data.", { appearance: "error" });
        console.log("There was an error while loading upgrader data:", error);
      }
    };    

    const error = msg => {
      setUpgrading(false);
      addToast(msg, { appearance: "error" });
    };

    const success = msg => {
      addToast(msg, { appearance: "success" });
    };

    if(user && isAuthenticated) {
      fetchData();
    } else {
      setBetAmount(0.00);
      setSliderValue(100);
      setLoading(false);
    }

    upgraderSocket.on("upgrader:result", simulateAnimation);
    upgraderSocket.on("upgrader:success", success);
    upgraderSocket.on("upgrader:error", error);
    return () => {
      upgraderSocket.off("upgrader:result", simulateAnimation);
      upgraderSocket.off("upgrader:success", success);
      upgraderSocket.off("upgrader:error", error);
    };
  }, []);

  const getColorSet = (color) => {
    switch(color) {
      case "grey":
        return { Color: Grey, Background: GreyBG, Hex: "#91A0B1", Blob: GreyBlob }
      case "blue":
        return { Color: Blue, Background: BlueBG, Hex: "#4159CF", Blob: BlueBlob }
      case "purple":
        return { Color: Purple, Background: PurpleBG, Hex: "#703ECF", Blob: PurpleBlob }
      case "red":
        return { Color: Red, Background: RedBG, Hex: "#BF4141", Blob: RedBlob }
      case "gold":
        return { Color: Gold, Background: GoldBG, Hex: "#B69768", Blob: GoldBlob }
      default:
        return { Color: Grey, Background: GreyBG, Hex: "#91A0B1", Blob: GreyBlob }
    }
  };

  return loading ? (
    <div className={classes.loader}>
      <ColorCircularProgress />
    </div>
  ) : (
    <Grow in timeout={620}>
      <div className={classes.root}>
        <Provably 
          open={openProvably}
          handleClose={() => setOpenProvably(!openProvably)}
          serverSeedHash={serverSeedHashed}
          clientSeed={clientSeed}
          nonce={nonce}
        />
        <div className={classes.topContainer}>
          <div className={classes.balanceControllerBox}>
            <div className={classes.balanceContainer}>
              <div className={classes.upgradeText}>Use your balance to upgrade!</div>
              
              <BetInput
                type="number"
                label=""
                variant="filled"
                value={betAmount}
                onChange={(e) => updateAll(e.target.value, sliderValue, sliderValue)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment className={classes.inputIcon} position="start">
                    <img style={{ height: 17, width: 17 }} src={logoUrl} alt={`${selectedCurrency} logo`} />
                  </InputAdornment>
                  ),
                }}
              />

              <div className={classes.percentContainer}> 
              <motion.div
        animate={{ filter: "brightness(100%)" }}
        whileHover={{ filter: "brightness(85%)" }}
        className={classes.percentBox}
        onClick={() => updateBetAmount(10)}
        style={{
          color: sliderValue === 10 ? "#fff" : "#9E9FBD",
          backgroundColor: sliderValue === 10 ? "hsl(215, 75%, 50%)" : "#1A1B33"
        }}
      >
        10%
      </motion.div>

      <motion.div
        animate={{ filter: "brightness(100%)" }}
        whileHover={{ filter: "brightness(85%)" }}
        className={classes.percentBox}
        onClick={() => updateBetAmount(25)}
        style={{
          color: sliderValue === 25 ? "#fff" : "#9E9FBD",
          backgroundColor: sliderValue === 25 ? "hsl(215, 75%, 50%)" : "#1A1B33"
        }}
      >
        25%
      </motion.div>

      <motion.div
        animate={{ filter: "brightness(100%)" }}
        whileHover={{ filter: "brightness(85%)" }}
        className={classes.percentBox}
        onClick={() => updateBetAmount(30)}
        style={{
          color: sliderValue === 30 ? "#fff" : "#9E9FBD",
          backgroundColor: sliderValue === 30 ? "hsl(215, 75%, 50%)" : "#1A1B33"
        }}
      >
        30%
      </motion.div>

      <motion.div
        animate={{ filter: "brightness(100%)" }}
        whileHover={{ filter: "brightness(85%)" }}
        className={classes.percentBox}
        onClick={() => updateBetAmount(50)}
        style={{
          color: sliderValue === 50 ? "#fff" : "#9E9FBD",
          backgroundColor: sliderValue === 50 ? "hsl(215, 75%, 50%)" : "#1A1B33"
        }}
      >
        50%
      </motion.div>
    </div>

            </div>
            <motion.div className={classes.provablyFairButton} whileTap={{ scale: 0.97 }} animate={{ filter: "brightness(100%)" }} whileHover={{ filter: "brightness(85%)" }} onClick={() => setOpenProvably(!openProvably)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="18" viewBox="0 0 20 18" fill="none"><path d="M12.4702 6.75L9.30354 9.75L7.7202 8.25M16.4285 7.62375C16.4285 12.55 12.4955 14.7586 10.8281 15.4735L10.826 15.4744C10.6506 15.5496 10.5628 15.5873 10.3635 15.6197C10.2373 15.6403 9.95389 15.6403 9.8277 15.6197C9.62765 15.5872 9.53882 15.5494 9.36212 15.4735C7.69471 14.7586 3.76187 12.55 3.76187 7.62375V4.65015C3.76187 3.81007 3.76187 3.38972 3.93445 3.06885C4.08624 2.7866 4.32829 2.5573 4.62621 2.41349C4.9649 2.25 5.40861 2.25 6.29536 2.25H13.8954C14.7821 2.25 15.2249 2.25 15.5636 2.41349C15.8615 2.5573 16.1043 2.7866 16.2561 3.06885C16.4285 3.3894 16.4285 3.80924 16.4285 4.64768V7.62375Z" stroke="white" stroke-width="1.5" stroke-linecap="round" strokeLinejoin="round"/></svg>
            </motion.div>
          </div>
          <div className={classes.upgraderBox}>
            <canvas id={`canvas-center`} className={classes.canvas}></canvas>
            <motion.div className={classes.spinnerMirror} style={{ transform: `rotate(${rotateEndpoint}deg)`}}>
              <svg className={classes.spinnerSelector} width="28" height="24" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M25.8233 0.25H2.98657C1.4147 0.25 0.442158 1.96294 1.24768 3.31273L12.666 22.4462C13.4516 23.7625 15.3582 23.7625 16.1438 22.4462L27.5622 3.31273C28.3677 1.96294 27.3951 0.25 25.8233 0.25Z" fill="white"></path></svg>            </motion.div>
              <div style={{ transform: isUnder ? "none" : "scaleX(-1)", height: "290px", width: "290px", position: "absolute" }}>
                <CircularProgressbar
                  value={percentage}
                  className={classes.progressCircle}
                  styles={buildStyles({
                    strokeLinecap: 'butt',
                    pathColor: `hsl(215, 75%, 50%)`,
                    trailColor: '#222333',
                  })}
                />
              </div>
            <div className={classes.upgraderCircle}>
              <div className={classes.upgraderContainer}>
                <div className={classes.percentText}>{(parseFloat(percentage)).toFixed(2)}<span style={{ color: "hsl(215, 75%, 50%)" }}>%</span></div>
                <motion.div 
                  whileTap={{ scale: 0.97 }} 
                  className={classes.upgradeButton} 
                  onClick={() => triggerUpgrader()}
                  style={{
                    pointerEvents: upgrading ? "none" : "all", 
                    opacity: upgrading ? 0.5 : 1, 
                    cursor: upgrading ? "not-allowed" : "pointer" 
                  }}
                >
                  {upgrading ? "Upgrading..." : "Upgrade"}
                </motion.div>
                <div style={{ fontSize: 12, fontWeight: 500, color: "#9E9FBD", marginTop: "0.25rem"}}>{tickets.low.toFixed(4)} - {tickets.high.toFixed(4)}</div>
              </div>
            </div>
            <motion.div className={classes.OverAndUnder} whileTap={{ scale: 0.97 }} onClick={() => setIsUnder(state => upgrading ? state : !isUnder)}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 500, fontSize: 18, color: "#9E9FBD"}}>
                <motion.svg style={{ rotate: isUnder ? 180 : 0, transitionDuration: "200ms" }} xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M18.2205 4.18331C18.5796 3.83466 19.1533 3.8431 19.502 4.20218L23.6084 8.43134C23.9498 8.78297 23.9498 9.34232 23.6084 9.69396L19.502 13.9231C19.1533 14.2822 18.5796 14.2907 18.2205 13.9419C17.8615 13.5933 17.853 13.0196 18.2016 12.6605L20.8151 9.96888H6.04154C5.54103 9.96888 5.13529 9.56315 5.13529 9.06263C5.13529 8.56213 5.54103 8.15638 6.04154 8.15638H20.8151L18.2016 5.46481C17.853 5.10571 17.8615 4.53197 18.2205 4.18331ZM10.7792 15.058C11.1383 15.4067 11.1467 15.9804 10.7981 16.3395L8.18438 19.0313H22.9582C23.4587 19.0313 23.8645 19.4371 23.8645 19.9376C23.8645 20.4381 23.4587 20.8438 22.9582 20.8438H8.18485L10.7981 23.5351C11.1467 23.8943 11.1383 24.468 10.7792 24.8167C10.4201 25.1653 9.84637 25.1568 9.4977 24.7978L5.39131 20.5687C5.0499 20.2171 5.0499 19.6577 5.39131 19.306L9.4977 15.0769C9.84637 14.7178 10.4201 14.7094 10.7792 15.058Z" fill="#2070DF"/></motion.svg>
                Over or Under
              </div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#9E9FBD", display: "flex", gap: "0.3rem", justifyContent: "center"}}>Ticket: 
                <CountUp
                  delay={0}
                  duration={1}
                  decimals={9}
                  start={previous}
                  end={lastTicket}
                />
              </div>
            </motion.div>
          </div>
          <motion.div 
            className={classes.itemControllerBox}
            style={{
              background: selectedItem.name ? `linear-gradient(to right, ${hexToRGBA(selectedItem.hex, 0.2)} 0%, rgba(253, 27, 98, 0) 100%) #101123` : "#101123"
            }}
          >
            <AnimatePresence>
              
              {selectedItem.name && (
                <motion.div
                  initial={{ opacity: 0, y: 100, scale: 0.5 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 100  , scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={classes.bigItemBox} onClick={() => setSelectedItem(state => upgrading ? state : { name: null, price: 0, image: null, color: null, blob: null, hex: null })}>
                    <img src={selectedItem.image} className={classes.bigItemImage} />
                    <img src={selectedItem.blob} className={classes.bigItemColor} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className={classes.multiplierText}>
              <div style={{ fontSize: 13, color: ""}}>Your multiplier</div>
              <div style={{ fontSize: 16, color: ""}}>{(parseFloat(multiplier)).toFixed(2)}<span style={{color: selectedItem.hex}}>x</span></div>
              <div style={{ fontSize: 13, color: "#9E9FBD"}}>{(parseFloat(percentage)).toFixed(2)}%</div>
            </div>
            <div className={classes.itemNameText}>
              <div style={{ fontSize: 13, color: ""}}>{selectedItem.name ? selectedItem.name : "Select an item"}</div>
              <div style={{display: "flex", alignItems: "center", gap: "0.3rem", fontSize: 18, fontWeight: "bold"}}>
              <img style={{ height: 17, width: 17 }} src={logoUrl} alt={`${selectedCurrency} logo`} />
              {formattedPrices}
              </div>
            </div>
          </motion.div>
        </div>
        <div>
          <div>Choose an Item</div>
          <div className={classes.itemsContainer}>
            {items.map((item, index) => {
const formattedPrice = formatBalance(item.price, selectedCurrency, selectedFiatCurrency, DisplayForFiat);

              const { Color, Background, Hex, Blob } = getColorSet(item.color);
              return (
                <motion.div
                  key={index}
                  className={classes.itemBox}
                  onClick={() => {
                    if(selectedItem.name == item.name) {
                      setSelectedItem({
                        name: null,
                        price: 0,
                        image: null,
                        color: null,
                        blob: null,
                        hex: null
                      });
                    } else {
                      setSelectedItem({
                        name: null,
                        price: 0,
                        image: null,
                        color: null,
                        blob: null,
                        hex: null
                      });     
                      setBetAmount(0);
                      setSliderValue(0);
                      setPercentage(0);
                      setMultiplier(0);
                      setSelectedItem({ ...item, blob: Blob, hex: Hex });
                    }
                  }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    backgroundImage: `url(${Background})`,
                    filter: selectedItem.name == item.name ? "brightness(75%)" : "brightness(100%)",
                    border: selectedItem.name == item.name ? "1px solid #222333" : ""
                  }}
                >
                  <img src={item.image} alt={item.name} className={classes.itemImage} />
                  <img src={Blob} alt={item.color} className={classes.itemColor} />
                  <div className={classes.itemPrice} style={{ backgroundColor: Hex }}>
                  <img style={{ zIndex: "99999", height: 17, width: 17 }} src={logoUrl} alt={`${selectedCurrency} logo`} />
                  {parseCommasToThousands(formattedPrice)}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </Grow>
  );
};

Upgrader.propTypes = {
  user: PropTypes.object,
  isAuthenticated: PropTypes.bool,
  selectedCurrency: PropTypes.string.isRequired,
  selectedLogo: PropTypes.string.isRequired,
  selectedFiatCurrency: PropTypes.string.isRequired,
  DisplayFiat: PropTypes.string.isRequired,
  DisplayForFiat: PropTypes.string.isRequired,

};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  isAuthenticated: state.auth.isAuthenticated,
  selectedCurrency: state.auth.selectedCurrency, // Make sure these match your Redux state
  selectedLogo: state.auth.selectedLogo,
  selectedFiatCurrency: state.auth.selectedFiatCurrency, // Ensure these match your Redux state
  DisplayFiat: state.auth.DisplayFiat, // Ensure these match your Redux state
  DisplayForFiat: state.auth.DisplayForFiat, // Ensure these match your Redux state

});


export default connect(mapStateToProps, { updateFiat, DisplayFiat })(Upgrader);
