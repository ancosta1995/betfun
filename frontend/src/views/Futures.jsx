import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { BsFileLock2Fill } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import { GoArrowSwitch } from "react-icons/go";
import { makeStyles, withStyles,} from "@material-ui/core";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, ButtonGroup, FormControl, Select, MenuItem } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Box from "@material-ui/core/Box";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { CandleStickSocket } from "../services/websocket.service";
import { useToasts } from "react-toast-notifications";
import { useSpring, animated, config } from 'react-spring';
import { ClipLoader } from "react-spinners";
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { createChart, LineStyle, CrosshairMode,PriceScaleMode} from 'lightweight-charts'; // LightweightCharts'ı içe aktar
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import Preloader from "../Preloader"; // Import the Preloader component
import Slider from "@material-ui/core/Slider";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import useWebSocket from 'react-use-websocket';
import prices from '../components/Prices.json';
import { updateCurrency, updateFiat, DisplayFiat } from "../actions/auth";
import Menu from "@material-ui/core/Menu";
import SearchIcon from "@material-ui/icons/Search";
import { useParams } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import { RiExchangeFundsLine } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";

const WS_URL = 'wss://fstream.binance.com/ws/btcusdt@trade';

// Coin logoları için sabit URL'ler
const COIN_LOGOS = {
  BTC: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
  ETH: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  DOGE: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png',
  LTC: 'https://assets.coingecko.com/coins/images/2/small/litecoin.png',
  SOL: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
  XRP: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png',
  ADA: 'https://assets.coingecko.com/coins/images/975/small/cardano.png',
  AVAX: 'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png',
};

const CustomTableCell = withStyles((theme) => ({
  root: {
    borderBottom: 'none',
    borderRadius: 'none',
    boxShadow: 'none',
    border: 'none',

  },
  paper: {
    borderBottom: 'none',
    borderRadius: 'none',
    boxShadow: 'none',
    border: 'none',

  },

  head: {
    backgroundColor: "#101123",
    fontFamily: "Poppins",
    fontWeight: 100,
    letterSpacing: ".1em",

    color: theme.palette.common.white,
  },
  body: {
    marginRight: "50px",
    borderRadius: 'none',
    boxShadow: 'none',
    fontFamily: "Rubik",
    fontSize: "14px",
    fontWeight: 200,

    backgroundColor: "#101123",
    color: theme.palette.common.white,

    fontSize: 16,
  },
}))(TableCell);

const CustomTabs = withStyles({
  root: {
    color: "#ffffff", // Set text color to white
  },
  indicator: {
    backgroundColor: "#3b82f6", // Set indicator color to blue
  },
})(Tabs);

const CustomTab = withStyles((theme) => ({
  root: {
    color: "#ffffff", // Set text color to white
    "&:hover": {
      color: "#ffffff", // Set hover text color to white
    },
  },
}))(Tab);

const ResultInput = withStyles({
  root: {
    marginRight: 10,
    maxWidth: 180,
    minWidth: 0,
    marginBottom: 10, // Add top margin
    
    "& :before": {
      display: "none",
    },
    "& label": {
      color: "#323956",
      fontSize: 15,
    },
    "& input": {
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".1em",
      padding: "8px 8px", // Adjust padding as needed
    },
    "& div": {
      // background: "#171A28",
      // background: "#131426",
      // height: "2.25rem",
      borderRadius: 4,
    },
    
  },
})(TextField);



const BetInput = withStyles({
  root: {
    marginRight: 10,
    maxWidth: 130,
    minWidth: 100,
    marginBottom: 10, // Add top margin

    "& :before": {
      display: "none",
    },
    "& label": {
      color: "#323956",
      fontSize: 15,
    },
    "& div input": {
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".1em",
      padding: "0.5rem 0.25rem",
    },
    "& div": {
      // background: "#171A28",
      background: "#141722",
      height: "2.25rem",
      borderRadius: 4,
    },
    
  },
})(TextField);

