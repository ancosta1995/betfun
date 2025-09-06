import React, { useState, useEffect } from "react";
import { makeStyles, withStyles, Switch, FormControlLabel, FormGroup } from "@material-ui/core";
import { useToasts } from "react-toast-notifications";
import { getToggleState, toggleState } from "../../../services/api.service";
import { changeWallet } from "../../../actions/auth";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import success from "../../../assets/success.wav";
import error from "../../../assets/sounds/error.mp3";

const errorAudio = new Audio(error);
const successAudio = new Audio(success);

const playSound = (audioFile) => {
  audioFile.play();
};

const ColorCircularProgress = withStyles({
  root: {
    color: "#9E9FBD !important",
  },
})(CircularProgress);

const useStyles = makeStyles((theme) => ({
  root: {},
  loader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40rem",
    height: "15rem",
    gap: "0.75rem",
    color: "#9E9FBD",
  },
  switch: {
    
  }
}));

const Controls = ({ user }) => {
  const classes = useStyles();
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(true);
  const [toggleStates, setToggleStates] = useState({
    maintenanceEnabled: false,
    loginEnabled: false,
    depositsEnabled: false,
    withdrawsEnabled: false,
    coinflipEnabled: false,
    battlesEnabled: false,
    rouletteEnabled: false,
    crashEnabled: false,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getToggleState();
      setToggleStates(data);
      setLoading(false);
    } catch (error) {
      console.log("There was an error while getting toggle state:", error);
    }
  };

  const changeState = async (name) => {
    try {
      const response = await toggleState(name);
      setToggleStates({
        ...toggleStates,
        [`${name}Enabled`]: response.currentState,
      });
    } catch (error) {
      addToast("There was an error changing state: " + error, {
        appearance: "error",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={classes.root}>
      {loading ? (
        <div className={classes.loader}>
          <ColorCircularProgress />
          Loading...
        </div>
      ) : (
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={toggleStates.maintenanceEnabled}
                onChange={() => changeState("maintenance")}
              />
            }
            label="Maintenance"
          />
          <FormControlLabel
            control={
              <Switch
                checked={toggleStates.loginEnabled}
                onChange={() => changeState("login")}
              />
            }
            label="Login"
          />
          <FormControlLabel
            control={
              <Switch
                checked={toggleStates.depositsEnabled}
                onChange={() => changeState("deposits")}
              />
            }
            label="Deposits"
          />
          <FormControlLabel
            control={
              <Switch
                checked={toggleStates.withdrawsEnabled}
                onChange={() => changeState("withdraws")}
              />
            }
            label="Withdraws"
          />
          <FormControlLabel
            control={
              <Switch
                checked={toggleStates.coinflipEnabled}
                onChange={() => changeState("coinflip")}
              />
            }
            label="Coinflip"
          />
          <FormControlLabel
            control={
              <Switch
                checked={toggleStates.battlesEnabled}
                onChange={() => changeState("battles")}
              />
            }
            label="Battles"
          />
          <FormControlLabel
            control={
              <Switch
                checked={toggleStates.rouletteEnabled}
                onChange={() => changeState("roulette")}
              />
            }
            label="Roulette"
          />
          <FormControlLabel
            control={
              <Switch
                checked={toggleStates.crashEnabled}
                onChange={() => changeState("crash")}
              />
            }
            label="Crash"
          />
        </FormGroup>
      )}
    </div>
  );
};

Controls.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, { changeWallet })(Controls);
