import React, { useEffect, useRef, useState, useMemo } from 'react';
import { makeStyles } from "@material-ui/core";
import coin from "../../assets/icons/coin.png";
import debounce from 'lodash.debounce';
import { useSpring, animated } from 'react-spring';
import { BsFillRocketFill } from "react-icons/bs";
import {TimerBar} from "../../views/TimerBar.js";

const useStyles = makeStyles(theme => ({
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#0c0d15',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
  },
  meta: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    color: '#e4e4e4',
    zIndex: 2,
    padding: props => props.isMobile ? '15px' : '20px',
    borderRadius: '10px',
    backdropFilter: 'blur(4px)',
    backgroundColor: 'rgba(26,29,41,0.7)',
  },
  payout: {
    fontFamily: 'Rubik',
    fontSize: props => props.isMobile ? '36px' : '48px',
    fontWeight: 700,
    letterSpacing: '.1em',
    userSelect: 'none',
    lineHeight: 1,
    color: props => (props.gameState === GAME_STATES.Over ? '#ff4444' : '#00e258'),
    opacity: 1,
    textShadow: props => (
      props.gameState === GAME_STATES.Over 
        ? '0 0 20px rgba(255,68,68,0.6)'
        : '0 0 20px rgba(0,226,88,0.6)'
    ),
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    animation: props => props.gameState === GAME_STATES.InProgress && '$pulse 1s ease-in-out infinite',
    transform: props => props.gameState === GAME_STATES.Over && 'scale(1.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
  },
  multiplierX: {
    fontSize: '55%',
    opacity: 0.9,
    fontWeight: 500,
    marginLeft: '2px',
    color: 'inherit',
  },
  profit: {
    fontFamily: 'Rubik',
    fontSize: props => props.isMobile ? '24px' : '32px',
    fontWeight: 500,
    letterSpacing: '.1em',
    userSelect: 'none',
    lineHeight: 1.2,
    marginTop: 8,
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    '&.cashed': {
      color: '#11ca52',
      textShadow: '0 0 15px rgba(17,202,82,0.6)',
      transform: 'scale(1.1)',
    },
  },
  loadingContainer: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  loadingText: {
    fontFamily: 'Rubik',
    fontSize: '32px',
    fontWeight: 700,
    color: '#e4e4e4',
    letterSpacing: '0.1em',
    animation: '$pulse 1.5s ease-in-out infinite',
  },
  loadingBar: {
    width: '200px',
    height: '4px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '2px',
    overflow: 'hidden',
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: '40%',
      backgroundColor: '#00e258',
      borderRadius: '2px',
      animation: '$loading 1.5s ease-in-out infinite',
    }
  },
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
      textShadow: '0 0 20px rgba(0,226,88,0.6)',
    },
    '50%': {
      transform: 'scale(1.05)',
      textShadow: '0 0 30px rgba(0,226,88,0.8)',
    },
    '100%': {
      transform: 'scale(1)',
      textShadow: '0 0 20px rgba(0,226,88,0.6)',
    },
  },
  '@keyframes loading': {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(350%)' }
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#0c0d15',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    backdropFilter: 'blur(4px)',
  },
  overlayContent: {
    textAlign: 'center',
    color: '#fff',
    animation: '$fadeIn 0.3s ease-out',
  },
  rocketContainer: {
    marginBottom: '20px',
    animation: '$float 2s ease-in-out infinite',
  },
  overlayText: {
    fontSize: props => props.isMobile ? '20px' : '24px',
    fontWeight: 'bold',
    fontFamily: 'Rubik',
    color: '#e4e4e4',
    marginBottom: '8px',
  },
  overlaySubText: {
    fontSize: props => props.isMobile ? '16px' : '18px',
    fontFamily: 'Rubik',
    color: '#00e258',
    textShadow: '0 0 10px rgba(0,226,88,0.4)',
  },
  '@keyframes float': {
    '0%, 100%': {
      transform: 'translateY(0)',
    },
    '50%': {
      transform: 'translateY(-10px)',
    },
  },
  '@keyframes fadeIn': {
    from: {
      opacity: 0,
      transform: 'scale(0.9)',
    },
    to: {
      opacity: 1,
      transform: 'scale(1)',
    },
  },
  networkStatus: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    borderRadius: '16px',
    backgroundColor: 'rgba(26,29,41,0.7)',
    backdropFilter: 'blur(4px)',
    zIndex: 3,
  },
  statusText: {
    color: '#e4e4e4',
    fontSize: '14px',
    fontFamily: 'Rubik',
    userSelect: 'none',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#00e258',
    animation: '$statusPulse 2s ease-in-out infinite',
  },
  '@keyframes statusPulse': {
    '0%': {
      transform: 'scale(1)',
      boxShadow: '0 0 0 0 rgba(0,226,88,0.7)',
    },
    '70%': {
      transform: 'scale(1)',
      boxShadow: '0 0 0 6px rgba(0,226,88,0)',
    },
    '100%': {
      transform: 'scale(1)',
      boxShadow: '0 0 0 0 rgba(0,226,88,0)',
    },
  },
}));

