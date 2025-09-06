import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles, ThemeProvider, createTheme } from "@material-ui/core/styles";
import { 
  Typography,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle, 
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Drawer,
  Badge,
  Chip,
  Tabs,
  Tab,
  Paper,
  Divider,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Tooltip,
  Zoom,
  Collapse
} from '@material-ui/core';
import {
  ShoppingCart as CartIcon,
  SportsSoccer as SoccerIcon, 
  SportsBasketball as BasketballIcon,
  Casino as CasinoIcon,
  Star as StarIcon,
  Timeline as TimelineIcon,
  LiveTv as LiveIcon,
  Schedule as ScheduleIcon,
  Close as CloseIcon,
  TrendingUp as TrendingUpIcon,
  LocalAtm as MoneyIcon,
  Sports as SportsIcon,
  Notifications as NotificationsIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@material-ui/icons';

// Modern dark theme
const theme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#00BFA6',
      light: '#33CCB7',
      dark: '#008573'
    },
    secondary: {
      main: '#6C63FF'
    },
    background: {
      default: '#0A0A0A',
      paper: '#141414'
    },
    text: {
      primary: '#E0E0E0',
      secondary: 'rgba(224,224,224,0.7)'
    }
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: {
      fontWeight: 800
    },
    h2: {
      fontWeight: 700
    },
    h3: {
      fontWeight: 700
    },
    button: {
      textTransform: 'none',
      fontWeight: 600
    }
  },
  shape: {
    borderRadius: 12
  },
  overrides: {
    MuiPaper: {
      root: {
        backgroundImage: 'none',
        backgroundColor: '#141414',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(224,224,224,0.05)'
      }
    },
    MuiButton: {
      root: {
        borderRadius: 8,
        textTransform: 'none',
        fontWeight: 600,
        padding: '8px 20px'
      }
    },
    MuiChip: {
      root: {
        borderRadius: 8,
        height: 32
      }
    },
    MuiDialog: {
      paper: {
        borderRadius: 16,
        backgroundColor: '#141414'
      }
    }
  }
});

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
    color: theme.palette.text.primary,
    display: 'flex',
    flexDirection: 'column'
  },
  mainContent: {
    flex: '1 1 auto',
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1)
    }
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center', 
    padding: theme.spacing(2, 3),
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderBottom: '1px solid rgba(224,224,224,0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 1100,
    backdropFilter: 'blur(20px)',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1.5)
    }
  },
  logo: {
    fontSize: '1.75rem',
    fontWeight: 800,
    background: 'linear-gradient(45deg, #00BFA6, #6C63FF)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: 0.5,
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.25rem'
    }
  },
  nav: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    boxShadow: '0 4px 24px rgba(0,0,0,0.15)'
  },
  tabs: {
    '& .MuiTabs-indicator': {
      backgroundColor: theme.palette.primary.main,
      height: 3,
      borderRadius: '3px 3px 0 0'
    }
  },
  tab: {
    color: theme.palette.text.primary,
    minWidth: 100,
    fontWeight: 600,
    fontSize: '0.875rem',
    '&.Mui-selected': {
      color: theme.palette.primary.main
    },
    [theme.breakpoints.down('sm')]: {
      minWidth: 'auto',
      padding: theme.spacing(0.75)
    }
  },
  sportsNav: {
    display: 'flex',
    gap: theme.spacing(1),
    padding: theme.spacing(1.5, 0),
    overflowX: 'auto',
    '&::-webkit-scrollbar': {
      height: 4,
      backgroundColor: 'rgba(224,224,224,0.05)'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(224,224,224,0.1)',
      borderRadius: 2
    },
    scrollBehavior: 'smooth',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1, 0)
    }
  },
  sportChip: {
    backgroundColor: 'rgba(224,224,224,0.03)',
    color: theme.palette.text.primary,
    padding: theme.spacing(1, 2),
    transition: 'all 0.2s ease',
    fontWeight: 500,
    '&:hover': {
      backgroundColor: 'rgba(224,224,224,0.05)',
      transform: 'translateY(-1px)'
    },
    '&.active': {
      backgroundColor: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: theme.palette.primary.dark
      }
    }
  },
  matchGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr'
    }
  },
  matchCard: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    transition: 'all 0.2s ease',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid rgba(224,224,224,0.05)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
    }
  },
  matchHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2)
  },
  liveTag: {
    backgroundColor: theme.palette.primary.main,
    color: '#141414',
    padding: theme.spacing(0.25, 1),
    borderRadius: theme.shape.borderRadius,
    fontSize: '0.75rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    animation: '$pulse 2s infinite'
  },
  '@keyframes pulse': {
    '0%': {
      opacity: 1,
      transform: 'scale(1)'
    },
    '50%': {
      opacity: 0.9,
      transform: 'scale(0.98)'
    },
    '100%': {
      opacity: 1,
      transform: 'scale(1)'
    }
  },
  teams: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5)
  },
  team: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    padding: theme.spacing(1),
    backgroundColor: 'rgba(224,224,224,0.02)',
    borderRadius: theme.shape.borderRadius,
    transition: 'background-color 0.2s ease'
  },
  score: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: theme.palette.primary.main,
    marginLeft: 'auto',
    minWidth: 32,
    textAlign: 'center'
  },
  oddsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: theme.spacing(1),
    marginTop: theme.spacing(2)
  },
  oddsButton: {
    backgroundColor: 'rgba(224,224,224,0.02)',
    color: theme.palette.text.primary,
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    border: '1px solid rgba(224,224,224,0.03)',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(224,224,224,0.04)',
      transform: 'scale(1.01)'
    }
  },
  selectedOdd: {
    backgroundColor: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    color: '#141414',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark
    }
  },
  oddsLabel: {
    fontSize: '0.75rem',
    opacity: 0.9,
    marginBottom: theme.spacing(0.5),
    fontWeight: 500
  },
  oddsValue: {
    fontSize: '1rem',
    fontWeight: 700
  },
  betslip: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: 'rgba(20, 20, 20, 0.98)',
    borderLeft: '1px solid rgba(224,224,224,0.05)',
    padding: theme.spacing(2),
    transition: 'transform 0.2s ease-in-out',
    transform: 'translateX(100%)',
    '&.open': {
      transform: 'translateX(0)'
    },
    [theme.breakpoints.down('sm')]: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      maxWidth: '100%',
      transform: 'translateY(100%)',
      borderTop: '1px solid rgba(224,224,224,0.05)',
      borderLeft: 'none',
      '&.open': {
        transform: 'translateY(0)'
      }
    }
  },
  betslipHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    borderBottom: '1px solid rgba(224,224,224,0.05)',
    paddingBottom: theme.spacing(1.5)
  },
  betslipItem: {
    backgroundColor: 'rgba(224,224,224,0.02)',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    position: 'relative',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(224,224,224,0.03)'
    }
  },
  removeButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    color: '#FF3366',
    padding: 4,
    '&:hover': {
      backgroundColor: 'rgba(255,51,102,0.1)'
    }
  },
  totalSection: {
    marginTop: 'auto',
    padding: theme.spacing(2),
    backgroundColor: 'rgba(224,224,224,0.02)',
    borderRadius: theme.shape.borderRadius,
    border: '1px solid rgba(224,224,224,0.03)'
  },
  placeBetButton: {
    backgroundColor: '#FF3366',
    color: '#fff',
    padding: theme.spacing(1),
    fontWeight: 700,
    '&:hover': {
      backgroundColor: '#FF4778'
    }
  },
  betslipToggle: {
    position: 'fixed',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
    backgroundColor: theme.palette.primary.main,
    color: '#141414',
    padding: theme.spacing(1.5),
    borderRadius: '50%',
    boxShadow: '0 8px 32px rgba(0,191,166,0.2)',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
      transform: 'scale(1.05)'
    },
    transition: 'all 0.2s ease',
    zIndex: 1300,
    [theme.breakpoints.down('sm')]: {
      bottom: theme.spacing(2),
      right: theme.spacing(2)
    }
  },
  collapseButton: {
    marginLeft: 'auto',
    color: theme.palette.text.secondary,
    padding: theme.spacing(0.5)
  },
  additionalOdds: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1.5),
    backgroundColor: 'rgba(224,224,224,0.02)',
    borderRadius: theme.shape.borderRadius
  }
}));

