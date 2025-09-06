import React, { useState, useEffect, Fragment } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useToasts } from "react-toast-notifications";
import { changeWallet } from "../../../actions/auth";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getTransactions, cancelTransaction, confirmTransaction } from "../../../services/api.service";
import CircularProgress from "@material-ui/core/CircularProgress";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const ColorCircularProgress = withStyles({
  root: {
    color: "#9E9FBD !important",
  },
})(CircularProgress);

const useStyles = makeStyles(theme => ({
  loader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "15rem",
    gap: "0.75rem",
    color: "#9E9FBD"
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
      padding: "0.5em 1em",
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
      padding: "0.5em 1em",
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
      backgroundColor: "#101123",
    },
  },
  confirm: {
    border: "1px solid #4caf50",
    color: "#4caf50",
    padding: "0.5rem",
    cursor: "pointer",
    borderRadius: "0.25rem",
    transitionDuration: "300ms",
    "&:hover": {
      filter: "brightness(130%)"
    }
  },
  decline: {
    border: "1px solid #ff5252",
    color: "#ff5252",
    padding: "0.5rem",
    cursor: "pointer",
    borderRadius: "0.25rem",
    transitionDuration: "300ms",
    "&:hover": {
      filter: "brightness(130%)"
    }
  }
}));

const Txcontrol = ({ }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

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

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getTransactions();
      setData(data);
      setLoading(false)
    } catch (error) {
      console.log("There was an error while loading transaction data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const copy = (something) => {
    navigator.clipboard.writeText(something)
      .then(() => {
        addToast("Successfully copied.", { appearance: "success" });
      })
      .catch((error) => {
        addToast("Failed to copy", { appearance: "error" });
        console.error("Error copying text to clipboard:", error);
      });
  };

  const convertState = (rank) => {
    switch (rank) {
      case 1:
        return 'Pending'
      case 2:
        return 'Declined'
      case 3:
        return 'Completed'
      case 4:
        return 'Manual'
      default:
        return null
    }
  };

  const stateToColor = (rank) => {
    switch (rank) {
      case 1:
        return 'orange'
      case 2:
        return '#ff5252'
      case 3:
        return '#4caf50'
      case 4:
        return '#337ab7'
      default:
        return '#fff'
    }
  };

  const confirm = async (id) => {
    try {
      const res = await confirmTransaction(id);
      addToast(`Succesfully confirmed transaction ${id}!`, { appearance: "success" });
      fetchData();
    } catch (error) {
      addToast("There was an error confirming transaction: " + error, { appearance: "error" });
    }
  };

  const decline = async (id) => {
    try {
      const res = await cancelTransaction(id);
      addToast(`Succesfully cancel transaction ${id}!`, { appearance: "success" });
      fetchData();
    } catch (error) {
      addToast("There was an error canceling transaction: " + error, { appearance: "error" });
    }
  };

  return (
    <div className={classes.root}>
      {loading ? (
        <div className={classes.loader}>
          <ColorCircularProgress />
          Loading...
        </div>
      ) : ( 
      <div className={classes.tran}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>State</TableCell>
              <TableCell>CUR</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>UID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.filter(transaction => transaction.state === 4).map(tx => (
              <TableRow key={tx._id}>
                <TableCell style={{color: stateToColor(tx.state)}}>{convertState(tx.state)}</TableCell>
                <TableCell>{tx.currency}</TableCell>
                <TableCell>{tx._user.username}</TableCell>
                <TableCell>${tx.siteValue}</TableCell>
                <TableCell>{parseDate2(tx.created)}</TableCell>
                <TableCell style={{display: "flex", gap: "0.5rem"}}>
                  <div className={classes.confirm} onClick={() => confirm(tx._id)}>Confirm</div>
                  <div className={classes.decline} onClick={() => decline(tx._id)}>Cancel</div>
                </TableCell>
                <TableCell><svg onClick={() => copy(tx._id)} style={{cursor: "pointer"}} width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.74561 3.95174C3.74561 3.46009 3.73155 2.98576 3.75264 2.51488C3.76318 2.25867 3.7948 1.99553 3.87562 1.75317C4.16725 0.846041 4.97189 0.271296 5.99438 0.267833C8.25018 0.253984 10.5025 0.253984 12.7583 0.267833C13.9143 0.274758 14.7505 0.981072 14.9649 2.08555C14.9965 2.24136 15 2.40755 15 2.56681C15.0035 5.46132 15.0035 8.35928 15 11.2538C15 12.3721 14.3851 13.21 13.3661 13.4766C13.1553 13.532 12.9269 13.5562 12.7091 13.5597C12.2347 13.5735 11.7604 13.5631 11.2579 13.5631C11.2579 13.6359 11.2579 13.7051 11.2579 13.7709C11.2474 14.3075 11.2684 14.8442 11.2193 15.3774C11.1314 16.3572 10.2354 17.1778 9.23753 17.2367C9.08644 17.2471 8.93183 17.2505 8.78074 17.2505C6.63739 17.2505 4.49403 17.2505 2.35067 17.254C1.78145 17.254 1.26142 17.1224 0.815179 16.7623C0.267041 16.3192 0.0035137 15.734 0.0035137 15.0381C0 12.0847 -0.0035137 9.13138 0.00702741 6.17802C0.0105411 5.06315 0.709768 4.22527 1.79199 4.00368C1.96065 3.96906 2.13985 3.95867 2.31553 3.95521C2.78285 3.94828 3.25018 3.95174 3.74561 3.95174ZM1.50738 10.6063C1.50738 12.0536 1.50738 13.5043 1.50738 14.9515C1.50738 15.5228 1.76388 15.7756 2.34364 15.7756C4.53268 15.7756 6.72171 15.7756 8.91427 15.7756C9.02319 15.7756 9.13914 15.7686 9.24455 15.741C9.57836 15.6509 9.75053 15.3843 9.75053 14.9654C9.75053 12.0744 9.75053 9.18331 9.75053 6.29227C9.75053 5.70022 9.487 5.44054 8.88264 5.44054C7.04849 5.44054 5.21785 5.44054 3.3837 5.44054C3.00773 5.44054 2.63528 5.43708 2.25931 5.44054C1.89389 5.444 1.62333 5.62751 1.54252 5.93912C1.51089 6.0603 1.50738 6.19187 1.50738 6.31651C1.50738 7.74299 1.50738 9.17292 1.50738 10.6063ZM11.2544 12.0813C11.785 12.0813 12.2874 12.0917 12.7899 12.0778C13.2045 12.064 13.454 11.8078 13.4856 11.3992C13.4926 11.323 13.4926 11.2503 13.4926 11.1741C13.4926 9.35297 13.4926 7.52832 13.4926 5.70714C13.4926 4.65806 13.4961 3.60897 13.4926 2.55643C13.4926 2.00592 13.2326 1.74624 12.6774 1.74624C10.4708 1.74624 8.26423 1.74278 6.05762 1.74624C5.52003 1.74624 5.25299 2.01977 5.24947 2.5495C5.24947 2.95806 5.24947 3.37007 5.24947 3.77863C5.24947 3.83402 5.24947 3.88942 5.24947 3.95174C5.34083 3.95174 5.40408 3.95174 5.47084 3.95174C6.63739 3.95174 7.80042 3.95174 8.96697 3.95174C9.40267 3.95174 9.81729 4.04523 10.1862 4.27374C10.9065 4.71692 11.2509 5.37476 11.2509 6.20225C11.2579 8.08922 11.2544 9.97618 11.2544 11.8597C11.2544 11.9289 11.2544 11.9947 11.2544 12.0813Z" fill="currentColor"></path></svg></TableCell>
                <TableCell><svg onClick={() => copy(tx._user._id)} style={{cursor: "pointer"}} width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.74561 3.95174C3.74561 3.46009 3.73155 2.98576 3.75264 2.51488C3.76318 2.25867 3.7948 1.99553 3.87562 1.75317C4.16725 0.846041 4.97189 0.271296 5.99438 0.267833C8.25018 0.253984 10.5025 0.253984 12.7583 0.267833C13.9143 0.274758 14.7505 0.981072 14.9649 2.08555C14.9965 2.24136 15 2.40755 15 2.56681C15.0035 5.46132 15.0035 8.35928 15 11.2538C15 12.3721 14.3851 13.21 13.3661 13.4766C13.1553 13.532 12.9269 13.5562 12.7091 13.5597C12.2347 13.5735 11.7604 13.5631 11.2579 13.5631C11.2579 13.6359 11.2579 13.7051 11.2579 13.7709C11.2474 14.3075 11.2684 14.8442 11.2193 15.3774C11.1314 16.3572 10.2354 17.1778 9.23753 17.2367C9.08644 17.2471 8.93183 17.2505 8.78074 17.2505C6.63739 17.2505 4.49403 17.2505 2.35067 17.254C1.78145 17.254 1.26142 17.1224 0.815179 16.7623C0.267041 16.3192 0.0035137 15.734 0.0035137 15.0381C0 12.0847 -0.0035137 9.13138 0.00702741 6.17802C0.0105411 5.06315 0.709768 4.22527 1.79199 4.00368C1.96065 3.96906 2.13985 3.95867 2.31553 3.95521C2.78285 3.94828 3.25018 3.95174 3.74561 3.95174ZM1.50738 10.6063C1.50738 12.0536 1.50738 13.5043 1.50738 14.9515C1.50738 15.5228 1.76388 15.7756 2.34364 15.7756C4.53268 15.7756 6.72171 15.7756 8.91427 15.7756C9.02319 15.7756 9.13914 15.7686 9.24455 15.741C9.57836 15.6509 9.75053 15.3843 9.75053 14.9654C9.75053 12.0744 9.75053 9.18331 9.75053 6.29227C9.75053 5.70022 9.487 5.44054 8.88264 5.44054C7.04849 5.44054 5.21785 5.44054 3.3837 5.44054C3.00773 5.44054 2.63528 5.43708 2.25931 5.44054C1.89389 5.444 1.62333 5.62751 1.54252 5.93912C1.51089 6.0603 1.50738 6.19187 1.50738 6.31651C1.50738 7.74299 1.50738 9.17292 1.50738 10.6063ZM11.2544 12.0813C11.785 12.0813 12.2874 12.0917 12.7899 12.0778C13.2045 12.064 13.454 11.8078 13.4856 11.3992C13.4926 11.323 13.4926 11.2503 13.4926 11.1741C13.4926 9.35297 13.4926 7.52832 13.4926 5.70714C13.4926 4.65806 13.4961 3.60897 13.4926 2.55643C13.4926 2.00592 13.2326 1.74624 12.6774 1.74624C10.4708 1.74624 8.26423 1.74278 6.05762 1.74624C5.52003 1.74624 5.25299 2.01977 5.24947 2.5495C5.24947 2.95806 5.24947 3.37007 5.24947 3.77863C5.24947 3.83402 5.24947 3.88942 5.24947 3.95174C5.34083 3.95174 5.40408 3.95174 5.47084 3.95174C6.63739 3.95174 7.80042 3.95174 8.96697 3.95174C9.40267 3.95174 9.81729 4.04523 10.1862 4.27374C10.9065 4.71692 11.2509 5.37476 11.2509 6.20225C11.2579 8.08922 11.2544 9.97618 11.2544 11.8597C11.2544 11.9289 11.2544 11.9947 11.2544 12.0813Z" fill="currentColor"></path></svg></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      )}
    </div>
  );
};

Txcontrol.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, { changeWallet })(Txcontrol);