import React, { useState, useEffect, Fragment } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { getUserInviData, getUserTxData, getUserVipData } from "../../services/api.service";
import parseCommasToThousands from "../../utils/parseCommasToThousands.js";
import { useToasts } from "react-toast-notifications";
import cutDecimalPoints from "../../utils/cutDecimalPoints.js";
import { getRaceInformation, getLastRaceInformation, getRacePosition } from "../../services/api.service";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import coin from "../../assets/icons/coin.png";

// MUI Components
import Dialog from "@material-ui/core/Dialog";
import Countdown from "react-countdown";

const ColorCircularProgress = withStyles({
  root: {
    color: "#fff !important",
  },
})(CircularProgress);

// Custom Styles
const useStyles = makeStyles(theme => ({
  modal: {
    minHeight: "35rem",
    "& .MuiDialog-paperWidthSm": {
      scrollbarWidth: "none",
      width: "50%",
      background: "#050614",
      borderRadius: "0.5em",
      color: "#fff",
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
  raceTableOutline: {
    marginTop: "0.5rem",
    display: "flex",
    flexDirection: "column",
    borderRadius: "0.25rem",
    border: "2px solid #1E232F"
  },
  raceTableContainer: {
    display: "flex",
    borderRadius: "0.25rem",
    background: "#1E232F",
    width: "100%",
    padding: "1em 2em",
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
  placementContainer: {
    display: "flex",
    justifyContent: "flex-start",
    width: "20%",
    alignItems: "center"
  },
  playerContainer: {
    display: "flex",
    justifyContent: "flex-start",
    width: "80%",
    alignItems: "center"
  },
  wageredContainer: {
    display: "flex",
    justifyContent: "center",
    width: "50%",
    alignItems: "center",
    gap: "0.25rem"
  },
  prizeContainer: {
    display: "flex",
    justifyContent: "center",
    width: "50%",
    alignItems: "center",
    gap: "0.25rem"
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
  },
  playerAvatar: {
    width: "25px",
    height: "25px",
    borderRadius: "8px",
  },
  loader: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "45rem",
  },
}));

const tt = [
  {
    _id: "655115219075c878ccf134a9",
    value: 1100.94,
    _user: {
      wager: 376.61000000000007,
      _id: "65504d039e86f0287008662e",
      username: 'üp',
      avatar: 'https://avatars.steamstatic.com/408fa5f4aa2011080a86aef18f69395a3b2a661d_full.jpg'
    },
    user_level: '10',
    user_levelColor: 'rgb(193, 172, 166)',
    _race: "655114831e01fd6954fa712c",
    created: "2023-11-12T18:10:41.518Z",
  },
  {
    _id: "655115219075c878ccf134a9",
    value: 800.34,
    _user: {
      wager: 376.61000000000007,
      _id: "65504d039e86f0287008662e",
      username: 'üp',
      avatar: 'https://avatars.steamstatic.com/408fa5f4aa2011080a86aef18f69395a3b2a661d_full.jpg'
    },
    user_level: '10',
    user_levelColor: 'rgb(193, 172, 166)',
    _race: "655114831e01fd6954fa712c",
    created: "2023-11-12T18:10:41.518Z",
  },
  {
    _id: "655115219075c878ccf134a9",
    value: 600.21,
    _user: {
      wager: 376.61000000000007,
      _id: "65504d039e86f0287008662e",
      username: 'üp',
      avatar: 'https://avatars.steamstatic.com/408fa5f4aa2011080a86aef18f69395a3b2a661d_full.jpg'
    },
    user_level: '10',
    user_levelColor: 'rgb(193, 172, 166)',
    _race: "655114831e01fd6954fa712c",
    created: "2023-11-12T18:10:41.518Z",
  },
  {
    _id: "655115219075c878ccf134a9",
    value: 495.32,
    _user: {
      wager: 376.61000000000007,
      _id: "65504d039e86f0287008662e",
      username: 'üp',
      avatar: 'https://avatars.steamstatic.com/408fa5f4aa2011080a86aef18f69395a3b2a661d_full.jpg'
    },
    user_level: '10',
    user_levelColor: 'rgb(193, 172, 166)',
    _race: "655114831e01fd6954fa712c",
    created: "2023-11-12T18:10:41.518Z",
  },
  {
    _id: "655115219075c878ccf134a9",
    value: 433.33,
    _user: {
      wager: 376.61000000000007,
      _id: "65504d039e86f0287008662e",
      username: 'üp',
      avatar: 'https://avatars.steamstatic.com/408fa5f4aa2011080a86aef18f69395a3b2a661d_full.jpg'
    },
    user_level: '10',
    user_levelColor: 'rgb(193, 172, 166)',
    _race: "655114831e01fd6954fa712c",
    created: "2023-11-12T18:10:41.518Z",
  },
  {
    _id: "655115219075c878ccf134a9",
    value: 350.67,
    _user: {
      wager: 376.61000000000007,
      _id: "65504d039e86f0287008662e",
      username: 'üp',
      avatar: 'https://avatars.steamstatic.com/408fa5f4aa2011080a86aef18f69395a3b2a661d_full.jpg'
    },
    user_level: '10',
    user_levelColor: 'rgb(193, 172, 166)',
    _race: "655114831e01fd6954fa712c",
    created: "2023-11-12T18:10:41.518Z",
  },
  {
    _id: "655115219075c878ccf134a9",
    value: 270.93,
    _user: {
      wager: 376.61000000000007,
      _id: "65504d039e86f0287008662e",
      username: 'üp',
      avatar: 'https://avatars.steamstatic.com/408fa5f4aa2011080a86aef18f69395a3b2a661d_full.jpg'
    },
    user_level: '10',
    user_levelColor: 'rgb(193, 172, 166)',
    _race: "655114831e01fd6954fa712c",
    created: "2023-11-12T18:10:41.518Z",
  },
  {
    _id: "655115219075c878ccf134a9",
    value: 150.99,
    _user: {
      wager: 376.61000000000007,
      _id: "65504d039e86f0287008662e",
      username: 'üp',
      avatar: 'https://avatars.steamstatic.com/408fa5f4aa2011080a86aef18f69395a3b2a661d_full.jpg'
    },
    user_level: '10',
    user_levelColor: 'rgb(193, 172, 166)',
    _race: "655114831e01fd6954fa712c",
    created: "2023-11-12T18:10:41.518Z",
  },
  {
    _id: "655115219075c878ccf134a9",
    value: 93.12,
    _user: {
      wager: 376.61000000000007,
      _id: "65504d039e86f0287008662e",
      username: 'üp',
      avatar: 'https://avatars.steamstatic.com/408fa5f4aa2011080a86aef18f69395a3b2a661d_full.jpg'
    },
    user_level: '10',
    user_levelColor: 'rgb(193, 172, 166)',
    _race: "655114831e01fd6954fa712c",
    created: "2023-11-12T18:10:41.518Z",
  },
  {
    _id: "655115219075c878ccf134a9",
    value: 10.21,
    _user: {
      wager: 376.61000000000007,
      _id: "65504d039e86f0287008662e",
      username: 'üp',
      avatar: 'https://avatars.steamstatic.com/408fa5f4aa2011080a86aef18f69395a3b2a661d_full.jpg'
    },
    user_level: '10',
    user_levelColor: 'rgb(193, 172, 166)',
    _race: "655114831e01fd6954fa712c",
    created: "2023-11-12T18:10:41.518Z",
  },
]


const Race = ({ open, handleClose, user }) => {
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
          //setTopWinners(tt);
          setActiveRace(response.activeRace);
          setPrizeDistribution(response.prizeDistribution);
          setLoading(false);
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
          setActiveRace(false);
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
    
    if (open) {
      fetchData();
    } else {

    }
  }, [open]);

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      function z(t) {
        return t < 10 ? `0${t}` : t;
      }
      return (
        <span>{days}d {z(hours)}h {z(minutes)}:{z(seconds)}</span>
      );
    } else {
      // Render a countdown

      function z(t) {
        return t < 10 ? `0${t}` : t;
      }

      return (
          <span>{days}d {z(hours)}h {z(minutes)}:{z(seconds)}</span>
      );
    }
  };

  return (
      <Dialog
        className={classes.modal}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >    
        {loading ?
          <Box className={classes.loader}>
            <ColorCircularProgress />
          </Box>
          : (
          <div>
            <div className={classes.titleBox} onClose={handleClose} >
              <span style={{flex: "auto", fontSize: "1.5rem", color: "#E0E4EB" }}>Race</span>
              <svg className={classes.buttonIcon} style={{cursor: "pointer"}} onClick={() => handleClose()} fill="currentColor" tabIndex="-1" viewBox="0 0 320 512"><path d="M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z"></path></svg>
            </div>
            {!activeRace ? <div className={classes.content}><div style={{display: "flex", gap: "0.5rem", color: "#fff"}}>No active race.</div></div> : (
              <div className={classes.content} >
                <div style={{display: "flex", gap: "0.5rem", color: "#fff"}}><span style={{color: "#838b8d"}}>Time left in race:</span><Countdown date={new Date(activeRace?.endingDate)} renderer={renderer} style={{ color: "#fff" }}/></div>
                <div className={classes.raceTableOutline}>
                  <div className={classes.raceTableContainer}>
                    <div style={{display: "flex", width: "50%"}}>
                      <div className={classes.placementContainer}>#</div>
                      <div className={classes.playerContainer}>Player</div>
                    </div>
                    <div style={{display: "flex", width: "50%"}}>
                      <div className={classes.wageredContainer}>Wagered</div>
                      <div className={classes.prizeContainer}>Prize</div>
                    </div>
                  </div>
                  <div className={classes.players}>
                    {!topWinners ? "" : topWinners.map((entry, index) => {
                      return (
                        <div className={classes.playerBox} style={{ background: index % 2 == 0 ? "hsl(220, 22%, 10%)" : "hsl(220, 22%, 12.5%)" }}>
                          <div style={{display: "flex", width: "50%"}}>
                            <div className={classes.placementContainer}>{index + 1}</div>
                            <div className={classes.playerContainer} style={{gap: "0.5rem"}}>
                              <img className={classes.playerAvatar} src={entry._user.avatar} />
                              {entry._user.username}
                            </div>
                          </div>
                          <div style={{display: "flex", width: "50%"}}>
                            <div className={classes.wageredContainer}><img style={{height: 17, width: 17}} src={coin} />{parseCommasToThousands(cutDecimalPoints(entry.value))}</div>
                            <div className={classes.prizeContainer}><img style={{height: 17, width: 17}} src={coin} />{parseCommasToThousands(cutDecimalPoints(activeRace.prize *(prizeDistribution[index] / 100)))}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div> 
            )}
            
          </div>
          )}  
      </Dialog>
  );
};

export default Race;