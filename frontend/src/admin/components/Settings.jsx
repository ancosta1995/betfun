import React, { useState } from 'react';
import {
  makeStyles,
  Paper,
  Typography,
  Grid,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Card,
  CardContent,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    backgroundColor: '#101123',
    color: '#fff',
    border: '1px solid #2f3947',
    padding: theme.spacing(3),
  },
  title: {
    color: '#9EA9BF',
    fontFamily: 'Poppins',
    fontSize: '18px',
    fontWeight: 500,
    marginBottom: theme.spacing(3),
  },
  section: {
    marginBottom: theme.spacing(4),
  },
  divider: {
    backgroundColor: '#2f3947',
    margin: theme.spacing(3, 0),
  },
  formControl: {
    marginBottom: theme.spacing(2),
    '& .MuiFormControlLabel-label': {
      color: '#fff',
      fontFamily: 'Poppins',
    },
  },
  textField: {
    marginBottom: theme.spacing(2),
    '& .MuiOutlinedInput-root': {
      color: '#fff',
      '& fieldset': {
        borderColor: '#2f3947',
      },
      '&:hover fieldset': {
        borderColor: '#2f3947',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#2f3947',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#9EA9BF',
    },
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#43A047',
    },
  },
  card: {
    backgroundColor: '#050614',
    border: '1px solid #2f3947',
    marginBottom: theme.spacing(2),
  },
  cardTitle: {
    color: '#9EA9BF',
    fontFamily: 'Poppins',
    fontSize: '16px',
    fontWeight: 500,
    marginBottom: theme.spacing(2),
  },
}));

const Settings = () => {
  const classes = useStyles();
  const [settings, setSettings] = useState({
    maintenance: {
      enabled: false,
      message: 'Site is under maintenance. Please check back later.',
    },
    security: {
      twoFactorRequired: false,
      maxLoginAttempts: 5,
      sessionTimeout: 60,
    },
    notifications: {
      emailNotifications: true,
      telegramNotifications: true,
      discordWebhook: '',
    },
    limits: {
      maxWithdrawal: 1000,
      minDeposit: 10,
      maxDeposit: 10000,
    },
  });

  const handleToggle = (section, field) => {
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [field]: !settings[section][field],
      },
    });
  };

  const handleValueChange = (section, field, value) => {
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [field]: value,
      },
    });
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card className={classes.card}>
            <CardContent>
              <Typography className={classes.cardTitle}>
                Maintenance Settings
              </Typography>
              <FormControlLabel
                className={classes.formControl}
                control={
                  <Switch
                    checked={settings.maintenance.enabled}
                    onChange={() => handleToggle('maintenance', 'enabled')}
                    color="primary"
                  />
                }
                label="Maintenance Mode"
              />
              <TextField
                className={classes.textField}
                label="Maintenance Message"
                variant="outlined"
                fullWidth
                multiline
                rows={2}
                value={settings.maintenance.message}
                onChange={(e) =>
                  handleValueChange('maintenance', 'message', e.target.value)
                }
              />
            </CardContent>
          </Card>

          <Card className={classes.card}>
            <CardContent>
              <Typography className={classes.cardTitle}>
                Security Settings
              </Typography>
              <FormControlLabel
                className={classes.formControl}
                control={
                  <Switch
                    checked={settings.security.twoFactorRequired}
                    onChange={() => handleToggle('security', 'twoFactorRequired')}
                    color="primary"
                  />
                }
                label="Require 2FA for All Users"
              />
              <TextField
                className={classes.textField}
                label="Max Login Attempts"
                variant="outlined"
                fullWidth
                type="number"
                value={settings.security.maxLoginAttempts}
                onChange={(e) =>
                  handleValueChange('security', 'maxLoginAttempts', Number(e.target.value))
                }
              />
              <TextField
                className={classes.textField}
                label="Session Timeout (minutes)"
                variant="outlined"
                fullWidth
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) =>
                  handleValueChange('security', 'sessionTimeout', Number(e.target.value))
                }
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card className={classes.card}>
            <CardContent>
              <Typography className={classes.cardTitle}>
                Notification Settings
              </Typography>
              <FormControlLabel
                className={classes.formControl}
                control={
                  <Switch
                    checked={settings.notifications.emailNotifications}
                    onChange={() => handleToggle('notifications', 'emailNotifications')}
                    color="primary"
                  />
                }
                label="Email Notifications"
              />
              <FormControlLabel
                className={classes.formControl}
                control={
                  <Switch
                    checked={settings.notifications.telegramNotifications}
                    onChange={() => handleToggle('notifications', 'telegramNotifications')}
                    color="primary"
                  />
                }
                label="Telegram Notifications"
              />
              <TextField
                className={classes.textField}
                label="Discord Webhook URL"
                variant="outlined"
                fullWidth
                value={settings.notifications.discordWebhook}
                onChange={(e) =>
                  handleValueChange('notifications', 'discordWebhook', e.target.value)
                }
              />
            </CardContent>
          </Card>

          <Card className={classes.card}>
            <CardContent>
              <Typography className={classes.cardTitle}>
                Transaction Limits
              </Typography>
              <TextField
                className={classes.textField}
                label="Maximum Withdrawal"
                variant="outlined"
                fullWidth
                type="number"
                value={settings.limits.maxWithdrawal}
                onChange={(e) =>
                  handleValueChange('limits', 'maxWithdrawal', Number(e.target.value))
                }
              />
              <TextField
                className={classes.textField}
                label="Minimum Deposit"
                variant="outlined"
                fullWidth
                type="number"
                value={settings.limits.minDeposit}
                onChange={(e) =>
                  handleValueChange('limits', 'minDeposit', Number(e.target.value))
                }
              />
              <TextField
                className={classes.textField}
                label="Maximum Deposit"
                variant="outlined"
                fullWidth
                type="number"
                value={settings.limits.maxDeposit}
                onChange={(e) =>
                  handleValueChange('limits', 'maxDeposit', Number(e.target.value))
                }
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Button
        variant="contained"
        className={classes.saveButton}
        fullWidth
        style={{ marginTop: '16px' }}
      >
        Save Changes
      </Button>
    </div>
  );
};

export default Settings;
