import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory,
} from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { getSiteSchema } from "./services/api.service";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";
import { ToastProvider } from "react-toast-notifications";
import EventHandler from "./EventHandler";
import Provablyfair from "./views/ProvablyFair";
import { motion } from "framer-motion";
// MUI Components
import Drawer from "@material-ui/core/Drawer";
import Box from "@material-ui/core/Box";
import Leaderboard from "./views/Leaderboard";
// Components
import Navbar from "./components/Navbar";
import HeaderNav from "./components/chat/HeaderNav";
import NotFound from "./components/404.jsx";
import Chat from "./components/chat/Chat";
import Preloader from "./Preloader";
import MobileNav from "./components/MobileNav";
import LeftNavbar from "./components/LeftNavbar";
import ChatHeader from "./components/chat/Header";
import NextTopLoader from 'nextjs-toploader';
import AdminPanel from './admin/AdminPanel';
import IntercomChat from './components/IntercomChat';
import IntercomButton from './components/IntercomButton';
import Footer from "./components/Footer";

// Views
import Home from "./views/Home";
import Rewards from "./views/Rewards";
import Cases from "./views/Cases";
import CaseInfo from "./views/CaseInfo";
import Battles from "./views/Battles";
import BattlePage from "./views/BattlePage";
import Upgrader from "./views/Upgrader";
import Coinflip from "./views/Coinflip";
import CoinflipGames from "./views/CoinflipGames";
import CoinflipHistory from "./views/CoinflipHistory";
import Affiliates from "./views/Affiliates";
import Shuffle from "./views/Shuffle";
import Cups from "./views/Cups";
import Slots from './views/Slots';
import Live from './views/Live';
import Blackjack from './views/Blackjack';
import Roulette2 from './views/Roulette2';
import shows from './views/showw';
import Baccarat from './views/Baccarat';
import Airdrop from './views/Airdrop';
// import Footer from './views/Footer';
import Vip from './views/Vip';
import { NavigationProvider } from './context/NavigationContext';
import SlotDetail from './views/SlotDetail'; // Assuming you'll create a component for slot details
import Sportsbook from "./views/Sportsbook";

import Profile from "./views/Profile";
import Roulette from "./views/Roulette";
import Crash from "./views/Crash";
import Jackpot from "./views/Jackpot";
import Limbo from "./views/games/Limbo";
import Dice from "./views/games/Dice";
import Mines from "./views/Mines";
import Futures from "./views/Futures";
import Keno from "./views/Keno";
import Mine from "./views/Mine";
import Plinko from "./views/Plinko";

import Race from "./views/Race";
import Login from "./views/Login";
import Terms from "./views/Terms";
import Market from "./views/Market";
import Deposit from "./views/Deposit";
//import Main from "./views/Main";
import Fair from "./views/Fair";
import Faq from "./views/FAQ";
import Banned from "./views/Banned";
import History from "./views/History";
import Registration from "./views/Registration";

import AffiliatesRedirect from "./views/AffiliatesRedirect";

import Maintenance from "./views/Maintenance";

import CaseBuilder from "./views/CaseBuilder";

import Originals from "./views/Originals";

import Predictions from "./views/Predictions";

import CreatorsChannel from "./views/CreatorsChannel";

// App Metadata
import metadata from "./metadata.json";
import { CurrencyProvider } from './contexts/CurrencyContext';
import { themeConfig } from './config/config';  // Adjust the path if necessary
import createCustomTheme from "./theme";
import Snowfall from 'react-snowfall'

// Define the gradient colors
const gradientStart = '#080808'; // Dark color
const gradientEnd = 'hsl(251.31deg, 75%, 20%)'; // Lower lightness value for a subtle change

