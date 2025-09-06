import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import ProgressBar from 'react-bootstrap/ProgressBar'
import { getUserVipData } from "../services/api.service";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logout } from "../actions/auth";
import Preloader from '../Preloader';

const useStyles = makeStyles((theme) => ({
  root: {
    // backgroundColor: '#000',
    color: '#fff',
    minHeight: '100vh',
    padding: theme.spacing(4),
    fontFamily: 'Arial, sans-serif',
  },
  progress: {
    width: "100%",

    marginTop: "0.3rem",
    borderRadius: "4px",
    backgroundColor: "#242645",
    height: "10px",
    "& .progress-bar": {
      backgroundColor: "#2871FF"
    }
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(2),
    backgroundColor: '#0a0b1c',
    padding: theme.spacing(2),
    borderRadius: 8,
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      marginBottom: 0,
    },
  },
  logoIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#8B5CF6',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing(1),
  },
  tokenName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  tokenPrice: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  priceChange: {
    color: '#FF4136',
    marginLeft: theme.spacing(1),
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      width: 'auto',
    },
  },
  button: {
    textTransform: "none",
    width: "100%",
    height: "50px", // Increased height
    padding: "0 30px",
    borderRadius: "6px",
    fontSize: "15px",
    fontWeight: 500,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',  // Prevents text selection
    cursor: 'pointer',
  
    color: "#fff",
    background: "hsl(215deg 100% 55.72%)", // Updated color
    border: "none",
    transition: "opacity .3s ease",
    fontFamily: "Rubik",
    
    '&:disabled': {
      cursor: 'not-allowed',
      opacity: 0.6, // Added slight opacity when disabled
    },
    "&:hover": {
      background: "hsl(215deg 100% 55.72%)", // Darker shade of the updated color
      borderColor: "#1e429f",
    },

  },
  buttons: {
    padding: '8px 16px',
    borderRadius: 4,
    fontWeight: 'bold',
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
    marginBottom: theme.spacing(1),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginBottom: 0,
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  learnMoreBtn: {
    backgroundColor: '#1a1b33',
    color: '#fff',
  },
  buyBtn: {
    backgroundColor: 'hsl(215deg 100% 55.72%)',
    color: '#fff',
  },
  card: {
    backgroundColor: '#101123',
    borderRadius: 8,
    marginBottom: theme.spacing(2),
  },
  cardHeader: {
    backgroundColor: "#0a0b1c",
    padding: '-50px', // px cinsinden padding'i azaltıyoruz
    borderBottom: '1.5px solid rgb(27, 28, 42)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'Poppins', sans-serif", // Modern and clean font
    fontSize: '15px', // Font size that's comfortable to read
    fontWeight: 100, // Medium weight for emphasis without being too bold
    lineHeight: 1, // Good line spacing for readability
    color: '#ffffff', // Light text on dark background
  
  },
  
  cardContent: {
    padding: theme.spacing(2),
  },
  cardFooter: {
    padding: theme.spacing(2),

    display: "flex",
    // borderTop: '1px solid #2C2C2E',
  },
  progressBar: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
    marginBottom: theme.spacing(2),
  },
  progressFill: {
    height: '100%',
    width: '0%',
    backgroundColor: '#8B5CF6',
    borderRadius: 4,
  },
  tokenIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#8B5CF6',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing(1),
  },
  claimBtn: {
    textTransform: "none",
    width: "100%",
    height: "50px", // Increased height
    padding: "0 30px",
    borderRadius: "6px",
    fontSize: "15px",
    fontWeight: 500,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',  // Prevents text selection
    cursor: 'pointer',
  
    color: "#fff",
    background: "hsl(215deg 100% 55.72%)", // Updated color
    border: "none",
    transition: "opacity .3s ease",
    fontFamily: "Rubik",
    
    '&:disabled': {
      cursor: 'not-allowed',
      opacity: 0.6, // Added slight opacity when disabled
    },
    "&:hover": {
      background: "hsl(215deg 100% 55.72%)", // Darker shade of the updated color
      borderColor: "#1e429f",
    },

  },
  chartContainer: {
    height: 280,
  },
  chartsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },
  },
  chartCard: {
    flex: 1,
  },
}));

const priceData = [
  { time: '12:25', price: 0.003 },
  { time: '15:55', price: 0.008 },
  { time: '19:25', price: 0.08 },
  { time: '22:55', price: 0.20 },
  { time: '02:25', price: 0.45 },
  { time: '05:55', price: 0.30 },
  { time: '09:25', price: 1 },

];
const burnData = [
  { date: '26/07', amount: 1 },
  { date: '02/08', amount: 4 },
  { date: '09/08', amount: 12 },
  { date: '16/08', amount: 17 },
  { date: '23/08', amount: 25 },
  { date: '30/08', amount: 45 },
  { date: '06/09', amount: 77 },
  { date: '13/09', amount: 200 },
];
const ComingSoonOverlay = () => (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: '24px',
      fontWeight: 'bold',
      borderRadius: '8px',
      backdropFilter: 'blur(4px)', // Apply blur effect
    }}>
      <Preloader />

    </div>
  );
  
