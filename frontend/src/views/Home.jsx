import 'swiper/swiper.min.css';
import "swiper/swiper-bundle.min.css";
import 'swiper/swiper-bundle.min.css';

import { EffectCards, Navigation } from "swiper";
import { Gamepad2, Home, LayoutGrid, Search, Star, Video } from 'lucide-react'
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';

import BettingHistory from './BettingHistory'; // Import the BettingHistory component
// MUI Containers
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Coupon from "../components/modals/CouponModal";
import Deposit from "../components/modals/DepositModal";
import Free from "../components/modals/FreeModal";
import Grow from '@material-ui/core/Grow';
import HomeIcon from "@material-ui/icons/Home";
import InputBase from "@material-ui/core/Button";
import { NavLink as Link } from "react-router-dom";
// Modals
import Market from "../components/modals/MarketModal";
import PropTypes from "prop-types";
import RainInfo from "../components/modals/RainInfoModal";
import TriviaInfo from "../components/modals/TriviaInfoModal";
import Typography from "@material-ui/core/Typography";
import Vip from "../components/modals/VIPModal";
//banner
import banner from "../assets/banner.png";
import { chatSocket } from "../services/websocket.service";
import coinflip from "../assets/coinflip.jpg";
import { connect } from "react-redux";
import crash from "../assets/home/crash.png";
import crashbanner from "../assets/crash.jpg";
import cutDecimalPoints from "../utils/cutDecimalPoints";
import dice from "../assets/home/dice.png";
import dicebanner from "../assets/dice.jpg";
import discordbanner from "../assets/banner1.jpg";
import discordbanner1 from "../assets/banner2.jpg";
import { getUserVipData } from "../services/api.service";
import jackpotbanner from "../assets/jackpot.jpg";
import limbo from "../assets/home/limbo.png";
import { makeStyles } from "@material-ui/core/styles";
import mines from "../assets/home/mines.png";
import minesbanner from "../assets/mines.jpg";
import { motion } from 'framer-motion';
import parseCommasToThousands from "../utils/parseCommasToThousands";
import roulettebanner from "../assets/roulette.jpg";
import towerbanner from "../assets/tower.jpg";
import unboxbanner from "../assets/unbox.jpg";
import { useHistory } from "react-router-dom";

