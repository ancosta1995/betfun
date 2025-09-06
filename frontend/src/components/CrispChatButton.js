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

const CrispChatButton = ({ showOnMobile = false }) => {
  const classes = useStyles();
  const [visible, setVisible] = React.useState(true);

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

  // Function to open Crisp chat
  const handleOpenChat = () => {
    if (window.crispHelpers) {
      window.crispHelpers.showChat();
      window.crispHelpers.openChat();
    } else if (window.$crisp) {
      window.$crisp.push(["do", "chat:show"]);
      window.$crisp.push(["do", "chat:open"]);
    }
  };

  if (!visible) return null;

  return (
    <Button
      className={classes.button}
      variant="contained"
      color="primary"
      onClick={handleOpenChat}
      aria-label="Open chat"
    >
      <ChatIcon className={classes.icon} />
    </Button>
  );
};

export default CrispChatButton; 