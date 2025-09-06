// Import necessary libraries and components
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { MinesSocket } from "../services/websocket.service";
import { useToasts } from "react-toast-notifications";
import { ClipLoader } from "react-spinners";
import { makeStyles, withStyles, Button, InputAdornment, Box } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { motion } from "framer-motion";
import Typography from "@material-ui/core/Typography";
import coin from "../assets/icons/coin.png";

import {
  getActiveMines,
  Getminesreveal,
} from "../services/api.service";
const BetInput = withStyles({
  root: {
    marginRight: 10,
    maxWidth: 130,
    minWidth: 100,
    marginBottom: 10, // Add top margin

    "& :before": {
      display: "none",
    },
    "& label": {
      color: "#323956",
      fontSize: 15,
    },
    "& div input": {
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".1em",
      padding: "0.5rem 0.25rem",
    },
    "& div": {
      // background: "#171A28",
      background: "#131426",
      height: "2.25rem",
      borderRadius: 4,
    },
    
  },
})(TextField);

const ResultInput = withStyles({
  root: {
    marginRight: 10,
    maxWidth: 180,
    minWidth: 0,
    marginBottom: 10, // Add top margin
    
    "& :before": {
      display: "none",
    },
    "& label": {
      color: "#323956",
      fontSize: 15,
    },
    "& input": {
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".1em",
      padding: "8px 8px", // Adjust padding as needed
    },
    "& div": {
      // background: "#171A28",
      // background: "#131426",
      // height: "2.25rem",
      borderRadius: 4,
    },
    
  },
})(TextField);



