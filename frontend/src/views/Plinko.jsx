import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { makeStyles, TextField, IconButton, Tabs, Tab, Fade, Paper, Typography, Chip } from "@material-ui/core";
import { motion, AnimatePresence } from 'framer-motion';
import Tooltip from '@material-ui/core/Tooltip';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import { createChart } from 'lightweight-charts';
import Select from 'react-select';
import { useSpring, animated } from 'react-spring';
import SearchIcon from '@material-ui/icons/Search';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import InfoIcon from '@material-ui/icons/Info';
import { debounce } from 'lodash';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    width: '100%',
    height: '100vh',
    backgroundColor: '#080808',
    color: '#eaecef',
    padding: '8px',
    gap: '8px'
  },
  marketInfo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#0a0a0a',
    borderRadius: '6px',
    border: '1px solid #1b1c2a',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  infoCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#0c0c0c',
    borderRadius: '6px',
    border: '1px solid #1b1c2a',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
    '& .label': {
      fontSize: '12px',
      color: '#b0b3b8',
      marginBottom: '4px',
      fontFamily: '"Open Sans", sans-serif',
      fontWeight: 300,
    },
    '& .value': {
      fontSize: '14px',
      fontWeight: 400,
      color: '#ffffff',
      fontFamily: '"Open Sans", sans-serif',
    },
    '& .change': {
      fontSize: '14px',
      fontWeight: 400,
      display: 'flex',
      alignItems: 'center',
      '&.positive': {
        color: '#0ecb81'
      },
      '&.negative': {
        color: '#f6465d'
      },
      '& .icon': {
        marginLeft: '4px',
        fontSize: '16px',
      }
    }
  },
  chartContainer: {
    flex: '1.5',
    display: 'flex',
    flexDirection: 'column',
    height: '75vh',
    backgroundColor: '#080808',
    borderRadius: '4px',
    border: '1px solid #1b1c2a',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    margin: '8px',
  },
  chartWrapper: {
    flex: '1',
    position: 'relative',
  },
  chart: {
    width: '100%',
    height: '100%',
  },
  tradePanel: {
    height: '300px',
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    borderTop: '1px solid #1b1c2a',
  },
  tradingForm: {
    display: 'flex',
    gap: '8px',
  },
  formColumn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  input: {
    backgroundColor: '#0a0a0a',
    border: '1px solid #1b1c2a',
    borderRadius: '8px',
    padding: '12px',
    color: '#eaecef',
    fontSize: '14px',
    '&:focus': {
      outline: 'none',
      borderColor: '#0ecb81',
    }
  },
  sidePanel: {
    flex: '0.5',
    padding: '8px',
    backgroundColor: '#080808',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    minWidth: '280px',
  },
  orderBook: {
    flex: '0.6',
    backgroundColor: '#080808',
    borderRadius: '4px',
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '45vh',
    '& h3': {
      margin: '0 0 4px 0',
      fontSize: '11px',
      fontWeight: 500,
      color: '#eaecef',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      '& .spread': {
        color: '#848e9c',
        fontSize: '9px'
      }
    }
  },
  orderBookHeader: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr 0.8fr',
    padding: '4px 8px',
    borderBottom: '1px solid #1b1c2a',
    color: '#848e9c',
    fontSize: '9px',
    position: 'sticky',
    top: 0,
    backgroundColor: '#080808',
    zIndex: 1,
    textAlign: 'center',
  },
  orderBookRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    padding: '0px 8px',
    fontSize: '9px',
    cursor: 'pointer',
    position: 'relative',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#0a0a0a'
    },
    '& .depth': {
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      zIndex: 1,
      opacity: 0.1,
      transition: 'width 0.3s ease-in-out'
    },
    '& span': {
      position: 'relative',
      zIndex: 2,
      padding: '2px 0'
    }
  },
  orderRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    alignItems: 'center',
    fontSize: '12px',
    padding: '8px 12px',
    borderBottom: '1px solid rgba(27, 28, 42, 0.5)',
    transition: 'all 0.2s ease',
    position: 'relative',
    '&:hover': {
      backgroundColor: 'rgba(10, 10, 10, 0.8)',
      transform: 'translateX(4px)',
    },
    '& span': {
      padding: '4px 8px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    '@media (max-width: 1200px)': {
      gridTemplateColumns: 'repeat(6, 1fr)',
      '& span:nth-child(4)': { // Hide total column
        display: 'none',
      },
    },
    '@media (max-width: 900px)': {
      gridTemplateColumns: 'repeat(5, 1fr)',
      '& span:nth-child(1)': { // Hide pair column
        display: 'none',
      },
    },
    '@media (max-width: 600px)': {
      gridTemplateColumns: 'repeat(4, 1fr)',
      fontSize: '11px',
      padding: '6px 8px',
      '& span:nth-child(6)': { // Hide time column
        display: 'none',
      },
    },
  },
  orderHeader: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    alignItems: 'center',
    fontSize: '11px',
    fontWeight: 500,
    color: '#848e9c',
    padding: '8px 12px',
    borderBottom: '1px solid #1b1c2a',
    position: 'sticky',
    top: 0,
    backgroundColor: '#080808',
    zIndex: 2,
    '& span': {
      padding: '4px 8px',
    },
    '@media (max-width: 1200px)': {
      gridTemplateColumns: 'repeat(6, 1fr)',
      '& span:nth-child(4)': {
        display: 'none',
      },
    },
    '@media (max-width: 900px)': {
      gridTemplateColumns: 'repeat(5, 1fr)',
      '& span:nth-child(1)': {
        display: 'none',
      },
    },
    '@media (max-width: 600px)': {
      gridTemplateColumns: 'repeat(4, 1fr)',
      fontSize: '10px',
      '& span:nth-child(6)': {
        display: 'none',
      },
    },
  },
  statusBadge: {
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 500,
    textAlign: 'center',
    display: 'inline-block',
    textTransform: 'capitalize',
    '&.filled': {
      backgroundColor: 'rgba(14, 203, 129, 0.1)',
      color: '#0ecb81',
    },
    '&.canceled': {
      backgroundColor: 'rgba(246, 70, 93, 0.1)',
      color: '#f6465d',
    },
    '&.open': {
      backgroundColor: 'rgba(240, 185, 11, 0.1)',
      color: '#f0b90b',
    },
  },
  tradeHistory: {
    flex: '0.4',
    backgroundColor: '#080808',
    borderRadius: '8px',
    padding: '12px',
    border: '1px solid #1b1c2a',
    maxHeight: '25vh',
    minHeight: '150px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    '& h3': {
      margin: '0 0 8px 0',
      fontSize: '12px',
      fontWeight: 500,
      color: '#eaecef',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 4px'
    }
  },
  tradeHistoryContent: {
    flex: 1,
    overflowY: 'auto',
    scrollbarWidth: 'thin',
    scrollbarColor: '#1b1c2a #080808',
    '&::-webkit-scrollbar': {
      width: '4px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#080808',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#1b1c2a',
      borderRadius: '4px',
    }
  },
  tradeRow: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr 0.8fr',
    padding: '4px 8px',
    fontSize: '11px',
    alignItems: 'center',
    borderRadius: '4px',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#0a0a0a',
      transform: 'translateX(2px)'
    },
    '& .price': {
      fontFamily: '"IBM Plex Mono", monospace',
      fontWeight: 500,
    },
    '& .amount': {
      color: '#848e9c',
      textAlign: 'right',
    },
    '& .time': {
      color: '#848e9c',
      fontSize: '10px',
      textAlign: 'right',
    }
  },
  tradeHeaderRow: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr 0.8fr',
    padding: '8px',
    fontSize: '10px',
    color: '#848e9c',
    borderBottom: '1px solid #1b1c2a',
    marginBottom: '4px',
    position: 'sticky',
    top: 0,
    backgroundColor: '#080808',
    zIndex: 1,
    '& span': {
      '&:nth-child(2)': {
        textAlign: 'right'
      },
      '&:nth-child(3)': {
        textAlign: 'right'
      }
    }
  },
  buyButton: {
    backgroundColor: '#0ecb81',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 600,
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: '#0eb574',
      transform: 'translateY(-1px)'
    }
  },
  sellButton: {
    backgroundColor: '#f6465d',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 600,
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: '#e0394f',
      transform: 'translateY(-1px)'
    }
  },
  tabContainer: {
    marginTop: '8px',
    borderTop: '1px solid #1b1c2a',
    flex: 1,
    display: 'flex',
    minHeight: '450px', // Added minimum height

    flexDirection: 'column'
  },
  tabButtons: {
    display: 'flex',
    gap: '4px',
    padding: '8px',
    borderBottom: '1px solid #1b1c2a',
    '& button': {
      padding: '4px 12px',
      fontSize: '11px',
      backgroundColor: 'transparent',
      border: 'none',
      color: '#848e9c',
      cursor: 'pointer',
      '&.active': {
        color: '#0ecb81',
        borderBottom: '2px solid #0ecb81'
      }
    }
  },
  tabContent: {
    padding: '0',
    flex: 1,
    overflowY: 'auto',
    fontSize: '11px',
    color: '#848e9c',
    minHeight: '180px',
    position: 'relative',
    '&::-webkit-scrollbar': {
      width: '4px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#0a0a0a',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#1b1c2a',
      borderRadius: '4px',
    },
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    color: '#848e9c',
    '& svg': {
      fontSize: '48px',
      marginBottom: '16px',
      opacity: 0.5,
    },
    '& p': {
      margin: 0,
      fontSize: '13px',
    },
  },
  coinSelector: {
    position: 'relative',
    width: '200px',
    margin: '8px',
  },
  selectedCoin: {
    backgroundColor: '#0a0a0a',
    border: '1px solid #1b1c2a',
    borderRadius: '8px',
    padding: '12px',
    color: '#eaecef',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'all 0.2s ease',
    '&:hover': {
      borderColor: '#0ecb81',
      backgroundColor: '#0c0c0c',
      transform: 'translateY(-1px)',
    },
    '& .arrow': {
      color: '#848e9c',
      transition: 'transform 0.2s ease',
    }
  },