// Styles
const useStyles = makeStyles(theme => ({
  root: {
    background: themeConfig.body,
    
    display: "flex",
    minHeight: "100vh",
    position: "relative",
    
    fontFamily: "Poppins",
  },
  
  drawerPaper: {
    display: "flex",
    overflow: "visible",
    flexDirection: "column",
    fontFamily: "Rubik",
    background: themeConfig.secondbackground,
    borderLeft: "1.5px solid #1b1c2a",
    position: "relative",
    whiteSpace: "nowrap",
    // padding: "1rem",

    width: 340,
    height: "100vh",
    maxHeight: "100%",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
    transition: theme.transitions.create(['transform', 'opacity'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  mobileDrawer: {
    padding: 2,
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    background: themeConfig.secondbackground,
    fontFamily: "Rubik",
    position: "fixed",
    whiteSpace: "nowrap",
    width: "100%",
    borderRight: "none",
    height: "calc(100% - 55px)",
    maxHeight: "calc(100% - 55px)",
    top: 0,
    right: 0,
    zIndex: 1300,
    transform: props => props.mobileChat ? "translateX(0)" : "translateX(100%)",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
    transition: theme.transitions.create(['transform'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.standard,
    }),
  },

  drawerPaper7: {
    borderRight: "1.5px solid #0A0B1C",

    display: "flex",
    overflow: "visible",
    flexDirection: "column",
    fontFamily: "Rubik",
    background: "#0a0b1c",
    position: "relative",
    whiteSpace: "nowrap",
    width: "105%",
    marginLeft: '-10px',
    height: "100vh",
    maxHeight: "100%",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
  switchContainer: {
    position: "absolute",
    bottom: "5.25rem",
  },
  switch: {
    cursor: "pointer",
    postition: "relative",
    backgroundColor: "#131426",
    borderBottomRightRadius: "0.25rem",
    borderTopRightRadius: "0.25rem",
    padding: "0.5rem",
    color: "#4D527C",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    width: "40px",
    height: "40px",
    cursor: "poitner",
    transitionDuration: "300ms",
    "&:hover": {
      filter: "brightness(125%)"
    },
  },


    mobileDrawer7: {

    padding: 2,
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    background: "#0A0B1C",
    fontFamily: "Rubik",
    position: "absolute",
    whiteSpace: "nowrap",
    //  width: "50%",
    borderRight: "1.5px solid #0A0B1C",
    height: "100vh",
    maxHeight: "100%",
    [theme.breakpoints.down("xs")]: {
      paddingBottom: "85",
    },
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  navbardrawer: {

     borderRight: themeConfig.secondborder,

    display: "flex",
    overflow: "visible",
    flexDirection: "column",
    fontFamily: "Rubik",
    background: themeConfig.secondleftsidebar,
    position: "relative",
    whiteSpace: "nowrap",
    width: "100%",
    height: "100vh",
    maxHeight: "100%",

    [theme.breakpoints.down("sm")]: {

    },
    [theme.breakpoints.down("md")]: {
    },
  },
  paper: {
    padding: 2,
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  content: {
    // padding: "2rem 1rem",
    flexGrow: 1,
    height: "100vh",
    overflowY: "scroll",
    scrollbarColor: `${themeConfig.scrollbarColor} ${themeConfig.defaultbackground}`,
    scrollbarWidth: 'thin',
    fontFamily: "Poppins",
  },
  backdrop: {
    zIndex: 1500,
    background: "#1d2030",
    color: "#4F79FD",
  },

  chat: {
    
    // position: "absolute",
    bottom: "1.25rem",
    left: "1rem",
    color: "white",
    zIndex: 10000,
    background: "#4f79fd",
    display: "none",
    [theme.breakpoints.up("lg")]: {
      display: "none",
    },
    "&:focus": {
      background: "#4f79fd",
    },
    "&:active": {
      background: "#4f79fd",
    },
  },
}));

// First, create a new component to handle the route changes
const RouteListener = ({ setMobile }) => {
  const history = useHistory();

  useEffect(() => {
    const unlisten = history.listen(() => {
      setMobile(false);
    });

    return () => {
      unlisten();
    };
  }, [history, setMobile]);

  return null;
};

const App = () => {
  const [darkMode, setDarkMode] = useState(true);
  const theme = createCustomTheme(darkMode ? 'dark' : 'light');
  const [hidden, setHidden] = useState(true);
  const [mobileChat, setMobile] = useState(false);
  const classes = useStyles({ mobileChat });

  // Modals

  const mainMenuAnimate = {
    enter: {
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      },
      display: "flex"
    },
    exit: {
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      },
      transitionEnd: {
        display: "none"
      }
    }
  };

  const subMenuAnimate = {
    enter: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      },
      display: "flex"
    },
    exit: {
      opacity: 0,
      x: "-100%",
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      },
      transitionEnd: {
        display: "none"
      }
    }
  };

  const switchAnimation = {
    enter: {
      left: 'calc(77.5%)', // Adjust based on 50% of container width minus half the element width
      opacity: 1,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      },
      display: "flex"
    },
    exit: {
      left: "0rem",
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      },
    }
  };
  // Declare state
  const [open] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [finalCountdown, setFinalCountdown] = useState(0);
  const [mobileNavbar, setNavbar] = useState(false);

  const [mobileMenu, setMenu] = useState(false);

  useEffect(() => {
    // Update mobileChat based on the hidden state
    setMobile(!hidden);
  }, [hidden]);

  // Site settings
  const [loading, setLoading] = useState(true);
  const [maintenance, setMaintenance] = useState(false);

  // Fetch site schema from API
  const fetchData = async () => {
    setLoading(true);
    // Coundown stage commences - reduzido em desenvolvimento
    const delayTime = process.env.NODE_ENV === 'development' ? 0 : 500;
    await new Promise(resolve => {
      let secunde = process.env.NODE_ENV === 'development' ? 0 : 1;
      setFinalCountdown(secunde);
      let int = setInterval(() => {
        secunde -= 1;
        setFinalCountdown(secunde);
        if (secunde <= 0) { clearInterval(int); setFinalCountdown(""); resolve(); }
      }, delayTime);
    });
    try {
      const schema = await getSiteSchema();

      // If maintenance is enabled
      if (schema.maintenanceEnabled) {
        setMaintenance(true);
      }

      setLoading(false);
    } catch (error) {
      // If site is on maintenance
      if (error.response && error.response.status === 503) {
        setMaintenance(true);
        setLoading(false);
      } else {
        console.log(error);
        window.location.reload();
      }
    }
  };

  // componentDidMount
  useEffect(() => {
    const buildId = metadata.build;
    const buildNumber = buildId.split("@").length > 1 ? buildId.split("@")[1] : "Unknown";
    console.warn(
      `%cStop!\n%cThis is a browser feature intended only for developers. If someone told you to copy and paste something here to get a "new feature" or "hack" someone's account, it is a scam and will give them access to your account.\r%c[BUILD] Current build number: ${buildNumber}`,
      "font-weight: bold; font-size: 35px; color: red;",
      "color: black; margin-top: 1rem;",
      "color: black; margin-top: 1rem;"
    );
    store.dispatch(loadUser());
    fetchData();
  }, []);

  return maintenance ? (
    <Maintenance />
  ) : loading ? (
    <Preloader finalCountdown={finalCountdown} />
  ) : (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Provider store={store}>
        <NavigationProvider>
          <CurrencyProvider>
            <Router>
              <ToastProvider
                placement={"top-right"}
                autoDismiss={true}
                autoDismissTimeout={4000}
              >
                <EventHandler />
                <RouteListener setMobile={setMobile} />
                <div className={classes.root}>
                  {/* <Drawer
                      variant="permanent"
                      classes={{
                        paper: mobileChat ? classes.navbardrawer : classes.navbardrawer,
                      }}
                      className={classes.chatContainer}
                      open={open}
                    >
                      <LeftNavbar />
                      
                    </Drawer> */}
                    <LeftNavbar />

          <MobileNav mobileNavbar={mobileNavbar} setNavbar={setNavbar} mobileChat={mobileChat} setMobile={setMobile} />

                <main className={classes.content}>
     
                <Navbar mobileChat={mobileChat} setMobile={setMobile} />
                <IntercomChat />
                <IntercomButton />
                <NextTopLoader
      color="hsl(251.31deg 75% 50%)"
      initialPosition={0.08}
      crawlSpeed={5200}
      height={4}
      crawl={false}
      showSpinner={false}
      easing="ease"
      speed={1500}
      shadow="0 0 25px #2299DD,0 0 25px #2299DD"
      template='<div class="bar" role="bar"><div class="peg"></div></div> 
      <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
      zIndex={1600}
      showAtBottom={false}
    />


                  <Box height="auto" />

                  <Switch>
                    <Redirect exact from="/" to="/home" />

                    <Route exact path="/cups" component={Cups} />
                    <Route
                      exact
                      path="/cups/private/:inviteCode"
                      component={Cups}
                    />

                    <Route exact path="/coinflip/private/:inviteCode" component={Coinflip} />
                    <Route exact path="/slots/" component={Slots} />
                    <Route exact path="/live/" component={Live} />
                    <Route exact path="/blackjack/" component={Blackjack} />
                    <Route exact path="/roulette2/" component={Roulette2} />
                    <Route exact path="/gameshows/" component={shows} />
                    <Route exact path="/baccarat/" component={Baccarat} />

                    <Route exact path="/slots/:identifier" component={SlotDetail} />
                    <Route exact path="/sports/" component={Sportsbook} />

                    <Route exact path="/battles/:battleId" component={BattlePage} />
                      <Route exact path="/battles" component={Battles} />
                      <Route exact path="/upgrader" component={Upgrader} />

                    <Route exact path="/cases/:caseSlug" component={CaseInfo} />
                    <Route exact path="/shuffle" component={Shuffle} />
                    <Route exact path="/limbo" component={Limbo} />
                    <Route exact path="/dice" component={Dice} />
                    <Route exact path="/mines" component={Mines} />
                    <Route exact path="/mine" component={Mine} />
                    <Route exact path="/plinko" component={Plinko} />
                    <Route exact path="/airdrop/" component={Airdrop} />
                    {/* <Route exact path="/vip/" component={Vip} /> */}

                    <Route exact path="/futures">
                      <Redirect to="/futures/BTC" />
                    </Route>
                    <Route exact path="/futures/:symbol" component={Futures} />
                    <Route exact path="/Keno" component={Keno} />
                    <Route exact path="/provably-fair" component={Provablyfair} />
                    <Route exact path="/leaderboard" component={Leaderboard} />
                    <Route exact path="/jackpot" component={Jackpot} />
                    <Route exact path="/cases" component={Cases} />
                    <Route exact path="/roulette" component={Roulette} />
                    <Route exact path="/crash" component={Crash} />
                    <Route exact path="/coinflip" component={CoinflipGames} />
                    <Route exact path="/coinflip_history" component={CoinflipHistory} />

                    <Route exact path="/casebuilder" component={CaseBuilder} />
                    <Route exact path="/home" component={Home} />
                    <Route exact path="/rewards" component={Rewards} />
                    <Route exact path="/profile" component={Profile} />
                    <Route exact path="/affiliates" component={Affiliates} />
                    <Route exact path="/terms" component={Terms} />
                    <Route exact path="/fair" component={Fair} />
                    <Route exact path="/faq" component={Faq} />
                    <Route exact path="/market" component={Market} />
                    <Route exact path="/deposit" component={Deposit} />
                    <Route exact path="/banned" component={Banned} />
                    <Route exact path="/history" component={History} />
                    <Route exact path="/registration" component={Registration} />
                    <Route exact path="/a/:affiliateCode" component={AffiliatesRedirect} />

                    <Route exact path="/login/:provider?" component={Login} />
                    <Route exact path="/admin" component={AdminPanel} />
                    <Route exact path="/originals" component={Originals} />
                    <Route exact path="/predictions" component={Predictions} />
                    <Route exact path="/creators" component={CreatorsChannel} />
                    <Route exact path="*" component={NotFound} />
                  </Switch>

                  <Footer />

                </main>
                
                {/* CHAT DISABLED */}
                <Drawer
                  variant="permanent"
                  classes={{
                    paper: mobileChat ? classes.mobileDrawer : classes.drawerPaper,
                  }}
                  className={classes.chatContainer}
                  open={mobileChat}
                  style={{display: 'none'}}
                >
                  {/* <Chat 
                    mobileChat={mobileChat} 
                    setMobile={setMobile}
                    setMobileProps={{ setMobile }}
                  /> */}
                </Drawer>

                
                </div>


            </ToastProvider>
          </Router>
        </CurrencyProvider>
      </NavigationProvider>
    </Provider>
    </ThemeProvider>
  );
};

export default App;