const useStyles = makeStyles(theme => ({

  "@keyframes tileFetching": {
    "0%, to": {
      transform: "scale(1)",
    },
    "50%": {
      transform: "scale(1.05)",
    },
  },

  // Define the class for the fetching animation
  tileFetching: {
    animationName: "$tileFetching", // Reference the keyframes
    animationDuration: "1s", // Duration of the animation
    animationIterationCount: "infinite", // Make the animation repeat infinitely
  },

  root: {
    marginTop: "3%",
    display: "flex",
    justifyContent: "center",

    [theme.breakpoints.down("lg")]: {
      marginTop: "-10px",

    },
  },
    betInputContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, minmax(180px, 1fr))', // Adjust column width
  
    gridGap: '.5rem',
    marginTop: '1rem', /* Adjust as needed */
    bottom: '1rem', // Adjust as needed
    transform: 'translateY(200%)', // Move the container down
    [theme.breakpoints.down("lg")]: {
      gridTemplateColumns: 'repeat(3, minmax(80px, 1fr))', // Adjust column width

      transform: 'translateY(100%)', // Move the container down
    },


  },
  minescontainer: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gridGap: "8px",
    marginTop: "-25px",

  },
  imgTransition: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "opacity 0.5s ease",
    opacity: 0,
  },
  tileImage: {
    width: '58px',
    height: '58px',
    [theme.breakpoints.down('sm')]: {
      width: '32px',
      height: '32px',
    },
  },


  revealedTile: {
    backgroundColor: "#2070DF !important", // Set background color for revealed tiles
    transition: "background-color 2s ease", // Adjust transition duration to 2 seconds
  },
  
  mineTile: {
    backgroundColor: "#F52B2B !important", // Set background color to red for mine tiles
  },

  tile: {
    // Apply transition to transform property
    transition: "transform 0.4s ease",
    filter: "brightness(125%)",
    width: "90px",
    height: "83px",
    backgroundColor: "#101123",
    border: "1px solid #101123",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#ffffff",
    fontWeight: 500,
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#16172d",
      animationDuration: "1s",
      animationIterationCount: "infinite",
       transform: "scale(1.05)",

    },
    "&.revealed img": {
      opacity: 1,
    },

    [theme.breakpoints.down("lg")]: {
      width: "50px",
      height: "50px",
    },
  },

  numberContainer: {
    marginTop: "2%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "550px", // Default width
    color: "#ffffff",
    fontWeight: 500,
    [theme.breakpoints.down("lg")]: {
      
      width: "250px", // Adjusted width for lg and below
    },
  },
  number: {
    margin: 0,
    fontSize: "12px", // Adjust the font size as needed
  },
  inputRange: {
    WebkitAppearance: "none",
    appearance: "none",
    background: "#d3d3d3",
    outline: "none",
    height: "10px",
    transition: "opacity .2s",
    accentColor: "blue",
    backgroundColor: "#ffda21",
    width: "550px",
    borderRadius: "4px",
    [theme.breakpoints.down("lg")]: {
      width: "250px", // Adjusted width for lg and below
    },

    "&::-webkit-slider-thumb": {
      backgroundColor: "rgb(68, 131, 235)",
      borderRadius: "4px",
      cursor: "grab",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "3px",
      marginLeft: "-7px",
      transition: "all 0.05s ease",
      boxShadow: "rgba(43, 42, 42, 0.28) 0px -3px 0px inset",
      WebkitAppearance: "none",
      appearance: "none",
      width: "45px",
      height: "45px",
      borderRadius: "6px",
    },
    "&::-moz-range-thumb": {
      width: "35px",
      height: "35px",
      background: "cc",
      cursor: "pointer",
    },
  },
  title: {
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "12px",
    fontWeight: 500,
    padding: "0.25rem 0.25rem 0",
    lineHeight: 1,
  },
  resultPopup: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    border: '3px solid #2070df',
    borderRadius: '3px',
    background: '#101123',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 25px',
    textAlign: 'center',
    zIndex: 100,
    transition: 'border-color 0.3s ease, padding-top 0.3s ease',
    color: 'white', // Set text color to white
  },
  

  placeBet: {
    background: "#131426",
    borderRadius: 5,
    boxShadow: "0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12)",
    marginTop: "0.6rem",
    "& button": {
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "12px",
      fontWeight: 500,
      letterSpacing: ".1em",
      "&:hover": {
        opacity: 1,
      },
    },
  },

  betCont: {
    display: "flex",
    width: "95%",
    alignItems: "center",
    flexWrap: "wrap",
    margin: "auto",
    padding: "0.5rem 0 0",
  },
  container: {

    width: "auto",
    marginLeft: "auto",
    marginRight: "auto",
    backgroundColor: "#0a0b1c", 
    borderRadius: "8px",
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("xl")]: {
      width: "78%",
      maxWidth: "1050px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "auto",
    },
  },
  betSection: {
    
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: "12px",
    paddingBottom: "12px",
    [theme.breakpoints.down("lg")]: {
      flexDirection: "column-reverse", // Reverse column order on Android
    },
  },
  inputIcon: {
    marginTop: "0 !important",
    color: "#4fa0d8",
    background: "transparent !important",
  },
  betContainer: {

    border: "1px solid #101123",
    borderRadius: "4px",
    paddingRight: "12px",
    paddingLeft: "12px",
    paddingTop: "16px",
    paddingBottom: "16px",
    width: "300px",
    height: "450px",
    backgroundColor: "#101123",
    [theme.breakpoints.down("lg")]: {
      marginTop: "24px",
      width: "100%",
      height: "auto",
    },
  },
  inputContainer: {
    position: "relative",
    marginBottom: "24px",
  },
  betInput: {
    width: "100%",
    height: "40px",
    backgroundColor: "#101123",
    paddingLeft: "40px",
    color: "#ffffff",
    borderRadius: "4px",
    border: "none",
    outline: "none",
    fontFamily: "'Roboto', sans-serif",
    fontSize: "16px",
    fontWeight: 500,
    "&::placeholder": {
      color: "#cccccc",
    },
  },
  betInputs: {
    width: "100%",
    height: "40px",
    backgroundColor: "#101123",
    paddingLeft: "10px",
    color: "#ffffff",
    borderRadius: "4px",
    border: "none",
    outline: "none",
    fontFamily: "'Roboto', sans-serif",
    fontSize: "16px",
    fontWeight: 500,
    "&::placeholder": {
      color: "#cccccc",
    },
  },
  multiplierContainer: {
    position: "absolute",
    top: "10px",
    right: "10px",
    display: "flex",
    gap: "8px",
  },
  multiplier: {
    minWidth: "fit-content",
    backgroundColor: "#101123",
    borderColor: "#32363c",
    color: "white",
  },
  multiplierButton: {
    backgroundColor: "transparent",
    color: "#cccccc",
    border: "1px solid transparent",
    outline: "none",
    cursor: "pointer",
    padding: "4px",
    fontSize: "14px",
    fontFamily: "'Roboto', sans-serif",
    fontWeight: 500,
    "&:hover": {
      backgroundColor: "#101123",
    },
  },
  insufficientFundsButton: {
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    width: "100%",
    height: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "2px solid #4c8bf5",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    fontFamily: "'Roboto', sans-serif",
    fontWeight: 500,
    "&:hover": {
      backgroundColor: "#2563eb",
      borderColor: "#1e429f",
    },
  },
  limboButtonDisabled: {
    opacity: 0.5, // Reduce opacity when disabled
    pointerEvents: "none", // Disable pointer events when disabled
  },
  
  limboButton: {
    textTransform: "none",
    width: "100%",
    height: "40px",
    padding: "0 30px",
    borderRadius: "4px",
    fontSize: "15px",
    fontWeight: 500,
    color:" #fff",
    background: "rgb(32, 112, 223)",
    border: "none",
    color: "#ffffff",
    transition: "opacity .3s ease",
    fontFamily: "Rubik",
    "&:hover": {
      background: "rgb(32, 112, 223)",
      borderColor: "#1e429f",
    },
  },

  limboSection: {
        filter: "brightness(105%)",
    border: "4px solid #0a0b1c",
    backgroundColor: "#10110",
    borderRadius: "6px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.down("lg")]: {
        height: "310px",
    },
    [theme.breakpoints.up("lg")]: {
        width: "100%", // Adjust the width as needed
        maxWidth: "700px", // Set the maximum width to maintain consistency
        marginLeft: "auto",
        marginRight: "auto",
    },
},
  
  
  
}));