searchField: {
  width: '100%',
  '& .MuiInputBase-root': {
    color: '#eaecef',
    backgroundColor: '#040404',
    borderRadius: '8px', 
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#060606',
    }
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none'
  },
  '& .MuiInputAdornment-root': {
    color: '#848e9c'
  }
},

  coinIcon: {
    width: '20px',
    height: '20px',
    marginRight: '8px',
  },
  marketHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    borderBottom: '1px solid #1b1c2a',
    backgroundColor: '#0a0a0a',
    gap: '24px',
  },
  coinSelector: {
    position: 'relative',
    width: '200px',
  },
  selectedCoin: {
    backgroundColor: '#0a0a0a',
    border: '1px solid #1b1c2a',
    borderRadius: '8px',
    padding: '12px',
    color: '#eaecef',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      borderColor: '#0ecb81',
      backgroundColor: '#0c0c0c',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(14, 203, 129, 0.1)',
    },
  },
  coinInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    '& img': {
      width: '24px',
      height: '24px',
    }
  },
  priceInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    minWidth: '240px',
    padding: '0 16px',
  },
  currentPrice: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    letterSpacing: '0.2px',
  },
  priceChange: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '14px',
    fontWeight: 500,
    padding: '4px 8px',
    borderRadius: '4px',
    backgroundColor: 'rgba(14, 203, 129, 0.1)',
    '&.positive': {
      color: '#0ecb81',
      backgroundColor: 'rgba(14, 203, 129, 0.1)',
    },
    '&.negative': {
      color: '#f6465d',
      backgroundColor: 'rgba(246, 70, 93, 0.1)',
    },
    '& svg': {
      fontSize: '16px',
    }
  },
  priceChangeDetails: {
    display: 'flex',
    gap: '16px',
    fontSize: '13px',
    color: '#848e9c',
    marginTop: '4px',
    '& span': {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      cursor: 'help',
      transition: 'color 0.2s ease',
      '&:hover': {
        color: '#eaecef',
      }
    }
  },
  marketStats: {
    display: 'flex',
    gap: '24px',
    marginLeft: 'auto',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    '& .label': {
      fontSize: '12px',
      color: '#848e9c',
    },
    '& .value': {
      fontSize: '14px',
      color: '#eaecef',
    }
  },
  searchInput: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#0a0a0a',
    border: 'none',
    borderBottom: '1px solid #1b1c2a',
    color: '#eaecef',
    fontSize: '14px',
    transition: 'all 0.2s ease',
    '&:focus': {
      outline: 'none',
      borderBottom: '1px solid #0ecb81',
      backgroundColor: '#0c0c0c',
    }
  },
