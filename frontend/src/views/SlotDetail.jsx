import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { motion } from 'framer-motion';
import Preloader from '../Preloader2';
import { SlotsSocket } from '../services/websocket.service';
import { updateCurrency, DisplayFiat, updateFiat } from "../actions/auth";
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import TheatersIcon from '@material-ui/icons/Theaters';
import Button from '@material-ui/core/Button';
import Select, { components } from 'react-select'; // Import React Select and components
import logo from "../assets/logo.png";

// Add mobile detection
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: '#1a1b33', // Background color of the control
    borderColor: state.isFocused || state.isHovered ? 'hsl(251.31deg, 75%, 50%)' : '#1b1c2a', // Border color when focused or hovered
    boxShadow: state.isFocused ? '0 0 0 1px hsl(251.31deg, 75%, 50%)' : 'none', // Box shadow for focused state
    color: '#fff', // Text color
    borderRadius: '4px', // Rounded corners for modern look
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease', // Smooth transition for border color and shadow
    fontSize: '13px', // Smaller font size for options
    // width: '60px', // Set the width of the select control
    // display: 'flex',
    // flexDirection: 'column',
    // alignItems: 'center',

    '&:hover': {
      borderColor: 'hsl(251.31deg, 75%, 50%)', // Border color on hover
    },
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
    backgroundColor: '#1a1b33', // Background color of the menu
    borderRadius: '4px', // Rounded corners for options
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)', // Softer shadow
    position: 'absolute',
    top: 'auto',
    bottom: '100%', // Menu opens upwards
    marginBottom: '10px',
    animation: 'fade-in 0.3s ease', // Optional fade-in animation
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? 'hsl(251.31deg, 75%, 50%)' : state.isFocused ? 'hsl(251.31deg, 75%, 40%)' : '#1a1b33', // Change background for focused state
    color: '#fff', // Ensure option text color is white
    padding: '7px 13px', // Reduced padding for options
    borderRadius: '4px', // Rounded corners for options
    transition: 'background-color 0.2s ease', // Smooth transition for background color
    fontSize: '13px', // Smaller font size for options
    '&:hover': {
      backgroundColor: 'hsl(251.31deg, 75%, 40%)', // Hover background color
      color: '#fff', // Ensure hover text color is white
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#fff', // Text color of the selected option
    fontSize: '14px', // Smaller font size for selected value
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#aaa', // Lighter color for the placeholder
    fontSize: '14px', // Smaller font size for the placeholder
  }),
    // // Hide the dropdown arrow
    // indicatorsContainer: (provided) => ({
    //   ...provided,
    //   display: 'none', // Hides the arrow container
    // }),
    // dropdownIndicator: (provided) => ({
    //   display: 'none', // Hides the arrow itself
    // }),
};



const useStyles = makeStyles(theme => ({
  root: {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '30px',
    [theme.breakpoints.down('sm')]: {
      padding: 0,
      marginTop: 0,
      width: '100%',
      height: '100vh',
      justifyContent: 'center',
    },
  },
  container: {
    width: '100%',
    maxWidth: 1150,
    aspectRatio: '16/9',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0a0b1c',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      height: 'calc(100vh - 56px)',
      aspectRatio: 'auto',
    },
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
  },
  
  footer: {
    backgroundColor: '#0a0b1c',
    width: '100%',
    maxWidth: 1150,
    marginTop: 'auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem',
    position: 'relative',

  },
  footerLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  footerContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    textAlign: 'center',
  },
  logo: {
    height: '1.3rem',
    cursor: 'pointer',
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  iconButton: {
    margin: '0 10px',
    color: 'white',
    cursor: 'pointer',
    '&:hover': {
      transform: 'scale(1.2)',
    },
  },
  demoMessage: {
    color: 'white',
    textAlign: 'center',
    marginTop: '10px',
  },

  preloader: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  error: {
    color: 'white',
    textAlign: 'center',
    marginTop: '20px',
  },
  modeButton: {
    margin: '0 5px',
  },
  fiatSelect: {
    width: 200,
    margin: '0 10px',
  },
}));

