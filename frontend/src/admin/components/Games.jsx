import React, { useState } from 'react';
import {
  makeStyles,
  Paper,
  Grid,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    backgroundColor: '#101123',
    color: '#fff',
    border: '1px solid #2f3947',
    padding: theme.spacing(3),
  },
  title: {
    color: '#9EA9BF',
    fontFamily: 'Poppins',
    fontSize: '18px',
    fontWeight: 500,
    marginBottom: theme.spacing(3),
  },
  section: {
    marginBottom: theme.spacing(4),
  },
  divider: {
    backgroundColor: '#2f3947',
    margin: theme.spacing(3, 0),
  },
  formControl: {
    marginBottom: theme.spacing(2),
    '& .MuiFormControlLabel-label': {
      color: '#fff',
      fontFamily: 'Poppins',
    },
  },
  textField: {
    marginBottom: theme.spacing(2),
    '& .MuiOutlinedInput-root': {
      color: '#fff',
      '& fieldset': {
        borderColor: '#2f3947',
      },
      '&:hover fieldset': {
        borderColor: '#2f3947',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#2f3947',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#9EA9BF',
    },
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#43A047',
    },
  },
}));

const Games = () => {
  const classes = useStyles();
  const [games, setGames] = useState({
    coinflip: {
      enabled: true,
      minBet: 1,
      maxBet: 1000,
      houseEdge: 3,
    },
    roulette: {
      enabled: true,
      minBet: 1,
      maxBet: 500,
      houseEdge: 2.7,
    },
    crash: {
      enabled: true,
      minBet: 1,
      maxBet: 200,
      houseEdge: 4,
    },
  });

  const handleToggleGame = (game) => {
    setGames({
      ...games,
      [game]: {
        ...games[game],
        enabled: !games[game].enabled,
      },
    });
  };

  const handleValueChange = (game, field, value) => {
    setGames({
      ...games,
      [game]: {
        ...games[game],
        [field]: value,
      },
    });
  };

  const renderGameSettings = (gameName, gameData) => (
    <div className={classes.section}>
      <Typography variant="h6" className={classes.title}>
        {gameName.charAt(0).toUpperCase() + gameName.slice(1)} Settings
      </Typography>
      <FormControlLabel
        className={classes.formControl}
        control={
          <Switch
            checked={gameData.enabled}
            onChange={() => handleToggleGame(gameName)}
            color="primary"
          />
        }
        label="Enable Game"
      />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            className={classes.textField}
            label="Minimum Bet"
            variant="outlined"
            fullWidth
            type="number"
            value={gameData.minBet}
            onChange={(e) =>
              handleValueChange(gameName, 'minBet', Number(e.target.value))
            }
            disabled={!gameData.enabled}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            className={classes.textField}
            label="Maximum Bet"
            variant="outlined"
            fullWidth
            type="number"
            value={gameData.maxBet}
            onChange={(e) =>
              handleValueChange(gameName, 'maxBet', Number(e.target.value))
            }
            disabled={!gameData.enabled}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            className={classes.textField}
            label="House Edge (%)"
            variant="outlined"
            fullWidth
            type="number"
            value={gameData.houseEdge}
            onChange={(e) =>
              handleValueChange(gameName, 'houseEdge', Number(e.target.value))
            }
            disabled={!gameData.enabled}
          />
        </Grid>
      </Grid>
      <Divider className={classes.divider} />
    </div>
  );

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        {Object.entries(games).map(([gameName, gameData]) =>
          renderGameSettings(gameName, gameData)
        )}
        <Button
          variant="contained"
          className={classes.saveButton}
          fullWidth
        >
          Save Changes
        </Button>
      </Paper>
    </div>
  );
};

export default Games;
