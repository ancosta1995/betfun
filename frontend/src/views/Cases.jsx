import React, { useEffect, useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useHistory } from 'react-router-dom';
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import parseCommasToThousands from "../utils/parseCommasToThousands";
import { getActiveCases } from "../services/api.service";
import { Grow } from "@material-ui/core";
import coin from "../assets/icons/coin.png";
import Background from "../assets/balance-background.png";

const ColorCircularProgress = withStyles({
  root: {
    color: "#fff !important",
  },
})(CircularProgress);

const useStyles = makeStyles(theme => ({
  root: {
    color: "#fff",
    width: "100%",
    maxWidth: "1250px",
    margin: "0 auto",
    overflowY: "scroll",
    scrollbarWidth: "none"
  },
  navContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "left",
    marginBottom: "1rem",
    "@media (max-width: 600px)": {
      flexDirection: "column",
      gap: "0.25rem"
    },
  },
  navButton: {
    background: "#101123",
    border: "1px solid transparent",
    color: "rgb(162, 173, 195)",
    padding: "0.5rem",
    borderRadius: "0.25rem",
    transitionDuration: "300ms",
    cursor: "pointer",
    "&:hover": {
      filter: "brightness(140%)"
    }
  },
  rotationContainer: {  
    gap: "0.75rem",
    display: "flex",
    padding: "0.5rem 1rem",
    border: "1px solid transparent",
    background: "#101123",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    userSelect: "none",
    borderRadius: "0.25rem",
    transitionDuration: "300ms",
    cursor: "pointer",
    "&:hover": {
      filter: "brightness(130%)",
    }
  },
  casesContainer: {
    display: "grid",
    columnGap: "0.5rem",
    rowGap: "0.5rem",
    overflowY: "scroll",
    scrollbarWidth: "none",
    width: "100%",
    height: "80vh",
    margin: "0 auto",
    overflow: "auto",
    paddingTop: 3,
    gridTemplateColumns: "repeat(auto-fill, minmax(15%, 1fr))",
    "@media (max-width: 1100px)": {
      gridTemplateColumns: "repeat(auto-fill, minmax(15%, 1fr))",
    },
    "@media (max-width: 700px)": {
      gridTemplateColumns: "repeat(auto-fill, minmax(25%, 1fr))",
    },
  },
  caseBox: {
    background: "#101123",
    height: "16rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    borderRadius: "0.5rem",
    padding: "0.5rem",
    cursor: "pointer",
    transitionDuration: "300ms",
    "&:hover": {
      filter: "brightness(130%)",
    },    
    [theme.breakpoints.down("md")]: {
      padding: "0.5rem",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "0.5rem",
    },
  },
  imageContainer: {
    backgroundColor: "#0A0B1C",
    borderRadius: "0.5rem",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  caseImage: {
    width: 110
  },
  priceContainer: {
    display: "flex",
    gap: "0.25rem",
    alignItems: "center",
    textAlign: "center",
    verticalAlign: "baseline",
    backgroundImage: `url(${Background})`,
    backgroundSize: "cover", 
    backgroundPosition: "center",
    borderRadius: "3px",
    fontSize: "13px",
    padding: "0.5rem",
    cursor: "pointer",
    color: "rgb(224, 228, 235)",
    marginBottom: "0.5rem",
  },
  button: {
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
    marginRight: "0.5rem",
    "&:hover": {
      backgroundColor: "#313A4D",
      filter: "brightness(130%)"
    }
  },
  buttonIcon: {
    marginRight: ".5em",
    fill: "currentColor",
    flex: "none",
    width: "1.25em",
    height: "1.25em",
    display: "inline-block",
    outline: "none",
  },
  textField: {
    transitionDuration: "200ms",
    width: "20rem",
    "& label": {
      color: "#e0e0e0",
      fontFamily: "Poppins",
      fontSize: "14px",
      fontWeight: 300,
      letterSpacing: ".1em",
      transitionDuration: "200ms",
    },
    "& label.Mui-focused": {
      color: "#e0e0e0",
      fontFamily: "Poppins",
      fontWeight: "300",
      transitionDuration: "200ms",
    },
    "& .MuiInput-underline:after": {
      border: "2px solid #3d5564",
      fontFamily: "Poppins",
      fontWeight: "300",
      transitionDuration: "200ms",
    },
    "& .MuiOutlinedInput-root": {
      
      "& fieldset": {
        border: "1px solid transparent",
        fontFamily: "Poppins",
        fontWeight: "300",
        transitionDuration: "200ms",
      },
      "&:hover fieldset": {
        border: "1px solid transparent",
        fontFamily: "Poppins",
        fontWeight: "300",
        transitionDuration: "200ms",
      },
      "&.Mui-focused fieldset": {
        border: "1px solid hsl(220, 22%, 62%)",
        fontFamily: "Poppins",
        fontWeight: "300",
        transitionDuration: "200ms",
      },
    },
    "& .MuiInput-root": {
      border: "1px solid hsl(220, 22%, 62%)",
      fontFamily: "Poppins",
      fontWeight: "300",
      transitionDuration: "200ms",
      height: "2rem",
    },
    "&.MuiInputBase-root": {
      backgroundColor: "#101123",
      borderRadius: "6px",
      marginBottom: "10px",
      color: "#e0e0e0",
      fontFamily: "Poppins",
      fontWeight: "300",
      padding: "10px 10px",
      border: "1px solid transparent",
      "& > div > input": {
        color: "#e0e0e0",
        fontFamily: "Poppins",
        fontWeight: "300",
        border: "1px solid hsl(220, 22%, 62%)",
      },
    },
    "& > div > input": {
      backgroundColor: "#101123",
      borderRadius: "6px",
      transitionDuration: "200ms",
      color: "#e0e0e0",
      fontFamily: "Poppins",
      fontWeight: "300",
    },
  },
}));