const Airdrop = ({ isAuthenticated, isLoading, user, logout }) => {
      const classes = useStyles();
  const [vipData, setVipData] = useState({
    currentLevel: { wagerNeeded: 0 },
    nextLevel: { wagerNeeded: 100 },
    wager: 0,
  });

  useEffect(() => {
    // Generate random progress values
    const min = 0;
    const max = 100; // Set a max value
    const now = Math.floor(Math.random() * (max - min + 1)) + min; // Random value between min and max

    setVipData({
      currentLevel: { wagerNeeded: min },
      nextLevel: { wagerNeeded: max },
      wager: now,
    });
  }, []);
  const [previousTotal, setPreviousTotal] = useState(0);
  const [currentTotal, setCurrentTotal] = useState(0);
  const [affiliateCode, setAffiliateCode] = useState(null);

  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(0);
  const [currentMajorLevelIndex, setCurrentMajorLevelIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserVipData();

        setVipData(data);
        setCurrentMajorLevelIndex(data.majorLevelNames.findIndex((levelName) => levelName === data.currentLevel.levelName));
        let lastObject = data.allLevels[data.allLevels.length - 1];
        let wagerNeededLastLevel = lastObject.wagerNeeded;
        if (data.wager >= wagerNeededLastLevel) {
          setCompleted(1);
        }
        else {
          setCompleted(0);
        }
        setLoading(false);
      } catch (error) {
        console.log("There was an error while loading user vip data:", error);
      }
    };

    setPreviousTotal(currentTotal);
    setCurrentTotal(user ? user?.wallet : 0.00); 

    setTimeout(() => {
      fetchData();
    }, 1000)
  }, [user?.wallet]);

  return (
    <div className={classes.root}>
      <header className={classes.header}>
        <div className={classes.logo}>
          <span className={classes.tokenName}>Jester (jest)</span>
        </div>
        <div className={classes.buttonGroup}>
          <motion.button
            className={`${classes.buttons} ${classes.learnMoreBtn}`}
            whileTap={{ scale: 0.97 }}
          >
            Learn More
          </motion.button>
          <motion.button
            className={`${classes.buttons} ${classes.buyBtn}`}
            whileTap={{ scale: 0.97 }}
          >
            Buy / Convert
          </motion.button>
        </div>
      </header>

      {/* <div className={classes.card}>
        <div className={classes.cardHeader}>
          <h2>Airdrop 1</h2>
        </div>
        <div className={classes.cardContent}>
          <div className={classes.progressBar}>
          <ProgressBar
                          variant="success"
                          animated
                          className={classes.progress}
                          min={vipData.currentLevel.wagerNeeded}
                          max={vipData.nextLevel.wagerNeeded}
                          now={vipData.wager}
                        />                 </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <span>0%</span>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className={classes.tokenIcon}></div>
              <span>0</span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div>Wager Unlock Rate: <span style={{ color: '#10B981' }}>$50.00</span> =</div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className={classes.tokenIcon}>$</div>
                <span style={{ fontSize: 24, fontWeight: 'bold' }}>1.00 SHFL</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div>Available To Claim</div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className={classes.tokenIcon}>$</div>
                <span style={{ fontSize: 24, fontWeight: 'bold' }}>0.00000000</span>
              </div>
            </div>
          </div>
        </div>
        <div className={classes.cardFooter}>
          <motion.button
            className={`${classes.button} ${classes.claimBtn}`}
            whileTap={{ scale: 0.97 }}
          >
            Claim
          </motion.button>
        </div>
      </div> */}

      <div className={classes.chartsWrapper}>
<div className={`${classes.card} ${classes.chartCard}`} style={{ position: 'relative' }}>
  <div className={classes.cardHeader}>
    <h3>$JEST Price</h3>
  </div>
  <div className={classes.cardContent} style={{ position: 'relative' }}>
    <div className={classes.chartContainer}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={priceData}>
          <XAxis dataKey="time" stroke="#4B5563" />
          <YAxis domain={['auto', 'auto']} stroke="#4B5563" />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#10B981" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
      <ComingSoonOverlay /> {/* Overlay positioned over the chart only */}
    </div>
  </div>
  <div className={classes.cardFooter}></div>
</div>

<div className={`${classes.card} ${classes.chartCard}`} style={{ position: 'relative' }}>
  <div className={classes.cardHeader}>
    <h3>Weekly $JEST Burnt</h3>
  </div>
  <div className={classes.cardContent} style={{ position: 'relative' }}>
    <div className={classes.chartContainer}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={burnData}>
          <XAxis dataKey="date" stroke="#4B5563" />
          <YAxis stroke="#4B5563" />
          <Tooltip />
          <Bar dataKey="amount" fill="hsl(215deg 100% 55.72%)" />
        </BarChart>
      </ResponsiveContainer>
      <ComingSoonOverlay /> {/* Overlay positioned over the chart only */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Airdrop.propTypes = {
    isAuthenticated: PropTypes.bool,
    isLoading: PropTypes.bool,
    user: PropTypes.object,
    logout: PropTypes.func.isRequired,
  };
  
  const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    isLoading: state.auth.isLoading,
    user: state.auth.user,
  });
  
  export default connect(mapStateToProps, { logout })(Airdrop);