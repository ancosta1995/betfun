import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core';
import { getActiveGame } from "../services/api.service";
import { battlesSocket } from "../services/websocket.service";
import { useToasts } from "react-toast-notifications";
import { useHistory } from 'react-router-dom';
import parseCommasToThousands from "../utils/parseCommasToThousands";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Grow } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import { motion, AnimatePresence } from "framer-motion";
import confetti from 'canvas-confetti';
import spinSound from "../assets/chest_spin.wav";
import confettiSound1 from "../assets/small_celebration.wav";
import reset from "../assets/spinner_reset_middle.wav";
import coin from "../assets/icons/coin.png";
import error from "../assets/sounds/error.mp3";
import ProvablyModal from "../components/battles/ProvbalyModal"

import Gold from "../assets/colors/gold.png";
import Red from "../assets/colors/red.png";
import Purple from "../assets/colors/purple.png";
import Blue from "../assets/colors/blue.png";
import Grey from "../assets/colors/grey.png";
import GoldBG from "../assets/colors/goldbg.png";
import RedBG from "../assets/colors/redbg.png";
import PurpleBG from "../assets/colors/purplebg.png";
import BlueBG from "../assets/colors/bluebg.png";
import GreyBG from "../assets/colors/greybg.png";
import GoldBlob from "../assets/colors/goldblob.png";
import RedBlob from "../assets/colors/redblob.png";
import PurpleBlob from "../assets/colors/purpleblob.png";
import BlueBlob from "../assets/colors/blueblob.png";
import GreyBlob from "../assets/colors/greyblob.png";

const errorAudio = new Audio(error);

const spinAudio = new Audio(spinSound);
spinAudio.playbackRate = 1;

const confettiAudio1 = new Audio(confettiSound1);
confettiAudio1.volume = 0.075;

const resetAudio = new Audio(reset);
resetAudio.volume = 0.75;

const playSound = audioFile => {
  audioFile.play();
};

