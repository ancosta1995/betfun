import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { useToasts } from "react-toast-notifications";
import { useHistory } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { getUserTxData } from "../../services/api.service";
import parseCommasToThousands from "../../utils/parseCommasToThousands";
import coin from "../../assets/icons/coin.png";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Skeleton from "@material-ui/lab/Skeleton";
import TransactionModal from "./TransactionModel";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: "1250px",
    margin: "0 auto",
    color: "#fff"
  },
  selectionContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: "1rem",
    gap: "0.25rem",  
    marginBottom: "0.5rem"
  },
  active: {
    flexGrow: 1,
    color: "hsl(220, 22%, 85%)",
    backgroundColor: "#1a1b33",
    cursor: "pointer",
    display: "inline-flex",
    padding: "0.5rem 1rem",
    fontSize: "12px",
    alignItems: "center",
    userSelect: "none",
    whiteSpace: "nowrap",
    borderRadius: "0.25rem",
    justifyContent: "center",
    transitionDuration: "300ms",
    cursor: "pointer",
    textDecoration: "none",
    fontWeight: 400,
    filter: "brightness(140%)",
  },
  notactive: {
    flexGrow: 1,
    color: "hsl(220, 22%, 85%)",
    backgroundColor: "#1a1b33",
    cursor: "pointer",
    display: "inline-flex",
    padding: "0.5rem 1rem",
    fontSize: "12px",
    alignItems: "center",
    userSelect: "none",
    whiteSpace: "nowrap",
    borderRadius: "0.25rem",
    justifyContent: "center",
    transitionDuration: "300ms",
    cursor: "pointer",
    textDecoration: "none",
    fontWeight: 400,
    "&:hover": {
      filter: "brightness(125%)",
    }
  },
  tran: {
    maxHeight: "30rem",
    overflowY: "auto",
    scrollbarWidth: "none",
    "& tr": {
      background: "#101123",
      borderRadius: "4px",
      borderTop: "8px solid #050614",
      borderBottom: "8px solid #050614",
    },
    "& th": {
      border: "none",
      color: "#C0C1DE",
      fontFamily: "Poppins",
      fontSize: "12px",
      fontWeight: 400,
      letterSpacing: "0.115em",
      textTransform: "none",
      padding: "0.5em 1em",
      "&:nth-child(1)": {
        paddingLeft: "1rem",
      },
    },
    "& tc": {
      
    },
    "& td": {
      border: "none",
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
  },
  details: {
    backgroundColor: "#151B37",
    color: "#2871FF",
    padding: "0rem",
    fontWeight: 500,
    borderRadius: "0.25rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    cursor: "pointer",
    height: "2rem",
    position: "relative",
  },
}));

