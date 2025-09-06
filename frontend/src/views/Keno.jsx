// Import necessary libraries and components
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { MinesSocket, KenoSocket } from "../services/websocket.service";
import { useToasts } from "react-toast-notifications";
import { ClipLoader } from "react-spinners";
import { makeStyles, withStyles, Button, InputAdornment, Box } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { motion } from "framer-motion";
import Typography from "@material-ui/core/Typography";

import {
  getActiveMines,
  Getminesreveal,
} from "../services/api.service";
const odds = {
  1: [0.68, 1.8],
  2: [0, 1.96, 3.6],
  3: [0, 1.1, 1.38, 24],
  4: [0, 0, 2.1, 7.8, 88.6],
  5: [0, 0, 1.5, 4, 12, 292],
  6: [0, 0, 1.1, 1.85, 6, 100, 600],
  7: [0, 0, 1.1, 1.6, 3.2, 14, 200, 700],
  8: [0, 0, 1.1, 1.4, 2, 5, 39, 100, 800],
  9: [0, 0, 1.1, 1.3, 1.6, 2.3, 7, 40, 200, 900],
  10: [0, 0, 1.1, 1.2, 1.3, 1.4, 2.6, 10, 30, 200, 1000]

}; 




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
    marginBottom: 10, 
    
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
      padding: "8px 8px", 
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



  root: {
    marginTop: "3%",
    display: "flex",
    justifyContent: "center",

    [theme.breakpoints.down("lg")]: {
      marginTop: "5%",

    },
  },
  clickedTile: {
    boxShadow: "0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12)",

    '--tw-bg-opacity': 1,
    backgroundColor: "#2070DF !important", // Set background color for revealed tiles
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
  kenocontainer: {
    display: "grid",
    gridTemplateColumns: "repeat(8, auto)",
    gridGap: ".60em",

  },

  history: {
    display: 'flex',
    width: '50rem',
    marginTop: "10px",
    gap: '0.4rem',

    marginRight: '15px',
    '&:last-of-type': {
      marginRight: '0',
    },
    color: 'white',
    opacity: 1,
  },

  
  gameHistory: {
    marginTop: "1rem",
    display: 'flex',
  },
  historyKeno: {

    display: 'inline-flex',
    flexDirection: 'column',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '9px',
    borderRadius: '3px',
    lineHeight: '17px',
    '& > div:first-child': {
      fontSize: '13px',
    },
    '& > div:last-child': {
      fontSize: '11px',
    },
    color: 'rgba(255, 255, 255, 0.75) !important',
    backgroundColor: '#131426',
  },
  themeLight: {
    '&.theme--light': {
      '& $historyKeno': {
        color: 'black !important',
      },
    },
  },

  revealedTile: {
    backgroundColor: "#2070DF !important",
    boxShadow: '0px 0.3em #004dba !important',
    transition: "background-color 2s ease",

  },
  
  mineTile: {
    backgroundColor: "#F52B2B !important", // Set background color to red for mine tiles
  },

  tile: {
    backgroundColor: 'rgb(47, 69, 83)',
    boxShadow: '#1a1b33 0px 0.3em',
    color: 'rgb(255, 255, 255)',
    transition: "transform 2s ease",
    filter: "brightness(125%)",
    width: "85px",
    height: "80px",
    backgroundColor: "#101123",
    border: "2px",
    borderRadius: "0.5rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#ffffff",
    fontWeight: 500,
    fontSize: '1.363rem',
    cursor: "pointer",
    "&:hover": {
      filter: "brightness(125%)",

      backgroundColor: "#16172d",
    },
    "&.revealed img": {
      opacity: 1,
    },

    [theme.breakpoints.down("lg")]: {
      width: "50px",
      height: "50px",
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
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "auto",
    marginBottom: "auto",

    backgroundColor: "#0a0b1c", 
    borderRadius: "8px",
        padding: "5px 5px 5px 5px",

    // padding: "5px 15px 15px 15px",
    display: "flex",
    width: "1150px",
    maxWidth: "1180px",
    flexDirection: "column",
    [theme.breakpoints.down("lg")]: {
      width: "78%",
      maxWidth: "1050px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "auto",
    },
  },

  betSection: {
    width: "100%",
    maxWidth: "auto", // Set the maximum width to maintain consistency
    height : "40rem",

    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    // paddingTop: "12px",
    // paddingBottom: "12px",
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
          
    // border: "1px solid #101123",
    borderRadius: "4px",
    paddingRight: "12px",
    paddingLeft: "12px",
    paddingTop: "16px",
    paddingBottom: "16px",
    width: "20.625rem",
    height : "34.5rem",
    backgroundColor: "#0a0b1c",
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
  autoPickButton: {
    background: "#131426",
    borderRadius: 5,
    boxShadow: "0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12)",
    marginBottom: "0.6rem",
    textTransform: "none",
    width: "100%",
    height: "40px",
    padding: "0 30px",
    borderRadius: "4px",
    fontSize: "15px",
    fontWeight: 500,
    color:" #fff",
    border: "none",
    color: "#ffffff",
    transition: "opacity .3s ease",
    fontFamily: "Rubik",
    "&:hover": {
      background: "#131426",
      borderColor: "#1e429f",
      filter: "brightness(130%)",
      cursor: "pointer", // Add cursor property for changing cursor on hover
    },
  },
  limboSection: {
    backgroundColor: "#0a0b1c",
    // borderRadius: "6px",
    padding: "24px",
    borderLeft: "0.120rem solid #1b1c2a",

    display: "flex",
    flexDirection: "column",
    justifyContent: "top",
    alignItems: "center",
    color: "#ffffff", // Set text color to white
    fontSize: "20px", // Increase font size to 24px
    width: "55rem", // Adjust the width as needed

    [theme.breakpoints.down("sm")]: {
      height: "200px",
      flexDirection: "column-reverse", // Reverse column order on Android
  },

    [theme.breakpoints.down("lg")]: {

        width: "100%", // Adjust the width as needed
        maxWidth: "80rem", // Set the maximum width to maintain consistency
        marginLeft: "auto",
        marginRight: "auto",
        
        flexDirection: "column-reverse", // Reverse column order on Android
    },
},

  
  
}));

