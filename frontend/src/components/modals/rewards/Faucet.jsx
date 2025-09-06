import React, { useState, useEffect, Fragment } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useToasts } from "react-toast-notifications";
import {
  getUserVipData,
  claimRakebackBalance,
} from "../../../services/api.service";
import parseCommasToThousands from "../../../utils/parseCommasToThousands";
import { changeWallet } from "../../../actions/auth";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// MUI Components
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import ProgressBar from 'react-bootstrap/ProgressBar'

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Navigation } from "swiper";

import 'swiper/swiper.min.css';
import "swiper/swiper-bundle.min.css";

import "./SwiperCustomCSS.css";

import error from "../../../assets/error.wav";

const errorAudio = new Audio(error);

const playSound = audioFile => {
  audioFile.play();
};

// Custom Styled Component
const ColorCircularProgress = withStyles({
  root: {
    color: "#fff !important",
  },
})(CircularProgress);

// Custom Styles
const useStyles = makeStyles(theme => ({
  modal: {
    minHeight: "35rem",
    "& div > div": {
      color: "#e4e4e4",
      fontFamily: "Poppins",
      fontSize: "14px",
      borderRadius: "0px",
      fontWeight: 300,
    },
    "& .MuiDialog-paperWidthSm": {
      scrollbarWidth: "none",
      width: "50%",
      background: "#1D2126",
      // border: "2px solid #2f3947",
      borderRadius: "20px",
      [theme.breakpoints.down("xs")]: {
        width: "100%",
        margin: "85px 15px 15px 15px",
        height: "80%",
      },
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        margin: "85px 15px 15px 15px",
        height: "80%",
      },
      [theme.breakpoints.down("md")]: {
        width: "100%",
        margin: "85px 15px 15px 15px",
        height: "80%",
      },
    },
  },
  loader: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "30rem",
  },
}));

const Faucet = ({ open = true, handleClose, changeWallet, user }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(true);

  // componentDidMount
  useEffect(() => {

  }, [addToast, open]);

  return (
    loading ? (
      <Box className={classes.loader}>
        <ColorCircularProgress />
      </Box>
    ) : (
      <div className={classes.root}> 

      </div>
    )
  );
};

Faucet.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  changeWallet: PropTypes.func.isRequired,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, { changeWallet })(Faucet);