const sports = [
  { id: 'soccer', label: 'Soccer', icon: <SoccerIcon /> },
  { id: 'basketball', label: 'Basketball', icon: <BasketballIcon /> },
  { id: 'casino', label: 'Casino', icon: <CasinoIcon /> },
  { id: 'trending', label: 'Trending', icon: <TrendingUpIcon /> },
  { id: 'esports', label: 'eSports', icon: <SportsIcon /> }
];

const Sportsbook = () => {
  const classes = useStyles();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [activeSport, setActiveSport] = useState('soccer');
  const [selectedBets, setSelectedBets] = useState([]);
  const [betAmount, setBetAmount] = useState('');
  const [betDialogOpen, setBetDialogOpen] = useState(false);
  const [betslipOpen, setBetslipOpen] = useState(false);
  const [expandedMatch, setExpandedMatch] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          'https://api.football-data.org/v2/matches',
          {
            headers: {
              'X-Auth-Token': process.env.REACT_APP_FOOTBALL_API_KEY
            }
          }
        );

        const transformedMatches = response.data.matches.map(match => ({
          id: match.id,
          home: { name: match.homeTeam.name },
          away: { name: match.awayTeam.name },
          score: match.score.fullTime ? {
            home: match.score.fullTime.homeTeam,
            away: match.score.fullTime.awayTeam
          } : null,
          markets: {
            match_odds: {
              submarkets: {
                period: {
                  selections: [
                    { outcome: '1', price: (Math.random() * 3 + 1).toFixed(2) },
                    { outcome: 'X', price: (Math.random() * 3 + 2).toFixed(2) },
                    { outcome: '2', price: (Math.random() * 3 + 1).toFixed(2) }
                  ]
                }
              }
            },
            both_teams_to_score: {
              selections: [
                { outcome: 'Yes', price: (Math.random() * 2 + 1.5).toFixed(2) },
                { outcome: 'No', price: (Math.random() * 2 + 1.5).toFixed(2) }
              ]
            },
            asian_handicap: {
              selections: [
                { outcome: '-1.5', price: (Math.random() * 3 + 2).toFixed(2) },
                { outcome: '+1.5', price: (Math.random() * 3 + 2).toFixed(2) }
              ]
            }
          },
          startTime: new Date(match.utcDate).toLocaleTimeString(),
          status: match.status
        }));

        setMatches(transformedMatches);
      } catch (error) {
        console.error(error);
        // Fallback data
        setMatches([
          {
            id: 1,
            home: { name: 'Real Madrid' },
            away: { name: 'Barcelona' },
            score: { home: 2, away: 1 },
            markets: {
              match_odds: {
                submarkets: {
                  period: {
                    selections: [
                      { outcome: '1', price: '1.95' },
                      { outcome: 'X', price: '3.50' },
                      { outcome: '2', price: '2.10' }
                    ]
                  }
                }
              },
              both_teams_to_score: {
                selections: [
                  { outcome: 'Yes', price: '1.85' },
                  { outcome: 'No', price: '1.95' }
                ]
              },
              asian_handicap: {
                selections: [
                  { outcome: '-1.5', price: '2.10' },
                  { outcome: '+1.5', price: '1.75' }
                ]
              }
            },
            startTime: '20:45',
            status: 'LIVE'
          }
        ]);
      }
      setLoading(false);
    };

    fetchMatches();
    const interval = setInterval(fetchMatches, 30000);
    return () => clearInterval(interval);
  }, [activeTab, activeSport]);

  const handleOddClick = (match, selection, market) => {
    const bet = {
      matchId: match.id,
      teams: `${match.home.name} vs ${match.away.name}`,
      selection: selection.outcome,
      odds: selection.price,
      market
    };

    setSelectedBets(prev => {
      const exists = prev.find(b => b.matchId === bet.matchId && b.market === bet.market);
      if (exists) {
        return prev.filter(b => !(b.matchId === bet.matchId && b.market === bet.market));
      }
      return [...prev, bet];
    });
  };

  const calculateTotalOdds = () => {
    return selectedBets.reduce((acc, bet) => acc * bet.odds, 1).toFixed(2);
  };

  const handlePlaceBet = () => {
    // API call to place bet would go here
    console.log('Placing bet:', {
      bets: selectedBets,
      amount: betAmount,
      totalOdds: calculateTotalOdds(),
      potentialWin: (betAmount * calculateTotalOdds()).toFixed(2)
    });
    setBetDialogOpen(false);
    setSelectedBets([]);
    setBetAmount('');
  };

  const toggleMatchExpand = (matchId) => {
    setExpandedMatch(expandedMatch === matchId ? null : matchId);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <div className={classes.mainContent}>
          <div className={classes.header}>
            <Typography className={classes.logo}>
              BetMaster Pro
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <IconButton color="inherit">
                <Badge badgeContent={3} color="primary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Badge badgeContent={selectedBets.length} color="primary">
                <CartIcon />
              </Badge>
            </Box>
          </div>

          <div className={classes.nav}>
            <Tabs 
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              className={classes.tabs}
              variant="fullWidth"
            >
              <Tab 
                icon={<StarIcon />} 
                label="Featured" 
                className={classes.tab}
              />
              <Tab 
                icon={<LiveIcon />} 
                label="Live" 
                className={classes.tab}
              />
              <Tab 
                icon={<ScheduleIcon />} 
                label="Upcoming" 
                className={classes.tab}
              />
              <Tab 
                icon={<MoneyIcon />} 
                label="Promotions" 
                className={classes.tab}
              />
            </Tabs>

            <div className={classes.sportsNav}>
              {sports.map(sport => (
                <Tooltip 
                  key={sport.id}
                  title={sport.label}
                  TransitionComponent={Zoom}
                  arrow
                >
                  <Chip
                    icon={sport.icon}
                    label={sport.label}
                    className={`${classes.sportChip} ${activeSport === sport.id ? 'active' : ''}`}
                    onClick={() => setActiveSport(sport.id)}
                    clickable
                  />
                </Tooltip>
              ))}
            </div>
          </div>

          <div className={classes.matchGrid}>
            {loading ? (
              <CircularProgress />
            ) : (
              matches.map(match => (
                <Paper key={match.id} className={classes.matchCard} elevation={0}>
                  <div className={classes.matchHeader}>
                    <Typography variant="caption" color="textSecondary">
                      {match.startTime}
                    </Typography>
                    {match.status === 'LIVE' && (
                      <div className={classes.liveTag}>
                        <LiveIcon fontSize="small" />
                        LIVE
                      </div>
                    )}
                    <IconButton
                      className={classes.collapseButton}
                      onClick={() => toggleMatchExpand(match.id)}
                      size="small"
                    >
                      {expandedMatch === match.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </div>

                  <div className={classes.teams}>
                    <div className={classes.team}>
                      <Typography>{match.home.name}</Typography>
                      {match.score && (
                        <Typography className={classes.score}>
                          {match.score.home}
                        </Typography>
                      )}
                    </div>
                    <div className={classes.team}>
                      <Typography>{match.away.name}</Typography>
                      {match.score && (
                        <Typography className={classes.score}>
                          {match.score.away}
                        </Typography>
                      )}
                    </div>
                  </div>

                  <div className={classes.oddsContainer}>
                    {match.markets?.match_odds?.submarkets?.period?.selections?.map(selection => {
                      const isSelected = selectedBets.some(
                        bet => bet.matchId === match.id && bet.market === 'match_odds' && bet.selection === selection.outcome
                      );
                      return (
                        <button
                          key={selection.outcome}
                          className={`${classes.oddsButton} ${isSelected ? classes.selectedOdd : ''}`}
                          onClick={() => handleOddClick(match, selection, 'match_odds')}
                        >
                          <span className={classes.oddsLabel}>
                            {selection.outcome === '1' ? 'Home' : 
                             selection.outcome === '2' ? 'Away' : 'Draw'}
                          </span>
                          <span className={classes.oddsValue}>
                            {selection.price}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <Collapse in={expandedMatch === match.id}>
                    <div className={classes.additionalOdds}>
                      <Typography variant="subtitle2" gutterBottom>
                        Both Teams to Score
                      </Typography>
                      <div className={classes.oddsContainer}>
                        {match.markets?.both_teams_to_score?.selections?.map(selection => {
                          const isSelected = selectedBets.some(
                            bet => bet.matchId === match.id && bet.market === 'both_teams_to_score' && bet.selection === selection.outcome
                          );
                          return (
                            <button
                              key={selection.outcome}
                              className={`${classes.oddsButton} ${isSelected ? classes.selectedOdd : ''}`}
                              onClick={() => handleOddClick(match, selection, 'both_teams_to_score')}
                            >
                              <span className={classes.oddsLabel}>{selection.outcome}</span>
                              <span className={classes.oddsValue}>{selection.price}</span>
                            </button>
                          );
                        })}
                      </div>

                      <Typography variant="subtitle2" gutterBottom style={{marginTop: '16px'}}>
                        Asian Handicap
                      </Typography>
                      <div className={classes.oddsContainer}>
                        {match.markets?.asian_handicap?.selections?.map(selection => {
                          const isSelected = selectedBets.some(
                            bet => bet.matchId === match.id && bet.market === 'asian_handicap' && bet.selection === selection.outcome
                          );
                          return (
                            <button
                              key={selection.outcome}
                              className={`${classes.oddsButton} ${isSelected ? classes.selectedOdd : ''}`}
                              onClick={() => handleOddClick(match, selection, 'asian_handicap')}
                            >
                              <span className={classes.oddsLabel}>{selection.outcome}</span>
                              <span className={classes.oddsValue}>{selection.price}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </Collapse>
                </Paper>
              ))
            )}
          </div>
        </div>

        <Dialog
          open={betslipOpen}
          onClose={() => setBetslipOpen(false)}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            style: {
              backgroundColor: '#141824',
              color: '#fff',
              padding: theme.spacing(2)
            }
          }}
        >
          <div className={classes.betslipHeader}>
            <Typography variant="h6">
              Betslip ({selectedBets.length})
            </Typography>
            <IconButton onClick={() => setBetslipOpen(false)}>
              <CloseIcon style={{ color: '#FF3366' }} />
            </IconButton>
          </div>

          {selectedBets.map(bet => (
            <div key={bet.matchId} className={classes.betslipItem}>
              <IconButton
                size="small"
                className={classes.removeButton}
                onClick={() => setSelectedBets(prev => prev.filter(b => b.matchId !== bet.matchId))}
              >
                ×
              </IconButton>
              <Typography variant="body2">{bet.teams}</Typography>
              <Typography>
                {bet.selection === '1' ? 'Home Win' :
                 bet.selection === '2' ? 'Away Win' : 'Draw'}
              </Typography>
              <Typography variant="h6" color="primary">
                {bet.odds}
              </Typography>
            </div>
          ))}

          {selectedBets.length > 0 && (
            <div className={classes.totalSection}>
              <Typography gutterBottom>
                Total Odds: {calculateTotalOdds()}
              </Typography>
              <Button
                variant="contained"
                fullWidth
                className={classes.placeBetButton}
                onClick={() => setBetDialogOpen(true)}
              >
                Place Bet
              </Button>
            </div>
          )}
        </Dialog>

        <IconButton
          className={classes.betslipToggle}
          onClick={() => setBetslipOpen(true)}
        >
          <Badge badgeContent={selectedBets.length} color="secondary">
            <CartIcon />
          </Badge>
        </IconButton>

        <Dialog 
          open={betDialogOpen} 
          onClose={() => setBetDialogOpen(false)}
          PaperProps={{
            style: {
              backgroundColor: '#141824',
              color: '#fff'
            }
          }}
        >
          <DialogTitle>Place Bet</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Bet Amount"
              type="number"
              fullWidth
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              InputProps={{
                style: { color: '#fff' }
              }}
              InputLabelProps={{
                style: { color: '#fff' }
              }}
            />
            <Typography style={{ marginTop: 16 }}>
              Potential Win: {betAmount ? (betAmount * calculateTotalOdds()).toFixed(2) : '0.00'}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBetDialogOpen(false)} style={{ color: '#fff' }}>
              Cancel
            </Button>
            <Button 
              onClick={handlePlaceBet} 
              className={classes.placeBetButton}
              variant="contained"
            >
              Confirm Bet
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </ThemeProvider>
  );
};

export default Sportsbook;
