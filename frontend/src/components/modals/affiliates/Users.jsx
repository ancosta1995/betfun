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
    minHeight: "20rem",
    justifyContent: "center",
    display: "flex",
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
    width: "100%",
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
    height: "10rem",
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
    "& .saveBtn": {
      left: "1rem",
      top: "0.55rem",
      width: "6rem",
      background: "hsl(230, 50%, 50%)",
      color: "#000",
      fontFamily: "Poppins",
      fontSize: "13px",
      fontWeight: 500,
      letterSpacing: ".1em",
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
      "& .MuiButton-label": {
      },
    },
  },
  userWrap: {
    
    justifyContent: "space-between",
    alignItems: "center",
    background: "#101123",
    borderRadius: "10px",
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
    border: "none",
    border: "2px solid #1E232F",
    maxHeight: "23rem",
    overflowY: "auto",
    width: "100%",
    "& th": {
      background: "#1E232F",
      borderBottom: "none",
      color: "#9EA9BF",
      fontFamily: "Poppins",
      fontSize: "12px",
      fontWeight: 500,
      letterSpacing: ".1em",
      textTransform: "none",
      padding: "1em 2em",
      "&:nth-child(1)": {
        paddingLeft: "1rem",
      },
    },
    "& td": {
      borderBottom: "none",
      color: "#fff",
      fontFamily: "Poppins",
      fontSize: "13px",
      fontWeight: 500,
      letterSpacing: ".05em",
      padding: "1em 2em",
      "&:nth-child(1)": {
        paddingLeft: "1rem",
      },
      "&:nth-child(n+1):nth-child(-n+3)": {
        color: "#fff",
        fontFamily: "Poppins",
        fontSize: "13px",
        fontWeight: 500,
        letterSpacing: ".05em",
      },
    },
    "& tr:nth-child(even)": { 
      backgroundColor: "rgb(20, 24, 31)",
    },
    "& tr:nth-child(odd)": { 
      backgroundColor: "rgb(25, 30, 39)",
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

const Users = ({ open = true, handleClose, changeWallet, user }) => {
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
      <div  style={{ background: "#050614", width: "100%"}}>
        {loading ? (
          <Box className={classes.loader}>
            <ColorCircularProgress />
          </Box>
        ) : ( 
          <Box className={classes.tran}>
            {loading ? (
              <LoadingTable />
            ) : affiliatesData.affiliatedUsers.length > 0 ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Total Wager</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {affiliatesData.affiliatedUsers.map(user => {
                    return (
                      <TableRow key={user._id}>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar src={user.avatar} variant="rounded" />
                            <Box ml="1rem" className={classes.desktop}>
                              {user.username}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell><svg width="15" height="15" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8.5" cy="8.5" r="8.5" fill="#FFBC02"></circle><path fillRule="evenodd" clipRule="evenodd" d="M3.96556 3.9556C3.94201 3.97908 3.94554 4.07156 3.971 4.09869C3.98307 4.11138 4.03135 4.20925 4.07844 4.31616C4.16204 4.50593 4.3207 4.8503 4.41431 5.04546C4.49261 5.20853 4.62375 5.495 4.7334 5.74238L4.83745 5.97721L5.40351 6.50814C5.7148 6.8 6.01446 7.08078 6.06936 7.13198C6.12426 7.18303 6.22449 7.27652 6.29189 7.33954C6.3593 7.40269 6.60774 7.63403 6.84382 7.85369C7.0799 8.07335 7.33128 8.30746 7.40237 8.37382C7.55485 8.51618 7.55986 8.48555 7.34836 8.70784C7.2549 8.80601 7.02309 9.04988 6.83323 9.24971C6.64351 9.44954 6.3961 9.70858 6.28365 9.82527L6.07907 10.0375L5.86654 9.9071C5.17597 9.48308 5.15051 9.47667 4.96918 9.68218C4.80625 9.86684 4.80404 9.86188 5.24941 10.3094C5.70067 10.7629 5.66858 10.7041 5.54083 10.8434C5.41852 10.9768 5.38556 11.0133 5.01569 11.4268C4.85438 11.6074 4.68998 11.7906 4.65068 11.834C4.59078 11.9003 4.56178 11.9131 4.47245 11.9131C4.17485 11.9131 3.94922 12.1558 3.94922 12.4761C3.94922 13.1602 4.99038 13.2197 5.06794 12.5402L5.08428 12.3965L5.32021 12.1844C5.44987 12.0679 5.59396 11.9398 5.64033 11.9001C5.72437 11.8282 5.88244 11.6891 6.12911 11.4694C6.29734 11.3197 6.25245 11.2987 6.69105 11.7308C7.14378 12.1767 7.16276 12.1844 7.34777 11.9958C7.5263 11.8138 7.52645 11.8146 7.23768 11.3539C7.15805 11.2268 7.06548 11.077 7.03207 11.0207L6.97113 10.9185L7.02574 10.8628C7.05561 10.832 7.15673 10.7357 7.25019 10.6486C7.68658 10.2423 8.31416 9.65622 8.4138 9.56199C8.55377 9.4297 8.52713 9.42211 8.78985 9.6692C8.91348 9.78545 9.09775 9.95771 9.1993 10.0521C9.86456 10.6702 10.1064 10.9032 10.1062 10.9264C10.1061 10.9409 10.0571 11.0293 9.99732 11.123C9.55195 11.8206 9.55474 11.8107 9.74505 12.0043C9.92476 12.1869 9.95316 12.1749 10.4007 11.7308C10.6094 11.5235 10.7897 11.3539 10.8014 11.3539C10.8187 11.3539 11.4638 11.9062 11.639 12.0711C11.6675 12.0978 11.7647 12.184 11.8552 12.2624C12.0174 12.403 12.0197 12.4068 12.0197 12.5276C12.0197 12.818 12.2164 12.991 12.5606 13.0031L12.7948 13.0113L12.9183 12.9144C13.3283 12.5934 13.1165 11.9131 12.6067 11.9131C12.5144 11.9131 12.4839 11.9022 12.4544 11.8584C12.4339 11.8282 12.3964 11.7818 12.3708 11.755C12.2729 11.6529 11.7835 11.1085 11.5072 10.7948L11.4323 10.7098L11.8241 10.3205C12.2823 9.86524 12.2854 9.85809 12.1032 9.67051C11.931 9.49329 11.8898 9.50073 11.4142 9.79493C11.2008 9.92693 11.0149 10.0282 11.0011 10.0198C10.9789 10.0064 10.4974 9.50628 9.80583 8.77829C9.67425 8.63987 9.56667 8.51881 9.56667 8.50947C9.56667 8.49168 9.73651 8.3289 10.34 7.76822C10.5414 7.58108 10.8114 7.32889 10.9399 7.20797C11.0683 7.0872 11.2554 6.91217 11.3558 6.81911C11.4562 6.72605 11.5669 6.62264 11.6019 6.58924C11.6368 6.55583 11.7963 6.40808 11.9563 6.26105C12.1544 6.07902 12.2611 5.9616 12.2905 5.89363C12.3144 5.83879 12.3625 5.73202 12.3975 5.65661C12.4326 5.5812 12.4897 5.45664 12.5243 5.37977C12.559 5.3029 12.6082 5.19628 12.6336 5.14275C12.6591 5.08922 12.7072 4.98537 12.7406 4.91185C12.774 4.83819 12.8472 4.67964 12.9031 4.55931C13.1925 3.93722 13.1872 3.84562 12.8701 3.99556C12.5503 4.14667 12.3238 4.24921 11.9584 4.40791C11.8505 4.45473 11.6628 4.53904 11.5414 4.59519C11.2485 4.7307 11.1302 4.7835 11.0962 4.79385C11.0807 4.79852 10.9381 4.93913 10.7793 5.10628C10.6205 5.27344 10.3442 5.56326 10.1652 5.75054C9.98642 5.93768 9.8101 6.12365 9.77345 6.16376C9.68117 6.26484 8.95763 7.02025 8.72612 7.25727L8.53566 7.45214L8.4712 7.37921C8.43588 7.3391 8.26588 7.15867 8.09353 6.9781C7.92118 6.79767 7.75016 6.61709 7.71351 6.57698C7.67686 6.53687 7.55161 6.40531 7.43549 6.28453C7.26343 6.10586 6.74933 5.56603 6.45129 5.25127C6.10821 4.88866 6.02138 4.81004 5.90466 4.75637C5.63753 4.63341 5.1851 4.42979 4.82009 4.26832C4.68277 4.2075 4.40371 4.08002 4.25388 4.00957C4.11053 3.94203 4.00014 3.92147 3.96556 3.9556Z" fill="#D3780D"></path></svg> {user.wager.toFixed(2)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className={classes.noAffiliates}>
                No one used your code yet. Share it to start earning!
              </div>
            )}
          </Box>
        )}
      </div>
    </div>
  );
};

const LoadingTable = () => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>User</TableCell>
          <TableCell>Total Wager</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Array(3)
          .fill()
          .map((element, index) => (
            <TableLoader key={index} />
          ))}
      </TableBody>
    </Table>
  );
};

const TableLoader = () => {
  // Declare State
  const classes = useStyles();

  return (
    <TableRow>
      <TableCell>
        <Box display="flex" alignItems="center">
          <Skeleton height={30} width={30} variant="rect" animation="wave" />
          <Box ml="1rem" className={classes.desktop}>
            <Skeleton animation="wave" height={25} width={50} />
          </Box>
        </Box>
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" height={25} width={50} />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" height={25} width={50} />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" height={25} width={100} />
      </TableCell>
    </TableRow>
  );
};

Users.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  changeWallet: PropTypes.func.isRequired,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, { changeWallet })(Users);
