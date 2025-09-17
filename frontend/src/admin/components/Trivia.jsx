import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  Paper,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import { useToasts } from 'react-toast-notifications';
import { getActiveTrivia, createTrivia, endTrivia } from '../../services/api.service';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    backgroundColor: '#101123',
    color: '#fff',
    border: '1px solid #2f3947',
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  title: {
    color: '#9EA9BF',
    fontFamily: 'Poppins',
    fontSize: '18px',
    fontWeight: 500,
    marginBottom: theme.spacing(3),
  },
  formControl: {
    marginBottom: theme.spacing(2),
    width: '100%',
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
  createButton: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    marginTop: theme.spacing(2),
    '&:hover': {
      backgroundColor: '#43A047',
    },
  },
  endButton: {
    backgroundColor: '#f44336',
    color: '#fff',
    marginTop: theme.spacing(2),
    '&:hover': {
      backgroundColor: '#d32f2f',
    },
  },
  activeTrivia: {
    backgroundColor: '#050614',
    border: '1px solid #2f3947',
    padding: theme.spacing(2),
    borderRadius: '4px',
    marginBottom: theme.spacing(2),
  },
  triviaInfo: {
    marginBottom: theme.spacing(1),
  },
  triviaLabel: {
    color: '#9EA9BF',
    fontWeight: 500,
    display: 'inline-block',
    width: '120px',
  },
  triviaValue: {
    color: '#fff',
  },
}));

const Trivia = () => {
  const classes = useStyles();
  const { addToast } = useToasts();
  const [activeTrivia, setActiveTrivia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newTrivia, setNewTrivia] = useState({
    question: '',
    answer: '',
    winnerAmount: 1,
    prize: 0,
  });

  // Fetch active trivia
  useEffect(() => {
    const fetchActiveTrivia = async () => {
      try {
        setLoading(true);
        const data = await getActiveTrivia();
        setActiveTrivia(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching active trivia:', error);
        addToast('Failed to fetch active trivia', { appearance: 'error' });
        setLoading(false);
      }
    };

    fetchActiveTrivia();
  }, [addToast]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewTrivia({
      ...newTrivia,
      [name]: value,
    });
  };

  const handleCreateTrivia = async () => {
    try {
      await createTrivia(newTrivia);
      addToast('Trivia created successfully', { appearance: 'success' });
      // Refresh active trivia
      const data = await getActiveTrivia();
      setActiveTrivia(data);
      // Reset form
      setNewTrivia({
        question: '',
        answer: '',
        winnerAmount: 1,
        prize: 0,
      });
    } catch (error) {
      console.error('Error creating trivia:', error);
      addToast('Failed to create trivia: ' + (error.response?.data?.error || error.message), { appearance: 'error' });
    }
  };

  const handleEndTrivia = async () => {
    try {
      await endTrivia();
      addToast('Trivia ended successfully', { appearance: 'success' });
      // Refresh active trivia
      const data = await getActiveTrivia();
      setActiveTrivia(data);
    } catch (error) {
      console.error('Error ending trivia:', error);
      addToast('Failed to end trivia: ' + (error.response?.data?.error || error.message), { appearance: 'error' });
    }
  };

  if (loading) {
    return (
      <div className={classes.root}>
        <p style={{ color: '#fff' }}>Loading trivia...</p>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      {activeTrivia ? (
        <Paper className={classes.paper}>
          <Typography className={classes.title}>Active Trivia</Typography>
          <div className={classes.activeTrivia}>
            <div className={classes.triviaInfo}>
              <span className={classes.triviaLabel}>Question:</span>
              <span className={classes.triviaValue}>{activeTrivia.question}</span>
            </div>
            <div className={classes.triviaInfo}>
              <span className={classes.triviaLabel}>Answer:</span>
              <span className={classes.triviaValue}>{activeTrivia.answer}</span>
            </div>
            <div className={classes.triviaInfo}>
              <span className={classes.triviaLabel}>Prize:</span>
              <span className={classes.triviaValue}>${activeTrivia.prize}</span>
            </div>
            <div className={classes.triviaInfo}>
              <span className={classes.triviaLabel}>Winners:</span>
              <span className={classes.triviaValue}>{activeTrivia.winnerAmount}</span>
            </div>
            <div className={classes.triviaInfo}>
              <span className={classes.triviaLabel}>Created:</span>
              <span className={classes.triviaValue}>
                {new Date(activeTrivia.created).toLocaleString()}
              </span>
            </div>
          </div>
          <Button
            variant="contained"
            className={classes.endButton}
            onClick={handleEndTrivia}
          >
            End Trivia
          </Button>
        </Paper>
      ) : (
        <Paper className={classes.paper}>
          <Typography className={classes.title}>No Active Trivia</Typography>
          <p style={{ color: '#9EA9BF' }}>There is currently no active trivia game.</p>
        </Paper>
      )}

      <Paper className={classes.paper}>
        <Typography className={classes.title}>Create New Trivia</Typography>
        <TextField
          className={classes.formControl}
          label="Question"
          variant="outlined"
          fullWidth
          name="question"
          value={newTrivia.question}
          onChange={handleInputChange}
        />
        <TextField
          className={classes.formControl}
          label="Answer"
          variant="outlined"
          fullWidth
          name="answer"
          value={newTrivia.answer}
          onChange={handleInputChange}
        />
        <TextField
          className={classes.formControl}
          label="Prize ($)"
          variant="outlined"
          fullWidth
          type="number"
          name="prize"
          value={newTrivia.prize}
          onChange={handleInputChange}
        />
        <FormControl className={classes.formControl} variant="outlined">
          <InputLabel>Number of Winners</InputLabel>
          <Select
            name="winnerAmount"
            value={newTrivia.winnerAmount}
            onChange={handleInputChange}
            label="Number of Winners"
          >
            {[1, 2, 3, 5, 10].map((num) => (
              <MenuItem key={num} value={num}>
                {num}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          className={classes.createButton}
          onClick={handleCreateTrivia}
          disabled={!newTrivia.question || !newTrivia.answer || newTrivia.prize <= 0}
        >
          Create Trivia
        </Button>
      </Paper>
    </div>
  );
};

export default Trivia;