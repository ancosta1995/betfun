import React, { useState, useEffect, Fragment } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useToasts } from "react-toast-notifications";
import {
  getUserAffiliatesData,
  updateUserAffiliateCode,
  claimUserAffiliateEarnings,
} from "../../../services/api.service";
import parseCommasToThousands from "../../../utils/parseCommasToThousands";
import { changeWallet } from "../../../actions/auth";
import PropTypes from "prop-types";
import { connect } from "react-redux";


// MUI Components
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Skeleton from "@material-ui/lab/Skeleton";
import Grow from '@material-ui/core/Grow';


import success from "../../../assets/success.wav";
import error from "../../../assets/error.wav";

const errorAudio = new Audio(error);
const successAudio = new Audio(success);

const playSound = audioFile => {
  audioFile.play();
};

// Custom Styled Component
const ColorCircularProgress = withStyles({
  root: {
    color: "#fff !important",
  },
})(CircularProgress);

// Custom Styles
const useStyles = makeStyles(theme => ({
  modal: {
    minHeight: "10rem",
    "& div > div": {
      color: "#e4e4e4",
      fontFamily: "Poppins",
      fontSize: "14px",
      fontWeight: 300,
    },
    "& .MuiDialog-paperWidthSm": {
      scrollbarWidth: "none",
      width: "50%",
      background: "#101123",
      // border: "2px solid #2f3947",
      borderRadius: "20px",
      [theme.breakpoints.down("xs")]: {
        width: "100%",
        margin: "85px 15px 15px 15px",
        height: "80%",
      },
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        margin: "85px 15px 15px 15px",
        height: "80%",
      },
      [theme.breakpoints.down("md")]: {
        width: "100%",
        margin: "85px 15px 15px 15px",
        height: "80%",
      },
    },
  },
  vipTitle: {
    fontSize: 14,
    fontFamily: "Poppins",
    textAlign: "left",
    marginLeft: "1rem",
    fontWeight: 300,
    "& > span": {
      fontFamily: "Poppins",
      color: "hsl(230, 50%, 50%)",
    },
  },
  vipDesc: {
    width: "90%",
    color: "#e4e4e4",
    fontFamily: "Poppins",
    fontSize: "14px",
    fontWeight: 300,
    textAlign: "center",
    margin: "1rem auto",
    "& > a": {
      color: "#4caf50",
      fontFamily: "Poppins",
      fontSize: "14px",
      fontWeight: 300,
      textDecoration: "none",
    },
  },
  progressbox: {
    margin: "0 1rem",
    "& > img": {
      position: "absolute",
      top: -10,
      zIndex: 1000,
    },

  },
  buttontest: {
    color: "#e4e4e4",
    fontFamily: "Poppins",
    fontSize: "13px",
    fontWeight: 300,
  },
  titlePoppins: {
    fontFamily: "Poppins",
  },
  progress: {
    height: "2.5rem",
    borderRadius: "0.25rem",
    "& > div": {
      background:
        "-webkit-linear-gradient( 0deg, rgb(52, 63, 68) 0%, #4CAF50 100%) !important",
    },
  },
  rake: {
    color: "#fff",
    background: "#1315184a",
    fontFamily: "Poppins",
    border: "1px solid #2f3947",
    padding: "10px",
    "&:hover": {
      transition: "all 400ms",
      transform: "scale(1.06)",
      WebkitTransform: "scale(1.06)",
      background: "#1315184a",
      border: "1px solid #2f3947",
    },
  },
  loader: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "10rem",
  },
  profile: {
    margin: "5rem 10rem",
    color: "#e0e0e0",
    [theme.breakpoints.down("xs")]: {
      margin: "2rem 0",
      padding: "2rem 1.5rem 2rem 1.5rem",
    },
    [theme.breakpoints.down("sm")]: {
      margin: "2rem 0",
      padding: "2rem 1.5rem 2rem 1.5rem",
    },
    [theme.breakpoints.down("md")]: {
      margin: "2rem 0",
      padding: "2rem 1.5rem 2rem 1.5rem",
    },
    "& > h1": {
      color: "#e4e4e4",
      fontFamily: "Poppins",
      fontSize: "20px",
      fontWeight: 500,
      letterSpacing: ".1em",
      margin: 0,
      marginBottom: "1rem",
    },
  },
  saveButton: {
    textTransform: "none",
    width: "6rem",
    background: "#1E232F",
    color: "#9E9FBD",
    fontFamily: "Poppins",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: ".1em",
    "&:hover": {
      background: "#1E232F",
      color: "#9E9FBD",
    },
    [theme.breakpoints.down("xs")]: {
      left: "0rem",
      marginBottom: "50px",
    },
    [theme.breakpoints.down("sm")]: {
      left: "0rem",
      marginBottom: "50px",
    },
    [theme.breakpoints.down("md")]: {
      left: "0rem",
      marginBottom: "50px",
    },
  },
  userWrap: {
    justifyContent: "space-between",
    alignItems: "center",
    background: "#101123",
    borderRadius: "0.5rem",
    gap: "0.5rem",
    // border: "2px solid #2f3947",
    padding: "2rem",
    height: "fit-content",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
    "& input": {
      color: "#e4e4e4",
      fontFamily: "Poppins",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".05em",
    },
    "& label": {
      color: "#5f6368",
      fontFamily: "Poppins",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".1em",
    },
    "& label.Mui-focused": {
      color: "#5f6368",
      fontFamily: "Poppins",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".1em",
    },
    "& .MuiInput-underline:after": {
      border: "1px solid #2f3947",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        border: "1px solid #2f3947",
      },
      "&:hover fieldset": {
        border: "1px solid #2f3947",
      },
      "&.Mui-focused fieldset": {
        border: "1px solid #2f3947",
      },
    },
    "& > div": {
      width: "100%",
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        marginBottom: 20,
      },
      "& > div": {
        width: "100%",
      },
    },
  },
  userWrap2: {
    gap: "0.5rem",
    display: "flex",
    [theme.breakpoints.down("xs")]: {
      display: "unset",
    },
    [theme.breakpoints.down("sm")]: {
      display: "unset",
    },
    [theme.breakpoints.down("md")]: {
      display: "unset",
    },
  },
  grid: {
    flexWrap: "nowrap",
    justifyContent: "space-between",
    margin: "1rem 0 2rem",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
    "& .stats": {
      width: "24%",
      [theme.breakpoints.down("sm")]: {
        flexDirection: "column",
        width: "100%",
        marginTop: 20,
      },
    },
    "& .earnings": {
      width: "49%",
      background: "#101123",
      borderRadius: "10px",
      // border: "2px solid #2f3947",
      color: "#e0e0e0",
      fontFamily: "Poppins",
      fontSize: "13px",
      fontWeight: 500,
      letterSpacing: ".05em",
      position: "relative",
      [theme.breakpoints.down("xs")]: {
        width: "100%",
        fontSize: 11,
        marginTop: "20px",
      },
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        fontSize: 11,
        marginTop: "20px",
      },
      [theme.breakpoints.down("md")]: {
        width: "100%",
        fontSize: 11,
        marginTop: "20px",
      },
      "& > button": {
        position: "absolute",
        background: "hsl(230, 50%, 50%)",
        color: "#e0e0e0",
        fontFamily: "Poppins",
        fontSize: "13px",
        fontWeight: 500,
        letterSpacing: ".05em",
        width: "6rem",
        right: "2rem",
        [theme.breakpoints.down("xs")]: {
          width: "5rem",
          right: "0.8rem",
        },
        [theme.breakpoints.down("sm")]: {
          width: "5rem",
          right: "0.8rem",
        },
        [theme.breakpoints.down("md")]: {
          width: "5rem",
          right: "0.8rem",
        },
        "& .MuiButton-label": {
        },
      },
    },
    "& > div": {
      
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      background: "#101123",
      borderRadius: "10px",
      // border: "2px solid #2f3947",
      height: "7rem",
      padding: "0 2rem",
      color: "#9d9d9d",
      fontFamily: "Poppins",
      fontSize: "13px",
      fontWeight: 500,
      letterSpacing: ".05em",
      "& svg": {
        marginRight: "0.25rem",
        color: "hsl(230, 50%, 50%)",
      },
      "& h1": {
        margin: 0,
        color: "#e0e0e0",
        fontFamily: "Poppins",
        fontSize: "14px",
        fontWeight: 500,
        letterSpacing: ".05em",
      },
    },
  },
  tran: {
    
    background: "#101123",
    borderRadius: "10px",
    // border: "2px solid #2f3947",
    padding: "2rem",
    paddingTop: "1rem",
    [theme.breakpoints.down("sm")]: {
      padding: "1rem",
    },
    "& th": {
      borderBottom: "none",
      color: "#000",
      fontFamily: "Poppins",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".1em",
      textTransform: "uppercase",
      paddingLeft: 0,
    },
    "& .MuiAvatar-root": {
      width: "35px",
      height: "35px",
      borderRadius: "50%",
    },
    "& td": {
      borderBottom: "1px #2f3947 solid",
      color: "#9d9d9d",
      fontFamily: "Poppins",
      fontSize: "13px",
      fontWeight: 500,
      letterSpacing: ".05em",
      paddingLeft: 0,
      "&:nth-child(1)": {
        paddingLeft: "1rem",
      },
    },
  },
  bgInput: {
    "& .MuiOutlinedInput-root": {
    },
  },
  desktop: {
    display: "flex",
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  noAffiliates: {
    width: "100%",
    textAlign: "center",
    padding: "2rem 0 1rem 0",
    color: "#9d9d9d",
    fontFamily: "Poppins",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: ".05em",
  },
}));

