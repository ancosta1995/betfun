import React, { useState, useEffect, Fragment } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import parseCommasToThousands from "../utils/parseCommasToThousands.js";
import { useToasts } from "react-toast-notifications";
import { getRaceInformation, getLastRaceInformation, getRacePosition } from "../services/api.service";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import Countdown from "react-countdown";
import { Grow, Slide } from "@material-ui/core";
import { motion } from "framer-motion";

import coin from "../assets/icons/coin.png";
import WideLogo from "../assets/navbar/logo2.png";
import FlagsLeft from "../assets/leaderboard/flags-left.png";
import FlagsRight from "../assets/leaderboard/flags-right.png";
import First from "../assets/leaderboard/first2.png";
import Second from "../assets/leaderboard/second2.png";
import Third from "../assets/leaderboard/third2.png";


const cutDecimalPoints = (num) => {
  const roundedNum = parseFloat(num).toFixed(2);
  return roundedNum;
};

const calculatePrize = (totalPrize, distributionPercentage) => {
  const prize = (totalPrize * distributionPercentage) / 100;
  return parseFloat(prize.toFixed(2));
};

const ColorCircularProgress = withStyles({
  root: {
    color: "#fff !important",
  },
})(CircularProgress);

// Custom Styles
const useStyles = makeStyles(theme => ({


  root: {
    marginTop: "2rem",
    width: "100%",
    maxWidth: "1050px",
    margin: "0 auto",
    color: "#fff",
    overflowY: "scroll",
    scrollbarWidth: "none",
    [theme.breakpoints.down("lg")]: {
      maxWidth: "850px",
    },
  },
  
  container: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
  content: {
    width: "100%",
    display: "block",
  },
  raceTableOutline: {
    marginTop: "0.5rem",
    display: "flex",
    flexDirection: "column",
    borderRadius: "0.25rem",
  },
  raceTableContainer: {
    display: "flex",
    fontSize: 13,
    borderRadius: "0.25rem",
    width: "100%",
    padding: "0.5em 2em",
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    opacity: 0.5
  },
  placementContainer: {
    display: "flex",
    justifyContent: "flex-start",
    width: "20%",
    alignItems: "center"
  },
  playerContainer: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    alignItems: "center",
    gap: "0.25rem",
    fontSize: 16
  },
  wageredContainer: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    alignItems: "center",
    gap: "0.25rem",
    // fontSize: 16
  },
  prizeContainer: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    alignItems: "center",
     gap: "0.25rem",
  },
  prizeBox: {
    backgroundColor: "#4F4340",
    color: "#E1B56F",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
     gap: "0.25rem",
     marginLeft: "15px",
    padding: "0.25rem 0.5rem",
    borderRadius: "0.25rem",
    // fontSize: 16
  },
  players: {
    "& td:nth-child(even)": { 
      backgroundColor: "#fff !important",
    },
    "& td:nth-child(odd)": { 
      backgroundColor: "#fff !important",
    },
  },
  playerBox: {
    display: "flex",
    padding: "1em 2em",
    background: "#13142D",
    marginBottom: "12px",
    borderRadius: "0.25rem"
  },
  playerAvatar: {
    // width: "35px",
    // height: "35px",
        width: "25px",
     height: "25px",
    borderRadius: "8px",
  },
  loader: {
    width: "100%",
    height: "100%",
    margin: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  textContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    background: "linear-gradient(45deg, hsl(251.31deg 75% 50%) 0%, hsl(251.31deg 75% 50%) 100%)",
    padding: "2rem",
    borderRadius: "1rem",
    marginBottom: "2rem",
    position: "relative",
    "& > h2": {
      fontSize: "42px",
      color: "#fff",
      fontWeight: 700,
      margin: 0,
      padding: 0,
      lineHeight: 1
    },
    "& > p": {
      fontSize: "16px",
      color: "#fff",
      fontWeight: 400,
      margin: "0.5rem 0 0 0",
      padding: 0,
      opacity: 0.9,
      "& > a": {
        color: "#fff",
        textDecoration: "underline",
        marginLeft: "0.25rem"
      }
    }
  },
  countdownContainer: {
    display: "flex",
    gap: "0.75rem",
    position: "absolute",
    right: "2rem",
    top: "50%",
    transform: "translateY(-50%)",
    [theme.breakpoints.down("sm")]: {
      position: "relative",
      right: "auto",
      top: "auto",
      transform: "none",
      marginTop: "1rem",
      justifyContent: "center"
    }
  },
  countdownBox: {
    background: "rgba(255, 255, 255, 0.15)",
    borderRadius: "0.75rem",
    padding: "0.75rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minWidth: "70px",
    [theme.breakpoints.down("sm")]: {
      minWidth: "60px",
      padding: "0.5rem",
    },
    "& > span:first-child": {
      fontSize: "36px",
      fontWeight: 700,
      color: "#fff",
      lineHeight: 1,
      [theme.breakpoints.down("sm")]: {
        fontSize: "24px",
      }
    },
    "& > span:last-child": {
      fontSize: "14px",
      color: "#fff",
      marginTop: "0.25rem",
      [theme.breakpoints.down("sm")]: {
        fontSize: "12px",
      }
    }
  },
  topThreeContainer: {
    width: "100%",
    height: 450,
    margin: "3rem 0 2rem 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "bottom",
  },
  firstPlaceContainer: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "end",
  },
  first: {
    marginTop: "auto",
    height: 283,
    width: 247,
    alignSelf: "end",
    position: "relative",
    backgroundImage: `url(${First})`,
    textAlign: "center"
  },
  second: {
    height: 283,
    width: 247,
    alignSelf: "end",
    position: "relative",
    backgroundImage: `url(${Second})`,
    textAlign: "center",
  },
  third: {
    height: 283,
    width: 247,
    alignSelf: "end",
    position: "relative",
    backgroundImage: `url(${Third})`,
    textAlign: "center"
  },
  finalistAvatar: {
    height: 80,
    width: 80,
    borderRadius: "0.5rem",
    position: "absolute",
    top: 0,
    left: "50%",
    transform: "translate(-50%, -50%)"
  },
  usernameText: {
    fontSize: 21,
    marginTop: 50,
  },
  wageredText: {
    fontSize: 13,
    opacity: 0.5,
    marginTop: 55,
  },
  wagerAmountText: {
    fontSize: 20,
    marginTop: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.3rem",
  },
  winAmountText: {
    fontSize: 30,
    marginTop: 40,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.3rem"
  },

}));