// Custom Styles
const useStyles = makeStyles(theme => ({
  root: {
    fontFamily: "Poppins",
    color: "#fff",
    padding: "1rem 4rem",
    display: "flex",
    flexDirection: "column",
    minHeight: "75rem",
    [theme.breakpoints.down("xs")]: {
    },
    [theme.breakpoints.down("sm")]: {
      minHeight: "85rem",
      padding: "0rem 0rem",

    },
    [theme.breakpoints.down("lg")]: {
      padding: "0rem 0rem",

    },
  },

  lastupdate: {
    color: "#5f6368",
    fontFamily: "Rubik",
    fontSize: "14px",
    fontWeight: 400,
    letterSpacing: ".005em",
  },
  gridContainer: {

    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gap: '10px',
  },
  sliderImage: {

    width: '100%', // Adjust size as needed

    height: 'auto',
    border: '2px', // Add border
    borderRadius: '8px', // Optional: rounded corners
    userSelect: 'none', // Prevent text selection
    cursor: 'pointer', // Show pointer cursor on hover
    '&:hover': {
      
      transform: 'scale(1.05) translateY(-10px)', // Slight zoom-in effect and move upwards
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)', // Add shadow for depth
      cursor: 'pointer',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease, padding-top 0.3s ease', // Smooth transition
    },
  },
  sliderImagess: {

    width: '100%', // Adjust size as needed

    height: 'auto',
    border: '2px', // Add border
    borderRadius: '8px', // Optional: rounded corners
    userSelect: 'none', // Prevent text selection
    cursor: 'pointer', // Show pointer cursor on hover
    '&:hover': {
      
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)', // Add shadow for depth
      cursor: 'pointer',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease, padding-top 0.3s ease', // Smooth transition
    },
  },
  swiperSlide: {
    paddingTop: '1rem', // Add padding to the top of each slide
    overflow: 'visible', // Ensure slide content is visible
  },

  sliderWrapper: {
    position: 'relative',
    width: '100%',

    overflow: 'visible', // Allow content to overflow
  },
  styledBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
  },
  containers: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 20px',
    backgroundColor: 'rgb(19, 20, 38)',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '100%',
  },
  tabsContainer: {
    display: 'flex',
    gap: '16px',
  },
  tabButton: {
    display: 'flex',
    alignItems: 'center',
    color: '#a0a0a0',
    cursor: 'pointer',
    '&:hover': {
      color: '#ffffff',
    },
  },
  tabButtonLabel: {
    marginLeft: '8px',
    fontSize: '14px',
    fontWeight: 500,
  },
  searchContainer: {
    width: "30vw",
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgb(10, 11, 28)',
    borderRadius: '4px',
    padding: '10px 12px',
  },
  searchInput: {
    color: '#ffffff',
    marginLeft: '8px',
    '& input::placeholder': {
      color: '#a0a0a0',
    },
  },



  controlsContainer: {
    position: 'absolute',
    top: '50%',
    left: '0',
    right: '0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transform: 'translateY(-50%)',
    padding: '0 2rem', // Adjust space for buttons
    pointerEvents: 'none', // Allow clicks to pass through
  },

  swiperSlides: {

    overflow: 'visible', // Ensure slide content is visible
    paddingTop: '1rem', // Add padding to the top of each slide

    '& img': {

      height: '12rem', // Maintain aspect ratio
      maxHeight: '100%', // Ensure image does not overflow slide
      objectFit: 'cover', // Cover the container without distortion
      transition: 'transform 0.3s ease-in-out',
      '&:hover': {
        cursor: 'pointer',
        transform: '.15s cubic-bezier(.4,0,.2,1)', // Slight zoom effect on hover
      },
    },

  },


  sliderImageS: {
    border: '2px', // Add border
    borderRadius: '8px', // Optional: rounded corners
    userSelect: 'none', // Prevent text selection
    cursor: 'pointer', // Show pointer cursor on hover
  
    width: '100%',
    height: '100%', // Maintain aspect ratio
    maxHeight: '100%', // Ensure image does not overflow slide
    objectFit: 'cover', // Cover the container without distortion

    boxSizing: 'border-box', // Ensure padding does not affect width/height
  
    transition: 'transform 0.3s ease, box-shadow 0.3s ease, padding-top 0.3s ease', // Smooth transitions for hover effects
    marginLeft: "auto",
    marginRight: "auto",

    '&:hover': {
      
      transform: 'scale(1.05) translateY(-5px) ', // Slight zoom-in effect and move upwards
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)', // Add shadow for depth
      cursor: 'pointer',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease, padding-top 0.3s ease', // Smooth transition
    },
  },
  

  navigationButton: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '50%',
    padding: '8px',
    cursor: 'pointer',
  },
  prevButton: {
    left: '-40px', // Adjust as needed
  },
  nextButton: {
    right: '-40px', // Adjust as needed
  },


  create: {
    backgroundColor: "hsl(215, 75%, 50%) !important",
    borderColor: "#3386c9",
    boxShadow: "0 1.5px #191e24",
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: ".1em",
    padding: "0 2rem",
    textTransform: "capitalize",
    [theme.breakpoints.down("sm")]: {
      //display: "none",
      padding: "6px 16px",
    },
    "&:hover": {
      backgroundColor: "#3386c9",
    },
  },

  counterup: {
    color: "#9d9d9d",
    fontFamily: "Rubik",
    fontSize: "14px",
    fontWeight: 400,
    letterSpacing: ".005em",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    color: "#5f6368",
    fontFamily: "Rubik",
    fontSize: "14px",
    fontWeight: 400,
    letterSpacing: ".005em",
    "& h1": {
      margin: "0 0 2rem 0",
      color: "#e0e0e0",
      fontFamily: "Rubik",
      fontSize: "22px",
      fontWeight: 500,
      letterSpacing: ".005em",
      [theme.breakpoints.down("xs")]: {
        fontSize: "16px",
        margin: "0px",
      },
      [theme.breakpoints.down("sm")]: {
        fontSize: "16px",
        margin: "0px",
      },
      [theme.breakpoints.down("md")]: {
        fontSize: "16px",
        margin: "0px",
      },
    },
    "& b": {
      color: "#9d9d9d",
      fontFamily: "Rubik",
      fontSize: "16px",
      fontWeight: 500,
      letterSpacing: ".005em",
    },
  },
  animationnetworkwrapper1: {
    marginRight: "auto",
    marginTop: "16px",
    fontSize: "14px",
    color: "#505b65",
    [theme.breakpoints.down("sm")]: {
    },
  },
  animationnetworkwrapper: {
    color: "rgb(76, 175, 80)",
    borderRadius: "100%",
    animation: "blink 1.6s linear infinite",
    marginRight: "2px",
    [theme.breakpoints.down("sm")]: {
    },
  },
  animationnetwork: {
    color: "rgb(76, 175, 80)",
    borderRadius: "100%",
    [theme.breakpoints.down("sm")]: {
    },
  },
  games: {
    display: 'grid',
            gap: theme.spacing(2),
    justifyContent: 'center',
    gridGap: "12px",
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: 'repeat(auto-fill, minmax(156px, 1fr))',
    },
    // For PC
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    },
  },

  game: {
    cursor: 'pointer',
    '&:hover': {
      // Apply hover effect if needed
      // Example: background: 'lightgray',
    },
  },
  gamesimagesnew: {
    background: 'green',
    padding: '5px',
    color: 'white',
    textAlign: 'center',
    
  },
  gamesimages: {
    width: '100%',
    aspectRatio: '1 / 0.6',
    borderRadius: '10px',
    color: 'white',
    textDecoration: 'none',
    fontSize: '24px',
    transition: 'transform 0.2s ease 0s',
    position: 'relative',
    transform: 'scale(1)',
    backgroundImage: "url('https://solanastars.com/stuff-1.png')",
    backgroundSize: 'cover',
    maxHeight: '100%',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: '0',
    flexShrink: '0',
    fontWeight: 'bold',
    backgroundPosition: 'center', // Center the background image
    padding: '4px',
    border: '4px solid #0a0b1c', // Adding border with specified color

    '&:hover': {
      cursor: 'pointer',
      transform: 'translateY(-10px) scale(1.02)',
    },
    animation: '$backgroundMovement 10s infinite alternate', // Applying animation
  },
  '@keyframes backgroundMovement': {
    '0%': {
      backgroundPosition: '-100px 200px',
    },
    '100%': {
      backgroundPosition: '200pxx -200px',
    },
  },


  rewards: {
    display: "grid",
    gridGap: "12px",
    outline: "none",
    gridTemplateColumns: "repeat(auto-fill,minmax(164px,1fr))",
    [theme.breakpoints.down("xs")]: {
      gridTemplateColumns: "repeat(auto-fill,minmax(120px,1fr))",
    },
    [theme.breakpoints.down("sm")]: {
      gridTemplateColumns: "repeat(auto-fill,minmax(120px,1fr))",
    },
    [theme.breakpoints.down("md")]: {
      gridTemplateColumns: "repeat(auto-fill,minmax(120px,1fr))",
    },
  },
  sliderContainer: {
    width: "100%",
    height: "100%",
    position: 'relative',
    overflow: 'visible',
    //  padding: '0.5rem',
     marginBottom: '1.25rem', // Add margin to create space between sliders
    [theme.breakpoints.down('sm')]: {
      padding: '0', // Remove padding for mobile devices
    },
  },
  arrowContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    position: 'relative',
  },

  textContainer: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    marginTop: '0.5rem', // Move text up by adjusting margin
    [theme.breakpoints.down("xs")]: {
      marginTop: '0rem', // Move text up by adjusting margin
    },
  },
  svgIcon: {
    width: '100%',
    height: '100%',
    marginRight: '10px',
    background: 'hsl(251.31deg, 75%, 50%)',

    color: 'hsl(251.31deg, 75%, 50%)',
  },
  textLabel: {
    flex: "none",
    fontFamily: "'Poppins', sans-serif",
    border: "none",
    cursor: "pointer",
    alignItems: "center",
    fontWeight: 500,
    userSelect: "none",
    whiteSpace: "nowrap",
    willChange: "opacity",
    borderRadius: "0.25rem",
    justifyContent: "center",
    transition: "background-color 0.3s ease, transform 0.2s ease",
    color: "#fff",
    fontSize: "1.25rem",
    [theme.breakpoints.down("xs")]: {
      fontSize: "1.15rem",
    },

    '&:hover': {
      // backgroundColor: '#2a2b45', // Change to a different shade for hover
      transform: 'scale(1.02)',  // Slightly larger scale on hover
    },
    '&:active': {
      // backgroundColor: '#202135', // Slightly darker on click
      transform: 'scale(0.98)',  // Slightly smaller scale on click, reduce blur
    },
    '&:focus': {
      outline: 'none', // Remove outline for focused state
    }
  },


  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end', // Align buttons to the end
    gap: '0.5rem', // Space between buttons
    position: 'relative', // Allow top adjustment
    // top: '-10px', // Adjust vertical position
  },
  viewAllButton: {
    flex: "none",
    fontFamily: "Poppins",    
    border: "none",
    cursor: "pointer",
    height: "2.25rem",
    display: "inline-flex",
    outline: "none",
    padding: "0 1rem",
    position: "relative",
    alignItems: "center",
    fontWeight: 500,
    userSelect: "none",
    whiteSpace: "nowrap",
    willChange: "opacity",
    borderRadius: "0.25rem",
    justifyContent: "center",
    transition: "background-color 0.3s ease, transform 0.2s ease",
    color: "#9E9FBD",
    fontSize: "0.895rem",
    backgroundColor: "#1a1b33",
    '&:hover': {
      backgroundColor: '#2a2b45', // Change to a different shade for hover
      transform: 'scale(1.02)',  // Slightly larger scale on hover
    },
    '&:active': {
      backgroundColor: '#202135', // Slightly darker on click
      transform: 'scale(0.98)',  // Slightly smaller scale on click, reduce blur
    },
    '&:focus': {
      outline: 'none', // Remove outline for focused state
    }
  },
  arrowLeft: {
    flex: "none",
    fontFamily: "Poppins",    
    border: "none",
    cursor: "pointer",
    height: "2.25rem",
    display: "inline-flex",
    outline: "none",
    padding: "0 1rem",
    position: "relative",
    alignItems: "center",
    fontWeight: 500,
    userSelect: "none",
    whiteSpace: "nowrap",
    willChange: "opacity",
    borderRadius: "0.25rem",
    justifyContent: "center",
    transition: "background-color 0.3s ease, transform 0.2s ease",
    color: "#9E9FBD",
    fontSize: "0.895rem",
    backgroundColor: "#1a1b33",
    '&:hover': {
      backgroundColor: '#2a2b45', // Change to a different shade for hover
      transform: 'scale(1.02)',  // Slightly larger scale on hover
    },
    '&:active': {
      backgroundColor: '#202135', // Slightly darker on click
      transform: 'scale(0.98)',  // Slightly smaller scale on click, reduce blur
    },
    '&:focus': {
      outline: 'none', // Remove outline for focused state
    }
  },
  arrowRight: {
    flex: "none",
    fontFamily: "Poppins",    
    border: "none",
    cursor: "pointer",
    height: "2.25rem",
    display: "inline-flex",
    outline: "none",
    padding: "0 1rem",
    position: "relative",
    alignItems: "center",
    fontWeight: 500,
    userSelect: "none",
    whiteSpace: "nowrap",
    willChange: "opacity",
    borderRadius: "0.25rem",
    justifyContent: "center",
    transition: "background-color 0.3s ease, transform 0.2s ease",
    color: "#9E9FBD",
    fontSize: "0.895rem",
    backgroundColor: "#1a1b33",
    '&:hover': {
      backgroundColor: '#2a2b45', // Change to a different shade for hover
      transform: 'scale(1.02)',  // Slightly larger scale on hover
    },
    '&:active': {
      backgroundColor: '#202135', // Slightly darker on click
      transform: 'scale(0.98)',  // Slightly smaller scale on click, reduce blur
    },
    '&:focus': {
      outline: 'none', // Remove outline for focused state
    }
  },
  darkenedOverlayContainer: {
    position: 'absolute',
    filter: 'brightness(0.3)', // Darken the unavailable games
    transition: 'filter 0.3s ease',
  },
  availableGame: {
    position: 'relative', // Available games (like Dice and Limbo) without darkening
  },

  overlay: {
    position: 'absolute',
    top: '22px',
    right: '26px',
    backgroundColor: 'rgb(101, 0, 251)', // Black background with opacity
    color: 'white',
    padding: '4px 10px',
    borderRadius: '5px',
    fontSize: '10px',
    fontWeight: 'bold',
  },
  overlayText: {
    whiteSpace: 'nowrap',
  },



  reward: {
    width: "100%",
    height: "100%",
    aspectRatio: "245/120",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    position: "relative",
    background: "linear-gradient(180deg,#0a0b1c,#0a0b1c)",
    borderRadius: "10px",
    transition: ".2s",
    WebkitUserSelect: "none",
    MozUserSelect: "none",
    userSelect: "none",
    overflow: "hidden",
    fontWeight: 600,
    border: "none",
    "& svg": {
      color: "#5b6368",
    },
    "&:hover": {
      background: "linear-gradient(rgb(27 45 61),#0b77c833)",
      cursor: "pointer",
      "& svg": {
        color: "#1982d1",
      },
    },
  },
  rewardname: {
    color: "#e0e0e0",
    fontSize: "16px",
    fontWeight: "500",
    fontFamily: "Rubik",
    textTransform: "uppercase",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gridGap: "4vw",
    [theme.breakpoints.down("xs")]: {
      display: "grid",
    },
    [theme.breakpoints.down("sm")]: {
      display: "grid",
    },
    [theme.breakpoints.down("md")]: {
      display: "grid",
    },
  },
  headerleft: {
    display: "flex",
    flexDirection: "column",
    gridGap: "4px",
  },
  carouselItem: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflowX: "auto",
    whiteSpace: "nowrap",
    padding: "10px",
  },
  imgCustom: {
    display: "inline-block",
    width: "33%",
    margin: "0 5px",
  },


  headerright: {
    display: "flex",
    alignItems: "center",
    gridGap: "20px",
    margin: "0 0 2rem 0",
    [theme.breakpoints.down("xs")]: {
      gridGap: "10px",
    },
    [theme.breakpoints.down("sm")]: {
      gridGap: "10px",
    },
    [theme.breakpoints.down("md")]: {
      gridGap: "10px",
    },
  },
  svgIcon: {
    left: '0', // Align SVG to the left
    marginBottom: "0.1rem",
    bottom: '0', // Align SVG to the bottom
    width: '2.5rem', // Adjust size as needed
    height: '1.5rem', // Adjust size as needed
    fill: 'hsl(251.31deg 44.74% 45.26%)', // Adjust color as needed
  },

  headerbuttons: {
    display: "flex",
    alignItems: "center",
    gridGap: "16px",
    [theme.breakpoints.down("xs")]: {
      gridGap: "10px",
    },
    [theme.breakpoints.down("sm")]: {
      gridGap: "10px",
    },
    [theme.breakpoints.down("md")]: {
      gridGap: "10px",
    },
  },
  headerseperator: {
    width: "1px",
    height: "40px",
  },
  headeruser: {
    //backgroundColor: "#242b33",

    display: "flex",
    alignItems: "center",
    gridGap: "16px",
    borderRadius: "5px",
    padding: "6px 8px",
    margin: "-6px -8px",
    color: "#5b6368",
    [theme.breakpoints.down("xs")]: {
      gridGap: "10px",
    },
    [theme.breakpoints.down("sm")]: {
      gridGap: "10px",
    },
    [theme.breakpoints.down("md")]: {
      gridGap: "10px",
    },
  },
  headerbuttonsDep: {
    width: "fit-content",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    color: "#fff",
    outline: "none",
    padding: "5px 20px",
    borderRadius: "5px",
    transform: "translateZ(0)",
    backgroundColor: "#FFC440",
    fontFamily: "Rubik",
    fontSize: "15px",
    border: "none",
    cursor: "pointer",
    transition: ".2s",
    [theme.breakpoints.down("xs")]: {
      padding: "4px 10px",
      fontSize: "12px",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "4px 10px",
      fontSize: "12px",
    },
    [theme.breakpoints.down("md")]: {
      padding: "4px 10px",
      fontSize: "12px",
    },
    "&:hover": {
      backgroundColor: "#41a8fa",
    },
  },
  headerbuttonsDepSpan: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    whiteSpace: "nowrap",
    position: "relative",
    WebkitUserSelect: "none",
    MozUserSelect: "none",
    userSelect: "none",
    gridGap: "8px",
    [theme.breakpoints.down("xs")]: {
      gridGap: "5px",
    },
    [theme.breakpoints.down("sm")]: {
      gridGap: "5px",
    },
    [theme.breakpoints.down("md")]: {
      gridGap: "5px",
    },
  },
  headerbuttonsWith: {
    width: "fit-content",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    outline: "none",
    color: "#fff",
    padding: "5px 20px",
    borderRadius: "5px",
    transform: "translateZ(0)",
    backgroundColor: "#bb2f2a",
    fontFamily: "Rubik",
    fontSize: "15px",
    border: "none",
    cursor: "pointer",
    transition: ".2s",
    [theme.breakpoints.down("xs")]: {
      padding: "4px 10px",
      fontSize: "12px",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "4px 10px",
      fontSize: "12px",
    },
    [theme.breakpoints.down("md")]: {
      padding: "4px 10px",
      fontSize: "12px",
    },
    "&:hover": {
      backgroundColor: "#c9433e",
    },
  },
  headerbuttonsWithSpan: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    whiteSpace: "nowrap",
    position: "relative",
    WebkitUserSelect: "none",
    MozUserSelect: "none",
    userSelect: "none",
    gridGap: "8px",
    [theme.breakpoints.down("xs")]: {
      gridGap: "5px",
    },
    [theme.breakpoints.down("sm")]: {
      gridGap: "5px",
    },
    [theme.breakpoints.down("md")]: {
      gridGap: "5px",
    },
  },
  headerbuttonsLogin: {
    width: "fit-content",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    color: "#fff",
    padding: "11px 20px",
    borderRadius: "5px",
    transform: "translateZ(0)",
    backgroundColor: "#FFC440",
    fontFamily: "Rubik",
    fontSize: "15px",
    border: "none",
    cursor: "pointer",
    transition: ".2s",
    "&:hover": {
      backgroundColor: "#409fea",
    },
  },
  avatar: {
    width: "35px",
    height: "35px",
    position: "relative",
    padding: "2px",
    borderRadius: "50%",
    backgroundColor: "#333b42",
    flexShrink: 0,
  },
  avatarimg: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
  },
  avatarimg2: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    position: "relative",
    WebkitUserDrag: "none",
  },
  level: {
    width: "23px",
    height: "23px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: "-2px",
    bottom: "-2px",
    color: "#fff",
    fontSize: "9px",
    fontWeight: "500",
    backgroundColor: "#333b42",
    border: "1px solid #242b33",
    borderRadius: "50px",
    paddingTop: "2px",
  },
  userinfo: {
    display: "flex",
    flexDirection: "column",
    gridGap: "4px",
    [theme.breakpoints.down("xs")]: {
      fontSize: "13px",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "13px",
    },
    [theme.breakpoints.down("md")]: {
      fontSize: "13px",
    },
  },
  username: {
    color: "#a4aaae",
  },
  balances: {
    display: "flex",
    alignItems: "center",
    gridGap: "8px",
    color: "#fff",
  },
  coins: {
    display: "flex",
    alignItems: "center",
    gridGap: "4px",
  },
  dollarsign: {
    color: "#FFC440",
    fontWeight: 800,
  },
}));

