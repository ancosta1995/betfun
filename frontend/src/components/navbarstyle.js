// styles.js
import { styled, makeStyles } from '@material-ui/core/styles';
import { motion } from 'framer-motion';
import { AppBar, IconButton, Typography, Button, Box } from '@material-ui/core';
import { themeConfig } from '../config/config';  // Adjust the path if necessary

// makeStyles
export const useStyles = makeStyles(theme => ({
    desktop: {
    display: "flex",
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  home: {
    backgroundColor: "#1a1b33",
    borderRadius: "0.25rem",
    padding: "10px",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    cursor: "pointer",
    color: "#9E9FBD",
    userSelect: "none",
    fontWeight: 500,
    position: "relative",
    justifyContent: "center",

  display: 'none', // Default is hidden
  [theme.breakpoints.down('xs')]: {
    display: 'flex',
    padding: "10px",
    right: "20px"

  },
  // Hide it on sm and larger screens
  [theme.breakpoints.up('sm')]: {
    display: 'none',
  },
  },
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  notificationsButton: {
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },  },
  notificationContainer: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    top: '70px', // Adjust as needed
    right: '0px',
  backgroundColor: 'rgb(18, 19, 38)',
  borderRadius: '8px',
  boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.3)',
  width: 'auto',
  maxWidth: '25rem',

  maxHeight: '500px',
  
  overflowY: 'auto',
  zIndex: 1001,
  padding: '1rem',
  border: '1px solid rgba(0, 0, 0, 0.3)',
  fontFamily: '"Poppins", sans-serif',
      [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  notificationItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:last-child': {
      borderBottom: 'none',
    },
    
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  deleteIcon: {
    cursor: 'pointer',
    marginRight: '10px',
  },
  chatButton: {
    cursor: 'pointer',
    width: '40px',
    height: '40px',
    borderRadius: '50%', // For a circular container
    border: '1.5px solid rgb(41 42 68)', // Border styling
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1b33',
    marginLeft: '15px',
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },

  logoContainer: {
    position: "relative",
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  logo: {
    width: '36px',
    height: '28px',
    background: 'url(https://shuffle.com/images/navigation/mobile-tab-background-active.svg) no-repeat center center',
    backgroundSize: 'cover',
    display: 'inline-block',
    userSelect: 'none',
    marginBottom: '0.2rem',
    borderRadius: '5px',
    clipPath: 'url(#logo-clip-path)',
    filter: 'invert(46%) sepia(88%) saturate(1939%) hue-rotate(180deg) brightness(100%) contrast(101%)',
    cursor: 'pointer',
  },
  logo2: {
    
    display: "flex",
    width: "200px",
    display: 'inline-block',
  },
  svg: {
    fill: '#FFFFFF',
    width: '100%',
    height: '100%',
    marginLeft: '3rem',
    gap: '2rem',
    userSelect: 'none',
    display: 'block',
    clipPath: 'url(#logo-clip-path)',
  },
  logoText: {
    cursor: 'pointer',
    marginLeft: '10px',
  },

  mobile: {
    display: "none",
    height: "100%",
    margin: 0,
    position: "relative",
    alignItems: "center",
    padding: "0 0.5rem",
    justifyContent: "space-between",
    [theme.breakpoints.down("xs")]: {
      display: "flex",
    },
  },
  searchInput: {
    backgroundColor: '#1a1b33',
    color: '#fff',
    '& .MuiInputBase-input': {
      color: '#fff',
      height: '1.5em',
    },
    '& .MuiInputLabel-root': {
      color: '#9E9FBD',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#1b1c2a',
      },
      '&:hover fieldset': {
        borderColor: '#2871FF',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#2871FF',
      },
    },
    '& .search-icon-container': {
      display: 'flex',
      alignItems: 'center',
      padding: '0 8px',
    },
  },
  cashierButtonXs: {
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
    },
  },
  cashierButtonLg: {
    display: 'flex',
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },

  cashierButton: {
    // borderTopRightRadius: '0.25rem',
    // borderBottomRigbohtRadius: '0.25rem',
    borderRadius: "0.25rem",
    backgroundColor: themeConfig.mainbutton,
    fontWeight: 500,
    display: 'none',

    fontSize: '12px',
    alignItems: 'center',
    gap: '0.25rem',
    padding: '0.75rem 1rem',
    cursor: 'pointer',
    userSelect: 'none',
    color: '#FFFFFF', // Add text color
    transition: 'background-color 0.3s ease', // Optional transition for hover effect

    [theme.breakpoints.down('xs')]: {
      padding: '0.75rem 1rem',
      display: 'flex',

    },
  },

  cashierButtons: {
    // borderTopRightRadius: '0.25rem',
    // borderBottomRigbohtRadius: '0.25rem',
    borderRadius: "0.25rem",
    backgroundColor: themeConfig.mainbutton,
    display: 'flex',
    fontWeight: 500,
    fontSize: '12px',
    alignItems: 'center',
    gap: '0.25rem',
    padding: '0.75rem 1rem',
    cursor: 'pointer',
    userSelect: 'none',
    color: '#FFFFFF', // Add text color
    transition: 'background-color 0.3s ease', // Optional transition for hover effect

    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },

  buttonIcon: {
    marginRight: ".5em",
    fill: "#9E9FBD",
    flex: "none",
    height: "1em",
    width: "1em",
    display: "inline-block",
    outline: "none",
  },
  signin: {
    backgroundColor: "#1a1b33",
    borderRadius: "0.25rem",
    padding: "10px 1rem",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    color: "#9E9FBD",
    userSelect: "none",
    fontWeight: 500,
    position: "relative",
    justifyContent: "center",
    [theme.breakpoints.down("xs")]: {
      padding: "10px"
    },
  },
}));

