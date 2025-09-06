import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ChevronLeft, X, ChevronUp, ChevronDown, Receipt, Trophy, Star, TrendingUp, Clock, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios'; // Import axios for API requests

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: '#0a0b14', 
    color: '#fff',
    paddingBottom: '400px',
    position: 'relative',
    margin: '0 auto', 
    minHeight: '100vh',
    backgroundImage: 'radial-gradient(circle at 50% 50%, #131426 0%, #0a0b14 100%)',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '100%',
      background: 'url(/noise.png) repeat',
      opacity: 0.02,
      pointerEvents: 'none',
    }
  },
  nav: {
    background: 'rgba(19, 20, 38, 0.98)',
    backdropFilter: 'blur(20px)',
    padding: '12px',
    position: 'sticky',
    top: 0,
    zIndex: 50,
    margin: '0 auto',
    width: '100%',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
    borderBottom: '1px solid rgba(255,255,255,0.03)',
  },
  navContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px', 
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 12px',
    flexWrap: 'wrap',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    flexWrap: 'wrap',
    '& span': {
      color: '#94a3b8',
      transition: 'all 0.2s',
      '&:last-child': {
        color: '#fff',
        fontWeight: 600,
      },
      '&:hover': {
        color: 'hsl(251.31deg 85% 60%)',
      }
    },
    '@media (max-width: 480px)': {
      fontSize: '11px',
      gap: '6px',
    }
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '16px 12px',
    width: '100%',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
    '@media (max-width: 640px)': {
      gridTemplateColumns: '1fr',
    }
  },
  matchHeader: {
    background: 'linear-gradient(135deg, rgba(19, 20, 38, 0.95) 0%, rgba(10, 11, 20, 0.95) 100%)',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '16px',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '100%',
      background: 'linear-gradient(45deg, rgba(89, 46, 255, 0.05), transparent)',
      pointerEvents: 'none',
    },
    '@media (max-width: 480px)': {
      padding: '16px',
    }
  },
  teamInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
    '@media (max-width: 480px)': {
      gap: '12px',
    }
  },
  score: {
    fontSize: '42px',
    fontWeight: '800',
    background: 'linear-gradient(to bottom, #fff, hsl(251.31deg 85% 60%))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 2px 15px rgba(89, 46, 255, 0.3)',
    letterSpacing: '-0.02em',
    '@media (max-width: 480px)': {
      fontSize: '34px',
    }
  },
  teamName: {
    fontSize: '22px',
    fontWeight: '700',
    background: 'linear-gradient(to right, #fff, #cbd5e1)',
    WebkitBackgroundClip: 'text', 
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.01em',
    '@media (max-width: 480px)': {
      fontSize: '18px',
    }
  },
  teamRank: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: '#94a3b8',
    background: 'rgba(255,255,255,0.05)',
    padding: '4px 8px',
    borderRadius: '12px',
    transition: 'all 0.2s',
    border: '1px solid rgba(255,255,255,0.03)',
    '&:hover': {
      background: 'rgba(255,255,255,0.1)',
      transform: 'translateY(-1px)',
    }
  },
  matchTime: {
    textAlign: 'right',
    background: 'rgba(0,0,0,0.2)',
    padding: '8px 12px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.03)',
    '& div:first-child': {
      fontSize: '24px',
      fontWeight: '700',
      color: 'hsl(251.31deg 85% 60%)',
      letterSpacing: '-0.02em',
      '@media (max-width: 480px)': {
        fontSize: '20px',
      }
    },
    '& div:last-child': {
      fontSize: '12px',
      color: '#94a3b8',
      marginTop: '2px',
    }
  },
  marketTabs: {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
    padding: '8px 0',
    '&::-webkit-scrollbar': {
      height: '4px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'hsl(251.31deg 85% 60%)',
      borderRadius: '4px',
    }
  },
  marketTab: {
    padding: '10px 18px',
    background: 'rgba(19, 20, 38, 0.95)',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: '1px solid rgba(255,255,255,0.05)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    '&:hover': {
      background: 'rgba(89, 46, 255, 0.1)',
      transform: 'translateY(-1px)',
      borderColor: 'rgba(89, 46, 255, 0.3)',
    },
    '&.active': {
      background: 'linear-gradient(135deg, hsl(251.31deg 85% 50%) 0%, hsl(251.31deg 85% 60%) 100%)',
      boxShadow: '0 4px 20px rgba(89, 46, 255, 0.3)',
      borderColor: 'transparent',
    }
  },
  marketGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '12px',
    marginTop: '16px'
  },
  marketRow: {
    background: 'rgba(19, 20, 38, 0.95)',
    borderRadius: '16px',
    padding: '16px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.05)',
    transition: 'all 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
      borderColor: 'rgba(89, 46, 255, 0.2)',
    }
  },
  marketHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '4px',
  },
  oddsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginTop: '12px',
    overflow: 'hidden'
  },
  oddsButton: {
    padding: '12px',
    background: 'rgba(10, 11, 20, 0.95)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '12px',
    color: '#fff',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s',
    '&:hover': {
      background: 'rgba(89, 46, 255, 0.1)',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      borderColor: 'rgba(89, 46, 255, 0.3)',
    }
  },
  oddsLabel: {
    fontSize: '12px',
    color: '#94a3b8',
    marginBottom: '6px'
  },
  oddsValue: {
    fontSize: '15px',
    fontWeight: '600',
    background: 'linear-gradient(to right, hsl(251.31deg 85% 60%), hsl(251.31deg 85% 75%))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.01em',
  },
  marketTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#94a3b8',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  betslip: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'rgba(19, 20, 38, 0.98)',
    backdropFilter: 'blur(20px)',
    borderTopLeftRadius: '20px',
    borderTopRightRadius: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    zIndex: 50,
    boxShadow: '0 -10px 40px rgba(0,0,0,0.4)',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  betslipHeader: {
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  betslipContent: {
    padding: '20px',
    overflow: 'hidden',
  },
  betCard: {
    background: 'rgba(10, 11, 20, 0.95)',
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '12px',
    position: 'relative',
    border: '1px solid rgba(255,255,255,0.05)',
    transition: 'all 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
      borderColor: 'rgba(89, 46, 255, 0.2)',
    }
  },
  removeButton: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: 'rgba(0,0,0,0.2)',
    border: '1px solid rgba(255,255,255,0.05)',
    color: '#94a3b8',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '50%',
    transition: 'all 0.2s',
    '&:hover': {
      color: '#fff',
      background: 'rgba(239, 68, 68, 0.9)',
      transform: 'rotate(90deg)',
      borderColor: 'transparent',
    }
  },
  stakeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '12px',
    marginTop: '20px',
  },
  stakeButton: {
    padding: '12px',
    background: 'rgba(10, 11, 20, 0.95)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '12px',
    color: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontWeight: '500',
    '&:hover': {
      background: 'rgba(89, 46, 255, 0.1)',
      transform: 'translateY(-2px)',
      borderColor: 'rgba(89, 46, 255, 0.3)',
    },
    '&.active': {
      background: 'linear-gradient(135deg, hsl(251.31deg 85% 50%) 0%, hsl(251.31deg 85% 60%) 100%)',
      boxShadow: '0 4px 20px rgba(89, 46, 255, 0.3)',
      borderColor: 'transparent',
    }
  },
  betSummary: {
    marginTop: '20px',
    background: 'rgba(10, 11, 20, 0.95)',
    borderRadius: '16px',
    padding: '16px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
    fontSize: '14px',
    '&:last-child': {
      marginBottom: 0,
      fontWeight: '600',
      color: 'hsl(251.31deg 85% 60%)',
      fontSize: '16px',
    }
  },
  placeBetButton: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, hsl(251.31deg 85% 50%) 0%, hsl(251.31deg 85% 60%) 100%)',
    border: 'none',
    borderRadius: '12px',
    color: '#fff',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '20px',
    transition: 'all 0.2s',
    fontSize: '15px',
    letterSpacing: '-0.01em',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 30px rgba(89, 46, 255, 0.3)',
    },
    '&:disabled': {
      background: 'rgba(10, 11, 20, 0.95)',
      cursor: 'not-allowed',
      transform: 'none',
      boxShadow: 'none',
    }
  }
}));

