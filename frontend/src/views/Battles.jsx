import React, { useState, useEffect, Fragment } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { getActiveBattlesGame } from "../services/api.service";
import { battlesSocket } from "../services/websocket.service";
import Countdown from "react-countdown";
import PropTypes from "prop-types";
import _, { create, findLastIndex } from "underscore";
import parseCommasToThousands from "../utils/parseCommasToThousands";
import cutDecimalPoints from "../utils/cutDecimalPoints";
import { useHistory } from 'react-router-dom';
import CircularProgress from "@material-ui/core/CircularProgress";
import { motion, AnimatePresence } from "framer-motion";

import Tooltip from "@material-ui/core/Tooltip";
import CreateBattle from "../components/battles/CreateBattle";
import Box from "@material-ui/core/Box";

import coin from "../assets/icons/coin.png";

// components
import Preloader from "../Preloader";
import { Grow, Slide } from "@material-ui/core";

const ColorCircularProgress = withStyles({
  root: {
    color: "#fff !important",
  },
})(CircularProgress);

const useStyles = makeStyles(theme => ({
  root: {
    color: "#fff",
    fontFamily: "Poppins",
    overflowY: "scroll",
    scrollbarWidth: "none",
    height: "100%",
    width: "100%",
    maxWidth: "1250px",
    margin: "0 auto",
    [theme.breakpoints.down("xs")]: {
      height: "170%",
    },
    [theme.breakpoints.down("sm")]: {
      height: "170%",
    },
    [theme.breakpoints.down("md")]: {
      height: "calc(100% + 80%)",
    },
  },

  topBar: {
    width: "100%",
    margin: "0 auto 0.5rem auto",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    gap: "0.5rem",
    [theme.breakpoints.down("xs")]: {
      display: "flex",
      flexDirection: "column"
    },
  },
  topBarContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    margin: "0.5rem 0 1rem 0"
  },
  left: {
  },
  right: {
    display: "flex",
  },
  counterWhite: {
    color: "#fff",
    borderRight: "2px solid hsla(0,0%,100%,.5)",
    paddingRight: "1rem",
    fontWeight: 500,
  },
  counterGreen: {
    paddingLeft: "1rem",
    marginRight: ".5rem",
    color: "#FFC440",
    fontWeight: 500,
  },
  rowBattleList: {
    
  },
  rowOverview: {
    color: "#fff",
    textAlign: "center",
    fontSize: ".9rem",
    letterSpacing: "1px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
  },  
  roundsCol: {
    display: "flex",
    width: "9.5rem"
  },
  casesCol: {
    width: "100%",
    padding: 0,
    margin: 0,
  },
  priceCol: {
    display: "flex",
    width: "8rem"
  },
  playersCol: {
    margin: "auto",
    marginRight: "3rem"
  },
  statusCol: {
    display: "flex",
    width: "10rem",
    marginRight: "1.25rem",
    justifyContent: "flex-end",
  },
  noGames: {
    display: "flex",
    flexDirection: "column",
    height: "40rem",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
  },
  container: {
    width: "100%",
    minHeight: "32.5rem",
    paddingTop: 50,
    paddingBottom: 120,
    [theme.breakpoints.down("sm")]: {
      paddingTop: 25,
    },
    "& > div": {
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        margin: "auto",
      },
    },
  },
  a: {
    textDecoration: "none",
    color: "inherit",
    width: "100%",
    color: "#007bff",
    textDecoration: "none",
    backgroundColor: "initial",
  },
  square: {
    border: "1px solid #272847",
    background: "#050614",
    borderRadius:" 4px",
    width: "4rem",
    height: "4rem",
    margin: "auto",
  },
  number: {
    color: "#fff",
    display: "block",
    margin: "auto 0",
    textAlign: "center",
    padding: "calc(1rem - 2px)",
    lineHeight: "2rem",
    fontSize: "1.4rem",
    fontWeight: 500,
  },
  text: {
    color: "#838b8d",
    display: "block",
    margin: "6px 0 auto",
    textAlign: "center",
  },
  svgDot: {
    position: "absolute",
    top: 0,
    right: "15%",
    width: "2rem",
    ["-webkit-animation"]: "blink-b4490708 1.25s infinite",
    animation: "blink-b4490708 1.25s infinite",
    transition: "all .25s ease-in-out",
  },
  caseDisplay: {
    background: "#050614",
    borderRadius: "4px",
    overflow: "hidden",
    gridArea: "cases",
    padding: "8px 0",
    flexBasis: 0,
    flexGrow: 1,
    maxWidth: "100%",
    width: "100%"
  },
  caseRight: {
    background: "linear-gradient(90deg,rgba(21,23,25,.8),rgba(31,34,37,0))",
    borderRadius: "4px 0 0 4px",
    ["-webkit-transform"]: "matrix(-1,0,0,1,0,0)",
    transform: "matrix(-1,0,0,1,0,0)",
    height: "100%",
    width: "30%",
    right: "-1px",
    position: "absolute",
    zIndex: 1,
    top: 0,
  },
  scroller: {
    //overflowY: "scroll",
    height: "100%",
  },
  caseList: {  
    display: "flex",
    height: "100%",
    width: "100%",
    flexWrap: "nowrap",
    alignItems: "center",
    padding: 0,
    margin: 0,
  },
  newPrice: {
    display: "block",
    textAlign: "center",
    fontWeight: 500,
    fontSize: "1.15rem",
    margin: "auto",
    marginLeft: "auto",
    marginLeft: "1rem",
  },
  newPriceWrapper: {
    display: "inline-flex",
    alignItems: "baseline",
    color: "#eee !important",
  },
  newPriceWrapperImg: {
    display: "flex",
    alignItems: "center",
    position: "relative",
    height: "1rem",
    width: "1rem",
    marginRight: "6px",
  },
  imageCol: {
    boxShadow: "0 0 0 1px #272847",
    background: "#fff",
    borderRadius: "4px",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    height: "24px",
    width: "24px",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonGreenStripe: {
    fontWeight: 600,
    textTransform: "uppercase",
    padding: ".5rem 1.75rem",
    border: "1px solid #4ea24d",
    background: "#4ea24d",
    backgroundImage: "none",
    backgroundSize: "auto",
    backgroundColor: "#4ea24d",
    color: "#fff",
    fontSize: ".95rem",
    borderRadius: "4px",
    letterSpacing: "1px",
    cursor: "pointer",
    marginLeft: "1.25rem",
    transition: "all .15s ease-in-out",
    verticalAlign: "middle",
    display: "inline-block",
    boxSizing: "border-box"
  },
  noOne: {
    background: "#1a1d20;",
    border: "1px dashed rgba(239,250,251,.2)",
    borderRadius: "4px",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    height: "24px",
    width: "24px",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.5,
    cursor: "pointer"
  },
  activeBattle: {
    border: "none",
  },
  topBarLeft:  {
    display: "flex",
    marginRight: "32px",
    flexShrink: 0,
  },
  topBarRight: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "flex-end",
  },
  topBar2: {
    display: "flex",
    alignItems: "center",
    marginBottom: "40px",
  },
  optionButton: {
    padding: "11px 16px",
    fontWeight: 400,
    lineHeight: "130%",
    letterSpacing: ".1px",
    color: "#fff",
    transition: "all .2s ease",
    whiteSpace: "nowrap",
    cursor: "pointer",
    textDecoration: "none",
    border: "none",
    background: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": {
      filter: "brightness(130%)",
    }
  },
  button: {  
    textTransform: "none",
    width: "100px",
    padding: "0 16px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: "8px",
    borderRadius: "4px",
    fontSize: "15px",
    fontWeight: 400,
    color: "rgba(239,250,251,.72)",
    background: "#101123",
    transition: "all .3s ease",
    fontFamily: "Poppins",
    border: "1px solid #161D26",
    backgroundSize: "24px auto",
    height: "42px",
  },
  selected: {
    color: "#effafb",
    background: "#2a2a38",
    border: "2px solid #FFC440 !important",
  },
  selected2: {
    color: "#effafb",
    background: "#2a2a38",
    border: "2px solid #FFC440 !important",
  },
  box: {
    color: "hsl(220, 22%, 100%) !important",
    backgroundColor: "#101123",
    flex: 1,
    border: "1px solid transparent",
    height: "auto",
    paddingTop: "1em",
    paddingBottom: "1em",
    display: "inline-flex",
    outline: "none",
    padding: "0 0.75em",
    position: "relative",
    alignItems: "center",
    fontWeight: "bold",
    userSelect: "none",
    whiteSpace: "nowrap",
    willChange: "opacity",
    borderRadius: "0.25rem",
    justifyContent: "center",
    transitionDuration: "300ms",
    textDecoration: "none",
    fontWeight: 500,
    [theme.breakpoints.down("xs")]: {
      width: "calc(50% - 0.25rem)",
      flex: "none"
    },
  },
  createBattle: {
    backgroundColor: "hsl(215, 75%, 50%)",
    cursor: "pointer",
    display: "inline-flex",
    outline: "none",
    height: "fit-content",
    padding: "0.75rem",
    alignItems: "center",
    userSelect: "none",
    borderRadius: "0.25rem",
    justifyContent: "center",
    cursor: "pointer",
    fontWeight: 500,
    gap: "0.5rem",
  },
  rowBattleRunning: {
    display: "flex",
    flexDirection: "row",
    position: "relative",
    backgroundColor: "#101123",
    width: "100%",
    borderRadius: "4px",
    border: "1px solid transparent",
    padding: "1rem",
    transition: "all .3s ease-in-out",
    marginBottom: "0.5rem",
    gap: "1.5rem",
    [theme.breakpoints.down("xs")]: {
      gap: ".5rem",
    },
  },
  squareWrapper: {
    display: "flex",
    justifyContent: "center",
    margin: "0.75rem 0 0.5rem 0",
    boxSizing: "border-box",
    [theme.breakpoints.down("xs")]: {
      display: "none"
    },
  },
  rowSquareShort: {
    display: "flex",
    borderRadius: "4px",
    gap: ".4rem",
    alignItems: "center",
    padding: 0,
    margin: 0,
  },
  img:{
    width: "100%",
    position: "absolute",
    height: "24px",
    width: "24px",
  },
  modeBox: {
    backgroundColor: "#0A0B1C",
    display: "flex",
    textAlign: "center",
    borderRadius: "0.25rem",
    color: "#9E9FBD",
    width: "fit-content",
    padding: "0.25rem",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      fontSize: "10px"
    },
  },
  joinBox: {
    backgroundColor: "#0A0B1C",
    display: "flex",
    textAlign: "center",
    borderRadius: "0.25rem",
    color: "#9E9FBD",
    width: "fit-content",
    padding: "0.5rem",
    alignItems: "center",
    cursor: "pointer",
    transitionDuration: "300ms",
    "&:hover": {
      filter: "brightness(140%)"
    }
  },
  case: {
    flexGrow: 0,
    height: 55,
    width: 55,
    minWidth: 55,
    minHeight: 55,
    borderRadius: "0.25rem",
    backgroundColor: "#1a1b33",
    padding: "0.5rem",
    userSelect: "none",
    transition: "all .3s ease-in-out",
  },
  mobilePrice: {
    display: "none",
    [theme.breakpoints.down("xs")]: {
      display: "flex",
    },
  },
  playerBoxMobile: {
    backgroundColor: "#0A0B1C",
    display: "none",
    textAlign: "center",
    borderRadius: "0.25rem",
    color: "#9E9FBD",
    width: "fit-content",
    padding: "0.25rem",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      display: "flex",
    },
  },
  battleCost: {
    display: "flex", 
    gap: "0.5rem",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  roundText: {
    color: "#838b8d" ,
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  firstDivider: {
    width: "30%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("xs")]: {
      fontSize: "10px",
      width: "30%",
    },
  },
  secondDivider: {
    width: "30%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("xs")]: {
      fontSize: "10px",
      width: "40%",
    },
  },
  thirdDivider: {
    width: "30%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("xs")]: {
      fontSize: "10px",
      width: "20%",
    },
  },
  loader: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "25rem",
  },
  rowTop: {
    padding: "1rem 1.5rem",
    borderRadius: "0.5rem",
    margin: 0,
    display: "flex",
    flexWrap: "wrap",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#101123",
    marginBottom: "0.5rem",
    transitionDuration: "300ms",
    cursor: "pointer",
    "&:hover": {
      filter: "brightness(125%)"
    },
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      gap: "1rem"
    },
  },
  topLeftCol: {
    minWidth: 0,
    display: "flex",
    backgroundColor: "#0A0B1C",
    padding: "0.5rem 0.75rem",
    borderRadius: "0.5rem",
    justifyContent: "center",
    minWidth: "115.14px"
  },
  topRightCol: {
    display: "flex",
    flexDirection: "row",
  },
  priceWrapper: {
    display: "inline-flex",
    alignItems: "center",
    color: "#eee !important",
    gap: "0.25rem",
    fontWeight: "550",
  },
  caseViewContainer: {
    display: "flex", 
    alignItems: "center", 
    height: "fit-content", 
    width: "fit-content", 
    justifyContent: "center", 
    padding: "0.5rem", 
    backgroundColor: "#0A0B1C",
    borderRadius: "0.5rem",
    [theme.breakpoints.down("xs")]: {
      width: "100%"
    },
  },
  casesContainer: {
    display: "flex", 
    flexDirection: "row",
    gap: "3px",
    width: 400,
    maxWidth: 400,
    overflow: "hidden",
  },
  case: {
    flexGrow: 0,
    height: 75,
    width: 75,
    minWidth: 75,
    minHeight: 75,
    borderRadius: "0.25rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "#1a1b33",
    padding: "0.5rem",
    userSelect: "none",
    transition: "all .3s ease-in-out",
  },
  crazyBox: {
    backgroundColor: "#13112C",
    color: "#7954E9",
    padding: "0.5rem",
    borderRadius: "0.25rem",
    marginRight: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.3rem",
    "& svg": {
      height: "1rem",
      width: "1rem",
    }
  },
  regularBox: {
    backgroundColor: "#0C132E",
    color: "#2871FF",
    padding: "0.75rem",
    borderRadius: "0.25rem",
    marginRight: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.3rem",
    "& svg": {
      height: "1rem",
      width: "1rem",
    }
  },
}));

