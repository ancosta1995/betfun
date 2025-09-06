import React, { useEffect, useMemo, useCallback } from 'react';
import { useSpring, animated, config } from 'react-spring';
import './TimerBar.css';

export const TimerBar = ({ waitTime, gameStates, updateGameState, updateCountdown }) => {
    const maxDuration = 9000;
    const timerDuration = useMemo(() => waitTime - new Date().getTime(), [waitTime]);
    
    const calculateWidth = useCallback(() => {
        return Math.max(0, Math.min(100, 100 - ((maxDuration - timerDuration) / maxDuration) * 100));
    }, [timerDuration]);

    const current_width = calculateWidth();

    useEffect(() => {
        if (timerDuration <= 0) {
            updateGameState(gameStates.InProgress);
            return;
        }

        const interval = setInterval(() => {
            const timeLeft = Math.max(0, (waitTime - new Date().getTime()) / 1000);
            updateCountdown(timeLeft.toFixed(1));
            
            if (timeLeft <= 0) {
                clearInterval(interval);
                updateGameState(gameStates.InProgress);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [waitTime, updateCountdown, updateGameState, gameStates, timerDuration]);

    const timerAnimation = useSpring({
        from: { 
            width: `${current_width}%`,
            opacity: 1,
            transform: 'scaleX(1)'
        },
        to: { 
            width: '0%',
            opacity: 0.9,
            transform: 'scaleX(0.98)'
        },
        config: {
            ...config.molasses,
            duration: timerDuration,
            precision: 0.1
        },
        onRest: () => updateGameState(gameStates.InProgress)
    });

    return (
        <div className="timer-container">
            <div className="background" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={current_width}>
                <animated.div 
                    style={timerAnimation}
                    className="timer"
                />
            </div>
        </div>
    );
};