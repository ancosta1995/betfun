import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core";
import { getSeedPairHistory, getCurrentSeedPair, updateClientSeed } from "../../services/api.service";
import TextField from "@material-ui/core/TextField";
import { motion } from "framer-motion";

const SeedInput = withStyles({
  root: {
    width: "100%",
    marginTop: "auto",
    background: "#1A1B33",
    borderRadius: "0.25rem",
    overflow: "hidden",
    maxWidth: "50rem",
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
      fontSize: "12px",
      fontWeight: 500,
      letterSpacing: ".1em",
      padding: "0.5rem 1rem",
    },
    "& div": {
      height: "2.5rem",
      borderRadius: 4,
      paddingRight: 0
    },
    "&:hover": {
    }
  }
})(TextField);

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    overflowY: "scroll",
    scrollbarWidth: "none",
    gap: "1rem",
    color: "#fff",
    fontFamily: "Poppins"
  },
  container: {
    backgroundColor: "#101123",
    display: "flex",
    flexDirection: "column",
    borderRadius: "0.25rem",
    width: "100%",
    padding: "1rem",
    gap: "0.5rem"
  },
  header: {
    color: "#fff",
    fontSize: "15px",
    fontWeight: 500,
  },
  description: {
    color: "hsl(220, 22%, 85%)",
    fontSize: "12px",
    fontWeight: 500,
  },
  table: {
    width: '100%',
    backgroundColor: "#1A1B33",
    color: "rgb(208, 214, 225)",
    borderRadius: '0.25rem',
  },
  th: {
    padding: '0.5rem',
    fontWeight: 600,
    fontSize: '13px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  },
  td: {
    padding: '0.5rem',
    fontSize: '12px',
    fontWeight: 500,
    textOverflow: 'ellipsis', 
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  },
  updateSeedButton: {
    borderRadius: "0.25rem",
    backgroundColor: "hsl(215, 75%, 50%)",
    padding: "0.25rem 0.5rem",
    textAlign: "center",
    color: "#fff",
    fontWeight: 500,
    fontSize: "12px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "2rem",
    margin: "0.25rem",
    fontFamily: "Poppins"
  }
}));

const Info = ({  }) => {
  const classes = useStyles();

  const [loading, setLoading] = useState(true);
  const [clientSeed, setClientSeed] = useState("clientseed");
  const [serverSeedHashed, setServerSeedHashed] = useState("serverseedhashed");
  const [nonce, setNonce] = useState(0);
  const [nextServerSeedHashed, setNextServerSeedHashed] = useState("nextserverseedhashed");
  const [history, setHistory] = useState([]);

  const fetchData = async () => {
    try {
      const response = await getCurrentSeedPair();

      setClientSeed(response.clientSeed);
      setServerSeedHashed(response.serverSeedHash);
      setNextServerSeedHashed(response.nextServerSeedHash);

    } catch (error) {
      console.log("Error getting seed data")
    };
    try {
      const data = await getSeedPairHistory();

      setHistory(data.history);

    } catch (error) {
      console.log("Error getting seed data")
    };
    setLoading(false);
  };

  const changeSeed = async () => {
    try {
      await updateClientSeed(clientSeed);
      const response = await getCurrentSeedPair();
      const data = await getSeedPairHistory();

      setClientSeed(response.clientSeed);
      setServerSeedHashed(response.serverSeedHash);
      setNextServerSeedHashed(response.nextServerSeedHash);
      setHistory(data.history);

      setLoading(false);
    } catch (error) {
      console.log("Error getting seed data")
    }
  };

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div className={classes.header}>What is Provably Fair?</div> 
        <div className={classes.description}>Provably Fair is a system allowing players to verify that the site operates legitimately and doesn't tamper with game results. It leverages cryptography and third party input to generate random values. At the end of the game, players can verify that the outcome was indeed determined by the original seed and inputs, thus proving that the game was fair.</div> 
      </div>
      <div className={classes.container}>
        <div className={classes.header}>Server Seed</div> 
        <div className={classes.description}>Server Seed is a randomly generated hexadecimal string created before each PvE game by the server. The seed is stored privately in our database, and its SHA256 hash is sent to the client. Every time a string is hashed, it produces the same result. The process cannot be reversed. This means that the user doesn't know the outcome, but can verify that the server is not changing the seed during the game.</div> 
        <div style={{display: "flex", flexDirection: "column", gap: "0.2rem"}}>
          <span style={{ fontSize: "12px", fontWeight: 500 }}>Server Seed Hash</span>
          <SeedInput
            label=""
            variant="filled"
            value={serverSeedHashed}
          />
        </div>
      </div>
      <div className={classes.container}>
        <div className={classes.header}>Client Seed</div> 
        <div className={classes.description}>The Client Seed, you're free to alter the seed to your preference, but for better security.</div> 
        <div style={{display: "flex", flexDirection: "column", gap: "0.2rem"}}>
          <span style={{ fontSize: "12px", fontWeight: 500 }}>Client Seed</span>
          <SeedInput
            label=""
            variant="filled"
            value={clientSeed}
            onChange={(e) => setClientSeed(e.target.value)}
            style={{
              maxWidth: "20rem",
            }}
            InputProps={{
              endAdornment: (
                <motion.span whileTap={{ scale: 0.97 }} className={classes.updateSeedButton} onClick={() => changeSeed()}>Change</motion.span>
              ),
            }}
          />
        </div>
        <div className={classes.description}>Next server seed (Hashed): {nextServerSeedHashed}</div> 
      </div>
      <div className={classes.container}>
        <div className={classes.header}>History</div>
        <table className={classes.table}>
          <thead>
            <tr>
              <th className={classes.th}>Server Seed</th>
              <th className={classes.th}>Server Seed Hash</th>
              <th className={classes.th}>Client Seed</th>
              <th className={classes.th}>Nonce</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, index) => (
              <tr key={index}>
                <td className={classes.td}>{item.serverSeed}</td>
                <td className={classes.td}>{item.serverSeedHash}</td>
                <td className={classes.td}>{item.clientSeed}</td>
                <td className={classes.td}>{item.nonce}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Info;
