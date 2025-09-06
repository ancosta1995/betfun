import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { useToasts } from "react-toast-notifications";
import { RECAPTCHA_SITE_KEY, createDepositSession, unlinkRobloxUsername, getUserCryptoInformation, getUserDepositInformation, tryCreateOrderSkinsBack } from "../../../services/api.service";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
// MUI Components
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Skeleton from "@material-ui/lab/Skeleton";
import { ClipLoader } from 'react-spinners';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logout } from "../../../actions/auth";
import { checkPhrase } from "../../../services/api.service.js";
import ReCAPTCHA from "react-google-recaptcha";

// Custom Styles
const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh', // Eğer sayfa yüksekliğini tamamen kaplamak istiyorsanız
  marginTop: '-50px', // Veya istediğiniz miktarı belirleyin
};

const useStyles = makeStyles(theme => ({
  root: {

    paddingTop: "0rem",
    [theme.breakpoints.down("xs")]: {
      padding: 0,
      margin: 10,
    },
  },

  inputs: {
    height: "14rem",

    display: "flex",
    flexDirection: "column",

    justifyContent: "space-around",
    padding: "2rem",

    "& > div": {
      "& label": {
        color: "#e4e4e4",
        fontFamily: "Rubik",
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
      fontFamily: "Rubik",
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
      fontFamily: "Rubik",
      fontSize: "14px",
      fontWeight: 300,
    //  position: "absolute",
     // right: "0.65rem",
    //  top: "0.65rem",
    //  width: "6rem",
    },
  },
  withdraw: {
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "14px",
    fontWeight: 500,
    letterSpacing: ".1em",
    backgroundColor: "#6b00ff !important",
    width: "100%",
  //  marginTop: "1rem",
    height: "3rem",
  },

  qr: {
    position: "absolute",
    width: 140,
    marginRight: "1rem",
    right: 0,
    top: 0,
    background: "white",
    borderRadius: 5,
    padding: "0.5rem",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  captcha: {
    marginTop: "0.75rem",
  },

  qrcopy: {
    height: 140,
    width: 140,
    marginLeft: "2em",
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
  cryptos: {
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
    },
    "& div:nth-child(1)": {
      position: "relative",
    },
    "& button:nth-child(1)": {
      backgroundColor: "#0D1116",
      borderRadius: "50%",
      boxShadow: "none",
      "& img": {
        width: "3.5rem",
        [theme.breakpoints.down("sm")]: {
          width: "1rem",
        },
      },
    },
    "& button:nth-child(2)": {
      backgroundColor: "#0D1116",
      borderRadius: "50%",
      boxShadow: "none",
      margin: "0 14px",
      "& img": {
        width: "3.5rem",
        [theme.breakpoints.down("sm")]: {
          width: "1rem",
        },
      },
    },
    "& button:nth-child(3)": {
      backgroundColor: "#0D1116",
      borderRadius: "50%",
      boxShadow: "none",
      marginRight: "14px",
      "& img": {
        width: "3.5rem",
        [theme.breakpoints.down("sm")]: {
          width: "1rem",
        },
      },
    },
    "& button:nth-child(4)": {
      backgroundColor: "#0D1116",
      borderRadius: "50%",
      boxShadow: "none",
      marginRight: "14px",
      "& img": {
        width: "3.5rem",
        [theme.breakpoints.down("sm")]: {
          width: "1rem",
        },
      },
    },
    "& button:nth-child(5)": {
      backgroundColor: "#0D1116",
      borderRadius: "50%",
      boxShadow: "none",
      "& img": {
        width: "7rem",
        [theme.breakpoints.down("sm")]: {
          width: "1rem",
        },
      },
    },
  },
  crypto: {
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      height: "3rem",
      padding: "0",
      minWidth: 0,
    },
    "&:hover": {
      transform: "scale(1.06)",
      transition: "400ms all",
    },
  },
  buttontest: {
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: ".1em",
  },
  desktop: {
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  mobile: {
    display: "none",
    [theme.breakpoints.down("sm")]: {
      display: "flex",
    },
  },
  ferzBz: {
    display: "flex",
    flexWrap: "wrap",
    position: "relative",
    gap: "16px",
  },
  bHNrGF: {
    width: "150px",
    height: "54px",
    marginTop: "10px",
    display: "flex",
    flexDirection: "row",
    borderRadius: "3px",
    backgroundColor: "#0D1116",
    transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) 0s",
    cursor: "pointer",
    [theme.breakpoints.down("xs")]: {
      width: "140px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "140px",
    },
    [theme.breakpoints.down("md")]: {
      width: "140px",
    },
  },
  iconHold: {
    width: "64px",
    height: "54px",
    display: "flex",
    WebkitBoxAlign: "center",
    alignItems: "center",
    WebkitBoxPack: "center",
    justifyContent: "center",
    backgroundColor: "rgb(24 29 36)",
    borderRadius: "2px 0px 0px 2px",
    marginDottom: "8px",
    transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) 0s",
  },
  info: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    WebkitBoxPack: "center",
    justifyContent: "center",
    WebkitBoxAlign: "center",
    alignItems: "center",
    textAlign: "center",
    fontWeight: 300,
  },
  title: {
    color: "rgb(255, 255, 255)",
  },
  BoxAll: {
    marginBottom: "10px",
    display: "grid",
    gap: "0.75rem",
    gridTemplateColumns: "repeat(auto-fill, minmax(calc(100% - .75rem), 1fr))",
    [theme.breakpoints.down("xs")]: {
      padding: "0rem",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "0rem",
    },
    [theme.breakpoints.down("md")]: {
      padding: "0rem",
    },
  },
  link: {
    width: "-webkit-fit-content",
    width: "-moz-fit-content",
    width: "fit-content",
    background: "#0D1116",
    borderRadius: "4px",
    padding: "1rem 1.75rem",
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    textAlign: "left",
    marginLeft: "auto",
    cursor: "pointer",
    fontFamily: "Rubik",
  },
  linkText: {
    color: "rgba(239,250,251,.5)",
    gridRow: 1,
    gridColumn: 1,
    fontSize: ".9rem",
    marginRight: "30px",
  },
  linkSvg: {
    gridRow: 1,
    gridColumn: 1,
    margin: "auto 0",
    marginLeft: "auto",
    height: "20px !important",
    width: "20px !important"
  },
  inputContainer: {
    display: "flex",
    alignItems: "flex-end",
    margin: 0,
    padding: 0,
    border: 0,
    fontSize: "100%",
    font: "inherit",
    verticalAlign: "baseline",
    boxSizing: "border-box",
  },
  imgContainer: {
    width: "60px",
    minWidth: "60px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#FFC440",
    borderRadius: "6px",
    marginRight: "15px",
  },
  userInputContainer: {
    width: "100%",
    width: "600px",
    position: "relative",
  },
  userInputContainer2: {
    width: "100%",
    borderRadius: "6px",
    position: "relative",
  },
  nameInput: {
    height: "60px",
    background: "0 0",
    width: "100%",
    borderRadius: "6px",
    outline: 0,
    border: 0,
    paddingLeft: "18px",
    paddingRight: "36px",
    fontWeight: 500,
    fontSize: "20px",
    color: "#fff",
    border: "2px dashed #3000e4",
  },
}));

