import React, { useState, useEffect } from 'react';
import { Box, Button, ButtonGroup, Typography, OutlinedInput, InputAdornment, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  gameContainer: {
    minHeight: '600px',
    position: 'relative',
    borderRadius: '8px',
    background: '#212637',
    overflow: 'hidden',
  },
  gameContentPlinko: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plinkoContainer: {
    position: 'relative',
    width: '600px',
    display: 'block',
    paddingBottom: '600px',
    height: 0,
    overflow: 'hidden',
    [theme.breakpoints.down('1400')]: {
      width: '500px',
      paddingBottom: '500px',
    },
    [theme.breakpoints.down('767')]: {
      width: '85vmin',
      paddingBottom: '85vmin',
    },
  },
  pin: {
    backgroundColor: theme.palette.primary.main,
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    position: 'absolute',
  },
  ball: {
    backgroundColor: 'yellow',
    width: '15px',
    height: '15px',
    borderRadius: '50%',
    position: 'absolute',
    transition: 'top 0.3s, left 0.3s',
  },
  bucket: {
    color: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'default',
    fontSize: '0.9em',
    position: 'absolute',
    bottom: '0',
    width: '10%',
    height: '50px',
    backgroundColor: '#fff',
    border: '1px solid #000',
  },
}));

const Plinko = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(10);
  const [difficulty, setDifficulty] = useState('high');
  const [pins, setPins] = useState(16);
  const [ballPosition, setBallPosition] = useState({ top: 0, left: 50 });
  const [buckets, setBuckets] = useState(Array(9).fill(0));
  const [gameStarted, setGameStarted] = useState(false);

  const difficulties = ['low', 'medium', 'high'];
  const numberPins = [8, 10, 12, 14, 16];
  const speed = 300;

  useEffect(() => {
    if (gameStarted) {
      // Simulate ball falling
      let currentTop = 0;
      let currentLeft = 50; // Start in the middle
      const interval = setInterval(() => {
        currentTop += 10;
        currentLeft += Math.random() > 0.5 ? 10 : -10; // Random left or right
        setBallPosition({ top: currentTop, left: currentLeft });

        if (currentTop >= 90) { // Ball reached the bottom
          clearInterval(interval);
          setLoading(false);
          setGameStarted(false);
          const bucketIndex = Math.floor(currentLeft / 10);
          buckets[bucketIndex] += 1;
          setBuckets([...buckets]);
          alert(`You landed in bucket ${bucketIndex}!`);
        }
      }, 300);
    }
  }, [gameStarted]);

  const onPlay = () => {
    const betAmount = amount;
    if (betAmount < 1 || betAmount > 100) {
      alert('Maximum bet is 100, and minimum bet is 1.');
      return;
    }
    setLoading(true);
    setGameStarted(true);
  };
  const hex = {
    0: ['#ffc000', '#997300'],
    1: ['#ffa808', '#a16800'],
    2: ['#ffa808', '#a95b00'],
    3: ['#ff9010', '#a95b00'],
    4: ['#ff7818', '#914209'],
    5: ['#ff6020', '#b93500'],
    6: ['#ff4827', '#c01d00'],
    7: ['#ff302f', '#c80100'],
    8: ['#ff1837', '#91071c'],
    9: ['#ff003f', '#990026']
  };

  const colors = {
    8: [hex[9], hex[7], hex[4], hex[2], hex[0], hex[2], hex[4], hex[7], hex[9]],
    9: [hex[9], hex[7], hex[6], hex[5], hex[2], hex[2], hex[5], hex[6], hex[7], hex[9]],
    10: [hex[9], hex[8], hex[7], hex[5], hex[4], hex[1], hex[4], hex[5], hex[7], hex[8], hex[9]],
    11: [hex[9], hex[8], hex[7], hex[5], hex[4], hex[2], hex[2], hex[4], hex[5], hex[7], hex[8], hex[9]],
    12: [hex[9], hex[8], hex[7], hex[6], hex[5], hex[4], hex[1], hex[4], hex[5], hex[6], hex[7], hex[8], hex[9]],
    13: [hex[9], hex[8], hex[7], hex[6], hex[5], hex[4], hex[2], hex[2], hex[4], hex[5], hex[6], hex[7], hex[8], hex[9]],
    14: [hex[9], hex[8], hex[7], hex[6], hex[5], hex[4], hex[3], hex[2], hex[3], hex[4], hex[5], hex[6], hex[7], hex[8], hex[9]],
    15: [hex[9], hex[8], hex[7], hex[6], hex[5], hex[4], hex[3], hex[2], hex[2], hex[3], hex[4], hex[5], hex[6], hex[7], hex[8], hex[9]],
    16: [
      hex[9],
      hex[8],
      hex[7],
      hex[6],
      hex[5],
      hex[4],
      hex[3],
      hex[2],
      hex[1],
      hex[2],
      hex[3],
      hex[4],
      hex[5],
      hex[6],
      hex[7],
      hex[8],
      hex[9]
    ]
  };

  const gameData = {
    low: {
      8: [5.6, 2.1, 1.1, 1, 0.5, 1, 1.1, 2.1, 5.6],
      10: [8.9, 3, 1.4, 1.1, 1, 0.5, 1, 1.1, 1.4, 3, 8.9],
      12: [10, 3, 1.6, 1.4, 1.1, 1, 0.5, 1, 1.1, 1.4, 1.6, 3, 10],
      14: [7.1, 4, 1.9, 1.4, 1.3, 1.1, 1, 0.5, 1, 1.1, 1.3, 1.4, 1.9, 4, 7.1],
      16: [16, 9, 2, 1.4, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.4, 1.4, 2, 9, 16]
    },
    medium: {
      8: [13, 3, 1.3, 0.7, 0.4, 0.7, 1.3, 3, 13],
      10: [22, 5, 2, 1.4, 0.6, 0.4, 0.6, 1.4, 2, 5, 22],
      12: [33, 11, 4, 2, 1.1, 0.6, 0.3, 0.6, 1.1, 2, 4, 11, 33],
      14: [58, 15, 7, 4, 1.9, 1, 0.5, 0.2, 0.5, 1, 1.9, 4, 7, 15, 58],
      16: [110, 41, 1, 5, 3, 1.5, 1, 0.5, 0.3, 0.5, 1, 1.5, 3, 5, 10, 41, 110]
    },
    high: {
      8: [29, 4, 1.5, 0.3, 0.2, 0.3, 1.5, 4, 29],
      10: [76, 10, 3, 0.9, 0.3, 0.2, 0.3, 0.9, 3, 10, 76],
      12: [170, 24, 8.1, 2, 0.7, 0.3, 0.2, 0.3, 0.7, 2, 8.1, 24, 170],
      14: [420, 56, 18, 5, 1.9, 0.3, 0.2, 0.1, 0.2, 0.3, 1.9, 5, 18, 56, 420],
      16: [1000, 130, 26, 9, 4, 2, 0.3, 0.2, 0.1, 0.2, 0.3, 2, 4, 9, 26, 130, 1000]
    }
  };


  const renderPins = () => {
    const rows = [];
    for (let row = 0; row < pins; row++) {
      for (let col = 0; col <= row; col++) {
        const left = (50 - row * 5) + col * 10; // Calculating the left position of the pin
        const top = row * 8; // Vertical spacing between rows
        rows.push(<div key={`pin-${row}-${col}`} className={classes.pin} style={{ top: `${top}%`, left: `${left}%` }} />);
      }
    }
    return rows;
  };

  const renderBuckets = () => {
    return buckets.map((value, index) => (
      <div key={`bucket-${index}`} className={classes.bucket} style={{ left: `${index * 10}%` }}>
        {value}
      </div>
    ));
  };

  return (
    <Grid container direction="column" spacing={4} className={classes.gameContainer}>
      <Grid item>
        <Typography variant="h5">Plinko Game</Typography>
      </Grid>

      <Grid item>
        <Box>
          <Typography variant="subtitle1">Select Difficulty</Typography>
          <ButtonGroup
            exclusive
            value={difficulty}
            onChange={(event, newDifficulty) => setDifficulty(newDifficulty)}
          >
            {difficulties.map((diff) => (
              <Button
                key={diff}
                variant={difficulty === diff ? 'contained' : 'outlined'}
                onClick={() => setDifficulty(diff)}
              >
                {diff}
              </Button>
            ))}
          </ButtonGroup>
        </Box>
      </Grid>

      <Grid item>
        <OutlinedInput
          fullWidth
          value={amount}
          type="number"
          onChange={(event) => setAmount(event.target.value)}
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
        />
      </Grid>

      <Grid item>
        <Button variant="contained" disabled={loading} onClick={onPlay} style={{ height: '100px' }}>
          {loading ? 'Loading...' : 'Play'}
        </Button>
      </Grid>

      <Grid item>
        <Box style={{ position: 'relative', width: '100%', height: '500px' }}>
          <div className={classes.plinkoContainer}>
            <div className={classes.plinko}>
              {renderPins()}
              <div className={classes.ball} style={{ top: `${ballPosition.top}%`, left: `${ballPosition.left}%` }} />
              {renderBuckets()}
            </div>
          </div>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Plinko;
