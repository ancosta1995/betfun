import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { getUserProfileData, getUserVipData } from "../services/api.service";
import parseCommasToThousands from "../utils/parseCommasToThousands";
import cutDecimalPoints from "../utils/cutDecimalPoints";
import { logout } from "../actions/auth";
import { useToasts } from "react-toast-notifications";
import { chatSocket } from "../services/websocket.service";
import { Grow } from "@material-ui/core";
import { motion, AnimatePresence } from "framer-motion";
import CircularProgress from "@material-ui/core/CircularProgress";
import ProgressBar from 'react-bootstrap/ProgressBar'
import coin from "../assets/icons/coin.png";
import RewardsModal from "../components/modals/rewards/RewardsModal";
import Transactions from "../components/profile/Transactions";
import Games from "../components/profile/Games";
import Settings from "../components/profile/Settings";
import usd from "../assets/fiat/usd.svg";

// Custom styles
const useStyles = makeStyles(theme => ({
  loader: {
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  root: {
    marginTop: "0.5rem",
    width: "100%",
    padding: "1.5rem",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "1150px",
    margin: "0 auto"
  },
  userContainer: {
    display: "flex",
    gap: "1rem",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#101123",
    padding: "2rem",
    borderRadius: "0.25rem",
    margin: "0 0 1rem 0",
    position: "relative"
  },
  userid: {
    position: "absolute",
    bottom: 10,
    right: 30,
    fontSize: "12px",
    color: "#C0C1DE"
  },
  avatar: {
    height: 32,
    width: 32,
    borderRadius: "0.25rem",
  },
  unContainer: {
    display: "flex",
    flexDirection: "column"
  },
  uContainer: {
    display: "flex",
    flexDirection: "row",
    gap: "0.5rem",
    alignItems: "center"
  },
  username: {
    color: "#fff",
    fontSize: "18px"
  },
  joined: {
    color: "#C0C1DE",
    fontSize: "13px"
  },
  levelBox: {
    backgroundColor: "rgba(227, 200, 94, 0.2)",
    color: "rgb(227, 200, 94)",
    fontWeight: 500,
    fontSize: "12px",
    borderRadius: "6px",
    padding: "0.1rem 0.5rem"
  },
  switchButton: {
    backgroundColor: "#0C132E",
    color: "#2871FF",
    padding: "0 0.75rem",
    fontWeight: 500,
    borderRadius: "0.25rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    cursor: "pointer",
    gap: "0.5rem",
    height: "2.5rem",
    position: "relative",
    userSelect: "none"
  },
  statsContainer: {
    display: "flex",
    gap: "1rem",
    width: "100%",
    [theme.breakpoints.down("md")]: {
      display: "block"
    },
    [theme.breakpoints.down("sm")]: {
      display: "block"
    },
  },
  freeCase: {
    [theme.breakpoints.down("md")]: {
      display: "none"
    },
    [theme.breakpoints.down("sm")]: {
      display: "none"
    },
  },
  statBox: {
    backgroundColor: "#101123",
    display: "flex",
    flexDirection: "column",
    alignItems: "left",
    width: "calc(33.33%)",
    borderRadius: "0.25rem",
    padding: "1rem",
    gap: "0.25rem"
  },
  amount: {
    color: "#fff",
    fontSize: "18px",
    display: "flex",
    alignItems: "center",
    gap: "0.3rem"
  },
  description: {
    color: "#C0C1DE",
    fontSize: "11px"
  },
  levelLongBox: {
    display: "flex",
    width: "100%",
    marginTop: "1rem",
    padding: "0.75rem 1rem",
    borderRadius: "0.25rem",
    background: "linear-gradient(to right, rgba(227, 200, 94, 0.2) 0%, rgba(253, 27, 98, 0) 100%) rgb(16, 17, 35)",
  },
  barContainer: {
    display: "flex",
    color: "#C0C1DE",
    width: "100%",
    flexDirection: "column",
    padding: "1rem 1rem 1rem 2rem"
  },
  top: {
    display: "flex",
    justifyContent: "space-between",
    fontWeight: 500,
    fontSize: "11px",
    width: "100%",
  },
  progress: {
    marginTop: "0.3rem",
    borderRadius: "4px",
    backgroundColor: "#242645", 
    height: "4px",
    "& .progress-bar": {
      backgroundColor: "rgb(227, 200, 94)" 
    },
    "& .progress-bar-animated": {
      backgroundColor: "rgba(255,255,255,0.1)"
    }
  },
  details: {
    backgroundColor: "#151B37",
    color: "#2871FF",
    padding: "0rem",
    fontWeight: 500,
    borderRadius: "0.25rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    cursor: "pointer",
    transitionDuration: "300ms",
    height: "2rem",
    position: "relative",
    "&:hover": {
      filter: "brightness(125%)"
    }
  },
  active: {
    flexGrow: 1,
    gap: "0.3rem",
    color: "hsl(220, 22%, 85%)",
    backgroundColor: "#1a1b33",
    cursor: "pointer",
    display: "inline-flex",
    padding: "0.5rem 1rem",
    fontSize: "12px",
    alignItems: "center",
    userSelect: "none",
    whiteSpace: "nowrap",
    borderRadius: "0.25rem",
    justifyContent: "center",
    transitionDuration: "300ms",
    cursor: "pointer",
    textDecoration: "none",
    fontWeight: 400,
    filter: "brightness(140%)",
  },
  notactive: {
    flexGrow: 1,
    gap: "0.3rem",
    color: "hsl(220, 22%, 85%)",
    backgroundColor: "#1a1b33",
    cursor: "pointer",
    display: "inline-flex",
    padding: "0.5rem 1rem",
    fontSize: "12px",
    alignItems: "center",
    userSelect: "none",
    whiteSpace: "nowrap",
    borderRadius: "0.25rem",
    justifyContent: "center",
    transitionDuration: "300ms",
    cursor: "pointer",
    textDecoration: "none",
    fontWeight: 400,
    "&:hover": {
      filter: "brightness(125%)",
    }
  },
}));

// Custom Component
const ColorCircularProgress = withStyles({
  root: {
    color: "#fff",
  },
})(CircularProgress);

const Profile = ({ isLoading, isAuthenticated, user, logout }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();
  const [displayname, setDisplayname] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [vipData, setVipData] = useState(null);
  const [vipDataColor, setVipDataColor] = useState(null);
  const [vipDataName, setVipDataName] = useState(null);
  const [openRewards, setOpenRewards] = useState(false);
  const [selected, setSelected] = useState("games");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getUserProfileData(user._id);
        setProfile(data);
        const data2 = await getUserVipData();
        setVipData(data2);
        const currentMajorLevel = data2.majorLevelNames.find((levelName, index) => {
          const currentLevelIndex = data2.allLevels.findIndex((level) => level.name === data2.currentLevel.name);
          const nextIndex = data2.allLevels.findIndex((level) => level.levelName === data2.majorLevelNames[index + 1]);
          if (currentLevelIndex >= index && (nextIndex === -1 || currentLevelIndex < nextIndex)) {
            return true;
          }
          return false;
        });
        const currentMajorLevelIndex = data2.majorLevelNames.indexOf(currentMajorLevel);
        setVipDataColor(data2.majorLevelColors[currentMajorLevelIndex]);
        setVipDataName(currentMajorLevel);

        setDisplayname(user.username);
        setAvatar(data.avatar)
        setLoading(false);
      } catch (error) {
        console.log("There was an error while loading user profile data:", error);
      }
    };
    if (!isLoading && isAuthenticated) {
      fetchData();
    }
  }, [isLoading, isAuthenticated, user?.username]);

  const formatDate = (date) => {
    const options = { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric'
    };
    const formattedDate = new Date(date).toLocaleDateString('en-US', options);
    return formattedDate;
  };

  const renderComponent = (state) => {
    switch (state) {
      case "games":
        return <Games userId={user._id}/>
      case "transactions":
        return <Transactions userId={user._id}/>
      case "settings":
        return <Settings userId={user._id}/>
    }
  };

  // If user is not logged in
  if (!isLoading && !isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <div className={classes.root}>
      {loading ? (
        <div className={classes.loader}>
          <ColorCircularProgress />
        </div>
      ) : user && isAuthenticated ? (
      <Grow in timeout={620}>
        <div className={classes.container}>
          <RewardsModal
            handleClose={() => setOpenRewards(!openRewards)}
            open={openRewards}
          />

          <div className={classes.userContainer}>
            <div style={{display:"flex",gap:"0.75rem", alignItems: "center"}}>
              <img className={classes.avatar} src={profile.avatar}/>
              <div className={classes.unContainer}>
                <div className={classes.uContainer}>
                  <span className={classes.username}>{profile.username}</span>
                  <div className={classes.levelBox}>{vipData.currentLevel.name}</div>
                </div>
                <span className={classes.joined}>joined {formatDate(profile.created)}</span>
              </div>
            </div>
            <div style={{display:"flex",gap:"0.25rem", alignItems: "center"}}>
              <motion.div 
                className={selected == "games" ? classes.active : classes.notactive}
                onClick={() => setSelected("games")}
              >
                Games
                <svg width="15" height="10" viewBox="0 0 16 11" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path data-v-42be5421="" d="M13.005 4.913c.536.013.96.432.946.937-.014.503-.46.901-.997.888-.537-.013-.96-.433-.947-.937.014-.504.46-.901.998-.888zM4.13 2.66c.35 0 .596.231.596.52v.87h.928c.306 0 .553.232.553.56a.544.544 0 01-.553.558h-.928v.873c0 .287-.247.518-.596.518-.348 0-.595-.231-.595-.518v-.873h-.929a.544.544 0 01-.552-.558c0-.328.247-.56.552-.56h.93v-.87c0-.289.246-.52.594-.52zm7.258-.178c.536.013.96.432.946.937-.014.503-.461.901-.998.887-.536-.013-.96-.432-.946-.936.014-.504.46-.901.998-.888zM3.95 0C1.968 0 .898 1.17.73 2.603l-.716 6.13C-.152 10.166 1.164 11 2.161 11c1.961 0 3.55-2.998 4.611-2.998h2.45c1.061 0 2.65 2.998 4.611 2.998.998 0 2.35-.838 2.146-2.267l-.715-6.13C15.059 1.175 14.026 0 12.044 0c-1.455 0-1.77.742-3.382.742h-1.33C5.72.742 5.406 0 3.95 0z"></path></svg>
              </motion.div>
              <motion.div 
                className={selected == "transactions" ? classes.active : classes.notactive}
                onClick={() => setSelected("transactions")}
              >
                Transactions
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16" fill="none"><g clipPath="url(#clip0_522_59)"><path d="M8.0004 9.99795C4.91496 9.99795 2.31387 9.18799 1.10938 7.99219V9.95363C1.49017 11.2356 4.15991 12.4998 8.0004 12.4998C11.8408 12.4998 14.5106 11.2357 14.8915 9.9537V7.99219C13.687 9.18799 11.086 9.99795 8.0004 9.99795Z" fill="currentColor"/><path d="M8.0004 6.71767C4.91496 6.71767 2.31387 5.90771 1.10938 4.71191V6.78531C1.49017 8.06744 4.15991 9.33162 8.0004 9.33162C11.8408 9.33162 14.5106 8.06751 14.8915 6.78545V4.71191C13.687 5.90771 11.086 6.71767 8.0004 6.71767Z" fill="currentColor"/><path d="M8.00046 0C4.19461 0 1.10938 1.42919 1.10938 3.19225V3.50482C1.49017 4.78695 4.15991 6.05113 8.0004 6.05113C11.8408 6.05113 14.5106 4.78702 14.8915 3.50496V3.19225C14.8915 1.42919 11.8063 0 8.00046 0Z" fill="currentColor"/><path d="M8.0004 13.1668C4.91496 13.1668 2.31387 12.3569 1.10938 11.1611V12.8078C1.10938 14.5708 4.19461 16 8.00046 16C11.8063 16 14.8916 14.5708 14.8916 12.8078V11.1612C13.687 12.3569 11.086 13.1668 8.0004 13.1668Z" fill="currentColor"/></g><defs><clipPath id="clip0_522_59"><rect width="16" height="16" fill="white"/></clipPath></defs></svg>
              </motion.div>
              <motion.div 
                className={selected == "settings" ? classes.active : classes.notactive}
                onClick={() => setSelected("settings")}
              >
                Settings
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="10" viewBox="0 0 18 14" fill="none"><path d="M1.5 3.6665L11.5 3.6665M11.5 3.6665C11.5 5.04722 12.6193 6.1665 14 6.1665C15.3807 6.1665 16.5 5.04722 16.5 3.6665C16.5 2.28579 15.3807 1.1665 14 1.1665C12.6193 1.1665 11.5 2.28579 11.5 3.6665ZM6.5 10.3332L16.5 10.3332M6.5 10.3332C6.5 11.7139 5.38071 12.8332 4 12.8332C2.61929 12.8332 1.5 11.7139 1.5 10.3332C1.5 8.95246 2.61929 7.83317 4 7.83317C5.38071 7.83317 6.5 8.95246 6.5 10.3332Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </motion.div>
            </div>
            <div className={classes.userid}>
              UID: {user._id}
            </div>
          </div>

          <div className={classes.statsContainer}>
            <div style={{width: "100%"}}>
              <div style={{display: "flex", gap: "1rem", width: "100%"}}>
                <div className={classes.statBox}>
                  <div className={classes.amount}>
                  <img style={{height: 19, width: 19}} src={usd} />
                  {parseCommasToThousands(profile.totalDeposited.toFixed(2))}
                  </div>
                  <div className={classes.description}>Total deposits</div>
                </div>
                <div className={classes.statBox}>
                  <div className={classes.amount}>
                    <img style={{height: 19, width: 19}} src={usd} />
                    {parseCommasToThousands(profile.totalWithdrawn.toFixed(2))}
                  </div>
                  <div className={classes.description}>Total withdrawals</div>
                </div>
                <div className={classes.statBox}>
                  <div className={classes.amount}>
                  <img style={{height: 19, width: 19}} src={usd} />
                  {parseCommasToThousands(profile.wager)}
                  </div>
                  <div className={classes.description}>Total wagered</div>
                </div>
              </div>
              <div>
                <div className={classes.levelLongBox}>
                  <div className={classes.unContainer} style={{gap: "0.25rem", width: "45%", justifyContent: "center"}}>
                    <div className={classes.amount} style={{color: "rgb(227, 200, 94)"}}>Level {vipData.currentLevel.name}</div>
                    <div className={classes.description}>Wager ${parseCommasToThousands((vipData.allLevels[Number(vipData.currentLevel.name)].wagerNeeded - profile.wager).toFixed(2))} more to level up</div>
                  </div>
                  <div className={classes.barContainer}>
                    <div className={classes.top}>
                      <div>{/*Level {vipData.currentLevel.name} - {parseCommasToThousands(Number(vipData.currentLevel.wagerNeeded).toFixed(0))}*/}</div>
                      <div>Level {Number(vipData.currentLevel.name)+1} - {parseCommasToThousands(Number(vipData.allLevels[Number(vipData.currentLevel.name)].wagerNeeded).toFixed(0))}</div>
                    </div>
                    <div className={classes.progressBar}>
                      <ProgressBar
                        variant="success"
                        animated="wave"
                        className={classes.progress}
                        min={vipData.currentLevel.wagerNeeded}
                        max={vipData.nextLevel.wagerNeeded}
                        now={vipData.wager}
                      />
                    </div>
                  </div>
                </div>
              </div>  
            </div>
            {/*<img className={classes.freeCase} style={{cursor: "pointer"}} src={csgocrashgg} onClick={() => setOpenRewards(!openRewards)}/>*/}
          </div>

          <AnimatePresence exitBeforeEnter>
            <motion.div
              key={selected}
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.2 }}
            >
              {renderComponent(selected)}
            </motion.div>
          </AnimatePresence>
        </div>
      </Grow>
      ) : (
        <div className={classes.loader}>
          <span>To view this page please sign in.</span>
        </div>
      )}
    </div>
  );
};


Profile.propTypes = {
  isAuthenticated: PropTypes.bool,
  isLoading: PropTypes.bool,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading,
  user: state.auth.user,
  logout: PropTypes.func.isRequired,
});

export default connect(mapStateToProps, { logout })(Profile);
