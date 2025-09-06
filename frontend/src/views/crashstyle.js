// limbostyle.js

import { makeStyles, withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { themeConfig } from '../config/config';  // Adjust the path if necessary

// Export your styled BetInput component
export const BetInput = withStyles({
  root: {
    marginRight: 10,
    maxWidth: 130,
    minWidth: 100,
    marginBottom: 10, // Add top margin

    "& :before": {
      display: "none",
    },
    "& label": {
      color: "#323956",
      fontSize: 15,
    },
    "& div input": {
      color: "#e4e4e4",
      fontFamily: "Poppins",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".1em",
      padding: "0.5rem 0.25rem",
    },
    "& div": {
      background: "#131426",
      height: "2.25rem",
      borderRadius: 4,
    },
  },
})(TextField);

export const useStyles = makeStyles(theme => ({
      
        root: {
          width: "100%",
          height: "100%",
          position: "relative",
          marginTop: "2%",
          [theme.breakpoints.down('sm')]: {  // Add this media query for mobile
            marginTop: "calc(100vh - 125px)"
          }
        },
        buttonContainer: {
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: themeConfig.secondcontainer,
          width: "100%",
          padding: "0.3rem",
          borderRadius: "4px",
          filter: "brightness(110%)",
          [theme.breakpoints.down("xs")]: {
            display: "none",
      
          },
        },
        button: {
          width: "48%",
          padding: "0.5rem",
          backgroundColor: "#131426",
          filter: "brightness(105%)",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          textAlign: "center",
          '&:hover': {
            filter: "brightness(100%)",
            backgroundColor: "hsl(215, 75%, 50%)",
            color: "#fff", // White text color for selected button content
      
          },
        },
        buttonContent: {
          width: "100%",
          userSelect: "none",
      
          color: "#9E9FBD",
          textAlign: "center",
          borderRadius: "4px",
          '&:hover': {
      
          color: "#fff", // White text color for selected button content
          
        },
      
        },
        selectedButton: {
          color: "#fff", // White text color for selected button
      
          backgroundColor: "#1f2137", // Color for selected button
          filter: "brightness(100%)", // Remove brightness change for selected button
        },
        selectedButtonContent: {
          color: "#fff", // White text color for selected button content
        },
      
      
        provablyFairButton: {
          borderRadius: "0.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
            color: 'white',
        },
        title: {
              marginTop: "1rem", // Başlığın alt kısmında boşluk ekleyin
      
          color: "#e4e4e4",
          fontFamily: "Poppins",
          fontSize: "12px",
          fontWeight: 500,
          letterSpacing: ".1em",
          padding: "0.25rem 0.25rem 0",
          lineHeight: 1,
        },
      
        placeBet: {
          background: "#131426",
          borderRadius: 5,
          boxShadow: "0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12)",
          marginTop: "0.6rem",
          "& button": {
            color: "#e4e4e4",
            fontFamily: "Poppins",
            fontSize: "12px",
            fontWeight: 500,
            letterSpacing: ".1em",
            "&:hover": {
              opacity: 1,
            },
          },
        },
      
        betCont: {
          display: "flex",
          width: "95%",
          alignItems: "center",
          flexWrap: "wrap",
          margin: "auto",
          padding: "0.5rem 0 0",
        },
        historyContainer: {
          display: 'flex',
          flexDirection: 'row',
          gap: '4px',
          overflow: 'hidden',
          width: 'auto',
          position: 'absolute',
          right: '12px',
          top: '12px',
          padding: '4px',
          maxWidth: '400px',
          zIndex: 10,
          '&::after': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: '30px',
            background: 'linear-gradient(to left, transparent, #131720)',
            pointerEvents: 'none'
          }
        },
        
        historyItem: {
          padding: '4px 8px',
          borderRadius: '4px',
          fontWeight: '500',
          fontSize: '12px',
          minWidth: '60px',
          textAlign: 'center',
          position: 'relative',
          willChange: 'transform, opacity', // Optimize animations
          backfaceVisibility: 'hidden', // Prevent flickering
          WebkitFontSmoothing: 'antialiased',
          transformStyle: 'preserve-3d'
        },
        
        
        container: {
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "auto",
          marginBottom: "auto",
      
          backgroundColor: themeConfig.secondcontainer, 
          borderRadius: "8px",
              padding: "5px 5px 5px 5px",
      
          // padding: "5px 15px 15px 15px",
          display: "flex",
          width: "1150px",
          maxWidth: "1180px",
          flexDirection: "column",
          [theme.breakpoints.down("lg")]: {
            width: "78%",
            maxWidth: "1050px",
          },
          [theme.breakpoints.down("sm")]: {
            width: "auto",
          },
        },
      
        betSection: {
          width: "100%",
          maxWidth: "auto", // Set the maximum width to maintain consistency
          height : "40rem",
      
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          // paddingTop: "12px",
          // paddingBottom: "12px",
          [theme.breakpoints.down("lg")]: {
      
            flexDirection: "column-reverse", // Reverse column order on Android
          },
          [theme.breakpoints.down("xs")]: {
      
            height : "15rem",
          },
        },
        
        inputIcon: {
          marginTop: "0 !important",
          color: "#4fa0d8",
          background: "transparent !important",
        },
        popupButton: {
          flex: "none",
          border: "none",
          cursor: "pointer",
          height: "2.25rem",
          display: "inline-flex",
          outline: "none",
          padding: "0 0.75rem",
          position: "relative",
          alignItems: "center",
          fontWeight: "bold",
          userSelect: "none",
          whiteSpace: "nowrap",
          willChange: "opacity",
          borderRadius: "0.25rem",
          justifyContent: "center",
          transitionDuration: "350ms",
          fontWeight: 500,
          color: "#9E9FBD",
          backgroundColor: "hsla(220, 100%, 82%, 0)",
          "&:hover": {
            backgroundColor: "#313A4D",
            filter: "brightness(130%)"
          }
        },
        downbutton: {
      
          position: "relative",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          display: "flex",
          margin: "1rem 0"
        },
        buttonIcon: {
          marginRight: ".5em",
          fill: "#9E9FBD",
          flex: "none",
          display: "inline-block",
          outline: "none",
        },
      
        betContainer2: {
          borderTop: "1.5px solid #1b1c2a",
      
          // border: "1px solid #101123",
          borderRadius: "4px",
          paddingRight: "12px",
          paddingLeft: "12px",
          paddingTop: "8px",
          paddingBottom: "8px",
          width: "100%",
          height: "98.4%",
      backgroundColor: themeConfig.secondcontainer,
          [theme.breakpoints.down("lg")]: {
            width: "100%",
            height: "auto",
          },
        },
        clickableButton: {
          gap: '0.5rem',
          display: 'flex',
          cursor: 'pointer',
          color: 'white', // Initial color
          '&:hover': {
            filter: 'brightness(85%)',
          },
        },
        clickedButton: {
          color: 'rgb(32, 112, 223)', // Color when clicked
        },
        // tooltip: {
        //   visibility: 'hidden',
        //   backgroundColor: 'black',
        //   color: '#fff',
        //   textAlign: 'center',
        //   borderRadius: '5px',
        //   padding: '5px 0',
        //   position: 'absolute',
        //   zIndex: 1,
        //   bottom: '125%', // Position above the button
        //   left: '50%',
        //   marginLeft: '-30px',
        //   width: '60px',
        //   opacity: 0,
        //   transition: 'opacity 0.3s',
        // },
        tooltip: {
          backgroundColor: '#0a0b1c', // Custom background color for tooltip
          color: '#ffffff', // Custom text color for tooltip
          borderRadius: '4px', // Optional: Adjust border radius
        },
        arrow: {
          color: '#0a0b1c', // Custom arrow color for tooltip
        },
      
      
        clickableButtonHover: {
          '&:hover $tooltip': {
            visibility: 'visible',
            opacity: 1,
          },
        },
      
        betContainer: {
          
          // border: "1px solid #101123",
          borderRadius: "4px",
          paddingRight: "12px",
          paddingLeft: "12px",
          paddingTop: "16px",
          paddingBottom: "16px",
          width: "20.625rem",
          height : "34.5rem",
          backgroundColor: themeConfig.secondcontainer,
          [theme.breakpoints.down("lg")]: {
            marginTop: "24px",
            width: "100%",
            height: "auto",
          },
          [theme.breakpoints.down("xs")]: {
            marginTop: "0px",

            borderTop: "1.5px solid #1b1c2a",

          },
        },


        inputContainer: {
          position: "relative",
          marginBottom: "24px",
        },
        betInput: {
          width: "100%",
          height: "40px",
          backgroundColor: "#0a0b1c",
          paddingLeft: "40px",
          color: "#ffffff",
          borderRadius: "4px",
          border: "none",
          outline: "none",
          fontFamily: "'Roboto', sans-serif",
          fontSize: "16px",
          fontWeight: 500,
          "&::placeholder": {
            color: "#cccccc",
          },
        },
        multiplierContainer: {
          position: "absolute",
          top: "10px",
          right: "10px",
          display: "flex",
          gap: "8px",
        },
        multiplier: {
          minWidth: "fit-content",
          backgroundColor: "#0a0b1c",
          borderColor: "#32363c",
          color: "white",
        },
        multiplierButton: {
          backgroundColor: "transparent",
          color: "#cccccc",
          border: "1px solid transparent",
          outline: "none",
          cursor: "pointer",
          padding: "4px",
          fontSize: "14px",
          fontFamily: "'Roboto', sans-serif",
          fontWeight: 500,
          "&:hover": {
            backgroundColor: "#0a0b1c",
          },
        },
        insufficientFundsButton: {
          backgroundColor: "#3b82f6",
          color: "#ffffff",
          width: "100%",
          height: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "2px solid #4c8bf5",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "16px",
          fontFamily: "'Roboto', sans-serif",
          fontWeight: 500,
          "&:hover": {
            backgroundColor: "#2563eb",
            borderColor: "#1e429f",
          },
        },
        limboButtonDisabled: {
          opacity: 0.5, // Reduce opacity when disabled
          pointerEvents: "none", // Disable pointer events when disabled
        },
        
      limboButton: {
        textTransform: "none",
        width: "100%",
        height: "50px", // Increased height
        padding: "0 30px",
        borderRadius: "6px",
        fontSize: "15px",
        fontWeight: 500,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',  // Prevents text selection
        cursor: 'pointer',
      
        color: "#fff",
        background: themeConfig.mainbutton, // Updated color
        border: "none",
        transition: "opacity .3s ease",
        fontFamily: "Poppins",
        
        '&:disabled': {
          cursor: 'not-allowed',
          opacity: 0.6, // Added slight opacity when disabled
        },
        "&:hover": {
          background: themeConfig.mainbutton, // Updated color
          borderColor: "#1e429f",
        },
      },


        limboSection: {
          backgroundColor: themeConfig.secondcontainer,
          borderLeft: "0.120rem solid #1b1c2a",
          display: "flex",
          flexDirection: "column",
          color: "#ffffff",
          fontSize: "24px",
          width: "55rem",
          height: "100%",
          flex: 1,
          minHeight: "100%",
          position: "relative",

          [theme.breakpoints.down("sm")]: {
            height: "200px",
            borderLeft: "0px solid #1b1c2a",
            flexDirection: "column-reverse",
          },

          [theme.breakpoints.down("lg")]: {
            width: "100%",
            maxWidth: "80rem",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "auto",
            marginBottom: "auto",
            flexDirection: "column-reverse",
          },
        },
        
        
        
      }));
      