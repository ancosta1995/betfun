'use client';

import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { v4 as uuidv4 } from 'uuid';
import { makeStyles } from '@material-ui/core/styles';

// Constants
const WIDTH = 760;
const HEIGHT = 570;
const PADDING_X = 52;
const PADDING_TOP = 36;
const PADDING_BOTTOM = 56;
const PIN_CATEGORY = 0x0001;
const BALL_CATEGORY = 0x0002;

const rowCountOptions = [8, 9, 10, 11, 12, 13, 14, 15, 16];

const RiskLevel = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

const binColor = {
  background: {
    red: { r: 255, g: 0, b: 63 },
    yellow: { r: 255, g: 192, b: 0 },
  },
  shadow: {
    red: { r: 166, g: 0, b: 4 },
    yellow: { r: 171, g: 121, b: 0 },
  },
};

function interpolateRgbColors(from, to, length) {
  return Array.from({ length }, (_, i) => ({
    r: Math.round(from.r + ((to.r - from.r) / (length - 1)) * i),
    g: Math.round(from.g + ((to.g - from.g) / (length - 1)) * i),
    b: Math.round(from.b + ((to.b - from.b) / (length - 1)) * i),
  }));
}

function getBinColors(rowCount) {
  const binCount = rowCount + 1;
  const isBinsEven = binCount % 2 === 0;
  const redToYellowLength = Math.ceil(binCount / 2);

  const redToYellowBg = interpolateRgbColors(
    binColor.background.red,
    binColor.background.yellow,
    redToYellowLength,
  ).map(({ r, g, b }) => `rgb(${r}, ${g}, ${b})`);

  const redToYellowShadow = interpolateRgbColors(
    binColor.shadow.red,
    binColor.shadow.yellow,
    redToYellowLength,
  ).map(({ r, g, b }) => `rgb(${r}, ${g}, ${b})`);

  return {
    background: [...redToYellowBg, ...redToYellowBg.reverse().slice(isBinsEven ? 0 : 1)],
    shadow: [...redToYellowShadow, ...redToYellowShadow.reverse().slice(isBinsEven ? 0 : 1)],
  };
}

const binColorsByRowCount = rowCountOptions.reduce(
  (acc, rowCount) => {
    acc[rowCount] = getBinColors(rowCount);
    return acc;
  },
  {}
);

const binPayouts = {
  8: {
    [RiskLevel.LOW]: [5.6, 2.1, 1.1, 1, 0.5, 1, 1.1, 2.1, 5.6],
    [RiskLevel.MEDIUM]: [13, 3, 1.3, 0.7, 0.4, 0.7, 1.3, 3, 13],
    [RiskLevel.HIGH]: [29, 4, 1.5, 0.3, 0.2, 0.3, 1.5, 4, 29],
  },
  16: {
    [RiskLevel.LOW]: [16, 9, 2, 1.4, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.4, 1.4, 2, 9, 16],
    [RiskLevel.MEDIUM]: [110, 41, 10, 5, 3, 1.5, 1, 0.5, 0.3, 0.5, 1, 1.5, 3, 5, 10, 41, 110],
    [RiskLevel.HIGH]: [1000, 130, 26, 9, 4, 2, 0.2, 0.2, 0.2, 0.2, 0.2, 2, 4, 9, 26, 130, 1000],
  },
};

