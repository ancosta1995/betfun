import React, { useState, useEffect, Fragment } from "react";
import { Tab, makeStyles } from "@material-ui/core";
import { getUserInviData, getUserTxData, getUserVipData } from "../../../services/api.service";
import parseCommasToThousands from "../../../utils/parseCommasToThousands.js";
import { useToasts } from "react-toast-notifications";
import cutDecimalPoints from "../../../utils/cutDecimalPoints.js";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Skeleton from "@material-ui/lab/Skeleton";

// MUI Components
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";

import CashierModal from "../cashier/CashierModal.jsx";

import bitcoin from "../../../assets/btcdepwith.svg";
import ethereum from "../../../assets/ethdepwith.svg";
import litecoin from "../../../assets/ltcdepwith.svg";
import dogeimg from "../../../assets/dogecoin.webp";
import usdtimg from "../../../assets/usdt.webp";
import usdcimg from "../../../assets/usdc.webp";
import credit from  "../../../assets/credit.png";
import gift from  "../../../assets/gift.png";
import solimg from "../../../assets/usdc.webp";

import coin from "../../../assets/icons/coin.png";

// Custom Styles
const useStyles = makeStyles(theme => ({
  modal: {
    "& .MuiDialog-paperWidthSm": {
      scrollbarWidth: "none",
      width: "50%",
      background: "#050614",
      borderRadius: "0.5em",
      [theme.breakpoints.down("xs")]: {
        width: "100%",
        margin: "15px",
        marginTop: "80px",
        maxHeight: "80%",
      },
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        margin: "15px",
        marginTop: "80px",
        maxHeight: "80%",
      },
      [theme.breakpoints.down("md")]: {
        width: "100%",
        margin: "15px",
        marginTop: "80px",
        maxHeight: "80%",
      },
    },
  },
  titleBox: {
    display: "flex",
    boxShadow: "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
    alignItems: "center",
    paddingTop: "1em",
    paddingLeft: "1.5em",
    paddingRight: "1em",
    paddingBottom: "1em",
    fontFamily: "Poppins", 
    backgroundColor: "#101123", 
    justifyContent: "space-between",
    width: "100%"
  },
  content: {
    padding: "1.5em",
    display: "block",
  },
  balanceText: {
    color: "#9E9FBD",
    fontSize: "0.875rem",
    textAlign: "center",
    marginBottom: "0.25rem",
  },
  balanceNumber: {
    color: "hsl(220, 22%, 100%)",
    fontSize: "1.5rem",
    textAlign: "center",
    gap: "0.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  depoWith: {
    display: "flex",
    marginTop: "0.25rem",
    justifyContent: "center",
  },
  activityText: {
    color: "hsl(220, 22%, 100%)",
    fontWeight: 500,
    marginTop: "1.5em",
    marginBottom: "1em"
  },
  tran: {
    border: "none",
    border: "2px solid #1E232F",
    maxHeight: "23rem",
    overflowY: "auto",
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
  noTransactions: {
    width: "100%",
    textAlign: "center",
    padding: "2rem 0 1rem 0",
    color: "#9E9FBD",
    fontFamily: "Poppins",
    fontSize: "14px",
    fontWeight: 500,
    marginBottom: "2rem"
  },
  span:  {
    cursor: "pointer",
    background: "#2967e0",
    borderRadius: "0.4rem",
    width: "fit-content",
    height: "30px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "10px",
    transition: "all ease-in-out .2s",
    color: "#fff",
    padding: "0 5px",
    background: "repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(0,0,0,.08) 0,rgba(0,0,0,.08) 20px)",
    "&:hover": {
      opacity: 0.75
    }
  },
  box: {
    outlineOffset: "2px",
    padding: "1rem",
    color: "#fff",
    border: "none",
    backgroundColor: "#050614",
    borderRadius: "0.4rem"
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
    marginRight: "0.25rem",
    "&:hover": {
      backgroundColor: "#313A4D",
      filter: "brightness(130%)"
    }
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
  }
}));


