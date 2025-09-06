import React, { useState, useCallback, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useLocation } from 'react-router-dom';
import { useNavigation } from '../context/NavigationContext';
import SearchIcon from '@material-ui/icons/Search';
import ChatIcon from '@material-ui/icons/Chat';
import CardGiftcardIcon from '@material-ui/icons/CardGiftcard';
import SportsBaseballIcon from '@material-ui/icons/SportsBaseball';
import MenuIcon from '@material-ui/icons/Menu';
import SearchModal from './SearchModal';

const useStyles = makeStyles((theme) => ({
  nav: {
    zIndex: 9999,
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    display: 'none',
    backgroundColor: '#0c0d15',
    justifyContent: 'space-around',
    borderTop: '1px solid rgb(27, 28, 42)',
    boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
    },
  },
  button: {
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '8px 0',
    flexGrow: 1,
    transition: 'all 0.3s ease',
    '&:active': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  active: {
    color: theme.palette.primary.main,
    '& $icon': {
      transform: 'scale(1.1)',
    },
  },
  icon: {
    transition: 'transform 0.2s ease',
  },
  text: {
    fontSize: '10px',
    fontFamily: 'Poppins, sans-serif',
    marginTop: '4px',
    fontWeight: 500,
  },
  rotateIcon: {
    transform: 'rotate(180deg)',
    transition: 'transform 0.3s ease',
  },
}));

const MobileNav = ({ mobileChat, setMobile }) => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const { toggleMobileNav, isNavbarVisible } = useNavigation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navItems = useMemo(() => [
    { 
      Icon: MenuIcon, 
      text: isNavbarVisible ? 'Menu' : 'Menu', 
      onClick: toggleMobileNav 
    },
    { Icon: SearchIcon, text: 'Search', onClick: () => setIsSearchOpen(true) },
    { Icon: ChatIcon, text: 'Chat', onClick: () => setMobile(!mobileChat) },
    { Icon: CardGiftcardIcon, text: 'Rewards', path: '/rewards' },
  ], [toggleMobileNav, setMobile, mobileChat, isNavbarVisible]);

  const handleClick = useCallback((item) => {
    if (item.onClick) {
      item.onClick();
    }
    if (item.path) {
      history.push(item.path);
    }
  }, [history]);

  return (
    <>
      <nav className={classes.nav}>
        {navItems.map((item) => {
          const IconComponent = item.Icon;
          return (
            <div
              key={item.text}
              className={`${classes.button} ${location.pathname === item.path ? classes.active : ''}`}
              onClick={() => handleClick(item)}
            >
              <IconComponent 
                className={`${classes.icon} ${item.text === 'Close' ? classes.rotateIcon : ''}`}
                fontSize="small"
              />
              <span className={classes.text}>{item.text}</span>
            </div>
          );
        })}
      </nav>
      <SearchModal 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};

export default React.memo(MobileNav);