// styled components
export const LogoImage = styled('img')({
  width: '16px',
  height: '16px',
  marginRight: '0.5rem',
});


export const IconWrapper = styled(Box)(({ theme }) => ({
  marginRight: '10px',
}));


export const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: themeConfig.secondbackground,
  borderBottom: themeConfig.secondborder,
  boxShadow: "none",
  width: "100%",
  position: "sticky",
  display: 'flex',
  justifyContent: 'center',
  top: 0,
  paddingLeft: "auto",
  paddingRight: "auto",
  marginLeft: "auto",
  marginRight: "auto",
  padding: "0.2rem 6rem",
  [theme.breakpoints.down('lg')]: {
    padding: "0rem 1rem",
  },

  [theme.breakpoints.down('xs')]: {
    padding: "0rem 1rem",
    height: "70px",
  },
}));
export const NotificationContainer = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '80px',
  right: '10px',
  backgroundColor: 'rgb(18, 19, 38)',
  borderRadius: '8px',
  boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.3)',
  width: '400px',
  maxHeight: '500px',
  
  overflowY: 'auto',
  zIndex: 1001,
  padding: '1rem',
  border: '1px solid rgba(0, 0, 0, 0.3)',
  fontFamily: '"Poppins", sans-serif',
      [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  }));

export const NotificationItem = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: 'rgb(26, 27, 51)',
  color: '#FFFFFF',
  padding: '0.75rem',
  borderRadius: '8px',
  marginBottom: '0.75rem',
  cursor: 'pointer',
  position: 'relative',
  '&:hover': {
    backgroundColor: 'rgb(30, 31, 61)',
  },
});

export const NotificationTitle = styled('div')({
  fontWeight: '600',
  fontSize: '14px',
  marginBottom: '0.25rem',
  fontFamily: '"Poppins", sans-serif',
});

export const NotificationDescription = styled('div')({
  fontSize: '12px',
  marginBottom: '0.5rem',
  fontFamily: '"Poppins", sans-serif',
});

export const NotificationTime = styled('div')({
  fontSize: '12px',
  color: '#BBBBBB',
});

