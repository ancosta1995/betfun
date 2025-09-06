import React, { useState, useEffect } from 'react';
import { styled, makeStyles } from '@material-ui/core/styles';
import { CircularProgress, Box, Menu, MenuItem, IconButton, Tooltip, Fade } from '@material-ui/core';
import { useSpring, animated, config } from 'react-spring';
import NotificationsIcon from '@material-ui/icons/Notifications';
import RefreshIcon from '@material-ui/icons/Refresh';
import { Notificationn } from "../services/api.service";
import { FaGift, FaWallet, FaTrophy, FaRocket, FaStar } from 'react-icons/fa';
import { GiPartyPopper } from 'react-icons/gi';
import { WiRain } from 'react-icons/wi';

const useStyles = makeStyles({
  skeleton: {
    width: '100%',
    height: '16px',
    backgroundColor: 'rgba(123, 121, 247, 0.1)',
    borderRadius: '4px',
    position: 'relative',
    overflow: 'hidden',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(123, 121, 247, 0.2), transparent)',
      animation: '$shimmer 1.5s infinite',
    },
  },
  iconSkeleton: {
    width: '32px',
    height: '32px',
    backgroundColor: 'rgba(123, 121, 247, 0.1)',
    borderRadius: '6px',
    position: 'relative',
    overflow: 'hidden',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(123, 121, 247, 0.2), transparent)',
      animation: '$shimmer 1.5s infinite',
    },
  },
  titleSkeleton: {
    width: '70%',
    height: '12px',
    backgroundColor: 'rgba(123, 121, 247, 0.1)',
    borderRadius: '4px',
    position: 'relative',
    overflow: 'hidden',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(123, 121, 247, 0.2), transparent)',
      animation: '$shimmer 1.5s infinite',
    },
  },
  timestampSkeleton: {
    width: '40px',
    height: '10px',
    backgroundColor: 'rgba(123, 121, 247, 0.1)',
    borderRadius: '4px',
    position: 'relative',
    overflow: 'hidden',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(123, 121, 247, 0.2), transparent)',
      animation: '$shimmer 1.5s infinite',
    },
  },
  '@keyframes shimmer': {
    '0%': {
      transform: 'translateX(-100%)',
    },
    '100%': {
      transform: 'translateX(100%)',
    },
  },
});

const NotifyIconButton = styled(IconButton)({
  color: '#7B79F7',
  padding: '4px',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(123, 121, 247, 0.1)',
    transform: 'scale(1.05)'
  }
});

const StyledMenu = styled(Menu)({
  '& .MuiPaper-root': {
    backgroundColor: 'rgba(10, 11, 28, 0.95)',
    backdropFilter: 'blur(8px)',
    color: '#fff',
    borderRadius: '8px', 
    width: '320px',
    fontFamily: "'Inter', sans-serif",
    border: '1px solid rgba(123, 121, 247, 0.1)',
    position: 'relative',
    transform: 'none !important',
    marginTop: '45px',
    marginLeft: "10px",
  }
});

const MenuHeader = styled('div')({
  padding: '8px 12px',
  borderBottom: '1px solid rgba(123, 121, 247, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '& h3': {
    margin: 0,
    fontSize: '0.9rem',
    fontWeight: 600
  },
  '& .header-left': {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  }
});

const StyledMenuItem = styled(MenuItem)({
  display: 'flex',
  alignItems: 'flex-start',
  padding: '8px 12px',
  gap: '8px',
  margin: '4px',
  backgroundColor: 'rgba(26, 27, 51, 0.5)',
  borderRadius: '6px',
  '&:hover': {
    backgroundColor: 'rgba(123, 121, 247, 0.1)',
    transform: 'translateX(2px)'
  }
});

const NotifyIcon = styled(animated.div)({
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '6px',
  background: 'rgba(123, 121, 247, 0.1)',
  flexShrink: 0
});

const NotifyInfo = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  gap: '2px',
  overflow: 'hidden'
});

const NotifyTitle = styled('span')({
  fontSize: '0.75rem',
  fontWeight: 600,
  color: '#FFFFFF',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
});

const NotifyDescription = styled('span')({
  fontSize: '0.75rem',
  color: 'rgba(255, 255, 255, 0.7)',
  lineHeight: '1.3',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  '-webkit-line-clamp': 3,
  '-webkit-box-orient': 'vertical',
  wordBreak: 'break-all',
  whiteSpace: 'pre-wrap',
  maxHeight: '3.9em'
});

const NotifyTimestamp = styled('span')({
  fontSize: '0.65rem',
  color: 'rgba(255, 255, 255, 0.5)',
  marginTop: '2px'
});