const Bitcoin = ({ user, logout}) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [GrowID, setGrowID] = useState(""); // State for GrowID
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const [showTextField, setShowTextField] = useState(false);
  const handleInputChange = event => {
    setUsername(event.target.value);
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const openn = Boolean(anchorEl);
  const copyLinkAction = () => {
    const phrase = user?.mnemonicPhrase;
    navigator.clipboard.writeText(phrase)
      .then(() => {
        addToast("Successfully copied phrase!", { appearance: "success" });
      })
      .catch((error) => {
        addToast("Failed to copy phrase.", { appearance: "error" });
        console.error("Error copying text to clipboard:", error);
      });
  };
  const handleGrowIDChange = event => {
    setGrowID(event.target.value);
  };

  const [cryptoData, setCryptoData] = useState(null);
  const [username, setUsername] = useState(user?.robloxUsername);

  const [copied, setCopied] = useState(false);
  const handleStartDeposit = async () => {
    if (!captchaVerified) {
      // If ReCAPTCHA is not verified, display an error message or handle it accordingly
      addToast("Please complete the ReCAPTCHA verification.", { appearance: "error" });
      return;
    }


    setLoading(true);
    let gameCode = "mm2";

    // Get the token from local storage
    const token = localStorage.getItem('token');
  
    if (!token) {
      // Handle case where token is not present
      addToast("Session Expired. Refresh Page or Please log in.", { appearance: "error" });
      setLoading(false); // Set loading to false in case of an error
      return;
    }
    if (GrowID.trim() === '' || GrowID.length > 14 || GrowID.length < 3) {
      // Alert the user or handle the validation error accordingly
      addToast('Please enter a valid GrowID (1-14 characters)', { appearance: "error" });
      setLoading(false); // Set loading to false in case of an error

      // Prevent further execution of the function
      return;
    }

    try {
      // Decode the user ID from the token
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userId = decodedToken.user.id;

      // Call createDepositSession with the extracted user ID
      const res = await createDepositSession(username, GrowID, userId, gameCode, token);
  
      console.log(res);
  
      if (res.success) {
        const data = await getUserDepositInformation();

        // Update state
        setCryptoData(data);

        setShowTextField(true);

        // Handle the success case here, e.g., update UI, navigate to another page, etc.
        // Example: navigate to the deposit success page
  
        // Additional actions or UI updates can be performed here
  
      } else {
        // Handle the case where res.success is falsy
        throw new Error(res.reason);
      }
  
    } catch (error) {
      // Handle any errors that occur during the process
      const data = await getUserDepositInformation();

      // Update state
      setCryptoData(data);

      setShowTextField(true);
      setShowTextField(true);

    addToast("Successfully Created Deposit Address ", { appearance: "success" });
    } finally {
      setLoading(false); // Set loading to false after handling the request
    }
  };
  const onChange = (token) => {
    // Here you can handle the ReCAPTCHA token if needed
    console.log("ReCAPTCHA token:", token);
    // Set captchaVerified to true when ReCAPTCHA is successfully completed
    setCaptchaVerified(true);
  };



  return (
    <Box className={classes.root}>
      <Fragment>
        <Box className={classes.flexbox}>
          <Box className={classes.inputs}>
            <Box className={classes.cryptocolor}>
            </Box>


            {loading ? (
        <div style={containerStyle}>
          <div className="flex flex-col items-center gap-4 py-2">
            <ClipLoader size={30} color="white" />
          </div>
          <div className="flex flex-col items-center py-2">
            <span>Loading... This may take up to 30 seconds.</span>
          </div>
        </div>
  ) : showForm ? (
    <>
      {showTextField && (
        <TextField
          label="World"
          variant="outlined"
          value={cryptoData}
          style={{ marginBottom: '10px' }}
        />
      )}

      {!showTextField && ( // Conditionally render the input field
        <Box
          open={openn}
          onClose={() => setAnchorEl(null)}
          display="flex"
          className={classes.BoxAll}
        >
          <div className={classes.inputContainer}>
            <div className={classes.userInputContainer}>
              <div className={classes.userInputContainer2}>
              <input
                                className={classes.nameInput}
                                type="text"
                                placeholder="GrowID"
              
      label="GrowID"
      variant="outlined"
      value={GrowID}
      onChange={handleGrowIDChange}
    />
            <ReCAPTCHA
        className={classes.captcha}
        onChange={onChange}
        sitekey={RECAPTCHA_SITE_KEY}
      />

              </div>
            </div>
          </div>
        </Box>
      )}

      <Button
        className={classes.withdraw}
        style={{ fontFamily: 'Rubik', padding: '15px' }}
        variant="contained"
        onClick={() => { handleStartDeposit(); }}
        disabled={showTextField}
      >
        {showTextField ? "Bot waiting you in world" : "Start Deposit"}
      </Button>
    </>
  ) : null}
</Box>



        </Box>
      </Fragment>
    </Box>
  );
};
Bitcoin.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(Bitcoin);