const tt = [
  {
    _id: "1",
    value: 178.00,
    _user: {
      wager: 178.00,
      _id: "1",
      username: 'wfwefwe',
      avatar: 'https://avatars.steamstatic.com/408fa5f4aa2011080a86aef18f69395a3b2a661d_full.jpg'
    }
  },
  {
    _id: "2",
    value: 156.50,
    _user: {
      wager: 156.50,
      _id: "2",
      username: 'player2',
      avatar: 'https://avatars.steamstatic.com/408fa5f4aa2011080a86aef18f69395a3b2a661d_full.jpg'
    }
  },
  {
    _id: "3",
    value: 145.75,
    _user: {
      wager: 145.75,
      _id: "3",
      username: 'player3',
      avatar: 'https://avatars.steamstatic.com/408fa5f4aa2011080a86aef18f69395a3b2a661d_full.jpg'
    }
  },
  {
    _id: "4",
    value: 132.25,
    _user: {
      wager: 132.25,
      _id: "4",
      username: 'player4',
      avatar: 'https://avatars.steamstatic.com/408fa5f4aa2011080a86aef18f69395a3b2a661d_full.jpg'
    }
  },
  {
    _id: "5",
    value: 121.00,
    _user: {
      wager: 121.00,
      _id: "5",
      username: 'player5',
      avatar: 'https://avatars.steamstatic.com/408fa5f4aa2011080a86aef18f69395a3b2a661d_full.jpg'
    }
  },
  {
    _id: "6",
    value: 98.50,
    _user: {
      wager: 98.50,
      _id: "6",
      username: 'player6',
      avatar: 'https://avatars.steamstatic.com/408fa5f4aa2011080a86aef18f69395a3b2a661d_full.jpg'
    }
  }
];


