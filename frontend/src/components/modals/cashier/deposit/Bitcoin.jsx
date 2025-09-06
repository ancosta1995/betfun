import React, { Fragment, useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core";
import { useToasts } from "react-toast-notifications";
import { getUserCryptoInformation } from "../../../../services/api.service";
import cutDecimalPoints from "../../../../utils/cutDecimalPoints";

// MUI Components
import TextField from "@material-ui/core/TextField";
import Skeleton from "@material-ui/lab/Skeleton";
import InputAdornment from "@material-ui/core/InputAdornment";

import bitcoin from "../../../../assets/btcdepwith.svg";
import coin from "../../../../assets/icons/coin.png";

const Input = withStyles({
  root: {
    width: "100%",
    marginTop: "auto",
    background: "#101123",
    borderRadius: "0.25rem",
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
  inputs: {
    display: "flex",
    flexDirection: "column",
    height: "10rem",
    justifyContent: "space-around",
    marginTop: "25px",
    "& > div": {
      "& label": {
        color: "#e4e4e4",
        fontFamily: "Poppins",
        fontSize: "15px",
        fontWeight: 300,
      },
      "& label.Mui-focused": {
        color: "#e4e4e4",
      },
      "& .MuiInput-underline:after": {
        borderRadius: "6px",
        borderColor: "#2f3947",
      },
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderRadius: "6px",
          borderColor: "#2f3947",
        },
        "&:hover fieldset": {
          borderRadius: "6px",
          borderColor: "#2f3947",
        },
        "&.Mui-focused fieldset": {
          borderRadius: "6px",
          borderColor: "#2f3947",
        },
      },
      "& > div > input": {
      },
    },
    "& > div > div": {
    },
  },
  value: {
    position: "relative",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    "& > div": {
      width: "100%",
      "& > div": {
      },
      "& > div > input": {
        width: "70%",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },
    },
    "& button": {
      color: "#e4e4e4",
      fontFamily: "Poppins",
      fontSize: "13px",
      fontWeight: 300,
      backgroundColor: "#1d76bd !important",
      position: "absolute",
      right: 0,
      top: "0.65rem",
      width: "6rem",
    },
  },
  Depvalue: {
    position: "relative",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    "& > div": {
      width: "100%",
      "& > div": {
      },
      "& > div > input": {
        width: "70%",
        color: "#fff",
        fontSize: "14px",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },
    },
    "& button": {
      color: "#e4e4e4",
      fontFamily: "Poppins",
      fontSize: "14px",
      fontWeight: 300,
      position: "absolute",
      right: "0.65rem",
      top: "0.65rem",
      width: "6rem",
    },
  },
  withdraw: {
    color: "#e4e4e4",
    fontFamily: "Poppins",
    fontSize: "14px",
    fontWeight: 300,
    width: "100%",
    marginTop: "1rem",
    height: "3rem",
  },
  qr: {
    position: "absolute",
    width: 140,
    right: 0,
    top: 0,
    background: "white",
    borderRadius: 5,
    padding: "0.5rem",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  qrcopy: {
    height: 140,
    width: 140,
    background: "white",
    borderRadius: 5,
    padding: "0.5rem",
  },
  flexbox: {
    alignItems: "center",
    "& img": {
      margin: "0 0 0 2em",
      marginTop: "25px",
      marginLeft: "-5px",
    },
  },
  cryptocolor: {
    color: "#f8931a",
  },
  depositRate: {
    color: "#fff",
    fontSize: "17px",
    margin: "1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.3rem",
  },
  addressBox: {
    backgroundColor: "#101123",
    border: "1px solid transparent",
    display: "flex",
    padding: "1rem",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: "0.25rem",
    color: "rgb(208, 214, 225)",
    fontSize: "13px",
    [theme.breakpoints.down("xs")]: {
      fontSize: "9px",
    },
  },
  infoText: {
    textAlign: "center",
    color: "rgb(208, 214, 225)", 
    fontSize: "0.75rem",
    margin: "0.3rem"
  },
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    margin: "0 3rem 0 0 "
  },
  converterContainer: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    gap: "0.5rem",
    marginTop: "1rem"
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
  warningContainer: {
    borderLeft: "2px solid rgb(249 115 22)",
    backgroundColor: "rgba(253, 186, 116, 0.1)",
    padding: "0.75rem",
    color: "rgb(253 186 116)",
    textAlign: "center"
  },
  addressContainer: {
    display: "flex", 
    width: "100%", 
    gap: "3rem",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      gap: "1rem",
      justifyContent: "center",
      alignItems: "center",
    },
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      gap: "1rem",
      justifyContent: "center",
      alignItems: "center",
    },
  }
}));

