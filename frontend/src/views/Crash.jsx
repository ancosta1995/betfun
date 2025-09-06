import React, { useState, useEffect, Fragment, useRef } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { getCrashSchema, getUserCrashData } from "../services/api.service";
import { crashSocket } from "../services/websocket.service";
import Countdown from "react-countdown";
import PropTypes from "prop-types";
import _ from "underscore";
import parseCommasToThousands from "../utils/parseCommasToThousands";
import cutDecimalPoints from "../utils/cutDecimalPoints";
import coin from "../assets/icons/coin.png";

// MUI Components
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import Tooltip from "@material-ui/core/Tooltip";

//import LinearProgress from "@material-ui/core/LinearProgress";
import {TimerBar} from "./TimerBar.js";

// Icons
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import TrackChangesIcon from "@material-ui/icons/TrackChanges";
import InfoIcon from "@material-ui/icons/Info";
import CasinoIcon from "@material-ui/icons/Casino";
import TimerIcon from '@material-ui/icons/Timer';

//Extra
import { BsFileLock2Fill } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import { GoArrowSwitch } from "react-icons/go";
import { limboSocket } from "../services/websocket.service";
import { useSpring, animated, config } from 'react-spring';
import { ClipLoader } from "react-spinners";
import Provably from "../components/modals/upgrader/ProvablyModal";
import { motion, AnimatePresence } from "framer-motion";
import { getCurrentSeedPair } from "../services/api.service";
import Grow from '@material-ui/core/Grow';
import BettingHistory from "./BettingHistory";

import { BorderLeft, BorderRight } from "@material-ui/icons";
import { BetInput, useStyles } from "./crashstyle"; // Import BetInput and useStyles
import { updateCurrency, DisplayFiat, updateFiat } from "../actions/auth";
import prices from '../components/Prices.json'; // Adjust the path as necessary

// Components
import Bets from "../components/crash/Bets";
import Cup from "../components/crash/Cup";
import HistoryEntry from "../components/crash/HistoryEntry";

// Assets
//import timer from "../assets/timer.png";

import placebet from "../assets/placebet.wav";
import error from "../assets/error.wav";
import success from "../assets/success.wav";
import crash from "../assets/crash.wav";

// Custom Styled Component

const TargetInput = withStyles({
  root: {
    
    marginTop: "auto",
    marginRight: 10,
    marginLeft: 10,
    maxWidth: 120,
    minWidth: 100,
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
      background: "#101123",
      height: "2.25rem",
      borderRadius: 4,
    },
  },
})(TextField);



