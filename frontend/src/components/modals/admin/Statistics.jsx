import React, { useState, useEffect, Fragment } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useToasts } from "react-toast-notifications";
import { getUserAffiliatesData } from "../../../services/api.service";
import { changeWallet } from "../../../actions/auth";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import success from "../../../assets/success.wav";
import error from "../../../assets/sounds/error.mp3";

const errorAudio = new Audio(error);
const successAudio = new Audio(success);

const playSound = audioFile => {
  audioFile.play();
};

const ColorCircularProgress = withStyles({
  root: {
    color: "#9E9FBD !important",
  },
})(CircularProgress);

const useStyles = makeStyles(theme => ({
  root: {

  },
  loader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "15rem",
    gap: "0.75rem",
    color: "#9E9FBD"
  },
}));

const Statistics = ({ }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = {};
      setData(data);
      setLoading(false)
    } catch (error) {
      console.log(
        "There was an error while loading user affiliates data:",
        error
      );
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
      <div>
        
      </div>
      )}
    </div>
  );
};

Statistics.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, { changeWallet })(Statistics);