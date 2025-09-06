import React, {useRef, useState, useEffect } from "react";
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
import { diceSocket } from "../../services/websocket.service";
import { useToasts } from "react-toast-notifications";
import { useSpring, animated, config } from 'react-spring';
import { ClipLoader } from "react-spinners";
import { motion, AnimatePresence, animationControls } from "framer-motion";
import coin from "../../assets/icons/coin.png";
import Tooltip from '@material-ui/core/Tooltip';
import Provably from "../../components/modals/upgrader/ProvablyModal";
import { getCurrentSeedPair } from "../../services/api.service";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { BetInput, useStyles, ResultInput } from "./dicestyle"; // Import BetInput and useStyles
import { updateCurrency, DisplayFiat, updateFiat } from "../../actions/auth";
import prices from '../../components/Prices.json'; // Adjust the path as necessary
import Grow from '@material-ui/core/Grow';
import BettingHistory from "../BettingHistory";
import styled, { keyframes } from 'styled-components';
const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// Styled spinner component
const Spinner = styled.div`
  height: 3rem; // Adjust the spinner size
  width: 3rem;
  border: 4px solid #080808; // Light transparent border for the outer part of the spinner
  border-top: 4px solid hsl(251.31deg, 75%, 50%); // Color for spinner
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite; // Apply spinning animation
  transition: transform 0.3s ease; // Transition for hover effect
`;

