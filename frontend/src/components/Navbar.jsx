import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { AppBar, Toolbar, Typography, Button, IconButton, Avatar, Badge, TextField, Switch} from '@material-ui/core';
import { Notifications, Chat, ExpandMore, Search, Crown } from '@material-ui/icons';
import { motion } from 'framer-motion';
import { styled } from '@material-ui/core/styles';
import { FaUser, FaWallet, FaCrown, FaCode, FaUserFriends, FaCog, FaLifeRing, FaSignOutAlt, FaAngleRight } from 'react-icons/fa';
import { MdChat } from "react-icons/md";
import { SiRocketdotchat } from "react-icons/si";

import { Close as CloseIcon } from '@material-ui/icons';
import { makeStyles } from "@material-ui/core";
import { logout } from "../actions/auth";
import { useToasts } from "react-toast-notifications";
import { useHistory } from 'react-router-dom';
import Wallet from "./modals/user/WalletModal";
import Coupon from "./modals/CouponModal";
import Free from "./modals/rewards/FreeModal";
import { getUserVipData } from "../services/api.service";
import Race from "./modals/RaceModal";
import Support from "./modals/user/SupportModal";
import Profile from "./modals/user/ProfileModal";
import LoginModal from "./modals/login/LoginModal";
import Rewards from "./modals/rewards/RewardsModal";
import Affiliates from "./modals/affiliates/AffiliatesModal";
import TermsModal from "./modals/TermsModal";
import About from "./modals/AboutModal";
import CashierModal from "./modals/cashier/CashierModal";
import MainModal from "./modals/cashier/mainmodal";
import AccountMenu from './modals/user/AccountMenu';
import RewardsModal from "./modals/rewards/RewardsModal";
import CouponModal from "./modals/CouponModal";
import FreeModal from "./modals/rewards/FreeModal";
import AffiliatesModal from "./modals/affiliates/AffiliatesModal";
import prices from './Prices.json'; // Adjust the path as necessary
import WalletSettings  from "./wallet/settings";
import { useStyles, LogoImage, StyledAppBar, NotificationContainer, IconWrapper, NotificationItem, NotificationTitle, NotificationDescription, NotificationTime, DeleteIcon, LogoContainer, Logo, LogoText, BalanceButton, CashierButton, Dropdown, FixedHeader, ScrollableContent, DropdownContent, DropdownFooter, DropdownItem, DropdownIcon, DropdownText } from './navbarstyle'; 
import { updateCurrency, updateFiat, DisplayFiat } from '../actions/auth';
import Bonus from '../views/Bonus'; // Import your Bonus component
import logo from "../assets/logo.png";
import NotificationModal from './Notify'; // Import in any component

//assets

import bitcoin from "../assets/coin/btc.svg";
import ethereum from "../assets/coin/eth.svg";
import litecoin from "../assets/coin/ltc.svg";
import dogecoin from "../assets/coin/doge.svg";
import trx from "../assets/coin/trx.svg";
import ton from "../assets/coin/ton.svg";
import solana from "../assets/coin/sol.svg";
import usdc from "../assets/coin/usdc.svg";
import usdt from "../assets/coin/usdt.svg";
import avax from "../assets/coin/avax.svg";
import bnb from "../assets/coin/bnb.svg";
import shib from "../assets/coin/shib.webp";
import matic from "../assets/coin/matic.svg";
import xrp from "../assets/coin/xrp.svg";
import usd from "../assets/coin/usd.svg";

const colors = ['#101123'];
function Navbar(props) {
  const { isAuthenticated, isLoading, user, logout, mobileChat, setMobile, selectedCurrency, selectedLogo, selectedFiatCurrency, updateCurrency, updateFiat, DisplayFiat, DisplayForFiat } = props;

    const [anchorEl, setAnchorEl] = useState(null);
    const history = useHistory();
  const [balanceAnchorEl, setBalanceAnchorEl] = useState(null);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [openGames, setOpenGames] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openProfileMobile, setOpenProfileMobile] = useState(false);
  const [openCashier, setOpenCashier] = useState(false);
  const [openBonus, setOpenBonus] = useState(false);

  const [openLogin, setOpenLogin] = useState(false);
  const [openRace, setOpenRace] = useState(false);

  const [openRewards, setOpenRewards] = useState(false);
  const [openCoupon, setOpenCoupon] = useState(false);
  const [openFree, setOpenFree] = useState(false);
  const [openAffiliates, setOpenAffiliates] = useState(false);
  const [openSupport, setOpenSupport] = useState(false);
  const [openTerms, setOpenTerms] = useState(false);
  const [openAdmin, setOpenAdmin] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
