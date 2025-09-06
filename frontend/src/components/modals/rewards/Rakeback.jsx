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
import { motion } from 'framer-motion';

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

import error from "../../../assets/sounds/error.mp3";
import coin from "../../../assets/icons/coin.png";

const errorAudio = new Audio(error);

const playSound = audioFile => {
  audioFile.play();
};

// Custom Styled Component
const ColorCircularProgress = withStyles({
  root: {
    color: "#fff !important",
    transition: "transform 0.5s ease-in-out",
  },
})(CircularProgress);

// Custom Styles
const useStyles = makeStyles(theme => ({
  modal: {
    "& div > div": {
      height: "100%",

      color: "#e4e4e4",
      fontFamily: "Poppins",
      fontSize: "14px",
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
  swiper: {
    width: '200px',
    height: '240px',
    borderRadius: '20px',
  },
  swiperSlide: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '20px',
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#fff',
    background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0, 0, 0, .08) 0, rgba(0, 0, 0, .08) 20px)',
  },
  swiperSlideNth: {
    '&:nth-child(1n)': {
      backgroundColor: '#31363c',
      borderRadius: '20px',
      border: '1px dashed #ffffff',
    },
  },
  swiperButtonNext: {
    right: '-120px',
  },
  swiperButtonPrev: {
    left: '-120px',
  },

  vipTitle: {
    fontSize: 14,
    fontFamily: "Poppins",
    textAlign: "left",
    fontWeight: 300,
    "& > span": {
      fontFamily: "Poppins",
      color: "hsl(230, 50%, 50%)",
    },
  },
  progressbox: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
    padding: "0 50px",
    "& > img": {
      position: "absolute",
      top: -10,
      zIndex: 1000,
    },

  },
  buttontest: {
    color: "#e4e4e4",
    fontFamily: "Poppins",
    fontSize: "13px",
    fontWeight: 300,
  },
  titlePoppins: {
    fontFamily: "Poppins",
  },
  progress: {
 
    height: "2.5rem",
    borderRadius: "0.25rem",
    "& > div": {
      background:
        "-webkit-linear-gradient( 0deg, rgb(52, 63, 68) 0%, #4CAF50 100%) !important",
    },
  },
  rake: {
    color: "#fff",
    background: "hsl(215, 75%, 50%)",
    fontFamily: "Poppins",
    padding: "10px",
    borderRadius: "0.25rem",
    transitionDuration: "300ms",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.2rem",
    justifyContent: "center",
    "&:hover": {
      filter: "brightness(110%)"
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

const Rakeback = ({ open = true, handleClose, changeWallet, user }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();
  const [completed, setCompleted] = useState(0);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [vipData, setVipData] = useState(null);
  const [currentMajorLevelIndex, setCurrentMajorLevelIndex] = useState(null);
  let currentStart = 1;

  // Claim user vip rakeback
  const claimRakeback = async () => {
    setClaiming(true);
    try {
      const response = await claimRakebackBalance();

      changeWallet({ amount: response.rakebackClaimed });
      addToast(
        "Successfully claimed Rakeback!",
        { appearance: "success" }
      );
      const data = await getUserVipData();
      setVipData(data);
      //console.log(claiming);
    } catch (error) {
      setClaiming(false);
      //console.log(
      //  "There was an error while claiming user rakeback balance:",
      //  error
      //);
      // If this was user error
      if (error.response && error.response.data && error.response.data.error) {
        addToast(error.response.data.error, { appearance: "error" });
        playSound(errorAudio);
      } else {
        //window.location.replace("/Update");
        console.log(claiming); // delete this, its useless
      }
    }
  };

  // componentDidMount
  useEffect(() => {
    // Fetch vip data from API
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getUserVipData();

        // Update state
        setVipData(data);
        setCurrentMajorLevelIndex(data.majorLevelNames.findIndex((levelName) => levelName === data.currentLevel.levelName));
        let lastObject = data.allLevels[data.allLevels.length - 1];
        let wagerNeededLastLevel = lastObject.wagerNeeded;
        if (data.wager >= wagerNeededLastLevel) {
          setCompleted(1);
        }
        else {
          setCompleted(0);
        }
        setLoading(false);
      } catch (error) {
        console.log("There was an error while loading user vip data:", error);
        addToast(
          "There was an error while getting your VIP data, please try again later!",
          { appearance: "error" }
        );
      }
    };

    // If modal is opened, fetch data
    if (open) fetchData();
  }, [addToast, open]);

  return (
    <motion.div
      className={classes.modal}
      onClose={handleClose}
      open={open}
      style={{ fontFamily: "Poppins", }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div style={{  }}>
        {loading ? (
          <Box className={classes.loader}>
            <ColorCircularProgress
              style={{ transform: "scale(1.2)" }}
            />
          </Box>
        ) : (
          <Fragment>
            <motion.h1
              className={classes.vipTitle}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
            >
              <span style={{
                color: "#fff",
                padding: "5px 5px 4px 5px",
                fontSize: "12px",
                marginLeft: "5px",
                borderRadius: "6px",
              }}>
              </span>
            </motion.h1>
            <Box position="relative" className={classes.progressbox}>
              {completed < 1 ?
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeInOut", delay: 0.4 }}
                >
                  <h4 className={classes.vipDesc} style={{ marginTop: "6px", textAlign: "center", position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
                    <span style={{ color: "#fff", }}>Wager <span style={{ color: "#fff", fontWeight: 500, }}>{(vipData.nextLevel.wagerNeeded - vipData.wager).toFixed(2)}</span> more to level up</span>
                  </h4>
                  <ProgressBar style={{ borderRadius: "5px",  }}
                    variant="success"
                    animated
                    min={vipData.currentLevel.wagerNeeded}
                    max={vipData.nextLevel.wagerNeeded}
                    now={vipData.wager}
                  />
                </motion.span>
                : completed >= 1 ?
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeInOut", delay: 0.4 }}
                  >
                    <h4 className={classes.vipDesc} style={{ marginTop: "6px", marginLeft: "29px", position: "absolute", }}>
                      <span style={{ color: "#fff", }}>You reached the highest level. Congratulations!</span>
                    </h4>
                    <ProgressBar style={{ borderRadius: "5px", }}
                      variant="success"
                      animated
                      min={0}
                      max={100}
                      now={100}
                    />
                  </motion.span>
                  : null
              }
            </Box>
            <br /><br />
            <Swiper
              effect={"cards"}
              grabCursor={true}
              modules={[EffectCards, Navigation]}
              className={classes.swiper}
              initialSlide={currentMajorLevelIndex}
              navigation={{
                nextEl: `.${classes.swiperButtonNext}`,
                prevEl: `.${classes.swiperButtonPrev}`
              }}
            >

              {vipData.majorLevelNames.map((levelName, index) => {
                let currentIndex = vipData.allLevels.findIndex((level) => level.levelName === levelName);
                let endIndex = currentIndex + 1;
                let nextIndex = vipData.allLevels.findIndex((level) => level.levelName === vipData.majorLevelNames[index + 1]);
                if (nextIndex === -1) {
                  endIndex = vipData.allLevels.length;
                }
                else {
                  endIndex = nextIndex;
                }
                let start = currentStart;
                currentStart = endIndex + 1;

                // Find the minimum and maximum rakeback percentage for the current major level
                let minRakeback = vipData.allLevels.slice(currentIndex, endIndex).reduce((min, level) => Math.min(min, level.rakebackPercentage), Number.MAX_VALUE);
                let maxRakeback = vipData.allLevels.slice(currentIndex, endIndex).reduce((max, level) => Math.max(max, level.rakebackPercentage), 0);
                return (
<SwiperSlide 
  key={index} 
  className={`${classes.swiperSlide} ${classes.swiperSlideNth}`} 
  style={{ backgroundColor: vipData.majorLevelColors[index], filter: `drop-shadow(0px 0px 4px ${vipData.majorLevelColors[index]})` }}
>
  <motion.h2
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeInOut", delay: 0.6 }}
    style={{ color: "#fff", border: "0px", background: "#00000029", padding: "12px", borderRadius: "10px", }}
  >
    VIP RANK<br />
    <hr style={{ border: "1px solid #fff", borderRadius: "50px", }} />
    <span style={{ color: "#fff", fontWeight: 500, }}>{levelName} <br /></span>
    <span style={{ fontSize: "14px", color: "#fff", fontWeight: "500", }}>Level: {start} - {endIndex}</span><br />
    <span style={{ fontSize: "14px", color: "#fff", fontWeight: "500", }}>Rake: {minRakeback}% - {maxRakeback}%</span><br />
    <span style={{ fontSize: "14px", color: "#fff", fontWeight: "500", }}>Current: {vipData.currentLevel.rakebackPercentage}%</span>
  </motion.h2>
</SwiperSlide>
                );
              })}
            </Swiper>
          </Fragment>
        )}
      </div>
    </motion.div>
  );
};

Rakeback.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  changeWallet: PropTypes.func.isRequired,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, { changeWallet })(Rakeback);