const GAME_STATES = {
  NotStarted: 1,
  Starting: 2,
  InProgress: 3,
  Over: 4,
  Blocking: 5,
  Refunded: 6,
};

const BET_STATES = {
  Playing: 1,
  CashedOut: 2,
};

const CupAnimation = ({ 
  loading, 
  payout = 1.00, 
  startedAt, 
  elapsedTime, 
  ownBet, 
  gameState, 
  countdown,
  startTime,
  setGameState,
  updateCountdown,
  isFullSize = true
}) => {
  const isMobile = window.innerWidth < 768;
  const classes = useStyles({ gameState, isMobile, isFullSize });
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [canvasContext, setCanvasContext] = useState(null);
  const [btcPrice, setBtcPrice] = useState(null);
  const [initialBtcPrice, setInitialBtcPrice] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);
  const [localCountdown, setLocalCountdown] = useState(0);

  const crashSettings = useRef({
    startTime: null,
    currentProgressTime: 0,
    differenceTime: startedAt ? Date.now() - startedAt : 0,
    stage: 'starting',
    crashAnimationStarted: false,
    lastCrashPoint: null,
    particles: []
  }).current;

  const animateRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const price = parseFloat(data.p);
      setBtcPrice(price);
      
      if (!initialBtcPrice && price) {
        setInitialBtcPrice(price);
      }
    };

    return () => ws.close();
  }, []);

  const handleResize = useMemo(() => debounce(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      
      if (canvasContext) {
        canvasContext.scale(dpr, dpr);
      }
    }
  }, 100), [canvasContext]);

  const drawAxes = (ctx, canvas, XScale, YScale, offset_bottom, offset_left, YPayoutEnd, XTimeEnd) => {
    if (!ctx || !canvas) return;

    ctx.save();
    
    const isMobile = window.innerWidth < 768;
    const fontSize = isMobile ? 11 : 13;
    const labelOffset = isMobile ? 8 : 12;
    
    const gridColor = 'rgba(74, 77, 94, 0.15)';
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 0.8;
    
    let timeStep;
    if (XTimeEnd <= 5000) {
        timeStep = 500;
    } else if (XTimeEnd <= 10000) {
        timeStep = 1000;
    } else if (XTimeEnd <= 30000) {
        timeStep = 2500;
    } else if (XTimeEnd <= 60000) {
        timeStep = 5000;
    } else {
        timeStep = 10000;
    }

    for (let time = timeStep; time < XTimeEnd; time += timeStep) {
        const x = calcX(time, XScale) + offset_left;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height - offset_bottom);
        ctx.stroke();
    }

    let payoutStep;
    const maxPayout = YPayoutEnd / 100;

    if (maxPayout <= 2) {
        payoutStep = 25;
    } else if (maxPayout <= 5) {
        payoutStep = 50;
    } else if (maxPayout <= 10) {
        payoutStep = 100;
    } else if (maxPayout <= 20) {
        payoutStep = 200;
    } else if (maxPayout <= 50) {
        payoutStep = 500;
    } else if (maxPayout <= 100) {
        payoutStep = 1000;
    } else {
        payoutStep = Math.ceil(maxPayout / 10) * 1000;
    }

    for (let payout = payoutStep; payout < YPayoutEnd; payout += payoutStep) {
        const y = calcY(payout, YScale) + canvas.height - offset_bottom;
        ctx.beginPath();
        ctx.moveTo(offset_left, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    ctx.font = `${fontSize}px "Rubik"`;
    
    ctx.textAlign = 'right';
    ctx.fillStyle = '#8a8d99';
    for (let payout = payoutStep; payout < YPayoutEnd; payout += payoutStep) {
        const y = calcY(payout, YScale) + canvas.height - offset_bottom;
        const multiplier = payout / 100;
        
        let label;
        if (multiplier >= 10) {
            label = `${Math.floor(multiplier)}×`;
        } else if (multiplier >= 1) {
            label = `${multiplier.toFixed(multiplier % 1 === 0 ? 0 : 1)}×`;
        } else {
            label = `${multiplier.toFixed(2)}×`;
        }
        
        ctx.fillText(label, offset_left - labelOffset, y + 4);
    }

    ctx.textAlign = 'center';
    let labelCount = 0;
    const skipLabels = isMobile ? 2 : 1;
    
    for (let time = timeStep; time < XTimeEnd; time += timeStep) {
        labelCount++;
        if (isMobile && labelCount % skipLabels !== 0) continue;
        
        const x = calcX(time, XScale) + offset_left;
        let timeLabel;
        
        if (time < 1000) {
            timeLabel = `${(time / 1000).toFixed(1)}s`;
        } else if (time < 10000) {
            timeLabel = `${(time / 1000).toFixed(1)}s`;
        } else if (time < 60000) {
            timeLabel = `${(time / 1000).toFixed(0)}s`;
        } else {
            const minutes = Math.floor(time / 60000);
            const seconds = ((time % 60000) / 1000).toFixed(0);
            timeLabel = `${minutes}:${seconds.padStart(2, '0')}`;
        }

        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 2;
        ctx.fillText(timeLabel, x, canvas.height - offset_bottom + labelOffset + 8);
        ctx.shadowBlur = 0;
    }

    ctx.restore();
  };

  const createParticle = (x, y, color) => ({
    x,
    y,
    color,
    velocity: {
      x: (Math.random() - 0.5) * 8,
      y: (Math.random() - 0.5) * 8
    },
    size: Math.random() * 1.5 + 0.5,
    alpha: 0.8,
    life: Math.random() * 20 + 10
  });

  const drawParticles = (ctx) => {
    if (!crashSettings?.particles) return;
    
    for (let i = crashSettings.particles.length - 1; i >= 0; i--) {
      const particle = crashSettings.particles[i];
      particle.life--;
      particle.alpha -= 0.03;
      particle.x += particle.velocity.x;
      particle.y += particle.velocity.y;
      
      ctx.save();
      ctx.globalAlpha = particle.alpha;
      ctx.fillStyle = particle.color;
      
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();

      if (particle.life <= 0) {
        crashSettings.particles.splice(i, 1);
      }
    }
  };

  const drawLine = (ctx, canvas, XScale, YScale, offset_bottom, offset_left, current_time, stage) => {
    if (!ctx || !canvas || (stage !== 'progress' && stage !== 'crashed')) return;

    ctx.save();
    
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2;
    
    ctx.imageSmoothingEnabled = false;
    
    const colors = {
      progress: '#00e258',
      crashed: '#ff4444'
    };

    const points = [];
    const step = Math.max(1, Math.floor(current_time / 1000));
    
    ctx.beginPath();
    ctx.moveTo(offset_left, canvas.height - offset_bottom);
    
    for (let t = 0; t <= current_time; t += step) {
        const x = calcX(t, XScale) + offset_left;
        const y = calcY(100 * calcPayout(t), YScale) + canvas.height - offset_bottom;
        points.push({x, y});
    }

    if (points.length > 0) {
        ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length - 2; i++) {
            const xc = (points[i].x + points[i + 1].x) / 2;
            const yc = (points[i].y + points[i + 1].y) / 2;
            
            const cp1x = (points[i].x + xc) / 2;
            const cp1y = points[i].y;
            const cp2x = (points[i + 1].x + xc) / 2;
            const cp2y = points[i + 1].y;
            
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, xc, yc);
        }

        if (points.length > 2) {
            const last = points.length - 1;
            const xc = (points[last - 1].x + points[last].x) / 2;
            const yc = (points[last - 1].y + points[last].y) / 2;
            
            ctx.quadraticCurveTo(points[last - 1].x, points[last - 1].y, points[last].x, points[last].y);
        }
    }

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    if (stage === 'progress') {
        gradient.addColorStop(0, 'rgba(0, 226, 88, 0.4)');
        gradient.addColorStop(1, 'rgba(0, 226, 88, 0)');
    } else {
        gradient.addColorStop(0, `${colors[stage]}66`);
        gradient.addColorStop(1, `${colors[stage]}00`);
    }
    
    ctx.lineTo(points[points.length - 1].x, canvas.height - offset_bottom);
    ctx.lineTo(offset_left, canvas.height - offset_bottom);
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 1; i < points.length - 2; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        
        const cp1x = (points[i].x + xc) / 2;
        const cp1y = points[i].y;
        const cp2x = (points[i + 1].x + xc) / 2;
        const cp2y = points[i + 1].y;
        
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, xc, yc);
    }

    if (points.length > 2) {
        const last = points.length - 1;
        ctx.quadraticCurveTo(points[last - 1].x, points[last - 1].y, points[last].x, points[last].y);
    }

    ctx.strokeStyle = colors[stage];
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = colors[stage];
    ctx.shadowBlur = 10;
    ctx.stroke();

    if (stage === 'crashed' && !crashSettings.lastCrashPoint) {
      const lastPoint = points[points.length - 1];
      
      for (let i = 0; i < 20; i++) {
        crashSettings.particles.push(
          createParticle(lastPoint.x, lastPoint.y, 'rgba(255, 68, 68, 0.6)')
        );
      }
    }

    if (stage === 'progress') {
      const lastPoint = points[points.length - 1];
      const pulse = (Math.sin(Date.now() * 0.01) + 1) / 2;
      
      // Main dot
      ctx.beginPath();
      ctx.arc(lastPoint.x, lastPoint.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = colors[stage];
      ctx.shadowColor = colors[stage];
      ctx.shadowBlur = 10;
      ctx.fill();
      
      // First pulse ring
      ctx.beginPath();
      ctx.arc(lastPoint.x, lastPoint.y, 6 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 226, 88, ${0.3 + (pulse * 0.2)})`;
      ctx.fill();
      
      // Second pulse ring
      ctx.beginPath();
      ctx.arc(lastPoint.x, lastPoint.y, 10 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 226, 88, ${0.2 * pulse})`;
      ctx.fill();
      
      // Outer glow effect
      const glowGradient = ctx.createRadialGradient(
        lastPoint.x, lastPoint.y, 0,
        lastPoint.x, lastPoint.y, 15 * pulse
      );
      glowGradient.addColorStop(0, `rgba(0, 226, 88, ${0.2 * pulse})`);
      glowGradient.addColorStop(1, 'rgba(0, 226, 88, 0)');
      
      ctx.beginPath();
      ctx.arc(lastPoint.x, lastPoint.y, 15 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = glowGradient;
      ctx.fill();
    }

    ctx.restore();

    // Add crash dot for crashed state
    if (stage === 'crashed') {
      const lastPoint = points[points.length - 1];
      
      // Draw red crash dot
      ctx.save();
      ctx.beginPath();
      ctx.arc(lastPoint.x, lastPoint.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ff4444';
      ctx.shadowColor = '#ff4444';
      ctx.shadowBlur = 10;
      ctx.fill();
      
      // Draw pulse effect around crash dot
      const crashPulse = (Math.sin(Date.now() * 0.01) + 1) / 2;
      
      ctx.beginPath();
      ctx.arc(lastPoint.x, lastPoint.y, 6 * crashPulse, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 68, 68, ${0.3 + (crashPulse * 0.2)})`;
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(lastPoint.x, lastPoint.y, 10 * crashPulse, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 68, 68, ${0.2 * crashPulse})`;
      ctx.fill();
      
      ctx.restore();
    }
  };

  const calcX = (time, XScale) => XScale * time;
  const calcY = (payout, YScale) => -(YScale * (payout - 100));
  const calcPayout = useMemo(() => (ms) => {
    if (!btcPrice || !initialBtcPrice) return 1;
    const percentageChange = (btcPrice - initialBtcPrice) / initialBtcPrice;
    const baseMultiplier = Math.pow(Math.E, 0.00006 * ms);
    return Math.max(1, baseMultiplier * (1 + percentageChange));
  }, [btcPrice, initialBtcPrice]);

  const getTime = (stage) => {
    if (!crashSettings.startTime) return 0;
    if (stage === 'progress') {
      return Date.now() - crashSettings.startTime + crashSettings.differenceTime;
    }
    return stage === 'crashed' ? crashSettings.currentProgressTime : 0;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { 
      alpha: false,
      antialias: true,
      desynchronized: true
    });
    
    if (!ctx) return;

    const resizeCanvas = () => {
      const parentElement = canvas.parentElement;
      const dpr = window.devicePixelRatio || 1;
      
      // Get parent dimensions
      const width = parentElement.clientWidth;
      const height = parentElement.clientHeight;
      
      // Set display size
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      // Set actual size in memory
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      
      // Scale all drawing operations
      ctx.scale(dpr, dpr);
      
      // Enable smooth lines
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    };

    resizeCanvas();
    setCanvasContext(ctx);

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(resizeCanvas);
    });
    
    resizeObserver.observe(canvas.parentElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!canvasContext || !canvasRef.current) return;

    animateRef.current = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvasContext;
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      
      ctx.fillStyle = '#0c0d15';
      ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      let stage;
      switch (gameState) {
        case GAME_STATES.InProgress:
          stage = 'progress';
          break;
        case GAME_STATES.Over:
          stage = 'crashed';
          break;
        default:
          stage = 'starting';
      }
      
      crashSettings.stage = stage;

      let current_time = elapsedTime;
      
      if (gameState === GAME_STATES.InProgress) {
        current_time = Date.now() - startedAt;
        crashSettings.currentProgressTime = current_time;
      } else if (gameState === GAME_STATES.Over) {
        current_time = crashSettings.currentProgressTime || current_time;
      }

      const currentGrowth = 100 * calcPayout(current_time);
      
      const displayWidth = canvas.width / window.devicePixelRatio;
      const displayHeight = canvas.height / window.devicePixelRatio;

      const isMobile = window.innerWidth < 768;
      const offset_bottom = isMobile ? 45 : 45;
      const offset_left = isMobile ? 55 : 60;
      const paddingRight = isMobile ? 40 : 50;
      const paddingTop = isMobile ? 30 : 70;

      const XTimeEnd = Math.max(isMobile ? 5000 : 10000, current_time) + paddingRight;
      const YPayoutEnd = Math.max(isMobile ? 180 : 210, currentGrowth);
      
      const XScale = (displayWidth - offset_left - paddingRight) / XTimeEnd;
      const YScale = (displayHeight - offset_bottom - paddingTop) / (YPayoutEnd - 100);

      drawAxes(ctx, canvas, XScale, YScale, offset_bottom, offset_left, YPayoutEnd, XTimeEnd);
      drawLine(ctx, canvas, XScale, YScale, offset_bottom, offset_left, current_time, stage);
      drawParticles(ctx);

      if (stage === 'crashed' && !crashSettings.lastCrashPoint) {
        crashSettings.lastCrashPoint = current_time;
      }

      animationFrameRef.current = requestAnimationFrame(animateRef.current);
    };

    if (startedAt && (gameState === GAME_STATES.InProgress || gameState === GAME_STATES.Over)) {
      animateRef.current();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState, canvasContext, startedAt, elapsedTime]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (gameState === GAME_STATES.Starting) {
      setShowOverlay(true);
      setLocalCountdown(countdown);

      const countdownInterval = setInterval(() => {
        setLocalCountdown(prev => (prev > 0 ? prev - 0.1 : 0).toFixed(1));
      }, 100);

      return () => clearInterval(countdownInterval);
    } else {
      setShowOverlay(false);
    }
  }, [gameState, countdown]);

  const numberSpring = useSpring({
    from: { number: 1.00 },
    to: { number: payout },
    config: { mass: 1, tension: 140, friction: 20 }
  });

  return (
    <>
      <div className={classes.networkStatus}>
        <div className={classes.statusDot} />
        <span className={classes.statusText}>Connected</span>
      </div>
      
      {showOverlay && (
        <div className={classes.overlay}>
          <div className={classes.overlayContent}>
            <div className={classes.rocketContainer}>
              <BsFillRocketFill size={64} color="#00e258" />
            </div>
            <div className={classes.overlayText}>Preparing Round</div>
            <div className={classes.overlaySubText}>Starting in {localCountdown}s</div>
            {!loading && gameState === GAME_STATES.Starting && (
              <div style={{ marginTop: '20px', width: '200px' }}>
                <TimerBar 
                  waitTime={startTime}
                  gameStates={GAME_STATES}
                  updateGameState={(state) => setGameState(state)}
                  updateCountdown={updateCountdown}
                />
              </div>
            )}
          </div>
        </div>
      )}
      {initialLoading && (
        <div className={classes.loadingContainer}>
          <div className={classes.loadingText}>LOADING GAME</div>
          <div className={classes.loadingBar} />
        </div>
      )}
      <div className={classes.meta} style={{ 
        opacity: initialLoading ? 0 : 1, 
        transition: 'opacity 0.3s ease-in-out',
        padding: isMobile ? '15px' : '20px'
      }}>
        <div className={classes.payout}>
          {initialLoading || loading ? (
            'LOADING'
          ) : (
            <>
              <animated.span>
                {numberSpring.number.interpolate(n => n.toFixed(2))}
              </animated.span>
              <span className={classes.multiplierX}>×</span>
            </>
          )}
        </div>
        {!initialLoading && (gameState === GAME_STATES.InProgress || gameState === GAME_STATES.Over) && ownBet && (
          <div className={`${classes.profit} ${ownBet.status === BET_STATES.CashedOut ? 'cashed' : ''}`}>
            +{((ownBet.betAmount || 0) * (payout / 100)).toFixed(2)}
            <img
              src={coin}
              alt="Money"
              style={{
                width: isMobile ? 20 : 24,
                height: isMobile ? 20 : 24,
                marginLeft: isMobile ? 6 : 8,
                marginBottom: -2,
                filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.5))'
              }}
            />
          </div>
        )}
      </div>
      <canvas 
        ref={canvasRef} 
        className={classes.canvas} 
        style={{ 
          opacity: initialLoading ? 0 : 1, 
          transition: 'opacity 0.3s ease-in-out',
          touchAction: 'none',
        }}
      />
    </>
  );
};

export default React.memo(CupAnimation);
