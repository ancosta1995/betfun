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

const Crash = ({  }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div className={classes.header}>Outcome Verifier</div> 
        <CopyBlock
          text={pfCodeSamples.crash}
          language={"javascript"}
          showLineNumbers={true}
          theme={ocean}
          wrapLines
        />
      </div>
    </div>
  );
};

export default Crash;
