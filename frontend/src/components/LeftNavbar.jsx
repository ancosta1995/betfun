import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, InputBase, Collapse } from '@material-ui/core';
import { 
  Menu, 
  Search, 
  Home, 
  Star, 
  Gift, 
  Trophy, 
  Gamepad2, 
  TrendingUp, 
  Bitcoin, 
  ChevronDown, 
  X,
  Newspaper,
  Building2,
  Pill,
  Swords,
  FileWarning,
  TestTube,
  Briefcase,
  User,
  Crown,
  Users,
  Wallet,
  History,
  Ethereum,
  Litecoin,
  Dogecoin,
  Ripple,
  Cardano,
  Solana,
  Polkadot,
  BinanceCoin
} from 'lucide-react';
import { NavLink as Link, useLocation, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../actions/auth";
import PropTypes from "prop-types";
import { Crisp } from "crisp-sdk-web";
import { motion, AnimatePresence } from "framer-motion";
import { ReactComponent as Slots } from "../assets/sidebar/slots.svg";
import { ReactComponent as blackjack } from "../assets/sidebar/blackjack.svg";
import { ReactComponent as roulette } from "../assets/sidebar/roulette.svg";
import { ReactComponent as gameshows } from "../assets/sidebar/gameshows.svg";
import { ReactComponent as baccarat } from "../assets/sidebar/baccarat.svg";
import { ReactComponent as livesupport } from "../assets/sidebar/livesupport.svg";
import { ReactComponent as livecasino } from "../assets/sidebar/livecasino.svg";
import { useNavigation } from '../context/NavigationContext';
import MainModal from "./modals/cashier/mainmodal";
import Bonus from '../views/Bonus';

import { themeConfig } from '../config/config';  // Adjust the path if necessary

const useStyles = makeStyles((theme) => ({

  toggleButton: {
    position: 'fixed',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 1001,
    background: '#5d4eff',
    color: 'white',
    border: 'none',
    padding: '10px',
    cursor: 'pointer',
    borderRadius: '0 4px 4px 0',
    '&:hover': {
      background: '#4a3ecc',
    },
  },
  root: {
    height: '100vh',
    backgroundColor: '#080808',
    color: 'white', 
    display: 'flex',
    flexDirection: 'column',
    width: '240px',
    maxWidth: '230px',
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 0 20px rgba(0,0,0,0.1)',
    position: 'relative',
    zIndex: 1,
    // overflowY: 'scroll',
    borderRight: '1px solid rgba(255,255,255,0.1)',

    '&::-webkit-scrollbar-track': {
      background: 'rgba(255,255,255,0.05)',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '3px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: 'rgba(255,255,255,0.2)',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      position: 'fixed',
      top: 0,
      left: 0,
      transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      height: 'calc(100% + 10px)',
      zIndex: 1000,
      marginBottom: '10px',
    },
  },
  rootHidden: {
    width: '80px',
    opacity: 0.8,
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    '& $menuItemText': {
      display: 'none',
    },
    '& $logo': {
      opacity: 1,
      width: 'auto',
      margin: '0 auto',
    },
    '& $searchContainer': {
      display: 'none'
    },
    '& $tokenContainer, & $tabContainer': {
      display: 'none'
    },
    '& $menuItem': {
      padding: '12px 8px',
      justifyContent: 'center',
      '& svg': {
        margin: 0,
        transform: 'scale(1.2)',
      },
      '&:hover': {
        background: 'rgba(93,78,255,0.1)',
        transform: 'scale(1.05)',
      },
      '&.active': {
        background: 'linear-gradient(45deg, hsl(251.31deg 75% 50%) 0%, hsl(251.31deg 75% 50%) 100%)',
        '& svg': {
          color: '#fff'
        }
      }
    },
    '& $badge': {
      display: 'none'
    },
    '& $menuList': {
      alignItems: 'center',
    },
    '& $menuGroupHeader': {
      padding: '10px 6px',
      justifyContent: 'center',
      '& span, & .chevron-icon': {
        display: 'none'
      },
      '& svg:first-child': {
        margin: 0,
        transform: 'scale(1.1)',
        position: 'relative',
        left: '50%',
        transform: 'translateX(-50%) scale(1.1)'
      }
    },
    '& $menuGroupItems': {
      padding: '2px',
      '& a': {
        transform: 'scale(0.9)',
        padding: '10px 16px',
      }
    },
    '& $weeklyRaceContainer': {
      padding: '20px',
      transform: 'scale(0.9)',
      '& $weeklyRaceText, & $weeklyRaceBadge': {
        display: 'none'
      },
      '& $weeklyRaceLink': {
        justifyContent: 'center',
        '& svg': {
          margin: 0,
          transform: 'scale(1.2)',
          opacity: 1,
          display: 'block',
          marginRight: 0,
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%) scale(1.2)'
        }
      }
    },
    '& $header': {
      justifyContent: 'center',
      '& svg': {
        transform: 'scale(1.4)',
        margin: 0
      }
    }
  },
  rootRemove: {
    opacity: 0,
    transform: 'translateX(-100%) scale(1)',
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    pointerEvents: 'none',
    visibility: 'hidden',
    position: 'fixed',
    left: 0,
    filter: 'blur(10px)',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 0 40px rgba(93,78,255,0.2)',
  },
  rootOpen: {
    [theme.breakpoints.down('sm')]: {
      transform: 'translateX(0)',
    },
    '& $header': {
      borderBottom: '2px solid rgba(93,78,255,0.3)',
    }
  },
  header: {
    height: "71px",
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    backdropFilter: 'blur(10px)',
    position: 'sticky',
    top: 0,
    zIndex: 3,
    backgroundColor: '#080808',
    [theme.breakpoints.down('sm')]: {
      padding: '15px',
    },
  },
  logo: {
    fontWeight: 'bold',
    fontSize: '20px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    background: 'linear-gradient(45deg, #5d4eff, #b53eff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    [theme.breakpoints.down('sm')]: {
      fontSize: '24px',
    },
  },
  menuButton: {
    color: 'white',
    padding: 0,
    minWidth: 'auto',
    '&:hover': {
      background: 'rgba(255,255,255,0.1)',
    },
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  tabContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '180px',
    gap: '6px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '160px',
    },
  },
  tab: {
    flex: 1,
    padding: '6px 12px',
    textAlign: 'center',
    cursor: 'pointer',
    borderRadius: '6px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '500',
    letterSpacing: '0.5px',
    transition: 'all 0.2s ease',
    background: 'rgba(255,255,255,0.05)',
    '&.active': {
      background: 'linear-gradient(45deg, hsl(251.31deg 75% 50%) 0%, hsl(251.31deg 75% 50%) 100%)',
      boxShadow: '0 4px 15px rgba(93,78,255,0.2)',
    },
    [theme.breakpoints.down('sm')]: {
      padding: '5px 10px',
      fontSize: '12px',
    },
  },
  menuItem: {
    
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '10px 14px',
    color: 'white',
    textDecoration: 'none',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    width: '100%',
    '&:hover': {
      background: 'rgba(93,78,255,0.1)',
      transform: 'translateX(4px)',
    },
    '&.active': {
     borderLeft: '2.5px solid hsl(251.31deg 75% 50%)',
      background: 'rgba(93,78,255,0.1)',
      '& svg': {
        color: '#fff'
      }
    },
    '& svg': {
      marginRight: '10px',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      width: '20px',
      height: '20px',
      color: 'white',
    }
  },
  menuItemText: {
    flex: 1,
    transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: 1,
    width: 'auto',
    fontSize: '13px',
    fontWeight: '400'
  },
  badge: {
    background: 'rgba(93,78,255,0.2)',
    color: '#5d4eff',
    padding: '3px 6px',
    borderRadius: '4px',
    fontSize: '11px',
    marginLeft: '8px',
    transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: 1,
    width: 'auto',
  },
  menuList: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '10px',
    width: '100%',
    gap: '6px',
    position: 'relative',
    zIndex: 1,
    overflowY: 'auto',
    scrollbarWidth: 'thin',
    scrollbarColor: `${themeConfig.scrollbarColor} ${themeConfig.defaultbackground}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      paddingBottom: '70px',
    },
  },
  menuGroup: {
    width: '100%',
    // overflow: 'hidden',
    background: 'rgba(255,255,255,0.02)',
    marginBottom: '2px',
    borderRadius: '6px',
  },
  menuGroupHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    borderRadius: '6px',
    position: 'relative',
    background: 'linear-gradient(45deg, hsl(251.31deg 75% 50%) 0%, hsl(251.31deg 75% 50%) 100%)',
    '&:hover': {
      background: 'linear-gradient(45deg, hsl(251.31deg 75% 50%) 0%, hsl(251.31deg 75% 50%) 100%)',
    },
  },
  menuGroupItems: {
    background: 'transparent',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    marginTop: "5px",
    gap: '2px',
  },
  customMenu: {
    
    position: 'absolute',
    top: '100%',
    left: '0',
    backgroundColor: '#1a1b29',
    borderRadius: '16px',
    padding: '12px',
    marginTop: '12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.24)',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    zIndex: 4,
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  customMenuItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 20px',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    textDecoration: 'none',
    width: '100%',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '500',
    '&:hover': {
      background: 'linear-gradient(45deg, rgba(93,78,255,0.1), rgba(93,78,255,0.2))',
      transform: 'translateX(5px)',
      '& svg': {
        color: 'white',
        transform: 'scale(1.1)',
      }
    },
    '& svg': {
      transition: 'all 0.3s ease',
      color: 'white',
    }
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 20px',
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), height 0.3s cubic-bezier(0.4, 0, 0.2, 1), padding 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'sticky',
    top: '71px',
    zIndex: 2,
    opacity: 1,
    height: 'auto',
    backgroundColor: '#080808',
    '& svg': {
      marginRight: '10px',
    },
  },
  searchInput: {
    color: 'white',
    textAlign: 'center',
    '&::placeholder': {
      color: 'rgba(255,255,255,0.5)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      textAlign: 'center'
    }
  },
  tokenContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px 20px',
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), height 0.3s cubic-bezier(0.4, 0, 0.2, 1), padding 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: 1,
    height: 'auto',
  },
  tokenIcon: {
    width: '24px',
    height: '24px',
    marginRight: '10px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  tokenInfo: {
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  tokenName: {
    fontSize: '14px',
    fontWeight: 'bold',
  },
  tokenPrice: {
    fontSize: '12px',
    color: '#5d4eff',
  },
  weeklyRaceContainer: {
    background: 'linear-gradient(45deg, rgba(93,78,255,0.1), rgba(93,78,255,0.2))',
    padding: '15px',
    borderRadius: '12px',
    border: '1px solid rgba(93,78,255,0.3)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    width: '100%',
    marginBottom: '10px',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 20px rgba(93,78,255,0.15)',
    }
  },
  weeklyRaceLink: {
    textDecoration: 'none',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '0',
    position: 'relative',
    '& svg': {
      color: '#5d4eff',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      marginRight: '12px'
    }
  },
  weeklyRaceText: {
    flex: 1,
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  weeklyRaceBadge: {
    background: 'rgba(93,78,255,0.3)',
    color: '#fff',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  menuIcon: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    color: 'white',
    '&:hover': {
      opacity: 0.8,
    },
  },
  liveSupportItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '10px 14px',
    color: 'white',
    textDecoration: 'none',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    width: '100%',
    cursor: 'pointer',
    '&:hover': {
      background: 'rgba(93,78,255,0.1)',
      transform: 'translateX(4px)',
      borderLeft: 'none !important'
    },
    '& svg': {
      marginRight: '10px',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      width: '20px',
      height: '20px',
      color: 'white',
    },
    borderLeft: 'none !important'
  },
}));

function MenuItem({ icon: Icon, text, to, badge, onClick }) {
  const classes = useStyles();
  const location = useLocation();
  const isActive = location?.pathname === to;
  const isExternalLink = to && typeof to === 'string' && to.startsWith('http');

  if (isExternalLink) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{ width: '100%' }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      >
        <a 
          href={to}
          className={classes.menuItem}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon size={text === "$2K Weekly Race" ? 16 : 20} />
          <span className={classes.menuItemText}>{text}</span>
          {badge && <span className={classes.badge}>{badge}</span>}
        </a>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{ width: '100%' }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
    >
      <Link 
        to={to} 
        className={`${classes.menuItem} ${isActive ? 'active' : ''}`}
        onClick={onClick}
      >
        <Icon size={text === "$2K Weekly Race" ? 16 : 20} />
        <span className={classes.menuItemText}>{text}</span>
        {badge && <span className={classes.badge}>{badge}</span>}
      </Link>
    </motion.div>
  );
}

function LiveSupportItem() {
  const classes = useStyles();
  const LiveSupportIcon = livesupport;
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{ width: '100%' }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
    >
      <div 
        className={classes.liveSupportItem}
        onClick={() => {
          if (window.Intercom && typeof window.Intercom === 'function') {
            window.Intercom('show');
          } else {
            console.warn("Intercom is not available");
            window.open("https://t.me/Rararahhhhh", "_blank");
          }
        }}
      >
        <LiveSupportIcon style={{ width: '20px', height: '20px', marginRight: '10px' }} />
        <span className={classes.menuItemText}>Live Support</span>
      </div>
    </motion.div>
  );
}

function MenuGroup({ title, icon: Icon, children }) {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(title === "Casino"); // Only Casino menu starts open

  return (
    <motion.div 
      className={classes.menuGroup}
      initial={false}
      animate={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className={classes.menuGroupHeader} 
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ backgroundColor: 'rgba(93,78,255,0.1)' }}
      >
        <motion.div style={{ display: 'flex', alignItems: 'center' }}>
          <Icon size={18} style={{ marginRight: '10px', opacity: 0.7 }} />
          <span style={{ fontSize: '13px', fontWeight: '500' }}>{title}</span>
        </motion.div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="chevron-icon"
        >
          <ChevronDown size={14} style={{ opacity: 0.7 }} />
        </motion.div>
      </motion.div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className={classes.menuGroupItems}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function LeftNavbar({ isAuthenticated, logout }) {
  const classes = useStyles();
  const [isHidden, setIsHidden] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const location = useLocation();
  const history = useHistory();
  const menuRef = React.useRef();
  const { isNavbarVisible, setIsNavbarVisible } = useNavigation();
  const [openCashier, setOpenCashier] = useState(false);
  const [openBonus, setOpenBonus] = useState(false);
  const [activeTab, setActiveTab] = useState('casino');

  useEffect(() => {
    if (window.innerWidth <= 600) {
      setIsNavbarVisible(false);
      setShowMenu(false);
    }
  }, [location, setIsNavbarVisible]);

  const toggleHidden = () => {
    setIsHidden(!isHidden);
  };

  const toggleNavbar = () => {
    setIsNavbarVisible(!isNavbarVisible);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'futures') {
      history.push('/futures');
    } else {
      history.push('/');  // or '/casino' or wherever you want casino tab to redirect
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const menuItems = [
    {
      text: 'Casino',
      to: '/casino',
      icon: Gamepad2
    },
    {
      text: 'Sports',
      to: '/sports',
      icon: Trophy
    },
    {
      text: 'Predictions',
      to: '/predictions',
      icon: TrendingUp
    },
    {
      text: 'Crypto',
      to: '/crypto',
      icon: Bitcoin
    }
  ];

  const activeMenuItem = menuItems.find(item => item.to === location.pathname) || menuItems[0];

  // Set active tab based on URL path
  useEffect(() => {
    if (location.pathname.startsWith('/futures')) {
      setActiveTab('futures');
    } else {
      setActiveTab('casino');
    }
  }, [location.pathname]);

  return (
    <>
      <motion.div 
        className={`${classes.root} ${isHidden ? classes.rootHidden : ''} ${!isNavbarVisible ? classes.rootRemove : ''}`}
        layout
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className={classes.header}>
          <div className={classes.menuIcon}>
            <Menu size={24} onClick={toggleHidden} />
          </div>
          <div className={classes.tabContainer}>
            <motion.div
              className={`${classes.tab} ${activeTab === 'casino' ? 'active' : ''}`}
              onClick={() => handleTabClick('casino')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Casino
            </motion.div>
            <motion.div
              className={`${classes.tab} ${activeTab === 'futures' ? 'active' : ''}`}
              onClick={() => handleTabClick('futures')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Futures
            </motion.div>
          </div>
        </div>

        <div className={classes.searchContainer}>
          <Search size={18} />
          <InputBase placeholder="Search" className={classes.searchInput} fullWidth />
        </div>

        <motion.div 
          className={classes.menuList}
          layout
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.div 
            className={classes.weeklyRaceContainer}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link to="/leaderboard" className={classes.weeklyRaceLink}>
              <Trophy size={20} />
              <span className={classes.weeklyRaceText}>Weekly Race</span>
              <span className={classes.weeklyRaceBadge}>2K$</span>
            </Link>
          </motion.div>

          <MenuGroup title="Casino" icon={Gamepad2}>
            <MenuItem icon={Home} text="Home" to="/home" />
            <MenuItem icon={Star} text="Originals" to="/originals" />
            <MenuItem icon={Slots} text="Slots" to="/slots" />
            <MenuItem icon={livecasino} text="Live Casino" to="/live" />
            <MenuItem icon={blackjack} text="Blackjack" to="/blackjack" />
            <MenuItem icon={roulette} text="Roulette" to="/roulette2" />
            <MenuItem icon={gameshows} text="Game Shows" to="/gameshows" />
            <MenuItem icon={baccarat} text="Baccarat" to="/baccarat" />
            <LiveSupportItem />
          </MenuGroup>

          <MenuGroup title="Futures" icon={TrendingUp}>
            <MenuItem 
              icon={() => (
                <div style={{ display: 'flex', alignItems: 'center', width: '24px', height: '24px', marginRight: '8px' }}>
                  <img 
                    src="https://assets.coingecko.com/coins/images/1/small/bitcoin.png" 
                    alt="BTC" 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                  />
                </div>
              )} 
              text="Bitcoin" 
              to="/futures/BTC" 
              badge="BTC" 
            />
            <MenuItem 
              icon={() => (
                <div style={{ display: 'flex', alignItems: 'center', width: '24px', height: '24px', marginRight: '8px' }}>
                  <img 
                    src="https://assets.coingecko.com/coins/images/279/small/ethereum.png" 
                    alt="ETH" 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                  />
                </div>
              )} 
              text="Ethereum" 
              to="/futures/ETH" 
              badge="ETH" 
            />
            <MenuItem 
              icon={() => (
                <div style={{ display: 'flex', alignItems: 'center', width: '24px', height: '24px', marginRight: '8px' }}>
                  <img 
                    src="https://assets.coingecko.com/coins/images/2/small/litecoin.png" 
                    alt="LTC" 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                  />
                </div>
              )} 
              text="Litecoin" 
              to="/futures/LTC" 
              badge="LTC" 
            />
            <MenuItem 
              icon={() => (
                <div style={{ display: 'flex', alignItems: 'center', width: '24px', height: '24px', marginRight: '8px' }}>
                  <img 
                    src="https://assets.coingecko.com/coins/images/4128/small/solana.png" 
                    alt="SOL" 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                  />
                </div>
              )} 
              text="Solana" 
              to="/futures/SOL" 
              badge="SOL" 
            />
            <MenuItem 
              icon={() => (
                <div style={{ display: 'flex', alignItems: 'center', width: '24px', height: '24px', marginRight: '8px' }}>
                  <img 
                    src="https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png" 
                    alt="XRP" 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                  />
                </div>
              )} 
              text="Ripple" 
              to="/futures/XRP" 
              badge="XRP" 
            />
            <MenuItem 
              icon={() => (
                <div style={{ display: 'flex', alignItems: 'center', width: '24px', height: '24px', marginRight: '8px' }}>
                  <img 
                    src="https://assets.coingecko.com/coins/images/975/small/cardano.png" 
                    alt="ADA" 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                  />
                </div>
              )} 
              text="Cardano" 
              to="/futures/ADA" 
              badge="ADA" 
            />
            <MenuItem 
              icon={() => (
                <div style={{ display: 'flex', alignItems: 'center', width: '24px', height: '24px', marginRight: '8px' }}>
                  <img 
                    src="https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png" 
                    alt="AVAX" 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                  />
                </div>
              )} 
              text="Avalanche" 
              to="/futures/AVAX" 
              badge="AVAX" 
            />
          </MenuGroup>

          <MenuGroup title="Profile" icon={User}>
            <MenuItem 
              icon={Crown} 
              text="VIP" 
              to="/vip" 
              onClick={(e) => {
                e.preventDefault();
                setOpenBonus(true);
              }}
            />
            <MenuItem icon={Users} text="Affiliates" to="/affiliates" />
            <MenuItem icon={User} text="Profile" to="/profile" />
            <MenuItem 
              icon={Wallet} 
              text="Wallet" 
              to="/wallet" 
              onClick={(e) => {
                e.preventDefault();
                setOpenCashier(!openCashier);
              }}
            />
          </MenuGroup>

        </motion.div>
      </motion.div>

      <MainModal open={openCashier} handleClose={() => setOpenCashier(false)} />
      <Bonus open={openBonus} onClose={() => setOpenBonus(false)} />
    </>
  );
}

LeftNavbar.propTypes = {
  isAuthenticated: PropTypes.bool,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { logout })(LeftNavbar);