const Transactions = ({ userId }) => {
  const { addToast } = useToasts();
  const history = useHistory();
  const classes = useStyles();

  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState("all");
  const [txData, setTxData] = useState({
    deposits: [],
    withdraws: [],
    free: [],
  });
  const [tableData, setTableData] = useState({
    event: null,
    type: null,
    status: null,
    txid: null,
    date: null,
  });
  const [currentData, setCurrentData] = useState([]);
  const [openTransaction, setOpenTransaction] = useState(false);

  const fetchData = async () => {
    try {
      const response = await getUserTxData();

      const depo = response.deposits.sort((a, b) => new Date(b.created) - new Date(a.created));

      const updatedTxData = {
        deposits: depo,
        withdraws: response.withdraws.map(game => ({...game, type: "withdraw"})).sort((a, b) => new Date(b.created) - new Date(a.created)),
        free: response.free.map(game => ({...game, type: "free"})),
      };
      setTxData(updatedTxData);

      const allTxs = [
        ...updatedTxData.deposits, 
        ...updatedTxData.withdraws, 
        ...updatedTxData.free, 
      ];
      const sortedTxs = allTxs.sort((a, b) => new Date(b.created) - new Date(a.created));
      setCurrentData(sortedTxs);
      setLoading(false);
    } catch (error) {
      addToast(error, { appearance: "error" });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  useEffect(() => {
    switch (selected) {
      case "all":
        const allTxs = [
          ...txData.deposits, 
          ...txData.withdraws, 
          ...txData.free, 
        ];
        const sortedTxs = allTxs.sort((a, b) => new Date(b.created) - new Date(a.created));
        return setCurrentData(sortedTxs);
      case "deposits":
        return setCurrentData(txData.deposits);
      case "withdraws":
        return setCurrentData(txData.withdraws);
      case "free":
        return setCurrentData(txData.free);
    }
  }, [selected])

  const formatDate = (date) => {
    const options = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric' 
    };
    const formattedDate = new Date(date).toLocaleDateString('en-US', options);
    return formattedDate;
  };
  
  const getData = (item) => {
    switch (item.type) {
      case "deposit":
        let g = ""
        if(item.state == 0) g = "Not Started"
        if(item.state == 1) g = "Pending"
        if(item.state == 2) g = "Declined"
        if(item.state == 3) g = "Completed"
        if(item.state == 4) g = "Manual Review"
        if(item.state == 5) d = "Refunded"
        if(item.state == 6) d = "Canceled"
        return { 
          amount: item.siteValue,
          color: "#16F576",
          status: g
        }
      case "withdraw":
        let d = "";
        if(item.state == 1) d = "Pending"
        if(item.state == 2) d = "Declined"
        if(item.state == 3) d = "Completed"
        if(item.state == 4) d = "Manual Review"
        return { 
          amount: item.siteValue,
          color: "#FF4343",
          status: d
        }
      case "free":
        let c = "#16F576";
        if(item.action == "sent-tip" || item.action == "rain-tip") {
          c = "#FF4343";
        }
        return {
          amount: item.amount,
          color: c,
          status: "Completed"
        }
    }
  };

  const getEvent = (item) => {
    if(item.type == "deposit" || item.type  == "withdraw") {
      return item.currency.charAt(0).toUpperCase() + item.currency.slice(1)
    } else {
      return item.action.charAt(0).toUpperCase() + item.action.slice(1)
    }
  };

  const handleOpen = (item) => {
    switch (item.type) {
      case "deposit":
        let g = ""
        if(item.state == 0) g = "Not Started"
        if(item.state == 1) g = "Pending"
        if(item.state == 2) g = "Declined"
        if(item.state == 3) g = "Completed"
        if(item.state == 4) g = "Manual Review"
        if(item.state == 5) d = "Refunded"
        if(item.state == 6) d = "Canceled"
        setTableData({
          event: "Deposit",
          type: getEvent(item),
          status: g,
          txid: item.txid,
          date: formatDate(item.created),
        })
        return setOpenTransaction(!openTransaction)
      case "withdraw":
        console.log(item.type)

        let d = "";
        if(item.state == 1) d = "Pending"
        if(item.state == 2) d = "Declined"
        if(item.state == 3) d = "Completed"
        if(item.state == 4) d = "Manual Review"
        setTableData({
          event: "Withdraw",
          type: getEvent(item),
          status: d,
          txid: item.txid ? item.txid : "Not-available",
          date: formatDate(item.created),
        })
        return setOpenTransaction(!openTransaction)
      case "free":
        setTableData({
          event: "Free",
          type: getEvent(item),
          status: "Complete",
          txid: item._id,
          date: formatDate(item.created),
        })
        return setOpenTransaction(!openTransaction)
    }
  };  

  return (
    <div className={classes.root}>
      <TransactionModal
        open={openTransaction}
        handleClose={() => setOpenTransaction(!openTransaction)}
        event={tableData.event} 
        type={tableData.type}
        status={tableData.status} 
        txid={tableData.txid}
        date={tableData.date}
      />
      <div className={classes.selectionContainer}>
        <div 
          className={selected == "all" ? classes.active : classes.notactive}
          onClick={() => setSelected("all")}
        >
          All
        </div>
        <div 
          className={selected == "deposits" ? classes.active : classes.notactive}
          onClick={() => setSelected("deposits")}
        >
          Deposits
        </div>
        <div 
          className={selected == "withdraws" ? classes.active : classes.notactive}
          onClick={() => setSelected("withdraws")}
        >
          Withdraws
        </div>
        <div 
          className={selected == "free" ? classes.active : classes.notactive}
          onClick={() => setSelected("free")}
        >
          Free
        </div>
      </div>
      <AnimatePresence exitBeforeEnter>
        <motion.div
          key={selected}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.2 }}
        >
          <div className={classes.tran}>
            {loading ? (
                <LoadingTable />
              ) : currentData.length >= 1 ? ( 
              <div className={classes.tran}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Event</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentData.map((item, index) => (
                      <TableRow key={item._id}>
                        <TableCell>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</TableCell>
                        <TableCell>{getEvent(item)}</TableCell>
                        <TableCell>{formatDate(item.created)}</TableCell>
                        <TableCell style={{color: getData(item).color}}>
                          <img style={{height: 17, width: 17, left: -7, top: 4, position: "relative"}} src={coin} />
                          {parseCommasToThousands((getData(item).amount).toFixed(2))}
                        </TableCell>
                        <TableCell>{getData(item).status}</TableCell>
                        <TableCell>
                          <motion.div whileTap={{ scale: 0.97 }} className={classes.details} onClick={() => handleOpen(item)}>Details</motion.div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              ) : (
                <div className={classes.noTransactions}>No Transactions</div>
              )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
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
          <TableCell>Status</TableCell>
          <TableCell>Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Array(9)
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
        <Skeleton animation="wave" height={25} width={150} />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" height={25} width={100} />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" height={25} width={150} />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" height={25} width={100} />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" height={25} width={150} />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" height={25} width={150} />
      </TableCell>
    </TableRow>
  );
};

export default Transactions;