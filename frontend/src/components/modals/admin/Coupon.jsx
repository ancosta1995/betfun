import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core";
import { useToasts } from "react-toast-notifications";
import { createCoupon } from "../../../services/api.service";
import { changeWallet } from "../../../actions/auth";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";

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

const Coupon = ({ user }) => {
  const classes = useStyles();
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false)
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [value, setValue] = useState(null);
  const [amount, setAmount] = useState(null);

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
      const data = await createCoupon(code, message, value, amount);
      addToast("Successfully created coupon!", { appearance: "success" });
      setCreating(false);
    } catch (error) {
      addToast("There was an error creating coupon: " + error, { appearance: "error" });
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
          <Field
            className={classes.field}
            label="Code"
            value={code}
            variant="outlined"
            onChange={(e) => setCode(e.target.value)}
          />
          <Field
            className={classes.field}
            label="Message"
            value={message}
            variant="outlined"
            onChange={(e) => setMessage(e.target.value)}
          />
          <Field
            className={classes.field}
            label="Value"
            value={value}
            variant="outlined"
            onChange={(e) => setValue(e.target.value)}
          />
          <Field
            className={classes.field}
            label="Amount"
            value={amount}
            variant="outlined"
            onChange={(e) => setAmount(e.target.value)}
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


Coupon.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, { changeWallet })(Coupon);
