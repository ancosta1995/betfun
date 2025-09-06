import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import pfCodeSamples from "./pfCodeSamples";
import { CopyBlock, ocean } from "react-code-blocks";


const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    overflowY: "scroll",
    scrollbarWidth: "none",
    gap: "1rem",
    color: "#fff",
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
  }
}));

const CaseBattles = ({  }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div className={classes.header}>How Case Battle Results Are Generated</div> 
        <div className={classes.description}> The result for each round is generated using the SHA-256 hash of 4 separate inputs</div> 
        <div className={classes.description}>1) The "server seed" is a securely random value generated when a battle is created. The SHA-256 hash of the server seed is immediately shown to all players after the battle creation. Players can verify the server seed revealed following the battle result matches this SHA-256 hash.</div> 
        <div className={classes.description}>2) The "block hash" is the ID of an EOS block, chosen to be generated after the final challenger joins a battle.</div>
        <div className={classes.description}>3) Round Number</div>  
        <div className={classes.description}>4) Player Position - (1 to 4), depending on the battle mode.</div>  
        <div className={classes.description}>Once the last player joins, our system selects an EOS blockchain block number that will be produced in the near future. The ID of this block serves as the block hash. This ensures that neither the players nor our system can predict the data that will determine the items that are pulled from each case in the battle rounds until all players have committed their bets.</div> 
      </div>
      <div className={classes.container}>
        <div className={classes.header}>Outcome Verifier</div> 
        <CopyBlock
          text={pfCodeSamples.casebattles}
          language={"javascript"}
          showLineNumbers={true}
          theme={ocean}
          wrapLines
        />
      </div>
    </div>
  );
};

export default CaseBattles;
