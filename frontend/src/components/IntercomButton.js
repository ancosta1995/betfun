import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ChatIcon from '@material-ui/icons/Chat';

const useStyles = makeStyles((theme) => ({
  button: {
    position: 'fixed',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
    borderRadius: '50%',
    width: 56,
    height: 56,
    minWidth: 0,
    zIndex: 1000,
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
    '&:hover': {
      backgroundColor: '#2563eb',
    },
    [theme.breakpoints.down('sm')]: {
      bottom: theme.spacing(2),
      right: theme.spacing(2),
      width: 48,
      height: 48,
    },
  },
  icon: {
    fontSize: 24,
  },
}));

const IntercomButton = ({ showOnMobile = false }) => {
  const classes = useStyles();
  const [visible, setVisible] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  // Hide button on mobile if showOnMobile is false
  React.useEffect(() => {
    if (!showOnMobile && window.innerWidth < 768) {
      setVisible(false);
    } else {
      setVisible(true);
    }

    const handleResize = () => {
      if (!showOnMobile && window.innerWidth < 768) {
        setVisible(false);
      } else {
        setVisible(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showOnMobile]);

  // Function to open Intercom messenger
  const handleOpenMessenger = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) return false;
    
    setIsLoading(true);
    
    // Add a small delay to ensure the Intercom is ready
    setTimeout(() => {
      try {
        if (window.intercomHelpers && window.intercomHelpers.openMessenger) {
          window.intercomHelpers.openMessenger();
        } else if (window.Intercom && typeof window.Intercom === 'function') {
          window.Intercom('show');
        }
      } catch (error) {
        console.error('Error opening Intercom:', error);
      } finally {
        setIsLoading(false);
      }
    }, 100);
    
    return false;
  };

  if (!visible) return null;

  return (
    <Button
      id="intercom-custom-launcher"
      className={classes.button}
      variant="contained"
      color="primary"
      onClick={handleOpenMessenger}
      disabled={isLoading}
      aria-label="Open chat"
    >
      <ChatIcon className={classes.icon} />
    </Button>
  );
};

export default IntercomButton; 