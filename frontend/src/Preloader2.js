import React, { } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

// MUI Components
import Box from "@material-ui/core/Box";

// Assets
import logo from "./assets/square-logo.png";

// Custom styles
const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: '#000000', // Black background

    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    background: "#050614",
  },
  img: {
    height: "15rem",
    marginBottom: "2rem",
  },
  img2: {
    height: "3rem",
  },
}));

const ColorCircularProgress = withStyles({
  root: {
    color: "#fff !important",
  },
})(CircularProgress);

const Preloader = () => {
  // Declare State
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <ColorCircularProgress />
    </Box>
  );
};

export default Preloader;