const Main = ({ isAuthenticated, isLoading, user }) => {
  // Declare State
  const classes = useStyles();
  const [isDLCurrency, setIsDLCurrency] = useState(true);

  const handleClick = () => {
    setIsDLCurrency(!isDLCurrency);
  };

  const [loading, setLoading] = useState(true);
  const [vipData, setVipData] = useState(null);
  const [openMarket, setOpenMarket] = useState(false);
  const [openDeposit, setOpenDeposit] = useState(false);
  const [openVip, setOpenVip] = useState(false);
  const [openFree, setOpenFree] = useState(false);
  const [openCoupon, setOpenCoupon] = useState(false);
  const [openTriviaInfo, setOpenTriviaInfo] = useState(false);
  const [openRainInfo, setOpenRainInfo] = useState(false);
  const [vipDataColor, setVipDataColor] = useState(null);

  const [usersOnline, setUsersOnline] = useState("Connected");
  const swiperRef = useRef(null);
  const swiperRef2 = useRef(null);
  const swiperRef3 = useRef(null);
  const swiperRef4 = useRef(null);
  const swiperRef5 = useRef(null);

  const history = useHistory();

  // Update users online count
  const updateUsersOnline = newCount => {
    setUsersOnline(newCount + " online");
  };

  // componentDidMount
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isAuthenticated) {
          setLoading(true);
          const data = await getUserVipData();
          // Update state
          setVipData(data);
          const currentMajorLevel = data.majorLevelNames.find((levelName, index) => {
            const currentLevelIndex = data.allLevels.findIndex((level) => level.name === data.currentLevel.name);
            const nextIndex = data.allLevels.findIndex((level) => level.levelName === data.majorLevelNames[index + 1]);
            if (currentLevelIndex >= index && (nextIndex === -1 || currentLevelIndex < nextIndex)) {
              return true;
            }
            return false;
          });
          const currentMajorLevelIndex = data.majorLevelNames.indexOf(currentMajorLevel);
          setVipDataColor(data.majorLevelColors[currentMajorLevelIndex]);
        }
        setLoading(false);
      } catch (error) {
        console.log("There was an error while loading user vip data:", error);
      }
    };
    fetchData();
    // Listeners
    chatSocket.on("users-online", updateUsersOnline);

    // componentDidUnmount
    return () => {
      // Remove listeners
      chatSocket.off("users-online", updateUsersOnline);
    };
  }, [isAuthenticated]);

  const handleOriginalsViewAll = () => {
    history.push('/originals');
  };

  const handleSlotsViewAll = () => {
    history.push('/slots');
  };

  const handleLiveCasinoViewAll = () => {
    history.push('/live');
  };

  const handleGameShowsViewAll = () => {
    history.push('/gameshows');
  };

  return (
    <Box className={classes.root}>
      <Grow in timeout={430}>
        <Container className={classes.container}>
          <Market handleClose={() => setOpenMarket(!openMarket)} open={openMarket} user={user} />
          <Deposit handleClose={() => setOpenDeposit(!openDeposit)} open={openDeposit} user={user} />
          <Vip handleClose={() => setOpenVip(!openVip)} open={openVip} />
          <Free handleClose={() => setOpenFree(!openFree)} open={openFree} />
          <Coupon handleClose={() => setOpenCoupon(!openCoupon)} open={openCoupon} />
          <TriviaInfo handleClose={() => setOpenTriviaInfo(!openTriviaInfo)} open={openTriviaInfo} />
          <RainInfo handleClose={() => setOpenRainInfo(!openRainInfo)} open={openRainInfo} />
          <Box className={classes.animationnetworkwrapper1}>
            {/* <p><span className={classes.animationnetworkwrapper}><span className={classes.animationnetwork}>●</span></span> {usersOnline}</p> */}
          </Box>
          <Box className={classes.header}>
          </Box>
          {isLoading ? (
            <Box></Box>
          ) : (

            <div className={classes.sliderContainer}>
            <Swiper
              spaceBetween={10} // Space between slides
              slidesPerView={3} // Number of slides to show at a time
              loop={true} // Loop the slides
              navigation // Add navigation arrows
              modules={[Navigation, EffectCards]} // Include modules
              breakpoints={{
                320: {
                  slidesPerView: 1,
                },
                768: {
                  slidesPerView: 3,
                },
                1024: {
                  slidesPerView: 3,
                },
                1440: {
                  slidesPerView: 3,
                },
              }}
            >
              <SwiperSlide>
                <a href="https://t.me/betfungg" target="_blank" rel="noopener noreferrer">
                  <div className={classes.slideContent}>
                    <img
                      className={classes.sliderImagess}
                      src="/banner-1.jpg"
                      alt="First slide"
                    />
                  </div>
                </a>
              </SwiperSlide>
              <SwiperSlide>
                <a href="/affiliates">
                  <div className={classes.slideContent}>
                    <img
                      className={classes.sliderImagess}
                      src="/banner-2.jpg"
                      alt="Second slide"
                    />
                  </div>
                </a>
              </SwiperSlide>
              <SwiperSlide>
                <a href="/race">
                  <div className={classes.slideContent}>
                    <img
                      className={classes.sliderImagess}
                      src="/banner-3.jpg"
                      alt="Third slide"
                    />
                  </div>
                </a>
              </SwiperSlide>
            </Swiper>
          </div>
      
            
                                        
          )}
    {/* <Box className={classes.styledBox}>
      <Box
        component={motion.div}
        className={classes.containers}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box className={classes.tabsContainer}>
          <motion.div
            className={classes.tabButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Home size={18} />
            <span className={classes.tabButtonLabel}>Lobby</span>
          </motion.div>
          <motion.div
            className={classes.tabButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Star size={18} />
            <span className={classes.tabButtonLabel}>Originals</span>
          </motion.div>
          <motion.div
            className={classes.tabButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Gamepad2 size={18} />
            <span className={classes.tabButtonLabel}>Slots</span>
          </motion.div>
          <motion.div
            className={classes.tabButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Video size={18} />
            <span className={classes.tabButtonLabel}>Live Casino</span>
          </motion.div>
          <motion.div
            className={classes.tabButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LayoutGrid size={18} />
            <span className={classes.tabButtonLabel}>Table Games</span>
          </motion.div>
        </Box>

        <motion.div
          className={classes.searchContainer}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Search size={18} color="#a0a0a0" />
          <InputBase
            placeholder="Search"
            className={classes.searchInput}
            fullWidth
          />
        </motion.div>
      </Box>
    </Box> */}


          {/* <br /> */}

    {/* <div className={classes.sliderContainer}>
      <div className={classes.arrowContainer}>
        <div className={classes.textContainer}>
          <svg
            fill="currentColor"
            viewBox="0 0 64 64"
            className={classes.svgIcon}
            aria-hidden="true"
          >
            <path d="M7.36 42.39c1-12.78 14.728-25.29 17.926-29.976 2.778-4.206 1.719-9.203.83-11.4a.78.78 0 0 1 .893-1h-.004c13.889 2.918 14.588 13.48 14.168 18.206-.42 4.726.42 7.913 3.478 7.224 3.057-.69 2.028-8.443 2.028-8.443s14.039 16.676 8.893 33.073c-2.588 8.574-9.033 12.19-14.449 13.89-.28.14-.56-.14-.56-.55.7-2.638 2.509-4.726 3.058-7.644 1.12-4.796-3.327-9.213-6.624-11.71-2.063-1.538-3.386-3.97-3.386-6.712 0-.127.002-.255.008-.381v.018c0-.28-.42-.42-.55-.28a90.106 90.106 0 0 1-6.652 7.202l-.022.022c-5.136 5.696-7.784 12.09-3.197 19.175.14.28-.14.69-.41.56C11.387 60.596 6.67 51.973 7.36 42.39Z"></path>
          </svg>
          <span className={classes.textLabel}>Originals</span>
        </div>
        <div className={classes.buttonContainer}>
          <button className={classes.viewAllButton}>View All</button>
          <button
            className={classes.arrowLeft}
            onClick={() => swiperRef2.current.swiper.slidePrev()}
          >
            &lt;
          </button>
          <button
            className={classes.arrowRight}
            onClick={() => swiperRef2.current.swiper.slideNext()}
          >
            &gt;
          </button>
        </div>
      </div>
      <Swiper
        ref={swiperRef2}
        spaceBetween={10}
        slidesPerView={8}
        loop={true}
        navigation={false}
        modules={[Navigation]}
        breakpoints={{
          320: {
            slidesPerView: 3,
          },
          768: {
            slidesPerView: 4,
          },
          1024: {
            slidesPerView: 6,
          },
          1440: {
            slidesPerView: 8,
          },
        }}
      >
        <SwiperSlide className={classes.swiperSlides}>
          <motion.img
            className={classes.sliderImageS}
            src="https://runeace.com/img/games/case-battles.png?19"
            alt="case battle"
            transition={{ duration: 0.3 }}
          />
        </SwiperSlide>
        <SwiperSlide className={classes.swiperSlides}>
          <motion.img
            className={classes.sliderImageS}
            src="https://runeace.com/img/games/cases.png?19"
            alt="case"
            transition={{ duration: 0.1 }}
          />
        </SwiperSlide>
        <SwiperSlide className={classes.swiperSlides}>
          <motion.img
            className={classes.sliderImageS}
            src="https://runeace.com/img/games/slots.png?19"
            alt="Slots"
            transition={{ duration: 0.3 }}
          />
        </SwiperSlide>
        <SwiperSlide className={classes.swiperSlides}>
          <motion.img
            className={classes.sliderImageS}
            src="https://runeace.com/img/games/limbo.png?19"
            alt="Limbo"
            transition={{ duration: 0.3 }}
          />
        </SwiperSlide>
        <SwiperSlide className={classes.swiperSlides}>
          <motion.img
            className={classes.sliderImageS}
            src="https://runeace.com/img/games/mines.png?19"
            alt="Limbo"
            transition={{ duration: 0.3 }}
          />
        </SwiperSlide>
        <SwiperSlide className={classes.swiperSlides}>
          <motion.img
            className={classes.sliderImageS}
            src="https://runeace.com/img/games/roulette.png?19"
            alt="Roulette"
            transition={{ duration: 0.3 }}
          />
        </SwiperSlide>
        <SwiperSlide className={classes.swiperSlides}>
          <motion.img
            className={classes.sliderImageS}
            src="https://runeace.com/img/games/dice.png?19"
            alt="Dice"
            transition={{ duration: 0.3 }}
          />
        </SwiperSlide>
        <SwiperSlide className={classes.swiperSlides}>
          <motion.img
            className={classes.sliderImageS}
            src="https://runeace.com/img/games/keno.png?19"
            alt="Keno"
            transition={{ duration: 0.3 }}
          />
        </SwiperSlide>        <SwiperSlide className={classes.swiperSlides}>
          <motion.img
            className={classes.sliderImageS}
            src="https://runeace.com/img/games/crash.png?19"
            alt="Crash"
            transition={{ duration: 0.3 }}
          />
        </SwiperSlide>
      </Swiper>
    </div> */}


<div className={classes.sliderContainer}>
      <div className={classes.arrowContainer}>
        <motion.div className={classes.textContainer} whileTap={{ scale: 0.95 }}>
          <motion.img
            src="https://shuffle.com/icons/original.svg"
            alt="Original Icon"
            className={classes.svgIcon}
            whileTap={{ scale: 0.95 }}
          />
          <motion.span className={classes.textLabel}>Originals</motion.span>
        </motion.div>

        <div className={classes.buttonContainer}>
          <button 
            className={classes.viewAllButton} 
            onClick={handleOriginalsViewAll}
          >
            View All
          </button>

          <motion.div>
            <button
              className={classes.arrowLeft}
              onClick={() => swiperRef2.current.swiper.slidePrev()}
            >
              &lt;
            </button>
          </motion.div>

          <motion.div>
            <button
              className={classes.arrowRight}
              onClick={() => swiperRef2.current.swiper.slideNext()}
            >
              &gt;
            </button>
          </motion.div>
        </div>
      </div>

      <Swiper
        ref={swiperRef2}
        spaceBetween={10}
        slidesPerView={8}
        loop={false}
        navigation={false}
        breakpoints={{
          320: {
            slidesPerView: 3,
          },
          768: {
            slidesPerView: 4,
          },
          1024: {
            slidesPerView: 6,
          },
          1440: {
            slidesPerView: 8,
          },
        }}
      >
        {/* Available games */}
        <SwiperSlide className={classes.swiperSlides}>
  <Link to="/dice">  {/* Use Link for internal routing */}
    <motion.div className={classes.availableGame}>
      <motion.img
        className={classes.sliderImageS}
        src="https://qbot.gg/wp-content/uploads/2023/06/7_Dice.png"
        alt="Dice"
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  </Link>
</SwiperSlide>

<SwiperSlide className={classes.swiperSlides}>
  <Link to="/limbo">  {/* Use Link for internal routing */}
    <motion.div className={classes.availableGame}>
      <motion.img
        className={classes.sliderImageS}
        src="https://qbot.gg/wp-content/uploads/2023/06/18_Limbo.png"
        alt="Limbo"
        transition={{ duration: 0.1 }}
      />
    </motion.div>
  </Link>
</SwiperSlide>

<SwiperSlide className={classes.swiperSlides}>
  <Link to="/crash">  {/* Use Link for internal routing */}
    <motion.div className={classes.availableGame}>
      <motion.img
        className={classes.sliderImageS}
        src="https://qbot.gg/wp-content/uploads/2023/06/11_Crash.png"
        alt="Crash"
        transition={{ duration: 0.1 }}
      />
    </motion.div>
  </Link>
</SwiperSlide>


        <SwiperSlide className={classes.swiperSlides}>
          <motion.div className={classes.darkenedOverlayContainer}>
            <motion.img
              className={classes.sliderImageS}
              src="https://qbot.gg/wp-content/uploads/2023/06/1_Plinko.png"
              alt="Plinko"
              transition={{ duration: 0.1 }}
            />
            <div className={classes.notAvailableOverlay}>Not Available Yet</div>
          </motion.div>
        </SwiperSlide>

        <SwiperSlide className={classes.swiperSlides}>
          <motion.div className={classes.darkenedOverlayContainer}>
            <motion.img
              className={classes.sliderImageS}
              src="https://qbot.gg/wp-content/uploads/2023/06/10_Keno.png"
              alt="Keno"
              transition={{ duration: 0.1 }}
            />
            <div className={classes.notAvailableOverlay}>Not Available Yet</div>
          </motion.div>
        </SwiperSlide>

        <SwiperSlide className={classes.swiperSlides}>
          <motion.div className={classes.darkenedOverlayContainer}>
            <motion.img
              className={classes.sliderImageS}
              src="https://qbot.gg/wp-content/uploads/2023/06/12_Mines.png"
              alt="Mines"
              transition={{ duration: 0.1 }}
            />
            <div className={classes.notAvailableOverlay}>Not Available Yet</div>
          </motion.div>
        </SwiperSlide>

        <SwiperSlide className={classes.swiperSlides}>
          <motion.div className={classes.darkenedOverlayContainer}>
            <motion.img
              className={classes.sliderImageS}
              src="https://qbot.gg/wp-content/uploads/2023/06/9_hilo.png"
              alt="Hilo"
              transition={{ duration: 0.3 }}
            />
            <div className={classes.notAvailableOverlay}>Not Available Yet</div>
          </motion.div>
        </SwiperSlide>

        <SwiperSlide className={classes.swiperSlides}>
          <motion.div className={classes.darkenedOverlayContainer}>
            <motion.img
              className={classes.sliderImageS}
              src="https://qbot.gg/wp-content/uploads/2023/06/13_Roulette.png"
              alt="Roulette"
              transition={{ duration: 0.3 }}
            />
            <div className={classes.notAvailableOverlay}>Not Available Yet</div>
          </motion.div>
        </SwiperSlide>
      </Swiper>

</div>





          <div className={classes.sliderContainer}>
      <div className={classes.arrowContainer}>
      <motion.div
      className={classes.textContainer}
      whileTap={{ scale: 0.95 }} // Motion animation on tap/click
    >
      <motion.img
        src="https://shuffle.com/icons/slots.svg" // Use image URL instead of SVG
        alt="Slots Icon"
        className={classes.svgIcon} // You can reuse the same class for styling
        whileTap={{ scale: 0.95 }} // Tap effect for the image

      />
      <motion.span className={classes.textLabel}>
        Slots
      </motion.span>
    </motion.div>
        <div className={classes.buttonContainer}>
          <button 
            className={classes.viewAllButton} 
            onClick={handleSlotsViewAll}
          >
            View All
          </button>
          <button
            className={classes.arrowLeft}
            onClick={() => swiperRef.current.swiper.slidePrev()}
          >
            &lt;
          </button>
          <button
            className={classes.arrowRight}
            onClick={() => swiperRef.current.swiper.slideNext()}
          >
            &gt;
          </button>
        </div>
      </div>
      <Swiper
        ref={swiperRef}
        spaceBetween={10}
        slidesPerView={8}
        loop={true}
        navigation={false} // Disable default navigation
        modules={[Navigation]}
        breakpoints={{
          320: {
            slidesPerView: 3,
          },
          768: {
            slidesPerView: 4,
          },
          1024: {
            slidesPerView: 6,
          },
          1440: {
            slidesPerView: 8,
          },
        }}

      >
        <SwiperSlide className={classes.swiperSlide}>
          <img
            className={classes.sliderImageS}
            src="https://cdn2.softswiss.net/i/s6/pragmaticexternal/SweetBonanza.webp"
            alt="Sweet Bonanza"
            onClick={() => history.push('/slots/pragmaticexternal/SweetBonanza')}
          />
        </SwiperSlide>
        <SwiperSlide className={classes.swiperSlide}>
          <img
            className={classes.sliderImageS}
            src="https://cdn2.softswiss.net/i/s6/softswiss/BeerBonanza.webp"
            alt="Beer Bonanza"
            onClick={() => history.push('/slots/softswiss/BeerBonanza')}
          />
        </SwiperSlide>
        <SwiperSlide className={classes.swiperSlide}>
          <img
            className={classes.sliderImageS}
            src="https://cdn2.softswiss.net/i/s6/hacksaw/WantedDeadoraWild.webp"
            alt="Wanted Dead or a Wild"
            onClick={() => history.push('/slots/hacksaw/WantedDeadoraWild')}
          />
        </SwiperSlide>
        <SwiperSlide className={classes.swiperSlide}>
          <img
            className={classes.sliderImageS}
            src="https://cdn2.softswiss.net/i/s6/pragmaticexternal/GatesofOlympus1000.webp"
            alt="Gates of Olympus 1000"
            onClick={() => history.push('/slots/pragmaticexternal/GatesofOlympus1000')}
          />
        </SwiperSlide>
        <SwiperSlide className={classes.swiperSlide}>
          <img
            className={classes.sliderImageS}
            src="https://cdn2.softswiss.net/i/s6/pragmaticexternal/SugarRush1000.webp"
            alt="Sugar Rush 1000"
            onClick={() => history.push('/slots/pragmaticexternal/SugarRush1000')}
          />
        </SwiperSlide>
        <SwiperSlide className={classes.swiperSlide}>
          <img
            className={classes.sliderImageS}
            src="https://cdn2.softswiss.net/i/s6/hacksaw/ZeZeus94.webp"
            alt="Ze Zeus"
            onClick={() => history.push('/slots/hacksaw/ZeZeus94')}
          />
        </SwiperSlide>
        <SwiperSlide className={classes.swiperSlide}>
          <img
            className={classes.sliderImageS}
            src="https://cdn2.softswiss.net/i/s6/hacksaw/DorkUnit.webp"
            alt="Dork Unit"
            onClick={() => history.push('/slots/hacksaw/DorkUnit')}
          />
        </SwiperSlide>
        <SwiperSlide className={classes.swiperSlide}>
          <img
            className={classes.sliderImageS}
            src="https://cdn2.softswiss.net/i/s6/playngo/SweetAlchemy.webp"
            alt="Sweet Alchemy"
            onClick={() => history.push('/slots/playngo/SweetAlchemy')}
          />
        </SwiperSlide>
      </Swiper>
    </div>

    {/* Live Casino Section */}
    <div className={classes.sliderContainer}>
      <div className={classes.arrowContainer}>
        <motion.div className={classes.textContainer} whileTap={{ scale: 0.95 }}>
          <motion.img
            src="https://shuffle.com/icons/casino.svg"
            alt="Live Casino Icon"
            className={classes.svgIcon}
            whileTap={{ scale: 0.95 }}
          />
          <motion.span className={classes.textLabel}>
            Live Casino
          </motion.span>
        </motion.div>
        <div className={classes.buttonContainer}>
          <button 
            className={classes.viewAllButton}
            onClick={handleLiveCasinoViewAll}
          >
            View All
          </button>
          <button
            className={classes.arrowLeft}
            onClick={() => swiperRef3.current.swiper.slidePrev()}
          >
            &lt;
          </button>
          <button
            className={classes.arrowRight}
            onClick={() => swiperRef3.current.swiper.slideNext()}
          >
            &gt;
          </button>
        </div>
      </div>
      <Swiper
        ref={swiperRef3}
        spaceBetween={10}
        slidesPerView={8}
        loop={true}
        navigation={false}
        modules={[Navigation]}
        breakpoints={{
          320: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 8 },
        }}
        className={classes.swiper}
      >
        <SwiperSlide className={classes.swiperSlide}>
          <img
            className={classes.sliderImageS}
            src="https://cdn2.softswiss.net/i/s6/evolution/auto_roulette_vip.webp"
            alt="Auto Roulette VIP"
            onClick={() => history.push('/slots/evolution/auto_roulette_vip')}
          />
        </SwiperSlide>
        <SwiperSlide className={classes.swiperSlide}>
          <img
            className={classes.sliderImageS}
            src="https://cdn2.softswiss.net/i/s6/evolution/lightning_roulette.webp"
            alt="Lightning Roulette"
            onClick={() => history.push('/slots/evolution/lightning_roulette')}
          />
        </SwiperSlide>
        <SwiperSlide className={classes.swiperSlide}>
          <img
            className={classes.sliderImageS}
            src="https://cdn2.softswiss.net/i/s6/evolution/LightningSicBo.webp"
            alt="Lightning Sic Bo"
            onClick={() => history.push('/slots/evolution/LightningSicBo')}
          />
        </SwiperSlide>
        <SwiperSlide className={classes.swiperSlide}>
          <img
            className={classes.sliderImageS}
            src="https://cdn2.softswiss.net/i/s6/evolution/LightningBall.webp"
            alt="Lightning Ball"
            onClick={() => history.push('/slots/evolution/LightningBall')}
          />
        </SwiperSlide>
        <SwiperSlide className={classes.swiperSlide}>
          <img
            className={classes.sliderImageS}
            src="https://cdn2.softswiss.net/i/s6/evolution/LightningStorm.webp"
            alt="Lightning Storm"
            onClick={() => history.push('/slots/evolution/LightningStorm')}
          />
        </SwiperSlide>
        <SwiperSlide className={classes.swiperSlide}>
          <img
            className={classes.sliderImageS}
            src="https://cdn2.softswiss.net/i/s6/evolution/classic_speed_blackjack_31.webp"
            alt="Classic Speed Blackjack 31"
            onClick={() => history.push('/slots/evolution/classic_speed_blackjack_31')}
          />
        </SwiperSlide>
        <SwiperSlide className={classes.swiperSlide}>
          <img
            className={classes.sliderImageS}
            src="https://cdn2.softswiss.net/i/s6/evolution/bjclassic66.webp"
            alt="Blackjack Classic 66"
            onClick={() => history.push('/slots/evolution/bjclassic66')}
          />
        </SwiperSlide>
        <SwiperSlide className={classes.swiperSlide}>
          <img
            className={classes.sliderImageS}
            src="https://cdn2.softswiss.net/i/s6/evolution/bjclassic53.webp"
            alt="Blackjack Classic 53"
            onClick={() => history.push('/slots/evolution/bjclassic53')}
          />
        </SwiperSlide>
      </Swiper>
    </div>

    {/* Game Shows Section */}
    <div className={classes.sliderContainer}>
      <div className={classes.arrowContainer}>
        <motion.div className={classes.textContainer} whileTap={{ scale: 0.95 }}>
          <motion.img
            src="https://shuffle.com/icons/table-games.svg"
            alt="Game Shows Icon"
            className={classes.svgIcon}
            whileTap={{ scale: 0.95 }}
          />
          <motion.span className={classes.textLabel}>
            Game Shows
          </motion.span>
        </motion.div>
        <div className={classes.buttonContainer}>
          <button 
            className={classes.viewAllButton}
            onClick={handleGameShowsViewAll}
          >
            View All
          </button>
          <button
            className={classes.arrowLeft}
            onClick={() => swiperRef4.current.swiper.slidePrev()}
          >
            &lt;
          </button>
          <button
            className={classes.arrowRight}
            onClick={() => swiperRef4.current.swiper.slideNext()}
          >
            &gt;
          </button>
        </div>
      </div>
      <Swiper
        ref={swiperRef4}
        spaceBetween={10}
        slidesPerView={8}
        loop={true}
        navigation={false}
        modules={[Navigation]}
        breakpoints={{
          320: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 6 },
          1440: { slidesPerView: 8 },
        }}
      >
        <SwiperSlide className={classes.swiperSlide}>
          <img
            className={classes.sliderImageS}
            src="https://cdn2.softswiss.net/i/s6/evolution/crazytime.webp"
            alt="Crazy Time"
            onClick={() => history.push('/slots/evolution/crazytime')}
          />
        </SwiperSlide>
        <SwiperSlide className={classes.swiperSlide}>
          <img
            className={classes.sliderImageS}
            src="https://cdn2.softswiss.net/i/s6/evolution/CrazyPachinko.webp"
            alt="Crazy Pachinko"
            onClick={() => history.push('/slots/evolution/CrazyPachinko')}
          />
        </SwiperSlide>
        <SwiperSlide className={classes.swiperSlide}>
          <img
            className={classes.sliderImageS}
            src="https://cdn2.softswiss.net/i/s6/evolution/lightningdice.webp"
            alt="Lightning Dice"
            onClick={() => history.push('/slots/evolution/lightningdice')}
          />
        </SwiperSlide>
        <SwiperSlide className={classes.swiperSlide}>
          <img
            className={classes.sliderImageS}
            src="https://cdn2.softswiss.net/i/s6/evolution/FunkyTime.webp"
            alt="Funky Time"
            onClick={() => history.push('/slots/evolution/FunkyTime')}
          />
        </SwiperSlide>
        <SwiperSlide className={classes.swiperSlide}>
          <img
            className={classes.sliderImageS}
            src="https://cdn2.softswiss.net/i/s6/evolution/dream_catcher.webp"
            alt="Dream Catcher"
            onClick={() => history.push('/slots/evolution/dream_catcher')}
          />
        </SwiperSlide>
        <SwiperSlide className={classes.swiperSlide}>
          <img
            className={classes.sliderImageS}
            src="https://cdn2.softswiss.net/i/s6/evolution/CrazyCoinFlip.webp"
            alt="Crazy Coin Flip"
            onClick={() => history.push('/slots/evolution/CrazyCoinFlip')}
          />
        </SwiperSlide>
        <SwiperSlide className={classes.swiperSlide}>
          <img
            className={classes.sliderImageS}
            src="https://cdn2.softswiss.net/i/s6/evolution/megaball.webp"
            alt="Mega Ball"
            onClick={() => history.push('/slots/evolution/megaball')}
          />
        </SwiperSlide>
        <SwiperSlide className={classes.swiperSlide}>
          <img
            className={classes.sliderImageS}
            src="https://cdn2.softswiss.net/i/s6/evolution/cashorcrash.webp"
            alt="Cash or Crash"
            onClick={() => history.push('/slots/evolution/cashorcrash')}
          />
        </SwiperSlide>
      </Swiper>
    </div>

    {/* Table Games Section */}
    {/* <div className={classes.sliderContainer}>
      <div className={classes.arrowContainer}>
        <motion.div className={classes.textContainer} whileTap={{ scale: 0.95 }}>
          <motion.img
            src="https://shuffle.com/icons/table-games.svg"
            alt="Table Games Icon"
            className={classes.svgIcon}
            whileTap={{ scale: 0.95 }}
          />
          <motion.span className={classes.textLabel}>
            Table Games
          </motion.span>
        </motion.div>
        <div className={classes.buttonContainer}>
          <button className={classes.viewAllButton}>View All</button>
          <button
            className={classes.arrowLeft}
            onClick={() => swiperRef5.current.swiper.slidePrev()}
          >
            &lt;
          </button>
          <button
            className={classes.arrowRight}
            onClick={() => swiperRef5.current.swiper.slideNext()}
          >
            &gt;
          </button>
        </div>
      </div>
      <Swiper
        ref={swiperRef5}
        spaceBetween={10}
        slidesPerView={8}
        loop={true}
        navigation={false}
        modules={[Navigation]}
        breakpoints={{
          320: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 6 },
          1440: { slidesPerView: 8 },
        }}
      >
        <SwiperSlide className={classes.swiperSlide}>
          <img
            className={classes.sliderImageS}
            src="https://cdn2.softswiss.net/i/s6/pragmaticexternal/SweetBonanza.webp"
            alt="Sweet Bonanza"
          />
        </SwiperSlide>
        <SwiperSlide className={classes.swiperSlide}>
          <img
            className={classes.sliderImageS}
            src="https://cdn2.softswiss.net/i/s6/softswiss/BeerBonanza.webp"
            alt="Slayers INC"
          />
        </SwiperSlide>
        <SwiperSlide className={classes.swiperSlide}>
          <img
            className={classes.sliderImageS}
            src="https://cdn2.softswiss.net/i/s6/hacksaw/WantedDeadoraWild.webp"
            alt="wANTEd"
          />
        </SwiperSlide>
        <SwiperSlide className={classes.swiperSlide}>
          <img
            className={classes.sliderImageS}
            src="https://cdn2.softswiss.net/i/s6/pragmaticexternal/GatesofOlympus1000.webp"
            alt="Gates 1000"
          />
        </SwiperSlide>
        <SwiperSlide className={classes.swiperSlide}>
          <img
            className={classes.sliderImageS}
            src="https://cdn2.softswiss.net/i/s6/pragmaticexternal/SugarRush1000.webp"
            alt="Sugar Rush 1000"
          />
        </SwiperSlide>
        <SwiperSlide className={classes.swiperSlide}>
          <img
            className={classes.sliderImageS}
            src="https://cdn2.softswiss.net/i/s6/hacksaw/ZeZeus94.webp"
            alt="Ze Zeus"
          />
        </SwiperSlide>
        <SwiperSlide className={classes.swiperSlide}>
          <img
            className={classes.sliderImageS}
            src="https://cdn2.softswiss.net/i/s6/hacksaw/DorkUnit.webp"
            alt="Dork Unit"
          />
        </SwiperSlide>
        <SwiperSlide className={classes.swiperSlide}>
          <img
            className={classes.sliderImageS}
            src="https://cdn2.softswiss.net/i/s6/playngo/SweetAlchemy.webp"
            alt="Sweet Alchemy"
          />
        </SwiperSlide>
      </Swiper>
    </div> */}

    <br />
    <br />
    <BettingHistory /> 

        </Container>
      </Grow>
    </Box>
  );
};

Main.propTypes = {
  isAuthenticated: PropTypes.bool,
  isLoading: PropTypes.bool,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading,
  user: state.auth.user,
});

export default connect(mapStateToProps, {})(Main);
