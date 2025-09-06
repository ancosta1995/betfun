import React, { useState } from "react";
import PropTypes from 'prop-types';
import Dialog from "@material-ui/core/Dialog";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";
import { Select as AntSelect } from 'antd';
import { Switch as AntSwitch } from 'antd';
import { connect } from 'react-redux';
import { updateFiat, DisplayFiat } from "../../actions/auth";

const { Option } = AntSelect;

function WalletSettings(props) {
  const { open, onClose, currencies, selectedCurrency, selectedLogo, selectedFiatCurrency, updateCurrency, updateFiat, DisplayFiat, Display, DisplayForFiat } = props;
  const [hideZeroBalances, setHideZeroBalances] = useState(false);
  const [fiatView, setFiatView] = useState(false);
  const [Fiatcurrency, setFiatCurrency] = useState("USD");

  const handleSave = () => {
    DisplayFiat(fiatView)
    updateFiat(Fiatcurrency); // Pass Fiatcurrency to updateCurrency
    console.log("saved", Fiatcurrency)
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: 0, // Ensure no rounded corners on the main Paper component
        }
      }}
    >
      <Paper
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          margin: 0, // Remove default margin
          padding: 0, // Remove default padding
        }}
      >
        <Paper
          elevation={3}
          style={{
            backgroundColor: "#101123", // Title background color
            color: "white",
            padding: "4px 8px", // Reduced padding for a narrower title area
            display: "flex",
            alignItems: "center",
            gap: "8px",
            position: "relative", // Position relative for the close button
            margin: 0, // Remove default margin
            borderRadius: "0px", // Ensure no rounded corners on the title Paper
            height: "58px", // Set a specific height for the title Paper
          }}
        >
          <IconButton
            onClick={onClose}
            style={{
              position: "absolute",
              right: "8px", // Adjust position for the close button
              top: "8px", // Adjust position for the close button
              color: "white",
              padding: "4px", // Adjust padding to match the reduced title size
            }}
          >
            <CloseIcon />
          </IconButton>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <IconButton>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
              </svg>
            </IconButton>
            <Typography variant="h6" style={{ fontSize: "1rem" }}>
              Wallet Settings
            </Typography>
          </div>
        </Paper>
        <Paper
          elevation={1}
          style={{
            backgroundColor: "#050615", // Content background color
            color: "white",
            padding: "24px", // Increased padding for content
            margin: 0, // Remove default margin
            borderRadius: "0px", // Ensure no rounded corners on the content Paper
            display: "flex",
            flexDirection: "column",
            gap: "16px", // Increased gap between sections
          }}
        >
          <div style={{ display: "grid", gap: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <Typography variant="body1">Hide Zero Balances</Typography>
                <Typography variant="caption" style={{ color: "#aaa" }}>
                  Your zero balances won't appear in your wallet
                </Typography>
              </div>
              <AntSwitch
                checked={hideZeroBalances}
                onChange={(checked) => setHideZeroBalances(checked)}
                style={{
                  marginLeft: "auto", // Align switch to the right
                }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <Typography variant="body1">Fiat View</Typography>
                <Typography variant="caption" style={{ color: "#aaa" }}>
                  Balances will be displayed in fiat currency
                </Typography>
              </div>
              <AntSwitch
                checked={fiatView}
                onChange={(checked) => setFiatView(checked)}
                style={{
                  marginLeft: "auto", // Align switch to the right
                }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body1">Currency</Typography>
              <AntSelect
                value={Fiatcurrency}
                onChange={(value) => setFiatCurrency(value)}
                style={{
                  color: "white",
                  minWidth: "100px",
                }}
                dropdownStyle={{ zIndex: "9999", color: "white" }} // Dropdown styles
              >
                {currencies.map((curr) => (
                  <Option key={curr} value={curr}>
                    {curr}
                  </Option>
                ))}
              </AntSelect>
            </div>
            <Typography
              variant="caption"
              style={{ zIndex: "9999", color: "#aaa", marginTop: "16px" }}
            >
              Please note that these are currency approximations.
            </Typography>
          </div>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            style={{
              background: "hsl(215deg 100% 55.72%)", // Button color
              color: "white", // Button text color
            }}
          >
            Save
          </Button>
        </Paper>
      </Paper>
    </Dialog>
  );
}

WalletSettings.propTypes = {
  selectedFiatCurrency: PropTypes.string.isRequired,
  DisplayFiat: PropTypes.string.isRequired,
  DisplayForFiat: PropTypes.string.isRequired,

};

const mapStateToProps = (state) => ({
  selectedFiatCurrency: state.auth.selectedFiatCurrency, // Ensure these match your Redux state
  DisplayFiat: state.auth.DisplayFiat, // Ensure these match your Redux state
  DisplayForFiat: state.auth.DisplayForFiat, // Ensure these match your Redux state
});

export default connect(mapStateToProps, { updateFiat, DisplayFiat })(WalletSettings);
