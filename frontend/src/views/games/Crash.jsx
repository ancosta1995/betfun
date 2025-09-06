import React, { useState, useEffect, useRef } from "react";
import { BsFileLock2Fill } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import { GoArrowSwitch } from "react-icons/go";
import { makeStyles, withStyles,} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Box from "@material-ui/core/Box";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { limboSocket } from "../../services/websocket.service";
import { useToasts } from "react-toast-notifications";
import { useSpring, animated, config } from 'react-spring';
import { ClipLoader } from "react-spinners";
import Provably from "../../components/modals/upgrader/ProvablyModal";
import { motion } from "framer-motion";
import { getCurrentSeedPair } from "../../services/api.service";
import Tooltip from '@material-ui/core/Tooltip';
import BettingHistory from '../BettingHistory'; // Import the BettingHistory component
import Grow from '@material-ui/core/Grow';

import coin from "../../assets/icons/coin.png";
import { BorderLeft, BorderRight } from "@material-ui/icons";
import { BetInput, useStyles } from "./crashstyle"; // Import BetInput and useStyles
import { updateCurrency, DisplayFiat, updateFiat } from "../../actions/auth";
import prices from '../../components/Prices.json'; // Adjust the path as necessary



const Crash = (props) => {

const classes = useStyles();
  const { addToast } = useToasts();


  const { user, isAuthenticated, selectedCurrency, selectedLogo, selectedFiatCurrency, DisplayFiat, updateCurrency, updateFiat, DisplayForFiat } = props;

  const [selected, setSelected] = useState('manual'); // Set 'manual' as default
  const [tooltipOpen, setTooltipOpen] = useState(false); // State for tooltip visibility
  const [tooltip2Open, setTooltip2Open] = useState(false); // State for tooltip visibility

  const [betAmount, setBetAmount] = useState("1.00");
  const [multiplier, setMultiplier] = useState("2"); // State for multiplier
  const [loading, setLoading] = useState(false); // Initialize loading state
  const [limboResult, setLimboResult] = useState({ crashpoint: 1 }); // State to store limbo result
  const [openProvably, setOpenProvably] = useState(false);
  const [clientSeed, setClientSeed] = useState("clientseed");
  const [serverSeedHashed, setServerSeedHashed] = useState("serverseedhashed");
  const [nonce, setNonce] = useState(0);
  const [isClicked, setIsClicked] = useState(false);
  const [fastplay, setFastplay] = useState(false);
  const [hotkeysEnabled, setHotkeysEnabled] = useState(false);
  const timeoutRef = useRef(null); // Ref to keep track of the timeout

  const springProps = useSpring({
    from: { crashpoint: 1 },
    to: { crashpoint: limboResult.crashpoint ? parseFloat(limboResult.crashpoint) : 1 },
    config: { duration: fastplay ? 100 : 300 }, // Adjust duration based on fastplay state
  });
   const logoUrl = DisplayForFiat
   ? `https://shuffle.com/icons/fiat/${selectedFiatCurrency}.svg`
   : selectedLogo;


   console.log('navbar', DisplayForFiat)
   console.log('navbar', selectedLogo)
   console.log('navbar', selectedFiatCurrency)

  const handleHotkeysClick = () => {
    setHotkeysEnabled(!hotkeysEnabled);
  };
  const handleButtonClick = () => {
    setIsClicked(!isClicked);
    setFastplay(!fastplay); // Toggle fastplay mode
  };
  const handlemanualauto = (type) => {
    // setSelected(type);
    if (type === 'Auto') {
      setTooltip2Open(true); // Show tooltip if 'Auto' is selected
    } else {
      setTooltip2Open(false); // Hide tooltip if 'Manual' is selected
    }

  };
  console.log("Current selected currency:", selectedCurrency);
  console.log("Current selected currency:", selectedLogo);

  const onMultiplierChange = event => {
    const newMultiplier = event.target.value;
    // Check if newMultiplier is a valid number
    if (!isNaN(newMultiplier)) {
      setMultiplier(newMultiplier);
      
    }
    if (newMultiplier < 1.01 || newMultiplier > 1000000) {
      setTooltipOpen(true); // Show tooltip if value is out of range
    } else {
      setTooltipOpen(false); // Hide tooltip if value is valid
    } 
  };

  useEffect(() => {
    if (hotkeysEnabled) {
      const handleKeyDown = (event) => {
        if (event.code === 'Space') {

          // Clear any existing timeout to avoid spamming
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          // Set a new timeout based on fastplay
          const delay = fastplay ? 100 : 300;
          timeoutRef.current = setTimeout(() => {
            handleLimboBet(); // Trigger the play action after the delay
          }, delay);
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        // Clear timeout on cleanup
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [hotkeysEnabled, fastplay]);


  const handleBetAmountChange = (event) => {
    const newBetAmount = parseFloat(event.target.value);
    if (!isNaN(newBetAmount)) {
      setBetAmount(newBetAmount.toFixed(8)); // Adjust precision as needed
    }
  };
  
  const handleBetAmountButton = (factor) => {
    const newBetAmount = parseFloat(betAmount) * factor;
    setBetAmount(newBetAmount.toFixed(2));
  };

  const handleMultiplierButton = factor => {
    const newMultiplier = parseFloat(multiplier) * factor;
    setMultiplier(newMultiplier.toFixed(2));
  };
  const success = msg => {
    addToast(msg, { appearance: "success" });
  };
  const onBetChange = e => {
    setBetAmount(e.target.value);
  };
  const [target, setTarget] = useState("2");


  const onTargetChange = e => {
    setTarget(e.target.value);
  };
  const open = async (x) => {
    setLimboResult(x); // Update limbo result from the event data
  };
const fiatCurrencies = ['USD', 'EUR', 'IDR', 'TRY', 'MXN', 'BRL', 'JPY', 'CAD', 'CNY', 'DKK', 'KRW', 'PHP', 'NZD', 'ARS', 'RUB'];

// Function to format the balance for display
const formatBalance = (amount, selectedCurrency) => {
  if (DisplayForFiat) {
    if (selectedCurrency in prices && selectedFiatCurrency in prices[selectedCurrency]) {
      const conversionRate = prices[selectedCurrency][selectedFiatCurrency];
      if (conversionRate <= 0) {
        throw new Error('Invalid conversion rate');
      }
      // Convert the cryptocurrency amount to fiat currency
      const fiatAmount = amount * conversionRate;
      return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: selectedFiatCurrency 
      }).format(fiatAmount);
    } else {
      throw new Error('Currency not supported');
    }
  } else {
    // Format the cryptocurrency amount
    return new Intl.NumberFormat('en-US', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }).format(amount);
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



  const handleLimboBet = () => {
    if (loading) return; // Prevent bet action if already loading
    setLoading(true); // Set loading state to true when placing the bet

    let amountToSend;
    
    if (DisplayForFiat) {
      // Calculate true cryptocurrency amount if DisplayForFiat is true
      amountToSend = getTrueCryptoAmount(betAmount, selectedCurrency, selectedFiatCurrency);
    } else {
      // Use the regular amount if DisplayForFiat is false
      amountToSend = betAmount;
    }

    // Send the bet via the socket
    limboSocket.emit("limbo:bet", { 
      amount: amountToSend,  // Send the calculated or regular amount
      multiplier: multiplier, 
      currency: selectedCurrency // Use selectedCurrency from props
    });  
    // Adjust timeout duration based on fastplay state
    const timeoutDuration = fastplay ? 100 : 300;
  
    setTimeout(() => {
      setLoading(false); // Reset loading state after the timeout duration
    }, timeoutDuration);
  };
    const creationError = msg => {
    // Update state
    setLoading(true); // Set loading state to true when placing the bet

    addToast(msg, { appearance: "error" });
  };
  // const isBetDisabled = loading || betAmount <= 0 || multiplier < 1.01 || multiplier > 1000000;

  useEffect(() => {
    const fetchData = async () => {
      try {
      const response = await getCurrentSeedPair();
      setClientSeed(response.clientSeed);
      setServerSeedHashed(response.serverSeedHash);
      setNonce(response.nonce);
      setLoading(false);
      
      } catch (error) {
        console.log("There was an error while betting on limbo:", error);
      }
    };

    if(user && isAuthenticated) {
      fetchData();

    } else {
    }
    limboSocket.on("game-creation-error", creationError);
    limboSocket.on("limbo:bet", success);
    limboSocket.on("limbo:result", open);
    return () => {
      limboSocket.off("game-creation-error", creationError);
      limboSocket.off("limbo:bet", success);
      limboSocket.off("limbo:result", open);
    };
  }, [addToast]);
  return (
    <Grow in timeout={620}>

    <div className={classes.root}>
      
      <Provably 
          open={openProvably}
          handleClose={() => setOpenProvably(!openProvably)}
          serverSeedHash={serverSeedHashed}
          clientSeed={clientSeed}
          nonce={nonce}
        />

      <div className={classes.container}>

        <div className={classes.betSection}>
          
          <div className={classes.betContainer}>
          <div className={classes.buttonContainer}>
      <motion.div
        whileTap={{ scale: 0.9 }}
        className={`${classes.button} ${selected === 'manual' ? classes.selectedButton : ''}`}
        onClick={() => handlemanualauto('manual')}
      >
        <div className={`${classes.buttonContent} ${selected === 'manual' ? classes.selectedButtonContent : ''}`}>
          Manual
        </div>
      </motion.div>
      <Tooltip
        title="Auto Coming Soon"
        open={tooltip2Open} // Show tooltip based on state
        onClose={() => setTooltip2Open(false)} // Hide tooltip when closed
        classes={{ tooltip: classes.tooltip, arrow: classes.arrow }}
        placement="top"
      >
      <motion.div
        whileTap={{ scale: 0.9 }}
        className={`${classes.button} ${selected === 'Auto' ? classes.selectedButton : ''}`}
        onClick={() => handlemanualauto('Auto')}
      >
        <div className={`${classes.buttonContent} ${selected === 'Auto' ? classes.selectedButtonContent : ''}`}>
          Auto
        </div>
      </motion.div>
      </Tooltip>

    </div>


            {/* Bet Amount */}
            <div className={classes.title}>Bet Amount</div>
            <div className={classes.inputContainer}>
              <Box className={classes.placeBet}>
                <Box className={classes.betCont}>
                  <BetInput
                    label=""
                    variant="filled"
                    value={betAmount}
                    onChange={onBetChange}
        InputProps={{
          startAdornment: (
            <InputAdornment className={classes.inputIcon} position="start">
            <img style={{ height: 17, width: 17 }} src={logoUrl} alt={`${selectedCurrency} logo`} />
          </InputAdornment>
),
        }}
      />
                </Box>
              </Box>
              <div className={classes.multiplierContainer}>
                {/* Buttons for changing multiplier */}
                <Button
                  className={classes.multiplier}
                  size="small"
                  color="primary"
                  variant="contained"
                  onClick={() => handleBetAmountButton(0.5)}
                >
                  <span className={classes.reverse}>1/2</span>
                </Button>
                <Button
                  className={classes.multiplier}
                  size="small"
                  color="primary"
                  variant="contained"
                  onClick={() => handleBetAmountButton(2)}
                >
                  <span className={classes.reverse}>2x</span>
                </Button>
              </div>
            </div>

            {/* Multiplier Amount */}
            <div className={classes.title}>Multiplier Amount</div>
            <div className={classes.inputContainer}>
              <Box className={classes.placeBet}>
                <Box className={classes.betCont}>
                <Tooltip
  title="Multiplier must be between 1.01 and 1,000,000"
  open={tooltipOpen} // Show tooltip if multiplier is out of range
  placement="top"
        classes={{ tooltip: classes.tooltip, arrow: classes.arrow }}
>

                  <BetInput
                    label=""
                    variant="filled"
                    value={multiplier}
                    onChange={onMultiplierChange}
                    
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          className={classes.inputIcon}
                          position="start"
                        >
            <img src="https://shuffle.com/icons/increase.svg" alt="Money Icon" style={{ width: 16, height: 16 }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  </Tooltip>

                            </Box>
              </Box>
              
              
            </div>


            <motion.div
    className={`${classes.limboButton} ${loading || tooltipOpen ? classes.limboButtonDisabled : ''}`}
    onClick={handleLimboBet}
    whileTap={{ scale: 0.97 }}
    animate={{ filter: 'brightness(100%)' }}
    whileHover={{ filter: loading || tooltipOpen ? 'brightness(100%)' : 'brightness(110%)' }} // Disable hover effect when loading or tooltip is open
    style={{
      backfaceVisibility: 'hidden', // Prevents text blur
      willChange: 'transform, filter', // Hints the browser to optimize these properties
      cursor: loading || tooltipOpen ? 'not-allowed' : 'pointer' // Change cursor when loading or tooltip is open
    }}
  >
    {loading ? (
      <ClipLoader
        color="#fff"
        loading={true}
        size={10}
      />
    ) : (
      'Bet'
    )}
  </motion.div>





          </div>

          {/* Limbo Section */}
          <div className={classes.limboSection}>

          <animated.div
  style={{
    background: "rgba(0, 0, 0, 0.87)", // Black background with transparency
    fontFamily: "Rubik",
    fontSize: "5rem",
    fontWeight: 500,
    fontFeatureSettings: "'tnum'",
    fontVariantNumeric: "tabular-nums",
    border: "1px solid rgb(27, 28, 42)",
    borderRadius: "0.50rem",
    padding: "2rem 2rem", // Increased padding for a larger container
    width: "auto", // Adjust width (set as needed, e.g., 100%, or a fixed width like '800px')
    height: "auto", // You can make it taller by setting a fixed height if needed
    margin: "2rem auto", // Center the container and add space around
    color:
      parseFloat(limboResult.crashpoint) === 1
        ? "white"
        : parseFloat(multiplier) < parseFloat(limboResult.crashpoint)
        ? "rgb(61, 209, 121)" // Green
        : parseFloat(multiplier) > parseFloat(limboResult.crashpoint)
        ? "rgb(241, 50, 62)" // Red
        : "white",
    userSelect: "none", // Prevent text selection
  }}
>
  {springProps.crashpoint.interpolate(val => `${val.toFixed(2)}x`)}
</animated.div>




            {/* Remaining content */}
          </div>
          
        </div>

        <div className={classes.betContainer2}>
        <div style={{gap: "0.8rem", display: "flex"}}>
      <Tooltip title="Fast Play" placement="top">
          <motion.div
            className={`${classes.clickableButton} ${isClicked ? classes.clickedButton : ''}`}
            whileTap={{ scale: 0.60 }}
            animate={{ filter: 'brightness(100%)' }}
            onClick={handleButtonClick}
          >
            <svg
              fill="currentColor"
              viewBox="0 0 64 64"
              className="svg-icon"
              width="20"
              height="18"
              >
              <path d="M31.986 0v23.28H52.12L31.986 64V37.814H11.88L31.986 0Z"></path>
            </svg>
          </motion.div>
        </Tooltip>

      <Tooltip title="Provably Fair" placement="top">

      <motion.div
          className={classes.provablyFairButton}
          whileTap={{ scale: 0.80 }}
          animate={{ filter: 'brightness(100%)' }}
          whileHover={{ filter: 'brightness(85%)' }}
          onClick={() => setOpenProvably(!openProvably)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="20"
            viewBox="0 0 20 18"
            fill="none"
          >
            <path
              d="M12.4702 6.75L9.30354 9.75L7.7202 8.25M16.4285 7.62375C16.4285 12.55 12.4955 14.7586 10.8281 15.4735L10.826 15.4744C10.6506 15.5496 10.5628 15.5873 10.3635 15.6197C10.2373 15.6403 9.95389 15.6403 9.8277 15.6197C9.62765 15.5872 9.53882 15.5494 9.36212 15.4735C7.69471 14.7586 3.76187 12.55 3.76187 7.62375V4.65015C3.76187 3.81007 3.76187 3.38972 3.93445 3.06885C4.08624 2.7866 4.32829 2.5573 4.62621 2.41349C4.9649 2.25 5.40861 2.25 6.29536 2.25H13.8954C14.7821 2.25 15.2249 2.25 15.5636 2.41349C15.8615 2.5573 16.1043 2.7866 16.2561 3.06885C16.4285 3.3894 16.4285 3.80924 16.4285 4.64768V7.62375Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
        </Tooltip>
    <Tooltip title="Hotkeys (Space = Play)" placement="top">
      <motion.div
        className={`${classes.provablyFairButton} ${hotkeysEnabled ? classes.hotkeysEnabled : ''}`}
        whileTap={{ scale: 0.80 }}
        animate={{ filter: 'brightness(100%)' }}
        whileHover={{ filter: 'brightness(85%)' }}
        onClick={handleHotkeysClick}
      >
        <svg
          fill={hotkeysEnabled ? 'rgb(32, 112, 223)' : 'white'}
          viewBox="0 0 64 64"
          className="svg-icon"
          width="22"
          height="20"
        >
          <path d="M61.14 10.668H2.852A2.85 2.85 0 0 0 0 13.518v37.146a2.667 2.667 0 0 0 2.668 2.668h58.664A2.667 2.667 0 0 0 64 50.665V13.519a2.85 2.85 0 0 0-2.852-2.851h-.008ZM35.086 17.81h6.187v5.332h-6.187V17.81Zm0 11.495h6.187v5.332h-6.187v-5.332ZM22.715 17.811h6.187v5.332h-6.187V17.81Zm0 11.495h6.187v5.332h-6.187v-5.332ZM10.367 17.811h6.188v5.332h-6.188V17.81Zm0 11.495h6.188v5.332h-6.188v-5.332Zm43.254 16.88H10.37v-5.332h43.25v5.331Zm0-11.496h-6.188v-5.36h6.188v5.36Zm0-11.463h-6.188v-5.332h6.188v5.332Z"></path>
        </svg>
      </motion.div>
    </Tooltip>


      </div>

    </div>

      </div>
      
      {/* <BettingHistory currency={selectedCurrency} /> */}

    </div>
    </Grow>

  );
};

Crash.propTypes = {
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


export default connect(mapStateToProps, { updateFiat, DisplayFiat })(Crash);
