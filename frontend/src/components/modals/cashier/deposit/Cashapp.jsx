import React, { Fragment, useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core";
import { useToasts } from "react-toast-notifications";
import cutDecimalPoints from "../../../../utils/cutDecimalPoints";
import Slide from '@material-ui/core/Slide';
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import { startCashapp, checkCashapp } from "../../../../services/api.service";
import coin from "../../../../assets/icons/coin.png";
import cashapp from  "../../../../assets/cashapp.png";
import { motion } from "framer-motion";

const Input = withStyles({
  root: {
    width: "100%",
    marginTop: "auto",
    background: "#0A0B1C",
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

// Custom Styles
const useStyles = makeStyles(theme => ({
  modal: {
    fontFamily: "Poppins",
    width: "100%",
    maxWidth: "800px"
  },
  titleBox: {
    display: "flex",
    alignItems: "center",
    paddingTop: "1em",
    paddingLeft: "1.5em",
    paddingRight: "1em",
    fontFamily: "Poppins", 
    justifyContent: "center",
    width: "100%"
  },
  content: {
    padding: "1.5em",
    display: "block",
  },
  buttonIcon: {
    color: "#9E9FBD",
    marginRight: ".5em",
    fill: "currentColor",
    flex: "none",
    width: "1.25em",
    height: "1.25em",
    display: "inline-block",
    outline: "none",
  },
  conversionContainer: {
    backgroundColor: "#101123",
    border: "1px solid transparent",
    display: "flex",
    alignItems: "center",
    padding: "1rem",
    borderRadius: "0.25rem",
    flexDirection: "column",
    color: "#fff"
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: "1rem"
  },
  coinHeader: {
    display: "flex",
    alignItems: "center",
    color: "#fff",
    fontSize: "1.25rem",
    gap: "0.5rem"
  },
  coinImage: {
    height: 30,
    width: 30
  },
  converterContainer: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    gap: "0.5rem",
  },
  finalContainer: {
    border: "1px solid transparent",
    display: "flex",
    alignItems: "center",
    borderRadius: "0.25rem",
    marginTop: "1rem",
    flexDirection: "column"
  },
  termsContainer: {
    display: "flex",
    flexDirection: "row",
    padding: "0.75rem 0",
    alignItems: "center"
  },
  termsCheckbox: {
    maxHeight: 25,
    maxWidth: 25,
    minHeight: 25,
    minWidth: 25,
    borderRadius: "5px",
    transition: "all .3s ease",
    display: "flex",
    padding: "0.5rem",
    alignItems: "center",
    justifyContent: "center"
  },
  terms: {
    fontSize: "12px",
    color: "rgb(208, 214, 225)",
    marginLeft: "0.5rem",
    textAlign: "left",
  },
  confirmButton: {
    backgroundColor: "hsl(215, 75%, 50%)",
    width: "100%",
    padding: "0.5rem",
    marginTop: 0,
    color: "#fff",
    fontSize: "14px",
    textAlign: "center",
    fontWeight: 500,
    borderRadius: "0.25rem",
    cursor: "pointer",
    transition: "all .3s ease",
    marginTop: "1rem",
    "&:hover": {

    }
  },
  inputIcon: {
    marginTop: "0 !important",
    color: "#fff",
    background: "transparent !important",
  },
  popupButton: {
    position: "absolute",
    top: 0,
    left: "50%",
    flex: "none",
    border: "none",
    cursor: "pointer",
    height: "2.25rem",
    display: "inline-flex",
    outline: "none",
    padding: "0 0.75rem",
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
  buttonIcon: {
    marginRight: ".5em",
    fill: "#9E9FBD",
    flex: "none",
    display: "inline-block",
    outline: "none",
  },
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    margin: "0 3rem 0 0 "
  },
  warningContainer: {
    borderLeft: "2px solid rgb(249 115 22)",
    backgroundColor: "rgba(253, 186, 116, 0.1)",
    padding: "0.75rem",
    color: "rgb(253 186 116)",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem"
  },
}));

const Card = ({ open, handleClose }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(true);
  const [isNext, setIsNext] = useState(false);
  const [amount, setAmount] = useState(2);
  const [usd, setUsd] = useState(1);
  const [cashTag, setCashTag] = useState(null);
  const [note, setNote] = useState(null);
  const [link, setLink] = useState("");
  const [generating, setGenerating] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {

        setLoading(false);
      } catch (error) {

      }
    };

    fetchData();
  }, [addToast]);


  const start = async () => {
    setGenerating(true);
    try {
      const response = await startCashapp(usd);

      if (!response.success) {
        addToast(response.message, { appearance: "error" })
      }

      setCashTag(response.cashtag);
      setNote(response.note);
      setIsNext(true);

    } catch (error) {
      addToast("Failed to start CashApp process", { appearance: "error" });
    } finally {
      setGenerating(false);
    }
  };

  const check = async () => {
    setChecking(true);
    try {
      const response = await checkCashapp(link);

      if (!response.success) {
        addToast(response.message, { appearance: "error" })
      }

      if (response.success) {
        addToast(response.message, { appearance: "success" })
      }

    } catch (error) {
      addToast("Failed to check CashApp payment", { appearance: "error" });
    } finally {
      setChecking(false);
    }
  };

  const updateAmount = (val) => {
    const regex = /^[0-9]*$/;

    if (regex.test(val)) {
      setAmount(val);
      setUsd(cutDecimalPoints(val/2));
    }
   
  };

  const updateUsd = (val) => {
    const regex = /^[0-9]*$/;

    if (regex.test(val)) {
      setUsd(val);
      setAmount(cutDecimalPoints(val*2));
    }
    
  };

  return (
    <div className={classes.container}>
      <div className={classes.popupButton} onClick={() => handleClose()}>
        <svg className={classes.buttonIcon} stroke="currentColor" fill="currentColor" strokeWidth="1" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"></path></svg>
        Back
      </div>
      <div className={classes.modal}>
        <div className={classes.titleBox} >
          <span style={{flex: "auto", fontSize: "1.5rem", justifyContent: "center", color: "#E0E4EB", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <img src={cashapp} style={{width: 40}}/>
            CashApp Deposit
          </span>
        </div>
        <div className={classes.content} >
          <div className={classes.conversionContainer}>
            <div className={classes.topBar}>
              <div className={classes.coinHeader}>Deposit amount</div>
            </div>
            <div className={classes.converterContainer}>
                <Input
                  label=""
                  variant="filled"
                  value={amount}
                  onChange={(e) => updateAmount(e.target.value)}
                  InputProps={{
                    endAdornment: (<></>),
                    startAdornment: (
                      <InputAdornment
                        className={classes.inputIcon}
                        position="start"
                      >
                        <img style={{height: 17, width: 17}} src={coin} />
                      </InputAdornment>
                    ),
                  }}
                />
                <div style={{color: "rgb(208, 214, 225"}}>=</div>
                <Input
                  label=""
                  variant="filled"
                  value={usd}
                  onChange={(e) => updateUsd(e.target.value)}
                  InputProps={{
                    endAdornment: (<></>),
                    startAdornment: (
                      <InputAdornment
                        className={classes.inputIcon}
                        position="start"
                      >
                      <svg height="17" width="17" fill="none" viewBox="0 0 96 96"><path d="M48 96c26.51 0 48-21.49 48-48S74.51 0 48 0 0 21.49 0 48s21.49 48 48 48Z" fill="#6CDE07"></path><path d="M51.52 73.32v6.56h-5.8V73.4c-7.56-.6-13.08-3.56-16.92-7.64l4.72-6.56c2.84 3 6.96 5.68 12.2 6.48V51.64c-7.48-1.88-15.4-4.64-15.4-14.12 0-7.4 6.04-13.32 15.4-14.12v-6.68h5.8v6.84c5.96.6 10.84 2.92 14.6 6.56l-4.88 6.32c-2.68-2.68-6.12-4.36-9.76-5.08v12.52c7.56 2.04 15.72 4.88 15.72 14.6 0 7.4-4.8 13.8-15.72 14.84h.04Zm-5.8-30.a96V31.04c-4.16.44-6.68 2.68-6.68 5.96 0 2.84 2.84 4.28 6.68 5.36ZM58.6 59.28c0-3.36-3-4.88-7.04-6.12v12.52c5-.72 7.04-3.64 7.04-6.4Z" fill="#1B3802"></path></svg>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            <motion.div 
              whileTap={{ scale: 0.97 }}
              className={classes.confirmButton} 
              onClick={() => start()}
              style={{
                pointerEvents: generating ? "none" : "all",
                opacity: generating ? 0.5 : 1,
                cursor: generating ? "not-allowed" : "pointer"
              }}
            >
              {generating ? 'Generating...' : 'Generate Request'}
            </motion.div>
          </div>
          <div className={classes.conversionContainer} style={{marginTop: "1rem"}}>
            <div className={classes.topBar}>
              <div className={classes.coinHeader}>Web Reciept Link</div>
            </div>
            <Input
              label=""
              variant="filled"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              InputProps={{
                endAdornment: (<></>),
                startAdornment: (
                  <InputAdornment
                    className={classes.inputIcon}
                    position="start"
                  >
                    <svg style={{width: 17, height: 17, color: "#fff"}} xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none"><path d="M14 7H16C18.7614 7 21 9.23858 21 12C21 14.7614 18.7614 17 16 17H14M10 7H8C5.23858 7 3 9.23858 3 12C3 14.7614 5.23858 17 8 17H10M8 12H16" stroke="currentColor" strokeWidth="2" stroke-linecap="round" strokeLinejoin="round"/></svg>                  
                  </InputAdornment>
                ),
              }}
            />
            <motion.div 
              whileTap={{ scale: 0.97 }} 
              className={classes.confirmButton} 
              style={{
                pointerEvents: checking ? "none" : "all",
                opacity: checking ? 0.5 : 1,
                cursor: checking ? "not-allowed" : "pointer"
              }}
              onClick={() => check()}
            >
              {checking ? 'Checking...' : 'Check Payment'}
            </motion.div>
          </div>
          <Slide direction="left" in={isNext} timeout={500}>
            <div className={classes.warningContainer} style={{marginTop: "1rem"}}>
              <span>Must send to this CashTag: <span style={{fontWeight: 600}}>{cashTag}</span></span>
              <span>Must add this note: <span style={{fontWeight: 600}}>{note}</span></span>
              <span>Only send the exact amount of money with Cash Balance!</span>
            </div>
          </Slide>
          
        </div>
      </div>
    </div>
  );
};

export default Card;