const Bitcoin = ({ open, handleClose }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(true);
  const [cryptoData, setCryptoData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState(2);
  const [usd, setUsd] = useState(1);

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

  // componentDidMount
  useEffect(() => {
    // Fetch crypto information from api
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getUserCryptoInformation();

        // Update state
        setCryptoData(data);
        setLoading(false);
      } catch (error) {
        console.log(
          "There was an error while fetching user crypto information:",
          error
        );

        // If this was user generated error
        if (error.response && error.response.status === 400) {
          addToast(error.response.data.error, { appearance: "error" });
        } else {
          addToast(
            "There was an error while fetching your crypto deposit information. Please try again later!",
            { appearance: "error" }
          );
        }
      }
    };

    fetchData();
  }, [addToast]);

  const copyAddress = () => {
    const address = cryptoData.btc.address;
    navigator.clipboard.writeText(address)
      .then(() => {
        addToast("Successfully copied deposit address.", { appearance: "success" });
      })
      .catch((error) => {
        addToast("Failed to copy deposit address", { appearance: "error" });
        console.error("Error copying text to clipboard:", error);
      });
  };

  return (
    <div className={classes.container}>
      <div className={classes.popupButton} onClick={() => handleClose()}>
        <svg className={classes.buttonIcon} stroke="currentColor" fill="currentColor" strokeWidth="1" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"></path></svg>
        Back
      </div>
      <div className={classes.modal}>
        <div className={classes.titleBox} onClose={handleClose} >
          <div style={{fontSize: "1.5rem", color: "#E0E4EB", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <img src={bitcoin} style={{height: 30, width: 30}} />
            Bitcoin Deposit
          </div>
        </div>
        <div className={classes.content} >
          <div className={classes.addressContainer}>
            {loading ? (
              <Skeleton
                height={140}
                width={140}
                animation="wave"
                variant="rect"
                style={{ marginLeft: "2em" }}
              />
            ) : (
              <img
                className={classes.qrcopy}
                src={cryptoData.btc.dataUrl}
                alt="QR Code"
              />
            )}
            <div style={{width: "100%"}}>
              <div style={{color: "rgb(208, 214, 225)", fontSize: "0.75rem", padding: "0.2rem 0"}}>Address</div>
              <div className={classes.addressBox}>
                {loading ? "null" : cryptoData.btc.address}
                <svg onClick={() => copyAddress()} style={{cursor: "pointer"}} width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.74561 3.95174C3.74561 3.46009 3.73155 2.98576 3.75264 2.51488C3.76318 2.25867 3.7948 1.99553 3.87562 1.75317C4.16725 0.846041 4.97189 0.271296 5.99438 0.267833C8.25018 0.253984 10.5025 0.253984 12.7583 0.267833C13.9143 0.274758 14.7505 0.981072 14.9649 2.08555C14.9965 2.24136 15 2.40755 15 2.56681C15.0035 5.46132 15.0035 8.35928 15 11.2538C15 12.3721 14.3851 13.21 13.3661 13.4766C13.1553 13.532 12.9269 13.5562 12.7091 13.5597C12.2347 13.5735 11.7604 13.5631 11.2579 13.5631C11.2579 13.6359 11.2579 13.7051 11.2579 13.7709C11.2474 14.3075 11.2684 14.8442 11.2193 15.3774C11.1314 16.3572 10.2354 17.1778 9.23753 17.2367C9.08644 17.2471 8.93183 17.2505 8.78074 17.2505C6.63739 17.2505 4.49403 17.2505 2.35067 17.254C1.78145 17.254 1.26142 17.1224 0.815179 16.7623C0.267041 16.3192 0.0035137 15.734 0.0035137 15.0381C0 12.0847 -0.0035137 9.13138 0.00702741 6.17802C0.0105411 5.06315 0.709768 4.22527 1.79199 4.00368C1.96065 3.96906 2.13985 3.95867 2.31553 3.95521C2.78285 3.94828 3.25018 3.95174 3.74561 3.95174ZM1.50738 10.6063C1.50738 12.0536 1.50738 13.5043 1.50738 14.9515C1.50738 15.5228 1.76388 15.7756 2.34364 15.7756C4.53268 15.7756 6.72171 15.7756 8.91427 15.7756C9.02319 15.7756 9.13914 15.7686 9.24455 15.741C9.57836 15.6509 9.75053 15.3843 9.75053 14.9654C9.75053 12.0744 9.75053 9.18331 9.75053 6.29227C9.75053 5.70022 9.487 5.44054 8.88264 5.44054C7.04849 5.44054 5.21785 5.44054 3.3837 5.44054C3.00773 5.44054 2.63528 5.43708 2.25931 5.44054C1.89389 5.444 1.62333 5.62751 1.54252 5.93912C1.51089 6.0603 1.50738 6.19187 1.50738 6.31651C1.50738 7.74299 1.50738 9.17292 1.50738 10.6063ZM11.2544 12.0813C11.785 12.0813 12.2874 12.0917 12.7899 12.0778C13.2045 12.064 13.454 11.8078 13.4856 11.3992C13.4926 11.323 13.4926 11.2503 13.4926 11.1741C13.4926 9.35297 13.4926 7.52832 13.4926 5.70714C13.4926 4.65806 13.4961 3.60897 13.4926 2.55643C13.4926 2.00592 13.2326 1.74624 12.6774 1.74624C10.4708 1.74624 8.26423 1.74278 6.05762 1.74624C5.52003 1.74624 5.25299 2.01977 5.24947 2.5495C5.24947 2.95806 5.24947 3.37007 5.24947 3.77863C5.24947 3.83402 5.24947 3.88942 5.24947 3.95174C5.34083 3.95174 5.40408 3.95174 5.47084 3.95174C6.63739 3.95174 7.80042 3.95174 8.96697 3.95174C9.40267 3.95174 9.81729 4.04523 10.1862 4.27374C10.9065 4.71692 11.2509 5.37476 11.2509 6.20225C11.2579 8.08922 11.2544 9.97618 11.2544 11.8597C11.2544 11.9289 11.2544 11.9947 11.2544 12.0813Z" fill="currentColor"></path></svg>
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
              </div>
            
          </div>
          <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignContent: "center", marginTop: "1rem", marginBottom: "1rem"}}>
            <div className={classes.warningContainer}>
              Only deposit on the Bitcoin Network!
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
};

export default Bitcoin;