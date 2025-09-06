import React from 'react';
import { Grid, FormControl, InputLabel, Select, MenuItem, Typography, IconButton } from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { QRCodeSVG } from "qrcode.react";

const DepositContent = ({ classes, depositCrypto, setDepositCrypto, depositNetwork, setDepositNetwork, handleCopyAddress, cryptoOptions, networkOptions, depositAddresses }) => (
  <div className={classes.depositForm}>
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <FormControl variant="outlined" fullWidth>
          <InputLabel>Choose Cryptocurrency</InputLabel>
          <Select
            value={depositCrypto}
            onChange={(e) => {
              setDepositCrypto(e.target.value);
              setDepositNetwork(networkOptions[e.target.value][0]);
            }}
            label="Choose Cryptocurrency"
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
          <InputLabel>Network Type</InputLabel>
          <Select
            value={depositNetwork}
            onChange={(e) => setDepositNetwork(e.target.value)}
            label="Network Type"
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
            {networkOptions[depositCrypto].map((network) => (
              <MenuItem key={network} value={network} className={classes.selectItem}>
                {network}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>

    {depositCrypto && depositNetwork && (
      <>
        <Typography variant="subtitle1" gutterBottom style={{marginTop: '20px', color: '#7B79F7', fontWeight: 600, fontSize: '0.9rem'}}>
          Your Personal Deposit Address
        </Typography>
        <div 
          className={classes.addressBox} 
          onClick={() => handleCopyAddress(depositAddresses[depositCrypto])}
        >
          <span>{depositAddresses[depositCrypto]}</span>
          <IconButton 
            className={classes.copyIcon}
            size="small"
          >
            <FileCopyIcon fontSize="small" />
          </IconButton>
        </div>
        
        <Typography className={classes.warning}>
          Important: Please ensure you're sending funds on the {depositNetwork} network to avoid any loss of funds.
        </Typography>

        <div className={classes.qrContainer}>
          <QRCodeSVG 
            value={depositAddresses[depositCrypto]}
            size={180}
            level="H"
            includeMargin={true}
            imageSettings={{
              src: cryptoOptions.find(opt => opt.value === depositCrypto)?.icon,
              x: null,
              y: null,
              height: 35,
              width: 35,
              excavate: true,
            }}
          />
        </div>
      </>
    )}
  </div>
);

export default DepositContent; 