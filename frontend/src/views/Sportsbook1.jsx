import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from "@material-ui/core/styles";
import { Typography, CircularProgress } from '@material-ui/core';

const api_key = "eyJhbGciOiJSUzI1NiIsImtpZCI6IkhKcDkyNnF3ZXBjNnF3LU9rMk4zV05pXzBrRFd6cEdwTzAxNlRJUjdRWDAiLCJ0eXAiOiJKV1QifQ.eyJhY2Nlc3NfdGllciI6InRyYWRpbmciLCJleHAiOjIwMjgwNDU1ODksImlhdCI6MTcxMjY4NTU4OSwianRpIjoiYjIxZGRjZGYtZjZmNy00NTg1LWFlZDItOTVhNTkwMmU2YmUxIiwic3ViIjoiMzEyMTg1NDgtY2U3MS00NWJiLTlmNTctNmE4YmI3NTI5NjY2IiwidGVuYW50IjoiY2xvdWRiZXQiLCJ1dWlkIjoiMzEyMTg1NDgtY2U3MS00NWJiLTlmNTctNmE4YmI3NTI5NjY2In0.1e8o2kkX_UEccVndkKZDUS0IER6pFJPaSpIR3dzb486PyfpbFq82UggU6goIj9g7hns8sB1HNV__9U6XXLStE_x2qWDd2ZoFwMTeZeuGyMBFqdUK3Z-GGAg-_uYr3wqRB9QbhHHrS_BXEyTpRoxuGLncY8Yq87XuyfH0KbTAjexJOqd6RoseKGLnkex2mAaCc53CrLJh2ysq8wvLtRAYDxCQQN7eCbhRm58TDjTFZKU49u3kokNy4JuwLgjubcqC7F1ibYXwLMGPYH6kSN2zkApje_kmw3SSpJ3HqXptfdy1bIsV-GvlSXStpFnz7btp2Jj2Dhv4E4Hqclt8bRQRng";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#1A1D29',
    minHeight: '100vh',
    color: '#fff'
  },
  header: {
    backgroundColor: '#272A35',
    padding: theme.spacing(2),
    borderBottom: '1px solid #363945'
  },
  nav: {
    display: 'flex',
    gap: theme.spacing(3),
    padding: theme.spacing(1, 2),
    backgroundColor: '#20232D',
    borderBottom: '1px solid #363945'
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(1),
    color: '#8E8E8E',
    cursor: 'pointer',
    '&:hover': {
      color: '#fff'
    }
  },
  activeNavItem: {
    color: '#fff',
    borderBottom: '2px solid #6F4FF6'
  },
  content: {
    padding: theme.spacing(2)
  },
  matchRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2),
    backgroundColor: '#272A35',
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  teamNames: {
    flex: 1
  },
  odds: {
    display: 'flex',
    gap: theme.spacing(2)
  },
  oddsButton: {
    backgroundColor: '#363945',
    color: '#fff',
    padding: theme.spacing(1, 2),
    borderRadius: theme.spacing(0.5),
    border: 'none',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#4A4D59'
    }
  },
  liveTag: {
    backgroundColor: '#6F4FF6',
    color: '#fff',
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.spacing(0.5),
    fontSize: '0.75rem'
  }
}));

const Sportsbook = () => {
  const classes = useStyles();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('live');

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get(
          `https://sports-api.cloudbet.com/pub/v2/odds/events?sport=soccer&live=${activeTab === 'live'}&limit=20`,
          {
            headers: {
              "X-API-Key": api_key
            }
          }
        );
        setMatches(response.data.competitions.flatMap(c => c.events));
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchMatches();
  }, [activeTab]);

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography variant="h5">Sportsbook</Typography>
      </div>
      
      <div className={classes.nav}>
        <div 
          className={`${classes.navItem} ${activeTab === 'featured' ? classes.activeNavItem : ''}`}
          onClick={() => setActiveTab('featured')}
        >
          Featured
        </div>
        <div 
          className={`${classes.navItem} ${activeTab === 'live' ? classes.activeNavItem : ''}`}
          onClick={() => setActiveTab('live')}
        >
          Live
        </div>
        <div 
          className={`${classes.navItem} ${activeTab === 'upcoming' ? classes.activeNavItem : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming
        </div>
      </div>

      <div className={classes.content}>
        {loading ? (
          <CircularProgress />
        ) : (
          matches.map(match => (
            <div key={match.id} className={classes.matchRow}>
              <div className={classes.teamNames}>
                <Typography>{match.home.name} vs {match.away.name}</Typography>
                {activeTab === 'live' && (
                  <span className={classes.liveTag}>LIVE</span>
                )}
              </div>
              <div className={classes.odds}>
                {match.markets?.match_odds?.submarkets?.period?.selections?.map(selection => (
                  <button key={selection.outcome} className={classes.oddsButton}>
                    {selection.price}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sportsbook;