coinOption: {
  padding: '12px 16px',
  display: 'grid',
  gridTemplateColumns: '1.5fr 1fr 1fr',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  borderBottom: '1px solid rgba(27, 28, 42, 0.3)',
  backgroundColor: '#080808', // Added this line
  '&:hover': {
    backgroundColor: '#0a0a0a', // Changed from #2a2d3e to #0a0a0a
    transform: 'translateX(4px)',
  }
},

  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#080808',
    color: '#eaecef',
    padding: '8px',
    gap: '8px',
    [theme.breakpoints.down('sm')]: {
      padding: '4px',
      gap: '4px',
    }
  },
  topSection: {
    display: 'flex',
    gap: '8px',
    height: '65vh', // Reduced height to make room for bottom section
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
      height: 'auto',
    }
  },
  bottomSection: {
    flex: 1, // Takes remaining space
    minHeight: '35vh', // Minimum height for bottom section
    backgroundColor: '#080808',
    borderRadius: '4px',
    border: '1px solid #1b1c2a',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  chartContainer: {
    flex: '1.5',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#080808',
    borderRadius: '4px',
    border: '1px solid #1b1c2a',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    [theme.breakpoints.down('md')]: {
      flex: 'none',
      minHeight: '400px',
    }
  },
  sidePanel: {
    flex: '0.5',
    padding: '8px',
    backgroundColor: '#080808',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    minWidth: '280px',
    border: '1px solid #1b1c2a',
    borderRadius: '4px',
    [theme.breakpoints.down('md')]: {
      minWidth: 'unset',
      flex: 'none',
    }
  },
  tradePanel: {
    padding: '16px',
    borderTop: '1px solid #1b1c2a',
    backgroundColor: '#080808',
    minHeight: 'fit-content',
  },
  tabContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
  },
  tabButtons: {
    display: 'flex',
    gap: '4px',
    padding: '16px 16px 0',
    borderBottom: '1px solid #1b1c2a',
    backgroundColor: '#080808',
    '& button': {
      padding: '8px 16px',
      fontSize: '12px',
      backgroundColor: 'transparent',
      border: 'none',
      color: '#848e9c',
      cursor: 'pointer',
      position: 'relative',
      '&.active': {
        color: '#0ecb81',
        '&:after': {
          content: '""',
          position: 'absolute',
          bottom: '-1px',
          left: 0,
          right: 0,
          height: '2px',
          backgroundColor: '#0ecb81',
        }
      },
      '&:hover:not(.active)': {
        color: '#eaecef',
      }
    }
  },
  tabContent: {
    flex: 1,
    overflowY: 'auto',
    padding: '0',
    backgroundColor: '#080808',
    '&::-webkit-scrollbar': {
      width: '4px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#0a0a0a',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#1b1c2a',
      borderRadius: '4px',
    },
  },
coinList: {
  position: 'absolute',
  top: 'calc(100% + 8px)',
  left: 0,
  backgroundColor: '#080808', // Changed from #1b1c2a to #080808
  borderRadius: '12px',
  overflow: 'hidden',
  zIndex: 1000,
  width: '480px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.24)',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    left: 0,
    right: 0,
    position: 'fixed',
    bottom: 0,
    top: 'auto',
    borderRadius: '16px 16px 0 0',
    maxHeight: '80vh',
    overflowY: 'auto',
  }
},
searchSection: {
  padding: '16px',
  borderBottom: '2px solid #1b1c2a',
  backgroundColor: '#0a0a0a',
  position: 'sticky',
  top: 0,
  zIndex: 3,
  boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
  backdropFilter: 'blur(12px)',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(180deg, rgba(10,10,10,0.98) 0%, rgba(10,10,10,0.92) 100%)',
    zIndex: -1
  }
},


searchField: {
  width: '100%',
  '& .MuiInputBase-root': {
    color: '#ffffff',
    backgroundColor: '#0c0c0c',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    border: '1px solid #1b1c2a',
    '&:hover': {
      backgroundColor: '#0e0e0e',
      borderColor: '#2a2b3a'
    }
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none'
  },
  '& .MuiInputAdornment-root': {
    color: '#a6b0c3'
  }
},

tabs: {
  borderBottom: '1px solid #1b1c2a',
  backgroundColor: '#080808', // Added this line
  '& .MuiTabs-indicator': {
    backgroundColor: '#0ecb81',
  },
  '& .MuiTab-root': {
    color: '#848e9c',
    minWidth: 80,
    '&.Mui-selected': {
      color: '#0ecb81',
    }
  }
}, 
  coinInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  starButton: {
    padding: 8,
    color: '#848e9c',
    '&:hover': {
      color: '#f0b90b',
    }
  },
  coinDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  symbol: {
    fontWeight: 500,
    color: '#eaecef',
    fontSize: '14px',
  },
  name: {
    color: '#848e9c',
    fontSize: '12px',
  },
  price: {
    textAlign: 'right',
    color: '#eaecef',
    fontFamily: '"IBM Plex Mono", monospace',
    fontWeight: 500,
  },
  changeChip: {
    justifySelf: 'flex-end',
    minWidth: '80px',
    height: '24px',
    fontWeight: 500,
  },
  positiveChange: {
    backgroundColor: 'rgba(14, 203, 129, 0.1)',
    color: '#0ecb81',
  },
  negativeChange: {
    backgroundColor: 'rgba(246, 70, 93, 0.1)',
    color: '#f6465d',
  },
  timeframeSelector: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid #1b1c2a',
    backgroundColor: '#080808',
    gap: '4px', // Reduced gap for tighter layout
    position: 'relative',
    overflowX: 'auto',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none'
    },
    [theme.breakpoints.down('sm')]: {
      padding: '8px',
      justifyContent: 'space-between',
      '& button': {
        padding: '4px 8px',
        fontSize: '10px',
      }
    }
  },

  timeframeButton: {
    padding: '6px 12px',
    fontSize: '13px',
    fontWeight: 500,
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '6px',
    color: '#848e9c',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minWidth: '40px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    
    '&:hover:not(.active)': {
      color: '#eaecef',
      backgroundColor: 'rgba(234, 236, 239, 0.04)',
    },
    
    '&.active': {
      color: '#0ecb81',
      backgroundColor: 'rgba(14, 203, 129, 0.1)',
      fontWeight: 600,
    },
    
    '&:focus': {
      outline: 'none',
    },
  },

  customTimeframe: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '0 12px',
    height: '32px',
    border: '1px solid rgba(14, 203, 129, 0.3)',
    borderRadius: '6px',
    backgroundColor: 'rgba(14, 203, 129, 0.05)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginLeft: 'auto',
    
    '&:hover': {
      backgroundColor: 'rgba(14, 203, 129, 0.1)',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(14, 203, 129, 0.1)',
    },
    
    '& .icon': {
      fontSize: '14px',
      color: '#0ecb81',
    },
    
    '& .text': {
      fontSize: '13px',
      color: '#0ecb81',
      fontWeight: 500,
    }
  },

  priceInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    minWidth: '240px',
    padding: '0 16px',
    [theme.breakpoints.down('sm')]: {
      minWidth: 'unset',
      width: '100%',
      padding: '8px 0',
    }
  },

  coinSelector: {
    position: 'relative',
    width: '200px',
    margin: '8px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: '0',
    }
  }
}));

