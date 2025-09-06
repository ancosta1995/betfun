import React, { useState, useEffect } from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core";
import { useHistory } from 'react-router-dom';
import { useToasts } from "react-toast-notifications";
import CountUp from 'react-countup';
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { chatSocket } from "../../services/websocket.service";
import Background1 from "../../assets/home/Background1.png";
import RainCAPTCHA from "../modals/rain/RainModal";
import { getChatData } from "../../services/api.service";
import coin from "../../assets/icons/coin.png";
import Skeleton from "@material-ui/lab/Skeleton";
import TipRainModal from "../modals/rain/TipRainModal";
import logos from "../../assets/betbase.png";
import { themeConfig } from '../../config/config';  // Adjust the path if necessary
import ton from "../../assets/coin/ton.svg";
import trx from "../../assets/coin/trx.svg";
import usd from "../../assets/fiat/usd.svg";
import { useDispatch } from 'react-redux';
import { toggleChat } from '../../actions/chatActions';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2),
    backgroundColor: '#0A0B1C',
  },
  rainbutton: {
    background: "#1d2834",
    border: "1px solid #1d2834",
    display: "flex",
    padding: "5px 9px 6px 11px",
    minWidth: "0",
    minHeight: "0",
    flexShrink: "0",
    marginRight: "4px",
    marginTop: "2px",
    borderRadius: "50%",
    "& .MuiButton-startIcon": {
      marginLeft: "-3px",
      marginRight: "-1px",
      marginTop: "2px",
      marginBottom: "2px",
    },
    "&:hover": {
      background: "#1d2834",
      border: "1px solid #1d3a4b",
      cursor: "pointer",
    },
  },
  racebutton: {
    background: "#1d3428",
    border: "1px solid #1d3428",
    display: "flex",
    padding: "7px 10px 7px 12px",
    minWidth: "0",
    minHeight: "0",
    flexShrink: "0",
    marginLeft: "5px",
    marginRight: "4px",
    marginTop: "2px",
    borderRadius: "50%",
    "& .MuiButton-startIcon": {
      marginLeft: "-3px",
      marginRight: "-1px",
      marginTop: "2px",
      marginBottom: "2px",
    },
    "&:hover": {
      background: "#1d3432",
      border: "1px solid #285a31",
      cursor: "pointer",
    },
  },
  onlineOrNot1: {
    marginTop: "0px"
  },
  onlineOrNot2: {
    // marginTop: "180px",
    [theme.breakpoints.down("xs")]: {
      marginTop: "0px"
    },
    [theme.breakpoints.down("sm")]: {
      marginTop: "0px"
    },
    [theme.breakpoints.down("md")]: {
      marginTop: "0px"
    },
  },
  user: {
    display: "flex",
    alignItems: "center",
    gridGap: "16px",
    borderRadius: "5px",
    color: "#5b6368",
    textDecoration: "none",
  },
  pfp: {
    // padding: "1rem 0rem 0rem 1.5rem",
    outline: "none",
    display: "flex",
    "& div": {
      outline: "none",
      height: "2.5rem",
      width: "2.5rem",
      borderRadius: "100%",
    },
  },
  avatar2: {
    outline: "none",
    "&:hover": {
      transition: "all 400ms",
      transform: "scale(1.06)",
      WebkitTransform: "scale(1.06)",
    },
  },
  price: {
    fontFamily: "Poppins",
    color: "hsl(230, 50%, 50%)",
    fontWeight: 500,
    letterSpacing: ".1em",
    margin: "auto",
    position: "absolute",
    marginTop: "-1px",
  },
  pfpp: {
    marginLeft: "45px",
    "& div": {
      height: "2.5rem",
      width: "2.5rem",
      borderRadius: "100%",
    },
    "& .usernamenav": {
      color: "#ffc107",
      fontSize: "11px",
      fontFamily: "Poppins",
      fontWeight: 500,
      textTransform: "uppercase",
    },
    "& .levelnav": {
      color: "#fff",
      fontSize: "11px",
      fontFamily: "Poppins",
      fontWeight: 500,
      textTransform: "uppercase",
      padding: "5px",
      marginLeft: "15px",
      borderRadius: "5px",
    },
    "& .levelnav:hover": {
      color: "#fff",
      filter: "drop-shadow(0px 0px 15px #2b2f34) invert(0%)",
    },
    "& .nonenav": {
      color: "#d5d6d8",
      fontSize: "11px",
      fontFamily: "Poppins",
      fontWeight: 500,
      textTransform: "uppercase",
    },
    "& .bronzenav": {
      color: "#C27C0E",
      fontSize: "11px",
      fontFamily: "Poppins",
      fontWeight: 500,
      textTransform: "uppercase",
    },
    "& .silvernav": {
      color: "#95A5A6",
      fontSize: "11px",
      fontFamily: "Poppins",
      fontWeight: 500,
      textTransform: "uppercase",
    },
    "& .goldnav": {
      color: "#b99309",
      fontSize: "11px",
      fontFamily: "Poppins",
      fontWeight: 500,
      textTransform: "uppercase",
    },
    "& .diamondnav": {
      color: "#3498DB",
      fontSize: "11px",
      fontFamily: "Poppins",
      fontWeight: 500,
      textTransform: "uppercase",
    },
  },
  logoImage: {
    alignContent: "center",
    height: "100%",
  },
  header: {
    zIndex: 100,
    backgroundColor: "#101123",
    width: "100% - 2rem",
    padding: "1rem",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    margin: "1rem",
    borderRadius: "3px",
    alignItems: "center"
  },
  rainContainer: {
    display: "flex",
    flexDirection: "column",
    color: "#fff"
  },
  giveawayContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100% - 2rem",
    padding: "1rem",
  },
  giveaway: {
    zIndex: 100,
    backgroundColor: "#202229",
    width: "100%",
    padding: "0.5rem 1rem 1rem 1rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: "3px 3px 0px 0px",
  },

  giveawayImage: {
    height: 100,
    width: 100
  },
  coinflip: {
    width: "85px",
    padding: "5px 0px",
    flexShrink: 0,
    borderRadius: "100px",
    background: "#00A0FF",
    textAlign: "center",
    fontWeight: 600,
    marginRight: "0.5rem",
    fontSize: "13px",
    cursor: "pointer"
  },
  jackpot: {
    width: "85px",
    padding: "5px 0px",
    flexShrink: 0,
    borderRadius: "100px",
    background: "#FCBF2D",
    textAlign: "center",
    fontWeight: 600,
    fontSize: "13px",
    cursor: "pointer"
  },
  gem: {
    height: "20px",
    width: "20px",
    display: "block",
    top: "-1px",
    position: "relative",
    marginRight: "0.2rem",
  },
  captcha: {
    padding: "0.5rem 0",
    position: "absolute",
    zIndex: 100,
    transition: "all .3s ease",
    userSelect: "none"
  },

  rainBox: {
    position: "relative",
    background: "#1a1b33",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.5rem 0.75rem",
    borderRadius: "0.25rem",

  },
  rainText: {
    background: "linear-gradient(90deg, rgb(227, 200, 94) 10%, rgb(220, 205, 150) 113.43%) text",
    backgroundClip: "text",
    ["-webkit-background-clip"]: "text",
    color: "#fff",
    fontWeight: 500,
    fontSize: "12px",
    
  },
  rainDescription: {
    fontWeight: 500,
    color: "#9E9FBD",
    fontSize: "10px",
    display: "flex",
    alignItems: "center",
    gap: "0.3rem"
  },
  chatHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
    height: '60px',
    width: "100%",
    backgroundColor: themeConfig.secondbackground,
    borderBottom: themeConfig.secondborder,
  },
  chatTitle: {
    fontSize: '16px',
    fontWeight: 500,
    color: '#fff',
  },
  closeButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '32px',
    height: '32px',
    backgroundColor: '#1a1b33',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#2a2b43',
      transform: 'scale(1.05)',
    },
    '&:active': {
      transform: 'scale(0.95)',
    },
  },
  closeIcon: {
    width: '16px',
    height: '16px',
    color: '#ffffff',
  },

  rainAmount: {
    borderTopLeftRadius: "0.25rem",
    borderBottomLeftRadius: "0.25rem",
    height: "fit-content",
    background: "#050614",
    display: "flex", 
    fontWeight: 500,
    fontSize: "12px",
    alignItems: "center", 
    justifyContent: "center",
    gap: "0.3rem", 
    padding: "0.5rem 0.75rem",
    color: "#fff",
    [theme.breakpoints.down("sm")]: {

    },
    [theme.breakpoints.down("md")]: {

    },
  },
  tipRainButton: {
    borderTopRightRadius: "0.25rem",
    borderBottomRightRadius: "0.25rem",
    color: "#fff",
    backgroundColor: "hsl(251.31deg 75% 50%)",
    display: "flex", 
    fontWeight: 500,
    fontSize: "12px",
    alignItems: "center", 
    gap: "0.25rem", 
    padding: "0.5rem 0.75rem",
    cursor: "pointer", 
    userSelect: "none"
  },
  joinButton: {
    position: "fixed",
    fontWeight: 500,
    width: "100%",
    padding: "0.5rem 0.75rem",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    display: "flex",
    background: themeConfig.secondbutton,
    filter: "invert(46%) sepia(88%) saturate(1939%) hue-rotate(180deg) brightness(100%) contrast(101%)", // Apply color filter to the image on hover

    color: "#fff",
    backgroundSize: "cover", 
    backgroundPosition: "right",
    borderRadius: "0.25rem",
    cursor: "pointer",
    userSelect: "none",
    left: 0,
    bottom: "-2.75rem",
    zIndex: 100
  },
}));

