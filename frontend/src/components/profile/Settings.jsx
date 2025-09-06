import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { useToasts } from "react-toast-notifications";
import { getUserAffiliatesData, updateUserAffiliateCode } from "../../services/api.service";
import { motion, AnimatePresence } from "framer-motion";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: "1250px",
    margin: "0 auto",
    color: "#fff",
    marginTop: "1rem"
  },
  textField: {
    transitionDuration: "200ms",
    "& label": {
      color: "#e0e0e0",
      fontFamily: "Poppins",
      fontSize: "14px",
      fontWeight: 300,
      letterSpacing: ".1em",
      transitionDuration: "200ms",
    },
    "& label.Mui-focused": {
      color: "#e0e0e0",
      fontFamily: "Poppins",
      fontWeight: "300",
      transitionDuration: "200ms",
    },
    "& .MuiInput-underline:after": {
      border: "2px solid #3d5564",
      fontFamily: "Poppins",
      fontWeight: "300",
      transitionDuration: "200ms",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        border: "1px solid transparent",
        fontFamily: "Poppins",
        fontWeight: "300",
        transitionDuration: "200ms",
      },
      "&:hover fieldset": {
        border: "1px solid transparent",
        fontFamily: "Poppins",
        fontWeight: "300",
        transitionDuration: "200ms",
      },
      "&.Mui-focused fieldset": {
        border: "1px solid hsl(220, 22%, 62%)",
        fontFamily: "Poppins",
        fontWeight: "300",
        transitionDuration: "200ms",
      },
    },
    "& .MuiInput-root": {
      border: "1px solid hsl(220, 22%, 62%)",
      fontFamily: "Poppins",
      fontWeight: "300",
      transitionDuration: "200ms",
    },
    "&.MuiInputBase-root": {
      backgroundColor: "#101123",
      
      borderRadius: "6px",
      marginBottom: "10px",
      color: "#e0e0e0",
      fontFamily: "Poppins",
      fontWeight: "300",
      padding: "10px 10px",
      border: "1px solid transparent",
      "& > div > input": {
        color: "#e0e0e0",
        fontFamily: "Poppins",
        fontWeight: "300",
        border: "1px solid hsl(220, 22%, 62%)",
      },
    },
    "& > div > input": {
      backgroundColor: "#101123",
      borderRadius: "6px",
      transitionDuration: "200ms",
      color: "#e0e0e0",
      fontFamily: "Poppins",
      fontWeight: "300",
    },
  },
  buttonlogin: {
    color: "#fff",
    width: "100%",
    fontSize: "13px",
    background: "hsl(215, 75%, 50%)",
    fontFamily: "Poppins",
    fontWeight: "500",
    letterSpacing: ".02em",
    transition: "all 200ms",
    textTransform: "none",
    "&:hover": {
      opacity: "0.75",
      background: "hsl(215, 75%, 50%)",
    },
  },
}));

const Settings = () => {
  const { addToast } = useToasts();
  const classes = useStyles();

  // State for affiliate code
  const [loading, setLoading] = useState(true);
  const [affiliateCode, setAffiliateCode] = useState('');
  const [saving, setSaving] = useState(false);

  // Function to fetch affiliate code and other settings data
  const fetchData = async () => {
    try {
      const response = await getUserAffiliatesData();
      setAffiliateCode(response.affiliateCode);
      setLoading(false)
    } catch (error) {
      addToast(error.message, { appearance: "error" });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Function to handle affiliate code update
  const handleUpdateAffiliateCode = async () => {
    try {
      setSaving(true);
      await updateUserAffiliateCode(affiliateCode);
      addToast("Affiliate code updated successfully!", { appearance: "success" });
    } catch (error) {
      addToast(error.message, { appearance: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={classes.root}>
      <div style={{display: "flex", gap: "0.5rem", flexDirection: "column", maxWidth: "100%"}}>
        <label htmlFor="affiliate-code">Update Affiliate Code:</label>
        <TextField
          id="affiliate-code"
          className={classes.textField}
          name="code"
          variant="outlined"
          placeholder="Code"
          onChange={(e) => setAffiliateCode(e.target.value)}
          value={loading ? null : affiliateCode}
        />
        <Button
          size="medium"
          color="primary"
          className={classes.buttonlogin}
          disabled={saving || loading}
          onClick={handleUpdateAffiliateCode}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default Settings;