const useStyles = makeStyles((theme) => ({
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      maxWidth: WIDTH,
      maxHeight: HEIGHT,
      overflow: 'hidden',
      margin: '0 auto',
    },
    canvasWrapper: {
      position: 'relative',
      width: '100%',
      height: '100%',
      zIndex: 0,
    },
    binsWrapper: {
      display: 'flex',
      gap: '1%',
      position: 'absolute',
      bottom: 0,
      zIndex: 1,
      marginBottom: theme.spacing(1),
      width: (props) => `${props.binsWidthPercentage * 107}%`,
      height: (props) => `${props.binsWidthPercentage * 5}%`,
    },
    bin: {
      display: 'flex',
      minWidth: 0,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '0.125rem',
      fontSize: 'clamp(6px, 2.784px + 0.87vw, 8px)',
      fontWeight: 'bold',
      color: theme.palette.text.primary,
      boxShadow: '0 2px var(--shadow-color)',
      [theme.breakpoints.up('lg')]: {
        borderRadius: '0.375rem',
        fontSize: 'clamp(10px, -16.944px + 2.632vw, 12px)',
        boxShadow: '0 3px var(--shadow-color)',
      },
    },
    controlsWrapper: {
      position: 'fixed',
      bottom: 100,
      left: 500,
      right: 0,
      backgroundColor: '#fff',
      padding: theme.spacing(2),
      boxShadow: '0 -4px 8px rgba(0, 0, 0, 0.1)',
      zIndex: 2,
    },
  }));
  const PlinkoGame = () => {
  const classes = useStyles({ binsWidthPercentage: 0.8 });

  const canvasRef = useRef(null);
  const binAnimations = useRef([]);
  const [engine, setEngine] = useState(null);
  const [render, setRender] = useState(null);
  const [runner, setRunner] = useState(null);
  const [rowCount, setRowCount] = useState(8);
  const [riskLevel, setRiskLevel] = useState(RiskLevel.MEDIUM);
  const [betAmount, setBetAmount] = useState(10);
  const [balance, setBalance] = useState(1000);
  const [winRecords, setWinRecords] = useState([]);
  const [isAnimationOn, setIsAnimationOn] = useState(true);
  const [binsWidthPercentage, setBinsWidthPercentage] = useState(0.8);

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = Matter.Engine.create({
      timing: { timeScale: 1 },
    });

    const renderOptions = {
        width: WIDTH,
        height: HEIGHT,
        background: '#050614',
        wireframes: false,
        showSleeping: false, // Hide sleeping bodies if they are not needed
      };
      
      const render = Matter.Render.create({
        canvas: canvasRef.current,
        engine: engine,
        options: renderOptions,
      });
      
    const runner = Matter.Runner.create();

    setEngine(engine);
    setRender(render);
    setRunner(runner);

    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
    };
  }, []);
  const removeOffscreenBalls = () => {
    const bodies = Matter.Composite.allBodies(engine.world);
    bodies.forEach(body => {
      if (body.label === 'Circle Body' && body.position.y > HEIGHT) {
        Matter.Composite.remove(engine.world, body);
        ballPool.push(body); // Reuse the ball
      }
    });
  };
  
  // Call this function in the game loop or periodically
  useEffect(() => {
    const interval = setInterval(removeOffscreenBalls, 1000);
    return () => clearInterval(interval);
  }, [engine]);
  

  const ballPool = [];