const useStyles = makeStyles(theme => ({
  root: {
    height:  `calc(250vh - 100%)`,

    marginTop: "3%",
    [theme.breakpoints.down("lg")]: {
      marginTop: "5%",

    },
    [theme.breakpoints.down("sm")]: {
      marginTop: "10%",
      height:  `calc(550vh - 100%)`,

    },
  },

  tableContainer: {
    backgroundColor: '#0c0d15',
    borderRadius: '12px',
    overflow: 'auto',
    margin: '20px 0',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    "&::-webkit-scrollbar": {
      height: "4px",
      width: "4px",
    },
    "&::-webkit-scrollbar-track": {
      background: "rgba(255, 255, 255, 0.02)",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#3b82f6",
      borderRadius: "2px",
    },
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0',
    minWidth: '800px',
  },
  tableHead: {
    "& th": {
      borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
      color: "#848e9c",
      fontSize: "11px",
      fontWeight: 500,
      textTransform: "uppercase",
      padding: "12px 16px",
      textAlign: "left",
      letterSpacing: "0.5px",
      whiteSpace: "nowrap",
      position: "sticky",
      top: 0,
      backgroundColor: "#0c0d15",
      zIndex: 1,
      cursor: "pointer",
      transition: "all 0.2s ease",
      userSelect: "none",

      "&:hover": {
        color: "#fff",
        backgroundColor: "rgba(255, 255, 255, 0.03)",
      },

      "& .header-content": {
        display: "flex",
        alignItems: "center",
        gap: "4px",
      },

      "& .sort-icon": {
        opacity: 0,
        transition: "all 0.2s ease",
        fontSize: "14px",
      },

      "&:hover .sort-icon": {
        opacity: 0.5,
      },

      "&.active": {
        color: "#fff",
        
        "& .sort-icon": {
          opacity: 1,
          color: "#3b82f6",
        },
      },
    },
  },
  tableRow: {
    transition: "all 0.2s ease",
    borderBottom: "1px solid rgba(255, 255, 255, 0.02)",
    "&:hover": {
      backgroundColor: "rgba(59, 130, 246, 0.05)",
    },
    "&:last-child": {
      borderBottom: "none",
    },
  },
  tableCell: {
    padding: "12px 16px",
    fontSize: "13px",
    color: "#e4e4e4",
    fontFamily: "Inter, sans-serif",
    whiteSpace: "nowrap",
    borderBottom: "none",
    backgroundColor: "#141722",
  },
  symbolCell: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    "& img": {
      width: "20px",
      height: "20px",
      borderRadius: "50%",
    },
    "& .position-type": {
      padding: "2px 8px",
      borderRadius: "4px",
      fontSize: "12px",
      fontWeight: 500,
      "&.long": {
        backgroundColor: "rgba(14, 203, 129, 0.1)",
        color: "#0ecb81",
      },
      "&.short": {
        backgroundColor: "rgba(246, 70, 93, 0.1)",
        color: "#f6465d",
      },
    },
  },
  priceCell: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    "& .price-icon": {
      fontSize: "14px",
      opacity: 0.5,
    },
    "& .price-value": {
      fontFamily: "JetBrains Mono, monospace",
      fontWeight: 500,
    },
  },
  multiplierCell: {
    "& .multiplier-badge": {
      backgroundColor: "rgba(168, 85, 247, 0.1)",
      color: "#a855f7",
      padding: "3px 6px",
      borderRadius: "4px",
      fontSize: "12px",
      fontWeight: 500,
      fontFamily: "JetBrains Mono, monospace",
    },
  },
  actionCell: {
    display: "flex",
    gap: "8px",
    "& button": {
      padding: "6px 12px",
      borderRadius: "6px",
      fontSize: "12px",
      fontWeight: 500,
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      transition: "all 0.2s ease",
    },
  },
  cashoutButton: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    color: "#3b82f6",
    "&:hover": {
      backgroundColor: "rgba(59, 130, 246, 0.2)",
    },
  },
  closeButton: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    color: "#ef4444",
    "&:hover": {
      backgroundColor: "rgba(239, 68, 68, 0.2)",
    },
  },
  pnlPositive: {
    color: '#0ecb81',
    backgroundColor: 'rgba(14, 203, 129, 0.1)',
    padding: '6px 12px',
    borderRadius: '6px',
    fontWeight: 500,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    "&::before": {
      content: '""',
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      backgroundColor: 'currentColor',
    }
  },
  pnlNegative: {
    color: '#f6465d',
    backgroundColor: 'rgba(246, 70, 93, 0.1)',
    padding: '6px 12px',
    borderRadius: '6px',
    fontWeight: 500,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    "&::before": {
      content: '""',
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      backgroundColor: 'currentColor',
    }
  },
  actionButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    color: '#3b82f6',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    "&:hover": {
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
    },
  },
  multiplierBadge: {
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    color: '#a855f7',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '13px',
    fontWeight: 500,
    fontFamily: 'JetBrains Mono, monospace',
  },
  priceValue: {
    fontFamily: 'JetBrains Mono, monospace',
    fontWeight: 500,
  },

  imageIcon: {
    width: '16px',
    height: '16px',
    marginBottom: '3px',
    marginRight: theme.spacing(1), // Adjust spacing as needed
    verticalAlign: 'middle', // Align the image vertically with the text
  },

  cashoutButton: {
    backgroundColor: 'rgb(32, 112, 223)',
    color: '#fff',
    padding: '6px 8px',
    border: 'none',
    borderRadius: '8px',
    fontFamily: "Rubik",
    fontSize: "12px",
    fontWeight: 400,

    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgb(32, 112, 223)',
    },
  },



  title: {
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: ".1em",
    padding: "0.25rem 0.25rem 0",
    lineHeight: 1,
  },

  placeBet: {
    background: "#141722",
    borderRadius: 5,
    boxShadow: "0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12)",
    marginTop: "0.6rem",
    "& button": {
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "12px",
      fontWeight: 500,
      letterSpacing: ".1em",
      "&:hover": {
        opacity: 1,
      },
    },
  },

  betCont: {
    display: "flex",
    width: "95%",
    alignItems: "center",
    flexWrap: "wrap",
    margin: "auto",
    padding: "0.5rem 0 0",
  },
  container: {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "auto",
    marginBottom: "auto",
    backgroundColor: "#0c0d15",
    borderRadius: "8px",
    padding: "5px 5px 5px 5px",
    display: "flex",
    width: "1150px",
    maxWidth: "1180px",
    flexDirection: "column",
    [theme.breakpoints.down("lg")]: {
      width: "78%",
      maxWidth: "1050px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "auto",
    },
  },


  betSection: {
    width: "100%",
    height: "30rem",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    [theme.breakpoints.down("lg")]: {
      flexDirection: "column-reverse",
      height: "auto",
    },
  },
  inputIcon: {
    marginTop: "0 !important",
    color: "#4fa0d8",
    background: "transparent !important",
  },
  betContainer: {
    borderRadius: "4px",
    padding: "16px",
    width: "20.625rem",
    height: "30rem",
    backgroundColor: "#0c0d15",
    [theme.breakpoints.down("lg")]: {
      marginTop: "24px",
      width: "100%",
      height: "auto",
    },
  },
  inputContainer: {
    position: "relative",
    marginBottom: "24px",
  },
  betInput: {
    "& .MuiFilledInput-root": {
      backgroundColor: "#141722",
      borderRadius: "4px",
      "&:hover": {
        backgroundColor: "#1a1d2b",
      },
    },
    "& .MuiFilledInput-input": {
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "14px",
      fontWeight: 500,
      padding: "8px 12px",
    },
  },
  multiplierContainer: {
    position: "absolute",
    top: "10px",
    right: "10px",
    display: "flex",
    gap: "8px",
  },
  multiplier: {
    minWidth: "fit-content",
    backgroundColor: "#101123",
    borderColor: "#32363c",
    color: "white",
  },
  orderContainer: {
    marginTop: "16px",
    backgroundColor: "#0c0d15",
    borderRadius: "12px",
    padding: "20px",
    width: "1150px",
    maxWidth: "1180px",
    marginLeft: "auto",
    marginRight: "auto",
    height: "auto",
    minHeight: "300px",
    maxHeight: "400px",
    overflowY: "auto",
    [theme.breakpoints.down("lg")]: {
      width: "78%",
      maxWidth: "1050px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "95%",
      padding: "12px",
    },
    "&::-webkit-scrollbar": {
      width: "4px",
      height: "4px",
    },
    "&::-webkit-scrollbar-track": {
      background: "rgba(255, 255, 255, 0.05)",
      borderRadius: "2px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "rgba(255, 255, 255, 0.1)",
      borderRadius: "2px",
      "&:hover": {
        background: "rgba(255, 255, 255, 0.15)",
      },
    },
  },
  
  table: {
    flexDirection: "row",
    justifyContent: "space-between",

    width: "100%",
    borderCollapse: "collapse", // Optional: collapse table borders
  },
  

  multiplierButton: {
    backgroundColor: "transparent",
    color: "#cccccc",
    border: "1px solid transparent",
    outline: "none",
    cursor: "pointer",
    padding: "4px",
    fontSize: "14px",
    fontFamily: "'Roboto', sans-serif",
    fontWeight: 500,
    "&:hover": {
      backgroundColor: "#101123",
    },
  },
  insufficientFundsButton: {
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    width: "100%",
    height: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "2px solid #4c8bf5",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    fontFamily: "'Roboto', sans-serif",
    fontWeight: 500,
    "&:hover": {
      backgroundColor: "#2563eb",
      borderColor: "#1e429f",
    },
  },
  limboButtonDisabled: {
    opacity: 0.5, // Reduce opacity when disabled
    pointerEvents: "none", // Disable pointer events when disabled
  },
  limboButton: {
    textTransform: "none",
    width: "100%",
    height: "40px",
    padding: "0 30px",
    borderRadius: "4px",
    fontSize: "15px",
    fontWeight: 500,
    color:" #fff",
    background: "rgb(32, 112, 223)",
    border: "none",
    color: "#ffffff",
    transition: "opacity .3s ease",
    fontFamily: "Rubik",
    "&:hover": {
      background: "rgb(32, 112, 223)",
      borderColor: "#1e429f",
    },
  },
  preloader: {
    background: "#101123",

    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },

  sliderAndValueContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  multiplierValue: {
    marginLeft: theme.spacing(1), // Adjust spacing as needed
    color: '#fff', // Adjust color as needed
  },

  limboSection: {
    backgroundColor: "#0c0d15",
    borderLeft: "0.120rem solid #1b1c2a",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "55rem",
    height: "100%",
    [theme.breakpoints.down("lg")]: {
      width: "100%",
      maxWidth: "100%",
      height: "300px", // Changed from 400px to 300px for mobile
      marginLeft: 0,
      marginRight: 0,
      borderLeft: "none",
    },
  },

  positionButtons: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
    "& .longButton": {
      flex: 1,
      backgroundColor: "#141722",
      color: "#e4e4e4",
      "&.active": {
        backgroundColor: "#0ecb81", // Yeşil renk - Long için
        "&:hover": {
          backgroundColor: "#0bb974",
        },
      },
    },
    "& .shortButton": {
      flex: 1,
      backgroundColor: "#141722",
      color: "#e4e4e4",
      "&.active": {
        backgroundColor: "#f6465d", // Kırmızı renk - Short için
        "&:hover": {
          backgroundColor: "#e03d53",
        },
      },
    },
  },

  placeBetButton: {
    width: "100%",
    height: "40px",
    fontSize: "15px",
    fontWeight: 500,
    fontFamily: "Rubik",
    "&.longButton": {
      backgroundColor: "#0ecb81", // Yeşil - Long için
      color: "#ffffff",
      "&:hover": {
        backgroundColor: "#0bb974",
      },
      "&:disabled": {
        backgroundColor: "#0ecb8180",
      }
    },
    "&.shortButton": {
      backgroundColor: "#f6465d", // Kırmızı - Short için
      color: "#ffffff",
      "&:hover": {
        backgroundColor: "#e03d53",
      },
      "&:disabled": {
        backgroundColor: "#f6465d80",
      }
    },
  },

  tabsContainer: {
    marginBottom: "20px",
    padding: "4px",
    backgroundColor: "#141722",
    borderRadius: "8px",
    "& .MuiTabs-flexContainer": {
      gap: "8px",
      padding: "4px",
    },
  },
  customTab: {
    minWidth: "50%",
    minHeight: "40px",
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "14px",
    fontWeight: 500,
    textTransform: "none",
    borderRadius: "6px",
    transition: "all 0.3s ease",
    opacity: 0.7,
    
    "&.Mui-selected": {
      color: "#fff",
      opacity: 1,
      backgroundColor: "#1a1d2b",
    },
    
    "&:hover": {
      opacity: 0.9,
      backgroundColor: "#1a1d2b",
    },
  },

  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 15px',
    backgroundColor: '#0c0d15',
    borderBottom: '1px solid #1b1c2a',
  },

  coinSelector: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    padding: '6px 12px',
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: '#1E2136',
    },
    '&:hover .MuiSvgIcon-root': {
      color: '#fff',
    },
  },

  coinInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  coinLogo: {
    width: '24px',
    height: '24px',
    objectFit: 'contain', // Logo oranını korur
    borderRadius: '50%', // Yuvarlak logo
  },

  coinName: {
    display: 'flex',
    flexDirection: 'column',
    '& .symbol': {
      color: '#fff',
      fontSize: '14px',
      fontWeight: '500',
    },
    '& .name': {
      color: '#848E9C',
      fontSize: '12px',
    },
  },

  priceInfo: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '20px',
    gap: '10px',
    '& .price': {
      color: '#fff',
      fontSize: '20px',
      fontWeight: '500',
    },
    '& .change': {
      fontSize: '14px',
    },
    '& .volume': {
      color: '#848E9C',
      fontSize: '14px',
    },
  },

  changePositive: {
    color: '#0ecb81',
  },

  changeNegative: {
    color: '#f6465d',
  },

  dropdownMenu: {
    backgroundColor: '#131426',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    marginTop: '8px',
    padding: '8px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
    minWidth: '300px',
  },

  menuItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    borderRadius: '8px',
    margin: '2px 0',
    transition: 'all 0.2s ease',
    
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },

    '& .coin-info': {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flex: 1,
    },

    '& .price-info': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '4px',
    },

    '& img': {
      width: '32px',
      height: '32px',
      objectFit: 'contain',
      borderRadius: '50%',
    },

    '& .symbol': {
      color: '#fff',
      fontSize: '14px',
      fontWeight: '500',
    },

    '& .name': {
      color: '#848E9C',
      fontSize: '12px',
    },

    '& .price': {
      color: '#fff',
      fontSize: '14px',
      fontWeight: '500',
    },

    '& .change-positive': {
      color: '#0ecb81',
      fontSize: '12px',
    },

    '& .change-negative': {
      color: '#f6465d',
      fontSize: '12px',
    },

    '&.selected': {
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderLeft: '3px solid #3b82f6',
    }
  },

  searchBox: {
    margin: '0 8px 12px 8px',
    padding: '8px 12px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    
    '& input': {
      background: 'none',
      border: 'none',
      color: '#fff',
      fontSize: '14px',
      width: '100%',
      outline: 'none',
      
      '&::placeholder': {
        color: '#848E9C',
      }
    }
  },

  tableContainer: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    borderRadius: '12px',
    overflowX: 'auto',
    width: '100%',
    position: 'relative',
    "&::-webkit-scrollbar": {
      height: "4px",
    },
    "&::-webkit-scrollbar-track": {
      background: "rgba(255, 255, 255, 0.05)",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "rgba(255, 255, 255, 0.1)",
      borderRadius: "2px",
      "&:hover": {
        background: "rgba(255, 255, 255, 0.15)",
      },
    },
  },

  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0 8px',
    minWidth: '800px',
  },

  tableHead: {
    "& th": {
      borderBottom: "none",
      color: "#848e9c",
      fontSize: "12px",
      fontWeight: 500,
      textTransform: "uppercase",
      padding: "12px 16px",
      textAlign: "left",
      letterSpacing: "0.5px",
      whiteSpace: "nowrap",
      position: "sticky",
      top: 0,
      backgroundColor: "#0c0d15",
      zIndex: 1,
    },
  },

  tableCell: {
    padding: "16px",
    fontSize: "14px",
    color: "#e4e4e4",
    backgroundColor: "#141722",
    border: "none",
    fontFamily: "Rubik",
    fontWeight: 400,
    textAlign: "left",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",

    "&:first-child": {
      borderTopLeftRadius: "8px",
      borderBottomLeftRadius: "8px",
      paddingLeft: "20px",
    },

    "&:last-child": {
      borderTopRightRadius: "8px",
      borderBottomRightRadius: "8px",
      paddingRight: "20px",
    },
  },

  amountCell: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    "& img": {
      width: "20px",
      height: "20px",
      borderRadius: "50%",
    },
  },

  pnlPositive: {
    color: "#0ecb81",
    fontWeight: 500,
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    "&::before": {
      content: '""',
      display: "block",
      width: "6px",
      height: "6px",
      borderRadius: "50%",
      backgroundColor: "#0ecb81",
    },
  },

  pnlNegative: {
    color: "#f6465d",
    fontWeight: 500,
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    "&::before": {
      content: '""',
      display: "block",
      width: "6px",
      height: "6px",
      borderRadius: "50%",
      backgroundColor: "#f6465d",
    },
  },

  cashoutButton: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    color: "#3b82f6",
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    fontFamily: "Rubik",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "rgba(59, 130, 246, 0.2)",
    },
    "&:active": {
      transform: "scale(0.98)",
    },
  },

  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    color: "#848e9c",
    "& img": {
      width: "64px",
      height: "64px",
      marginBottom: "16px",
      opacity: 0.5,
    },
    "& h3": {
      fontSize: "16px",
      fontWeight: 500,
      margin: "0 0 8px 0",
    },
    "& p": {
      fontSize: "14px",
      margin: 0,
      textAlign: "center",
    },
  },
  dropdownArrow: {
    marginLeft: '8px',
    color: '#848e9c',
    fontSize: '24px',
    transition: 'color 0.2s ease',
  },
}));