// Renderer callback with condition
const renderer = ({ minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return "";
  } else {
    // Render a countdown
    return ` ${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  }
};

// Same game states as in backend
const GAME_STATES = {
  NotStarted: 1,
  Starting: 2,
  InProgress: 3,
  Over: 4,
  Blocking: 5,
  Refunded: 6,
};

const BET_STATES = {
  Playing: 1,
  CashedOut: 2,
};
const Crash = (props) => {

  const { user, isAuthenticated, selectedCurrency, selectedLogo, selectedFiatCurrency, DisplayFiat, updateCurrency, updateFiat, DisplayForFiat } = props;
// Declare State
  const classes = useStyles();
  const { addToast } = useToasts();

  const [gameState, setGameState] = useState(1);
  const [gameId, setGameId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [betting, setBetting] = useState(false);
  const [plannedBet, setPlannedBet] = useState(false);
  const [ownBet, setOwnBet] = useState(null);
  const [autoCashoutEnabled, setAutoCashoutEnabled] = useState(false);
  const [autoBetEnabled, setAutoBetEnabled] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);
  const [history, setHistory] = useState([]);
  const [players, setPlayers] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [payout, setPayout] = useState(1);
  const [betAmount, setBetAmount] = useState("1.00");
  const [target, setTarget] = useState("2");
  const [privateHash, setPrivateHash] = useState(null);
  const [publicSeed, setPublicSeed] = useState(null);
  const [maxProfit, setMaxProfit] = useState(0);
  const [startedAt, setstartedAt] = useState(null);
  const logoUrl = DisplayForFiat
  ? `https://shuffle.com/icons/fiat/${selectedFiatCurrency}.svg`
  : selectedLogo;

  // Add elapsed time state
  const [elapsedTime, setElapsedTime] = useState(0);

  const [countdown, setCountdown] = useState(0);

  const updateCountdown = (timeLeft) => {
    setCountdown(timeLeft);
  };

  // Add new player to the current game
  const addNewPlayer = player => {
    setPlayers(state => [...state, player]);
  };

  // Button onClick event handler
  const clickBet = () => {
    if (parseFloat(betAmount) <= 0) return;

    if (gameState === GAME_STATES.Starting) {
      setJoining(true);

      // Emit new bet event with currency
      crashSocket.emit(
        "join-game",
        autoCashoutEnabled ? parseFloat(target) * 100 : null,
        parseFloat(betAmount),
        selectedCurrency
      );
    } else {
      if (plannedBet) {
        setPlannedBet(false);
      } else if (!autoBetEnabled) {
        setPlannedBet(true);
      }
    }
  };

  const clickCashout = () => {
    // Emit bet cashout
    crashSocket.emit("bet-cashout");
  };

  // TextField onChange event handler
  const onBetChange = e => {
    setBetAmount(e.target.value);
  };

  const onTargetChange = e => {
    setTarget(e.target.value);
  };

  const handleAutoCashoutChange = e => {
    if (!betting || cashedOut) setAutoCashoutEnabled(e.target.checked);
  };

  const handleAutoBetChange = e => {
    setAutoBetEnabled(e.target.checked);
    setPlannedBet(false);
  };

  // Add game to history
  const addGameToHistory = game => {
    setHistory(prevHistory => {
      // Check if game already exists in history
      if (prevHistory.some(historyGame => historyGame._id === game._id)) {
        return prevHistory; // Don't add duplicate games
      }
      
      // Add new game and keep last 6
      const newHistory = [...prevHistory, game].slice(-6);
      return newHistory;
    });
  };

  // componentDidMount
  useEffect(() => {
    // Error event handler
    const joinError = msg => {
      setJoining(false);
      addToast(msg, { appearance: "error" });
    };

    // Success event handler
    const joinSuccess = bet => {
      setJoining(false);
      setOwnBet(bet);
      setBetting(true);
      addToast("Successfully joined the game!", { appearance: "success" });
    };

    // Error event handler
    const cashoutError = msg => {
      addToast(msg, { appearance: "error" });
    };

    // Success event handler
    const cashoutSuccess = () => {
      addToast("Successfully cashed out!", { appearance: "success" });

      // Reset betting state
      setTimeout(() => {
        setBetting(false);
      }, 1500);
    };

    // New round is starting handler
    const gameStarting = data => {
      // Update state
      setGameId(data._id);
      setStartTime(new Date(Date.now() + data.timeUntilStart));
      setGameState(GAME_STATES.Starting);
      setPrivateHash(data.privateHash);
      setPublicSeed(null);
      setstartedAt(data.startedAt);
      console.log(startedAt)
      setPayout(1);
      setPlayers([]);
      setOwnBet(null);
      setElapsedTime(0); // Reset elapsed time

      if (autoBetEnabled) {
        setJoining(true);

        // Emit new bet event with currency
        crashSocket.emit(
          "join-game",
          autoCashoutEnabled ? parseFloat(target) * 100 : null,
          parseFloat(betAmount),
          selectedCurrency
        );
      } else if (plannedBet) {
        setJoining(true);

        // Emit new bet event with currency
        crashSocket.emit(
          "join-game",
          autoCashoutEnabled ? parseFloat(target) * 100 : null,
          parseFloat(betAmount),
          selectedCurrency
        );

        // Reset planned bet
        setPlannedBet(false);
      }
    };

    // New round started handler
    const gameStart = data => {
      // Update state
      setStartTime(Date.now());
      setGameState(GAME_STATES.InProgress);
      setPublicSeed(data.publicSeed);
      
    };

    // Current round ended handler
    const gameEnd = data => {
      // Update state
      setGameState(GAME_STATES.Over);
      setPayout(data.game.crashPoint);
      setElapsedTime(data.game.elapsed);
      addGameToHistory(data.game);
      setBetting(false);
      setCashedOut(false);
    };

    // New game bets handler
    const gameBets = bets => {
      _.forEach(bets, bet => addNewPlayer(bet));
    };

    // Modify betCashout handler to update players directly
    const betCashout = bet => {
      // Check if user exists and if local user cashed out
      if (user && bet.playerID === user._id) {
        setCashedOut(true);
        setOwnBet(Object.assign(ownBet, bet));
      }

      // Update players array directly
      setPlayers(prevPlayers => {
        const updatedPlayers = [...prevPlayers];
        const playerIndex = updatedPlayers.findIndex(p => p.playerID === bet.playerID);
        
        if (playerIndex !== -1) {
          updatedPlayers[playerIndex] = {
            ...updatedPlayers[playerIndex],
            ...bet
          };
        }

        return updatedPlayers;
      });
    };

    // Current round tick handler
    const gameTick = (data) => {
      if (gameState !== GAME_STATES.InProgress) return;
      
      // Calculate elapsed time based on startedAt timestamp
      const currentElapsed = Date.now() - data.startedAt;
      setElapsedTime(currentElapsed);
      
      // Update payout
      if (typeof data.payout === 'number') {
        setPayout(data.payout);
      }
    };
    
    // Listeners
    crashSocket.on("game-starting", gameStarting);
    crashSocket.on("game-start", gameStart);
    crashSocket.on("game-end", gameEnd);
    crashSocket.on("game-tick", gameTick);
    crashSocket.on("game-bets", gameBets);
    crashSocket.on("bet-cashout", betCashout);
    crashSocket.on("game-join-error", joinError);
    crashSocket.on("game-join-success", joinSuccess);
    crashSocket.on("bet-cashout-error", cashoutError);
    crashSocket.on("bet-cashout-success", cashoutSuccess);

    return () => {
      // Remove Listeners
      crashSocket.off("game-starting", gameStarting);
      crashSocket.off("game-start", gameStart);
      crashSocket.off("game-end", gameEnd);
      crashSocket.off("game-tick", gameTick);
      crashSocket.off("game-bets", gameBets);
      crashSocket.off("bet-cashout", betCashout);
      crashSocket.off("game-join-error", joinError);
      crashSocket.off("game-join-success", joinSuccess);
      crashSocket.off("bet-cashout-error", cashoutError);
      crashSocket.off("bet-cashout-success", cashoutSuccess);
    };
  }, [
    addToast,
    gameState,
    startTime,
    plannedBet,
    autoBetEnabled,
    autoCashoutEnabled,
    betAmount,
    target,
    ownBet,
    user,
    selectedCurrency
  ]);

  useEffect(() => {
    // Fetch crash schema from API
    const fetchData = async () => {
      setLoading(true);
      try {
        const schema = await getCrashSchema();

        console.log(schema);

        // Update state
        setGameId(schema.current._id);
        setPrivateHash(schema.current.privateHash);
        setPublicSeed(schema.current.publicSeed);
        setPlayers(schema.current.players);
        setStartTime(new Date(Date.now() - schema.current.elapsed));
        setHistory(schema.history.reverse());
        setLoading(false);
        setGameState(schema.current.status);
        setMaxProfit(schema.options.maxProfit);
      } catch (error) {
        console.log("There was an error while loading crash schema:", error);
      }
    };

    // Initially, fetch data
    fetchData();

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // Fetch crash schema from API
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getUserCrashData();

        // Update state
        if (data.bet && data.bet.status === BET_STATES.Playing) {
          setBetting(true);
          setOwnBet(data.bet);
        }
      } catch (error) {
        console.log("There was an error while loading crash schema:", error);
      }
    };

    // If user is signed in, check user data
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Socket event handlers
    const gameTick = (data) => {
      if (gameState !== GAME_STATES.InProgress) return;
      
      setPayout(data.payout);
      setstartedAt(data.startedAt);
      setElapsedTime(data.elapsed);
    };

    const gameEnd = ({ game }) => {
      setGameState(GAME_STATES.Over);
      setPayout(game.crashPoint);
      setElapsedTime(game.elapsed);
      addGameToHistory(game);
    };

    crashSocket.on("game-tick", gameTick);
    crashSocket.on("game-end", gameEnd);

    return () => {
      crashSocket.off("game-tick", gameTick);
      crashSocket.off("game-end", gameEnd);
    };
  }, [gameState]);

  // Add these new state variables
  const [selected, setSelected] = useState('manual');
  const [openProvably, setOpenProvably] = useState(false);
  const [tooltip2Open, setTooltip2Open] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [multiplier, setMultiplier] = useState('2.00');
  const [isClicked, setIsClicked] = useState(false);
  const [hotkeysEnabled, setHotkeysEnabled] = useState(false);
  const [serverSeedHashed, setServerSeedHashed] = useState('');
  const [clientSeed, setClientSeed] = useState('');
  const [nonce, setNonce] = useState(0);

  // Add these handler functions
  const handlemanualauto = (type) => {
    if (type === 'Auto') {
      setTooltip2Open(true);
      setTimeout(() => setTooltip2Open(false), 2000);
      return;
    }
    setSelected(type);
  };

  const handleBetAmountButton = (multiplier) => {
    const currentAmount = parseFloat(betAmount) || 0;
    setBetAmount((currentAmount * multiplier).toFixed(2));
  };

  const onMultiplierChange = (e) => {
    const value = e.target.value;
    setMultiplier(value);
    // Validate multiplier range
    const numValue = parseFloat(value);
    setTooltipOpen(numValue < 1.01 || numValue > 1000000);
  };

  const handleButtonClick = () => {
    setIsClicked(!isClicked);
    // Add your fast play logic here
  };

  const handleHotkeysClick = () => {
    setHotkeysEnabled(!hotkeysEnabled);
  };

  const handlecrashbet = () => {
    // Önce oyun durumunu kontrol et
    if (gameState === GAME_STATES.InProgress) {
      addToast("Cannot join while game is in progress", {
        appearance: "error",
      });
      return;
    }

    if (parseFloat(betAmount) <= 0) return;

    if (gameState === GAME_STATES.Starting) {
      setJoining(true);

      // Emit new bet event with currency
      crashSocket.emit(
        "join-game",
        autoCashoutEnabled ? parseFloat(target) * 100 : null,
        parseFloat(betAmount),
        selectedCurrency
      );
    } else {
      if (plannedBet) {
        setPlannedBet(false);
      } else if (!autoBetEnabled) {
        setPlannedBet(true);
      }
    }
  };

  const handleBet = async () => {
    try {
      // Eğer aktif bir oyun varsa ve oyun durumu InProgress ise
      if (gameState === GAME_STATES.InProgress) {
        addToast("Cannot join while game is in progress", {
          appearance: "error",
        });
        return;
      }

      // Eğer zaten bir betimiz varsa
      if (ownBet) {
        addToast("You already have an active bet", {
          appearance: "error",
        });
        return;
      }

      // Mevcut kontroller
      if (!isAuthenticated) {
        addToast("Please login first!", {
          appearance: "error",
        });
        return;
      }

      if (parseFloat(betAmount) <= 0) {
        addToast("Please enter a valid bet amount!", {
          appearance: "error",
        });
        return;
      }

      // ... rest of the existing bet logic ...
    } catch (error) {
      console.error("Bet error:", error);
      addToast("Error placing bet!", {
        appearance: "error",
      });
    }
  };

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
                              <BetInput
                                label=""
                                variant="filled"
                                value="0.00"
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
            
            
                        {/* Bet Button / Cashout Button */}
                        {gameState === GAME_STATES.InProgress && betting && !cashedOut ? (
                          <motion.div
                            className={`${classes.limboButton}`}
                            onClick={clickCashout}
                            whileTap={{ scale: 0.97 }}
                            animate={{ filter: 'brightness(100%)' }}
                            whileHover={{ filter: 'brightness(110%)' }}
                            style={{
                              background: 'linear-gradient(90deg, rgb(108, 51, 255) 0%, rgb(108, 51, 255) 0%, rgb(184, 51, 255) 100%)',
                              backfaceVisibility: 'hidden',
                              willChange: 'transform, filter',
                              cursor: 'pointer',
                              marginTop: '20px'
                            }}
                          >
                            Cashout ({(ownBet.betAmount * payout).toFixed(2)}$)
                          </motion.div>
                        ) : (
                          <motion.div
                            className={`${classes.limboButton} ${loading || tooltipOpen ? classes.limboButtonDisabled : ''}`}
                            onClick={handlecrashbet}
                            whileTap={{ scale: 0.97 }}
                            animate={{ filter: 'brightness(100%)' }}
                            whileHover={{ filter: loading || tooltipOpen ? 'brightness(100%)' : 'brightness(110%)' }}
                            style={{
                              backfaceVisibility: 'hidden',
                              willChange: 'transform, filter',
                              cursor: loading || tooltipOpen ? 'not-allowed' : 'pointer'
                            }}
                          >
                            {loading ? (
                              <ClipLoader
                                color="#fff"
                                loading={true}
                                size={10}
                              />
                            ) : (
                              gameState === GAME_STATES.Starting ? 'Place Bet' : 'Bet'
                            )}
                          </motion.div>
                        )}
            
            
            
            <Bets
                        players={players}
                        gameState={gameState}
                        payout={payout}
                        selectedCurrency={selectedCurrency}
                        selectedLogo={selectedLogo}
                        DisplayFiat={DisplayFiat}
                        DisplayForFiat={DisplayForFiat}
                      />

            
                      </div>
            
                      {/* Active Bets List */}
            
                      {/* Limbo Section */}
                      <div className={classes.limboSection}>
                        <div className={classes.historyContainer}>
                          <AnimatePresence mode="popLayout" initial={false}>
                            {history.slice(-4).map((game, index) => (
                              <motion.div
                                key={game._id}
                                initial={{ 
                                  opacity: 0, 
                                  x: 50,
                                  scale: 0.8 
                                }}
                                animate={{ 
                                  opacity: 1, 
                                  x: 0,
                                  scale: 1
                                }}
                                exit={{ 
                                  opacity: 0, 
                                  x: -50,
                                  scale: 0.8,
                                  position: 'absolute'
                                }}
                                transition={{ 
                                  type: "spring",
                                  stiffness: 400,
                                  damping: 25,
                                  mass: 0.8,
                                  velocity: 2
                                }}
                                layout="position"
                                className={classes.historyItem}
                                style={{ 
                                  backgroundColor: game.crashPoint >= 2 ? '#1f3229' : '#3a2129',
                                  color: game.crashPoint >= 2 ? '#00e258' : '#ff4444',
                                  flexShrink: 0
                                }}
                              >
                                {game.crashPoint.toFixed(2)}x
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>

                        <Cup
                          loading={loading}
                          payout={payout}
                          startedAt={startedAt}
                          elapsedTime={elapsedTime}
                          ownBet={ownBet}
                          gameState={gameState}
                          countdown={countdown}
                          startTime={startTime}
                          setGameState={(state) => setGameState(state)}
                          updateCountdown={updateCountdown}
                        />

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
                  
                  <div className="mt-4">
                    <BettingHistory gameType="crash" />
                  </div>

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

const mapStateToProps = state => ({
  user: state.auth.user,
  isAuthenticated: state.auth.isAuthenticated,
  selectedCurrency: state.auth.selectedCurrency, // Make sure these match your Redux state
  selectedLogo: state.auth.selectedLogo,
  selectedFiatCurrency: state.auth.selectedFiatCurrency, // Ensure these match your Redux state
  DisplayFiat: state.auth.DisplayFiat, // Ensure these match your Redux state
  DisplayForFiat: state.auth.DisplayForFiat, // Ensure these match your Redux state
});

export default connect(mapStateToProps, { updateFiat, DisplayFiat })(Crash);