const TIMEFRAMES = {
  '1m': '1m',
  '3m': '3m',
  '5m': '5m',
  '15m': '15m',
  '30m': '30m',
  '1h': '1h',
  '2h': '2h',
  '4h': '4h',
  '1d': '1d',
  '1w': '1w'
};

// Add time formatter helper
const formatChartTime = (timeframe, timestamp) => {
  const date = new Date(timestamp);
  
  switch(timeframe) {
    case '1m':
    case '3m':
    case '5m':
    case '15m':
    case '30m':
      return Math.floor(timestamp / 1000); // Return seconds for minute-based timeframes
    case '1h':
    case '2h':
    case '4h':
      return Math.floor(date.setMinutes(0, 0, 0) / 1000); // Round to hours
    case '1d':
      return Math.floor(date.setHours(0, 0, 0, 0) / 1000); // Round to days
    case '1w':
      const dayOfWeek = date.getUTCDay();
      const diff = date.getUTCDate() - dayOfWeek;
      return Math.floor(new Date(date.setUTCDate(diff)).setUTCHours(0, 0, 0, 0) / 1000); // Round to weeks
    default:
      return Math.floor(timestamp / 1000);
  }
};

const COINS = {
  'BTC/USDT': 'BTCUSDT',
  'ETH/USDT': 'ETHUSDT',
  'LTC/USDT': 'LTCUSDT',
  'BNB/USDT': 'BNBUSDT',
  'XRP/USDT': 'XRPUSDT',
  'ADA/USDT': 'ADAUSDT',
  'SOL/USDT': 'SOLUSDT',
  'DOT/USDT': 'DOTUSDT'
};

const orderTypes = [
  { value: 'limit', label: 'Limit' },
  { value: 'market', label: 'Market' }
];

const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: '#0a0a0a',
    border: '1px solid #1b1c2a',
    borderRadius: '8px',
    padding: '4px',
    color: '#eaecef',
    fontSize: '14px',
    '&:hover': {
      borderColor: '#0ecb81',
    },
    boxShadow: 'none',
    '&:focus-within': {
      borderColor: '#0ecb81',
    }
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: '#0a0a0a',
    border: '1px solid #1b1c2a',
    borderRadius: '8px',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#0ecb81' : state.isFocused ? '#1b1c2a' : '#0a0a0a',
    color: state.isSelected ? '#fff' : '#eaecef',
    '&:hover': {
      backgroundColor: '#1b1c2a',
    }
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#eaecef',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#848e9c',
  }),
};

const COIN_ICONS = {
  'BTC': 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
  'ETH': 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  'LTC': 'https://assets.coingecko.com/coins/images/2/small/litecoin.png',
  'BNB': 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
  'XRP': 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png',
  'ADA': 'https://assets.coingecko.com/coins/images/975/small/cardano.png',
  'SOL': 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
  'DOT': 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png'
};

const EXAMPLE_ORDERS = {
  openOrders: [
    { id: '1', pair: 'BTC/USDT', type: 'limit', side: 'buy', price: '41250.00', amount: '0.125', total: '5156.25', time: '2024-03-20 14:30:25', status: 'open' },
    { id: '2', pair: 'BTC/USDT', type: 'limit', side: 'sell', price: '42100.00', amount: '0.085', total: '3578.50', time: '2024-03-20 14:28:15', status: 'open' },
  ],
  orderHistory: [
    { id: '3', pair: 'BTC/USDT', type: 'market', side: 'buy', price: '41025.50', amount: '0.1', total: '4102.55', time: '2024-03-20 13:15:10', status: 'filled' },
    { id: '4', pair: 'BTC/USDT', type: 'limit', side: 'sell', price: '41500.00', amount: '0.15', total: '6225.00', time: '2024-03-20 12:45:30', status: 'filled' },
    { id: '5', pair: 'BTC/USDT', type: 'limit', side: 'buy', price: '40800.00', amount: '0.075', total: '3060.00', time: '2024-03-20 11:20:45', status: 'canceled' },
  ],
  tradeHistory: [
    { id: '6', pair: 'BTC/USDT', side: 'buy', price: '41025.50', amount: '0.1', total: '4102.55', fee: '4.10', time: '2024-03-20 13:15:10' },
    { id: '7', pair: 'BTC/USDT', side: 'sell', price: '41500.00', amount: '0.15', total: '6225.00', fee: '6.22', time: '2024-03-20 12:45:30' },
    { id: '8', pair: 'BTC/USDT', side: 'buy', price: '40950.25', amount: '0.05', total: '2047.51', fee: '2.05', time: '2024-03-20 12:30:15' },
  ]
};