const Futures = (props) => {
  const { symbol } = useParams();
  const { user, isAuthenticated, selectedCurrency, selectedLogo, selectedFiatCurrency, DisplayFiat, updateCurrency, updateFiat, DisplayForFiat } = props;
  
  // Constants
  const candleInterval = 60; // 1 minute in seconds
  const leverageOptions = [5, 10, 25, 50, 100];
  
  // Define coins array before using it in useState
  const coins = [
    { symbol: 'BTC', name: 'Bitcoin', logo: COIN_LOGOS.BTC },
    { symbol: 'ETH', name: 'Ethereum', logo: COIN_LOGOS.ETH },
    { symbol: 'DOGE', name: 'Dogecoin', logo: COIN_LOGOS.DOGE },
    { symbol: 'LTC', name: 'Litecoin', logo: COIN_LOGOS.LTC },
    { symbol: 'SOL', name: 'Solana', logo: COIN_LOGOS.SOL },
    { symbol: 'XRP', name: 'Ripple', logo: COIN_LOGOS.XRP },
    { symbol: 'ADA', name: 'Cardano', logo: COIN_LOGOS.ADA },
    { symbol: 'AVAX', name: 'Avalanche', logo: COIN_LOGOS.AVAX },
  ];

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCoin, setSelectedCoin] = useState(() => {
    const foundCoin = coins.find(coin => coin.symbol === symbol);
    return foundCoin || { symbol: 'BTC', name: 'Bitcoin', logo: COIN_LOGOS.BTC };
  });
  const [marketData, setMarketData] = useState({
    BTC: { price: '0', change: '0', volume: '0' },
    ETH: { price: '0', change: '0', volume: '0' },
    DOGE: { price: '0', change: '0', volume: '0' },
    LTC: { price: '0', change: '0', volume: '0' },
    SOL: { price: '0', change: '0', volume: '0' },
    XRP: { price: '0', change: '0', volume: '0' },
    ADA: { price: '0', change: '0', volume: '0' },
    AVAX: { price: '0', change: '0', volume: '0' },
  });
  const [betAmount, setBetAmount] = useState("0.00");
  const [bustPrice, setBustPrice] = useState("0");
  const [bitcoinPrice, setBitcoinPrice] = useState(0);
  const [openOrders, setOpenOrders] = useState([]);
  const [multiplier, setMultiplier] = useState("2"); 
  const [loading, setLoading] = useState(false); 
  const [limboResult, setLimboResult] = useState({ crashpoint: 1 }); 
  const [data, setData] = useState([]); 
  const [tabValue, setTabValue] = useState(0);
  const [target, setTarget] = useState("2");
  const [positionType, setPositionType] = useState("long"); 
  const [orderType, setOrderType] = useState("market"); 
  const [initialData, setInitialData] = useState([]);
  const [walletBalances, setWalletBalances] = useState({});
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [oldestTimestamp, setOldestTimestamp] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });

  // Add new state for tracking closing orders
  const [closingOrders, setClosingOrders] = useState(new Set());

  // Add new state for button loading
  const [loadingButtons, setLoadingButtons] = useState(new Set());

  // Refs
  const chartContainerRef = useRef();
  const candlestickSeriesRef = useRef();
  const chart = useRef();
  const series = useRef();
  const lineSeries = useRef(null);
  const wsRef = useRef(null);
  const currentCandleStart = useRef(Math.floor(Date.now() / 1000));
  const currentCandle = useRef(null);

  // Filtered coins
  const filteredCoins = useMemo(() => {
    return coins.filter(coin => 
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Menu handlers
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCoinSelect = async (coin) => {
    try {
      setSelectedCoin(coin);
      props.history.push(`/futures/${coin.symbol}`);
      handleClose();
    } catch (error) {
      console.error('Error selecting coin:', error);
      addToast('Failed to switch cryptocurrency', { appearance: 'error' });
    }
  };

  // Effect to update selected coin when URL changes
  useEffect(() => {
    if (symbol) {
      const foundCoin = coins.find(coin => coin.symbol === symbol);
      if (foundCoin) {
        setSelectedCoin(foundCoin);
      }
    }
  }, [symbol]);

  // Function to cleanup chart resources
  const cleanupChart = () => {
    try {
      // Close WebSocket connection
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }

      // Remove existing chart
      if (chart.current) {
        chart.current.remove();
        chart.current = null;
      }

      // Reset series
      series.current = null;

      // Clear chart container
      if (chartContainerRef.current) {
        chartContainerRef.current.innerHTML = '';
      }

      // Reset candle tracking
      currentCandle.current = null;
      currentCandleStart.current = Math.floor(Date.now() / 1000);
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  };

  const initializeChartWithSymbol = async (symbolName) => {
    try {
      console.log(`Initializing chart for ${symbolName}`);
      
      cleanupChart();
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (!chartContainerRef.current) {
        console.error('Chart container ref is null');
        return;
      }

      // Create new chart instance
      chart.current = createChart(chartContainerRef.current, {
        ...CHART_OPTIONS,
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
      });

      // Create new candlestick series
      series.current = chart.current.addCandlestickSeries(CANDLESTICK_SERIES_OPTIONS);

      try {
        // Initialize with some historical data first
        const response = await axios.get(
          'https://api.binance.com/api/v3/klines',
          {
            params: {
              symbol: `${symbolName}USDT`,
              interval: '1m',
              limit: 100,
            },
          }
        );

        const historicalData = response.data.map(([time, open, high, low, close]) => ({
          time: Math.floor(time / 1000),
          open: parseFloat(open),
          high: parseFloat(high),
          low: parseFloat(low),
          close: parseFloat(close),
        }));

        if (series.current) {
          series.current.setData(historicalData);
        }

        // Connect to real-time trade WebSocket
        const tradeWs = new WebSocket(`wss://stream.binance.com:9443/ws/${symbolName.toLowerCase()}usdt@trade`);
        
        tradeWs.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            const tradeTime = Math.floor(data.T / 1000);
            const tradePrice = parseFloat(data.p);

            if (!currentCandle.current || tradeTime >= currentCandleStart.current + candleInterval) {
              // Create new candle
              if (currentCandle.current && series.current) {
                series.current.update(currentCandle.current);
              }

              currentCandleStart.current = Math.floor(tradeTime / candleInterval) * candleInterval;
              currentCandle.current = {
                time: currentCandleStart.current,
                open: tradePrice,
                high: tradePrice,
                low: tradePrice,
                close: tradePrice,
              };
            } else if (currentCandle.current) {
              // Update current candle
              currentCandle.current.high = Math.max(currentCandle.current.high, tradePrice);
              currentCandle.current.low = Math.min(currentCandle.current.low, tradePrice);
              currentCandle.current.close = tradePrice;
            }

            if (series.current && currentCandle.current) {
              series.current.update(currentCandle.current);
            }

            // Remove the auto-scrolling behavior
            // chart.current.timeScale().scrollToRealTime();
          } catch (error) {
            console.error('WebSocket message handling error:', error);
          }
        };

        tradeWs.onerror = (error) => {
          console.error(`Trade WebSocket error for ${symbolName}:`, error);
        };

        tradeWs.onclose = () => {
          console.log(`Trade WebSocket closed for ${symbolName}`);
        };

        wsRef.current = tradeWs;

        // Initial fit content
        chart.current.timeScale().fitContent();

      } catch (error) {
        console.error('Error setting up real-time chart:', error);
      }

    } catch (error) {
      console.error('Error initializing chart:', error);
    }
  };

  // Effect to handle symbol changes
  useEffect(() => {
    let isSubscribed = true;

    const initChart = async () => {
      if (symbol && isSubscribed) {
        console.log(`Symbol changed to ${symbol}`);
        const foundCoin = coins.find(coin => coin.symbol.toUpperCase() === symbol.toUpperCase());
        if (foundCoin) {
          setSelectedCoin(foundCoin);
          await initializeChartWithSymbol(foundCoin.symbol.toUpperCase());
        }
      }
    };

    initChart();

    return () => {
      isSubscribed = false;
      cleanupChart();
    };
  }, [symbol]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (chart.current && chartContainerRef.current) {
        chart.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const formatBalance = (amount, selectedCurrency) => {
    if (DisplayForFiat) {
      if (selectedCurrency in prices && selectedFiatCurrency in prices[selectedCurrency]) {
        const conversionRate = prices[selectedCurrency][selectedFiatCurrency];
        if (conversionRate <= 0) {
          throw new Error('Invalid conversion rate');
        }
        const fiatAmount = amount * conversionRate;
        return new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: selectedFiatCurrency 
        }).format(fiatAmount);
      } else {
        throw new Error('Currency not supported');
      }
    } else {
      return new Intl.NumberFormat('en-US', { 
        minimumFractionDigits: 2,
        maximumFractionDigits: 8,
      }).format(amount);
    }
  };

  const getTrueCryptoAmount = (amount, selectedCurrency, selectedFiatCurrency) => {
    if (selectedCurrency in prices && selectedFiatCurrency in prices[selectedCurrency]) {
      const cryptoPriceInFiat = prices[selectedCurrency][selectedFiatCurrency];
      if (cryptoPriceInFiat <= 0) {
        throw new Error('Invalid cryptocurrency price');
      }
      const trueAmount = amount / cryptoPriceInFiat;
      return trueAmount;
    } else {
      throw new Error('Currency or fiat not supported');
    }
  };

  const classes = useStyles();
  const { addToast } = useToasts();
  const [showChart, setShowChart] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCashout = async (orderId) => {
    try {
      // Prevent double-clicking
      if (loadingButtons.has(orderId) || closingOrders.has(orderId)) {
        return;
      }

      // Set button loading state
      setLoadingButtons(prev => new Set([...prev, orderId]));

      // Set closing state
      setClosingOrders(prev => new Set([...prev, orderId]));

      // Optimistic update - remove from UI immediately
      setOpenOrders(prev => prev.filter(order => order._id !== orderId));

      // Send sell order via WebSocket
      CandleStickSocket.emit("candlestick:sellorder", orderId);

      // Remove button loading state after 1 second
      setTimeout(() => {
        setLoadingButtons(prev => {
          const newSet = new Set(prev);
          newSet.delete(orderId);
          return newSet;
        });
      }, 1000);

    } catch (error) {
      console.error('Error during cashout:', error);
      addToast('Failed to close position', { appearance: 'error' });
      
      // Remove loading state on error
      setLoadingButtons(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
      setClosingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };
  
  // Update the socket listeners effect
  useEffect(() => {
    const handleOrderSold = ({ orderId, success, error, pnl, currency }) => {
      // Remove from closing state
      setClosingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });

      if (success) {
        // Format PNL for display
        const formattedPnl = parseFloat(pnl).toFixed(2);
        const isPnlPositive = parseFloat(pnl) >= 0;
        
        // Show success toast with PNL information
        addToast(
          `Position closed with ${isPnlPositive ? '+' : ''}${formattedPnl}% PNL`, 
          { 
            appearance: isPnlPositive ? 'success' : 'error',
            autoDismiss: true,
            autoDismissTimeout: 5000
          }
        );
      } else {
        // Show error toast if closing failed
        addToast(error || 'Failed to close position', { 
          appearance: 'error',
          autoDismiss: true,
          autoDismissTimeout: 5000
        });
      }
    };

    const handleOpenOrdersData = (orders) => {
      // Filter out orders that are currently being closed
      const filteredOrders = orders.filter(order => !closingOrders.has(order._id));
      setOpenOrders(filteredOrders);
    };

    CandleStickSocket.on("order:sold", handleOrderSold);
    CandleStickSocket.on("openOrders:data", handleOpenOrdersData);

    return () => {
      CandleStickSocket.off("order:sold", handleOrderSold);
      CandleStickSocket.off("openOrders:data", handleOpenOrdersData);
    };
  }, [closingOrders, addToast]); // Added addToast to dependencies

  const handleMultiplierSliderChange = (newValue) => {
    setMultiplier(newValue.toString());
  };

  const springProps = useSpring({
    from: { crashpoint: 1 },
    to: { crashpoint: limboResult.crashpoint ? parseFloat(limboResult.crashpoint) : 1 },
    config: { duration: 250 },
  });

  const onMultiplierChange = (event) => {
    // Ensure multiplier is not lower than 2 and not higher than 1000
    const newMultiplier = Math.max(2, Math.min(1000, parseFloat(event.target.value)));
    console.log("New multiplier value:", newMultiplier); // Log the new multiplier value
    // Update multiplier state
    setMultiplier(newMultiplier.toString()); // Convert to string before updating state
  };

  // Function to handle multiplier button click
  const handleMultiplierButton = (value) => {
    // Calculate new multiplier value
    const newMultiplier = Math.max(2, Math.min(1000, multiplier * value));
    console.log("New multiplier value:", newMultiplier); // Log the new multiplier value
    // Update multiplier state
    setMultiplier(newMultiplier.toString()); // Convert to string before updating state
  };

  const handleBetAmountChange = (event) => {
    const newBetAmount = event.target.value;
    if (!isNaN(newBetAmount)) {
      setBetAmount(newBetAmount);
    }
  };

  const handleBetAmountButton = (factor) => {
    const newBetAmount = parseFloat(betAmount) * factor;
    setBetAmount(newBetAmount.toFixed(2));
  };

  const success = msg => {
    // addToast(msg, { appearance: "success" });
  };

  const onBetChange = e => {
    setBetAmount(e.target.value);
  };

  const onTargetChange = e => {
    setTarget(e.target.value);
  };

  const open = async (x) => {
    setLimboResult(x); // Update limbo result from the event data
  };

  const handleBetClick = () => {
    if (loading) return;
    setLoading(true);

    let amountToSend;
    if (DisplayForFiat) {
      amountToSend = getTrueCryptoAmount(betAmount, selectedCurrency, selectedFiatCurrency);
    } else {
      amountToSend = betAmount;
    }

    const cleanBustPrice = parseFloat(bustPrice.replace(/,/g, ''));

    CandleStickSocket.emit("candlestick:buyorder", {
      amount: amountToSend,
      multiplier: parseFloat(multiplier),
      bustPrice: cleanBustPrice,
      entryPrice: bitcoinPrice,
      currency: selectedCurrency,
      symbol: selectedCoin.symbol, // Add the selected coin's symbol
      isLong: positionType === "long",
      positionType: positionType
    });

    setTimeout(() => {
      setLoading(false);
    }, 350);
  };

  const creationError = msg => {
    // Update state
    setLoading(true); // Set loading state to true when placing the bet
    addToast(msg, { appearance: "error" });
  };

  // Add new features
  

  // Fetch historical data on mount (1-minute interval)
  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        // Get current timestamp in milliseconds
        const endTime = Date.now();
        // Calculate start time (1000 minutes ago)
        const startTime = endTime - (1000 * 60 * 1000); // 1000 minutes in milliseconds

        const response = await axios.get(
          'https://api.binance.com/api/v3/klines',
          {
            params: {
              symbol: `${selectedCoin.symbol}USDT`,
              interval: '1m',
              limit: 1000, // Maximum limit
              startTime: startTime,
              endTime: endTime
            },
          }
        );

        // Transform the data to the format required by the chart library
        const data = response.data.map(([time, open, high, low, close]) => ({
          time: Math.floor(time / 1000), // Convert to seconds
          open: parseFloat(open),
          high: parseFloat(high),
          low: parseFloat(low),
          close: parseFloat(close),
        }));

        setInitialData(data);
      } catch (error) {
        console.error('Error fetching historical data:', error);
      }
    };

    fetchHistoricalData();
  }, [selectedCoin.symbol]); // Add selectedCoin.symbol as dependency

  // Initialize chart and add candlestick series
  useEffect(() => {
    if (chartContainerRef.current && initialData.length > 0) {
      if (chart.current) {
        chart.current.remove();
      }

      const containerWidth = chartContainerRef.current.clientWidth;
      const containerHeight = window.innerWidth <= 960 ? 400 : chartContainerRef.current.clientHeight;

      chart.current = createChart(chartContainerRef.current, {
        ...CHART_OPTIONS,
        width: containerWidth,
        height: containerHeight,
      });

      series.current = chart.current.addCandlestickSeries(CANDLESTICK_SERIES_OPTIONS);
      series.current.setData(initialData);

      // Set the oldest timestamp from initial data
      setOldestTimestamp(initialData[0]?.time * 1000);

      // Add scroll listener with debounce
      let timeoutId;
      chart.current.timeScale().subscribeVisibleTimeRangeChange(() => {
        if (timeoutId) clearTimeout(timeoutId);
        
        timeoutId = setTimeout(() => {
          const logicalRange = chart.current.timeScale().getVisibleLogicalRange();
          if (logicalRange !== null && logicalRange.from <= 50 && !isLoadingMore) {
            loadMoreData();
          }
        }, 200); // 200ms debounce
      });

      // Resize handler
      const handleResize = () => {
        const newWidth = chartContainerRef.current.clientWidth;
        const newHeight = window.innerWidth <= 960 ? 400 : chartContainerRef.current.clientHeight;
        chart.current.resize(newWidth, newHeight);
      };

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        if (timeoutId) clearTimeout(timeoutId);
      };
    }
  }, [initialData]);

  // Add new function to load more historical data
  const loadMoreData = async () => {
    if (isLoadingMore || !oldestTimestamp) return;

    try {
      setIsLoadingMore(true);

      const endTime = oldestTimestamp;
      const startTime = endTime - (1000 * 60 * 1000); // 1000 minutes before the oldest candle

      const response = await axios.get(
        'https://api.binance.com/api/v3/klines',
        {
          params: {
            symbol: `${selectedCoin.symbol}USDT`,
            interval: '1m',
            limit: 1000,
            endTime: endTime - 1, // Subtract 1ms to avoid duplicate candle
            startTime: startTime
          },
        }
      );

      const newData = response.data.map(([time, open, high, low, close]) => ({
        time: Math.floor(time / 1000),
        open: parseFloat(open),
        high: parseFloat(high),
        low: parseFloat(low),
        close: parseFloat(close),
      }));

      if (newData.length > 0) {
        // Update the oldest timestamp
        setOldestTimestamp(newData[0].time * 1000);
        
        // Merge new data with existing data
        const mergedData = [...newData, ...initialData];
        
        // Store current visible time range before updating data
        const currentVisibleRange = chart.current.timeScale().getVisibleRange();
        
        // Update the chart with merged data
        if (series.current) {
          series.current.setData(mergedData);
        }
        
        // Update state
        setInitialData(mergedData);

        // Restore the visible range after updating data
        if (currentVisibleRange) {
          chart.current.timeScale().setVisibleRange(currentVisibleRange);
        }
      }

    } catch (error) {
      console.error('Error loading more historical data:', error);
      addToast('Failed to load historical data', { appearance: 'error' });
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Market data WebSocket effect
  useEffect(() => {
    const connectMarketWebSocket = () => {
      const streams = coins.map(coin => `${coin.symbol.toLowerCase()}usdt@ticker`);
      const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${streams.join('/')}`);

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.e === '24hrTicker') {
          const symbol = data.s.replace('USDT', '');
          setMarketData(prev => ({
            ...prev,
            [symbol]: {
              price: parseFloat(data.c).toLocaleString('en-US', { 
                minimumFractionDigits: 2,
                maximumFractionDigits: 2 
              }),
              change: parseFloat(data.p).toLocaleString('en-US', { 
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                signDisplay: 'always'
              }),
              volume: `${(parseFloat(data.v) * parseFloat(data.c) / 1000000).toFixed(2)}M`,
            }
          }));

          // Update Bitcoin price if it's BTC
          if (symbol === 'BTC') {
            setBitcoinPrice(parseFloat(data.c));
          }
        }
      };

      ws.onerror = (error) => {
        console.error('Market WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('Market WebSocket closed. Reconnecting...');
        setTimeout(connectMarketWebSocket, 5000);
      };

      return ws;
    };

    const marketWs = connectMarketWebSocket();
    return () => {
      if (marketWs) {
        marketWs.close();
      }
    };
  }, []);

  const updateBustPrice = (coinPrice, multiplier, isLong) => {
    const cleanPrice = parseFloat(coinPrice.toString().replace(/,/g, ''));
    
    if (!isNaN(cleanPrice) && !isNaN(parseFloat(multiplier))) {
      const newBustPrice = isLong 
        ? calculateBustPriceLong(cleanPrice, parseFloat(multiplier))
        : calculateBustPriceShort(cleanPrice, parseFloat(multiplier));
      
      console.log("Calculating bust price for:", isLong ? "LONG" : "SHORT");
      console.log("Entry Price:", cleanPrice);
      console.log("Multiplier:", multiplier);
      console.log("Bust Price:", newBustPrice);
      
      setBustPrice(newBustPrice.toString());
    }
  };

  // Add new function to format bust price appropriately
  const formatBustPrice = (bustPrice, originalPrice) => {
    if (originalPrice >= 1000) {
        // For high-value coins like BTC, show whole numbers
        return Math.round(bustPrice).toLocaleString();
    } else if (originalPrice >= 1) {
        // For medium-value coins, show 2 decimal places
        return bustPrice.toFixed(2);
    } else {
        // For low-value coins, show 4 decimal places
        return bustPrice.toFixed(4);
    }
  };

  const calculateBustPriceShort = (entryPrice, leverageRatio) => {
    return entryPrice + (entryPrice / leverageRatio);
  };

  const calculateBustPriceLong = (entryPrice, leverageRatio) => {
    return entryPrice - (entryPrice / leverageRatio);
  };

  const CHART_OPTIONS = {
    layout: {
          textColor: 'white',
          background: { type: 'solid', color: '#0c0d15' },  },
          grid: {
            vertLines: {
              color: '#00000000', // Transparent color to hide vertical grid lines
            },
            horzLines: {
              color: '#00000000', // Transparent color to hide horizontal grid lines
            },
          },
          crosshair: {
            // Change mode from default 'magnet' to 'normal'.
            // Allows the crosshair to move freely without snapping to datapoints
            mode: 1,
          },
            // Vertical crosshair line (showing Date in Label)
            vertLine: {
                width: 8,
                color: '#C3BCDB44',
                style: LineStyle.Solid,
                labelBackgroundColor: '#9B7DFF',
            },
    
            // Horizontal crosshair line (showing Price in Label)
            horzLine: {
                color: '#9B7DFF',
                labelBackgroundColor: '#9B7DFF',
            },
    
    priceScale: {
      
      position: 'right',
      autoScale: true, // Otomatik lçeklenmeyi devre dışı bırakır
      mode: PriceScaleMode.Normal, // Fiyat ölçeği modunu belirler
      invertScale: false,
      alignLabels: true,
  },
  timeScale: {
    timeVisible: true,
    secondsVisible: true, // Set seconds visibility to true for real-time data
    timezone: 'UTC',
  },
  handleScroll: {
    // Enable auto-following
    mouseWheel: true, // Allow mouse wheel zooming
    pressedMouseMove: true, // Allow panning via mouse click and drag
  },
  autoSize: true, // Enable auto-resizing of the chart
  trackingMode: {
    touch: true, // Enable kinetic scroll with touch gestures
    mouse: false, // Disable kinetic scroll with mouse gestures
  },
  handleScale: {
    mouseWheel: true, // Enable scaling with the mouse wheel
    pinch: true, // Enable scaling with pinch/zoom gestures
    axisPressedMouseMove: true, // Enable scaling by holding down the mouse button
    axisDoubleClickReset: true, // Enable resetting scaling by double-clicking
  },



  watermark: {
    color: 'hsl(215, 75%, 50%, 0.1)', 
    visible: true,
    text: 'betfun.gg', 
    fontSize: 36,
  },
};

// Use useEffect to fetch Bitcoin price and update bust price whenever bitcoin price or multiplier changes
useEffect(() => {
    const priceString = marketData[selectedCoin.symbol]?.price || '0';
    const currentPrice = parseFloat(priceString.replace(/,/g, ''));
    const isLong = positionType === "long"; // Explicitly check position type
    console.log("Updating bust price for position type:", positionType); // Debug log
    updateBustPrice(currentPrice, multiplier, isLong);
}, [selectedCoin.symbol, marketData, multiplier, positionType]); // Update dependencies


useEffect(() => {
  // Subscribe to the socket event for open orders
  // Replace 'socketEventName' with the actual event name emitted for open orders
  CandleStickSocket.on("openOrders:data", data => {
    // Update state with received open orders data
    setOpenOrders(data);
  });

  // Unsubscribe from socket events when component unmounts
  return () => {
    CandleStickSocket.off("openOrders:data");
  };
}, []);

  const logoUrl = DisplayForFiat
    ? `https://shuffle.com/icons/fiat/${selectedFiatCurrency}.svg`
    : selectedLogo;

  const CANDLESTICK_SERIES_OPTIONS = {
    upColor: '#0ecb81',
    downColor: '#f6465d',
    borderUpColor: '#0ecb81',
    borderDownColor: '#f6465d',
    wickUpColor: '#0ecb81',
    wickDownColor: '#f6465d',
    };

  const lastMessage = useWebSocket(WS_URL);

  useEffect(() => {
    console.log("Setting up socket listeners...");
    
    // Listen for successful connection
    CandleStickSocket.on("connect", () => {
      console.log("Socket connected successfully");
    });

    // Listen for connection errors
    CandleStickSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    // Listen for order responses
    CandleStickSocket.on("candlestick:buyorder:response", (response) => {
      console.log("Order response received:", response);
    });

    return () => {
      CandleStickSocket.off("connect");
      CandleStickSocket.off("connect_error");
      CandleStickSocket.off("candlestick:buyorder:response");
    };
  }, []);

  useEffect(() => {
    CandleStickSocket.on("update-wallet", ({ amount, currency }) => {
      if (currency === selectedCurrency) {
        // Update the wallet balance for the specific currency
        setWalletBalances(prevBalances => ({
          ...prevBalances,
          [currency]: prevBalances[currency] + amount
        }));
      }
    });

    return () => {
      CandleStickSocket.off("update-wallet");
    };
  }, [selectedCurrency]);

  const calculatePNL = (currentPrice, entryPrice, isLong) => {
    if (!currentPrice || !entryPrice) return 0;
    
    if (isLong) {
      return ((currentPrice - entryPrice) / entryPrice) * 100;
    } else {
      return ((entryPrice - currentPrice) / entryPrice) * 100;
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedOrders = () => {
    if (!sortConfig.key) return openOrders;

    return [...openOrders].sort((a, b) => {
      if (sortConfig.key === 'pnl') {
        return sortConfig.direction === 'asc' 
          ? a.pnl - b.pnl
          : b.pnl - a.pnl;
      }
      if (sortConfig.key === 'multiplier') {
        return sortConfig.direction === 'asc'
          ? a.multiplier - b.multiplier
          : b.multiplier - a.multiplier;
      }
      if (sortConfig.key === 'entryPrice') {
        return sortConfig.direction === 'asc'
          ? a.entryPrice - b.entryPrice
          : b.entryPrice - a.entryPrice;
      }
      // Add more sorting conditions as needed
      return 0;
    });
  };

  // Position type tab değişikliğini güncelleyelim
  const handlePositionTypeChange = (event, newValue) => {
    // Doğrudan "long" veya "short" değerini ayarlayalım
    setPositionType(newValue === 0 ? "long" : "short");
    
    // Debug için log ekleyelim
    console.log("Position type changed to:", newValue === 0 ? "long" : "short");
  };

  // Orders güncellendiğinde log ekleyelim
  useEffect(() => {
    console.log("Current orders:", openOrders);
    openOrders.forEach(order => {
      console.log(`Order ${order._id} position type:`, order.positionType);
    });
  }, [openOrders]);

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div className={classes.headerContainer}>
          <div className={classes.coinSelector} onClick={handleClick}>
            <div className={classes.coinInfo}>
              <img 
                src={selectedCoin.logo} 
                alt={selectedCoin.name} 
                className={classes.coinLogo} 
              />
              <div className={classes.coinName}>
                <span className="symbol">{selectedCoin.symbol}</span>
                <span className="name">{selectedCoin.name}</span>
              </div>
            </div>
            <div className={classes.priceInfo}>
              <span className="price">
                ${marketData[selectedCoin.symbol]?.price || '0.00'}
              </span>
              <span className={`change ${
                parseFloat(marketData[selectedCoin.symbol]?.change || 0) >= 0 
                  ? classes.changePositive 
                  : classes.changeNegative
              }`}>
                {marketData[selectedCoin.symbol]?.change || '0.00'}
              </span>
              {/* <span className="volume">
                24h Vol: ${marketData[selectedCoin.symbol]?.volume || '0.00'}
              </span> */}
            </div>
            <MdKeyboardArrowDown className={classes.dropdownArrow} />
          </div>

          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            classes={{ paper: classes.dropdownMenu }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <div className={classes.searchBox}>
              <SearchIcon style={{ color: '#848E9C', width: 20 }} />
              <input 
                type="text" 
                placeholder="Search coin..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {filteredCoins.map((coin) => (
              <MenuItem 
                key={coin.symbol} 
                onClick={() => handleCoinSelect(coin)}
                className={`${classes.menuItem} ${symbol === coin.symbol ? 'selected' : ''}`}
              >
                <div className="coin-info">
                  <img src={coin.logo} alt={coin.name} />
                  <div>
                    <div className="symbol">{coin.symbol}</div>
                    <div className="name">{coin.name}</div>
                  </div>
                </div>
                <div className="price-info">
                  <div className="price">
                    ${marketData[coin.symbol]?.price || '0.00'}
                  </div>
                  <div className={parseFloat(marketData[coin.symbol]?.change || 0) >= 0 ? 'change-positive' : 'change-negative'}>
                    {marketData[coin.symbol]?.change || '0.00'}%
                  </div>
                </div>
              </MenuItem>
            ))}
          </Menu>
        </div>

        <div className={classes.betSection}>
          <div className={classes.betContainer}>
            <div className={classes.tabsContainer}>
              <Tabs
                value={positionType === "long" ? 0 : 1} // Değeri doğrudan kontrol edelim
                onChange={handlePositionTypeChange}
                variant="fullWidth"
                TabIndicatorProps={{
                  style: { display: "none" }
                }}
              >
                <Tab 
                  className={classes.customTab} 
                  label={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>Long</span>
                    </div>
                  }
                  style={{
                    backgroundColor: positionType === "long" ? "#0d3c2c" : "transparent",
                    color: positionType === "long" ? "#0ecb81" : "#e4e4e4",
                  }}
                />
                <Tab 
                  className={classes.customTab} 
                  label={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>Short</span>
                    </div>
                  }
                  style={{
                    backgroundColor: positionType === "short" ? "#3d1f24" : "transparent",
                    color: positionType === "short" ? "#f6465d" : "#e4e4e4",
                  }}
                />
              </Tabs>
            </div>

            {/* Bet Amount - İlk sıraya taşındı */}
            <div className={classes.title}>Bet Amount</div>
            <div className={classes.inputContainer}>
              <Box className={classes.placeBet}>
                <Box className={classes.betCont}>
                  <BetInput
                    label=""
                    variant="filled"
                    value={betAmount}
                    onChange={onBetChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment className={classes.inputIcon} position="start">
                          <img 
                            style={{ height: 17, width: 17 }} 
                            src={logoUrl} 
                            alt={`${selectedCurrency} logo`} 
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Box>
            </div>

            {/* Leverage - İkinci sıraya taşındı */}
            <div className={classes.title}>Leverage</div>
            <div className={classes.inputContainer}>
              <Box className={classes.placeBet}>
                <Box className={classes.betCont}>
                  <BetInput
                    label=""
                    variant="filled"
                    value={multiplier}
                    onChange={onMultiplierChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          className={classes.inputIcon}
                          position="start"
                        >
                          <img src="https://shuffle.com/icons/increase.svg" alt="Money Icon" style={{ width: 16, height: 16 }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Box>
              <div className={classes.multiplierContainer}>
                <Button
                  className={classes.multiplier}
                  size="small"
                  color="primary"
                  variant="contained"
                  onClick={() => handleMultiplierButton(0.5)}
                >
                  <span className={classes.reverse}>1/2</span>
                </Button>
                <Button
                  className={classes.multiplier}
                  size="small"
                  color="primary"
                  variant="contained"
                  onClick={() => handleMultiplierButton(2)}
                >
                  <span className={classes.reverse}>2x</span>
                </Button>
              </div>
            </div>

            {/* Bust Price */}
            <div className={classes.title}>Bust Price</div>
            <ResultInput
              label=""
              value={bustPrice}
              readOnly
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    className={classes.inputIcon}
                    position="end"
                  >
                    <img 
                      src={selectedCoin.logo}
                      alt={`${selectedCoin.symbol} Icon`} 
                      style={{ width: 16, height: 16 }} 
                    />
                  </InputAdornment>
                ),
              }}
            />

            {/* Place Bet Button */}
            <Button 
              className={`${classes.placeBetButton} ${positionType === "long" ? "longButton" : "shortButton"}`}
              disabled={loading}
              onClick={handleBetClick}
            >
              {loading ? (
                <ClipLoader color="#fff" size={10} />
              ) : (
                `Place ${positionType.toUpperCase()}`
              )}
            </Button>
          </div>

          {/* Limbo Section */}
          <div className={classes.limboSection}>
            <div 
              ref={chartContainerRef} 
              style={{ 
                width: "100%", 
                height: "100%",
                backgroundColor: "#0c0d15",
                minHeight: window.innerWidth <= 960 ? "300px" : "100%", // Changed from 400px to 300px
              }}
            />
          </div>
        </div>
      </div>
      <div className={classes.orderContainer}>
        <div className={classes.tableContainer}>
          {openOrders.length > 0 ? (
            <TableContainer className={classes.tableContainer}>
              <Table className={classes.table}>
                <TableHead className={classes.tableHead}>
                  <TableRow>
                    <TableCell>Position</TableCell>
                    <TableCell>Asset</TableCell> {/* New column for purchased currency */}
                    <TableCell>Entry Price</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Leverage</TableCell>
                    <TableCell>Liquidation</TableCell>
                    <TableCell>Mark Price</TableCell>
                    <TableCell>PNL (ROE%)</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getSortedOrders().map((order) => (
                    <TableRow 
                      key={order._id} 
                      className={classes.tableRow}
                      data-order-id={order._id}
                      style={{ transition: 'opacity 0.2s ease-out' }}
                    >
                      <TableCell className={classes.tableCell}>
                        <div className={classes.symbolCell}>
                          <span className={`position-type ${order.positionType.toLowerCase()}`}>
                            {order.positionType.toUpperCase()}
                          </span>
                        </div>
                      </TableCell>

                      {/* New cell for purchased currency */}
                      <TableCell className={classes.tableCell}>
                        <div className={classes.symbolCell}>
                          <img 
                            src={COIN_LOGOS[order.currencyPurchased]} 
                            alt={order.currencyPurchased} 
                          />
                          <span>{order.currencyPurchased}</span>
                        </div>
                      </TableCell>

                      <TableCell className={classes.tableCell}>
                        <div className={classes.priceCell}>
                          <span className="price-icon">$</span>
                          <span className="price-value">
                            {Number(order.entryPrice).toLocaleString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <div className={classes.priceCell}>
                          <span className="price-icon">$</span>
                          <span className="price-value">
                            {/* Show the amount directly */}
                            {Number(order.amount).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <div className={classes.multiplierCell}>
                          <span className="multiplier-badge">
                            {order.multiplier}×
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <div className={classes.priceCell}>
                          <span className="price-icon">$</span>
                          <span className="price-value">
                            {Number(order.bustPrice).toLocaleString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <div className={classes.priceCell}>
                          <span className="price-icon">$</span>
                          <span className="price-value">
                            {Number(order.currentPrice).toLocaleString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <span className={order.pnl >= 0 ? classes.pnlPositive : classes.pnlNegative}>
                          {order.pnl > 0 ? '+' : ''}{Number(order.pnl).toFixed(2)}%
                        </span>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <div className={classes.actionCell}>
                          <button
                            className={classes.cashoutButton}
                            onClick={() => handleCashout(order._id)}
                            disabled={loadingButtons.has(order._id)}
                            style={{
                              opacity: loadingButtons.has(order._id) ? 0.7 : 1,
                              cursor: loadingButtons.has(order._id) ? 'not-allowed' : 'pointer'
                            }}
                          >
                            {loadingButtons.has(order._id) ? (
                              <ClipLoader color="#fff" size={10} />
                            ) : (
                              <>
                                <GoArrowSwitch size={14} />
                                Close
                              </>
                            )}
                          </button>
                          <button
                            className={classes.closeButton}
                            onClick={() => handleCashout(order._id)}
                            disabled={loadingButtons.has(order._id)}
                            style={{
                              opacity: loadingButtons.has(order._id) ? 0.7 : 1,
                              cursor: loadingButtons.has(order._id) ? 'not-allowed' : 'pointer'
                            }}
                          >
                            {loadingButtons.has(order._id) ? (
                              <ClipLoader color="#fff" size={10} />
                            ) : (
                              <AiOutlineClose size={14} />
                            )}
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <div className={classes.emptyState}>
              <RiExchangeFundsLine size={64} style={{ opacity: 0.5, color: '#848e9c' }} />
              <h3>No Open Positions</h3>
              <p>Your active trading positions will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Futures.propTypes = {
  user: PropTypes.object,
  isAuthenticated: PropTypes.bool,
  selectedCurrency: PropTypes.string.isRequired,
  selectedLogo: PropTypes.string.isRequired,
  selectedFiatCurrency: PropTypes.string.isRequired,
  DisplayFiat: PropTypes.string.isRequired,
  DisplayForFiat: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  isAuthenticated: state.auth.isAuthenticated,
  selectedCurrency: state.auth.selectedCurrency,
  selectedLogo: state.auth.selectedLogo,
  selectedFiatCurrency: state.auth.selectedFiatCurrency,
  DisplayFiat: state.auth.DisplayFiat,
  DisplayForFiat: state.auth.DisplayForFiat,
});

export default withRouter(
  connect(mapStateToProps, { updateCurrency, updateFiat, DisplayFiat })(Futures)
);