const RefreshButton = styled(IconButton)({
  padding: '2px',
  color: '#7B79F7',
  '&:hover': {
    backgroundColor: 'rgba(123, 121, 247, 0.1)'
  }
});

const Root = styled('div')({
  position: 'relative',
  display: 'inline-block'
});

const NotificationDropdown = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const open = Boolean(anchorEl);

  const fetchNotifications = async () => {
    try {
      const response = await Notificationn();
      if (response?.notifications) {
        // Add artificial delay of 1 second
        await new Promise(resolve => setTimeout(resolve, 1000));
        setNotifications(response.notifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 600000);
    return () => clearInterval(interval);
  }, []);

  // Fetch notifications when menu opens
  useEffect(() => {
    if (open) {
      setIsLoading(true);
      fetchNotifications();
    }
  }, [open]);

  const iconAnimation = useSpring({
    transform: open ? 'scale(1.1)' : 'scale(1)',
    config: config.wobbly
  });

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchNotifications().finally(() => setTimeout(() => setIsRefreshing(false), 1000));
  };

  const getIcon = (category) => {
    const iconStyle = { fontSize: '1rem' };
    switch (category) {
      case 'race': return <FaTrophy style={{...iconStyle, color: 'rgb(0 255 10)'}} />;
      case 'wallet': return <FaWallet style={{...iconStyle, color: 'rgb(0 255 10)'}} />;
      case 'rain': return <WiRain style={{...iconStyle, color: 'rgb(0 191 255)'}} />;
      case 'gift': return <FaGift style={{...iconStyle, color: 'rgb(255 215 0)'}} />;
      case 'party': return <GiPartyPopper style={{...iconStyle, color: 'rgb(255 69 0)'}} />;
      case 'boost': return <FaRocket style={{...iconStyle, color: 'rgb(255 0 0)'}} />;
      case 'achievement': return <FaStar style={{...iconStyle, color: 'rgb(255 215 0)'}} />;
      default: return null;
    }
  };

  const timeAgo = (timestamp) => {
    const diff = Math.abs(new Date() - new Date(timestamp));
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    return days > 0 ? `${days}d ago` : hours > 0 ? `${hours}h ago` : minutes > 0 ? `${minutes}m ago` : 'Just now';
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Root>
      <Tooltip title="Notifications" arrow placement="bottom">
        <NotifyIconButton onClick={handleClick} style={iconAnimation}>
          <NotificationsIcon fontSize="small" />
          {unreadCount > 0 && (
            <Box component="span" sx={{
              position: 'absolute',
              top: 2,
              right: 2,
              width: 4,
              height: 4,
              borderRadius: '50%',
              backgroundColor: '#7B79F7',
              animation: 'pulse 2s infinite'
            }} />
          )}
        </NotifyIconButton>
      </Tooltip>

      <StyledMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
        transformOrigin={{vertical: 'top', horizontal: 'right'}}
        TransitionComponent={Fade}
        transitionDuration={200}
      >
        <MenuHeader>
          <div className="header-left">
            <NotificationsIcon fontSize="small" style={{color: '#7B79F7'}} />
            <h3>Notifications</h3>
          </div>
          <RefreshButton onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? <CircularProgress size={16} style={{color: '#7B79F7'}} /> : <RefreshIcon fontSize="small" />}
          </RefreshButton>
        </MenuHeader>

        <Box sx={{maxHeight: 350, overflowY: 'auto', py: 0.5}}>
          {notifications.map(notification => (
            <StyledMenuItem key={notification._id}>
              <NotifyIcon>
                {(isLoading || isRefreshing) ? (
                  <div className={classes.iconSkeleton} />
                ) : getIcon(notification.category)}
              </NotifyIcon>
              <NotifyInfo>
                <NotifyTitle>
                  {(isLoading || isRefreshing) ? (
                    <>
                      <div className={classes.titleSkeleton} />
                      <div className={classes.timestampSkeleton} />
                    </>
                  ) : (
                    <>
                      {notification.title}
                      <NotifyTimestamp>{timeAgo(notification.timestamp)}</NotifyTimestamp>
                    </>
                  )}
                </NotifyTitle>
                <NotifyDescription>
                  {(isLoading || isRefreshing) ? (
                    <div className={classes.skeleton} />
                  ) : notification.description}
                </NotifyDescription>
              </NotifyInfo>
            </StyledMenuItem>
          ))}
        </Box>
      </StyledMenu>
    </Root>
  );
};

export default NotificationDropdown;
