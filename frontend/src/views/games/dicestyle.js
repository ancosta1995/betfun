// dicestyle.js

import { makeStyles, withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { themeConfig } from '../../config/config';  // Adjust the path if necessary


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
        fontFamily: "Rubik",
        fontSize: "14px",
        fontWeight: 500,
        letterSpacing: ".1em",
        padding: "0.5rem 0.25rem",
      },
      "& div": {
        // background: "#171A28",
        background: "#131426",
        height: "2.25rem",
        borderRadius: 4,
      },
      
    },
  })(TextField);
  
  export const ResultInput = withStyles({
    root: {
      marginRight: 10,
      maxWidth: 180,
      minWidth: 0,
      marginBottom: 10, // Add top margin
      
      "& :before": {
        display: "none",
      },
      "& label": {
        color: "#323956",
        fontSize: 15,
      },
      "& input": {
        color: "#e4e4e4",
        fontFamily: "Rubik",
        fontSize: "12px",
        fontWeight: 500,
        letterSpacing: ".1em",
        padding: "8px 8px", // Adjust padding as needed
      },
      "& div": {
        // background: "#171A28",
        // background: "#131426",
        // height: "2.25rem",
        borderRadius: 4,
      },
      
    },
  })(TextField);
  
  const randomBlue1 = `#${Math.floor(Math.random() * 128 + 128).toString(16).padStart(2, '0')}00FF`;
  const randomBlue2 = `#${Math.floor(Math.random() * 128 + 128).toString(16).padStart(2, '0')}00FF`;
  const randomBlue3 = `#${Math.floor(Math.random() * 128 + 128).toString(16).padStart(2, '0')}00FF`;
  
  
  export const useStyles = makeStyles(theme => ({
    root: {
      marginTop: "5%",
      padding: "0 1rem",
      [theme.breakpoints.down("lg")]: {
        // marginTop: "-10%",
      },
      [theme.breakpoints.down("xs")]: {
        marginTop: "12%",
      },
    },
    accordionContainer: {
      height: "100%",
      marginTop: "1rem",
      backgroundColor: "#101123",
      borderRadius: "4px",
      overflow: "hidden",
      marginLeft: "auto",
      marginRight: "auto",
      width: "100%",
      maxWidth: "1150px",
      [theme.breakpoints.down('sm')]: {
        width: "auto",
      },
    },
    accordionHeader: {
      userSelect: "none", // Add this line
  
      padding: "1rem",
      cursor: "pointer",
      borderBottom: "1.5px solid rgb(27, 28, 42)",
      //  backgroundColor: "#131426",
      // backgroundColor: "#0a0b1c",
        //  backgroundColor: "#101123",
      color: "#fff",
      fontSize: "1.2rem",
      fontWeight: 500,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    accordionBody: {
      display: 'flex',
      padding: "1rem",
      color: "#9E9FBD",
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
      },
      
    },
    detailsContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      paddingRight: "1rem",
      borderRight: "1px solid #2a2f45",
      [theme.breakpoints.down('sm')]: {
        borderRight: 'none',
        paddingRight: 0,
        marginBottom: '1rem',
      },
    },
    contentContainer: {
      flex: 2,
      paddingLeft: "1rem",
      [theme.breakpoints.down('sm')]: {
        paddingLeft: 0,
      },
    },
    detailItemContainer: {
      padding: '0.5rem',
      marginBottom: '0.5rem',
      // border: '1px solid #2a2f45',
      borderRadius: '4px',
      backgroundColor: '#131426',
    },
    detailItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    detailTitle: {
      fontWeight: 500,
      color: "#fff",
    },
    detailValue: {
      display: 'flex',
      alignItems: 'center',
      color: "#9E9FBD",
      '& img': {
        height: 17,
        width: 17,
        marginLeft: 8,
      },
    },
    contentBox: {
      backgroundColor: '#131426',
      borderRadius: '4px',
      padding: '1rem',
      color: '#9E9FBD',
      fontSize: '1rem',
    },
  
  
  
    tooltip: {
      backgroundColor: '#101123', // Custom background color for tooltip
      color: '#ffffff', // Custom text color for tooltip
      borderRadius: '4px', // Optional: Adjust border radius
    },
    arrow: {
      color: '#0a0b1c', // Custom arrow color for tooltip
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
        display: "none", // Reverse column order on Android
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
  
    
      betInputContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(235px, 1fr))', // Adjust column width
    
      gridGap: '.5rem',
      marginTop: '1rem', /* Adjust as needed */
      bottom: '1rem', // Adjust as needed
      transform: 'translateY(200%)', // Move the container down
      [theme.breakpoints.down("lg")]: {
        gridTemplateColumns: 'repeat(3, minmax(80px, 1fr))', // Adjust column width
  
         transform: 'translateY(100%)', // Move the container down
      },
      [theme.breakpoints.down("sm")]: {
        gridTemplateColumns: 'repeat(3, minmax(80px, 1fr))', // Adjust column width
        marginTop: '0rem', /* Adjust as needed */

        transform: 'translateY(40%)', // Move the container down
      },
  
    },
  
    numberContainer: {
      marginTop: "2%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "680px", // Default width
      color: "#ffffff",
      fontWeight: 500,
      [theme.breakpoints.down("lg")]: {
        
        width: "350px", // Adjusted width for lg and below
      },
      [theme.breakpoints.down("xs")]: {
        
        width: "250px", // Adjusted width for lg and below
      },
    },
    number: {
      margin: 0,
      fontSize: "12px", // Adjust the font size as needed
    },
    inputRange: {
      WebkitAppearance: "none",
      appearance: "none",
      background: "#d3d3d3",
      outline: "none",
      height: "10px",
      transition: "opacity .2s",
      accentColor: "blue",
      backgroundColor: "#ffda21",
      width: "680px",
      borderRadius: "4px",
      pointerEvents: "none", // Disable pointer events on the track
  
      [theme.breakpoints.down("lg")]: {
        
        width: "350px", // Adjusted width for lg and below
      },
      [theme.breakpoints.down("xs")]: {
        
        width: "250px", // Adjusted width for lg and below
      },
  
      "&::-webkit-slider-thumb": {
        pointerEvents: "auto", // Re-enable pointer events on the thumb only
        backgroundColor: "rgb(68, 131, 235)",
        borderRadius: "4px",
        cursor: "grab",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "3px",
        marginLeft: "-7px",
        transition: "all 0.05s ease",
        boxShadow: "rgba(43, 42, 42, 0.28) 0px -3px 0px inset",
        WebkitAppearance: "none",
        border: `2px solid rgba(43, 42, 42, 0.28) 0px -3px 0px inset`, // Use the same random blue-like color as the container's background
        boxShadow: `rgba(43, 42, 42, 0.28) 0px -3px 0px inset`, // Use the same random blue-like color as the container's box-shadow
  
        appearance: "none",
        width: "45px",
        height: "45px",
        borderRadius: "6px",
      },
      "&::-moz-range-thumb": {
        pointerEvents: "auto", // Re-enable pointer events on the thumb only
        width: "35px",
        height: "35px",
      },
    },
    inputRangeContainer: {
      position: "relative",
      padding: "0.575rem",
      margin: "1rem 0",
      borderRadius: "8px",
      background: "#1a1b33", // Random blue-like color for the container background
      boxShadow: `0px 4px 10px #1a1b33`, // Random blue-like color for the box-shadow
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    // arrow: {
    //   content: '""',
    //   position: "absolute",
    //   transform: "translate(-50%)",
    //   width: 0,
    //   height: 0,
    //   top: "-2rem",
    //   borderLeft: "0.375rem solid transparent",
    //   borderRight: "0.375rem solid transparent",
    //   borderTop: `0.375rem solid ${randomBlue1}`, // Random blue-like color for the arrow
    // },
  
  
    resultIndicator: {
      position: "absolute",
      top: "-50px",
      left: "calc(calc(calc(100% - 40px) * var(--percentage)) / 100)",
      transform: "translateX(-20%)",
      fontFamily: "Rubik", // Adjust the font family
      fontWeight: 600, // Adjust the font weight
      fontSize: "14px", // Adjust the font size
      borderRadius: "8px", // Adjust the border radius
      backgroundColor: "#2F3241", // Adjust the background color
      padding: "10px", // Adjust the padding
      display: "none", // Hide by default
      transition: "display 1s",
      "&.visible": {
        display: "block", // Show when visible
      },
      "&.text-green": {
        color: "green", // Adjust the color for green text
      },
      "&.text-red": {
        color: "red", // Adjust the color for red text
      },
    },
  
    title: {
      marginTop: "1rem", // Başlığın alt kısmında boşluk ekleyin
  
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "12px",
      fontWeight: 500,
      padding: "0.25rem 0.25rem 0",
      lineHeight: 1,
    },
    titles: {
      
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "12px",
      fontWeight: 500,
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
        fontFamily: "Rubik",
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
      
      [theme.breakpoints.down("sm")]: {
        height : "35rem",
      },
    },
  
    inputIcon: {
      marginTop: "0 !important",
      color: "#4fa0d8",
      background: "transparent !important",
    },
  
    reversed: {
      display: "flex",
      flexDirection: "column", // Reverse column order on Android

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
    tooltip: {
      visibility: 'hidden',
      backgroundColor: 'black',
      color: '#fff',
      textAlign: 'center',
      borderRadius: '5px',
      padding: '5px 0',
      position: 'absolute',
      zIndex: 1,
      bottom: '125%', // Position above the button
      left: '50%',
      marginLeft: '-30px',
      width: '60px',
      opacity: 0,
      transition: 'opacity 0.3s',
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
        marginTop: "24px",
        width: "100%",
        height: "100%",
        flexDirection: "column-reverse", // Reverse column order on Android
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
      backgroundColor: "#101123",
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
        backgroundColor: "#101123",
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
    diceButtonDisabled: {
      opacity: 0.5, // Reduce opacity when disabled
      pointerEvents: "none", // Disable pointer events when disabled
    },
    
    diceButton: {
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
      fontFamily: "Rubik",
      
      '&:disabled': {
        cursor: 'not-allowed',
        opacity: 0.6, // Added slight opacity when disabled
      },
      "&:hover": {
      background: themeConfig.mainbutton, // Updated color
        borderColor: "#1e429f",
      },
    },
    diceButtonContainer: {
      display: 'flex',
      justifyContent: 'center',
      position: 'relative',
      marginTop: theme.spacing(2),
  
      // Mobil ekranlar için (600px ve altı)
      [theme.breakpoints.down('xs')]: {
        position: 'absolute',
        top: 0, // Butonun ekranın en üstünde olması için
        left: 0,
        right: 0,
        margin: 'auto',
        zIndex: 999, // Butonun diğer içeriklerin üzerinde görünmesi için yüksek bir z-index değeri
      },
    },
  
    diceSection: {
      backgroundColor: themeConfig.secondcontainer,
      // borderRadius: "6px",
      padding: "24px",
      borderLeft: "0.120rem solid #1b1c2a",
  
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      color: "#ffffff", // Set text color to white
      fontSize: "24px", // Increase font size to 24px
      width: "100%", // Adjust the width as needed
      maxWidth: "55rem", // Set the maximum width to maintain consistency
  
      [theme.breakpoints.down("lg")]: {
        height: "610px",
    },
    [theme.breakpoints.down("xs")]: {
      height: "350px",
      borderLeft: "0.0rem solid #1b1c2a",

  },
    [theme.breakpoints.up("lg")]: {
        width: "100%", // Adjust the width as needed
        maxWidth: "800px", // Set the maximum width to maintain consistency
        marginLeft: "auto",
        marginRight: "auto",
    },
  
  },
    
    
    
  }));
  