// First, add this component definition before the Exchange component
const TimeframeSelector = ({ selectedTimeframe, setSelectedTimeframe, classes }) => {
  // Debounce the timeframe change
  const debouncedSetTimeframe = useMemo(
    () => debounce((timeframe) => {
      setSelectedTimeframe(timeframe);
    }, 300),
    [setSelectedTimeframe]
  );

  // Define timeframes in desired order
  const timeframes = [
    '1m',
    '3m',
    '5m',
    '15m',
    '30m',
    '1h',
    '2h',
    '4h',
    '1d',
    '1w'
  ];

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      debouncedSetTimeframe.cancel();
    };
  }, [debouncedSetTimeframe]);

  const handleTimeframeClick = useCallback((timeframe) => {
    if (timeframe === selectedTimeframe) return;
    debouncedSetTimeframe(timeframe);
  }, [selectedTimeframe, debouncedSetTimeframe]);

  return (
    <div className={classes.timeframeSelector}>
      {timeframes.map((timeframe) => (
        <motion.button
          key={timeframe}
          className={`${classes.timeframeButton} ${
            selectedTimeframe === timeframe ? 'active' : ''
          }`}
          onClick={() => handleTimeframeClick(timeframe)}
          whileHover={selectedTimeframe !== timeframe ? {
            y: -1,
            transition: { duration: 0.1 }
          } : {}}
          whileTap={{ scale: 0.95 }}
          // Optimize motion animations
          layout="position"
          transition={{
            layout: { duration: 0.2 },
            animate: { duration: 0.2 }
          }}
        >
          {timeframe}
        </motion.button>
      ))}
      
      <Tooltip title="Enable real-time updates" placement="top">
        <motion.div 
          className={classes.customTimeframe}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          // Optimize motion animations
          layout="position"
          transition={{
            layout: { duration: 0.2 },
            animate: { duration: 0.2 }
          }}
        >
          <span className="icon">⚡</span>
          <span className="text">Live</span>
        </motion.div>
      </Tooltip>
    </div>
  );
};

// Create new component for trading panel
const TradingPanel = ({ selectedCoin, orderType, setOrderType, customSelectStyles, classes }) => {
  return (
    <div className={classes.tradingForm}>
      <div className={classes.formColumn}>
        <Select
          value={orderType}
          onChange={setOrderType}
          options={orderTypes}
          styles={customSelectStyles}
          isSearchable={false}
        />
        <input 
          type="number" 
          className={classes.input}
          placeholder={`Price (${selectedCoin.split('/')[1]})`}
          min="0"
          step="0.01"
        />
        <input 
          type="number" 
          className={classes.input}
          placeholder={`Amount (${selectedCoin.split('/')[0]})`}
          min="0"
          step="0.01"
        />
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={classes.buyButton}
        >
          Buy {selectedCoin.split('/')[0]}
        </motion.button>
      </div>
      <div className={classes.formColumn}>
        <Select
          value={orderType}
          onChange={setOrderType}
          options={orderTypes}
          styles={customSelectStyles}
          isSearchable={false}
        />
        <input 
          type="number" 
          className={classes.input}
          placeholder={`Price (${selectedCoin.split('/')[1]})`}
          min="0"
          step="0.01"
        />
        <input 
          type="number" 
          className={classes.input}
          placeholder={`Amount (${selectedCoin.split('/')[0]})`}
          min="0"
          step="0.01"
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={classes.sellButton}
        >
          Sell {selectedCoin.split('/')[0]}
        </motion.button>
      </div>
    </div>
  );
};

// Create new component for orders/history panel
const OrdersHistoryPanel = ({ activeTab, setActiveTab, classes }) => {
  return (
    <div className={classes.tabContainer}>
      <div className={classes.tabButtons}>
        <button 
          className={activeTab === 'openOrders' ? 'active' : ''}
          onClick={() => setActiveTab('openOrders')}
        >
          Open Orders
        </button>
        <button
          className={activeTab === 'orderHistory' ? 'active' : ''}
          onClick={() => setActiveTab('orderHistory')}
        >
          Order History
        </button>
        <button
          className={activeTab === 'tradeHistory' ? 'active' : ''}
          onClick={() => setActiveTab('tradeHistory')}
        >
          Trade History
        </button>
      </div>
      <div className={classes.tabContent}>
        {/* Move existing tab content here */}
        {activeTab === 'openOrders' && (
          <OrdersTable orders={EXAMPLE_ORDERS.openOrders} type="open" classes={classes} />
        )}
        {activeTab === 'orderHistory' && (
          <OrdersTable orders={EXAMPLE_ORDERS.orderHistory} type="history" classes={classes} />
        )}
        {activeTab === 'tradeHistory' && (
          <TradesTable trades={EXAMPLE_ORDERS.tradeHistory} classes={classes} />
        )}
      </div>
    </div>
  );
};

// Helper component for orders tables
const OrdersTable = ({ orders, type, classes }) => {
  return (
    <>
      <div className={classes.orderHeader}>
        <span>Pair</span>
        <span>Type</span>
        <span>Price</span>
        <span>Amount</span>
        <span>Total</span>
        <span>Time</span>
        <span>Status</span>
      </div>
      {orders.map((order) => (
        <motion.div
          key={order.id}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          transition={{ 
            duration: 0.2,
            ease: "easeOut"
          }}
          className={classes.orderRow}
        >
          <span>{order.pair}</span>
          <span style={{ color: order.side === 'buy' ? '#0ecb81' : '#f6465d' }}>
            {order.side.toUpperCase()} {order.type}
          </span>
          <span>{order.price}</span>
          <span>{order.amount}</span>
          <span>{order.total}</span>
          <span>{order.time}</span>
          <span>
            <div className={`${classes.statusBadge} ${order.status}`}>
              {order.status}
            </div>
          </span>
        </motion.div>
      ))}
    </>
  );
};

