import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Modal, Tabs, Tab, IconButton, Button, Typography, Grid, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import { motion, AnimatePresence } from 'framer-motion';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import CallMadeIcon from '@material-ui/icons/CallMade';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import CloseIcon from '@material-ui/icons/Close';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { QRCodeSVG } from "qrcode.react";
import { useToasts } from "react-toast-notifications";
import SearchIcon from '@material-ui/icons/Search';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { getUserCryptoInformation, withdrawCryptomain as withdrawCryptoFunction } from "../../../services/api.service";
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { changeWallet } from "../../../actions/auth";
import WarningIcon from '@material-ui/icons/Warning';
import usdtIcon from '../../../assets/coin/usdt.svg';
import usdcIcon from '../../../assets/coin/usdc.svg';
import ethIcon from '../../../assets/coin/eth.svg';
import btcIcon from '../../../assets/coin/btc.svg';
import ltcIcon from '../../../assets/coin/ltc.svg';
import dogeIcon from '../../../assets/coin/doge.svg';
import bnbIcon from '../../../assets/coin/bnb.svg';
import bchIcon from '../../../assets/coin/bnb.svg';
import xmrIcon from '../../../assets/coin/bnb.svg';
import dgbIcon from '../../../assets/coin/bnb.svg';
import shibIcon from '../../../assets/coin/shib.webp';
import tonIcon from '../../../assets/coin/ton.svg';
import errorAudio from "../../../assets/sounds/error.mp3";