function CountdownTimer({ seconds }) {
  const [time, setTime] = useState(seconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = timeInSeconds => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return <div style={{color: "rgba(255, 255, 255, 0.50)", textAlign: "center", marginTop: "0.5rem"}}>{formatTime(time)}</div>;
}

const Header = ({ isAuthenticated, isLoading, user, giveaway, toggleChat, setMobile }) => {
  const classes = useStyles();
  const history = useHistory();
  const { addToast } = useToasts();

  const [loading, setLoading] = useState(true);
  const [usersOnline, setUsersOnline] = useState("0");
  const [previousTotal, setPreviousTotal] = useState(0);
  const [currentTotal, setCurrentTotal] = useState(0);
  const [openRain, setOpenRain] = useState(false);
  const [rain, setRain] = useState(null);
  const [openTipRain, setOpenTipRain] = useState(false);
  
  const rainStateChanged = newState => {
    setRain(newState);
  };

  const updateRainAmount = (newAmount) => {
    setPreviousTotal(currentTotal);
    setCurrentTotal(newAmount); 
  };

  const updateUsersOnline = newCount => {
    setUsersOnline(newCount);
  };

  const onChange = value => {
    chatSocket.emit("enter-rain", value);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getChatData();
      setRain(response.rain);
      setLoading(false);
    } catch (error) {
      console.log("There was an error while fetching chat messages:", error);
    }
  };

  useEffect(() => {
    fetchData(); 

    const onError = message => {
      setLoading(false);
      addToast(message, { appearance: "error" });
      setOpenRain(state => !state);
    };

    const onSuccess = message => {
      setLoading(false);
      addToast(message, { appearance: "success" });
      setOpenRain(state => !state);
    };

    chatSocket.on("rain-update-amount", updateRainAmount);
    chatSocket.on("users-online", updateUsersOnline);
    chatSocket.on("rain-join-error", onError);
    chatSocket.on("rain-join-success", onSuccess);
    chatSocket.on("rain-state-changed", rainStateChanged);
    return () => {
      chatSocket.off("rain-update-amount", updateRainAmount);
      chatSocket.off("users-online", updateUsersOnline);
      chatSocket.off("rain-join-error", onError);
      chatSocket.off("rain-join-success", onSuccess);
      chatSocket.off("rain-state-changed", rainStateChanged);
    };
  }, [addToast]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (rain && rain.joinable) {
        setRain(prevState => ({
          ...prevState,
          timeLeftToJoin: prevState.timeLeftToJoin - 1000,
        }));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [rain]);

  const formatTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = ((milliseconds % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleCloseChat = () => {
    if (typeof setMobile === 'function') {
      setMobile(false);
    }
    toggleChat(false);
  };

  return (
    <Box>
      <Box className={classes.chatHeader}>
        <span className={classes.chatTitle}>Chat</span>
        <button 
          type="button" 
          className={classes.closeButton}
          onClick={handleCloseChat}
        >
          <svg viewBox="0 0 18 19" xmlns="http://www.w3.org/2000/svg" className={classes.closeIcon}>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2.533 3.032a.964.964 0 0 1 1.363 0l5.108 5.1 5.1-5.109a.964.964 0 1 1 1.365 1.363l-5.1 5.108 5.108 5.1a.964.964 0 0 1-1.363 1.364l-5.108-5.1-5.1 5.108a.964.964 0 1 1-1.364-1.362l5.1-5.108-5.108-5.1a.964.964 0 0 1-.001-1.364Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </Box>
      <Box  style={{ backgroundColor: 'transparent',         padding: "1rem"}}> 
        {loading ? (
          <Skeleton animation="wave" height={100} width={'100%'} />
        ) : (
          <>
            <RainCAPTCHA
              open={openRain}
              handleClose={() => setOpenRain((state) => !state)}
              onChange={onChange}
              loading={loading}
            />
            <TipRainModal open={openTipRain} handleClose={() => setOpenTipRain((state) => !state)} />
            <motion.div className={classes.rainBox}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div className={classes.rainText}>Live rain</div>
                <div className={classes.rainDescription}>
                  {rain.joinable ? (
                    <>join in: {formatTime(rain.timeLeftToJoin)}</>
                  ) : (
                    <>
                      <svg
                        style={{ height: 12, width: 12, fill: 'currentColor' }}
                        tabIndex="-1"
                        viewBox="0 0 512 512"
                      >
                        <path d="M416 128c-.6 0-1.1.2-1.6.2 1.1-5.2 1.6-10.6 1.6-16.2 0-44.2-35.8-80-80-80-24.6 0-46.3 11.3-61 28.8C256.4 24.8 219.3 0 176 0 114.1 0 64 50.1 64 112c0 7.3.8 14.3 2.1 21.2C27.8 145.8 0 181.5 0 224c0 53 43 96 96 96h320c53 0 96-43 96-96s-43-96-96-96zM48 368c-8.8 0-16 7.2-16 16v80c0 8.8 7.2 16 16 16s16-7.2 16-16v-80c0-8.8-7.2-16-16-16zm96 32c-8.8 0-16 7.2-16 16v80c0 8.8 7.2 16 16 16s16-7.2 16-16v-80c0-8.8-7.2-16-16-16zm96-32c-8.8 0-16 7.2-16 16v80c0 8.8 7.2 16 16 16s16-7.2 16-16v-80c0-8.8-7.2-16-16-16zm96 32c-8.8 0-16 7.2-16 16v80c0 8.8 7.2 16 16 16s16-7.2 16-16v-80c0-8.8-7.2-16-16-16z" />
                      </svg>
                      every 5 min
                    </>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex' }}>
                <motion.div className={classes.rainAmount}>
                  <img style={{ height: 14, width: 14, marginBottom: '0.1rem',  }} src={usd} alt="coin" />
                  <CountUp delay={0} duration={0.5} decimals={2} start={previousTotal} end={currentTotal} />
                </motion.div>
                <motion.div
                  whileTap={{ scale: 0.97 }}
                  className={classes.tipRainButton}
                  onClick={() => setOpenTipRain((state) => !state)}
                >
                  +
                </motion.div>
              </div>
              {rain.joinable ? (
                <motion.div
                  whileTap={{ scale: 0.97 }}
                  style={{
                    filter: rain.players.includes(user?._id) ? 'brightness(75%)' : 'brightness(100%)',
                    cursor: rain.players.includes(user?._id) ? 'not-allowed' : 'cursor',
                    pointerEvents: rain.players.includes(user?._id) ? 'none' : 'all',
                  }}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className={classes.joinButton}
                  onClick={() => setOpenRain(!openRain)}
                >
                  {rain.players.includes(user?._id) ? 'Joined' : 'Join'}
                </motion.div>
              ) : null}
            </motion.div>

          </>
        )}
      </Box>
    </Box>
  );
};

Header.propTypes = {
  isAuthenticated: PropTypes.bool,
  isLoading: PropTypes.bool,
  user: PropTypes.object,
  setMobile: PropTypes.func,
  toggleChat: PropTypes.func,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading,
  user: state.auth.user,
});

export default connect(mapStateToProps, { toggleChat })(Header);
