import { CircularProgress, Collapse, Modal, MenuItem as MuiMenuItem, Tab, Tabs } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import { animated, config, useSpring } from 'react-spring';

import CardGiftcardIcon from '@material-ui/icons/CardGiftcard';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Rakeback from '../components/modals/rewards/Rakeback'; // Import the Rakeback component
import RefreshIcon from '@material-ui/icons/Refresh';
import Skeleton from '@material-ui/lab/Skeleton';
import StarIcon from '@material-ui/icons/Star';
import TimelineIcon from '@material-ui/icons/Timeline';
import WaterDropIcon from '@material-ui/icons/Opacity';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      alignItems: 'flex-end'
    }
  },
  container: {
    backgroundColor: 'rgba(10, 11, 28, 0.95)',
    color: '#fff',
    borderRadius: '8px',
    width: '95%',
    maxWidth: '600px',
    height: "auto",
    minHeight: "60vh",

    maxHeight: "150vh",

    fontFamily: "'Inter', sans-serif",
    border: '1px solid rgba(123, 121, 247, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.24)',
    outline: 'none',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    
    [theme.breakpoints.down('sm')]: {
      width: '95%',
      maxWidth: '500px',
      maxHeight: '95vh',
      overflowY: 'auto',
    },

    [theme.breakpoints.down('xs')]: {
      width: '100%',
      height: "auto",
      minHeight: '82vh',
      maxHeight: "150vh",
      margin: 0,
      borderRadius: '16px 16px 0 0',
      top: 'auto',
      bottom: 0,
      transform: 'translate(-50%, 0)',
      '&.open': {
        transform: 'translate(-50%, 0)',
      }
    },

    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'rgba(123, 121, 247, 0.1)',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'rgba(123, 121, 247, 0.3)',
      borderRadius: '3px',
    }
  },
  tabs: {
    borderBottom: '1px solid rgba(123, 121, 247, 0.1)',
    minHeight: '48px',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'rgba(10, 11, 28, 0.95)',
    position: 'sticky',
    top: '64px',
    zIndex: 1,
    '& .MuiTabs-indicator': {
      backgroundColor: '#7B79F7',
      height: '3px',
      borderRadius: '3px 3px 0 0'
    },
    '& .MuiTabs-flexContainer': {
      justifyContent: 'space-between',
      width: '100%',
      padding: '0 16px'
    },
    '& .MuiTab-root': {
      minHeight: '48px',
      padding: '12px 24px',
      color: 'rgba(255, 255, 255, 0.6)',
      fontSize: '14px',
      fontWeight: 500,
      textTransform: 'none',
      transition: 'all 0.3s ease',
      minWidth: '80px',
      opacity: 0.7,
      '& .MuiTab-wrapper': {
        flexDirection: 'row',
        gap: '8px',
      },
      '& .MuiSvgIcon-root': {
        fontSize: '20px',
        margin: 0,
        transition: 'all 0.3s ease'
      },
      '&.Mui-selected': {
        color: '#7B79F7',
        fontWeight: 600,
        opacity: 1,
        '& .MuiSvgIcon-root': {
          transform: 'scale(1.1)',
          color: '#7B79F7'
        }
      },
      '&:hover': {
        color: '#7B79F7',
        opacity: 0.9,
        backgroundColor: 'rgba(123, 121, 247, 0.1)',
        '& .MuiSvgIcon-root': {
          transform: 'scale(1.1)'
        }
      },
      '&::after': {
        display: 'none'
      },
      [theme.breakpoints.down('xs')]: {
        minWidth: '60px',
        padding: '8px 12px',
        fontSize: '12px',
        '& .MuiSvgIcon-root': {
          fontSize: '16px'
        }
      }
    }
  },
  menuHeader: {
    padding: '16px',
    borderBottom: '1px solid rgba(123, 121, 247, 0.1)',
    display: 'flex',
    alignItems: 'center', 
    justifyContent: 'space-between',
    gap: '8px',
    position: 'sticky',
    top: 0,
    backgroundColor: 'rgba(10, 11, 28, 0.95)',
    zIndex: 1,

    [theme.breakpoints.down('xs')]: {
      padding: '20px 16px',
    },

    '& .header-left': {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    '& h3': {
      margin: 0,
      fontSize: '1.1rem',
      fontWeight: 600,
      color: '#FFFFFF',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    gap: '12px',
    transition: 'all 0.2s ease',
    margin: 0,
    cursor: 'pointer',
    borderBottom: '1px solid rgba(123, 121, 247, 0.05)',
    backgroundColor: 'transparent',
    
    '&:last-child': {
      borderBottom: 'none',
    },

    [theme.breakpoints.down('xs')]: {
      padding: '20px 16px',
    },

    '&:active': {
      backgroundColor: 'rgba(123, 121, 247, 0.15)',
    },

    '@media (hover: hover)': {
      '&:hover': {
        backgroundColor: 'rgba(123, 121, 247, 0.1)',
        transform: 'translateX(4px)',
        '& .reward-icon': {
          transform: 'translateX(4px)'
        }
      }
    }
  },
  rewardIcon: {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#7B79F7',
    borderRadius: '8px',
    background: 'rgba(123, 121, 247, 0.1)',
    padding: '6px',
    margin: 0,
    transition: 'transform 0.2s ease',
    flexShrink: 0,

    [theme.breakpoints.down('xs')]: {
      width: '36px',
      height: '36px',
    },

    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))'
    }
  },
  rewardInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    gap: '12px',
    margin: 0,

    [theme.breakpoints.down('xs')]: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: '8px'
    }
  },
  rewardNameAndAmount: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    margin: 0,
    flex: 1
  },
  rewardName: {
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#FFFFFF',
    letterSpacing: '0.2px',
    margin: 0,

    [theme.breakpoints.down('xs')]: {
      fontSize: '1rem'
    }
  },
  rewardAmount: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#FFFFFF',
    margin: 0,
    opacity: 0.9,

    [theme.breakpoints.down('xs')]: {
      fontSize: '0.95rem'
    },

    '& .currency': {
      color: '#7B79F7',
      marginLeft: '4px',
      fontWeight: 500
    }
  },
  rewardStatus: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#7B79F7',
    padding: '8px 16px',
    borderRadius: '8px',
    backgroundColor: 'rgba(123, 121, 247, 0.15)',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '90px',
    flexShrink: 0,

    [theme.breakpoints.down('xs')]: {
      fontSize: '0.9rem',
      padding: '10px 20px',
      minWidth: '100px'
    },

    '@media (hover: hover)': {
      '&:hover': {
        backgroundColor: 'rgba(123, 121, 247, 0.25)',
        transform: 'scale(1.05)'
      }
    }
  },
  refreshIcon: {
    color: '#7B79F7',
    padding: '8px',
    cursor: 'pointer',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(123, 121, 247, 0.15)',
      transform: 'rotate(180deg)'
    }
  },
  backdrop: {
    backgroundColor: 'rgba(10, 11, 28, 0.8)'
  },
  faucetContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '40vh',
  },
  faucetAmount: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#7B79F7'
  },
  faucetTimer: {
    fontSize: '1rem',
    color: '#fff',
    opacity: 0.8
  },
  benefitTier: {
    padding: '16px 16px',
    borderBottom: '1px solid rgba(123, 121, 247, 0.1)',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    transition: 'background-color 0.2s ease',

    [theme.breakpoints.down('xs')]: {
      padding: '12px 8px',
      '&:last-child': {
        marginBottom: '50px'
      }
    },

    '&:hover': {
      backgroundColor: 'rgba(123, 121, 247, 0.05)'
    }
  },
  benefitHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '8px',
    '& img': {
      width: '20px',
      height: '20px'
    }
  },
  benefitTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#7B79F7',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: "'Inter', sans-serif",
  },
  benefitContent: {
    padding: '12px 0',
    color: 'rgba(255, 255, 255, 0.8)'
  },
  benefitList: {
    margin: 0,
    paddingLeft: '20px',
    '& li': {
      margin: '8px 0'
    }
  }
}));