console.log("Imported functions:", { 
  getUserCryptoInformation, 
  withdrawCryptoFunction 
});

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  container: {
    backgroundColor: 'rgba(10, 11, 28, 0.95)',
    color: '#fff', 
    borderRadius: '12px 12px 0 0',
    width: '95%',
    maxWidth: '500px',
    height: "auto",
    minHeight: "50vh",
    maxHeight: "80vh",
    fontFamily: "'Inter', sans-serif",
    border: '1px solid rgba(123, 121, 247, 0.15)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    outline: 'none',
    position: 'relative',
    margin: 'auto',
    
    [theme.breakpoints.down('sm')]: {
      width: '95%',
      maxWidth: '450px',
      maxHeight: '80vh',
      overflowY: 'auto',
    },

    [theme.breakpoints.down('xs')]: {
      width: '100%',
      height: "88vh",
      minHeight: 'auto',
      maxHeight: "88vh",
      margin: 0,
      borderRadius: '16px 16px 0 0',
      fontSize: '0.875rem'
    },

    '&::-webkit-scrollbar': {
      width: '4px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'rgba(123, 121, 247, 0.1)',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'rgba(123, 121, 247, 0.3)',
      borderRadius: '2px',
    }
  },
  tabs: {
    borderBottom: '1px solid rgba(123, 121, 247, 0.1)',
    minHeight: '56px',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'rgba(10, 11, 28, 0.95)',
    position: 'sticky',
    top: '48px',
    zIndex: 1,
    padding: '0 16px',
    '& .MuiTabs-indicator': {
      display: 'none'
    },
    '& .MuiTabs-flexContainer': {
      gap: '12px',
      height: '100%',
      padding: '8px 0'
    }
  },
  tab: {
    minHeight: '40px',
    minWidth: 'unset',
    padding: '8px 20px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '14px',
    fontWeight: 500,
    textTransform: 'none',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    transition: 'all 0.2s ease',
    border: '1px solid transparent',
    
    '&:hover': {
      backgroundColor: 'rgba(123, 121, 247, 0.08)',
      color: '#fff'
    },

    '&.Mui-selected': {
      color: '#7B79F7',
      backgroundColor: 'rgba(123, 121, 247, 0.1)',
      border: '1px solid rgba(123, 121, 247, 0.2)',
      fontWeight: 600,
      
      '& .MuiSvgIcon-root': {
        color: '#7B79F7'
      }
    },

    '& .MuiTab-wrapper': {
      flexDirection: 'row',
      gap: '8px',
      
      '& .MuiSvgIcon-root': {
        fontSize: '18px',
        margin: 0,
        color: 'rgba(255, 255, 255, 0.5)',
        transition: 'color 0.2s ease'
      }
    }
  },
  menuHeader: {
    padding: '16px',
    borderBottom: '1px solid rgba(123, 121, 247, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(10, 11, 28, 0.95)',
    
    '& .header-left': {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      
      '& .header-icon': {
        color: '#7B79F7',
        fontSize: '20px'
      },
      
      '& h3': {
        margin: 0,
        fontSize: '16px',
        fontWeight: 600,
        color: '#fff'
      }
    }
  },
  closeButton: {
    color: 'rgba(255, 255, 255, 0.5)',
    padding: '6px',
    transition: 'all 0.2s ease',
    
    '&:hover': {
      color: '#fff',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      transform: 'rotate(90deg)'
    },
    
    '& .MuiSvgIcon-root': {
      fontSize: '20px'
    }
  },
  content: {
    padding: '20px',
    [theme.breakpoints.down('xs')]: {
      padding: '12px',
      '& .MuiTypography-root': {
        fontSize: '0.85rem'
      },
      '& .MuiFormLabel-root': {
        fontSize: '0.85rem'
      },
      '& .MuiSelect-root': {
        fontSize: '0.85rem'
      },
      '& .MuiMenuItem-root': {
        fontSize: '0.85rem'
      }
    }
  },
  depositForm: {
    '& .MuiFormControl-root': {
      marginBottom: '12px',
      width: '100%',
      marginTop: '12px',
      '& .MuiOutlinedInput-root': {
        color: '#fff',
        borderRadius: '10px',
        backgroundColor: 'rgba(123, 121, 247, 0.05)',
        backdropFilter: 'blur(8px)',
        transition: 'all 0.3s ease',
        '& fieldset': {
          borderColor: 'rgba(123, 121, 247, 0.3)',
          borderWidth: '1px',
        },
        '&:hover fieldset': {
          borderColor: 'rgba(123, 121, 247, 0.7)',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#7B79F7',
          borderWidth: '1.5px',
        },
        '&.Mui-focused': {
          backgroundColor: 'rgba(123, 121, 247, 0.1)',
        }
      },
      '& .MuiInputLabel-root': {
        color: 'rgba(255, 255, 255, 0.7)',
        fontWeight: 500,
        '&.Mui-focused': {
          color: '#7B79F7',
        }
      }
    }
  },
  addressBox: {
    backgroundColor: 'rgba(123, 121, 247, 0.1)',
    padding: '12px',
    borderRadius: '10px',
    marginBottom: '12px',
    wordBreak: 'break-all',
    fontFamily: 'monospace',
    border: '1px solid rgba(123, 121, 247, 0.2)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.85rem',
    '&:hover': {
      backgroundColor: 'rgba(123, 121, 247, 0.15)',
      borderColor: 'rgba(123, 121, 247, 0.3)',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.75rem',
      padding: '10px'
    }
  },
  copyIcon: {
    color: '#7B79F7',
    cursor: 'pointer',
    marginLeft: '8px',
    '&:hover': {
      transform: 'scale(1.1)',
    }
  },
  warning: {
    color: '#ff9800',
    fontSize: '0.8rem',
    marginBottom: '12px',
    padding: '10px',
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.7rem',
      padding: '8px'
    }
  },
  qrContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20px',
    padding: '12px',
    '& svg': {
      padding: '16px',
      backgroundColor: '#fff',
      borderRadius: '16px',
      boxShadow: '0 6px 24px rgba(0, 0, 0, 0.15)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
    },
    [theme.breakpoints.down('xs')]: {
      marginTop: '12px',
      padding: '8px',
      '& svg': {
        width: '140px !important',
        height: '140px !important'
      }
    }
  },
  cryptoSelect: {
    '& .MuiOutlinedInput-root': {
      height: '48px',
      backgroundColor: 'rgba(123, 121, 247, 0.03)',
      borderRadius: '10px',
      transition: 'all 0.2s ease',
      
      '& fieldset': {
        borderColor: 'rgba(123, 121, 247, 0.12)',
        borderWidth: '1.5px',
      },
      '&:hover': {
        backgroundColor: 'rgba(123, 121, 247, 0.05)',
        '& fieldset': {
          borderColor: 'rgba(123, 121, 247, 0.25)',
        }
      },
      '&.Mui-focused': {
        backgroundColor: 'rgba(123, 121, 247, 0.07)',
        '& fieldset': {
          borderColor: '#7B79F7',
          borderWidth: '1.5px',
        }
      }
    },
    '& .MuiSelect-select': {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 14px',
      fontSize: '0.875rem',
      fontWeight: 500,
    }
  },
  menuPaper: {
    backgroundColor: 'rgba(10, 11, 28, 0.98) !important',
    backdropFilter: 'blur(12px)',
    border: '1.5px solid rgba(123, 121, 247, 0.08)',
    borderRadius: '10px !important',
    marginTop: '4px',
    padding: '6px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15) !important',
    
    '&::-webkit-scrollbar': {
      width: '4px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'rgba(123, 121, 247, 0.2)',
      borderRadius: '4px',
      '&:hover': {
        background: 'rgba(123, 121, 247, 0.3)',
      }
    }
  },
  selectItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 12px',
    margin: '2px',
    borderRadius: '6px',
    transition: 'all 0.15s ease',
    fontSize: '0.875rem',
    color: 'rgba(255, 255, 255, 0.9)',
    
    '&:hover': {
      backgroundColor: 'rgba(123, 121, 247, 0.1)',
    },
    '&.Mui-selected': {
      backgroundColor: 'rgba(123, 121, 247, 0.15)',
      '&:hover': {
        backgroundColor: 'rgba(123, 121, 247, 0.2)',
      }
    },
    '& img': {
      width: '18px',
      height: '18px',
      maxWidth: '18px',
      maxHeight: '18px',
      borderRadius: '50%',
      padding: '0',
      objectFit: 'contain',
      flexShrink: 0,
    },
    '& .crypto-details': {
      display: 'flex',
      flexDirection: 'column',
      gap: '0px',
      '& .crypto-name': {
        fontSize: '0.813rem',
        fontWeight: 500,
        lineHeight: '1.2',
      },
      '& .crypto-symbol': {
        fontSize: '0.688rem',
        color: 'rgba(255, 255, 255, 0.5)',
        lineHeight: '1.2',
      }
    }
  },
  selectedCrypto: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    '& img': {
      width: '18px',
      height: '18px',
      maxWidth: '18px',
      maxHeight: '18px',
      borderRadius: '50%',
      padding: '0',
      objectFit: 'contain',
      flexShrink: 0,
    },
    '& .crypto-name': {
      fontSize: '0.875rem',
      fontWeight: 500,
    }
  },
  withdrawForm: {
    '& .MuiFormControl-root': {
      marginBottom: '12px',
      width: '100%',
      '& .MuiOutlinedInput-root': {
        color: '#fff',
        borderRadius: '10px',
        backgroundColor: 'rgba(123, 121, 247, 0.05)',
        '& fieldset': {
          borderColor: 'rgba(123, 121, 247, 0.3)',
        },
        '&:hover fieldset': {
          borderColor: 'rgba(123, 121, 247, 0.7)',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#7B79F7',
        }
      },
      '& .MuiInputLabel-root': {
        color: 'rgba(255, 255, 255, 0.7)',
      }
    }
  },
  submitButton: {
    backgroundColor: '#7B79F7',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '10px',
    textTransform: 'none',
    fontSize: '0.9rem',
    fontWeight: 600,
    width: '100%',
    marginTop: '20px',
    '&:hover': {
      backgroundColor: '#6563d4',
    }
  },
  formLabel: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: '0.8rem',
    fontWeight: 500,
    color: '#7B79F7',
    marginBottom: '6px'
  },
  tipForm: {
    padding: '20px',
    '& .MuiFormControl-root': {
      marginBottom: '20px'
    }
  },
  tipAmountContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
    marginBottom: '20px'
  },
  tipAmountButton: {
    backgroundColor: 'rgba(123, 121, 247, 0.1)',
    color: '#fff',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid rgba(123, 121, 247, 0.2)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(123, 121, 247, 0.2)',
      borderColor: 'rgba(123, 121, 247, 0.3)',
    },
    '&.selected': {
      backgroundColor: 'rgba(123, 121, 247, 0.3)',
      borderColor: '#7B79F7',
    }
  },
  customInput: {
    '& .MuiOutlinedInput-root': {
      color: '#fff',
      backgroundColor: 'rgba(123, 121, 247, 0.05)',
      borderRadius: '10px',
      '& fieldset': {
        borderColor: 'rgba(123, 121, 247, 0.3)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(123, 121, 247, 0.5)',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#7B79F7',
      },
      '& input': {
        padding: '14px',
        fontSize: '0.9rem',
        '&::placeholder': {
          color: 'rgba(255, 255, 255, 0.5)',
          opacity: 1,
        }
      }
    },
    marginBottom: '16px'
  },
  customField: {
    width: '100%',
    padding: '14px',
    backgroundColor: 'rgba(123, 121, 247, 0.05)',
    border: '1px solid rgba(123, 121, 247, 0.3)',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
    marginBottom: '16px',
    outline: 'none',
    '&:hover': {
      borderColor: 'rgba(123, 121, 247, 0.5)',
      backgroundColor: 'rgba(123, 121, 247, 0.08)',
    },
    '&:focus': {
      borderColor: '#7B79F7',
      backgroundColor: 'rgba(123, 121, 247, 0.1)',
      boxShadow: '0 0 0 2px rgba(123, 121, 247, 0.2)',
    },
    '&::placeholder': {
      color: 'rgba(255, 255, 255, 0.5)',
    },
    '&:disabled': {
      opacity: 1,
      color: '#fff',
      backgroundColor: 'rgba(123, 121, 247, 0.05)',
      cursor: 'text'
    }
  },
  formControl: {
    width: '100%',
    '& .MuiInputLabel-root': {
      fontSize: '0.875rem',
      color: 'rgba(255, 255, 255, 0.7)',
      fontWeight: 500,
      '&.Mui-focused': {
        color: '#7B79F7'
      }
    }
  },
  select: {
    width: '100%',
    '& .MuiOutlinedInput-root': {
      height: '45px',
      backgroundColor: 'rgba(123, 121, 247, 0.03)',
      borderRadius: '10px',
      transition: 'all 0.2s ease',
      
      '& fieldset': {
        borderColor: 'rgba(123, 121, 247, 0.12)',
        borderWidth: '1.5px',
      },
      '&:hover': {
        backgroundColor: 'rgba(123, 121, 247, 0.05)',
        '& fieldset': {
          borderColor: 'rgba(123, 121, 247, 0.25)',
        }
      },
      '&.Mui-focused': {
        backgroundColor: 'rgba(123, 121, 247, 0.07)',
        '& fieldset': {
          borderColor: '#7B79F7',
          borderWidth: '1.5px',
        }
      }
    },
    '& .MuiSelect-select': {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 14px',
      fontSize: '0.875rem',
      fontWeight: 500,
      height: '45px',
      boxSizing: 'border-box'
    },
    '& .MuiSelect-icon': {
      color: 'rgba(123, 121, 247, 0.7)',
      right: '12px',
    }
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 12px',
    margin: '2px',
    borderRadius: '6px',
    transition: 'all 0.15s ease',
    fontSize: '0.875rem',
    color: 'rgba(255, 255, 255, 0.9)',
    
    '&:hover': {
      backgroundColor: 'rgba(123, 121, 247, 0.1)',
    },
    '&.Mui-selected': {
      backgroundColor: 'rgba(123, 121, 247, 0.15)',
      '&:hover': {
        backgroundColor: 'rgba(123, 121, 247, 0.2)',
      }
    },
    '& img': {
      width: '18px',
      height: '18px',
      maxWidth: '18px',
      maxHeight: '18px',
      borderRadius: '50%',
      padding: '0',
      objectFit: 'contain',
      flexShrink: 0,
    }
  }
}));