const Leaderboard = ({ open, handleClose, user }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();

  const [loading, setLoading] = useState(true);
  const [loadingPersonal, setLoadingPersonal] = useState(false);
  const [activeRace, setActiveRace] = useState(false);
  const [topWinners, setTopWinners] = useState(null);
  const [personalPosition, setPersonalPosition] = useState(0);
  const [personalProgress, setPersonalProgress] = useState(0);
  const [prizeDistribution, setPrizeDistribution] = useState([]);
  const [first, setFirst] = useState(false);
  const [second, setSecond] = useState(false);
  const [third, setThird] = useState(false);
  const [text, setText] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getRaceInformation();
        const responseLast = await getLastRaceInformation();

        // If race is active
        if (response.active) {
          // Update state
          setTopWinners(response.topTen);
          setActiveRace(response.activeRace);
          setPrizeDistribution(response.prizeDistribution);
          setLoading(false);
          setTimeout(() => {
            setThird(true)
            setTimeout(() => {
              setSecond(true)
              setTimeout(() => {
                setFirst(true)
              }, 250)
            }, 250)
          }, 250)
          console.log(response)
        }
        // If Last Race
        else if (false) {
          // Update state
          setTopWinners(responseLast.topTen);
          setActiveRace(responseLast.activeRace);
          setPrizeDistribution(responseLast.prizeDistribution);
          setLoading(false);
        }
        else {
          setActiveRace(null);
          setLoading(false);
        }

      } catch (error) {
        console.log("There was an error while loading race data:", error);
        addToast(
          "There was an error while loading race data, please try again later!",
          { appearance: "error" }
        );
      }
    };
    
    fetchData();
  }, []);

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    function z(t) {
      return t < 10 ? `0${t}` : t;
    }
    return (
      <div className={classes.countdownContainer}>
        <div className={classes.countdownBox}>
          <span>{z(days)}</span>
          <span>Days</span>
        </div>
        <div className={classes.countdownBox}>
          <span>{z(hours)}</span>
          <span>Hours</span>
        </div>
        <div className={classes.countdownBox}>
          <span>{z(minutes)}</span>
          <span>Minutes</span>
        </div>
        <div className={classes.countdownBox}>
          <span>{z(seconds)}</span>
          <span>Seconds</span>
        </div>
      </div>
    );
  };

  return (
      <div className={classes.root}>    
        {loading ?
          <Box className={classes.loader}>
            <ColorCircularProgress />
          </Box>
          : (
            
          <Grow in timeout={620}>
            <div className={classes.container}>
              {/*<motion.img src={FlagsLeft} style={{width: 250, position: "absolute", top: 0, left: 0}} />
              <motion.img src={FlagsRight} style={{width: 250, position: "absolute", top: 0, right: 0}} />*/}

              <div className={classes.textContainer}>
                <h2>WEEKLY RACE</h2>
                <p>Giving away $2,000 every week.</p>
                <Countdown 
                  date={new Date(activeRace?.endingDate || Date.now() + 86400000)} 
                  renderer={renderer}
                />
              </div>

              {!activeRace ? (
                <div className={classes.content}>
                  <div className={classes.content}>
                    <div style={{
                      display: "flex", 
                      flexDirection: "column", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      padding: "3rem 0 0 0",
                      marginBottom: "2rem"
                    }}>
                      <h3 style={{color: "#D7B949"}}>No active race</h3>
                      <p>A new race will start soon. Check back later!</p>
                    </div>
                    <div className={classes.raceTableOutline}>
                      <div className={classes.raceTableContainer}>
                        <div style={{display: "flex", width: "50%"}}>
                          <div className={classes.placementContainer}>#</div>
                          <div className={classes.playerContainer}>Player</div>
                        </div>
                        <div style={{display: "flex", width: "50%"}}>
                          <div className={classes.wageredContainer} style={{fontSize: 12}}>Wagered</div>
                          <div className={classes.prizeContainer}>Prize</div>
                        </div>
                      </div>
                      <div className={classes.players}>
                        {/* Show all entries */}
                        {tt.map((entry, index) => (
                          <div className={classes.playerBox} key={index}>
                            <div style={{display: "flex", width: "50%"}}>
                              <div className={classes.placementContainer}>{index + 1}</div>
                              <div className={classes.playerContainer} style={{gap: "0.5rem"}}>
                                <img className={classes.playerAvatar} src={entry._user.avatar} />
                                {entry._user.username}
                              </div>
                            </div>
                            <div style={{display: "flex", width: "50%"}}>
                              <div className={classes.wageredContainer}>
                                <img style={{height: 17, width: 17, marginBottom: "0.1rem"}} src={"https://shuffle.com/icons/fiat/USD.svg"} />
                                {parseCommasToThousands(cutDecimalPoints(entry.value))}
                              </div>
                              <div className={classes.prizeContainer}>
                                <div className={classes.prizeBox}>
                                  <img style={{height: 17, width: 17, marginBottom: "0.15rem"}} src={"https://shuffle.com/icons/fiat/USD.svg"} />
                                  {index < prizeDistribution.length ? 
                                    parseCommasToThousands(cutDecimalPoints(calculatePrize(2000, prizeDistribution[index]))) :
                                    "0.00"
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {/* Empty rows for remaining positions up to 10 */}
                        {Array.from({length: Math.max(0, 10 - tt.length)}).map((_, index) => {
                          const position = tt.length + index + 1;
                          return (
                            <div className={classes.playerBox} key={position}>
                              <div style={{display: "flex", width: "50%"}}>
                                <div className={classes.placementContainer}>{position}</div>
                                <div className={classes.playerContainer} style={{gap: "0.5rem"}}>
                                  <div className={classes.playerAvatar} style={{backgroundColor: "#2a2b3d"}} />
                                  <span style={{ 
                                    overflow: "hidden", 
                                    textOverflow: "ellipsis", 
                                    whiteSpace: "nowrap",
                                    maxWidth: "100px",
                                    color: "#2a2b3d"
                                  }}>
                                    --------
                                  </span>
                                </div>
                              </div>
                              <div style={{display: "flex", width: "50%"}}>
                                <div className={classes.wageredContainer}>
                                  <img style={{height: 17, width: 17, marginBottom: "0.1rem", opacity: 0.3}} src={"https://shuffle.com/icons/fiat/USD.svg"} />
                                  <span style={{color: "#2a2b3d"}}>------</span>
                                </div>
                                <div className={classes.prizeContainer}>
                                  <div className={classes.prizeBox} style={{backgroundColor: "#2a2b3d", color: "#2a2b3d"}}>
                                    <img style={{height: 17, width: 17, marginBottom: "0.15rem", opacity: 0.3}} src={"https://shuffle.com/icons/fiat/USD.svg"} />
                                    ------
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
              <>
                <div className={classes.content}>
                  <div className={classes.content} >
                    <div className={classes.raceTableOutline}>
                      <div className={classes.raceTableContainer}>
                        
                        <div style={{display: "flex", width: "50%"}}>
                          
                          <div className={classes.placementContainer}>#</div>
                          <div className={classes.playerContainer}>Player</div>
                        </div>
                        <div style={{display: "flex", width: "50%"}}>
                          <div className={classes.wageredContainer} style={{fontSize: 12}}>Wagered</div>
                          <div className={classes.prizeContainer}>Prize</div>
                        </div>
                      </div>
                      <div className={classes.players}>
                        {/* Show all entries */}
                        {(!topWinners ? tt : topWinners).map((entry, index) => (
                          <div className={classes.playerBox} key={index}>
                            <div style={{display: "flex", width: "50%"}}>
                              <div className={classes.placementContainer}>{index + 1}</div>
                              <div className={classes.playerContainer} style={{gap: "0.5rem"}}>
                                <img className={classes.playerAvatar} src={entry._user.avatar} />
                                {entry._user.username}
                              </div>
                            </div>
                            <div style={{display: "flex", width: "50%"}}>
                              <div className={classes.wageredContainer}>
                                <img style={{height: 17, width: 17, marginBottom: "0.1rem"}} src={"https://shuffle.com/icons/fiat/USD.svg"} />
                                {parseCommasToThousands(cutDecimalPoints(entry.value))}
                              </div>
                              <div className={classes.prizeContainer}>
                                <div className={classes.prizeBox}>
                                  <img style={{height: 17, width: 17, marginBottom: "0.15rem"}} src={"https://shuffle.com/icons/fiat/USD.svg"} />
                                  {index < prizeDistribution.length ? 
                                    parseCommasToThousands(cutDecimalPoints(calculatePrize(activeRace?.prize || 2000, prizeDistribution[index]))) :
                                    "0.00"
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {/* Empty rows for remaining positions up to 10 */}
                        {Array.from({length: Math.max(0, 10 - (!topWinners ? tt.length : topWinners.length))}).map((_, index) => {
                          const position = (!topWinners ? tt.length : topWinners.length) + index + 1;
                          return (
                            <div className={classes.playerBox} key={position}>
                              <div style={{display: "flex", width: "50%"}}>
                                <div className={classes.placementContainer}>{position}</div>
                                <div className={classes.playerContainer} style={{gap: "0.5rem"}}>
                                  <div className={classes.playerAvatar} style={{backgroundColor: "#2a2b3d"}} />
                                  <span style={{ 
                                    overflow: "hidden", 
                                    textOverflow: "ellipsis", 
                                    whiteSpace: "nowrap",
                                    maxWidth: "100px",
                                    color: "#2a2b3d"
                                  }}>
                                    --------
                                  </span>
                                </div>
                              </div>
                              <div style={{display: "flex", width: "50%"}}>
                                <div className={classes.wageredContainer}>
                                  <img style={{height: 17, width: 17, marginBottom: "0.1rem", opacity: 0.3}} src={"https://shuffle.com/icons/fiat/USD.svg"} />
                                  <span style={{color: "#2a2b3d"}}>------</span>
                                </div>
                                <div className={classes.prizeContainer}>
                                  <div className={classes.prizeBox} style={{backgroundColor: "#2a2b3d", color: "#2a2b3d"}}>
                                    <img style={{height: 17, width: 17, marginBottom: "0.15rem", opacity: 0.3}} src={"https://shuffle.com/icons/fiat/USD.svg"} />
                                    ------
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div> 
                </div>
              </>
              )}   
            </div>
          </Grow>
          )}  
      </div>
  );
};

export default Leaderboard;