import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  skeleton: {
    backgroundColor: '#1b1c2a',
    position: 'relative',
    overflow: 'hidden',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      transform: 'translateX(-100%)',
      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.04), transparent)',
      animation: '$shimmer 2s infinite',
    }
  },
  '@keyframes shimmer': {
    '100%': {
      transform: 'translateX(100%)',
    },
  }
}));

const CustomSkeleton = ({ 
  width = '100%', 
  height = '20px', 
  borderRadius = '4px',
  margin = '0',
  style = {} 
}) => {
  const classes = useStyles();

  return (
    <div 
      className={classes.skeleton}
      style={{
        width,
        height,
        borderRadius,
        margin,
        ...style
      }}
    />
  );
};

export default CustomSkeleton; 