const useStyles = makeStyles(theme => ({
  root: {
    
    color: "#fff",
    fontFamily: "Poppins",
    overflowY: "auto",
    scrollbarWidth: "none",
    height: "100%",
    width: "100%",
    maxWidth: "1250px",
    margin: "0 auto",
    [theme.breakpoints.down("xl")]: {
      height: "calc(200% + 100%)",
      width: "calc(100%)",
      minHeight: "calc(250vh + 100%)",

    },
    [theme.breakpoints.down("sm")]: {
      height: "calc(200% + 100%)",
    },
    [theme.breakpoints.down("md")]: {
      height: "calc(200% + 100%)",
    },

  },
  battle: {
    padding: 0,
    margin: 0,
  },
  rowTop: {
    padding: "0.5rem 1rem",
    borderTopRightRadius: "0.5rem",
    borderTopLeftRadius: "0.5rem",
    margin: 0,
    display: "flex",
    flexWrap: "wrap",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#101123"
  },
  topLeftCol: {
    minWidth: 0,
    display: "flex",
    backgroundColor: "#0A0B1C",
    padding: "0.5rem 0.75rem",
    borderRadius: "0.5rem"
  },
  topMiddleCol: {
    textAlign: "center",
    margin: "auto",
  },
  topRightCol: {
    display: "flex",
    flexDirection: "row",
  },
  backButton: {
    padding: ".5rem 1.25rem",
    marginRight: "1.5rem",
    border: "1px solid #101123",
    backgroundColor: "#101123",
    color: "#fff",
    fontSize: ".95rem",
    fontWeight: 400,
    fontFamily: "Poppins",
    borderRadius: "4px",
    padding: ".5rem 1rem",
    lineHeight: "2rem",
    letterSpacing: "1px", 
    cursor: "pointer",
    transition: "all .15s ease-in-out",
    verticalAlign: "middle",
    display: "inline-block",
  },
  description: {
    color: "#838b8d",
    alignContent: "center",
    display: "flex",
    marginRight: ".75rem",
    verticalAlign: "middle",
    fontFamily: "Poppins",
  },
  price: {
    fontWeight: 500,
    verticalAlign: "middle",
    fontFamily: "Poppins",
  },
  priceWrapper: {
    display: "inline-flex",
    alignItems: "center",
    color: "#eee !important",
    gap: "0.25rem",
    fontWeight: "550"
  },
  priceWrapperImg: {
    position: "relative",
    height: "1rem",
    width: "1rem",
    marginRight: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },  
  caseButton: {
    transition: "all .15s ease-in-out",
    verticalAlign: "middle",
    display: "inline-block",
    borderRadius: "4px",
    padding: ".5rem 1rem",
    lineHeight: "2rem",
    color: "#fff",
    fontWeight: 300,
    letterSpacing: ".5px",
    fontSize: "1.2rem",
    marginRight: "1rem",
    cursor: "inherit",
    background: "0 0",
    border: "none",
    fontFamily: "Poppins",
  },
  battleInfo: {
    width: "-webkit-fit-content",
    width: "-moz-fit-content",
    width: "fit-content",
    padding: "1rem 1.75rem",
    textAlign: "center",
    marginLeft: "auto",
    fontWeight: 700,
    fontFamily: "Poppins",
  },
  link: {
    width: "-webkit-fit-content",
    width: "-moz-fit-content",
    width: "fit-content",
    background: "#101123",
    borderRadius: "4px",
    padding: "1rem 1.75rem",
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    textAlign: "left",
    marginLeft: "auto",
    cursor: "pointer",
    fontFamily: "Poppins",
  },
  linkText: {
    color: "rgba(239,250,251,.5)",
    gridRow: 1,
    gridColumn: 1,
    fontSize: ".9rem",
    marginRight: "30px",
  },
  linkSvg: {
    gridRow: 1,
    gridColumn: 1,
    margin: "auto 0",
    marginLeft: "auto",
  },
  rowCases: {
    display: "flex",
    flexWrap: "wrap",
    border: "2px dashed #101123",
    padding: "1.5rem",
    margin: "1.5rem 0",
    borderRadius: "4px",
    color: "rgba(239,250,251,.5)",
  },
  middleLeftCol: {
    textAlign: "left",
    maxWidth: "12rem",
    padding: 0,
    margin: 0,
    flexBasis: 0,
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
  },
  middleMiddleCol: {
    textAlign: "center",
    padding: 0,
    margin: 0,
    flexBasis: 0,
    flexGrow: 1,
    maxWidth: "100%",
  },
  middleCol: {
    padding: 0,
    margin: 0,
    flexBasis: 0,
    flexGrow: 1,
    maxWidth: "100%",
  },
  middleProvablyFairCol: {
    cursor: "pointer",
    textAlign: "right",
    maxWidth: "12rem",
    padding: 0,
    margin: 0,
    flexBasis: 0,
    flexGrow: 1,
    display: "flex",
    alignItems: "center", 
    justifyContent: "flex-end", 
  },
  createNewBattle: {
    marginTop: "-10px",
    marginBottom: "-10px",
    fontWeight: "700 !important",
    letterSpacing: ".1px",
    background: "#1D4E95 !important",
    color: "#222 !important",
    border: "1px solid #1D4E95",
    cursor: "pointer",
    transition: "all .15s ease-in-out",
    verticalAlign: "middle",
    display: "inline-block",
    borderRadius: "4px",
    padding: ".5rem 1rem",
    lineHeight: "2rem",
    fontSize: ".95rem",
    marginLeft: "45%",
    fontFamily: "Poppins",
  },
  provFairSvg: {
    opacity: .75,
    marginRight: 0,
    gridRow: 1,
    gridColumn: 1,
    margin: "auto 0",
    marginLeft: "auto",
    marginRight: "6.5rem",
  },
  rowSpinners: {
    display: "grid",
    position: "relative",
    padding: 0,
    margin: 0,
    
    [theme.breakpoints.down("xs")]: {
      columnGap: "0.25rem",
    },
  },
  spinnerLeft: {
    marginLeft: "-.5rem",
    textAlign: "left",
    gridColumn: 1,
    marginTop: "5rem",
    zIndex: 99,
    height: "20rem",
    display: "grid",
    gridRow: 1,
    padding: 0,
  },
  spinnerRight: {
    marginRight: "-.5rem",
    textAlign: "right",
    marginTop: "5rem",
    zIndex: 99,
    height: "20rem",
    display: "grid",
    gridRow: 1,
    padding: 0,
    margin: 0,
  },
  spinnerCol: {
    padding: 0,
    margin: 0,
    display: "grid",
    gridRow: 1,
    maxWidth: "100%",
  },
  spinner1: {
    gridColumn: 1
  },
  spinner2: {
    gridColumn: 2
  },
  spinner3: {
    gridColumn: 3
  },
  spinner4: {
    gridColumn: 4
  },
  rowTopDone: {
    background: "#101123",
    width: "100%",
    border: "1px solid transparent",
    margin: "0rem 0 0.5rem 0",
    // borderRadius: "0.5rem",
    height: "5rem",
    padding: 0,
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center"
  },
  leftCol: {
    textAlign: "right",
    display: "flex",
    flexDirection: "row",
    margin: "auto",
    gap: "0.75rem",
    alignItems: "center"
  },
  picture: {

  },
  profilePicture: {
    margin: 0,
    height: "3rem",
    width: "3rem",
    boxSizing: "border-box",
    borderRadius: "8px",
    float: "left",
  },
  text: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    [theme.breakpoints.down("xs")]: {
      display: "none"
    },
  },
  username: {
    color: "#fff",
    fontSize: "1rem",
    fontWeight: 600,
    display: "block",
    letterSpacing: "1px",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    maxWidth: "0rem",
  },
  level: {
    fontSize: ".8rem",
    fontWeight: 700,
    display: "block",
    letterSpacing: "1px",
    backgroundColor: "#1D4E95",
    borderRadius: "4px",
    color: "#1a1d20",
    padding: ".1rem .4rem",
    float: "left",
    marginTop: ".25rem",
  },
  rightCol: {
    textAlign: "right",
    display: "flex",
    flexDirection: "row",
    margin: "auto",
  },
  numberClick: {
    height: "3rem",
    background: "hsl(215, 75%, 50%)",
    borderRadius: "4px",
    color: "#2871FF",
    minWidth: "6rem",
    maxWidth: "10rem",
    marginLeft: "auto",
    display: "grid",
    [theme.breakpoints.down("xs")]: {
      fontSize: "10px",
      minWidth: "3rem",
      height: "2rem",
      marginLeft: 0,
      marginRight: 0,
      margin: "0 auto"
    },
    transitionDuration: "300ms",
    "&:hover": {
      filter: "brightness(115%)",
    }
  },
  click: {
    cursor: "pointer",
    height: "100%",
    width: "100%",
    alignItems: "center",
    display: "flex",
    margin: 0,
    justifyContent: "center",
    fontSize: "1rem",
    fontWeight: 500,
    letterSpacing: ".5px",
    textAlign: "center",
    color: "#fff",
    borderRadius: "4px",
    transitionDuration: "150ms",

  },
  disabled: {
    cursor: "pointer",
    height: "100%",
    width: "100%",
    alignItems: "center",
    display: "flex",
    margin: 0,
    justifyContent: "center",
    fontSize: "1rem",
    fontWeight: 500,
    opacity: 0.5,
    letterSpacing: ".5px",
    textAlign: "center",
    backgroundColor: "#313338",
    color: "#9E9FBD"
  },
  middle: {
    width: "100%",
    display: "grid",
    overflow: "hidden",
    height: "20rem",
    margin: "0rem 0",
    position: "relative",
    backgroundColor: "#0A0B1C"
  },
  topShade: {
    background: "linear-gradient(0deg,rgba(21,23,25,.8),rgba(31,34,37,0))",
    height: "8rem",
    gridColumn: 1,
    gridRow: 1,
    width: "100%",
    transform: "rotate(180deg)",
  },
  bottomShade: {
    marginTop: "12rem",
    background: "linear-gradient(0deg,rgba(21,23,25,.8),rgba(31,34,37,0))",
    height: "8rem",
    gridColumn: 1,
    gridRow: 1,
    width: "100%",
  },
  bottom: {
    width: "100%",
    border: "3px solid transparent"
  },
  rowDrops: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(10rem,1fr))",
    columnGap: "4px",
    rowGap: "4px",
    marginTop: ".1rem",
    maxHeight: "100%",
    [theme.breakpoints.down("xs")]: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem"
    },
  },
  drop: {
    maxWidth: "100%",
    padding: 0,
    margin: 0,
  },
  number: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: "0.5rem",
    backgroundColor: "#101123",
    border: "1px solid #1a1c36",
    gap: "0.5rem",
    overflow: "hidden",
    padding: "0.625rem 0.75rem",
    height: "100%",
    userSelect: "none",
    [theme.breakpoints.down("xs")]: {
      height: "10rem",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    },
  },
  countdown: {
    textAlign: "center",
    zIndex: 100,
    opacity: 1

  },
  countdownText: {
    textAlign: "center",
    color: "#9E9FBD",
    fontWeight: 500,
    marginBottom: "0.5rem"
  },
  countdownNum: {
    fontSize: "0.75rem",
    lineHeight: "1.1em",
    color: "hsl(215, 75%, 50%)",
    fontWeight: 500,
    transformOrigin: "center",
  },
  caselist: {
    transition: "transform .25s ease-out 0s,-webkit-transform .25s ease-out 0s",
    transitionTimingFunction: "ease-out, ease-out",
    transitionTimingFunction: "cubic-bezier(.1,0,.2,1)",
    transform: "translateX(261.887px)",
    display: "flex",
  },
  left: {
    transform: "matrix(-1,0,0,1,0,0) scaleX(-1)",
    left: 0,
    background: "linear-gradient(90deg,rgba(21,23,25,.8),rgba(31,34,37,0))",
    borderRadius: "4px 0 0 4px",
    height: "100%",
    width: "40%",
    position: "absolute",
    zIndex: 999,
    textAlign: "left",
    maxWidth: "12rem",
  },
  right: {
    background: "linear-gradient(90deg,rgba(21,23,25,.8),rgba(31,34,37,0))",
    borderRadius: "4px 0 0 4px",
    height: "100%",
    width: "40%",
    position: "absolute",
    zIndex: 999,
    ["-webkit-transform"]: "matrix(-1,0,0,1,0,0)",
    transform: "matrix(-1,0,0,1,0,0)",
    right: 0,
    textAlign: "right",
    maxWidth: "12rem",
  },
  inner: {
    padding: "0",
    width: "60%",
    left: "20%",
    display: "grid",
    overflowX: "clip",
  },
  active: {
    margin: "0 2rem",
  },
  inactiveImg: {
    maxHeight: "2.5rem",
    ["-webkit-filter"]: "grayscale(1)",
    filter: "grayscale(1)",
  },
  activeImg: {
    ["-webkit-filter"]: "grayscale(0) !important",
    filter: "grayscale(0) !important",
    ["-webkit-transform"]: "scale(1.75) !important",
    transform: "scale(1.75) !important",
  },
  balance: {
    height: "3rem",
    background: "#0A0B1C",
    borderRadius: "0.5rem",
    minWidth: "6rem",
    maxWidth: "10rem",
    marginLeft: "auto",
    marginRight: "1rem",
    display: "grid",
    position: "relative",
  },
  winner: {
    background: "linear-gradient(0deg,rgba(78,162,77,.2),rgba(78,162,77,.2)),linear-gradient(0deg,rgba(21,23,25,.5),rgba(21,23,25,.5))"
  },
  wrap: {
    fontSize: "1rem",
    fontWeight: 500,
    margin: "auto 1rem",
    letterSpacing: ".5px",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    gap: "0.3rem",
    justifyContent: "center"
  },
  count: {
    margin: 0,
    fontSize: "0.75rem",
    fontWeight: 500,
    letterSpacing: ".5px",
    textAlign: "center",
  },
  img: {
    height: "16px",
    position: "absolute",
    left: "50%",
    top: "50%",
    ["-webkit-transform"]: "translate(-50%,-45%)",
    transform: "translate(-50%,-45%)",
  },
  crownSvg: {
    top: "-1.5rem",
    display: "inherit",
    overflow: "hidden",
    position: "absolute",
    left: "1.75rem",
  },
  dropImg: {
    height: "4rem",
    width: "4rem",
  },
  dropText: {
    display: "flex",
    minWidth: "0px",
    flexDirection: "column",
    lineHeight: "1.25rem",
    gap: "0.375rem",
    fontSize: "13px",
    textAlign: "left",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",    
    overflow: "hidden", 
    maxWidth: "100%",
    [theme.breakpoints.down("xs")]: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    },
  },
  dropItem: {
    position: "relative",
    zIndex: 10,
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  dropBackground: {
    display: "flex",
    ["-moz-box-align"]: "center",
    alignItems: "center",
    ["-moz-box-pack"]: "center",
    justifyContent: "center",
    position: "absolute",
    inset: "0px",
    margin: "auto",
  },
  dropActualImg: {
    height: "40px",
    width: "40px",
    inset: "0px",
    color: "transparent",
    zIndex: 1000,
    objectFit: "contain",
  },
  backdropWrapper: {
    display: "flex",
    ["-moz-box-align"]: "center",
    alignItems: "center",
    ["-moz-box-pack"]: "center",
    justifyContent: "center",
    position: "absolute",
    inset: "0px",
    margin: "auto",
    filter: "drop-shadow(rgba(255,0,0, 0.5) 0px 0px 20px)"
  },
  backdropImg: {
    maxHeight: "70%",
    maxWidth: "70%",
    objectFit: "contain",
    zIndex: 0,
    height: "auto",
  },
  itemNameBox: {
    minWidth: "0px",
    ["-moz-box-flex"]: 1,
    flexGrow: 1,
    lineHeight: 1.25,
    maxWidth: "100%",
  },
  itemType: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: "0.75rem",
    lineHeight: "1rem",
    color: "#9E9FBD"
  },
  itemName: {
    minWidth: "70%",
    overflow: "hidden",
    fontSize: "10px",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    ["--tw-text-opacity"]: 1,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",    
    overflow: "hidden", 
    maxWidth: "100%",
    color: "rgb(255 255 255 / var(--tw-text-opacity))"
  },
  dropPriceWrapper: {
    display: "-webkit-inline-box",
    display: "-webkit-inline-flex",
    display: "-ms-inline-flexbox",
    display: "inline-flex",
    ["-webkit-align-items"]: "center",
    ["-webkit-box-align"]: "center",
    ["-ms-flex-align"]: "center",
    alignItems: "center",
    gap: "0.375rem",
    ["--tw-text-opacity"]: 1,
    color: "rgb(255 255 255 / var(--tw-text-opacity))",
  },
  dropImgPriceWrapper: {
    display: "block",
    height: "1rem",
    width: "1rem",
  },
  blankDrop: {
    display: "grid",
    gridTemplateRows: "1fr",
    width: "100%",
    overflow: "hidden",
    borderRadius: "0.5rem",
    alignItems: "center",
    height: "7rem",
    textAlign: "center",
    [theme.breakpoints.down("xs")]: {
      height: "10rem",
      width: "100%",
    },
  },
  dropImgPrice: {
    display: "block",
    verticalAlign: "middle",
  },
  lossText: {
    fontSize: "0.75rem",
    lineHeight: "1rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "3px",
  },
  lossTextContainer: {
    display: "flex",
    height: "100%",
    width: "100%",
    flexDirection: "column",
    ["-moz-box-align"]: "center",
    alignItems: "center",
    ["-moz-box-pack"]: "center",
    justifyContent: "center",
    ["--tw-bg-opacity"]: 1,
    ["--tw-text-opacity"]: 1,
    color: "rgb(239 68 68 / var(--tw-text-opacity))",
    opacity: 0.5,
  },
  winTextContainer: {
    display: "flex",
    height: "100%",
    width: "100%",
    flexDirection: "column",
    ["-moz-box-align"]: "center",
    alignItems: "center",
    alignSelf: "auto",
    ["-moz-box-pack"]: "center",
    justifyContent: "center",
    ["--tw-bg-opacity"]: 1,
    ["--tw-text-opacity"]: 1,
    color: "rgb(34 197 94 / var(--tw-text-opacity))",
  },
  priceCont: {
    fontSize: "1.5rem",
    lineHeight: "2rem",
    letterSpacing: "0.05em",
    ["--tw-text-opacity"]: 1,
    color: "rgb(255 255 255 / var(--tw-text-opacity))",
    [theme.breakpoints.down("xs")]: {
      fontSize: "8px"
    },
  },
  priceCont2: {
    display: "inline-flex",
    ["-moz-box-align"]: "center",
    alignItems: "center",
    gap: "0.375rem",
    [theme.breakpoints.down("xs")]: {
      fontSize: "15px"
    },

  },
  priceImgCont: {
    display: "block",
    height: "1rem",
    width: "1rem",
  },
  priceImg: {
    display: "block",
    verticalAlign: "middle",
  },
  finishedGradient: {
    pointerEvents: "none",
    position: "absolute",
    inset: "0px",
    zIndex: 10,
    background: "linear-gradient(0deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0) 30%, rgba(0, 0, 0, 0) 70%, rgba(0, 0, 0, 0.3) 100%)",
  },
  boxes: {

  },
  door: {
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
  },
  box: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "3rem",
    height: "100px",
    width: "100%",
    backgroundColor: "#0A0B1C",
    position: "relative",
    zIndex: 10,
  },
  itemNumber: {
    color: "#fff",
    fontSize: "1.2rem",
    fontWeight: 500,
    fontFamily: "Poppins",
    opacity: 0,
    transition: "all 0.5s ease",
    [theme.breakpoints.down("xs")]: {
      fontSize: "15px"
    },
  },
  itemName2: {
    color: "rgb(153, 153, 153)",
    fontSize: "0.8rem",
    fontWeight: 500,
    fontFamily: "Poppins",
    opacity: 0,
    transition: "all 0.5s ease",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",    
    overflow: "hidden", 
    maxWidth: "70%",
    [theme.breakpoints.down("xs")]: {
      fontSize: "10px",
      margin: "0 0.5rem"
    },
  },
  spinImg: {
    height: "60px",
    width: "60px",
    margin: "1rem auto",
    objectFit: "contain",
    zIndex: 1,
  },
  gradientContainer: {
    width: "100px",
    height: "100px",
    margin: "1rem auto",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  canvas: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    pointerEvents: "none",
    zIndex: 10000,
  },
  backButtonContainer: {
    border: "none",
    alignItems: "center",
    justifyContent: "center",
    height: "2.15rem",
    outline: "none !important",
    padding: ".5rem 0",
    display: "flex",
    position: "relative",
    borderRadius: "0.25rem",
  },
  backButtonContainer2: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    color: "#808080",
    gap: "0.5rem",
    cursor: "pointer",
    transitionDuration: "300ms",
    "&:hover": {
      filter: "brightness(125%)"
    }
  },
  backButtonSVG: {
    transitionDuration: "200ms",
    height: "1rem !important",
    width: "1rem !important",
  },
  topBar: {
    position: "relative",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    display: "flex",
    margin: "1rem 0"
  },
  titleText: {
    textAlign: "center",
    display: "inline-block",
    lineHeight: "1em",
    margin: 0,
    fontSize: "1.25rem",
    color: "#fff",
    fontWeight: 400,
    letterSpacing: 0,
    lineHeight: "140%",
  },
  reelSelector: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50px",
    height: "1px",
    display: "flex",
    zIndex: 1,
    position: "absolute",
    borderRadius: "0.4rem",
    backgroundColor: "#fff",
    opacity: 0,
  },
  casesContainer: {
    display: "flex", 
    flexDirection: "row",
    gap: "3px",
    width: 400,
    maxWidth: 400,
    overflow: "hidden",
  },
  case: {
    flexGrow: 0,
    height: 60,
    width: 60,
    minWidth: 60,
    minHeight: 60,
    borderRadius: "0.25rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "#1a1b33",
    padding: "0.25rem",
    userSelect: "none",
    transition: "all .3s ease-in-out",
  },
  caseViewContainer: {
    display: "flex", 
    alignItems: "center", 
    height: "fit-content", 
    width: "fit-content", 
    justifyContent: "center", 
    padding: "0.25rem 0.75rem", 
    backgroundColor: "#0A0B1C",
    borderRadius: "0.5rem"
  },
  popupButton: {
    flex: "none",
    border: "none",
    cursor: "pointer",
    height: "2.25rem",
    display: "inline-flex",
    outline: "none",
    padding: "0 0.75rem",
    position: "relative",
    alignItems: "center",
    fontWeight: "bold",
    userSelect: "none",
    whiteSpace: "nowrap",
    willChange: "opacity",
    borderRadius: "0.25rem",
    justifyContent: "center",
    transitionDuration: "350ms",
    fontWeight: 500,
    color: "#9E9FBD",
    backgroundColor: "hsla(220, 100%, 82%, 0)",
    "&:hover": {
      backgroundColor: "#313A4D",
      filter: "brightness(130%)"
    }
  },
  buttonIcon: {
    marginRight: ".5em",
    fill: "#9E9FBD",
    flex: "none",
    display: "inline-block",
    outline: "none",
  },
  crazyBox: {
    backgroundColor: "#13112C",
    color: "#7954E9",
    padding: "0.5rem",
    borderRadius: "0.25rem",
    marginRight: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.3rem",
    "& svg": {
      height: "1rem",
      width: "1rem",
    }
  },
  regularBox: {
    backgroundColor: "#0C132E",
    color: "#2871FF",
    padding: "0.75rem",
    borderRadius: "0.25rem",
    marginRight: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.3rem",
    "& svg": {
      height: "1rem",
      width: "1rem",
    }
  },
  winGradient: {
    zIndex: 1000,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: "radial-gradient(45% 45% at 50% 50%,var(--tw-gradient-stops))",
    ["--tw-gradient-stops"]: "var(--tw-gradient-from), var(--tw-gradient-to)",
    ["--tw-gradient-to"]: "rgb(0 227 89 / 0)",
    ["--tw-gradient-from"]: "rgb(0 227 89 / .1)",
  },
  lossGradient: {
    zIndex: 1000,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: "radial-gradient(45% 45% at 50% 50%,var(--tw-gradient-stops))",
    ["--tw-gradient-stops"]: "var(--tw-gradient-from), var(--tw-gradient-to)",
    ["--tw-gradient-to"]: "rgb(255 92 92 / 0)",
    ["--tw-gradient-from"]: "rgb(255 92 92 / .1)",
  },
  reelItemRadialGradient: {
    opacity: .15,
    width: "100%",
    height: "100%",
    zIndex: 0,
    top: 0,
    left: 0,
    position: "absolute",
  },
  itemColor: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 1
  },
}));