const [isBalanceDropdownOpen, setIsBalanceDropdownOpen] = useState(false);
const [searchTerm, setSearchTerm] = useState('');
  const [displayInFiat, setDisplayInFiat] = useState(true);
  const [hideZeroBalances, setHideZeroBalances] = useState(false);
  const [openWalletSettings, setOpenWalletSettings] = useState(false);

  // Use it to open login/register modal
  const [ loginMode, setLoginMode ] = useState('login');

  const handleWalletSettingsOpen = () => {
    setOpenWalletSettings(true);
  };

  const handleWalletSettingsClose = () => {
    setOpenWalletSettings(false);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to toggle the modal
  const handleOpenModal = () => {
    setIsModalOpen(prev => !prev);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


const classes = useStyles();
const toggleBalanceDropdown = () => {
  setIsBalanceDropdownOpen(prev => !prev);
};
const [open, setOpen] = useState(false);

// Sample notifications
const notifications = [
  { title: 'Deposit Confirmed', amount: 120.25, status: 'confirmed' },
  { title: 'Deposit Pending', amount: 120.25, status: 'pending', timestamp: '5 days ago' },
  { title: 'Deposit Confirmed', amount: 150.62, status: 'confirmed' },
  { title: 'Deposit Pending', amount: 150.62, status: 'pending', timestamp: '5 days ago' },
];

// Handlers to open and close the modal
const handleOpen = () => setOpen(true);
const handleCloses = () => setOpen(false);

  // const [notifications, setNotifications] = useState([
  //   { id: 1, title: 'Promotional Balance Unlocked', description: 'Your promotional balance has been unlocked and added to your balance.', time: '5 days ago' },
  //   { id: 2, title: 'Promotional Balance Unlocked', description: 'Your promotional balance has been unlocked and added to your balance.', time: '6 days ago' },
  //   { id: 3, title: 'Deposit Successful', description: 'Your deposit of TRX 760.170397 is now complete and BRL 605.70 has been added to your balance', time: '10 days ago' },
  //   { id: 4, title: 'Deposit Successful', description: 'Your deposit of TRX 760.170397 is now complete and BRL 606.05 has been added to your balance', time: '10 days ago' },
  //   { id: 5, title: 'Deposit Pending', description: 'Your deposit of TRX 760.170397 is currently pending', time: '10 days ago' },
  //   { id: 6, title: 'Deposit Successful', description: 'Your deposit of TRX 628.34102 is now complete and BRL 497.30 has been added to your balance', time: '12 days ago' },
  //   { id: 7, title: 'Deposit Pending', description: 'Your deposit of TRX 628.34102 is currently pending', time: '12 days ago' },
  //   { id: 8, title: 'Deposit Successful', description: 'Your deposit of TRX 719.00 is now complete and BRL 583.10 has been added to your balance', time: 'Just now' },
  // ]);
  const balances = user && user.wallet ? [
    // { currency: 'BTC', amount: user.wallet["BTC"].balance, logo: bitcoin },
    // { currency: 'ETH', amount: user.wallet["ETH"].balance, logo: ethereum },
    // { currency: 'DOGE', amount: user.wallet["DOGE"].balance, logo: dogecoin },
    // { currency: 'LTC', amount: user.wallet["LTC"].balance, logo: litecoin },
    // { currency: 'USDT', amount: user.wallet["USDT"].balance, logo: usdt },
    // { currency: 'USDC', amount: user.wallet["USDC"].balance, logo: usdc },
    { currency: 'USD', amount: user.wallet["USD"].balance, logo: usd },

    // { currency: 'JESTER', amount: user.wallet["JESTER"].balance, logo: 'https://example.com/logos/jester-logo.png' }, // Replace with actual logo URL
    // { currency: 'TRX', amount: user.wallet["TRX"].balance, logo: trx },
    // { currency: 'MATIC', amount: user.wallet["MATIC"].balance, logo: matic },
    // { currency: 'XRP', amount: user.wallet["XRP"].balance, logo: xrp },
    // { currency: 'SOL', amount: user.wallet["SOL"].balance, logo: solana },
    // { currency: 'SHIB', amount: user.wallet["SHIB"].balance, logo: shib },
    // { currency: 'TON', amount: user.wallet["TON"].balance, logo: ton } // Replace with actual logo URL
  ] : [];
  
  const handleUserDropdownToggle = () => {
    setIsUserDropdownOpen(prev => !prev);
    if (isBalanceDropdownOpen) {
      setIsBalanceDropdownOpen(false);
    }
  };
  const handleCurrencySelection = (currency, logo) => {
    updateCurrency(currency, logo); // Pass selectedFiatCurrency as well
    setIsBalanceDropdownOpen(false); // Close the dropdown after selection
};
const handleFiatSelection = (Fiatcurrency) => {
  updateFiat(selectedFiatCurrency); // Pass selectedFiatCurrency as well
  setIsBalanceDropdownOpen(false); // Close the dropdown after selection
};



   console.log("selected fiat currency", selectedFiatCurrency);

const handleBalanceDropdownToggle = () => {
    setIsBalanceDropdownOpen(prev => !prev);
  };
  const handleClickOutside = (event) => {
    if (balanceDropdownRef.current && !balanceDropdownRef.current.contains(event.target) && 
        !balanceButtonRef.current.contains(event.target)) {
      setIsBalanceDropdownOpen(false);
    }
    if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
      setIsUserDropdownOpen(false);
    }
    if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
      // setNotificationsVisible(false);
    }
  };
  const balanceRef = useRef(null);
  const balanceButtonRef = useRef(null);
  const [balance, setBalance] = useState(1000.00);
  const balanceDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const handleClose = () => {
    setAnchorEl(null);
    setBalanceAnchorEl(null);
    // setNotificationsVisible(false);
  };

  const handleMenu = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleBalanceMenu = (event) => {
    event.stopPropagation(); // Prevent the click from immediately triggering the document click handler
    setIsBalanceDropdownOpen(prev => !prev);
    
    if (isUserDropdownOpen) {
      setIsUserDropdownOpen(false);
    }
    if (notificationsVisible) {
      // setNotificationsVisible(false);
    }
  };
  
  const handleNotificationsClick = () => {
    // setNotificationsVisible(!notificationsVisible);
    if (balanceAnchorEl) {
      setBalanceAnchorEl(false); // Close balance dropdown if it's open
    }
    if (anchorEl) {
      setAnchorEl(null); // Close user dropdown if it's open
    }
  };

  const handleDeleteNotification = (id) => {
    // setNotifications(notifications.filter(notif => notif.id !== id));
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const fiatCurrencies = ['USD', 'EUR', 'IDR', 'TRY', 'MXN', 'BRL', 'JPY', 'CAD', 'CNY', 'DKK', 'KRW', 'PHP', 'NZD', 'ARS', 'RUB'];

  
  const formatBalance = (amount, currency) => {
    if (DisplayForFiat) {
      if (currency in prices && selectedFiatCurrency in prices[currency]) {
        const conversionRate = prices[currency][selectedFiatCurrency];
        if (conversionRate <= 0) {
          throw new Error('Invalid conversion rate');
        }
        // Convert the cryptocurrency amount to fiat currency
        const fiatAmount = amount * conversionRate;
        return new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: selectedFiatCurrency 
        }).format(fiatAmount);
      } else {
        throw new Error('Currency not supported');
      }
    } else {
      // Format the cryptocurrency amount
      return new Intl.NumberFormat('en-US', { 
        minimumFractionDigits: 8,
        maximumFractionDigits: 9,
      }).format(amount);
    }
  };
  console.log("Display for fiat", DisplayForFiat)
  console.log("Display fiat", DisplayFiat)

  const filteredBalances = balances
    .filter(balance => balance.currency.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(balance => !hideZeroBalances || balance.amount > 0);
  return (
    <>
      <WalletSettings
        open={openWalletSettings}
        onClose={handleWalletSettingsClose}
        currencies={fiatCurrencies}
      />
      <Race open={openRace} handleClose={() => setOpenRace(!openRace)} />
      <Bonus open={isModalOpen} onClose={handleCloseModal} />

      <MainModal open={openCashier} handleClose={() => setOpenCashier(!openCashier)} />
      {}
      <LoginModal open={openLogin} handleClose={() => setOpenLogin(!openLogin)} mode={loginMode} />
      <RewardsModal open={openRewards} handleClose={() => setOpenRewards(!openRewards)} />
      <CouponModal open={openCoupon} handleClose={() => setOpenCoupon(!openCoupon)} />
      <AffiliatesModal open={openAffiliates} handleClose={() => setOpenAffiliates(!openAffiliates)} />
      <Support open={openSupport} handleClose={() => setOpenSupport(!openSupport)} />
      <TermsModal open={openTerms} handleClose={() => setOpenTerms(!openTerms)} />
      <StyledAppBar position="static">
        <Toolbar>
          <LogoContainer>
    <div className={classes.logoContainer}>

    <motion.img
              src={logo}
              alt="Logo"
              className={classes.logo2}

              onClick={() => { history.push(`/home`) }}
              whileHover={{ scale: 1.05 }} // Optional: Zoom effect on hover
              whileTap={{ scale: 0.98 }} // Optional: Scale down when clicked
            />
    </div>
          </LogoContainer>
                  <motion.div whileTap={{ scale: 0.97 }} className={classes.home} onClick={() => history.push(`/home`)}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 17.5V11.3333C7.5 10.8666 7.5 10.6333 7.59083 10.455C7.67072 10.2982 7.79821 10.1707 7.95501 10.0908C8.13327 9.99999 8.36662 9.99999 8.83333 9.99999H11.1667C11.6334 9.99999 11.8667 9.99999 12.045 10.0908C12.2018 10.1707 12.3293 10.2982 12.4092 10.455C12.5 10.6333 12.5 10.8666 12.5 11.3333V17.5M9.18141 2.30333L3.52949 6.69927C3.15168 6.99312 2.96278 7.14005 2.82669 7.32405C2.70614 7.48704 2.61633 7.67065 2.56169 7.86588C2.5 8.08627 2.5 8.32558 2.5 8.80421V14.8333C2.5 15.7667 2.5 16.2335 2.68166 16.59C2.84144 16.9036 3.09641 17.1585 3.41002 17.3183C3.76654 17.5 4.23325 17.5 5.16667 17.5H14.8333C15.7668 17.5 16.2335 17.5 16.59 17.3183C16.9036 17.1585 17.1586 16.9036 17.3183 16.59C17.5 16.2335 17.5 15.7667 17.5 14.8333V8.80421C17.5 8.32558 17.5 8.08627 17.4383 7.86588C17.3837 7.67065 17.2939 7.48704 17.1733 7.32405C17.0372 7.14005 16.8483 6.99312 16.4705 6.69927L10.8186 2.30333C10.5258 2.07562 10.3794 1.96177 10.2178 1.918C10.0752 1.87938 9.92484 1.87938 9.78221 1.918C9.62057 1.96177 9.47418 2.07562 9.18141 2.30333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </motion.div>
          <div style={{ flexGrow: 1 }} />
          {isAuthenticated && user ? (
    <>
<div style={{ userSelect: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', position: 'relative' }}>
              <BalanceButton onClick={handleBalanceMenu} ref={balanceButtonRef}>
                <LogoImage src={selectedLogo} alt={selectedCurrency} />
                {formatBalance(user.wallet[selectedCurrency].balance, selectedCurrency)}
                                <ExpandMore style={{ marginLeft: '4px' }} />
              </BalanceButton>
              {isBalanceDropdownOpen && (
  <Dropdown ref={balanceDropdownRef}
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <TextField
      className={classes.searchInput}
      fullWidth
      placeholder="Search"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      InputProps={{
        startAdornment: (
          <div className="search-icon-container">
            <Search style={{ marginBottom: "0.15rem", color: '#9E9FBD', fontSize: '1.2em' }} />
          </div>
        ),
        style: { height: '2.5em' },
      }}
    />
    <DropdownContent>
      {filteredBalances.map(({ amount, currency, logo }) => (
        <DropdownItem
          key={currency}
          onClick={() => {
            updateCurrency(currency, logo);
            setIsBalanceDropdownOpen(false);
          }}
        >
          <DropdownIcon src={logo} alt={currency} />
          <DropdownText>
            <span>{currency}</span>
            <span>{formatBalance(amount, currency)}</span>
          </DropdownText>
        </DropdownItem>
      ))}
    </DropdownContent>
    {/* <DropdownFooter
      onClick={() => { 
        handleWalletSettingsOpen();
        handleClose(); // Optionally close the user dropdown
      }}
    >
      Wallet Settings
    </DropdownFooter> */}
  </Dropdown>
)}
      {/* Visible on screen sizes larger than 'xs' */}
      <motion.div
        whileHover={{ opacity: 0.95 }}
        whileTap={{ scale: 0.97 }}
        className={`${classes.cashierButtons} ${classes.cashierButtonLg}`}
        onClick={() => setOpenCashier(!openCashier)}
      >
        <svg style={{ height: 20, width: 20 }} viewBox="0 0 14 15" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.125 10.5029V11.5967C13.125 12.2 12.6341 12.6904 12.0312 12.6904H2.625C1.65987 12.6904 0.875 11.9056 0.875 10.9404C0.875 10.9404 0.875 3.50949 0.875 3.50293C0.875 2.5378 1.65987 1.75293 2.625 1.75293H10.7188C11.0814 1.75293 11.375 2.04693 11.375 2.40918C11.375 2.77143 11.0814 3.06543 10.7188 3.06543H2.625C2.38394 3.06543 2.1875 3.26143 2.1875 3.50293C2.1875 3.74443 2.38394 3.94043 2.625 3.94043H12.0312C12.6341 3.94043 13.125 4.43087 13.125 5.03418V6.12793H10.9375C9.73131 6.12793 8.75 7.10924 8.75 8.31543C8.75 9.52162 9.73131 10.5029 10.9375 10.5029H13.125Z"></path>
          <path d="M13.125 7.00293V9.62793H10.9375C10.2126 9.62793 9.625 9.04037 9.625 8.31543C9.625 7.59049 10.2126 7.00293 10.9375 7.00293H13.125Z"></path>
        </svg>
        Cashier
      </motion.div>
      {/* <motion.div
        whileHover={{ opacity: 0.95 }}
        whileTap={{ scale: 0.97 }}
        className={`${classes.cashierButtons} ${classes.cashierButtonLg}`}
        onClick={() => setOpenRace(!openRace)}
      >
        <svg style={{ height: 20, width: 20 }} viewBox="0 0 14 15" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.125 10.5029V11.5967C13.125 12.2 12.6341 12.6904 12.0312 12.6904H2.625C1.65987 12.6904 0.875 11.9056 0.875 10.9404C0.875 10.9404 0.875 3.50949 0.875 3.50293C0.875 2.5378 1.65987 1.75293 2.625 1.75293H10.7188C11.0814 1.75293 11.375 2.04693 11.375 2.40918C11.375 2.77143 11.0814 3.06543 10.7188 3.06543H2.625C2.38394 3.06543 2.1875 3.26143 2.1875 3.50293C2.1875 3.74443 2.38394 3.94043 2.625 3.94043H12.0312C12.6341 3.94043 13.125 4.43087 13.125 5.03418V6.12793H10.9375C9.73131 6.12793 8.75 7.10924 8.75 8.31543C8.75 9.52162 9.73131 10.5029 10.9375 10.5029H13.125Z"></path>
          <path d="M13.125 7.00293V9.62793H10.9375C10.2126 9.62793 9.625 9.04037 9.625 8.31543C9.625 7.59049 10.2126 7.00293 10.9375 7.00293H13.125Z"></path>
        </svg>
        Race
      </motion.div> */}


      {/* Visible on screen sizes 'xs' */}
      <motion.div
        whileHover={{ opacity: 0.95 }}
        whileTap={{ scale: 0.97 }}
        className={`${classes.cashierButton} ${classes.cashierButtonXs}`}
        onClick={() => setOpenCashier(!openCashier)}
      >
        <svg style={{ height: 20, width: 20 }} viewBox="0 0 14 15" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.125 10.5029V11.5967C13.125 12.2 12.6341 12.6904 12.0312 12.6904H2.625C1.65987 12.6904 0.875 11.9056 0.875 10.9404C0.875 10.9404 0.875 3.50949 0.875 3.50293C0.875 2.5378 1.65987 1.75293 2.625 1.75293H10.7188C11.0814 1.75293 11.375 2.04693 11.375 2.40918C11.375 2.77143 11.0814 3.06543 10.7188 3.06543H2.625C2.38394 3.06543 2.1875 3.26143 2.1875 3.50293C2.1875 3.74443 2.38394 3.94043 2.625 3.94043H12.0312C12.6341 3.94043 13.125 4.43087 13.125 5.03418V6.12793H10.9375C9.73131 6.12793 8.75 7.10924 8.75 8.31543C8.75 9.52162 9.73131 10.5029 10.9375 10.5029H13.125Z"></path>
          <path d="M13.125 7.00293V9.62793H10.9375C10.2126 9.62793 9.625 9.04037 9.625 8.31543C9.625 7.59049 10.2126 7.00293 10.9375 7.00293H13.125Z"></path>
        </svg>
      </motion.div>


          </div>
          <div style={{ flexGrow: 1 }} />
    <div className={classes.container}>
    <motion.div    className={classes.chatButton}    >
    <NotificationModal open={open} handleClose={handleClose} notifications={notifications} />


            </motion.div>
        </div>


<motion.div
  className={classes.chatButton}
  onClick={handleOpenModal}
>  <IconButton color="inherit" style={{ padding: 0, fontSize: '28px' }}> {/* Boyut küçültme ve padding sıfırlama */}
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" width="20px" height="20px" className="text-base text-neutral">
      <path fill="currentColor" fillRule="evenodd" d="M6.05 8.48 9.4 2.36a.68.68 0 0 1 1.2 0l3.35 6.12 4.06-2.05c.52-.27 1.1.21.97.8l-1.7 7.82a.7.7 0 0 1-.68.56H3.4a.7.7 0 0 1-.67-.56L1.02 7.23c-.13-.59.45-1.07.97-.8zM10 14.4c0-1.15-.7-3.45-3.5-3.45 1.17 0 3.5-.69 3.5-3.44 0 1.15.7 3.44 3.5 3.44-1.17 0-3.5.7-3.5 3.45" clipRule="evenodd"></path>
      <path fill="currentColor" d="M3.45 16.57a.7.7 0 0 0-.68.71c0 .4.3.72.68.72h13.1a.7.7 0 0 0 .68-.72.7.7 0 0 0-.68-.71z"></path>
    </svg>
  </IconButton>
</motion.div>

<motion.div
  whileTap={{ scale: 0.97 }}
  className={classes.chatButton}
  onClick={() => setMobile(!mobileChat)}
  
>  
  <IconButton color="inherit" style={{ padding: 0, fontSize: '28px' }}> {/* Boyut küçültme ve padding sıfırlama */}
    <svg 
      fill="currentColor" 
      height="20px" 
      width="20px" 
      version="1.1" 
      id="Layer_1" 
      xmlns="http://www.w3.org/2000/svg" 
      xmlnsXlink="http://www.w3.org/1999/xlink" 
      viewBox="0 0 512.002 512.002" 
      xmlSpace="preserve"
    >
      <g>
        <g>
          <path d="M256.002,21.334c-141.163,0-256,95.701-256,213.333c0,41.643,14.165,79.381,43.285,115.157
            c0.789,16.811-0.192,67.584-37.035,104.427c-6.997,6.997-8.256,17.856-3.093,26.261c3.968,6.443,10.923,10.155,18.176,10.155
            c2.219,0,4.48-0.341,6.677-1.067c5.803-1.92,12.288-3.947,19.264-6.123c36.459-11.371,86.784-27.072,126.272-53.76
            c26.176,11.051,44.565,18.283,82.453,18.283c141.163,0,256-95.701,256-213.333S397.164,21.334,256.002,21.334z M149.335,149.334
            h149.333c11.776,0,21.333,9.557,21.333,21.333s-9.557,21.333-21.333,21.333H149.335c-11.776,0-21.333-9.557-21.333-21.333
            S137.559,149.334,149.335,149.334z M362.668,277.334H149.335c-11.776,0-21.333-9.557-21.333-21.333
            c0-11.776,9.557-21.333,21.333-21.333h213.333c11.776,0,21.333,9.557,21.333,21.333
            C384.002,267.777,374.444,277.334,362.668,277.334z"/>
        </g>
      </g>
    </svg>
  </IconButton>
</motion.div>


            <AccountMenu />
            {/* <Bonus /> */}


            
          </>
          ) : (
            <>
            <motion.div whileTap={{ scale: 0.97}} className={classes.signin} onClick={() => {setLoginMode("login"); setOpenLogin(!openLogin)}}>
              <svg className={classes.buttonIcon} tabIndex="-1" viewBox="0 0 512 512"><path d="M416 448h-84c-6.6 0-12-5.4-12-12v-24c0-6.6 5.4-12 12-12h84c26.5 0 48-21.5 48-48V160c0-26.5-21.5-48-48-48h-84c-6.6 0-12-5.4-12-12V76c0-6.6 5.4-12 12-12h84c53 0 96 43 96 96v192c0 53-43 96-96 96zM167.1 83.5l-19.6 19.6c-4.8 4.8-4.7 12.5.2 17.1L260.8 230H12c-6.6 0-12 5.4-12 12v28c0 6.6 5.4 12 12 12h248.8L147.7 391.7c-4.8 4.7-4.9 12.4-.2 17.1l19.6 19.6c4.7 4.7 12.3 4.7 17 0l164.4-164c4.7-4.7 4.7-12.3 0-17l-164.4-164c-4.7-4.6-12.3-4.6-17 .1z"></path></svg>
              Sign in   
            </motion.div>
            &nbsp;
            <motion.div whileTap={{ scale: 0.97}} className={classes.signin} onClick={() => {setLoginMode("registration"); setOpenLogin(!openLogin)}}>
              <svg className={classes.buttonIcon} tabIndex="-1" viewBox="0 0 512 512"><path d="M416 448h-84c-6.6 0-12-5.4-12-12v-24c0-6.6 5.4-12 12-12h84c26.5 0 48-21.5 48-48V160c0-26.5-21.5-48-48-48h-84c-6.6 0-12-5.4-12-12V76c0-6.6 5.4-12 12-12h84c53 0 96 43 96 96v192c0 53-43 96-96 96zM167.1 83.5l-19.6 19.6c-4.8 4.8-4.7 12.5.2 17.1L260.8 230H12c-6.6 0-12 5.4-12 12v28c0 6.6 5.4 12 12 12h248.8L147.7 391.7c-4.8 4.7-4.9 12.4-.2 17.1l19.6 19.6c4.7 4.7 12.3 4.7 17 0l164.4-164c4.7-4.7 4.7-12.3 0-17l-164.4-164c-4.7-4.6-12.3-4.6-17 .1z"></path></svg>
              Register   
            </motion.div>
            </>
          )}
          
        </Toolbar>
      </StyledAppBar>

    </>

  );
};

Navbar.propTypes = {
  isAuthenticated: PropTypes.bool,
  isLoading: PropTypes.bool,
  user: PropTypes.object,
  logout: PropTypes.func.isRequired,
  
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading,
  user: state.auth.user,
  selectedCurrency: state.auth.selectedCurrency,
  selectedLogo: state.auth.selectedLogo,
  selectedFiatCurrency: state.auth.selectedFiatCurrency,
  DisplayFiat: state.auth.DisplayFiat,
  DisplayForFiat: state.auth.DisplayForFiat,
});

export default connect(mapStateToProps, { logout, updateCurrency, updateFiat, DisplayFiat })(Navbar);
