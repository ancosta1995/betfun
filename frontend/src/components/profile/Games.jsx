import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { useToasts } from "react-toast-notifications";
import { useHistory } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { getUserHistory } from "../../services/api.service";
import parseCommasToThousands from "../../utils/parseCommasToThousands";
import coin from "../../assets/icons/coin.png";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Skeleton from "@material-ui/lab/Skeleton";

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

const Games = ({ userId }) => {
  const { addToast } = useToasts();
  const history = useHistory();
  const classes = useStyles();

  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState("all");
  const [gameData, setGameData] = useState({
    caseBattles: [],
    cases: [],
    crash: [],
    roulette: []
  });
  const [currentData, setCurrentData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await getUserHistory();

      const updatedGameData = {
        caseBattles: response.caseBattles.map(game => ({...game, type: "Case Battles"})).sort((a, b) => new Date(b.created) - new Date(a.created)),
        cases: response.cases.map(game => ({...game, type: "Cases"})).sort((a, b) => new Date(b.created) - new Date(a.created)),
        crash: response.crash.map(game => ({...game, type: "Crash"})).sort((a, b) => new Date(b.created) - new Date(a.created)),
        roulette: response.roulette.map(game => ({...game, type: "Roulette"})).sort((a, b) => new Date(b.created) - new Date(a.created)),
      };
      setGameData(updatedGameData);

      const allGames = [
        ...updatedGameData.caseBattles, 
        ...updatedGameData.cases, 
        ...updatedGameData.crash, 
        ...updatedGameData.roulette
      ];
      const sortedGames = allGames.sort((a, b) => new Date(b.created) - new Date(a.created));
      setCurrentData(sortedGames);
      setLoading(false);
    } catch (error) {
      addToast(error, { appearance: "error" });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    switch (selected) {
      case "all":
        const allGames = [
          ...gameData.caseBattles, 
          ...gameData.cases, 
          ...gameData.crash, 
          ...gameData.roulette
        ];
        const sortedGames = allGames.sort((a, b) => new Date(b.created) - new Date(a.created));
        return setCurrentData(sortedGames);
      case "casebattles":
        return setCurrentData(gameData.caseBattles);
      case "cases":
        return setCurrentData(gameData.cases);
      case "crash":
        return setCurrentData(gameData.crash);
      case "roulette":
        return setCurrentData(gameData.roulette);
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
      case "Case Battles":
        let temp = item;
        const cbmulti = item.win.winAmount / item.betAmount;  
        const totalPlayers = temp.players.length;
        const teamCount = temp.game_type === 4 ? 2 : totalPlayers;
        for (let i = 0; i < totalPlayers; i++) {
          const team = temp.game_type === 4 ? i < 2 ? 1 : 2 : i+1;
          temp.players[i].team = team;
        }
        const sss = temp.players.filter(pl => pl.id == userId)
        if(temp.win.isEqual) {
          if(temp.win.equals.includes(sss[0].team)) {
            return { 
              bet: item.betAmount.toFixed(2),
              multi: cbmulti.toFixed(2)
            }
          }
        }
        if(item.win.winningTeam != sss[0].team) {
          return {
            bet: item.betAmount.toFixed(2),
            multi: Number(0).toFixed(2)
          }
        }
        return { 
          bet: item.betAmount.toFixed(2),
          multi: cbmulti.toFixed(2)
        }
      case "Cases":
        return { 
          bet: item.case.price.toFixed(2),
          multi: (item.caseResult.item.price / item.case.price).toFixed(2)
        }
      case "Crash":
        
        return {
          bet: 1,
          multi: 1,
        }
      case "Roulette":
        const player = item.players.find(player => player._id === userId);
        let rmulti = player.betAmount * (item.winner == "green" ? 14 : 2) / player.betAmount;
        if(item.winner != player.color) rmulti = 0;
        return {
          bet: player.betAmount.toFixed(2),
          multi: rmulti.toFixed(2)
        }
      default:
        return { 
          bet: 1,
          multi: 1,
        }; 
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.selectionContainer}>
        <div 
          className={selected == "all" ? classes.active : classes.notactive}
          onClick={() => setSelected("all")}
        >
          All
        </div>
        <div 
          className={selected == "casebattles" ? classes.active : classes.notactive}
          onClick={() => setSelected("casebattles")}
        >
          Case Battles
        </div>
        <div 
          className={selected == "cases" ? classes.active : classes.notactive}
          onClick={() => setSelected("cases")}
        >
          Cases
        </div>
        <div 
          className={selected == "crash" ? classes.active : classes.notactive}
          onClick={() => setSelected("crash")}
        >
          Crash
        </div>
        <div 
          className={selected == "roulette" ? classes.active : classes.notactive}
          onClick={() => setSelected("roulette")}
        >
          Roulette
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
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Gamemode</TableCell>
                  <TableCell>Bet</TableCell>
                  <TableCell>Multiplier</TableCell>
                  <TableCell>Date and Time</TableCell>
                  <TableCell>Payout</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>
                      <img style={{height: 17, width: 17, left: -7, top: 4, position: "relative"}} src={coin} />
                      {parseCommasToThousands(getData(item).bet)}
                    </TableCell>
                    <TableCell style={{color: getData(item).multi > 1 ? "#16F576" : getData(item).multi < 1 ? "#FF4343" : "#fff"}}>{getData(item).multi}x</TableCell>
                    <TableCell>{formatDate(item.created)}</TableCell>
                    <TableCell style={{color: getData(item).multi > 1 ? "#16F576" : getData(item).multi < 1 ? "#FF4343" : "#fff"}}>
                      <img style={{height: 17, width: 17, left: -7, top: 4, position: "relative"}} src={coin} />
                      {parseCommasToThousands((getData(item).bet * getData(item).multi).toFixed(2))}
                    </TableCell>
                    <TableCell>
                      <motion.div whileTap={{ scale: 0.97 }} className={classes.details}>Details</motion.div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            ) : (
              <div className={classes.noTransactions}>No Games</div>
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
          <TableCell>Gamemode</TableCell>
          <TableCell>Bet</TableCell>
          <TableCell>Multiplier</TableCell>
          <TableCell>Date and Time</TableCell>
          <TableCell>Payout</TableCell>
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
        <Skeleton animation="wave" height={25} width={50} />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" height={25} width={50} />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" height={25} width={150} />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" height={25} width={50} />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" height={25} width={150} />
      </TableCell>
    </TableRow>
  );
};

export default Games;