const api_key = "eyJhbGciOiJSUzI1NiIsImtpZCI6IkhKcDkyNnF3ZXBjNnF3LU9rMk4zV05pXzBrRFd6cEdwTzAxNlRJUjdRWDAiLCJ0eXAiOiJKV1QifQ.eyJhY2Nlc3NfdGllciI6InRyYWRpbmciLCJleHAiOjIwMjgwNDU1ODksImlhdCI6MTcxMjY4NTU4OSwianRpIjoiYjIxZGRjZGYtZjZmNy00NTg1LWFlZDItOTVhNTkwMmU2YmUxIiwic3ViIjoiMzEyMTg1NDgtY2U3MS00NWJiLTlmNTctNmE4YmI3NTI5NjY2IiwidGVuYW50IjoiY2xvdWRiZXQiLCJ1dWlkIjoiMzEyMTg1NDgtY2U3MS00NWJiLTlmNTctNmE4YmI3NTI5NjY2In0.1e8o2kkX_UEccVndkKZDUS0IER6pFJPaSpIR3dzb486PyfpbFq82UggU6goIj9g7hns8sB1HNV__9U6XXLStE_x2qWDd2ZoFwMTeZeuGyMBFqdUK3Z-GGAg-_uYr3wqRB9QbhHHrS_BXEyTpRoxuGLncY8Yq87XuyfH0KbTAjexJOqd6RoseKGLnkex2mAaCc53CrLJh2ysq8wvLtRAYDxCQQN7eCbhRm58TDjTFZKU49u3kokNy4JuwLgjubcqC7F1ibYXwLMGPYH6kSN2zkApje_kmw3SSpJ3HqXptfdy1bIsV-GvlSXStpFnz7btp2Jj2Dhv4E4Hqclt8bRQRng";