const Battles = ({ user, isAuthenticated }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();
  const history = useHistory();

  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState([]);
  const [spinningBattlesCount, setSpinningBattlesCount] = useState(0);
  const [joinableBattlesCount, setJoinableBattlesCount] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);


  // componentDidMount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const fetchedGames = await getActiveBattlesGame();
        
        const sortedGames = fetchedGames.sort((a, b) => {
          if (a.status === 1 && b.status === 2) {
            return -1; 
          } else if (a.status === 2 && b.status === 1) {
            return 1; 
          }
          return 0; 
        });        
        
        setGames(fetchedGames);
    
        let jbc = 0;
        let sbc = 0;
        for (let i = 0; i < fetchedGames.length; i++) {
          if (fetchedGames[i].status === 1) {
            jbc++;
          } else {
            sbc++;
          }
        }
    
        setJoinableBattlesCount(jbc);
        setSpinningBattlesCount(sbc);
    
        setLoading(false);
      } catch (error) {
        console.log("There was an error while loading case battles data:", error);
      }
    };    

    // Initially, fetch data
    fetchData();

    // Error event handler
    const error = msg => {
      addToast(msg, { appearance: "error" });
    };

    // Error event handler
    const success = msg => {
      addToast(msg, { appearance: "success" });
    };

    const newBattle = data => {
      setJoinableBattlesCount(prev => prev + 1);
      setGames(state => (state ? [data, ...state] : null));
    }

    const battlesStart = data => {
      setJoinableBattlesCount(prev => prev-1);
      setSpinningBattlesCount(prev => prev+1);

      setGames(prevGames => {
        const updatedGames = prevGames.map(game => {
          if (game.id === data.battleId) {
            return { ...game, status: 2 };
          }
          return game;
        });
        return updatedGames;
      });
    }

    const battlesRound = data => {
      setGames(prevGames => {
        const updatedGames = prevGames.map(game => {
          if (game.id === data.battleId) {
            return { ...game, casesRoundResults: [...game.casesRoundResults, data.result] };
          }
          return game;
        });
        return updatedGames;
      });
    }

    const battlesJoin = data => {
      setGames(prevGames => {
        const updatedGames = prevGames.map(game => {
          if (game.id === data.battleId) {
            return { ...game, players: data.newPlayers };
          }
          return game;
        });
        return updatedGames;
      });
    }

    const battlesFinised = data => {
      setGames(prevGames => prevGames.filter(game => game.id !== data.battleId));
      setSpinningBattlesCount(prev => prev-1);
    }

    // Listeners
    battlesSocket.on("battles:new", newBattle);
    battlesSocket.on("battles:start", battlesStart);
    battlesSocket.on("battles:round", battlesRound);
    battlesSocket.on("battles:join", battlesJoin);
    battlesSocket.on("battles:finished", battlesFinised);

    return () => {
      // Remove Listeners
      battlesSocket.off("battles:new", newBattle)
      battlesSocket.off("battles:start", battlesStart);
      battlesSocket.off("battles:round", battlesRound);
      battlesSocket.off("battles:join", battlesJoin);
      battlesSocket.off("battles:finished", battlesFinised);
    };
  }, [addToast]);

  const fwd = (item) => {
    history.push(`/battles/${item.id}`);
  };

  const renderGamesBoxes = () => {
    let sortedGames = [...games]; 
    let allBoxes = [];
    try {
      const boxes = sortedGames.map((item, index) => {
        const elements = [];
        for (let i = 1; i < item.playerCount; i++) {
          if (item.players[i]?.id) {
            elements.push(
              <Tooltip
                key={i}
                interactive
                title={
                  <span>
                    {item.players[i].username}
                  </span>
                }
              >
                <div className={classes.imageCol}>  
                  <img className={classes.img} src={item.players[i].pfp} />
                </div>
              </Tooltip>
            );
          } else {
            elements.push(<div key={`player-${i}-${index}`} className={classes.noOne}>+</div>);
          };
        };

        return (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.2 }}
          >
            <div 
              className={classes.rowTop} 
              onClick={() => fwd(item)}
              key={`battle-${index}`}
              style={{
                background: item.status == 2 ? `linear-gradient(45deg, ${item.isCrazyMode ? "#13112C" : "#0C132E"}, #101123 70%)` : ""
              }}
            >
              <div>
                <div className={classes.topLeftCol}>
                  <div className={classes.priceWrapper}>
                    <img style={{height: 14, width: 14}} src={coin} />
                    {parseCommasToThousands((item?.price).toFixed(2))}
                  </div>
                </div>
                <div className={classes.squareWrapper}>
                  <div className={classes.rowSquareShort}>
                    <Tooltip
                      interactive
                      title={
                        <span>
                          {item.players[0].username}
                        </span>
                      }
                    >
                      <div className={classes.imageCol} ><img className={classes.img} src={item.players[0].pfp} /></div>
                    </Tooltip>
                    {elements}
                  </div>
                </div>
              </div>
              <div className={classes.caseViewContainer} >
                <div className={classes.casesContainer}>
                  {item.cases.map((caseItem, index) => (        
                    <img 
                      className={classes.case} 
                      style={{
                        opacity: item.casesRoundResults.length - 1 == index ? 1 : 0.5,
                        transform: `translateX(-${(item.casesRoundResults.length - 1) * 78}px)`,
                      }}
                      src={caseItem.image}
                    />
                  ))}
                </div>
              </div>
              <div className={classes.topRightCol}>
                {item.isCrazyMode ? (
                  <div className={classes.crazyBox}>
                    <svg style={{ height: "1.5rem", width: "1.5rem" }} xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64"><g><g><path d="M53.56,27.37c-0.55,0-1.07,0.15-1.53,0.4c-2.48-1.6-4.8-2.35-6.92-2.55c0.66-1.69,2.18-4.68,4.77-4.75    c0.59,0.58,1.39,0.94,2.28,0.94c1.8,0,3.26-1.47,3.26-3.27c0-1.8-1.46-3.27-3.26-3.27c-0.73,0-1.39,0.24-1.93,0.64    C41.8,11.68,37,15.35,34.57,18.74c-1.27-1.85-2.95-3.58-5.14-4.73c-3.89-2.05-8.58-1.85-13.92,0.59c-0.6-0.64-1.44-1.04-2.38-1.04    c-1.8,0-3.27,1.46-3.27,3.26c0,1.81,1.47,3.27,3.27,3.27c0.87,0,1.66-0.35,2.25-0.9c3.24,0.38,5.06,4.3,5.76,6.23    c-5.15,0.33-9.92,2.71-10.45,2.98c-0.08-0.01-0.17-0.02-0.25-0.02c-1.81,0-3.27,1.46-3.27,3.26c0,1.81,1.46,3.27,3.27,3.27    c0.8,0,1.52-0.3,2.09-0.78l0.69-0.15c1.43-0.22,2.52,0.03,3.34,0.75c1.41,1.22,1.73,3.56,1.8,4.92c-0.43,0.1-0.86,0.19-1.29,0.29    c-0.45,0.11-0.77,0.51-0.77,0.97v6.87c0,0.43,0.28,0.82,0.69,0.95c5.44,1.77,10.92,2.65,16.4,2.65c5.48,0,10.96-0.88,16.4-2.65    c0.42-0.13,0.69-0.52,0.69-0.95v-6.87c0-0.46-0.31-0.86-0.76-0.97c-0.46-0.11-0.93-0.21-1.39-0.31c-0.24-3.66,0.21-6.55,1.2-7.46    c0.2-0.18,0.5-0.36,1.02-0.29c0.49,1.19,1.65,2.02,3.01,2.02c1.81,0,3.27-1.46,3.27-3.26C56.83,28.83,55.37,27.37,53.56,27.37z     M52.16,16.87c0.69,0,1.26,0.57,1.26,1.27c0,0.7-0.57,1.27-1.26,1.27c-0.7,0-1.27-0.57-1.27-1.27    C50.89,17.44,51.46,16.87,52.16,16.87z M10.44,32.91c-0.7,0-1.27-0.57-1.27-1.27c0-0.7,0.57-1.26,1.27-1.26    c0.69,0,1.26,0.56,1.26,1.26C11.7,32.34,11.13,32.91,10.44,32.91z M16.35,17.32c0.02-0.16,0.05-0.32,0.05-0.5    c0-0.14-0.03-0.27-0.04-0.41c4.75-2.16,8.83-2.37,12.13-0.64c5.59,2.94,7.42,10.62,7.71,11.97c-1.77,1.2-3.05,2.56-3.74,3.38    c-0.97-1.86-2.3-3.3-4-4.27c-1.61-0.92-3.4-1.34-5.2-1.44C22.7,23.65,20.68,18.35,16.35,17.32z M48.48,41.71v5.34    c-10.01,3.1-20.16,3.1-30.18,0v-5.34C28.32,39.42,38.47,39.42,48.48,41.71z M50.39,29.88c-0.84-0.01-1.59,0.25-2.21,0.81    c-1.84,1.7-2.03,5.65-1.88,8.52c-4.01-0.75-8.03-1.16-12.05-1.21c-0.15-1.79-0.45-3.41-0.92-4.82c0.05-0.05,0.12-0.09,0.17-0.15    c0.28-0.42,7.06-9.94,17.12-3.79C50.52,29.45,50.45,29.66,50.39,29.88z" fill="currentColor" /></g></g></svg>
                    {item.gameType == 1 ? "1v1" : item.gameType == 2 ? "1v1v1" : item.gameType == 3 ? "1v1v1v1" : item.gameType == 4 ? "2v2" : 0}
                  </div>
                ) : (
                  <div className={classes.regularBox}>
                    <svg fill="currentColor" viewBox="0 0 512.001 512.001" xmlns="http://www.w3.org/2000/svg" width="24" height="24" ><g><path d="m59.603 384.898h45v90h-45z" transform="matrix(.707 -.707 .707 .707 -279.94 183.975)"></path><path  d="m13.16 498.841c17.547 17.545 46.093 17.545 63.64 0l-63.64-63.64c-17.547 17.547-17.547 46.093 0 63.64z"></path><path  d="m384.898 407.398h90v45h-90z" transform="matrix(.707 -.707 .707 .707 -178.07 429.898)"></path><path d="m435.201 498.841c17.547 17.545 46.093 17.545 63.64 0 17.547-17.547 17.547-46.093 0-63.64z"></path><path d="m424.595 360.955-21.213-21.215 31.818-31.818c5.863-5.863 5.863-15.352 0-21.215-5.863-5.861-15.35-5.861-21.213 0l-127.278 127.28c-5.863 5.863-5.863 15.35 0 21.213 5.861 5.863 15.35 5.863 21.213 0l31.82-31.82 21.213 21.213z"></path><path d="m128.722 277.214-19.102 19.102-10.607-10.607c-5.863-5.861-15.35-5.861-21.213 0-5.863 5.863-5.863 15.352 0 21.215l31.82 31.818-22.215 22.215 63.64 63.638 22.213-22.213 31.82 31.82c5.863 5.863 15.352 5.863 21.213 0 5.863-5.863 5.863-15.35 0-21.213l-10.605-10.607 19.102-19.102z"></path><path  d="m497.002.001h-84.853c-3.977 0-7.789 1.575-10.607 4.391l-124.329 124.33 106.066 106.066 124.329-124.331c2.818-2.816 4.393-6.628 4.393-10.605v-84.853c-.001-8.287-6.713-14.998-14.999-14.998z"></path><path d="m110.459 4.392c-2.818-2.816-6.63-4.391-10.607-4.391h-84.853c-8.286 0-14.999 6.711-14.999 14.998v84.853c0 3.977 1.575 7.789 4.393 10.605l271.711 271.713 106.066-106.066z"></path></g></svg>
                    {item.gameType == 1 ? "1v1" : item.gameType == 2 ? "1v1v1" : item.gameType == 3 ? "1v1v1v1" : item.gameType == 4 ? "2v2" : 0}
                  </div>
                )}

                <div className={classes.priceWrapper}>
                  <span style={{color:"#838b8d"}}>Round</span> {item.casesRoundResults.length} <span style={{color:"#838b8d"}}>of</span> {item.cases.length}
                </div>
              </div>
            </div> 
          </motion.div>
        );
      });
      allBoxes.push(boxes);
    } catch (error) {
      console.log(error)
    }
    return allBoxes;
  };

  return (
      <Grow in timeout={620}>
        <div className={classes.root}>
          <CreateBattle 
            handleClose={() => setCreateOpen(!createOpen)}
            open={createOpen}
          />
          <div className={classes.topBar}>
            <div className={classes.topBarContainer}>
              <div style={{display:"flex",flexDirection:"column",gap:"0.5rem"}}>
                <h3 style={{margin:0,padding:0}}>Case Battles</h3>
                <div style={{display: "flex", flexDirection: "row", alignItems: "center", gap: "0.5em"}}>
                  <span style={{display: "flex", alignItems: "center", color: "#9E9FBD", fontSize: "12px"}}>Total Value:</span>
                  <span style={{color: "#fff", display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "12px"}}>
                    <img style={{height: 10, width: 10}} src={coin} />
                    {loading ? 0 : (parseCommasToThousands(cutDecimalPoints(games.reduce((a, b) => a + b.price, 0))))}
                  </span>
                </div>
              </div>
              
              <motion.div whileTap={{ scale: 0.97 }} className={classes.createBattle} onClick={() => setCreateOpen(!createOpen)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="white"><path d="M10 4.79169V15.2084" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M15.2083 10H4.79163" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                <span>Create Battle</span>
              </motion.div>
            </div>

            
          </div>
          <div maxWidth="lg" className={classes.rowBattleList}>
            <div spacing={3}>
              {loading ? (
                <Box className={classes.loader}>
                  <ColorCircularProgress />
                </Box>
              ) : games.length > 0 ? (
                <AnimatePresence exitBeforeEnter>
                  {renderGamesBoxes()}
                </AnimatePresence>
              ) : (
                <div className={classes.noGames}>
                  <p>No current active games!</p>
                </div>
              )}
            </div>
          </div>
        </div>     
      </Grow>
  );
};
  
Battles.propTypes = {
  user: PropTypes.object,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
  user: state.auth.user,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Battles);