const getNextFriday = () => {
  const today = new Date();
  const friday = new Date();
  friday.setDate(today.getDate() + ((5 + 7 - today.getDay()) % 7));
  return friday;
};

const getNextFirstOfMonth = () => {
  const today = new Date();
  const firstOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  return firstOfNextMonth;
};

const formatTimeRemaining = (targetDate) => {
  const now = new Date();
  const diff = targetDate - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

const RewardsDropdown = ({ open, onClose }) => {
  const classes = useStyles();
  const [activeReward, setActiveReward] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rewards, setRewards] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [faucetTimer, setFaucetTimer] = useState(300); // 5 minutes in seconds
  const [canClaimFaucet, setCanClaimFaucet] = useState(true);
  const [expandedTier, setExpandedTier] = useState(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  useEffect(() => {
    let faucetInterval;
    if (!canClaimFaucet) {
      faucetInterval = setInterval(() => {
        setFaucetTimer((prev) => {
          if (prev <= 1) {
            setCanClaimFaucet(true);
            return 300;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(faucetInterval);
  }, [canClaimFaucet]);

  useEffect(() => {
    const timer = setInterval(() => {
      setRewards(currentRewards => 
        currentRewards.map(reward => {
          if (reward.targetDate) {
            return {
              ...reward,
              status: formatTimeRemaining(reward.targetDate)
            };
          }
          return reward;
        })
      );
    }, 1000);

    setTimeout(() => {
      setRewards([
        { 
          id: '1', 
          name: 'Rakeback', 
          amount: '0.00', 
          currency: 'USDT', 
          icon: 'https://shuffle.com/icons/rake.svg', 
          status: 'Claim',
          notification: true
        },
        { 
          id: '2', 
          name: 'Weekly Bonus', 
          amount: '0.00', 
          currency: 'USDT', 
          icon: 'https://shuffle.com/images/vip-bonus-single.svg', 
          targetDate: getNextFriday(),
          notification: false
        },
        { 
          id: '3', 
          name: 'Monthly Bonus', 
          amount: '0.00', 
          currency: 'USDT', 
          icon: 'https://shuffle.com/icons/monthly-bonus.svg', 
          targetDate: getNextFirstOfMonth(),
          notification: false
        },
        {
          id: '4',
          name: 'Weekly Reload',
          amount: '100.00',
          currency: 'USDT',
          icon: 'https://shuffle.com/icons/gift.svg',
          status: 'Claim',
          notification: true
        }
      ]);
      setLoading(false);
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  const handleClaimClick = (reward) => {
    if (reward.status === 'Claim') {
      setActiveReward(reward.id);
      setTimeout(() => {
        setActiveReward(null);
        setRewards(currentRewards =>
          currentRewards.map(r =>
            r.id === reward.id ? { ...r, status: 'Claimed', notification: false } : r
          )
        );
      }, 2000);
    }
  };

  const handleFaucetClaim = () => {
    if (canClaimFaucet) {
      setCanClaimFaucet(false);
      // Handle faucet claim logic here
    }
  };

  const handleRefresh = (e) => {
    e.stopPropagation();
    setIsRefreshing(true);
    setLoading(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLoading(false);
    }, 1000);
  };

  const LoadingSkeleton = () => (
    <>
      {[1, 2, 3, 4].map((item) => (
        <div className={classes.menuItem} key={item}>
          <Skeleton variant="circle" width={32} height={32} style={{backgroundColor: 'rgba(123, 121, 247, 0.1)'}} />
          <div className={classes.rewardInfo}>
            <div className={classes.rewardNameAndAmount}>
              <Skeleton variant="text" width={120} height={24} style={{backgroundColor: 'rgba(123, 121, 247, 0.1)'}} />
              <Skeleton variant="text" width={100} height={24} style={{backgroundColor: 'rgba(123, 121, 247, 0.1)'}} />
            </div>
            <Skeleton variant="rect" width={90} height={36} style={{backgroundColor: 'rgba(123, 121, 247, 0.1)', borderRadius: '8px'}} />
          </div>
        </div>
      ))}
    </>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 0: // Bonus tab
        return loading ? (
          <LoadingSkeleton />
        ) : (
          rewards.map((reward) => (
            <div 
              className={classes.menuItem} 
              key={reward.id} 
              onClick={(e) => {
                e.stopPropagation();
                handleClaimClick(reward);
              }}
            >
              <div className={`${classes.rewardIcon} reward-icon`}>
                <img src={reward.icon} alt={reward.name} />
              </div>
              <div className={classes.rewardInfo}>
                <div className={classes.rewardNameAndAmount}>
                  <span className={classes.rewardName}>{reward.name}</span>
                  <span className={classes.rewardAmount}>
                    {reward.amount}<span className="currency">{reward.currency}</span>
                  </span>
                </div>
                <div className={classes.rewardStatus}>
                  {activeReward === reward.id ? (
                    <CircularProgress size={20} style={{ color: '#7B79F7' }} />
                  ) : (
                    reward.status
                  )}
                </div>
              </div>
            </div>
          ))
        );
        //case 1:
      case 12: // Benefits tab
        return (
          <>
            <div className={classes.benefitTier} onClick={() => setExpandedTier(expandedTier === 'bronze' ? null : 'bronze')}>
              <div className={classes.benefitHeader}>
                <span className={classes.benefitTitle}>
                  <img src="https://rare.bet/img/vipBadges/bronze-3.svg" alt="Bronze" />
                  Bronze (Rank 1-14)
                </span>
                {expandedTier === 'bronze' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </div>
              <Collapse in={expandedTier === 'bronze'}>
                <div className={classes.benefitContent}>
                  <ul className={classes.benefitList}>
                    <li>Bonus from Support in currency of your choice</li>
                    <li>Rakeback enabled</li>
                    <li>Weekly bonuses</li>
                    <li>Monthly bonuses</li>
                    <li>VIP Telegram channel access</li>
                  </ul>
                </div>
              </Collapse>
            </div>

            <div className={classes.benefitTier} onClick={() => setExpandedTier(expandedTier === 'silver' ? null : 'silver')}>
              <div className={classes.benefitHeader}>
                <span className={classes.benefitTitle}>
                  <img src="https://rare.bet/img/vipBadges/silver-3.svg" alt="Silver" />
                  Silver (Rank 15-28)
                </span>
                {expandedTier === 'silver' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </div>
              <Collapse in={expandedTier === 'silver'}>
                <div className={classes.benefitContent}>
                  <ul className={classes.benefitList}>
                    <li>Bonus from Support in currency of your choice</li>
                    <li>Weekly & monthly bonuses increased</li>
                  </ul>
                </div>
              </Collapse>
            </div>

            <div className={classes.benefitTier} onClick={() => setExpandedTier(expandedTier === 'gold' ? null : 'gold')}>
              <div className={classes.benefitHeader}>
                <span className={classes.benefitTitle}>
                  <img src="https://rare.bet/img/vipBadges/gold-3.svg" alt="Gold" />
                  Gold (Rank 29-41)
                </span>
                {expandedTier === 'gold' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </div>
              <Collapse in={expandedTier === 'gold'}>
                <div className={classes.benefitContent}>
                  <ul className={classes.benefitList}>
                    <li>Bonus from Support in currency of your choice</li>
                    <li>Weekly & monthly bonuses increased</li>
                  </ul>
                </div>
              </Collapse>
            </div>

            <div className={classes.benefitTier} onClick={() => setExpandedTier(expandedTier === 'platinum' ? null : 'platinum')}>
              <div className={classes.benefitHeader}>
                <span className={classes.benefitTitle}>
                  <img src="https://rare.bet/img/vipBadges/platinum-3.svg" alt="Platinum" />
                  Platinum (Rank 42-55)
                </span>
                {expandedTier === 'platinum' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </div>
              <Collapse in={expandedTier === 'platinum'}>
                <div className={classes.benefitContent}>
                  <ul className={classes.benefitList}>
                    <li>Bonus from Support in currency of your choice</li>
                    <li>Weekly & monthly bonuses increased</li>
                    <li>14 - 42 Day, Daily bonus (Reload)</li>
                  </ul>
                </div>
              </Collapse>
            </div>

            <div className={classes.benefitTier} onClick={() => setExpandedTier(expandedTier === 'emerald' ? null : 'emerald')}>
              <div className={classes.benefitHeader}>
                <span className={classes.benefitTitle}>
                  <img src="https://rare.bet/img/vipBadges/emerald-3.svg" alt="Emerald" />
                  Emerald (Rank 56-69)
                </span>
                {expandedTier === 'emerald' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </div>
              <Collapse in={expandedTier === 'emerald'}>
                <div className={classes.benefitContent}>
                  <ul className={classes.benefitList}>
                    <li>Dedicated VIP host</li>
                    <li>Bonus from VIP host in currency of your choice</li>
                    <li>Daily & weekly bonuses increased</li>
                    <li>Monthly bonuses</li>
                  </ul>
                </div>
              </Collapse>
            </div>

            <div className={classes.benefitTier} onClick={() => setExpandedTier(expandedTier === 'ruby' ? null : 'ruby')}>
              <div className={classes.benefitHeader}>
                <span className={classes.benefitTitle}>
                  <img src="https://rare.bet/img/vipBadges/ruby-3.svg" alt="Ruby" />
                  Ruby (Rank 70-82)
                </span>
                {expandedTier === 'ruby' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </div>
              <Collapse in={expandedTier === 'ruby'}>
                <div className={classes.benefitContent}>
                  <ul className={classes.benefitList}>
                    <li>All Emerald benefits</li>
                    <li>Enhanced VIP perks</li>
                  </ul>
                </div>
              </Collapse>
            </div>

            <div className={classes.benefitTier} onClick={() => setExpandedTier(expandedTier === 'diamond' ? null : 'diamond')}>
              <div className={classes.benefitHeader}>
                <span className={classes.benefitTitle}>
                  <img src="https://rare.bet/img/vipBadges/diamond-3.svg" alt="Diamond" />
                  Diamond (Rank 83-96)
                </span>
                {expandedTier === 'diamond' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </div>
              <Collapse in={expandedTier === 'diamond'}>
                <div className={classes.benefitContent}>
                  <ul className={classes.benefitList}>
                    <li>All Ruby benefits</li>
                    <li>Enhanced VIP perks</li>
                  </ul>
                </div>
              </Collapse>
            </div>

            <div className={classes.benefitTier} onClick={() => setExpandedTier(expandedTier === 'dragon' ? null : 'dragon')}>
              <div className={classes.benefitHeader}>
                <span className={classes.benefitTitle}>
                  <img src="https://shuffle.com/images/vip/dragon.svg" alt="Dragon" />
                  Dragon (Rank 97+)
                </span>
                {expandedTier === 'dragon' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </div>
              <Collapse in={expandedTier === 'dragon'}>
                <div className={classes.benefitContent}>
                  <ul className={classes.benefitList}>
                    <li>All Diamond benefits</li>
                    <li>Ultimate VIP perks</li>
                  </ul>
                </div>
              </Collapse>
            </div>
          </>
        );
      case 2: // Rakeback tab
        return <Rakeback />; // Use the imported Rakeback component
      default:
        return null;
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      className={classes.modal}
      BackdropProps={{
        className: classes.backdrop
      }}
    >
      <div className={classes.container}>
        <div className={classes.menuHeader}>
          <div className="header-left">
            <h3>
              <CardGiftcardIcon style={{ color: '#7B79F7', fontSize: '24px' }} />
              Rewards
            </h3>
          </div>
          <div className={classes.refreshIcon} onClick={handleRefresh}>
            {isRefreshing ? <CircularProgress size={24} style={{ color: '#7B79F7' }} /> : <RefreshIcon fontSize="small" />}
          </div>
        </div>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          className={classes.tabs}
          centered
        >
          <Tab icon={<CardGiftcardIcon />} label="Bonus" />
          {/* <Tab icon={<StarIcon />} label="Benefits" /> */}
          <Tab icon={<TimelineIcon />} label="Rakeback" />
        </Tabs>
        {renderContent()}
      </div>
    </Modal>
  );
};

export default RewardsDropdown;