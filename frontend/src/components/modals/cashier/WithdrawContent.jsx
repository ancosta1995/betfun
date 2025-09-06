import React from 'react';
import { Grid, FormControl, Select, MenuItem, Typography, Button } from '@material-ui/core';

const WithdrawContent = ({ classes, withdrawCrypto, setWithdrawCrypto, withdrawNetwork, setWithdrawNetwork, handleWithdrawSubmit, cryptoOptions, networkOptions }) => (
  <form className={classes.withdrawForm} onSubmit={handleWithdrawSubmit}>
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <FormControl variant="outlined" fullWidth>
          <Typography className={classes.formLabel}>Currency</Typography>
          <Select
            value={withdrawCrypto}
            onChange={(e) => {
              setWithdrawCrypto(e.target.value);
              setWithdrawNetwork(networkOptions[e.target.value][0]);
            }}
            MenuProps={{
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
              transformOrigin: {
                vertical: 'top',
                horizontal: 'left',
              },
              getContentAnchorEl: null,
              PaperProps: {
                style: {
                  backgroundColor: 'rgba(10, 11, 28, 0.95)',
                }
              }
            }}
            onClose={(e) => e.stopPropagation()}
          >
            {cryptoOptions.map((option) => (
              <MenuItem key={option.value} value={option.value} className={classes.selectItem}>
                <img src={option.icon} alt={option.label} style={{ marginRight: '8px', marginBottom: "-2px"}} />
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <FormControl variant="outlined" fullWidth>
          <Typography className={classes.formLabel}>Select Network</Typography>
          <Select
            value={withdrawNetwork}
            onChange={(e) => setWithdrawNetwork(e.target.value)}
            MenuProps={{
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
              transformOrigin: {
                vertical: 'top',
                horizontal: 'left',
              },
              getContentAnchorEl: null,
              PaperProps: {
                style: {
                  backgroundColor: 'rgba(10, 11, 28, 0.95)',
                }
              }
            }}
            onClose={(e) => e.stopPropagation()}
          >
            {networkOptions[withdrawCrypto].map((network) => (
              <MenuItem key={network} value={network} className={classes.selectItem}>
                {network}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>

    <Typography className={classes.formLabel}>Withdrawal Address</Typography>
    <input
      className={classes.customField}
      placeholder="Enter your withdrawal address"
    />

    <Typography className={classes.formLabel}>Amount</Typography>
    <input
      className={classes.customField}
      placeholder="Enter amount to withdraw"
      type="number"
    />

    <Typography className={classes.warning}>
      Important: Please double-check the withdrawal address and network type before proceeding.
    </Typography>

    <Button
      type="submit"
      className={classes.submitButton}
      variant="contained"
    >
      Withdraw {withdrawCrypto}
    </Button>
  </form>
);

export default WithdrawContent; 