const Mines = ({ user, isAuthenticated }) => {
  const classes = useStyles();
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(false);
  const initialTiles = Array.from({ length: 40 }, (_, index) => index + 1);
  const [autopickRunning, setAutopickRunning] = useState(false);
  const [numSelectedTiless, setnumSelectedTiless] = useState(0); // State for multiplier

  const [tiles, setTiles] = useState(initialTiles.map(number => ({ number, multiplier: 0, revealed: false })));
  const [selectedBomb, setSelectedBomb] = useState(1);
  const [betAmount, setBetAmount] = useState("0.00");
  const [status, setStatus] = useState("middle");
  const [profit, setProfit] = useState(0); // State for profit
  const [multiplier, setMultiplier] = useState(0); // State for multiplier
  const [loadingTileIndex, setLoadingTileIndex] = useState([]);
  const [cashoutStatus, setCashoutStatus] = useState(false); // State variable for cashout status
  const [cashoutOccurred, setCashoutOccurred] = useState(false); // State to track cashout status
  const [gameEnd, setGameEnd] = useState(false); // Define gameEnd state variable

  const [highlightedTiles, setHighlightedTiles] = useState([]);
  const [selectedTiles, setSelectedTiles] = useState([]);
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
  const handleAutoPick = () => {
    if (autopickRunning) {
      return;
    }
  
    setAutopickRunning(true);
  
    const updatedTiles = tiles.map(tile => ({
      ...tile,
      selected: false,
    }));
  
    const selectedIndices = [];
    while (selectedIndices.length < 10) {
      const rand = Math.floor(Math.random() * 40); // Generate a random number between 0 and 39
      if (!selectedIndices.includes(rand)) {
        selectedIndices.push(rand); // If the selected indices don't include the random number, add it to the selected indices array
      }
    }
  
    // Delay between each selection
    let i = 0;
    const ms = 20; // Delay in milliseconds between each selection
    const times = selectedIndices.length;
  
    const next = () => {
      if (i < times) {
        const index = selectedIndices[i];
        // Select the new tile after a delay
        setTimeout(() => {
          updatedTiles[index].selected = true;
          setTiles([...updatedTiles]);
          const numSelectedTiles = updatedTiles.filter(tile => tile.selected).length; // Calculate the number of selected tiles
          setnumSelectedTiless(numSelectedTiles); // Update the number of selected tiles
          i += 1;
          next(); // Call next recursively
        }, i * ms);
      } else {
        // Set autopickRunning flag back to false once autopick is completed
        setAutopickRunning(false); // Set autopickRunning to false after all selections are made
      }
    };
  
    next(); // Start the autopick process
  };
  
      
  
  

  // Handle bet amount button click
  const handleBetAmountButton = (factor) => {
    const newBetAmount = parseFloat(betAmount) * factor;
    setBetAmount(newBetAmount.toFixed(2));
  };

  const handlePlaceBet = async (amount) => {
    try {
      // Extract the selected numbers
      const selectedNumbers = tiles.filter(tile => tile.selected).map(tile => tile.number);
  
      // Log the selected numbers
      console.log("Selected Numbers:", selectedNumbers);
  
      // Emit the selected numbers along with the amount to the server
      KenoSocket.emit("keno:selectNumbers", { selected: selectedNumbers, amount: betAmount });
    } catch (error) {
      console.error('Error placing bet:', error);
    }
  };
  
  

  

  const handleTileClick = async (index) => {
    // Log all tiles
    console.log("All Tiles:", tiles);
  
    if (!autopickRunning && (status === "inprogress" || status === "middle")) {
      // Check the number of tiles already selected
      const numSelectedTiles = tiles.reduce((count, tile) => (tile.selected ? count + 1 : count), 0);
      console.log("Total selected tiles", numSelectedTiles);
  
      if (numSelectedTiles < 10 || tiles[index].selected) {
        setLoadingTileIndex([index]);
        const newTiles = [...tiles];
        // Toggle the selected state of the clicked tile
        newTiles[index] = { ...newTiles[index], selected: !newTiles[index].selected };
        setTiles(newTiles);
        // Update the count of selected tiles
        setnumSelectedTiless(numSelectedTiles + (newTiles[index].selected ? 1 : -1));
  
        try {
          // Emit an event to reveal or hide the tile based on its current state
          if (newTiles[index].selected) {
            console.log(numSelectedTiles);
            console.log(index);
          } else {
          }
          setTimeout(() => {
            setLoadingTileIndex([]);
          }, 1000);
        } catch (error) {
          console.error('Error revealing/hiding tile:', error);
        }
      } else {
        // If the maximum number of selected tiles is reached and the tile is not already selected, notify the user
        addToast("You can only select up to 10 tiles!", { appearance: "error" });
      }
    } else {
      // If autopick is running, prevent tile selection and notify the user
      addToast("Autopick is running. Please wait until it completes.", { appearance: "warning" });
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
      success(msg);
    });
  
    MinesSocket.on("mines:bet", (msg) => {
      addToast(msg, { appearance: "success" });
    });
  
    MinesSocket.on("mines:gameEnd", async (msg) => {
      if (msg.message === "You revealed a mine! Game over.") {
        setGameEnd(true); // Set gameEnd to true when the game ends

        setTiles(Array(25).fill({ multiplier: 0, revealed: false }));
        setStatus("middle");
        addToast("You revealed a mine! Game over.", { appearance: "error" });
        setProfit("0");
        try {
          const minesreveal = await Getminesreveal();
          const reveal = minesreveal.grid;
          setTiles(reveal);
          console.log(reveal);
          setGameEnd(true); // Set gameEnd to true when the game ends

        } catch (error) {
          console.error("Error fetching mines reveal:", error);
          // Handle error: display message, etc.
        }
      }
    });
      MinesSocket.on("mines:revealAllTiles", (tiles) => {
        const updatedTiles = tiles.map(tile => ({
          ...tile,
          revealed: true,
        }));
        setTiles(updatedTiles);
        // Set cashoutOccurred to true after all tiles are revealed
        setCashoutOccurred(true);
      });
    
    
    
    // Cleanup socket event listeners
    return () => {
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
                          <img src="https://cdn.discordapp.com/attachments/1121562847294533732/1237427396894916658/Vector.png?ex=663b9b91&is=663a4a11&hm=94a8c2b20f5eabd55c81b6da185778819b97ff736816e1d926a3cc953bdb150f&" alt="Money Icon" style={{ width: 16, height: 16 }} />
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

            {status !== "inprogress" && (
  <div>
    <div className={classes.title}>Risk</div>
    <div className={classes.inputContainer}>
      <Box className={classes.placeBet}>
        <Box className={classes.ss}>
          <select
            className={classes.betInputs}
            value={selectedBomb}
            onChange={handleBombChange}
          >
            <option value={1}>Low</option>
            <option value={12}>Medium</option>
            <option value={24}>High</option>
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

<button
  variant="contained"
  color="primary"
  className={classes.autoPickButton}
  onClick={handleAutoPick}
  disabled={autopickRunning} // Add this line to disable the button when autopickRunning is true
>
  Auto Pick
</button>            <Button
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

        {/* Auto Pick button */}








        </div>

        {/* Mines grid */}
        <div className={classes.limboSection}>
{
  cashoutOccurred && !gameEnd && (
    <div className={classes.resultPopup}>
      <Box mt={1} display="flex" alignItems="center" flexDirection="column">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h5" style={{ marginRight: 4 }}>{multiplier.toFixed(2)}x</Typography>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1" style={{ fontSize: '0.9rem', marginRight: 4 }}>{typeof profit === 'number' ? profit.toFixed(2) : profit}</Typography>
          <img src="https://cdn.discordapp.com/attachments/1121562847294533732/1237427396894916658/Vector.png?ex=663b9b91&is=663a4a11&hm=94a8c2b20f5eabd55c81b6da185778819b97ff736816e1d926a3cc953bdb150f&" alt="Money Icon" style={{ width: 16, height: 16 }} />
        </div>
      </Box>
    </div>
  )
}




        <div className={classes.kenocontainer}>
          
        {tiles.map((tile, index) => (
  <motion.div
    key={index}
    initial={{ opacity: 0 }} // Animation initial state
    animate={{ opacity: 1 }}  // Animation end state
    transition={{
      duration: 0.5,           // Duration of the animation
      ease: "easeInOut",       // Easing function for the animation
    }}
    className={`${classes.tile} ${ // Start of the className string
      tile.selected ? "selected" : "" // Conditionally add "selected" class
    } ${
      loadingTileIndex.includes(index) ? classes.tileFetching : "" // Add "tileFetching" if the index is in loadingTileIndex
    } ${
      tile.selected ? classes.revealedTile : "" // Add "revealedTile" if the tile is selected
    } ${
      tile.isMine ? classes.mineTile : "" // Add "mineTile" if the tile is a mine
    } ${tile.clicked ? classes.clickedTile : ""}`} // Add "clickedTile" if the tile was clicked
    onClick={() => handleTileClick(index)} // Handle tile click
  >
    {/* Render the number on the tile */}
    <div>{tile.number}</div>
  </motion.div>
))}
</div>
<Box className={classes.gameHistory}>
  {odds && odds[1 ?? 1] ? (
    <Box className={classes.history}>
      {numSelectedTiless !== 0 && odds[numSelectedTiless ?? 1].map((item, key) => (
        <Box key={key} className={classes.historyKeno}>
          <Box>{item.toFixed(2)}x</Box>
          <Box>
            {key}<i className="fas fa-gem d-none d-lg-inline-block" style={{ position: 'relative', top: '1px', left: "4px" }} />

          </Box>
        </Box>
      ))}
    </Box>
  ) : null}
</Box>


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