const CashierModal = ({ open, handleClose, user, changeWallet }) => {
  const classes = useStyles();
  
  // Update cryptoOptions with size-constrained icons
  const cryptoOptions = [
    { value: 'USDT', label: 'Tether (USDT)', icon: usdtIcon, maxSize: '18px' },
    { value: 'USDC', label: 'USD Coin (USDC)', icon: usdcIcon, maxSize: '18px' },
    { value: 'ETH', label: 'Ethereum (ETH)', icon: ethIcon, maxSize: '18px' },
    { value: 'BTC', label: 'Bitcoin (BTC)', icon: btcIcon, maxSize: '18px' },
    { value: 'LTC', label: 'Litecoin (LTC)', icon: ltcIcon, maxSize: '18px' },
    { value: 'DOGE', label: 'Dogecoin (DOGE)', icon: dogeIcon, maxSize: '18px' },
    { value: 'BNB', label: 'Binance Coin (BNB)', icon: bnbIcon, maxSize: '18px' },
    { value: 'XMR', label: 'Monero (XMR)', icon: xmrIcon, maxSize: '18px' },
    { value: 'DGB', label: 'DigiByte (DGB)', icon: dgbIcon, maxSize: '18px' },
    { value: 'SHIB', label: 'Shiba Inu (SHIB)', icon: shibIcon, maxSize: '18px' },
    { value: 'TON', label: 'Toncoin (TON)', icon: tonIcon, maxSize: '18px' }
  ];

  const networkOptions = {
    'USDT': ['ERC20', 'TRC20', 'BEP20'],
    'USDC': ['ERC20', 'BEP20'],
    'ETH': ['ERC20'],
    'BTC': ['Bitcoin'],
    'LTC': ['Litecoin'],
    'DOGE': ['Dogecoin'],
    'BNB': ['BEP20'],
    'BCH': ['BitcoinCash'],
    'XMR': ['Monero'],
    'DGB': ['DigiByte'],
    'SHIB': ['BEP20'],
    'TON': ['Ton']
  };

  const [tab, setTab] = useState(0);
  const [depositCrypto, setDepositCrypto] = useState('ETH');
  const [depositNetwork, setDepositNetwork] = useState('ERC20');
  const [withdrawCryptomain, setwithdrawCryptomain] = useState('ETH');
  const [withdrawNetwork, setWithdrawNetwork] = useState('ERC20');
  const [selectedCoin, setSelectedCoin] = useState('Tether (USDT)');
  const [availableNetworks, setAvailableNetworks] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const { addToast } = useToasts();
  const [cryptoData, setCryptoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState("LTC");
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleCopyAddress = (address) => {
    navigator.clipboard.writeText(address);
    addToast("Deposit address has been copied to clipboard", { appearance: "success" });
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getUserCryptoInformation();
      setCryptoData(data);
      
      // Set initial deposit crypto and network once data is loaded
      if (data) {
        setDepositCrypto('ETH');
        setDepositNetwork('ERC20');
        updateWalletAddress(data, 'ETH', 'ERC20');
      }
    } catch (error) {
      console.error("Error fetching crypto information:", error);
      if (error.response?.status === 400) {
        addToast(error.response.data.error, { appearance: "error" });
      }
    } finally {
      setLoading(false);
      setIsInitialLoading(false);
    }
  };

  const updateWalletAddress = (data, crypto, network) => {
    if (!data) return;
    
    let address;
    try {
      switch (crypto) {
        case "USDT":
          address = data.usdt?.address[network];
          break;
        case "USDC":
          address = data.usdc?.address[network];
          break;
        case "ETH":
          address = data.eth?.address?.ERC20?.ERC20;
          break;
        case "BTC":
          address = data.btc?.address?.Bitcoin?.Bitcoin;
          break;
        case "LTC":
          address = data.ltc?.address?.Litecoin?.Litecoin;
          break;
        case "DOGE":
          address = data.doge?.address?.Dogecoin?.Dogecoin;
          break;
        case "BNB":
          address = data.bnb?.address?.BEP20?.BEP20;
          break;
        case "BCH":
          address = data.bch?.address?.BitcoinCash?.BitcoinCash;
          break;
        case "XMR":
          address = data.xmr?.address?.Monero?.Monero;
          break;
        case "DGB":
          address = data.dgb?.address?.DigiByte?.DigiByte;
          break;
        case "SHIB":
          address = data.shib?.address?.BEP20?.BEP20;
          break;
        case "TON":
          address = data.ton?.address?.Ton?.Ton;
          break;
        default:
          address = null;
      }
    } catch (error) {
      console.error("Error accessing crypto address:", error);
      address = null;
    }
    
    setWalletAddress(address || "Address not available");
  };

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  useEffect(() => {
    if (cryptoData) {
      setLoading(true);
      setTimeout(() => {
        updateWalletAddress(cryptoData, depositCrypto, depositNetwork);
        setLoading(false);
      }, 300);
    }
  }, [depositCrypto, depositNetwork, cryptoData]);

  const WithdrawContent = ({ selectedCrypto }) => {
    const [amount, setAmount] = useState("");
    const [address, setAddress] = useState("");
    const [withdrawing, setWithdrawing] = useState(false);

    const handleWithdrawSubmit = async (e) => {
      e.preventDefault();
      setWithdrawing(true);
      
      console.log("withdrawCryptoFunction:", withdrawCryptoFunction); // Debug log
      
      try {
        if (typeof withdrawCryptoFunction !== 'function') {
          throw new Error('withdrawCryptoFunction is not properly imported');
        }

        const response = await withdrawCryptoFunction(
          selectedCrypto,
          address.trim(),
          parseFloat(amount),
          withdrawNetwork
        );

        console.log("Withdrawal response:", response);

        // Update state
        changeWallet({ amount: -Math.abs(response.siteValue) });

        // Check transaction status
        if (response.state === 1) {
          addToast(
            `Successfully withdrawed ${response.siteValue.toFixed(2)} credits for ${response.usdValue.toFixed(8)} ${selectedCrypto} on ${withdrawNetwork}! Your withdrawal should manual confirm within a few minutes!`,
            { appearance: "success" }
          );
        } else {
          addToast(
            `Successfully withdrawed ${response.siteValue.toFixed(2)} credits for ${selectedCrypto} on ${withdrawNetwork}! Your withdrawal should manual confirm within a few minutes!`,
            { appearance: "success" }
          );
        }
      } catch (error) {
        console.error("Withdrawal error details:", {
          error,
          withdrawCryptoFunction,
          selectedCrypto,
          address,
          amount,
          withdrawNetwork
        });
        
        if (error.response) {
          console.error("Error response data:", error.response.data);
        }

        // If user generated error
        if (error.response?.data?.errors) {
          error.response.data.errors.forEach(validationError => {
            addToast(validationError.msg, { appearance: "error" });
          });
        } else if (error.response?.data?.error) {
          addToast(error.response.data.error, { appearance: "error" });
        } else {
          addToast(
            `Success`,
            { appearance: "success" }
          );
        }
      } finally {
        setWithdrawing(false);
      }
    };

    return (
      <form className={classes.withdrawForm} onSubmit={handleWithdrawSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl variant="outlined" fullWidth size="small" className={classes.formControl}>
              <InputLabel>Currency</InputLabel>
              <Select
                value={selectedCrypto}
                onChange={(e) => {
                  setSelectedCrypto(e.target.value);
                  setWithdrawNetwork(networkOptions[e.target.value][0]);
                }}
                label="Currency"
                className={classes.select}
                IconComponent={KeyboardArrowDownIcon}
                renderValue={(selected) => {
                  const option = cryptoOptions.find(opt => opt.value === selected);
                  return (
                    <div className={classes.selectedCrypto}>
                      <img 
                        src={option.icon} 
                        alt={option.label}
                        style={{ width: '18px', height: '18px', maxWidth: '18px', maxHeight: '18px' }}
                      />
                      <span className="crypto-name">{option.label.split(' ')[0]}</span>
                    </div>
                  );
                }}
                MenuProps={{
                  classes: { paper: classes.menuPaper },
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                  },
                  transformOrigin: {
                    vertical: 'top',
                    horizontal: 'left',
                  },
                  getContentAnchorEl: null,
                  elevation: 0,
                }}
              >
                {cryptoOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value} className={classes.menuItem}>
                    <img 
                      src={option.icon} 
                      alt={option.label}
                      style={{ width: '18px', height: '18px', maxWidth: '18px', maxHeight: '18px' }}
                    />
                    <div className="crypto-details">
                      <span className="crypto-name">{option.label.split(' ')[0]}</span>
                    </div>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl variant="outlined" fullWidth size="small" className={classes.formControl}>
              <InputLabel>Network</InputLabel>
              <Select
                value={withdrawNetwork}
                onChange={(e) => setWithdrawNetwork(e.target.value)}
                label="Network"
                className={classes.select}
                IconComponent={KeyboardArrowDownIcon}
                MenuProps={{
                  classes: { paper: classes.menuPaper },
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                  },
                  transformOrigin: {
                    vertical: 'top',
                    horizontal: 'left',
                  },
                  getContentAnchorEl: null,
                  elevation: 0,
                }}
              >
                {networkOptions[selectedCrypto].map((network) => (
                  <MenuItem key={network} value={network} className={classes.menuItem}>
                    {network}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Typography className={classes.formLabel}>Withdrawal Address</Typography>
        <input
          className={classes.customField}
          placeholder="Enter your withdrawal address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        <Typography className={classes.formLabel}>Amount</Typography>
        <input
          className={classes.customField}
          placeholder="Enter amount to withdraw"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min="0"
          step="0.00000001"
        />

        <Typography className={classes.warning}>
          <WarningIcon className="warning-icon" />
          <span className="warning-text">
            Important: Please double-check the withdrawal address and network type before proceeding.
          </span>
        </Typography>

        <Button
          type="submit"
          className={classes.submitButton}
          variant="contained"
          disabled={withdrawing}
        >
          {withdrawing ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            `Withdraw ${selectedCrypto}`
          )}
        </Button>
      </form>
    );
  };

  // Update the available networks based on the selected coin
  useEffect(() => {
    switch (selectedCoin) {
      case "Tether (USDT)":
        setAvailableNetworks(["ERC20", "TRC20", "BEP20"]);
        setSelectedNetwork("ERC20");
        break;
      case "USD Coin (USDC)":
        setAvailableNetworks(["ERC20", "BEP20"]);
        setSelectedNetwork("ERC20");
        break;
      case "Ethereum (ETH)":
        setAvailableNetworks(["ERC20"]);
        setSelectedNetwork("ERC20");
        break;
      case "Binance Coin (BNB)":
        setAvailableNetworks(["BEP20"]);
        setSelectedNetwork("BEP20");
        break;
      case "Bitcoin (BTC)":
        setAvailableNetworks(["Bitcoin"]);
        setSelectedNetwork("Bitcoin");
        break;
      case "Litecoin (LTC)":
        setAvailableNetworks(["Litecoin"]);
        setSelectedNetwork("Litecoin");
        break;
      case "Dogecoin (DOGE)":
        setAvailableNetworks(["Dogecoin"]);
        setSelectedNetwork("Dogecoin");
        break;
      case "Bitcoin Cash (BCH)":
        setAvailableNetworks(["BitcoinCash"]);
        setSelectedNetwork("BitcoinCash");
        break;
      case "Monero (XMR)":
        setAvailableNetworks(["Monero"]);
        setSelectedNetwork("Monero");
        break;
      case "DigiByte (DGB)":
        setAvailableNetworks(["DigiByte"]);
        setSelectedNetwork("DigiByte");
        break;
      case "Shiba Inu (SHIB)":
        setAvailableNetworks(["BEP20"]);
        setSelectedNetwork("BEP20");
        break;
      case "Toncoin (TON)":
        setAvailableNetworks(["Ton"]);
        setSelectedNetwork("Ton");
        break;
      default:
        setAvailableNetworks([]);
        setSelectedNetwork("");
    }
  }, [selectedCoin]);

  const DepositContent = () => {
    const classes = useStyles();
    
    if (isInitialLoading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <CircularProgress size={40} style={{ color: '#7B79F7' }} />
        </div>
      );
    }
    
    return (
      <div className={classes.depositForm}>
        <Grid container spacing={2} style={{ display: 'flex' }}>
          <Grid item style={{ flex: 1, maxWidth: 'calc(50% - 8px)' }}>
            <FormControl variant="outlined" fullWidth size="small" className={classes.formControl}>
              <InputLabel>Select Cryptocurrency</InputLabel>
              <Select
                value={depositCrypto}
                onChange={(e) => {
                  setDepositCrypto(e.target.value);
                  setDepositNetwork(networkOptions[e.target.value]?.[0] || '');
                }}
                label="Cryptocurrency"
                className={classes.select}
                IconComponent={KeyboardArrowDownIcon}
                renderValue={(selected) => {
                  const option = cryptoOptions.find(opt => opt.value === selected);
                  return (
                    <div className={classes.selectedCrypto}>
                      <img 
                        src={option.icon} 
                        alt={option.label}
                        style={{ width: '18px', height: '18px', maxWidth: '18px', maxHeight: '18px' }}
                      />
                      <span className="crypto-name">{option.label.split(' ')[0]}</span>
                    </div>
                  );
                }}
                MenuProps={{
                  classes: { paper: classes.menuPaper },
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                  },
                  transformOrigin: {
                    vertical: 'top',
                    horizontal: 'left',
                  },
                  getContentAnchorEl: null,
                  elevation: 0,
                }}
              >
                {cryptoOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value} className={classes.selectItem}>
                    <img 
                      src={option.icon} 
                      alt={option.label}
                      style={{ width: '18px', height: '18px', maxWidth: '18px', maxHeight: '18px' }}
                    />
                    <div className="crypto-details">
                      <span className="crypto-name">{option.label.split(' ')[0]}</span>
                      <span className="crypto-symbol">{option.value}</span>
                    </div>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item style={{ flex: 1, maxWidth: 'calc(50% - 8px)' }}>
            <FormControl variant="outlined" fullWidth size="small" className={classes.formControl}>
              <InputLabel>Network</InputLabel>
              <Select
                value={depositNetwork}
                onChange={(e) => setDepositNetwork(e.target.value)}
                label="Network"
                className={classes.select}
                IconComponent={KeyboardArrowDownIcon}
                MenuProps={{
                  classes: { paper: classes.menuPaper },
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                  },
                  transformOrigin: {
                    vertical: 'top',
                    horizontal: 'left',
                  },
                  getContentAnchorEl: null,
                  elevation: 0,
                }}
              >
                {(networkOptions[depositCrypto] || []).map((network) => (
                  <MenuItem key={network} value={network} className={classes.menuItem}>
                    {network}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {depositCrypto && depositNetwork && (
          <>
            <Typography variant="subtitle1" gutterBottom style={{marginTop: '20px', color: '#7B79F7', fontWeight: 600, fontSize: '0.9rem'}}>
              Your Personal Deposit Address
            </Typography>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                <CircularProgress size={24} style={{ color: '#7B79F7' }} />
              </div>
            ) : (
              <>
                <div 
                  className={classes.addressBox} 
                  onClick={() => handleCopyAddress(walletAddress)}
                >
                  <span>{walletAddress}</span>
                  <IconButton 
                    className={classes.copyIcon}
                    size="small"
                    disabled={walletAddress === "Address not available"}
                  >
                    <FileCopyIcon fontSize="small" />
                  </IconButton>
                </div>
                
                {walletAddress !== "Address not available" && (
                  <>
                    <Typography className={classes.warning}>
                      Important: Please ensure you're sending funds on the {depositNetwork} network to avoid any loss of funds.
                    </Typography>

                    <div className={classes.qrContainer}>
                      <QRCodeSVG 
                        value={walletAddress}
                        size={180}
                        level="H"
                        includeMargin={true}
                        imageSettings={{
                          src: cryptoOptions.find(opt => opt.value === depositCrypto)?.icon,
                          x: null,
                          y: null,
                          height: 35,
                          width: 35,
                          excavate: true,
                        }}
                      />
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      className={classes.modal}
      closeAfterTransition
      BackdropProps={{
        timeout: 500,
      }}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            className={classes.container}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ 
              type: "spring", 
              bounce: 0.2, 
              duration: 0.6 
            }}
          >
            <div className={classes.menuHeader}>
              <div className="header-left">
                <AccountBalanceWalletIcon className="header-icon" />
                <h3>Cashier</h3>
              </div>
              <IconButton 
                className={classes.closeButton} 
                onClick={handleClose} 
                size="small"
              >
                <CloseIcon />
              </IconButton>
            </div>
            
            <Tabs
              value={tab}
              onChange={handleTabChange}
              className={classes.tabs}
              variant="fullWidth"
              TabIndicatorProps={{ children: <span /> }}
            >
              <Tab 
                icon={<AccountBalanceIcon />} 
                label="Deposit" 
                className={classes.tab}
              />
              <Tab 
                icon={<CallMadeIcon />} 
                label="Withdraw" 
                className={classes.tab}
              />
            </Tabs>

            <div className={classes.content}>
              {tab === 0 && <DepositContent />}
              {tab === 1 && <WithdrawContent selectedCrypto={selectedCrypto} />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
};

CashierModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  user: PropTypes.object,
  changeWallet: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, { changeWallet })(CashierModal);
