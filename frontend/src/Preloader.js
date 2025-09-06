import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import logo from "./assets/logo.png";
import Box from "@material-ui/core/Box";

// Custom styles
const useStyles = makeStyles(() => ({
  root: {
    background: "transparent",
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    position: "relative",
  },
  logoContainer: {
    height: "6rem",
    width: "16rem",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    cursor: "pointer", // Change cursor to pointer for clickable effect
    marginBottom: "0.5rem", // Add space for the spinner
    animation: `$motionEffect 1.2s infinite ease-in-out, $scaleEffect 1.2s infinite ease-in-out, $opacityEffect 1.2s infinite ease-in-out`,
  },
  spinner: {
    height: "3rem", // Adjust the spinner size
    width: "3rem",
    border: "4px solid #080808", // Light transparent border for the outer part of the spinner
    borderTop: `4px solid hsl(251.31deg, 75%, 50%)`, // Color for spinner
    borderRadius: "50%",
    animation: `$spin 0.7s linear infinite`,
    transition: "transform 0.3s ease", // Transition for hover effect
  },
  // Keyframes for smooth motion effect
  "@keyframes motionEffect": {
    "0%, 100%": {
      transform: "rotate(0deg)",
    },
    "50%": {
      transform: "rotate(5deg)", // Slight rotation for speed effect
    },
  },
  // Keyframes for scale effect (pulsing)
  "@keyframes scaleEffect": {
    "0%, 100%": {
      transform: "scale(1)",
    },
    "50%": {
      transform: "scale(1.05)", // Subtle pulse effect
    },
  },
  // Keyframes for opacity effect (smooth fade in/out)
  "@keyframes opacityEffect": {
    "0%, 100%": {
      opacity: 1,
    },
    "50%": {
      opacity: 0.7, // Slight fading for smoothness
    },
  },
  // Keyframes for the spinner animation
  "@keyframes spin": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "100%": {
      transform: "rotate(360deg)",
    },
  },
}));

const Preloader = () => {
  const classes = useStyles();

  const handleLogoClick = () => {
    console.log("Logo clicked!"); // Replace this with actual navigation or function
  };

  return (
    <Box className={classes.root}>
      {/* Make the logo clickable */}
      <div className={classes.logoContainer} onClick={handleLogoClick}>
        {/* Logo is used as a background */}
        <div style={{
          height: "100%",
          width: "100%",
          background: `url(${logo}) center/contain no-repeat`
        }} />
      </div>
      {/* Spinner with hover effect */}
      <div
        className={classes.spinner}
        style={{
          // Scale up on hover
          transform: "scale(1)", // Default scale
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)"; // Scale up on hover
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)"; // Scale back to original
        }}
      />
    </Box>
  );
};

export default Preloader;