function App() {
  const classes = useStyles();
  const [activeMarket, setActiveMarket] = useState('main');
  const [isExpanded, setIsExpanded] = useState(true);
  const [stake, setStake] = useState('10');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedMarkets, setExpandedMarkets] = useState({
    '1X2': true,
    'Double Chance': true,
    'Both Teams to Score': true
  });
  const [selections, setSelections] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [totalOdds, setTotalOdds] = useState(1);
  const [potentialWin, setPotentialWin] = useState(0);

  useEffect(() => {
    // Fetch markets from Cloudbet API
    const fetchMarkets = async () => {
      try {
        const response = await axios.get('https://sports-api.cloudbet.com/v1/markets', {
          headers: {
            'Authorization': `Bearer ${api_key}`
          }
        });
        setMarkets(response.data);
      } catch (error) {
        console.error('Error fetching markets:', error);
      }
    };

    fetchMarkets();
  }, []);

  useEffect(() => {
    // Calculate total odds and potential win
    const odds = selections.reduce((acc, sel) => acc * sel.odds, 1);
    setTotalOdds(odds);
    setPotentialWin(parseFloat(stake) * odds);
  }, [selections, stake]);

  const removeBet = (id) => {
    setSelections(selections.filter(sel => sel.id !== id));
  };

  const toggleMarket = (market) => {
    setExpandedMarkets(prev => ({
      ...prev,
      [market]: !prev[market]
    }));
  };

  const quickStakes = [5, 10, 25, 50, 100];

  const handlePlaceBet = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('https://sports-api.cloudbet.com/v1/bets', {
        selections,
        stake: parseFloat(stake)
      }, {
        headers: {
          'Authorization': `Bearer ${api_key}`
        }
      });
      console.log('Bet placed:', response.data);
      setSelections([]);
      setStake('10');
    } catch (error) {
      console.error('Error placing bet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={classes.root}>
      <motion.nav 
        className={classes.nav}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className={classes.navContent}>
          <motion.div
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft size={20} />
          </motion.div>
          <div className={classes.breadcrumb}>
            <motion.span whileHover={{ scale: 1.05 }}>Soccer</motion.span>
            <span>/</span>
            <motion.span whileHover={{ scale: 1.05 }}>France</motion.span>
            <span>/</span>
            <motion.span whileHover={{ scale: 1.05 }}>Ligue 1</motion.span>
            <span>/</span>
            <motion.span whileHover={{ scale: 1.05 }}>AS Monaco - Angers</motion.span>
          </div>
          <motion.div 
            className={classes.liveIndicator}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div />
            <span>LIVE</span>
          </motion.div>
        </div>
      </motion.nav>

      <div className={classes.container}>
        <div className={classes.grid}>
          <div>
            <motion.div 
              className={classes.matchHeader}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className={classes.teamInfo}>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <div className={classes.teamName}>AS Monaco</div>
                  <div className={classes.teamRank}>
                    <Trophy size={14} />
                    <span>3rd Place</span>
                  </div>
                </motion.div>
                <motion.div 
                  className={classes.score}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  0 : 0
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <div className={classes.teamName}>Angers</div>
                  <div className={classes.teamRank}>
                    <Trophy size={14} />
                    <span>18th Place</span>
                  </div>
                </motion.div>
                <motion.div 
                  className={classes.matchTime}
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <div>15'</div>
                  <div>1st Half</div>
                </motion.div>
              </div>
            </motion.div>

            <div className={classes.marketTabs}>
              {markets.map((market, index) => {
                const Icon = market.icon;
                return (
                  <motion.div
                    key={market.id}
                    className={`${classes.marketTab} ${activeMarket === market.id ? 'active' : ''}`}
                    onClick={() => setActiveMarket(market.id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon size={16} />
                    {market.label}
                  </motion.div>
                );
              })}
            </div>

            <motion.div 
              className={classes.marketGrid}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div 
                className={classes.marketRow}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className={classes.marketHeader} onClick={() => toggleMarket('1X2')}>
                  <div className={classes.marketTitle}>
                    <Star size={16} />
                    1X2
                  </div>
                  <motion.div
                    animate={{ rotate: expandedMarkets['1X2'] ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={18} />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {expandedMarkets['1X2'] && (
                    <motion.div 
                      className={classes.oddsGrid}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.button 
                        className={classes.oddsButton}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className={classes.oddsLabel}>AS Monaco</div>
                        <div className={classes.oddsValue}>1.95</div>
                      </motion.button>
                      <motion.button 
                        className={classes.oddsButton}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className={classes.oddsLabel}>Draw</div>
                        <div className={classes.oddsValue}>3.60</div>
                      </motion.button>
                      <motion.button 
                        className={classes.oddsButton}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className={classes.oddsLabel}>Angers</div>
                        <div className={classes.oddsValue}>3.60</div>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div 
                className={classes.marketRow}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className={classes.marketHeader} onClick={() => toggleMarket('Double Chance')}>
                  <div className={classes.marketTitle}>
                    <TrendingUp size={16} />
                    Double Chance
                  </div>
                  <motion.div
                    animate={{ rotate: expandedMarkets['Double Chance'] ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={18} />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {expandedMarkets['Double Chance'] && (
                    <motion.div 
                      className={classes.oddsGrid}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.button 
                        className={classes.oddsButton}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className={classes.oddsLabel}>1X</div>
                        <div className={classes.oddsValue}>1.30</div>
                      </motion.button>
                      <motion.button 
                        className={classes.oddsButton}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className={classes.oddsLabel}>12</div>
                        <div className={classes.oddsValue}>1.35</div>
                      </motion.button>
                      <motion.button 
                        className={classes.oddsButton}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className={classes.oddsLabel}>X2</div>
                        <div className={classes.oddsValue}>1.80</div>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div 
                className={classes.marketRow}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className={classes.marketHeader} onClick={() => toggleMarket('Both Teams to Score')}>
                  <div className={classes.marketTitle}>
                    <Activity size={16} />
                    Both Teams to Score
                  </div>
                  <motion.div
                    animate={{ rotate: expandedMarkets['Both Teams to Score'] ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={18} />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {expandedMarkets['Both Teams to Score'] && (
                    <motion.div 
                      className={classes.oddsGrid}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.button 
                        className={classes.oddsButton}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className={classes.oddsLabel}>Yes</div>
                        <div className={classes.oddsValue}>1.12</div>
                      </motion.button>
                      <motion.button 
                        className={classes.oddsButton}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className={classes.oddsLabel}>No</div>
                        <div className={classes.oddsValue}>5.75</div>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div 
        className={classes.betslip}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <motion.div 
          className={classes.betslipHeader}
          onClick={() => setIsExpanded(!isExpanded)}
          whileHover={{ backgroundColor: 'rgba(12, 13, 21, 0.8)' }}
        >
          <motion.div 
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            whileHover={{ x: 5 }}
          >
            <Receipt size={16} />
            <span style={{ fontWeight: 600 }}>Betslip ({selections.length})</span>
          </motion.div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronUp size={16} />
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              className={classes.betslipContent}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {selections.map((selection) => (
                <motion.div 
                  key={selection.id} 
                  className={classes.betCard}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  layout
                >
                  <motion.button
                    onClick={() => removeBet(selection.id)}
                    className={classes.removeButton}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={12} />
                  </motion.button>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>{selection.match}</div>
                  <div style={{ fontWeight: 500 }}>{selection.market} - {selection.selection}</div>
                  <motion.div 
                    style={{ color: 'hsl(251.31deg 75% 50%)', fontWeight: 600, marginTop: 4 }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.3 }}
                  >
                    {selection.odds.toFixed(2)}
                  </motion.div>
                </motion.div>
              ))}

              <div className={classes.stakeGrid}>
                {quickStakes.map((amount) => (
                  <motion.button
                    key={amount}
                    onClick={() => setStake(amount.toString())}
                    className={`${classes.stakeButton} ${stake === amount.toString() ? 'active' : ''}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ${amount}
                  </motion.button>
                ))}
              </div>

              <motion.div 
                className={classes.betSummary}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className={classes.betSummary}>
                  <div className={classes.summaryRow}>
                    <span>Total Odds</span>
                    <span>{totalOdds.toFixed(2)}</span>
                  </div>
                  <div className={classes.summaryRow}>
                    <span>Stake</span>
                    <span>${stake}</span>
                  </div>
                  <div className={classes.summaryRow}>
                    <span>Potential Win</span>
                    <span>${potentialWin.toFixed(2)}</span>
                  </div>
                </div>

                <motion.button
                  className={classes.placeBetButton}
                  onClick={handlePlaceBet}
                  disabled={isLoading || selections.length === 0}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      ⟳
                    </motion.div>
                  ) : (
                    'Place Bet'
                  )}
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default App;