// Helper component for trades table
const TradesTable = ({ trades, classes }) => {
  return (
    <>
      <div className={classes.orderHeader}>
        <span>Pair</span>
        <span>Side</span>
        <span>Price</span>
        <span>Amount</span>
        <span>Total</span>
        <span>Fee</span>
        <span>Time</span>
      </div>
      {trades.map((trade, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ 
            duration: 0.2,
            ease: "easeOut"
          }}
          className={classes.tradeRow}
        >
          <span 
            className="price"
            style={{
              color: trade.side === 'buy' ? '#0ecb81' : '#f6465d',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {trade.side === 'buy' ? '↑' : '↓'}
            {parseFloat(trade.price).toFixed(2)}
          </span>
          <span className="amount">
            {parseFloat(trade.quantity).toFixed(4)}
          </span>
          <span className="time">
            {trade.time}
          </span>
        </motion.div>
      ))}
    </>
  );
};

const Exchange = () => {
  const classes = useStyles();
  const [currentPrice, setCurrentPrice] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1m');
  const [selectedCoin, setSelectedCoin] = useState('BTC/USDT');
  const [marketStats, setMarketStats] = useState({
    change24h: null,
    high24h: null,
    low24h: null,
    volume24hBTC: null,
    volume24hUSDT: null,
    change1h: null
  });
  const [orderBook, setOrderBook] = useState({
    bids: Array(15).fill().map(() => ({
      price: 0,
      amount: 0,
      total: 0
    })),
    asks: Array(15).fill().map(() => ({
      price: 0,
      amount: 0,
      total: 0
    }))
  });
  const [tradeHistory, setTradeHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('openOrders');
  const chartContainerRef = useRef();
  const [orderType, setOrderType] = useState(orderTypes[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectorRef = useRef(null);
  const [previousPrice, setPreviousPrice] = useState(null);
  const [coinPrices, setCoinPrices] = useState({});
  const [coin24hChanges, setCoin24hChanges] = useState({});
  const [tabValue, setTabValue] = useState(0);
  const [favorites, setFavorites] = useState(new Set());

  const spread = useMemo(() => {
    if (orderBook.asks.length && orderBook.bids.length) {
      const lowestAsk = parseFloat(orderBook.asks[0].price);
      const highestBid = parseFloat(orderBook.bids[0].price);
      return ((lowestAsk - highestBid) / lowestAsk * 100).toFixed(2);
    }
    return null;
  }, [orderBook]);

  useEffect(() => {
    let wsKline = null;
    let wsCleanupTimeout = null;

    const connectWebSocket = () => {
      const symbol = COINS[selectedCoin];
      wsKline = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${selectedTimeframe}`);
      
      wsKline.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // Handle your websocket data
      };

      wsKline.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };

    // Debounce the WebSocket connection
    wsCleanupTimeout = setTimeout(() => {
      if (wsKline) {
        wsKline.close();
      }
      connectWebSocket();
    }, 300);

    return () => {
      clearTimeout(wsCleanupTimeout);
      if (wsKline) {
        wsKline.close();
      }
    };
  }, [selectedTimeframe, selectedCoin]);

  useEffect(() => {
    const symbol = COINS[selectedCoin];
    const wsKline = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${selectedTimeframe}`);
    const wsTrade = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@trade`);
    const wsBookTicker = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@depth15@100ms`);
    const ws24hr = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@ticker`);
    
    wsTrade.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPreviousPrice(currentPrice);
      setCurrentPrice(parseFloat(data.p));
      
      setTradeHistory(prev => [{
        price: data.p,
        quantity: data.q,
        time: new Date().toLocaleTimeString(),
        type: parseFloat(data.p) >= currentPrice ? 'buy' : 'sell'
      }, ...prev].slice(0, 22));
    };

    wsBookTicker.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const bids = data.bids.map(([price, amount]) => ({
        price,
        amount,
        total: (parseFloat(price) * parseFloat(amount)).toFixed(2)
      }));
      const asks = data.asks.map(([price, amount]) => ({
        price,
        amount,
        total: (parseFloat(price) * parseFloat(amount)).toFixed(2)
      }));
      
      setOrderBook({
        bids,
        asks
      });
    };

    ws24hr.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMarketStats({
        change24h: `${parseFloat(data.P).toFixed(2)}%`,
        high24h: parseFloat(data.h).toFixed(2),
        low24h: parseFloat(data.l).toFixed(2),
        volume24hBTC: parseFloat(data.v).toFixed(2),
        volume24hUSDT: parseFloat(data.q).toFixed(2),
        change1h: `${parseFloat(data.P).toFixed(2)}%`
      });
    };

    // Initial market data fetch
    fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`)
      .then(res => res.json())
      .then(data => {
        setMarketStats({
          change24h: `${parseFloat(data.priceChangePercent).toFixed(2)}%`,
          high24h: parseFloat(data.highPrice).toFixed(2),
          low24h: parseFloat(data.lowPrice).toFixed(2),
          volume24hBTC: parseFloat(data.volume).toFixed(2),
          volume24hUSDT: parseFloat(data.quoteVolume).toFixed(2),
          change1h: `${parseFloat(data.priceChangePercent).toFixed(2)}%`
        });
      });

    // Initial orderbook fetch  
    fetch(`https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=15`)
      .then(res => res.json())
      .then(data => {
        const bids = data.bids.map(([price, amount]) => ({
          price,
          amount,
          total: (parseFloat(price) * parseFloat(amount)).toFixed(2)
        }));
        const asks = data.asks.map(([price, amount]) => ({
          price,
          amount,
          total: (parseFloat(price) * parseFloat(amount)).toFixed(2)
        }));
        
        setOrderBook({
          bids,
          asks
        });
      });

    return () => {
      wsKline.close();
      wsTrade.close();
      wsBookTicker.close();
      ws24hr.close();
    };
  }, [selectedTimeframe, selectedCoin, currentPrice]);

  useEffect(() => {
    if (!chartContainerRef.current) {
      console.error("Chart container not found");
      return;
    }

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        background: { type: 'solid', color: '#080808' },
        textColor: '#eaecef',
        fontSize: 12,
        fontFamily: 'Roboto, sans-serif',
        watermark: {
          visible: true,
          text: 'ZEROBYTE INC',
          fontSize: 100,
          color: 'rgba(27, 28, 42, 0.15)',
          fontFamily: 'Inter, sans-serif',
          fontStyle: 'bold',
          horzAlign: 'center',
          vertAlign: 'center',
        }
      },
      grid: {
        vertLines: {
          color: '#1b1c2a',
          style: 1
        },
        horzLines: {
          color: '#1b1c2a',
          style: 1
        }
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: '#1b1c2a',
          width: 1,
          style: 2,
          labelBackgroundColor: '#0a0a0a'
        },
        horzLine: {
          color: '#1b1c2a',
          width: 1,
          style: 2,
          labelBackgroundColor: '#0a0a0a'
        }
      },
      autoSize: true, // Enable auto-resizing of the chart
      rightPriceScale: {
        borderColor: '#1b1c2a',
        textColor: '#848e9c',
        autoScale: true,
        mode: 1, // Normal mode
        invertScale: false,
        alignLabels: true,
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      timeScale: {
        timeVisible: true, // Show time in the time scale
        secondsVisible: selectedTimeframe.includes('m'), // Show seconds for minute-based timeframes
        borderColor: '#1b1c2a',
        textColor: '#848e9c',
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#0ecb81',
      downColor: '#f6465d',
      borderVisible: false,
      wickUpColor: '#0ecb81',
      wickDownColor: '#f6465d'
    });

    // Fetch and format data with proper timestamps
    fetch(`https://api.binance.com/api/v3/klines?symbol=${COINS[selectedCoin]}&interval=${TIMEFRAMES[selectedTimeframe]}&limit=100`)
      .then(res => res.json())
      .then(data => {
        const chartData = data.map(([time, open, high, low, close]) => ({
          time: formatChartTime(selectedTimeframe, time),
          open: parseFloat(open),
          high: parseFloat(high),
          low: parseFloat(low),
          close: parseFloat(close),
        }));
        candlestickSeries.setData(chartData);
        
        // Adjust time scale to show proper range
        chart.timeScale().fitContent();
      })
      .catch(error => console.error("Error fetching data:", error));

    return () => {
      chart.remove();
    };
  }, [selectedTimeframe, selectedCoin]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCoins = Object.keys(COINS).filter(coin =>
    coin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { price } = useSpring({
    price: currentPrice || 0,
    from: { price: previousPrice || 0 },
    config: { tension: 180, friction: 12 }
  });

  const priceSection = (
    <div className={classes.priceInfo}>
      <div className={classes.currentPrice}>
        <animated.span style={{
          color: currentPrice > previousPrice ? '#0ecb81' : 
                 currentPrice < previousPrice ? '#f6465d' : 
                 '#eaecef',
          fontSize: '28px',
          fontWeight: 600,
          fontFamily: '"Inter", sans-serif',
        }}>
          $
          <animated.span>
            {price.interpolate(x => 
              x.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })
            )}
          </animated.span>
        </animated.span>
        <span
          className={`${classes.priceChange} ${
            marketStats.change24h?.startsWith('-') ? 'negative' : 'positive'
          }`}
        >
          {marketStats.change24h}
          {marketStats.change24h?.startsWith('-') ? (
            <TrendingDownIcon fontSize="small" />
          ) : (
            <TrendingUpIcon fontSize="small" />
          )}
        </span>
      </div>
      </div>

  );

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const toggleFavorite = (coin, event) => {
    event.stopPropagation();
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(coin)) {
        newFavorites.delete(coin);
      } else {
        newFavorites.add(coin);
      }
      return newFavorites;
    });
  };

  useEffect(() => {
    // Function to fetch prices for all coins
    const fetchPrices = async () => {
      try {
        const symbols = Object.values(COINS);
        const responses = await Promise.all(
          symbols.map(symbol =>
            fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`)
              .then(res => res.json())
          )
        );

        const prices = {};
        const changes = {};
        responses.forEach((data, index) => {
          const symbol = Object.keys(COINS)[index];
          prices[symbol] = parseFloat(data.lastPrice);
          changes[symbol] = parseFloat(data.priceChangePercent);
        });

        setCoinPrices(prices);
        setCoin24hChanges(changes);
      } catch (error) {
        console.error('Error fetching prices:', error);
      }
    };

    fetchPrices();
    
    // Set up WebSocket connections for real-time price updates
    const connections = Object.values(COINS).map(symbolValue => {
      const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbolValue.toLowerCase()}@ticker`);
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const coinPair = Object.keys(COINS).find(key => COINS[key] === symbolValue);
        
        setCoinPrices(prev => ({
          ...prev,
          [coinPair]: parseFloat(data.c)
        }));
        
        setCoin24hChanges(prev => ({
          ...prev,
          [coinPair]: parseFloat(data.P)
        }));
      };

      return ws;
    });

    return () => connections.forEach(ws => ws.close());
  }, []);

  // Add to your component
  const handleTouchStart = useCallback((e) => {
    // Prevent default zoom behavior on double tap
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, [handleTouchStart]);

  return (
    <div className={classes.mainContainer}>
      <div className={classes.topSection}>
        <div className={classes.chartContainer}>
          <motion.div 
            className={classes.marketHeader}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={classes.coinSelector} ref={selectorRef}>
              <motion.div 
                className={classes.selectedCoin}
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={classes.coinInfo}>
                  <img 
                    src={COIN_ICONS[selectedCoin.split('/')[0]]}
                    alt={selectedCoin.split('/')[0]}
                    style={{ width: '24px', height: '24px' }}
                  />
                  <span>{selectedCoin}</span>
                </div>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  ▼
                </motion.span>
              </motion.div>

              <AnimatePresence>
                {isOpen && (
                  <motion.div 
                    className={classes.coinList}
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className={classes.searchSection}>
                      <TextField
                        className={classes.searchField}
                        variant="outlined"
                        placeholder="Search coin"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                          startAdornment: <SearchIcon style={{ marginRight: 8 }} />,
                        }}
                      />
                    </div>

                    <Tabs
                      value={tabValue}
                      onChange={handleTabChange}
                      className={classes.tabs}
                      variant="fullWidth"
                    >
                      <Tab label="All" />
                      <Tab label="Favorites" />
                    </Tabs>

                    <div style={{ 
                      maxHeight: '400px', 
                      overflowY: 'auto',
                      overflowX: 'hidden'
                    }}>
                      {filteredCoins
                        .filter(coin => tabValue === 0 || favorites.has(coin))
                        .map((coin, index) => (
                          <motion.div
                            key={coin}
                            className={classes.coinOption}
                            onClick={() => {
                              setSelectedCoin(coin);
                              setIsOpen(false);
                            }}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ 
                              delay: index * 0.03,
                              type: "spring",
                              stiffness: 100 
                            }}
                          >
                            <div className={classes.coinInfo}>
                              <IconButton 
                                className={classes.starButton}
                                onClick={(e) => toggleFavorite(coin, e)}
                                size="small"
                              >
                                {favorites.has(coin) ? <StarIcon /> : <StarBorderIcon />}
                              </IconButton>
                              <div className={classes.coinDetails}>
                                <Typography className={classes.symbol}>
                                  {coin.split('/')[0]}
                                </Typography>
                                <Typography className={classes.name}>
                                  {coin.split('/')[0]}
                                </Typography>
                              </div>
                            </div>

                            <Typography className={classes.price}>
                              ${coinPrices[coin]?.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              }) || '0.00'}
                            </Typography>

                            <Chip
                              className={`${classes.changeChip} ${
                                (coin24hChanges[coin] || 0) >= 0 ? classes.positiveChange : classes.negativeChange
                              }`}
                              icon={(coin24hChanges[coin] || 0) >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                              label={`${(coin24hChanges[coin] || 0) >= 0 ? '+' : ''}${(coin24hChanges[coin] || 0).toFixed(2)}%`}
                              size="small"
                            />
                          </motion.div>
                        ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {priceSection}

            <div className={classes.marketStats}>
              <div className={classes.statItem}>
                <span className="label">24h High</span>
                <span className="value">${marketStats.high24h}</span>
              </div>
              <div className={classes.statItem}>
                <span className="label">24h Low</span>
                <span className="value">${marketStats.low24h}</span>
              </div>
              <div className={classes.statItem}>
                <span className="label">24h Volume</span>
                <span className="value">{marketStats.volume24hBTC} BTC</span>
              </div>
              <div className={classes.statItem}>
                <span className="label">24h Volume</span>
                <span className="value">${marketStats.volume24hUSDT}</span>
              </div>
            </div>
          </motion.div>

          <TimeframeSelector
            selectedTimeframe={selectedTimeframe}
            setSelectedTimeframe={setSelectedTimeframe}
            classes={classes}
          />

          <div className={classes.chartWrapper} ref={chartContainerRef}>
            {/* Chart will be rendered here */}
          </div>

          <TradingPanel 
            selectedCoin={selectedCoin}
            orderType={orderType}
            setOrderType={setOrderType}
            customSelectStyles={customSelectStyles}
            classes={classes}
          />
        </div>
        
        <div className={classes.sidePanel}>
          <div className={classes.orderBook}>
            <h3>
              Order Book 
              {spread && <span className="spread">Spread: {spread}%</span>}
            </h3>
            
            <div className={classes.orderBookHeader}>
              <span>Price({selectedCoin.split('/')[1]})</span>
              <span>Amount({selectedCoin.split('/')[0]})</span>
              <span>Total</span>
            </div>

            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                <AnimatePresence>
                  {orderBook.asks.slice().reverse().map((ask, i) => (
                    <motion.div
                      key={`ask-${i}`}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 5 }}
                      transition={{ duration: 0.2 }}
                      className={classes.orderBookRow}
                    >
                      <div 
                        className="depth" 
                        style={{
                          backgroundColor: '#f6465d',
                          width: `${Math.min(parseFloat(ask.amount) * 50, 100)}%`,
                          right: 0
                        }}
                      />
                      <span style={{color: '#f6465d'}}>{parseFloat(ask.price).toFixed(2)}</span>
                      <span>{parseFloat(ask.amount).toFixed(4)}</span>
                      <span>{ask.total}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div style={{ 
                padding: '4px 8px',
                borderTop: '1px solid #1b1c2a',
                borderBottom: '1px solid #1b1c2a',
                textAlign: 'center',
                color: '#848e9c',
                fontSize: '11px'
              }}>
                {currentPrice && (
                  <span style={{ fontWeight: 500 }}>
                    {parseFloat(currentPrice).toFixed(2)}
                  </span>
                )}
              </div>

              <div style={{ flex: 1, overflowY: 'auto' }}>
                <AnimatePresence>
                  {orderBook.bids.map((bid, i) => (
                    <motion.div
                      key={`bid-${i}`}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 5 }}
                      transition={{ duration: 0.2 }}
                      className={classes.orderBookRow}
                    >
                      <div 
                        className="depth" 
                        style={{
                          backgroundColor: '#0ecb81',
                          width: `${Math.min(parseFloat(bid.amount) * 50, 100)}%`,
                          right: 0
                        }}
                      />
                      <span style={{color: '#0ecb81'}}>{parseFloat(bid.price).toFixed(2)}</span>
                      <span>{parseFloat(bid.amount).toFixed(4)}</span>
                      <span>{bid.total}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
          
          <div className={classes.tradeHistory}>
            <h3>
              Market Trades
              <Tooltip title="Real-time market trades" placement="top">
                <InfoIcon style={{ fontSize: 14, color: '#848e9c', marginLeft: 4, cursor: 'help' }} />
              </Tooltip>
            </h3>
            
            <div className={classes.tradeHeaderRow}>
              <span>Price</span>
              <span>Amount</span>
              <span>Time</span>
            </div>
            
            <div className={classes.tradeHistoryContent}>
              <AnimatePresence>
                {tradeHistory.map((trade, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ 
                      duration: 0.2,
                      ease: "easeOut"
                    }}
                    className={classes.tradeRow}
                  >
                    <span 
                      className="price"
                      style={{
                        color: trade.type === 'buy' ? '#0ecb81' : '#f6465d',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {trade.type === 'buy' ? '↑' : '↓'}
                      {parseFloat(trade.price).toFixed(2)}
                    </span>
                    <span className="amount">
                      {parseFloat(trade.quantity).toFixed(4)}
                    </span>
                    <span className="time">
                      {trade.time}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <div className={classes.bottomSection}>
        <OrdersHistoryPanel 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          classes={classes}
        />
      </div>
    </div>
  );
};

export default React.memo(Exchange);
