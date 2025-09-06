import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography, IconButton, Button, List, ListItem, ListItemIcon, ListItemText, Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';

// Use makeStyles for styling in Material-UI v4
const useStyles = makeStyles((theme) => ({
  container: {
    width: 300,
    backgroundColor: '#1e2329',
    color: '#fff',
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1, 2),
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  list: {
    padding: 0,
  },
  listItem: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: (props) => (props.status === 'confirmed' ? '#4caf50' : 'transparent'),
    marginLeft: theme.spacing(1),
  },
}));

// Notification Component
const Notification = ({ title, amount, status, timestamp }) => {
  const classes = useStyles({ status });

  return (
    <ListItem className={classes.listItem}>
      <ListItemIcon>
        <AccountBalanceWalletIcon style={{ color: '#4caf50' }} />
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography variant="body1" component="div" style={{ display: 'flex', alignItems: 'center' }}>
            {title}
            <span className={classes.statusDot} />
          </Typography>
        }
        secondary={
          <Typography variant="body2" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Your deposit of ${amount.toFixed(2)} 💰 has been
            {status === 'confirmed' ? ' successfully processed.' : ' registered and awaiting confirmation.'}
          </Typography>
        }
      />
      {timestamp && (
        <Typography variant="caption" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          {timestamp}
        </Typography>
      )}
    </ListItem>
  );
};

// Reusable Notification Modal Component
const NotificationModal = ({ open, handleClose, notifications }) => {
  const classes = useStyles();

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        <Box className={classes.header}>
          <Typography variant="h6">Notifications</Typography>
          <IconButton size="small" style={{ color: '#fff' }} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box className={classes.container}>
          <Box display="flex" justifyContent="space-between" alignItems="center" px={2} py={1}>
            <Typography variant="body2">New</Typography>
            <Button size="small" style={{ color: '#4caf50' }}>
              Mark all as read
            </Button>
          </Box>
          <List className={classes.list}>
            {notifications.map((notification, index) => (
              <Notification key={index} {...notification} />
            ))}
          </List>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationModal;