const Mines = ({ user, isAuthenticated }) => {
  const classes = useStyles();
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(false);
  const [tiles, setTiles] = useState(Array(25).fill({ multiplier: 0, revealed: false }));
  const [selectedBomb, setSelectedBomb] = useState(1);
  const [betAmount, setBetAmount] = useState("1.00");
  const [status, setStatus] = useState("middle");
  const [profit, setProfit] = useState(0); // State for profit
  const [multiplier, setMultiplier] = useState(0); // State for multiplier
  const [loadingTileIndex, setLoadingTileIndex] = useState([]);
  const [cashoutStatus, setCashoutStatus] = useState(false); // State variable for cashout status
  const [cashoutOccurred, setCashoutOccurred] = useState(false); // State to track cashout status
  const [gameEnd, setGameEnd] = useState(false); // Define gameEnd state variable
  const [tilesToReveal, setTilesToReveal] = useState([]);
  const [revealing, setRevealing] = useState(false);

  const [highlightedTiles, setHighlightedTiles] = useState([]);
  const [revealedTiles, setRevealedTiles] = useState([]);
  const [activeminesgame, setActiveminesgames] = useState([]);
  // Handle bet amount change
  const handleBetAmountChange = (event) => {
    const newBetAmount = event.target.value;
    if (!isNaN(newBetAmount)) {
      setBetAmount(newBetAmount);
    }
  };
  
  useEffect(() => {
    MinesSocket.on("mines:cashoutSuccess", () => {
      // Update cashout status
      setCashoutStatus(true);
    });

    return () => {
      // Clean up socket event listener
      MinesSocket.off("mines:cashoutSuccess");
    };
  }, []);


  const handleTileClickWithDelay = (index) => {
    // Optionally add some delay before revealing the tile
    setTimeout(() => handleTileClick(index), 200); // Adjust delay as needed
  };

  useEffect(() => {
    // Listen for tile revelation events from the server
    MinesSocket.on("mines:tileRevealed", ({ tileIndex, profit, multiplier }) => {
      // Update the state to mark the tile as revealed
      setTiles(prevTiles => {
        const newTiles = [...prevTiles];
        newTiles[tileIndex] = { ...newTiles[tileIndex], revealed: true };
        console.log("Tile revealed:", tileIndex);
        console.log("Profit:", profit);
        console.log("Multiplier:", multiplier);
        setProfit(profit);
        setMultiplier(multiplier);
  
        // Remove the tile index from the loading state
        setLoadingTileIndex(prevLoadingTiles => prevLoadingTiles.filter(item => item !== tileIndex));
  
        return newTiles;
      });
    });
  
    return () => {
      // Clean up event listeners
      MinesSocket.off("mines:tileRevealed");
    };
  }, [tiles]);



  // Handle mine selection change
  const handleBombChange = (event) => {
    setSelectedBomb(event.target.value);
  };

  // Handle bet amount button click
  const handleBetAmountButton = (factor) => {
    const newBetAmount = parseFloat(betAmount) * factor;
    setBetAmount(newBetAmount.toFixed(2));
  };

const handlePlaceBet = async () => {
  if (betAmount > 0) {
    try {
      setCashoutOccurred(false);
      setTiles(Array(25).fill({ multiplier: 0, revealed: false }));

      setStatus("inprogress");
      setProfit(0);

      await MinesSocket.emit("mines:bet", { amount: betAmount, minescount: selectedBomb });
    } catch (error) {
      console.error('Error placing bet:', error);
    }
  } else {
    addToast("Minimum amount 0.1!", { appearance: "error" });
  }
};

  

const handleTileClick = async (index) => {
  if (status === "inprogress") {
    // Temporarily set the tile as loading
    setLoadingTileIndex([index]);

    // Wait for 0.5 seconds to check if the game has ended
    setTimeout(async () => {
      if (status !== "inprogress") {
        addToast("The game has ended.", { appearance: "error" });
        setLoadingTileIndex([]);
        return;
      }

      // Update the tile to be revealed
      setTiles(prevTiles => {
        
        const newTiles = [...prevTiles];
        newTiles[index] = { ...newTiles[index], revealed: true };
        return newTiles;
      });

      try {
        await MinesSocket.emit("mines:revealTile", { tileIndex: index });
        // Add a delay before removing loading state
        setTimeout(() => {
          setLoadingTileIndex([]);
        }, 1000); // Adjust the delay if needed
      } catch (error) {
        console.error('Error revealing tile:', error);
        setLoadingTileIndex([]);
      }
    }, 250); // 0.5 seconds delay
  } else {
    addToast("The game is not in progress.", { appearance: "error" });
  }
};
  
        const handleCashout = async () => {
    // Calculate the number of revealed tiles
    const numRevealedTiles = tiles.filter(tile => tile.revealed).length;
    setCashoutOccurred(true);

    // Check if no tiles have been revealed
    if (numRevealedTiles === 0) {
      // Notify the user that they can't cash out because no tiles have been revealed
      addToast("You can't cash out before revealing any tiles!", { appearance: "error" });
      return;
    }
  
    try {
      // Implement cashout logic here
      // For example:
      // - Make an API call to process the cashout
      // - Update the UI or state variables accordingly
      // For now, let's simulate a cashout by resetting the game
      setTiles(Array(25).fill({ multiplier: 0, revealed: false }));
      setStatus("middle"); // Update status back to "middle" after cashout
      await MinesSocket.emit("mines:cashout");
  
      console.log("Cashout Successful");
      // Notify the user about successful cashout
      addToast("Cashout successful!", { appearance: "success" });
    } catch (error) {
      console.error('Error during cashout:', error);
      // Handle error: display message, etc.
      addToast("Error during cashout", { appearance: "error" });
    }
  };
    
  const creationError = msg => {
    // Update state

    addToast(msg, { appearance: "error" });
  };
  const open = (msg) => {
    const errorMessage = msg.error || "An error occurred"; // Default message if 'error' property is not present
    addToast(errorMessage, { appearance: "error" });
  };
  const success = msg => {
    addToast(msg, { appearance: "success" });
  };
  const reveal = msg => {
    addToast(msg, { appearance: "success" });

  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const activeminesgame = await getActiveMines();
        setLoading(false);
        const status = activeminesgame.status;
        setStatus(status);
        const tiles = activeminesgame.grid;
        const profit = activeminesgame.profit;

        setTiles(tiles);
        setProfit(profit);

      } catch (error) {
        console.error("Error fetching active mines:", error);
        setLoading(false);
        // Handle error: display message, etc.
      }
    };
  
    fetchData();
  
    MinesSocket.on("mines:result", (msg) => {
      if (msg === "No active game found.") {
        setTiles(Array(25).fill({ multiplier: 0, revealed: false }));
        setStatus("middle");
        addToast("No active game found", { appearance: "info" });
      } else if (msg === "success") {
        setTiles(Array(25).fill({ multiplier: 0, revealed: false }));
        setStatus("middle");
        addToast("Game result received", { appearance: "success" });
      } else {
        open(msg);
      }
    });
  
    MinesSocket.on("mines:start", (msg) => {
      if (msg === "Game Has Been Started") {
        setStatus("inprogress");
      }
    });
    MinesSocket.on("game-creation-error", creationError);

    MinesSocket.on("mines:bet", (msg) => {
      addToast(msg, { appearance: "success" });
    });
  
    MinesSocket.on("mines:gameEnd", async (msg) => {
      if (msg.message === "You revealed a mine! Game over.") {
        setRevealing(false); // Start animation
    
        setGameEnd(true); // Set gameEnd to true when the game ends
    
        // Optionally clear tiles or update status immediately
        setTiles(Array(25).fill({ multiplier: 0, revealed: false }));
        setStatus("middle");
        addToast("You revealed a mine! Game over.", { appearance: "error" });
        setProfit("0");
    
        try {
          // Introduce a delay before updating the tiles
          setTimeout(async () => {
            try {
              const minesreveal = await Getminesreveal();
              const reveal = minesreveal.grid;
    
              // Ensure gameEnd is still true before setting tiles
              if (gameEnd) {
                setRevealing(true)

                setTiles(reveal);
                
                console.log(reveal);
              }
              
            } catch (error) {
              console.error("Error fetching mines reveal:", error);
              // Handle error: display message, etc.
            }
          }, 500); // 500 milliseconds delay before updating tiles
    
        } catch (error) {
          console.error("Error in game end handler:", error);
          // Handle error: display message, etc.
        }
      }
    });
        MinesSocket.on("mines:revealAllTiles", (tiles) => {
      setRevealing(true); // Start animation
      setTiles(prevTiles => {
        const updatedTiles = tiles.map(tile => ({
          ...tile,
          revealed: true,
        }));
        return updatedTiles;
      });
      // Set cashoutOccurred to true after all tiles are revealed
      setCashoutOccurred(true);
    
      // Reset animation state after a delay to allow animations to complete
      setTimeout(() => setRevealing(false), 250);
    });
    
    
    // Cleanup socket event listeners
    return () => {
      MinesSocket.off("game-creation-error", creationError);
      MinesSocket.off("mines:bet");
      MinesSocket.off("mines:result", open);
      MinesSocket.off("mines:start", success);
      MinesSocket.off("mines:gameEnd");
      MinesSocket.off("mines:revealAllTiles");

    };
  }, [addToast]); // Dependency array containing addToast
  
  return (
    <div className={classes.root}>
      {/* Your component JSX */}
      <div className={classes.container}>
        {/* Bet section */}
        <div className={classes.betSection}>
          {/* Bet input */}
          <div className={classes.betContainer}>
            {/* Bet amount input */}
            <div className={classes.title}>Bet Amount</div>
            <div className={classes.inputContainer}>
              <Box className={classes.placeBet}>
                <Box className={classes.betCont}>
                  <BetInput
                    label=""
                    variant="filled"
                    value={betAmount}
                    onChange={handleBetAmountChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment className={classes.inputIcon} position="start">
                          <img src={coin} alt="Money Icon" style={{ width: 16, height: 16 }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Box>
              <div className={classes.multiplierContainer}>
                {/* Buttons for changing bet amount */}
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

{/* Mines amount selection */}
{status !== "inprogress" && (
  <div>
    <div className={classes.title}>Mines Amount</div>
    <div className={classes.inputContainer}>
      <Box className={classes.placeBet}>
        <Box className={classes.ss}>
          <select
            className={classes.betInputs}
            value={selectedBomb}
            onChange={handleBombChange}
          >
            {[...Array(24)].map((_, i) => (
              <option key={i} value={i + 1}>
                Mine {i + 1}
              </option>
            ))}
          </select>
        </Box>
      </Box>
    </div>
  </div>
)}

{/* Profit */}
{status === "inprogress" && (
  <div>
    <div className={classes.title}>Profit</div>
    <div className={classes.inputContainer}>
      <Box className={classes.placeBet}>
        <Box className={classes.betCont}>
          <BetInput
            label=""
            variant="filled"
            value={(profit).toFixed(2)} // Fixed to 2 decimal places
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
  </div>
)}

            {/* Place Bet or Cashout button */}
            <Button
        variant="contained"
        color={status === "inprogress" ? "secondary" : "primary"}
        className={`${classes.limboButton} ${loading ? classes.limboButtonDisabled : ''}`}
        onClick={status === "inprogress" ? handleCashout : handlePlaceBet}
      >
        {loading ? (
          <ClipLoader
            color="#fff"
            loading={true}
            size={10}
          />
        ) : (
          status === "inprogress" ? 'Cashout' : 'Place Bet'
        )}
      </Button>






        </div>

        {/* Mines grid */}
        <div className={classes.limboSection}>
{
  // cashoutOccurred && !gameEnd && (
  //   // <div className={classes.resultPopup}>
  //   //   <Box mt={1} display="flex" alignItems="center" flexDirection="column">
  //   //     <div style={{ display: 'flex', alignItems: 'center' }}>
  //   //       <Typography variant="h5" style={{ marginRight: 4 }}>{multiplier.toFixed(2)}x</Typography>
  //   //     </div>
  //   //     <div style={{ display: 'flex', alignItems: 'center' }}>
  //   //       <Typography variant="body1" style={{ fontSize: '0.9rem', marginRight: 4 }}>{typeof profit === 'number' ? profit.toFixed(2) : profit}</Typography>
  //   //       <img src={coin} alt="Money Icon" style={{ width: 16, height: 16 }} />
  //   //     </div>
  //   //   </Box>
  //   // </div>
  // )
}




<div className={classes.minescontainer}>
      {tiles.map((tile, index) => (
        <motion.div
          key={index}
          className={`${classes.tile} ${
            tile.revealed ? "revealed" : ""
          } ${loadingTileIndex.includes(index) ? classes.tileFetching : ""} ${
            tile.revealed ? classes.revealedTile : ""
          } ${tile.isMine ? classes.mineTile : ""}`}
          initial={{ opacity: tile.revealed ? 0 : 1 }} // Start with opacity 0 if revealing
          animate={{ opacity: revealing ? 0 : 1 }} // Animate opacity based on tile.revealed
          transition={{
            duration: 0.5,
            delay: tile.revealed ? index * 0.02 : 0, // Sequential reveal
          }}
          onClick={() => handleTileClick(index)}
        >
          {tile.revealed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img
                className={`${classes.imgTransition} ${classes.noSelect} ${classes.tileImage}`}
                src={
                  tile.isMine
                    ? "https://cdn.discordapp.com/attachments/1008423958787403849/1236710350523728015/mine.BrdEJX0T.svg?ex=663eee84&is=663d9d04&hm=2d10a5b1b01849d5aa5a49ecac3682a809318f86c26bc3e85ca5486490975b5b&"
                    : "http://localhost:3000/static/media/coin.077d403e.png"
                }
                alt={tile.isMine ? "Mine" : "Gemstone"}
                style={{
                  opacity: tile.isMine ? 1 : (cashoutOccurred ? 0.4 : 1),
                }}
              />
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>

</div>

        </div>
      </div>
    </div>
  );
};

Mines.propTypes = {
  user: PropTypes.object,
  isAuthenticated: PropTypes.bool,
};

// Map state to props
const mapStateToProps = state => ({
  user: state.auth.user,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Mines);