const createBall = (x, y) => {
  let ball = ballPool.pop();
  if (!ball) {
    ball = Matter.Bodies.circle(
      x,
      y,
      (24 - rowCount) / 2 * 2,
      {
        restitution: 0.8,
        friction: 0.5,
        frictionAir: 0.041,
        collisionFilter: { category: BALL_CATEGORY, mask: PIN_CATEGORY },
        render: { fillStyle: '#ff0000' },
      }
    );
  } else {
    Matter.Body.setPosition(ball, { x, y });
    ball.position = { x, y }; // Ensure position is updated
    ball.isStatic = false;
  }
  return ball;
};

  useEffect(() => {
    if (!engine || !render || !runner) return;

    const pins = [];
    const walls = [];
    let pinsLastRowXCoords = [];

    const pinDistanceX = (WIDTH - PADDING_X * 2) / (rowCount + 1);
    const pinRadius = (24 - rowCount) / 2;

    for (let row = 0; row < rowCount; ++row) {
      const rowY = PADDING_TOP + ((HEIGHT - PADDING_TOP - PADDING_BOTTOM) / (rowCount - 1)) * row;
      const rowPaddingX = PADDING_X + ((rowCount - 1 - row) * pinDistanceX) / 2;

      for (let col = 0; col < 3 + row; ++col) {
        const colX = rowPaddingX + ((WIDTH - rowPaddingX * 2) / (3 + row - 1)) * col;
        const pin = Matter.Bodies.circle(colX, rowY, pinRadius, {
          isStatic: true,
          render: { fillStyle: '#ffffff' },
          collisionFilter: { category: PIN_CATEGORY, mask: BALL_CATEGORY },
        });
        pins.push(pin);

        if (row === rowCount - 1) {
          pinsLastRowXCoords.push(pin.position.x);
        }
      }
    }

    const lastPinX = pinsLastRowXCoords[pinsLastRowXCoords.length - 1];
    setBinsWidthPercentage((lastPinX - pinsLastRowXCoords[0]) / WIDTH);

    const firstPinX = pins[0].position.x;
    const leftWallAngle = Math.atan2(
      firstPinX - pinsLastRowXCoords[0],
      HEIGHT - PADDING_TOP - PADDING_BOTTOM,
    );
    const leftWallX = firstPinX - (firstPinX - pinsLastRowXCoords[0]) / 2 - pinDistanceX * 0.25;

    const leftWall = Matter.Bodies.rectangle(leftWallX, HEIGHT / 2, 10, HEIGHT, {
      isStatic: true,
      angle: leftWallAngle,
      render: { visible: false },
    });
    const rightWall = Matter.Bodies.rectangle(WIDTH - leftWallX, HEIGHT / 2, 10, HEIGHT, {
      isStatic: true,
      angle: -leftWallAngle,
      render: { visible: false },
    });
    walls.push(leftWall, rightWall);

    const sensor = Matter.Bodies.rectangle(WIDTH / 2, HEIGHT, WIDTH, 10, {
      isSensor: true,
      isStatic: true,
      render: { visible: false },
    });

    Matter.Composite.add(engine.world, [...pins, ...walls, sensor]);

    Matter.Events.on(engine, 'collisionStart', ({ pairs }) => {
      pairs.forEach(({ bodyA, bodyB }) => {
        if (bodyA === sensor || bodyB === sensor) {
          const ball = bodyA === sensor ? bodyB : bodyA;
          handleBallEnterBin(ball, pinsLastRowXCoords);
        }
      });
    });

    Matter.Render.run(render);
    Matter.Runner.run(runner, engine);

    return () => {
      Matter.World.clear(engine.world, false);
    };
  }, [engine, render, runner, rowCount]);

  const handleBallEnterBin = (ball, pinsLastRowXCoords) => {
    const binIndex = pinsLastRowXCoords.findLastIndex((pinX) => pinX < ball.position.x);
    if (binIndex !== -1 && binIndex < pinsLastRowXCoords.length - 1) {
      const multiplier = binPayouts[rowCount][riskLevel][binIndex];
      const payoutValue = betAmount * multiplier;
      const profit = payoutValue - betAmount;
      console.log(rowCount)
      console.log(riskLevel)
      console.log("multiplier", multiplier)
      console.log(payoutValue)
      console.log(profit)
      setWinRecords((records) => [
        ...records,
        {
          id: uuidv4(),
          betAmount,
          rowCount,
          binIndex,
          payout: { multiplier, value: payoutValue },
          profit,
        },
      ]);
      setBalance((balance) => balance + payoutValue);
      playAnimation(binIndex);
    }

    Matter.Composite.remove(engine.world, ball);
  };

  const dropBall = () => {
    if (!engine) return;

    const ballOffsetRangeX = (WIDTH - PADDING_X * 2) / (rowCount + 1) * 0.8;
    const ballRadius = (24 - rowCount) / 2 * 2;

    const ball = Matter.Bodies.circle(
      Matter.Common.random(WIDTH / 2 - ballOffsetRangeX, WIDTH / 2 + ballOffsetRangeX),
      0,
      ballRadius,
      {
        restitution: 0.8,
        friction: 0.5,
        frictionAir: 0.041,
        collisionFilter: { category: BALL_CATEGORY, mask: PIN_CATEGORY },
        render: { fillStyle: '#ff0000' },
      },
    );

    Matter.Composite.add(engine.world, ball);
    setBalance((balance) => balance - betAmount);
  };

  const playAnimation = (binIndex) => {
    if (!isAnimationOn || !binAnimations.current[binIndex]) return;

    const animation = binAnimations.current[binIndex];

    animation.cancel();
    animation.play();
  };

  const initAnimation = (index, node) => {
    if (!node) return;

    const bounceAnimation = node.animate(
      [
        { transform: 'translateY(0)' },
        { transform: 'translateY(30%)' },
        { transform: 'translateY(0)' },
      ],
      {
        duration: 300,
        easing: 'cubic-bezier(0.18, 0.89, 0.32, 1.28)',
      },
    );
    bounceAnimation.pause();
    binAnimations.current[index] = bounceAnimation;
  };

  return (
    <div className={classes.container}>
      <canvas ref={canvasRef} className={classes.canvasWrapper} />
      <div className={classes.binsWrapper}>
        {Array.from({ length: rowCount + 1 }, (_, i) => (
          <div
            key={i}
            className={classes.bin}
            style={{
              backgroundColor: binColorsByRowCount[rowCount].background[i],
              boxShadow: `0 4px 8px ${binColorsByRowCount[rowCount].shadow[i]}`,
            }}
            ref={(node) => initAnimation(i, node)}
          >
            {binPayouts[rowCount][riskLevel][i]}
          </div>
        ))}
      </div>
      <div className={classes.controlsWrapper}>
        <div className="flex flex-col items-center space-y-4">
          <div className="flex space-x-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={dropBall}
              disabled={balance < betAmount}
            >
              Drop Ball
            </button>
            <select
              className="px-4 py-2 bg-gray-200 rounded"
              value={rowCount}
              onChange={(e) => setRowCount(Number(e.target.value))}
            >
              {rowCountOptions.map((count) => (
                <option key={count} value={count}>
                  {count} Rows
                </option>
              ))}
            </select>
            <select
              className="px-4 py-2 bg-gray-200 rounded"
              value={riskLevel}
              onChange={(e) => setRiskLevel(e.target.value)}
            >
              <option value={RiskLevel.LOW}>Low Risk</option>
              <option value={RiskLevel.MEDIUM}>Medium Risk</option>
              <option value={RiskLevel.HIGH}>High Risk</option>
            </select>
            <input
              type="number"
              className="px-4 py-2 bg-gray-200 rounded"
              value={betAmount}
              onChange={(e) => setBetAmount(Number(e.target.value))}
              min={1}
              max={100}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default PlinkoGame;
