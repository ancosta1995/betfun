// upgraderstyle.js

import { makeStyles, withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";


export const ColorCircularProgress = withStyles({
    root: {
      color: "#fff !important",
    },
  })(CircularProgress);
  
  export const BetInput = withStyles({
    root: {
      width: "100%",
      marginTop: "auto",
      border: "1px solid transparent",
      background: "#1A1B33",
      borderRadius: "5px",
      overflow: "hidden",
      "& :before": {
        display: "none",
      },
      "& :after": {
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
        padding: "0rem 0rem",
      },
      "& div": {
        height: "2.5rem",
        borderRadius: 4,
      },
      "&:hover": {
      }
    }
  })(TextField);
  
  export const useStyles = makeStyles(theme => ({
    root: {
      color: "#fff",
      fontFamily: "Poppins",
      overflowY: "scroll",
      scrollbarWidth: "none",
      height: "100%",
      width: "100%",
      maxWidth: "1305px",
      margin: "0 auto",
  
    },
    loader: {
      height: "100%",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    itemsContainer: {
      marginTop: "0.5rem",
      //background: "#101123",
      borderRadius: "0.25rem",
      display: "grid",
      gridTemplateColumns: "repeat(6, 1fr)", 
      gap: "0.8rem",
  
      //padding: "0.5rem",
    },
    bigItemBox: {
      width: "300px",
      height: "200px",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      position: "relative", 
      borderRadius: "0.5rem", 
      overflow: "hidden", 
      backgroundSize: "cover",
      
      backgroundPosition: "center", 
    },
  bigItemImage: {
    width: "100px",
    height: "100px",
    transform: "scale(2)",
  
    objectFit: "contain",
    zIndex: 2,
    imageRendering: "auto",
  },
    bigItemColor: {
      width: "300px",
      height: "auto",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 1
    },
    itemBox: {
      width: "210px",
      height: "120px",
      cursor: "pointer",
      backgroundColor: "#0A0B1C",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      position: "relative", 
      borderRadius: "0.5rem", 
      overflow: "hidden", 
      backgroundSize: "cover",
      backgroundPosition: "center", 
    },
    itemImage: {
      width: "100px",
      height: "75px",
      objectFit: "contain",
      zIndex: 2
    },
    itemColor: {
      width: "150px",
      height: "auto",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 1
    },
    itemPrice: {
      position: "absolute",
      display: "flex",
      alignItems: "center",
      gap: "0.3rem",
      padding: "0.25rem 0.5rem",
      fontSize: "12px",
      borderTopRightRadius: "0.25rem",
      borderBottomRightRadius: "0.25rem",
      bottom: 10,
      left: 0,
      fontWeight: 500
    },
    topContainer: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "1rem", 
      gap: "2rem",
    },
    balanceControllerBox: {
      position: "relative",
      background: "#101123",
      borderRadius: "0.25rem",
      flex: "1",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    upgraderBox: {
      height: "25rem",
      width: "25rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      position: "relative"
    },
    progressCircle: {
      position: "absolute",
      height: "290px",
      width: "290px",
    },
    spinnerMirror: {
      borderRadius: "50%",
      position: "absolute",
      height: "278px",
      width: "278px",
      zIndex: 1,
      transition: `all 5s cubic-bezier(0.05, 0.1, 0.1, 1)`
    },
    spinnerSelector: {
      position: "absolute",
      top: "-20px",
      left: "50%",
      transform: "translate(-50%, -25%)",
    },
    upgraderCircle: {
      background: "#0A0B1C",
      borderRadius: "50%",
      height: "278px",
      width: "278px",
      border: "1px solid #222333",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2
    },
    upgraderContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "0.25rem",
      width: "144px",
      textAlign: "center"
    },
    itemControllerBox: {
      borderRadius: "0.25rem",
      flex: "1",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative"
    },
    inputIcon: {
      marginTop: "0 !important",
      color: "#fff",
      background: "transparent !important",
    },
    balanceContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "0.25rem",
      width: "20rem",
      textAlign: "center"
    },
    provablyFairButton: {
      padding: "0.5rem 0.75rem",
      backgroundColor: "hsl(215, 75%, 50%)",
      position: "absolute",
      bottom: 10,
      right: 10,
      borderRadius: "0.25rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer"
    },
    upgradeText: {
      fontWeight: 500,
      fontSize: 14,
      marginBottom: "0.5rem"
    },
    percentContainer: {
      display: "flex",
      gap: "0.25rem"
    },
    percentBox: {
      flexGrow: "1",
      borderRadius: "0.25rem",
      padding: "0.5rem 0",
      fontWeight: 500,
      cursor: "pointer",
      useSelect: "none"
    },
    OverAndUnder: {
      position: "absolute",
      bottom: -15,
      display: "flex",
      textAlign: "center",
      flexDirection: "column",
      cursor: "pointer",
      marginTop: "1.5rem",
      userSelect: "none"
    },
    upgradeButton: {
      padding: "0.5rem 0rem",
      width: "100%",
      backgroundColor: "hsl(215, 75%, 50%)",
      borderRadius: "0.25rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      fontWeight: 500
    },
    percentText: {
      fontWeight: 500,
      fontSize: 20
    },
    multiplierText: {
      display: "flex",
      flexDirection: "column",
      position: "absolute",
      top: 10,
      left: 10,
      fontWeight: 500
    },
    itemNameText: {
      display: "flex",
      flexDirection: "column",
      position: "absolute",
      alignItems: "end",
      bottom: 10,
      right: 10,
      fontWeight: 500
    },
    canvas: {
      position: "absolute",
      width: "100%",
      height: "100%",
      top: 0,
      left: 0,
      pointerEvents: "none",
      zIndex: 10000,
    },
  }));
  