const SlotDetail = (props) => {
  const { user, isAuthenticated, selectedCurrency, selectedLogo, selectedFiatCurrency, updateFiat } = props;
  
  const { identifier } = useParams();
  const [launchUrl, setLaunchUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPreloader, setShowPreloader] = useState(true);
  const [error, setError] = useState(null);
  const classes = useStyles();
  const history = useHistory();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [theaterMode, setTheaterMode] = useState(false);
  const [currentMode, setCurrentMode] = useState('Real');
  const [fiatCurrency, setFiatCurrency] = useState(selectedFiatCurrency);
  const fiatCurrencies = [
    { value: 'USD', label: 'USD', icon: 'https://shuffle.com/icons/fiat/USD.svg' },
    { value: 'EUR', label: 'EUR', icon: 'https://shuffle.com/icons/fiat/EUR.svg' },
    { value: 'IDR', label: 'IDR', icon: 'https://shuffle.com/icons/fiat/IDR.svg' },
    { value: 'TRY', label: 'TRY', icon: 'https://shuffle.com/icons/fiat/TRY.svg' },
    { value: 'MXN', label: 'MXN', icon: 'https://shuffle.com/icons/fiat/MXN.svg' },
    { value: 'BRL', label: 'BRL', icon: 'https://shuffle.com/icons/fiat/BRL.svg' },
    { value: 'JPY', label: 'JPY', icon: 'https://shuffle.com/icons/fiat/JPY.svg' },
    { value: 'CAD', label: 'CAD', icon: 'https://shuffle.com/icons/fiat/CAD.svg' },
    { value: 'CNY', label: 'CNY', icon: 'https://shuffle.com/icons/fiat/CNY.svg' },
    { value: 'DKK', label: 'DKK', icon: 'https://shuffle.com/icons/fiat/DKK.svg' },
    { value: 'KRW', label: 'KRW', icon: 'https://shuffle.com/icons/fiat/KRW.svg' },
    { value: 'PHP', label: 'PHP', icon: 'https://shuffle.com/icons/fiat/PHP.svg' },
    { value: 'NZD', label: 'NZD', icon: 'https://shuffle.com/icons/fiat/NZD.svg' },
    { value: 'ARS', label: 'ARS', icon: 'https://shuffle.com/icons/fiat/ARS.svg' },
    { value: 'RUB', label: 'RUB', icon: 'https://shuffle.com/icons/fiat/RUB.svg' }
  ];
  

  const handleModeChange = (mode) => {
    setCurrentMode(mode);
  };

  useEffect(() => {
    console.log('Identifier:', identifier);
  }, [identifier]);

  const handleFullscreen = () => {
    const iframe = document.querySelector('iframe');
    if (iframe) {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if (iframe.mozRequestFullScreen) {
        iframe.mozRequestFullScreen();
      } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen();
      } else if (iframe.msRequestFullscreen) {
        iframe.msRequestFullscreen();
      }
    } else {
      console.error('Iframe element not found for fullscreen mode');
    }
  };
