import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

// MUI Components
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    background: "#0c0d15",
    borderRadius: 8,
    width: "100%",
    height: "280px",
    marginTop: "10px",
    border: "1px solid #1a1b25",
    [theme.breakpoints.down("sm")]: {
      height: "240px",
    },
    [theme.breakpoints.down("xs")]: {
      height: "220px",
    },
  },
  betAmount: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    borderBottom: "1px solid #1a1b25",
    background: "#0f1016",
    "& .label": {
      color: "#6b6f8a",
      fontSize: "13px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontWeight: 500,
    },
    "& .amount": {
      color: "#fff",
      fontSize: "13px",
      fontWeight: 500,
      "& .currency": {
        color: "#6b6f8a",
        marginLeft: "4px",
      },
    },
  },
  bets: {
    flex: 1,
    overflowY: "auto",
    "&::-webkit-scrollbar": {
      width: "4px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#282a3e",
      borderRadius: "2px",
    },
  },
  bet: {
    display: "grid",
    gridTemplateColumns: "auto 1fr repeat(2, 75px)",
    gap: "8px",
    padding: "8px 12px",
    alignItems: "center",
    transition: "background 0.2s",
    "&:hover": {
      background: "#0f1016",
    },
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    minWidth: 0,
    "& .level": {
      background: "#0f1016",
      padding: "3px 6px",
      borderRadius: "4px",
      fontSize: "11px",
      color: "#6b6f8a",
      fontWeight: 500,
      flexShrink: 0,
    },
    "& .name": {
      color: "#fff",
      fontSize: "13px",
      fontWeight: 500,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      minWidth: 0,
    },
  },
  multiplier: {
    color: "#7a7f9b",
    fontSize: "13px",
    textAlign: "right",
    fontWeight: 500,
    flexShrink: 0,
  },
  amount: {
    fontSize: "13px",
    textAlign: "right",
    fontWeight: 500,
    flexShrink: 0,
    "&.win": {
      color: "#45b26b",
    },
    "&.bet": {
      color: "#7a7f9b",
    },
    "& .currency": {
      marginLeft: "2px",
      fontSize: "11px",
      opacity: 0.8,
    },
  },
}));

const Bets = ({ players, loading }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <div className={classes.betAmount}>
        <span className="label">
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
          </svg>
          ALL BETS
        </span>
        <span className="amount">
          {loading ? "Loading..." : (
            <>
              {players.map(p => parseFloat(p.betAmount)).reduce((a, b) => a + b, 0).toFixed(2)}
              <span className="currency">USD</span>
            </>
          )}
        </span>
      </div>

      <div className={classes.bets}>
        {players
          .sort((a, b) => b.betAmount - a.betAmount)
          .map(player => (
            <div key={player.playerID} className={classes.bet}>
              <Avatar 
                className={classes.avatar} 
                src={player.avatar} 
                variant="rounded"
              />
              
              <div className={classes.userInfo}>
                <span className="level">{player.level.name}</span>
                <span className="name">{player.username}</span>
              </div>

              <div className={classes.multiplier}>
                {player.stoppedAt && `${(player.stoppedAt / 100).toFixed(2)}x`}
              </div>

              <div className={`${classes.amount} ${player.winningAmount ? 'win' : 'bet'}`}>
                {player.winningAmount ? 
                  `+${player.winningAmount.toFixed(2)}` : 
                  player.betAmount.toFixed(2)
                }
                <span className="currency">USD</span>
              </div>
            </div>
          ))}
      </div>
    </Box>
  );
};

Bets.propTypes = {
  players: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default Bets;
