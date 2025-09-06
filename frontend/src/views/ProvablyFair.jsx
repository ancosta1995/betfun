import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logout } from "../actions/auth";
import { useToasts } from "react-toast-notifications";
import { useHistory } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";

import Info from "../components/provably/Info";
import CaseBattles from "../components/provably/CaseBattles";
import Cases from "../components/provably/Cases";
import Crash from "../components/provably/Crash";
import Roulette from "../components/provably/Roulette";
import Upgrader from "../components/provably/Upgrader";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: "1250px",
    margin: "0 auto",
    color: "#fff",
    overflowY: "scroll",
    scrollbarWidth: "none"
  },
  selectionContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: "1.5rem",
    gap: "0.25rem",  
    marginBottom: "1.5rem"
  },
  active: {
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
}));

const ProvablyFair = ({ isAuthenticated, isLoading, user, logout }) => {
  const { addToast } = useToasts();
  const history = useHistory();
  const classes = useStyles();

  const [selected, setSelected] = useState("info");

  const renderComponent = (state) => {
    switch (state) {
      case "info":
        return <Info />
      case "casebattles":
          return <CaseBattles />
      case "cases":
        return <Cases />
      case "crash":
        return <Crash />
      case "roulette":
        return <Roulette />
      case "upgrader":
        return <Upgrader />
    }
  };

  return (
    <div className={classes.root}>
      <h3>Provably Fair</h3>
      <div className={classes.selectionContainer}>
        <div 
          className={selected == "info" ? classes.active : classes.notactive}
          onClick={() => setSelected("info")}
        >
          How it works?
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
        <div 
          className={selected == "upgrader" ? classes.active : classes.notactive}
          onClick={() => setSelected("upgrader")}
        >
          Upgrader
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
          {renderComponent(selected)}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

ProvablyFair.propTypes = {
  isAuthenticated: PropTypes.bool,
  isLoading: PropTypes.bool,
  user: PropTypes.object,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading,
  user: state.auth.user,
});

export default connect(mapStateToProps, { logout })(ProvablyFair);