const BattlePage = (user, isAuthenticated) => {
  const classes = useStyles();
  const history = useHistory();
  const { battleId } = useParams();
  const { addToast } = useToasts();

  const [loading, setLoading] = useState(true);
  const [gameData, setGameData] = useState([]);
  const [gamePlayers, setGamePlayers] = useState([]);
  const [gameCases, setGameCases] = useState([]);
  const [roundNum, setRoundNum] = useState(0);
  const [gameState, setGameState] = useState("waiting");
  const [countNum, setCountNum] = useState(3);
  const [blockHash, setBlockHash] = useState("");
  const [blockNumber, setBlockNumber] = useState("");
  const [serverSeedHash, setServerSeedHash] = useState("");
  const [serverSeed, setServerSeed] = useState("");
  const [balanceData, setBalanceData] = useState([]);
  const [callingBots, setCallingBots] = useState(false);
  const [joining, setJoining] = useState(false);
  const [drops, setDrops] = useState([]);
  const [openProvably, setOpenProvably] = useState(false);
  let items = [];
  let doors = document.querySelectorAll('#door');
  let ca = []
  let rn = 0;

  const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const calcNewBalance = async (data) => {
    setBalanceData(prev => {
      let array = [];
      
      for(let i = 0; i < data.result.length; i++) {
        let obj = {
          balance: parseFloat((prev[i].balance + data.result[i].item.price).toFixed(2)),
          isWinner: false,
        }
  
        array.push(obj);
      }

      return array;
    })
  };

  const calcNewBalanceOnLoad = async (data) => {
    setBalanceData(prev => {
      let array = [];
      
      for(let i = 0; i < data.players.length; i++) {
        let obj = {
          balance: 0,
          isWinner: false,
          amountWon: 0
        }

        for(let j = 0; j < data.casesRoundResults.length; j++) {
          obj.balance += parseFloat((data.casesRoundResults[j][i].item.price).toFixed(2));
        }

        array.push(obj);
      }

      return array;
    })
  };
  
  const calcBalanceDataForWinner = async (data) => {
    setBalanceData(prev => {
      let array = [];
      for(let i = 0; i < data.pc; i++) {
        let obj = {
          balance: prev[i].balance,
          isWinner: false,
          amountWon: 0
        }
        if(data.isEqual) {
          if(data.bt == 4) {
            obj = {
              balance: prev[i].balance,
              isWinner: true,
              amountWon: data.winAmount
            }
          } else if(data.equals[0] == i+1) {
            obj = {
              balance: prev[i].balance,
              isWinner: true,
              amountWon: data.winAmount
            }
          } else if(data.equals[1] == i+1) {
            obj = {
              balance: prev[i].balance,
              isWinner: true,
              amountWon: data.winAmount
            }
          } else if(data.equals[2] == i+1) {
            obj = {
              balance: prev[i].balance,
              isWinner: true,
              amountWon: data.winAmount
            }
          } else if(data.equals[3] == i+1) {
            obj = {
              balance: prev[i].balance,
              isWinner: true,
              amountWon: data.winAmount
            }
          }
          array.push(obj);
          continue;
        } else {
          if(data.bt == 4) {
            if(data.winningTeam == 1) {
              if(i+1 == 1 || i+1 == 2) {
                obj = {
                  balance: prev[i].balance,
                  isWinner: true,
                  amountWon: data.winAmount
                }
              }
            } else if(data.winningTeam == 2) {
              if(i+1 == 3 || i+1 == 4) {
                obj = {
                  balance: prev[i].balance,
                  isWinner: true,
                  amountWon: data.winAmount
                }
              }
            }
          } else if(data.winningTeam == i+1) {
            obj = {
              balance: prev[i].balance,
              isWinner: true,
              amountWon: data.winAmount
            }
          }
          array.push(obj);
          continue;
        }
      }

      return array;
    })
  };

  const getFilterForItem = (item) => {       
    let filter = "";
    if (item.color === "grey") {
      filter = "drop-shadow(rgba(128, 128, 128, 0.75) 0px 0px 25px)"; // grey
    } else if (item.color === "blue") {
      filter = "drop-shadow(rgba(54, 86, 255, 0.75) 0px 0px 25px)"; // blue
    } else if (item.color === "purple") {
      filter = "drop-shadow(rgba(124, 46, 223, 0.75) 0px 0px 25px)"; // purple
    } else if (item.color === "red") {
      filter = "drop-shadow(rgba(240, 50, 118, 0.75) 0px 0px 25px)"; // red
    } else if (item.color === "gold") {
      filter = "drop-shadow(rgba(252, 177, 34, 0.75) 0px 0px 25px)"; // gold
    }
    
    return filter;
  };

  const getBackgroundForItem = (item) => {
    let background = "";
    
    switch (item.color) {
        case "grey":
            background = "radial-gradient(50% 50% at 50% 50%, rgb(128, 128, 128) 0%, rgba(0, 0, 0, 0) 100%)";
            break;
        case "blue":
            background = "radial-gradient(50% 50% at 50% 50%, rgb(54, 86, 255) 0%, rgba(0, 0, 0, 0) 100%)";
            break;
        case "purple":
            background = "radial-gradient(50% 50% at 50% 50%, rgb(124, 46, 223) 0%, rgba(0, 0, 0, 0) 100%)";
            break;
        case "red":
            background = "radial-gradient(50% 50% at 50% 50%, rgb(255, 51, 51) 0%, rgba(0, 0, 0, 0) 100%)";
            break;
        case "gold":
            background = "radial-gradient(50% 50% at 50% 50%, rgb(252, 177, 34) 0%, rgba(0, 0, 0, 0) 100%)";
            break;
        default:
            background = ""; 
    }
    
    return background;
  };
  const getColorSet = (color) => {
    switch(color) {
      case "grey":
        return { Color: Grey, Background: GreyBG, Hex: "#91A0B1", Blob: GreyBlob }
      case "blue":
        return { Color: Blue, Background: BlueBG, Hex: "#4159CF", Blob: BlueBlob }
      case "purple":
        return { Color: Purple, Background: PurpleBG, Hex: "#703ECF", Blob: PurpleBlob }
      case "red":
        return { Color: Red, Background: RedBG, Hex: "#BF4141", Blob: RedBlob }
      case "gold":
        return { Color: Gold, Background: GoldBG, Hex: "#B69768", Blob: GoldBlob }
      default:
        return { Color: Grey, Background: GreyBG, Hex: "#91A0B1", Blob: GreyBlob }
    }
  };

  const error = msg => {
    setJoining(false);
    addToast(msg, { appearance: "error" });
    playSound(errorAudio);
  };

  const success = msg => {
    setJoining(false);
    addToast(msg, { appearance: "success" });
  };

  const playerJoin = data => {
    if(data.battleId != battleId) return;
    setGamePlayers(data.newPlayers);
  };

  const gameExpose = async (data) => {
    if(data.battleId != battleId) return;
    setBlockNumber(data.blockNumber);
    setGameState("countdown");
  };

  const gameStart = async (data) => {
    if(data.battleId != battleId) return;
    setBlockHash(data.blockHash)
    setServerSeed(data.serverSeed)
  };

  const newRound = async (data) => {
    if(data.battleId != battleId) return;
    setRoundNum(prev => prev + 1);
    rn += 1
    setGameState("spinning");
    items = data.img;
    await delay(250);
    spin(data);
    playSound(spinAudio);
    await delay(4000);
    calcNewBalance(data);
    setGameData(prev => {
      const w = prev;
      const k = prev.casesRoundResults;
      w.casesRoundResults = [...k, data.result];
      return w;
    });
  };

  const gameFinished = async (data) => {
    if(data.battleId != battleId) return;
    calcBalanceDataForWinner(data);
    setGameState("finished");
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const x = await getActiveGame(battleId);
      setGameData(x);
      if(x.status == 2) {
        setGameState("spinning");
        calcNewBalanceOnLoad(x);
      } else if(x.status == 3) {
        setGameState("finished");
        await calcNewBalanceOnLoad(x);
        await calcBalanceDataForWinner(x.win);
      } else {
        setGameState("waiting");
        calcNewBalanceOnLoad(x);
      }      
      setServerSeedHash(x.serverSeedHash);
      setServerSeed(x.serverSeed);
      setBlockNumber(x.blockNumber);
      setBlockHash(x.blockHash);
      setGamePlayers(prev => [...prev, ...x.players]);
      setGameCases(prev => x.cases);
      ca = x.cases;
      rn = x.casesRoundResults.length;
      setRoundNum(prev => x.casesRoundResults.length);
      setLoading(false);
    } catch (error) {
      addToast(error, { appearance: "error" });
      console.log("There was an error while loading case battles data:", error);
    }
  };

  useEffect(() => {

    fetchData();

    battlesSocket.on("battles:error", error);
    battlesSocket.on("battles:success", success);
    battlesSocket.on("battles:join", playerJoin);
    battlesSocket.on("battles:start", gameStart);
    battlesSocket.on("battles:expose", gameExpose);
    battlesSocket.on("battles:round", newRound);
    battlesSocket.on("battles:finished", gameFinished);
    return () => {
      battlesSocket.off("battles:error", error);
      battlesSocket.off("battles:success", success);
      battlesSocket.off("battles:join", playerJoin);
      battlesSocket.off("battles:start", gameStart);
      battlesSocket.off("battles:expose", gameExpose);
      battlesSocket.off("battles:round", newRound);
      battlesSocket.off("battles:finished", gameFinished);
    };
  }, [addToast, setRoundNum, setGameCases, setGameData, setGameState, setGamePlayers]);

  const triggerConfetti = (canvasIndex) => {
    const container = document.querySelector(`#canvas-${canvasIndex}`);
    if (container) {
      const myConfetti = confetti.create(container, {
        resize: true,
      });
      playSound(confettiAudio1);
      myConfetti({
        particleCount: 50,
        spread: 50,
        origin: {
          x: 0.5, 
          y: 1.3,
        }
      });
    }
  };

  const copyLinkAction = () => {
    const battleLink = `https://betfun.gg/battles/${battleId}`;
    navigator.clipboard.writeText(battleLink)
      .then(() => {
        addToast("Successfully copied battle link!", { appearance: "success" });
      })
      .catch((error) => {
        addToast("Failed to copy battle link.", { appearance: "error" });
        console.error("Error copying text to clipboard:", error);
      });
  };

  const handleClick = async (i) => {
    if(user.user._id == gameData.players[0].id) {
      battlesSocket.emit("battles:callbot", battleId, i);
    } else {
      battlesSocket.emit("battles:join", battleId, i);
    }
  };
  
  async function init(firstInit = true, groups = 1, duration = 1, data) {
    let i = 0;
  
    doors = document.querySelectorAll('#door');
  
    for (const door of doors) {
      const reel = document.querySelector('#selector-' + i);
      reel.style.opacity = 1;
  
      if (firstInit) {
        door.dataset.spinned = '0';
      } else if (door.dataset.spinned === '1') {
        return;
      }
  
      const boxes = door.querySelector('#boxes');
      const boxesClone = boxes.cloneNode(false);
      let pool = ['❓'];
  
      if (!firstInit) {
        const arr = [];
        for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
          arr.push(...items);
        }
        let t = shuffle(arr);
        t.splice(27, 0, data.result[i].item);
        pool = t;
      }
  
      for (let i = pool.length - 1; i >= 0; i--) {

        const box = document.createElement('div');
        box.classList.add('box');
        box.classList.add(classes.box);
        box.dataset.index = i;
  
        const image = document.createElement('img');
        image.classList.add(classes.spinImg)
        image.src = pool[i].image

        const gradient = document.createElement('div');
        gradient.classList.add(classes.reelItemRadialGradient);
        gradient.style.background = getBackgroundForItem(pool[i]);

        const gradientContainer = document.createElement('div');
        gradientContainer.classList.add(classes.gradientContainer);

        gradientContainer.appendChild(image)
        gradientContainer.appendChild(gradient);

        box.appendChild(gradientContainer);
        boxesClone.appendChild(box);
      }
      boxesClone.style.transform = `translateY(-3160px)`;
      door.replaceChild(boxesClone, boxes);
      i++;
    }
  };
  
  async function spin(data) {
    init(false, 1, 4, data);

    await new Promise((resolve) => setTimeout(resolve, 50));

    let w = [];
    for (const door of doors) {
      const boxes = door.querySelector('#boxes');

      const randomPixelValue = Math.floor(Math.random() * 100) - 50;

      boxes.style.transition = `all 3s cubic-bezier(0.2, 0.4, 0.1, 1.0)`;
      boxes.style.transform = `translateY(-${490 + randomPixelValue}px)`;

      const boxToSave = door.querySelector('.box[data-index="27"]');
      w.push(boxToSave);
    }

    await new Promise((resolve) => setTimeout(resolve, 3250));
    
    playSound(resetAudio);

    for (const door of doors) {
      const boxes = door.querySelector('#boxes');

      boxes.style.transitionDuration = `350ms`;
      boxes.style.transform = `translateY(-490px)`;
    }

    await new Promise((resolve) => setTimeout(resolve, 350));

    let i = 0;
    for (const box of w) {
      if(!box) return;
      box.style.height = "320px";
      box.style.transform = "translateY(-110px)";

      const number = parseCommasToThousands((parseFloat((data.result[i].item.price))).toFixed(2));

      const numberElement = document.createElement('span');
      numberElement.classList.add(classes.itemNumber);
      numberElement.textContent = `$${number}`;

      const nameElement = document.createElement('span');
      nameElement.classList.add(classes.itemName2);
      nameElement.textContent = data.result[i].item.name;

      box.appendChild(numberElement);
      box.appendChild(nameElement)

      const reel = document.querySelector('#selector-' + i);
      // reel.style.opacity = 0;

      numberElement.style.opacity = 1;
      nameElement.style.opacity = 1;
      
      const x = data.result[i].item.price;
      const y = ca[rn-1]?.price * 2.2;
      
      if(x > y) {
        triggerConfetti(i);
        playSound(confettiAudio1);
      };

      i++;
    }
  };

  function shuffle([...arr]) {
    let m = arr.length;
    while (m) {
      const i = Math.floor(Math.random() * m--);
      [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
  };
  
  const renderSpinnerBoxes = () => {
    let allBoxes = [];
    try {
      for(let i = 0; i < gameData.playerCount; i++) {
        let drops = [];
        for(let j = 0; j < gameData.cases.length; j++) {
          drops.push(
            <div className={classes.drop}>
              <div className={classes.number} style={{display: "flex"}}>
                {gameData?.casesRoundResults[j] ? (
                <>
                  <div className={classes.dropImg}>
                    <div className={classes.dropItem}>
                      <div className={classes.reelItemRadialGradient} style={{background: getBackgroundForItem(gameData?.casesRoundResults[j][i].item)}}/>
                      <img className={classes.dropActualImg} alt={gameData.casesRoundResults[j][i].item.name} src={gameData.casesRoundResults[j][i].item.image} draggable="false" decoding="async" data-nimg="fill" loading="lazy" />
                    </div>
                    <div className={classes.dropBackground}>
                      <div className={classes.backdropWrapper}>
                      </div>
                    </div>
                  </div>
                  <div className={classes.itemNameBox}>
                    <div className={classes.itemName}>
                      {gameData.casesRoundResults[j][i].item.name}
                    </div>
                  </div>
                  <div className={classes.itemType}>
                    <span style={{display: "flex", alignItems: "center", gap: "0.25rem"}}>
                    <img style={{height: 10, width: 10}} src={coin} />
                      {parseCommasToThousands(parseFloat((gameData.casesRoundResults[j][i].item.price)).toFixed(2))}
                    </span>
                  </div>
                </>
                ) : <div className={classes.blankDrop}>{j+1}</div>}
              </div>
            </div>
          )
        }

        allBoxes.push(
          <div className={`${classes.spinnerCol} ${classes?.["spinner" + (i+1)]}`} style={{ width: `inherit ${100 / gameData.playerCount}%`}}>
            <div className={classes.middle} style={{ alignContent: gameState != "finished" ? "center" : ""}}>
              <canvas id={`canvas-${i}`} className={classes.canvas}></canvas>
              <div className={classes.finishedGradient} orientation="vertical" />
              { gameState != "finished" ? (
                <div id="door" className={classes.door}>
                  <div id={`selector-${i}`} className={classes.reelSelector} />
                  <div id="boxes" className={classes.boxes}>
                  </div>
                </div>
              ) : ""}
              <AnimatePresence>
                {balanceData[i]?.isWinner && gameState == "finished" ? (
                  <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 0, opacity: 0 }}
                    className={classes.winTextContainer}
                    style={{ opacity: "1 !important" }}
                    
                  >
                    <div className={classes.winGradient} />
                    <span className={classes.lossText}>Winner</span>
                    <div className={classes.priceCont}>
                      <div className={classes.priceCont2}>
                        <span style={{display: "flex", alignItems: "center", gap: "0.25rem"}}>
                          <img style={{height: 17, width: 17}} src={coin} />
                          {parseCommasToThousands((balanceData[i]?.amountWon).toFixed(2))}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ) : gameState == "finished" ? (
                  <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 0, opacity: 0 }} 
                    className={classes.lossTextContainer}
                    style={{ opacity: "1 !important" }}
                  >                    <div className={classes.lossGradient} />
                    <span className={classes.lossText}>Loser</span>
                    <div className={classes.priceCont}>
                      <div className={classes.priceCont2}>
                        <span style={{display: "flex", alignItems: "center", gap: "0.25rem"}}>
                          <img style={{height: 17, width: 17}} src={coin} />
                          0.00
                        </span>
                      </div>
                    </div>
                    </motion.div>
                ) : (
                  ""
                )}
              </AnimatePresence>
              <AnimatePresence>
                {gameState === "countdown" && (
                  <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 0, opacity: 0 }} 
                    className={classes.countdown}
                    style={{ opacity: "1 !important" }}
                  >
                    <div className={classes.countdownText}>Waiting for EOS Block</div>
                    <div className={classes.countdownNum}>#{blockNumber}</div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
            <div  className={classes.rowTopDone} style={{borderBottomLeftRadius: i == 0 ? "0.5rem" : "",borderBottomRightRadius: i+1 == gameData.playerCount ? "0.5rem": ""}}>
              <div className={classes.leftCol}>
                <AnimatePresence>
                  {gamePlayers[i].id && (
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }} 
                      exit={{ y: 50, opacity: 0 }} 
                      key={i} 
                      className={classes.leftCol}
                    >
                      <div className={classes.picture}>
                        <Avatar className={classes.profilePicture} src={gamePlayers[i].pfp} />
                      </div>
                      <div className={classes.text}>
                        {gamePlayers[i].username}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                {i == 0 || gamePlayers[i].id ? "" : <div className={classes.rightCol}>
                  <motion.div className={classes.numberClick} whileTap={{ scale: 0.97 }}>
                    <span className={callingBots || loading ? classes.disabled : classes.click} onClick={() => handleClick(i)}>
                      {user?.user?._id == gameData.players[0].id ? "Call Bot" : "Join"}
                    </span>
                  </motion.div>
                </div>}
              </div>
              <div className={classes.rightCol}>
                <AnimatePresence>
                  {gamePlayers[i].id && (
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }} 
                      exit={{ y: 50, opacity: 0 }} 
                      key={i} 
                      className={`${classes.balance} ${balanceData[i]?.isWinner ? classes.winner : ""}`}                    >
                      { balanceData[i]?.isWinner ? (
                        <svg className={classes.crownSvg} width="40" height="38" viewBox="0 0 40 38" fill="none" xmlns="http://www.w3.org/2000/svg"><g data-v-6b132742="" filter="url(#filter0_d_321:62)"><path data-v-6b132742="" d="M30 17.7616C30 16.6045 29.0586 15.6632 27.9015 15.6632C26.7445 15.6632 25.8031 16.6045 25.8031 17.7616C25.8031 18.288 25.9984 18.7693 26.3195 19.138L24.1503 21.128L21.3836 15.4105L23.0006 13.5112L20.0114 10L17.0222 13.5113L18.5672 15.326L15.8203 21.0955L13.6815 19.1369C14.0022 18.7683 14.197 18.2875 14.197 17.7616C14.197 16.6045 13.2556 15.6632 12.0985 15.6632C10.9414 15.6632 10 16.6045 10 17.7616C10 18.8338 10.8086 19.7203 11.848 19.8446L12.491 27.5478H27.5091L28.1521 19.8446C29.1914 19.7203 30 18.8338 30 17.7616Z" fill="#4EA24D"></path></g><defs data-v-6b132742=""><filter data-v-6b132742="" id="filter0_d_321:62" x="0" y="0" width="40" height="37.5479" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood data-v-6b132742="" flood-opacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix data-v-6b132742="" in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset data-v-6b132742=""></feOffset><feGaussianBlur data-v-6b132742="" stdDeviation="5"></feGaussianBlur><feComposite data-v-6b132742="" in2="hardAlpha" operator="out"></feComposite><feColorMatrix data-v-6b132742="" type="matrix" values="0 0 0 0 0.305882 0 0 0 0 0.635294 0 0 0 0 0.301961 0 0 0 0.35 0"></feColorMatrix><feBlend data-v-6b132742="" mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_321:62"></feBlend><feBlend data-v-6b132742="" mode="normal" in="SourceGraphic" in2="effect1_dropShadow_321:62" result="shape"></feBlend></filter></defs></svg>
                      ) : (
                        ""
                      )
                      }
                      <div className={classes.wrap}>
                        <img style={{height: 14, width: 14}} src={coin} />
                        <span className={classes.count}>{parseCommasToThousands(((balanceData[i]?.balance)?.toFixed(2)))}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
     
              </div>    
            </div>
            <div className={classes.bottom}>
              <div className={classes.rowDrops}>
                {drops}
              </div>
            </div>
          </div>
        );
      }
    } catch (error) {
      console.log(error)
    }
    return allBoxes;
  };

  const spinnerBoxes = renderSpinnerBoxes();

  return loading ? "" : (
    <Grow in timeout={620}>
      <div className={classes.root}> 
        <ProvablyModal
          blockHash={blockHash}
          serverSeed={serverSeed}
          serverSeedHash={serverSeedHash}
          blockNumber={blockNumber}
          open={openProvably}
          handleClose={() => setOpenProvably(!openProvably)}
        />
        <div className={classes.battle}>
          <div className={classes.topBar}>
            <div className={classes.backButtonContainer} onClick={() => history.push(`/battles`)}>
              <div className={classes.popupButton}>
                <svg className={classes.buttonIcon} stroke="currentColor" fill="currentColor" strokeWidth="1" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"></path></svg>
                Back
              </div>
            </div>
            <div style={{gap: "0.5rem", display: "flex"}}>
              <div className={classes.popupButton} onClick={() => copyLinkAction()}>
                <svg className={classes.buttonIcon} xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"><path d="M5.848 10.18a1 1 0 0 1-.798-.98v-8a1 1 0 0 1 1-1h3.086a1 1 0 0 1 .707.293l2.414 2.414a1 1 0 0 1 .293.707V9.2a1 1 0 0 1-1 1h-5.5c-.069 0-.136-.007-.202-.02Z"></path><path d="M3.45 9.2V3.8h-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h5.5a1 1 0 0 0 1-1v-1h-2.9a2.6 2.6 0 0 1-2.6-2.6Z"></path></svg>
                Share Battle
              </div>
              <div className={classes.popupButton} onClick={() => setOpenProvably(!openProvably)}>
                <svg className={classes.buttonIcon} xmlns="http://www.w3.org/2000/svg" width="14" height="15" fill="none" ><path fill="currentColor" d="M12.983 3.002a.544.544 0 0 0-.108-.301.418.418 0 0 0-.245-.16C10.31 2.059 9.342 1.708 7.177.57a.379.379 0 0 0-.354 0C4.658 1.707 3.69 2.058 1.37 2.542a.418.418 0 0 0-.245.159.544.544 0 0 0-.108.3c-.103 1.908.117 3.685.656 5.282a11.265 11.265 0 0 0 1.921 3.511c1.434 1.77 2.957 2.54 3.247 2.675a.373.373 0 0 0 .322 0c.29-.136 1.813-.905 3.247-2.675a11.27 11.27 0 0 0 1.918-3.51c.538-1.598.758-3.375.655-5.282Zm-2.931 2.987L6.498 9.34a.444.444 0 0 1-.138.123.382.382 0 0 1-.168.05h-.018a.4.4 0 0 1-.3-.143l-1.32-1.504a.51.51 0 0 1-.094-.161.57.57 0 0 1 .088-.545.402.402 0 0 1 .302-.15.4.4 0 0 1 .305.142l.992 1.133 3.256-2.95c.075-.1.18-.161.294-.17a.392.392 0 0 1 .312.12c.086.087.139.21.147.341a.554.554 0 0 1-.104.363Z"></path></svg>  
                Provably Fair
              </div>
            </div>
          </div>
          <div className={classes.rowTop} >
            <div className={classes.topLeftCol}>
              <span className={classes.price}>
                <div className={classes.priceWrapper}>
                  <img style={{height: 14, width: 14}} src={coin} />
                  {parseCommasToThousands((gameData?.price).toFixed(2))}
                </div>
              </span>
            </div>
            {
              <div className={classes.caseViewContainer} >
                <div style={{display: "flex", flexDirection: "column", alignItems: "center", padding: "0.5rem"}}>
                  <span style={{color: "#838b8d"}}>{gameCases[gameState == "spinning" ? roundNum - 1 : 0].name}</span>
                  <span style={{display: "flex", alignItems: "center", gap: "0.25rem"}}>
                  <img style={{height: 14, width: 14}} src={coin} />
                    {parseCommasToThousands(gameCases[gameState == "spinning" ? roundNum - 1 : 0].price)}
                  </span>
                </div>
                <div className={classes.casesContainer}>
                  <AnimatePresence>
                    {gameCases.map((caseItem, index) => (        
                      <motion.img 
                      exit={{ y: 0, opacity: 0 }}

                        className={classes.case} 
                        style={{
                          opacity: roundNum - 1 == index && gameState == "spinning" ? 1 : 0.5,
                          transform: gameState == "finished" ? "" : `translateX(-${(roundNum - 1) * 63}px)`,
                        }}
                        src={caseItem.image}
                      />
                    ))}
                  </AnimatePresence> 
                </div>
              </div>
            }
            <div className={classes.topRightCol}>
              {gameData.isCrazyMode ? (
                <div className={classes.crazyBox}>
                  <svg style={{ height: "1.5rem", width: "1.5rem" }} xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64"><g><g><path d="M53.56,27.37c-0.55,0-1.07,0.15-1.53,0.4c-2.48-1.6-4.8-2.35-6.92-2.55c0.66-1.69,2.18-4.68,4.77-4.75    c0.59,0.58,1.39,0.94,2.28,0.94c1.8,0,3.26-1.47,3.26-3.27c0-1.8-1.46-3.27-3.26-3.27c-0.73,0-1.39,0.24-1.93,0.64    C41.8,11.68,37,15.35,34.57,18.74c-1.27-1.85-2.95-3.58-5.14-4.73c-3.89-2.05-8.58-1.85-13.92,0.59c-0.6-0.64-1.44-1.04-2.38-1.04    c-1.8,0-3.27,1.46-3.27,3.26c0,1.81,1.47,3.27,3.27,3.27c0.87,0,1.66-0.35,2.25-0.9c3.24,0.38,5.06,4.3,5.76,6.23    c-5.15,0.33-9.92,2.71-10.45,2.98c-0.08-0.01-0.17-0.02-0.25-0.02c-1.81,0-3.27,1.46-3.27,3.26c0,1.81,1.46,3.27,3.27,3.27    c0.8,0,1.52-0.3,2.09-0.78l0.69-0.15c1.43-0.22,2.52,0.03,3.34,0.75c1.41,1.22,1.73,3.56,1.8,4.92c-0.43,0.1-0.86,0.19-1.29,0.29    c-0.45,0.11-0.77,0.51-0.77,0.97v6.87c0,0.43,0.28,0.82,0.69,0.95c5.44,1.77,10.92,2.65,16.4,2.65c5.48,0,10.96-0.88,16.4-2.65    c0.42-0.13,0.69-0.52,0.69-0.95v-6.87c0-0.46-0.31-0.86-0.76-0.97c-0.46-0.11-0.93-0.21-1.39-0.31c-0.24-3.66,0.21-6.55,1.2-7.46    c0.2-0.18,0.5-0.36,1.02-0.29c0.49,1.19,1.65,2.02,3.01,2.02c1.81,0,3.27-1.46,3.27-3.26C56.83,28.83,55.37,27.37,53.56,27.37z     M52.16,16.87c0.69,0,1.26,0.57,1.26,1.27c0,0.7-0.57,1.27-1.26,1.27c-0.7,0-1.27-0.57-1.27-1.27    C50.89,17.44,51.46,16.87,52.16,16.87z M10.44,32.91c-0.7,0-1.27-0.57-1.27-1.27c0-0.7,0.57-1.26,1.27-1.26    c0.69,0,1.26,0.56,1.26,1.26C11.7,32.34,11.13,32.91,10.44,32.91z M16.35,17.32c0.02-0.16,0.05-0.32,0.05-0.5    c0-0.14-0.03-0.27-0.04-0.41c4.75-2.16,8.83-2.37,12.13-0.64c5.59,2.94,7.42,10.62,7.71,11.97c-1.77,1.2-3.05,2.56-3.74,3.38    c-0.97-1.86-2.3-3.3-4-4.27c-1.61-0.92-3.4-1.34-5.2-1.44C22.7,23.65,20.68,18.35,16.35,17.32z M48.48,41.71v5.34    c-10.01,3.1-20.16,3.1-30.18,0v-5.34C28.32,39.42,38.47,39.42,48.48,41.71z M50.39,29.88c-0.84-0.01-1.59,0.25-2.21,0.81    c-1.84,1.7-2.03,5.65-1.88,8.52c-4.01-0.75-8.03-1.16-12.05-1.21c-0.15-1.79-0.45-3.41-0.92-4.82c0.05-0.05,0.12-0.09,0.17-0.15    c0.28-0.42,7.06-9.94,17.12-3.79C50.52,29.45,50.45,29.66,50.39,29.88z" fill="currentColor" /></g></g></svg>
                  {gameData.gameType == 1 ? "1v1" : gameData.gameType == 2 ? "1v1v1" : gameData.gameType == 3 ? "1v1v1v1" : gameData.gameType == 4 ? "2v2" : 0}
                </div>
              ) : (
                <div className={classes.regularBox}>
                  <svg fill="currentColor" viewBox="0 0 512.001 512.001" xmlns="http://www.w3.org/2000/svg" width="24" height="24" ><g><path d="m59.603 384.898h45v90h-45z" transform="matrix(.707 -.707 .707 .707 -279.94 183.975)"></path><path  d="m13.16 498.841c17.547 17.545 46.093 17.545 63.64 0l-63.64-63.64c-17.547 17.547-17.547 46.093 0 63.64z"></path><path  d="m384.898 407.398h90v45h-90z" transform="matrix(.707 -.707 .707 .707 -178.07 429.898)"></path><path d="m435.201 498.841c17.547 17.545 46.093 17.545 63.64 0 17.547-17.547 17.547-46.093 0-63.64z"></path><path d="m424.595 360.955-21.213-21.215 31.818-31.818c5.863-5.863 5.863-15.352 0-21.215-5.863-5.861-15.35-5.861-21.213 0l-127.278 127.28c-5.863 5.863-5.863 15.35 0 21.213 5.861 5.863 15.35 5.863 21.213 0l31.82-31.82 21.213 21.213z"></path><path d="m128.722 277.214-19.102 19.102-10.607-10.607c-5.863-5.861-15.35-5.861-21.213 0-5.863 5.863-5.863 15.352 0 21.215l31.82 31.818-22.215 22.215 63.64 63.638 22.213-22.213 31.82 31.82c5.863 5.863 15.352 5.863 21.213 0 5.863-5.863 5.863-15.35 0-21.213l-10.605-10.607 19.102-19.102z"></path><path  d="m497.002.001h-84.853c-3.977 0-7.789 1.575-10.607 4.391l-124.329 124.33 106.066 106.066 124.329-124.331c2.818-2.816 4.393-6.628 4.393-10.605v-84.853c-.001-8.287-6.713-14.998-14.999-14.998z"></path><path d="m110.459 4.392c-2.818-2.816-6.63-4.391-10.607-4.391h-84.853c-8.286 0-14.999 6.711-14.999 14.998v84.853c0 3.977 1.575 7.789 4.393 10.605l271.711 271.713 106.066-106.066z"></path></g></svg>
                  {gameData.gameType == 1 ? "1v1" : gameData.gameType == 2 ? "1v1v1" : gameData.gameType == 3 ? "1v1v1v1" : gameData.gameType == 4 ? "2v2" : 0}
                </div>
              )}

              <div className={classes.priceWrapper}>
                {gameState == "finished" ? <span style={{color: "#838b8d"}}>Finished</span> : <><span style={{color:"#838b8d"}}>Round</span> {roundNum} <span style={{color:"#838b8d"}}>of</span> {gameCases.length}</>}
              </div>
            </div>
          </div> 
          <div className={classes.rowSpinners} style={{ gridTemplateColumns: `repeat(${gameData?.playerCount}, 1fr)`}}>
            {spinnerBoxes}
          </div>
        </div>
      </div>
    </Grow>
  );
};

BattlePage.propTypes = {
  user: PropTypes.object,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
  user: state.auth.user,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(BattlePage);