const WalletModal = ({ open, handleClose, user }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();
  const [anchorEl, setAnchorEl] = useState(null);
  const openn = Boolean(anchorEl);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [cashierOpen, setCashierOpen] = useState(false);

  const getMonthFromIndex = index => {
    switch (index) {
      default:
      case 0:
        return "Jan";
      case 1:
        return "Feb";
      case 2:
        return "Mar";
      case 3:
        return "Apr";
      case 4:
        return "May";
      case 5:
        return "Jun";
      case 6:
        return "Jul";
      case 7:
        return "Aug";
      case 8:
        return "Sep";
      case 9:
        return "Oct";
      case 10:
        return "Nov";
      case 11:
        return "Dec";
    }
  };
  const parseDate2 = timestamp => {
    const d = new Date(timestamp);
    return `${getMonthFromIndex(
      d.getMonth()
    )} ${d.getDate()}, ${d.getFullYear()}, ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getUserTxData();
        setProfile(prev => [...data]);
        //const data2 = await getUserInviData();
        //setInventory(prev => [...data2]);
        setLoading(false);
      } catch (error) {
        console.log("There was an error while loading user transaction history data:", error);
      }
    }
    
    const error = msg => {
      addToast(msg, { appearance: "error" });
    };

    const success = msg => {
      addToast(msg, { appearance: "success" });
    };

    const log = msg => {

    };

    const setActiveListings = (listings) => {

    };

    if (open) {
      fetchData();
    } else {

    }
  

    return () => {

    }
  }, [open]);

  const copyTx = (tx) => {
    navigator.clipboard.writeText(tx)
      .then(() => {
        addToast("Successfully copied transaction tx.", { appearance: "success" });
      })
      .catch((error) => {
        addToast("Failed to copy transaction tx", { appearance: "error" });
        console.error("Error copying text to clipboard:", error);
      });
  };

  const returnCurrency = (cur) => {
    if(cur == "BTC") return <img src={bitcoin} />
    if(cur == "ETH") return <img src={ethereum} />
    if(cur == "LTC") return <img src={litecoin} />
    if(cur == "DOGE") return <img src={dogeimg} />
    if(cur == "USDT") return <img src={usdtimg} />
    if(cur == "USDC") return <img src={usdcimg} />
    if(cur == "SOL") return <img src={solimg} />

    if(cur == "CARD") return <img src={credit} />
    if(cur == "GIFT") return <img src={gift} />
  };

  return (
      <Dialog
        className={classes.modal}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >    
        <div className={classes.titleBox} onClose={handleClose} >
          <span style={{flex: "auto", fontSize: "1.5rem", color: "#E0E4EB" }}>Wallet</span>
          <svg className={classes.buttonIcon} style={{cursor: "pointer"}} onClick={() => handleClose()} fill="currentColor" tabIndex="-1" viewBox="0 0 320 512"><path d="M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z"></path></svg>
        </div>
        <div className={classes.content} >
          <CashierModal
            open={cashierOpen}
            handleClose={() => setCashierOpen(!cashierOpen)}
          />
          <div>
            <div className={classes.balanceText}>Balance</div>
            <div className={classes.balanceNumber}><img style={{height: 25, width: 25}} src={coin} />{user?.wallet == 0 ? "0" : parseCommasToThousands(cutDecimalPoints(user?.wallet))}</div>
            <div className={classes.depoWith}>
              <div className={classes.button} onClick={() => setCashierOpen(!cashierOpen)}>
                <svg className={classes.buttonIcon} fill="currentColor" width="24" height="24" viewBox="0 0 24 24" ><path data-v-8351ef5e="" data-v-98afd824="" d="M2 12H4V17H20V12H22V17A2 2 0 0 1 20 19H4A2 2 0 0 1 2 17M11 5H13V8H16V10H13V13H11V10H8V8H11Z"><title data-v-8351ef5e="" data-v-98afd824="">Tray Plus icon</title></path></svg>
                Deposit
              </div>
              <div className={classes.button} onClick={() => setCashierOpen(!cashierOpen)} style={{marginLeft: "0.25rem"}}>
                <svg className={classes.buttonIcon} fill="currentColor" width="24" height="24" viewBox="0 0 24 24" ><path data-v-8351ef5e="" data-v-98afd824="" d="M16 10H8V8H16M2 17A2 2 0 0 0 4 19H20A2 2 0 0 0 22 17V12H20V17H4V12H2Z"><title data-v-8351ef5e="" data-v-98afd824="">Tray Minus icon</title></path></svg>
                Withdraw
              </div>
            </div>
          </div>
          <div>
            <div className={classes.activityText}>Transaction Activity</div>
                {loading ? (
                  <LoadingTable />
                ) : profile.length >= 1 ? ( 
                <Box className={classes.tran}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Event</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>TX</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {profile.map(tx => (
                        <TableRow key={tx._id}>
                          <TableCell>{tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</TableCell>
                          <TableCell>{returnCurrency(tx.currency)}</TableCell>
                          <TableCell>{parseDate2(tx.created)}</TableCell>
                          <TableCell 
                            style={{
                              color: tx.type == "deposit" ? "#00FF00" : "#D24242"
                            }}
                          >${parseFloat(tx.siteValue).toFixed(2)}</TableCell>
                          <TableCell>
                            <svg onClick={() => copyTx(tx.txid)} style={{cursor: "pointer"}} width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.74561 3.95174C3.74561 3.46009 3.73155 2.98576 3.75264 2.51488C3.76318 2.25867 3.7948 1.99553 3.87562 1.75317C4.16725 0.846041 4.97189 0.271296 5.99438 0.267833C8.25018 0.253984 10.5025 0.253984 12.7583 0.267833C13.9143 0.274758 14.7505 0.981072 14.9649 2.08555C14.9965 2.24136 15 2.40755 15 2.56681C15.0035 5.46132 15.0035 8.35928 15 11.2538C15 12.3721 14.3851 13.21 13.3661 13.4766C13.1553 13.532 12.9269 13.5562 12.7091 13.5597C12.2347 13.5735 11.7604 13.5631 11.2579 13.5631C11.2579 13.6359 11.2579 13.7051 11.2579 13.7709C11.2474 14.3075 11.2684 14.8442 11.2193 15.3774C11.1314 16.3572 10.2354 17.1778 9.23753 17.2367C9.08644 17.2471 8.93183 17.2505 8.78074 17.2505C6.63739 17.2505 4.49403 17.2505 2.35067 17.254C1.78145 17.254 1.26142 17.1224 0.815179 16.7623C0.267041 16.3192 0.0035137 15.734 0.0035137 15.0381C0 12.0847 -0.0035137 9.13138 0.00702741 6.17802C0.0105411 5.06315 0.709768 4.22527 1.79199 4.00368C1.96065 3.96906 2.13985 3.95867 2.31553 3.95521C2.78285 3.94828 3.25018 3.95174 3.74561 3.95174ZM1.50738 10.6063C1.50738 12.0536 1.50738 13.5043 1.50738 14.9515C1.50738 15.5228 1.76388 15.7756 2.34364 15.7756C4.53268 15.7756 6.72171 15.7756 8.91427 15.7756C9.02319 15.7756 9.13914 15.7686 9.24455 15.741C9.57836 15.6509 9.75053 15.3843 9.75053 14.9654C9.75053 12.0744 9.75053 9.18331 9.75053 6.29227C9.75053 5.70022 9.487 5.44054 8.88264 5.44054C7.04849 5.44054 5.21785 5.44054 3.3837 5.44054C3.00773 5.44054 2.63528 5.43708 2.25931 5.44054C1.89389 5.444 1.62333 5.62751 1.54252 5.93912C1.51089 6.0603 1.50738 6.19187 1.50738 6.31651C1.50738 7.74299 1.50738 9.17292 1.50738 10.6063ZM11.2544 12.0813C11.785 12.0813 12.2874 12.0917 12.7899 12.0778C13.2045 12.064 13.454 11.8078 13.4856 11.3992C13.4926 11.323 13.4926 11.2503 13.4926 11.1741C13.4926 9.35297 13.4926 7.52832 13.4926 5.70714C13.4926 4.65806 13.4961 3.60897 13.4926 2.55643C13.4926 2.00592 13.2326 1.74624 12.6774 1.74624C10.4708 1.74624 8.26423 1.74278 6.05762 1.74624C5.52003 1.74624 5.25299 2.01977 5.24947 2.5495C5.24947 2.95806 5.24947 3.37007 5.24947 3.77863C5.24947 3.83402 5.24947 3.88942 5.24947 3.95174C5.34083 3.95174 5.40408 3.95174 5.47084 3.95174C6.63739 3.95174 7.80042 3.95174 8.96697 3.95174C9.40267 3.95174 9.81729 4.04523 10.1862 4.27374C10.9065 4.71692 11.2509 5.37476 11.2509 6.20225C11.2579 8.08922 11.2544 9.97618 11.2544 11.8597C11.2544 11.9289 11.2544 11.9947 11.2544 12.0813Z" fill="currentColor"></path></svg>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
                ) : (
                  <div className={classes.noTransactions}>No Transactions</div>
                )}
          </div>
        </div> 
      </Dialog>
  );
};

const LoadingTable = () => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Event</TableCell>
          <TableCell>Type</TableCell>
          <TableCell>Time</TableCell>
          <TableCell>Amount</TableCell>
          <TableCell>TX</TableCell>
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
  return (
    <TableRow>
      <TableCell>
        <Skeleton animation="wave" height={25} width={250} />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" height={25} width={50} />
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

export default WalletModal;