const Dice = (props) => {

  const { user, isAuthenticated, selectedCurrency, selectedLogo, selectedFiatCurrency, DisplayFiat, updateCurrency, updateFiat, DisplayForFiat } = props;

  const classes = useStyles();
  const { addToast } = useToasts();

  const [rangeData, setRangeData] = useState(50);
  const [betAmount, setBetAmount] = useState("1.00");
  const [multiplier, setMultiplier] = useState("2"); // State for multiplier
  const [selected, setSelected] = useState('manual'); // Set 'manual' as default
  const [tooltipOpen, setTooltipOpen] = useState(false); // State for tooltip visibility
  const [tooltip2Open, setTooltip2Open] = useState(false); // State for tooltip visibility

  const [loading, setLoading] = useState(false); // Initialize loading state
  const [diceResult, setDiceResult] = useState(0); 
  const [payout, setPayout] = useState(0); 
  const [isClicked, setIsClicked] = useState(false);
  const [fastplay, setFastplay] = useState(false);
  const [hotkeysEnabled, setHotkeysEnabled] = useState(false);
  const timeoutRef = useRef(null); // Ref to keep track of the timeout
  const [openProvably, setOpenProvably] = useState(false);
  const [clientSeed, setClientSeed] = useState("clientseed");
  const [serverSeedHashed, setServerSeedHashed] = useState("serverseedhashed");
  const [nonce, setNonce] = useState(0);
  const [isRollOver, setIsRollOver] = useState(true); // State to track Roll Over or Roll Under

  const handleToggle = () => {
    setIsRollOver(!isRollOver); // Toggle the state
  };
  const [diceResults, setDiceResults] = useState([]);
  const logoUrl = DisplayForFiat
  ? `https://shuffle.com/icons/fiat/${selectedFiatCurrency}.svg`
  : selectedLogo;

  // Function to handle a new dice roll
  const rollDice = () => {
    const newResult = Math.floor(Math.random() * 100) + 1; // Example dice result
    setDiceResults(prevResults => [...prevResults, newResult]);
  };

  let inputRef = useRef();
  const handleRangeChange = (e) => {
    setRangeData(e.target.value);
  };
  const [showDiceResult, setShowDiceResult] = useState(true); // Define showDiceResult state variable
  const handleHotkeysClick = () => {
    setHotkeysEnabled(!hotkeysEnabled);
  };
  const Accordion = ({ title }) => {
    const classes = useStyles();
  
    return (
      <div className={classes.accordionContainer}>
        <div className={classes.accordionHeader}>
          <span>{title}</span>
          <ExpandMoreIcon style={{ transform: 'rotate(180deg)' }} /> {/* Arrow always pointing down */}
        </div>
        <div className={classes.accordionBody}>
          <div className={classes.detailsContainer}>
            <Box className={classes.detailItemContainer}>
              <div className={classes.detailItem}>
                <div className={classes.detailTitle}>House Edge:</div>
                <div className={classes.detailValue}>1%</div>
              </div>
            </Box>
            <Box className={classes.detailItemContainer}>
              <div className={classes.detailItem}>
                <div className={classes.detailTitle}>Max Bet:</div>
                <div className={classes.detailValue}>
                  1,000.00 <img src={coin} alt="coin" />
                </div>
              </div>
            </Box>
            <Box className={classes.detailItemContainer}>
              <div className={classes.detailItem}>
                <div className={classes.detailTitle}>Max Win:</div>
                <div className={classes.detailValue}>
                  10,000.00 <img src={coin} alt="coin" />
                </div>
              </div>
            </Box>
            <Box className={classes.detailItemContainer}>
              <div className={classes.detailItem}>
                <div className={classes.detailTitle}>Max Multiplier:</div>
                <div className={classes.detailValue}>10,000.00×</div>
              </div>
            </Box>
          </div>
          <div className={classes.contentContainer}>
            <Box className={classes.contentBox}>
              <p>
                betfun.gg is the ultimate online gambling experience, where you can play exciting games from top providers such as Pragmatic Gaming, Nolimit City, and Evolution Gaming's Live Casino. Try your luck on all the most popular titles and become a VIP member with unmatched benefits as you level up. We support all major cryptocurrencies, such as Bitcoin, Ethereum, Litecoin, and USDT.
              </p>
            </Box>
          </div>
        </div>
      </div>
    );
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
  const [sliderValue, setSliderValue] = useState(50);
  const rollOver = rangeData + 0.1; // Calculate the roll over value

  // Function to handle slider value change
  const handleSliderChange = event => {
    setSliderValue(event.target.value);

  };

  const calculateMultiplier = (target) => {
    if (target <= 0 || target >= 100) {
      throw new Error("Target must be between 0 and 100 (exclusive).");
    }
  
    // Calculate the chance of winning
    const chances = (100 - target) / 100;
  
    // Calculate the multiplier
    const multipliers = 1 / chances;
  
    return multipliers.toFixed(4); // Returns multiplier rounded to 4 decimal places
  };
  const multi = calculateMultiplier(sliderValue);
  const redPercentage = (sliderValue - 1.2);
  const greenPercentage = (redPercentage);

  // Dynamic background value for the slider
  const sliderBackground = isRollOver
  ? `linear-gradient(90deg, #f1323e ${redPercentage}%, rgb(61, 209, 121) ${greenPercentage}%)`
  : `linear-gradient(90deg, rgb(61, 209, 121) ${redPercentage}%, #f1323e ${greenPercentage}%)`;



  const onMultiplierChange =  e => {
        setMultiplier(e.target.value); // Update the state with the new number
    
};


const handleBetAmountChange = (event) => {
  const newBetAmount = parseFloat(event.target.value);
  if (!isNaN(newBetAmount)) {
    setBetAmount(newBetAmount.toFixed(8)); // Adjust precision as needed
  }
};
  function calculateChance(multiplier, sliderValue) {
    // Multiplier is the target multiplier (e.g., 4.00)
    // maxOutcome is the maximum value on the die (e.g., 100)

    // Calculate the threshold for hitting the multiplier
    const threshold = sliderValue / multiplier;

    // Calculate chance of hitting at least the multiplier
    const chance = (threshold / sliderValue) * 100;

    return chance.toFixed(2) + '%';
}
const handleChange = (event) => {
  const value = event.target.value;
  if (!isNaN(value) && value !== '') { // Ensure the input is a number and not empty
      setMultiplier(Number(value));
  }
};
const getColorAndBorder = () => {
  if (payout > 0) {
    return { color: 'rgb(5, 223, 5)', border: '1px solid rgb(5, 223, 5)' };
  } else if (payout === 0) {
    return { color: 'rgb(255, 0, 0)', border: '1px solid rgb(255, 0, 0)' };
  } else {
    return { color: 'rgb(5, 223, 5)', border: 'none' };
  }
};

const chance = calculateChance(multi, sliderValue);

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
  const open = async (data) => {
    const { diceresult, payout } = data; // Extract the diceresult value from the data
    setDiceResult(diceresult); // Update dice result with only diceresult value
    console.log(diceresult)
    setPayout(payout); // Update dice result with only diceresult value
    console.log(payout)

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
          const delay = fastplay ? 100 : 250;
          timeoutRef.current = setTimeout(() => {
            handleDiceBet(); // Trigger the play action after the delay
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
  
  
  
    const handleDiceBet = () => {
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
      diceSocket.emit("dice:bet", { 
        amount: amountToSend,  // Send the calculated or regular amount
        multiplier: multi,
        rangeData: sliderValue,
        isRollOver: isRollOver,
        currency: selectedCurrency // Use selectedCurrency from props

         });


      // Adjust timeout duration based on fastplay state
      const timeoutDuration = fastplay ? 75 : 250;
    
      setTimeout(() => {
        setLoading(false); // Reset loading state after the timeout duration
      }, timeoutDuration);
    };
  


  const creationError = msg => {
    // Update state
    setLoading(true); // Set loading state to true when placing the bet

    addToast(msg, { appearance: "error" });
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(false);

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
  

    fetchData();
    diceSocket.on("game-creation-error", creationError);
    diceSocket.on("dice:bet", success);
    diceSocket.on("dice:result", open);
    return () => {
      diceSocket.off("game-creation-error", creationError);

      diceSocket.off("dice:bet", success);
      diceSocket.off("dice:result", open);
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
            <div className={classes.title}>Profit</div>
            <div className={classes.inputContainer}>
              <Box className={classes.placeBet}>
                <Box className={classes.betCont}>
                  <BetInput
                    label=""
                    variant="filled"
                    value={isRollOver ? betAmount * multi : (100 / sliderValue * betAmount).toFixed(2)} // Conditionally set the value
                    onChange={isRollOver ? handleChange : undefined} // Handle input changes only if Roll Over
                              readOnly // Add this line to make the input uneditable
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
                            </Box>
              </Box>
            </div>

        {/* Place Bet Button */}
        <motion.div
  className={`${classes.diceButton} ${loading ? classes.diceButtonDisabled : ''}`}
  onClick={handleDiceBet}
  whileTap={{ scale: 0.97 }}
  animate={{ filter: 'brightness(100%)' }}
  whileHover={{ filter: loading ? 'brightness(100%)' : 'brightness(110%)' }} // Disable hover effect when loading
  style={{
    backfaceVisibility: 'hidden', // Prevents text blur
    willChange: 'transform, filter', // Hints the browser to optimize these properties
    cursor: loading ? 'not-allowed' : 'pointer' // Change cursor when loading
  }}
>
  {loading ? (
    <ClipLoader
      color="#fff"
      loading={true}
      size={12}
    />
  ) : (
    'Place Bet'
  )}
</motion.div>

          </div>

          {/* Dice Section */}
          
          <div className={classes.diceSection}>
  {/* Input Range */}
  <div className={classes.inputRangeContainer}>
    <span className={classes.arrow}></span>
    <input
      className={classes.inputRange}
      type="range"
      name="range"
      min="2"
      step="1"
      value={sliderValue}
      onChange={handleSliderChange}
      max="98"
      style={{ background: sliderBackground }}
    />
<motion.div
  style={{
    position: 'absolute',
    top: '-70px',
    left: `${(diceResult - 0.1) / (104.9) * 99.9}%`,
    transform: 'translateX(-50%)', // Center the box around the dice result
    fontFamily: 'Rubik, sans-serif',
    fontWeight: 500,
    userSelect: "none",
    fontSize: '14px',
    width: '60px', // Fixed width for square shape
    height: '57px', // Same height for square shape
    borderRadius: '8px', // Rounded corners for a smooth effect
    backgroundColor: 'rgba(46, 47, 62, 0.1)', // Dark background for contrast
    display: diceResult ? 'flex' : 'none', // Show only if diceResult is present
    justifyContent: 'center', // Center text horizontally
    alignItems: 'center', // Center text vertically
    color: payout > 0 ? 'white' : payout === 0 ? 'white' : 'white', // Dynamic text color based on payout
     
    // Borders with different thickness for a boxy effect
    borderTop: payout > 0 
      ? '2.5px solid rgb(61, 209, 121)' // Thin top border
      : payout === 0 
        ? '2px solid #f1323e' // Thin top border for zero payout
        : 'none',
    borderLeft: payout > 0 
      ? '2.5px solid rgb(61, 209, 121)' // Thin left border
      : payout === 0 
        ? '2px solid #f1323e' // Thin left border for zero payout
        : 'none',
    borderBottom: payout > 0 
      ? '6px solid rgb(61, 209, 121)' // Thicker bottom border
      : payout === 0 
        ? '6px solid #f1323e' // Thicker bottom border for zero payout
        : 'none',
    borderRight: payout > 0 
      ? '6px solid rgb(61, 209, 121)' // Thicker right border
      : payout === 0 
        ? '6px solid #f1323e' // Thicker right border for zero payout
        : 'none',
        borderTopRightRadius: '5.5px', // Adjust as needed
        borderBottomRightRadius: '5.5px', // Adjust as needed
        borderTopLeftRadius: '5.5px', // Adjust as needed
        borderBottomLeftRadius: '5.5px', // Adjust as needed

    // Box shadow for visual effect
    boxShadow: payout > 0 
      ? '0px 0px 4px rgba(5, 223, 5, 0.5)' // Green shadow for positive payout
      : payout === 0 
        ? '0px 0px 4px rgba(255, 0, 0, 0.5)' // Red shadow for zero payout
        : 'none', // No shadow for negative payout
  }}
  animate={{ left: `${(diceResult - 0.1) / (101.1 + 2.1) * 99.9}%` }} // Left position animation
  transition={{ duration: fastplay ? 0.2 : 0.5, ease: 'easeInOut' }} // Smooth transition for left movement
>
  {diceResult}
</motion.div>
  </div>


  <div className={classes.numberContainer}>
    <p className={classes.number}>0</p>
    <p className={classes.number}>25</p>
    <p className={classes.number}>50</p>
    <p className={classes.number}>75</p>
    <p className={classes.number}>100</p>
  </div>


  <div className={classes.betInputContainer}>
    
  <Box className={classes.placeBet}>
  <div className={classes.titles}>Multiplier</div>

  <ResultInput
          label=""
          value={isRollOver ? multi : (100 / sliderValue).toFixed(2)} // Conditionally set the value
          onChange={isRollOver ? handleChange : undefined} // Handle input changes only if Roll Over
          InputProps={{
            startAdornment: (
              <InputAdornment
                className={classes.inputIcon}
                position="end"
              >
                <img 
                  src="https://shuffle.com/icons/increase.svg" 
                  alt="Money Icon" 
                  style={{ width: 16, height: 16 }} 
                />
              </InputAdornment>
            ),
          }}
        />
    </Box>
    <Box className={classes.placeBet}>
      <div className={classes.titles}>
        {isRollOver ? 'Roll Over' : 'Roll Under'}
      </div>

      <Box className={classes.ff}>
        <ResultInput
          label=""
          value={Number(sliderValue).toFixed(2)} // Convert sliderValue to a number and then call toFixed
          readOnly // Make the input uneditable
          InputProps={{
            startAdornment: (
              <InputAdornment
                className={classes.inputIcon}
                position="end"
              >
        <img 
          src="https://shuffle.com/icons/sync.svg" 
          alt="Toggle Icon" 
          style={{ width: 16, height: 16, cursor: 'pointer' }} // Adjust margin and cursor
          onClick={handleToggle} // Handle click event
        />
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Box>
    <Box className={classes.placeBet}>
    <div className={classes.titles}>Chance</div>

    <ResultInput
  label=""
  value={isRollOver ? chance : (parseFloat(sliderValue)).toFixed(2)} // Conditionally set the value
  readOnly // Add this line to make the input uneditable
  InputProps={{
    startAdornment: (
      <InputAdornment
        className={classes.inputIcon}
        position="end"
      >
        <img src="https://shuffle.com/icons/increase.svg" alt="Money Icon" style={{ width: 16, height: 16 }} />
      </InputAdornment>
    ),
  }}
/>

    </Box>

  </div>



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
      {/* <Accordion title="Dice Originals">
      </Accordion> */}
      <div className="mt-4">
        <BettingHistory gameType="dice" />
      </div>

    </div>
    </Grow>

  );
};

Dice.propTypes = {
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


export default connect(mapStateToProps, { updateFiat, DisplayFiat })(Dice);