export const DeleteIcon = styled(IconButton)({
  position: 'absolute',
  top: '0.5rem',
  right: '0.5rem',
  color: '#BBBBBB',
  '&:hover': {
    color: '#FF0000',
  },
});

export const LogoContainer = styled('div')({
  position: "relative",
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  userSelect: 'none',
});

export const Logo = styled('div')({
  width: '36px',
  height: '24px',
  
  background: 'url(https://shuffle.com/images/navigation/mobile-tab-background-active.svg) no-repeat center center',
  backgroundSize: 'cover',
  display: 'inline-block',
  marginRight: '0.5rem',
  borderRadius: '5px',
});

export const LogoText = styled(Typography)({
  filter: "invert(46%) sepia(88%) saturate(1939%) hue-rotate(180deg) brightness(100%) contrast(101%)", // Apply color filter to the image on hover

  fontWeight: 700,
  fontFamily: '"Montserrat", sans-serif',
  letterSpacing: '1px',
  background: 'url(https://shuffle.com/images/navigation/mobile-tab-background-active.svg)',
  backgroundSize: 'cover',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  fontSize: '1.5rem',
});

export const BalanceButton = styled(motion.div)(({ theme }) => ({
  backgroundColor: '#131426',
  color: "#fff",
  borderRadius: "0.25rem",
  padding: "0.6rem 1rem",
  height: "100%",
  width: "auto",
  minWidth: "8rem",
  userSelect: "none",
//   marginLeft: "0.5rem",
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: '1.5px solid #1b1c2a',
  marginLeft: "0.5rem",
  borderRadius: '0.25rem',
  cursor: 'pointer',
  transition: '0.3s all',
  textWrap: 'nowrap',
  whiteSpace: 'nowrap',
  '&:hover': {
    backgroundColor: '#1a1b33',
    border: '1px solid rgb(32, 112, 223)',
  },
  '&:active': {
    transform: 'scale(0.97)',
  },
  '& img': {
    transition: '0.3s all',
  },
}));

export const CashierButton = styled(Button)(({ theme }) => ({
  backgroundColor: "hsl(215, 75%, 50%)",
  color: "#fff",
  borderRadius: "0.25rem",
  padding: "0.6rem 1rem",
  height: "100%",
  '&:hover': {
    backgroundColor: "hsl(215, 75%, 60%)",
  },
  [theme.breakpoints.down('sm')]: {
    padding: "0.25rem 0.5rem",
    fontSize: "0.75rem",
  },
}));

export const Dropdown = styled('div')({
  position: 'absolute',
  top: '55px',
  right: 0,
  backgroundColor: '#0A0B1C',
  border: '1px solid #1b1c2a',
  borderRadius: '4px',
  width: '97%',
  maxHeight: '345px',
  overflowY: 'auto',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

export const FixedHeader = styled('div')({
  padding: '0.75rem 1rem',
  backgroundColor: '#0A0B1C',
  borderBottom: '1px solid #1b1c2a',
  position: 'sticky',
  top: 0,
  zIndex: 1001,
  backgroundColor: '#0A0B1C',
  borderBottom: '1px solid #1b1c2a',
});

export const ScrollableContent = styled('div')({
  flex: 1,
  overflowY: 'auto',
});

export const DropdownContent = styled('div')({
  flex: 1,
  overflowY: 'auto',
});

export const DropdownFooter = styled('div')({
  backgroundColor: '#101123',
  padding: '0.75rem 1rem',
  borderTop: '1px solid #1b1c2a',
  cursor: 'pointer',
  textAlign: 'center',
});

export const DropdownItem = styled(motion.div)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.75rem 1rem',
  color: 'white',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: '#1a1b33',
  },
  '&:not(:last-child)': {
    borderBottom: '1px solid #1b1c2a',
  },
}));

export const DropdownIcon = styled('img')({
  width: '20px',
  height: '20px',
  marginRight: '12px',
});

export const DropdownText = styled('div')({
  flex: 1,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontFamily: "Rubik",
  fontWeight: 400,
  letterSpacing: ".05em",
  fontSize: "12px",
});