const Cases = () => {
  const classes = useStyles();
  const history = useHistory();

  const [loading, setLoading] = useState(true);
  const [cases, setCases] = useState([]);
  const [sortType, setSortType] = useState("highest");
  const [searchInputState, setSearchInputState] = useState("");


  const fetchData = async () => {
    try {
      const data = await getActiveCases();
      setCases(data);
      setLoading(false);
    } catch (error) {
      console.log("There was an error getting active cases: " + error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [])

  return loading ? (
      <div style={{display: "flex", margin: "auto"}}>
        <ColorCircularProgress />
      </div>
    ) : (
    <Grow in timeout={620}>
      <div className={classes.root}>
        <h3>Case Opening</h3>

        {/*<div className={classes.navContainer}>
          <div className={classes.button}>
            <svg className={classes.buttonIcon} xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none"><path d="M10.5 21L12 18M14.5 21L16 18M6.5 21L8 18M8.8 15C6.14903 15 4 12.9466 4 10.4137C4 8.31435 5.6 6.375 8 6C8.75283 4.27403 10.5346 3 12.6127 3C15.2747 3 17.4504 4.99072 17.6 7.5C19.0127 8.09561 20 9.55741 20 11.1402C20 13.2719 18.2091 15 16 15L8.8 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>            
            All
          </div>
          <div className={classes.button}>
            <svg className={classes.buttonIcon} xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none"><path d="M12 2V18M12 22V18M12 18L15 21M12 18L9 21M15 3L12 6L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M3.33978 7.00042L6.80389 9.00042M6.80389 9.00042L17.1962 15.0004M6.80389 9.00042L5.70581 4.90234M6.80389 9.00042L2.70581 10.0985M17.1962 15.0004L20.6603 17.0004M17.1962 15.0004L21.2943 13.9023M17.1962 15.0004L18.2943 19.0985" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M20.66 7.00042L17.1959 9.00042M17.1959 9.00042L6.80364 15.0004M17.1959 9.00042L18.294 4.90234M17.1959 9.00042L21.294 10.0985M6.80364 15.0004L3.33954 17.0004M6.80364 15.0004L2.70557 13.9023M6.80364 15.0004L5.70557 19.0985" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            Low Risk
          </div>
          <div className={classes.button}>
            <svg className={classes.buttonIcon} xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" height="800px" width="800px" viewBox="0 0 512 512"><path fill="none" d="M298.464,54.972c0-23.452-19.011-42.464-42.464-42.464c-23.452,0-42.464,19.011-42.464,42.464V186.35  h84.927V54.972H298.464z"/><path fill="currentColor" d="M298.464,358.076V186.348h-84.927v171.727c-20.857,13.796-34.623,37.449-34.623,64.33  c0,42.574,34.512,77.087,77.087,77.087s77.087-34.512,77.087-77.087C333.087,395.526,319.321,371.872,298.464,358.076z"/><g><path fill="currentColor" d="M310.972,351.666c0-10.297,0-286.396,0-296.693C310.972,24.661,286.311,0,256,0   s-54.972,24.661-54.972,54.972c0,10.305,0,286.4,0,296.693c-21.798,16.933-34.623,42.898-34.623,70.739   C166.405,471.807,206.598,512,256,512s89.595-40.193,89.595-89.595C345.595,394.564,332.77,368.6,310.972,351.666z M226.044,54.972   c0-16.517,13.439-29.956,29.956-29.956s29.956,13.439,29.956,29.956V86.92h-25.795c-6.91,0-12.508,5.599-12.508,12.508   s5.599,12.508,12.508,12.508h25.795v12.975h-25.795c-6.91,0-12.508,5.599-12.508,12.508s5.599,12.508,12.508,12.508h25.795v23.912   h-59.912L226.044,54.972L226.044,54.972z M256,486.984c-35.61,0-64.579-28.969-64.579-64.579c0-21.731,10.847-41.881,29.014-53.898   c3.502-2.317,5.607-6.232,5.607-10.432V198.856h59.912v159.219c0,4.199,2.106,8.115,5.607,10.432   c18.168,12.018,29.014,32.168,29.014,53.898C320.579,458.015,291.61,486.984,256,486.984z"/><path fill="currentColor" d="M293.001,409.897c-6.91,0-12.508,5.599-12.508,12.508c0,13.505-10.987,24.493-24.493,24.493   c-6.91,0-12.508,5.599-12.508,12.508s5.599,12.508,12.508,12.508c27.299,0,49.509-22.208,49.509-49.509   C305.509,415.497,299.909,409.897,293.001,409.897z"/></g></svg>
            Medium Risk
          </div>
          <div className={classes.button}>
            <svg className={classes.buttonIcon} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 20 20" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"></path></svg>
            High Risk
          </div>
        </div>

        <div className={classes.navContainer}>
          <TextField
            id="affiliate-code"
            className={classes.textField}
            name="code"
            variant="outlined"
            placeholder="Search by case name"
            onChange={(e) => setSearchInputState(e.target.value)}
            value={searchInputState}
          />
        </div>*/}
        
        <div className={classes.casesContainer}>
          {cases.filter((item) => item.name.toLowerCase().includes(searchInputState.toLowerCase())).sort((a, b) => b.price - a.price).map((item) => {
            return (
            <div className={classes.caseBox} key={item.id} onClick={() => history.push(`/cases/${item.slug}`)}>
              <div className={classes.imageContainer}>
                <img className={classes.caseImage} src={item.image} />
              </div>
              <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <div style={{color: "hsl(220, 22%, 85%)", fontSize: "12px"}}>{item.name}</div>
                <div style={{display: "flex", alignItems: "center", gap: "0.25rem"}}></div>
              </div>
              <div className={classes.priceContainer}>
                <img style={{height: 14, width: 14}} src={coin} />
                {parseCommasToThousands(parseFloat((item.price)))}
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </Grow>
  );
};

export default Cases;