import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core";
import { useToasts } from "react-toast-notifications";
import { createRace } from "../../../services/api.service";
import { changeWallet } from "../../../actions/auth";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import { DateTimePicker, MuiPickersUtilsProvider  } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';

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
  createButton: {
    color: "#ffffff",
    width: "100%",
    fontSize: "13px",
    background: "hsl(230, 50%, 50%)",
    fontFamily: "Poppins",
    fontWeight: "500",
    letterSpacing: ".02em",
    borderRadius: "0.25rem",
    padding: "1rem",
    textAlign: "center",
    transition: "all 200ms",
    cursor: "pointer",
    "&:hover": {
      opacity: "0.75",
      background: "hsl(230, 50%, 50%)",
    },
  },
  picker: {
    width: "100%",
    marginBottom: "20px",
    '& .MuiInput-input': {
      color: "#fff",
    },
    "& label": {
      color: "#5f6368",
      fontFamily: "Poppins",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".1em",
    },
    "& label.Mui-focused": {
      color: "#5f6368",
      fontFamily: "Poppins",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".1em",
    },
    "& .MuiInput-underline:after": {
      border: "1px solid #2f3947",
      borderRadius: "6px",
    },
    "& .MuiOutlinedInput-root": {
      color: "#fff",
      "& fieldset": {
        border: "1px solid #2f3947",
        borderRadius: "6px",
      },
      "&:hover fieldset": {
        border: "1px solid #2f3947",
        borderRadius: "6px",
      },
      "&.Mui-focused fieldset": {
        border: "1px solid #2f3947",
        borderRadius: "6px",
      },
    },
  }
}));

const Field = withStyles({
  root: {
    width: "100%",
    marginBottom: 20,
    "& label": {
      color: "#5f6368",
      fontFamily: "Poppins",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".1em",
    },
    "& label.Mui-focused": {
      color: "#5f6368",
      fontFamily: "Poppins",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".1em",
    },
    "& .MuiInput-underline:after": {
      border: "1px solid #2f3947",
      borderRadius: "6px",
    },
    "& .MuiOutlinedInput-root": {
      color: "#fff",
      "& fieldset": {
        border: "1px solid #2f3947",
        borderRadius: "6px",
      },
      "&:hover fieldset": {
        border: "1px solid #2f3947",
        borderRadius: "6px",
      },
      "&.Mui-focused fieldset": {
        border: "1px solid #2f3947",
        borderRadius: "6px",
      },
    },
  },
})(TextField);

const Race = ({ user }) => {
  const classes = useStyles();
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false)
  const [prize, setPrize] = useState(null);
  const [endingDate, setEndingDate] = useState(new Date());

  const fetchData = async () => {
    setLoading(true);
    try {
      
      setLoading(false);
    } catch (error) {
      console.log("There was an error while getting toggle state:", error);
    }
  };

  const create = async () => {
    setCreating(true);
    try {
      const data = await createRace(Math.floor(endingDate.getTime() / 1000), prize);
      addToast("Successfully created new race!", { appearance: "success" });
    } catch (error) {
      addToast("There was an error creating new race: " + error, { appearance: "error" });
    }
    setCreating(false);
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
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DateTimePicker
              className={classes.picker}
              label="Controlled picker"
              value={endingDate}
              onChange={(date) => setEndingDate(date)}
            />
          </MuiPickersUtilsProvider>

          <Field
            className={classes.field}
            label="Prize"
            value={prize}
            variant="outlined"
            onChange={(e) => setPrize(e.target.value)}
          />
          <div
            className={classes.createButton}
            onClick={() => create()}
            style={{
              opacity: creating ? 0.5 : 1,
              cursor: creating ? "not-allowed" : "pointer"
            }}
          >
            Create
          </div>
        </div>
      )}
    </div>
  );
};

Race.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, { changeWallet })(Race);