const Code = ({ open = true, handleClose, changeWallet, user }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [affiliatesData, setAffiliatesData] = useState(null);
  const [affiliateCode, setAffiliateCode] = useState("Loading...");

  // Get affiliates data from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getUserAffiliatesData();

      // Update state
      setAffiliatesData(data);
      setAffiliateCode(data.affiliateCode);
      setLoading(false);
    } catch (error) {
      console.log(
        "There was an error while loading user affiliates data:",
        error
      );
    }
  };

  // Save user affiliate code
  const saveAffiliateCode = async () => {
    setSaving(true);
    try {
      const response = await updateUserAffiliateCode(affiliateCode);

      // Update state
      setSaving(false);
      setAffiliateCode(response.newAffiliateCode);
      setAffiliatesData(state =>
        state ? { ...state, affiliateCode: response.newAffiliateCode } : null
      );
      addToast("Successfully updated your affiliate code!", {
        appearance: "success",
      });
      playSound(successAudio);
    } catch (error) {
      setSaving(false);

      // If user generated error
      if (error.response && error.response.data && error.response.data.errors) {
        // Loop through each error
        for (
          let index = 0;
          index < error.response.data.errors.length;
          index++
        ) {
          const validationError = error.response.data.errors[index];
          addToast(validationError.msg, { appearance: "error" });
          playSound(errorAudio);
        }
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.error
      ) {
        addToast(error.response.data.error, { appearance: "error" });
        playSound(errorAudio);
      } else {
        console.log(
          "There was an error while updating user affiliate code:",
          error
        );
        addToast(
          "There was an error while updating your affiliate code. Please try again later!",
          { appearance: "error" }
        );
        playSound(errorAudio);
      }
    }
  };

  // Claim user affiliate earnings
  const claimEarnings = async () => {
    setClaiming(true);
    try {
      const response = await claimUserAffiliateEarnings();

      // Update state
      setClaiming(false);
      setAffiliatesData(state =>
        state ? { ...state, affiliateMoneyAvailable: 0 } : null
      );
      addToast(`Successfully claimed ${response.claimedAmount} credits!`, {
        appearance: "success",
      });
      playSound(successAudio);

      // Update redux state
      changeWallet({ amount: response.claimedAmount });
    } catch (error) {
      setClaiming(false);

      // Check if user caused this error
      if (error.response && error.response.data && error.response.data.error) {
        addToast(error.response.data.error, { appearance: "error" });
        playSound(errorAudio);
      } else {
        console.log(
          "There was an error while claiming user affiliate earnings:",
          error
        );
        addToast(
          "There was an error while claiming your affiliate earnings. Please try again later!",
          { appearance: "error" }
        );
        playSound(errorAudio);
      }
    }
  };

  // Input onChange event handler
  const onChange = (e, newValue) => {
    setAffiliateCode(e.target.value);
  };

  // componentDidMount
  useEffect(() => {
    if (open) fetchData();
  }, [open]);


  return (
    <div
      className={classes.modal}
      onClose={handleClose}
      open={open}
      style={{ fontFamily: "Poppins", }}
    >
      <div  style={{ background: "#050614", }}>
        {loading ? (
          <Box className={classes.loader}>
            <ColorCircularProgress />
          </Box>
        ) : ( 
        <div>
          <p style={{ marginLeft: "5px", }}>Become our affiliate and earn money for every referral. When your referrals play or deposit, watch your earnings grow. More referrals - more earnings. Just share your code or link.</p>
          <Box className={classes.userWrap}>
            <Box className={classes.userWrap2}>
              <Box position="relative">
                <TextField
                  className={classes.bgInput}
                  variant="outlined"
                  label="Set your code"
                  disabled={loading}
                  value={affiliateCode}
                  onChange={onChange}
                  InputProps={{
                    endAdornment: (
                      <Button
                        className={classes.saveButton}
                        variant="contained"
                        disabled={saving || loading}
                        onClick={saveAffiliateCode}
                      >
                        {saving ? "Saveing..." : "Save"}
                      </Button>
                    ),
                  }}
                />
                
              </Box>
              <TextField
                className={classes.bgInput}
                variant="outlined"
                label="Your affiliate link"
                disabled={loading}
                value={loading ? "Loading..." : affiliatesData.affiliateLink}
                onFocus={e => e.target.select()}
              />
            </Box>
          </Box>
        </div>
        )}
      </div>
    </div>
  );
};

Code.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  changeWallet: PropTypes.func.isRequired,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, { changeWallet })(Code);