// Custom option component to display the currency icon and label
const CustomOption = (props) => {
  const { data } = props;

  return (
    <components.Option {...props}>
      <img 
        src={data.icon} 
        alt={data.label} 
        style={{ width: 16, height: 16, marginRight: 8, marginBottom: -3 }} // Adjusted icon size
      />
      {data.label}
    </components.Option>
  );
};

  const toggleTheaterMode = () => {
    setTheaterMode(!theaterMode);
  };

  const open = (x) => {
    if (x && x.launch_url) {
      // Configure iframe based on game settings
      const iframeConfig = {
        src: x.launch_url,
        className: classes.iframe,
        title: "Game iframe",
        allowFullScreen: true,
        style: {
          aspectRatio: x.width === "16:9" ? "16/9" : "3/4"
        }
      };

      // If the game doesn't support iframe or is on mobile and withoutFrame is true
      if (x.withoutFrame === true || (isMobile && x.withoutFrame === true)) {
        window.location.href = x.launch_url;
        return;
      }

      setLaunchUrl(x.launch_url);
      setLoading(false);
    } else {
      setError('Game not found');
      setLoading(false);
    }
  };

  useEffect(() => {
    const generate = () => {
      const config = {
        game_url: identifier.replace('slots/', ''),
        currency: selectedCurrency || 'USD',
        fiat: fiatCurrency || 'USD'
      };
      console.log("Sending game session request:", config);
      SlotsSocket.emit('slots:generatesession', config);
    };

    if (user && isAuthenticated) {
      generate();
    }

    SlotsSocket.on('slots:generatesession', generate);
    SlotsSocket.on('slots:result', open);

    const timer = setTimeout(() => setShowPreloader(false), 1000);

    return () => {
      clearTimeout(timer);
      SlotsSocket.off('slots:generatesession', generate);
      SlotsSocket.off('slots:result', open);
    };
  }, [selectedCurrency, fiatCurrency, identifier, user, isAuthenticated]);

  useEffect(() => {
    let timer;
    if (!loading && showPreloader) {
      timer = setTimeout(() => setShowPreloader(false), 1000);
    } else if (loading) {
      setShowPreloader(true);
    }
    return () => clearTimeout(timer);
  }, [loading, showPreloader]);

  useEffect(() => {
    if (error) {
      setTimeout(() => history.push('/404'), 1000);
    }
  }, [error, history]);

  const handleLogoClick = () => {
    // Define the action when the logo is clicked
  };

  const handleFiatCurrencyChange = (selectedOption) => {
    const selectedCurrency = selectedOption.value;
    setFiatCurrency(selectedCurrency);
    updateFiat(selectedCurrency);
  };

  return (
    <div className={classes.root}>
    <div className={classes.container}>
      {showPreloader && <div className={classes.preloader}><Preloader /></div>}
      {error ? (
        <p className={classes.error}>{error}</p>
      ) : launchUrl ? (
        <iframe
          src={launchUrl} 
          className={classes.iframe}
          title="Game iframe"
          allowFullScreen
        ></iframe>
      ) : (
        <p>Loading...</p>
      )}
    </div>
    <div className={classes.footer}>
      <div className={classes.footerLeft}>
        <FullscreenIcon className={classes.iconButton} onClick={handleFullscreen} />
        <TheatersIcon className={classes.iconButton} onClick={toggleTheaterMode} />
      </div>
      
      <div className={classes.footerContent}>
        <motion.img
          src={logo}
          alt="Logo"
          className={classes.logo}
          onClick={handleLogoClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        />
      </div>

      <div className={classes.footerRight}>
        {/* Select bileşenini ve butonları yan yana yerleştirdik */}
        <div style={{ display: 'flex', alignItems: 'center'}}>
        <motion.div
      initial={{ opacity: 0 }} // Initial state for fade-in effect
      animate={{ opacity: 1 }} // Animate to full opacity
      transition={{ duration: 0.3 }} // Duration of the animation
    >
      <Select
        styles={{ ...customStyles, container: (provided) => ({ ...provided, marginRight: '1px' }) }}
        options={fiatCurrencies}
        value={fiatCurrencies.find(option => option.value === fiatCurrency)}
        onChange={handleFiatCurrencyChange}
        components={{ Option: CustomOption }} // Use custom option component
        placeholder="Select Fiat Currency"
        className={classes.select} // Apply additional styles if needed
      />
    </motion.div>


          
{/* Framer Motion buttons */}
<motion.button
  whileHover={{ scale: 1, opacity: 1 }} // Scale and opacity on hover
  whileTap={{ scale: 0.95 }} // Scale down on tap
  style={{
    padding: '10px 20px',
    backgroundColor: 'hsl(251.31deg, 75%, 50%)',
    marginLeft: '16px', // Space between select and button container
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease', // Smooth transition for background and shadow
    boxShadow: '0 0 15px rgba(58, 9, 131, 0.5)', // Initial glow effect
    color: currentMode === 'Real' ? 'white' : '#3f51b5',
    border: `2px solid hsl(251.31deg, 75%, 50%)`,
    borderRadius: '8px',
    cursor: 'pointer',
  }}
  onClick={() => handleModeChange('Real')}
>
  Real
</motion.button>

<motion.button
  whileHover={{ scale: currentMode === 'Demo' ? 1 : undefined, opacity: currentMode === 'Demo' ? 1 : undefined }} // Scale and opacity on hover only if not disabled
  whileTap={{ scale: currentMode === 'Demo' ? 1 : 0.95 }} // Scale down on tap only if not disabled
  style={{
    padding: '10px 20px',
    backgroundColor: currentMode === 'Demo' ? '#3f51b5' : 'transparent',
    color: currentMode === 'Demo' ? 'white' : '#3f51b5',
    border: `1px solid hsl(251.31deg, 75%, 50%)`,
    borderRadius: '8px',
    cursor: 'not-allowed', // Change cursor to indicate disabled state
    marginLeft: '8px', // Add space between buttons
    opacity: currentMode === 'Demo' ? 0.5 : 1, // Reduce opacity if disabled
  }}
  onClick={() => currentMode !== 'Real' && handleModeChange('Real')} // Only call handleModeChange if current mode is not Demo
>
  Demo
</motion.button>


          </div>

        </div>
      </div>
    </div>
  );
};

SlotDetail.propTypes = {
  user: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  selectedCurrency: PropTypes.string.isRequired,
  selectedLogo: PropTypes.string.isRequired,
  selectedFiatCurrency: PropTypes.string.isRequired,
  DisplayFiat: PropTypes.string.isRequired,
  DisplayForFiat: PropTypes.string.isRequired,
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

export default connect(mapStateToProps, { updateCurrency, updateFiat, DisplayFiat })(SlotDetail);
