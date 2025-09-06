import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { makeStyles } from "@material-ui/core";
import axios from 'axios';
import { chatSocket } from "../services/websocket.service";
import { getUserVipData } from "../services/api.service";
import { connect } from "react-redux";
import { logout } from "../actions/auth";
import PropTypes from "prop-types";
import { ReactComponent as OriginalIcon } from "../assets/icons/original.svg";
import { ReactComponent as IncreaseIcon } from "../assets/icons/increase.svg";
import { ReactComponent as UsdFiatIcon } from "../assets/fiat/usd.svg";

const useStyles = makeStyles(theme => ({
    root: {
        userSelect: "none",
        marginTop: "50px",
        display: "flex",
        flexDirection: "column",
        minHeight: "45rem",
        [theme.breakpoints.down("xs")]: {
            padding: "0.5rem",
        },
        [theme.breakpoints.down("sm")]: {
            minHeight: "60rem",
            padding: "0.5rem",
        },
    },
    gameImage: {
        display: "relative",
        width: 'auto',
        height: 'auto',
        marginBottom: "-0.1rem",
        marginRight: '0.5rem',
    },
    levelBox: {
        color: "#2871FF",
        padding: "0.475rem 0.8rem",
    },
    buttonWrapper: {
        width: '100%',
        maxWidth: "1150px",
        marginLeft: "auto",
        marginRight: "auto",
        display: 'inline-flex',
        borderRadius: '0.25rem',
        padding: '0.25rem',
        marginBottom: "5px",
        [theme.breakpoints.down("lg")]: {
            width: '78%',
            maxWidth: "1050px",
        },
        [theme.breakpoints.down("sm")]: {
            width: '100%',
            maxWidth: "1050px",
        },
    },
    buttonContainer: {
        display: 'flex',
        gap: '0.25rem',
    },
    button: {
        padding: '0.2rem 0.4rem',
        borderRadius: '0.25rem',
        backgroundColor: '#0A0B1C',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.3s, transform 0.2s',
        fontSize: '0.875rem',
        '&:hover': {
            backgroundColor: 'hsl(251.31deg 75% 50%)',
            transform: 'scale(1.01)',
        },
        '&:active': {
            backgroundColor: '#1a1b33',
            transform: 'scale(0.95)',
        },
    },
    selectedButton: {
        backgroundColor: '#1a1b33',
    },
    clickableTable: {
        overflowX: 'auto',
        padding: '0 1rem',
        maxWidth: '100%',
        [theme.breakpoints.down("sm")]: {
            padding: '0 0rem',
        },
    },
    table: {
        marginLeft: "auto",
        marginRight: "auto",
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '0.5rem',
        borderSpacing: '0',
        maxWidth: "1150px",
        [theme.breakpoints.down("lg")]: {
            width: '80%',
            maxWidth: "1050px",
        },
        [theme.breakpoints.down("sm")]: {
            width: '80%',
            maxWidth: "1050px",
        },
    },
    thead: {
        color: '#ffffff',
        textAlign: 'left',
        fontSize: '0.875rem',
    },
    th: {
        fontFamily: "Rubik",
        fontWeight: 400,
        letterSpacing: ".05em",
        fontSize: 12,
        textAlign: 'center',
        padding: '0.3rem',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        position: 'sticky',
        top: 0,
        zIndex: 1,
        width: '16.66%',
        boxSizing: 'border-box',
    },
    tbody: {
        backgroundColor: '#1a1b33',
    },
    tr: {
        color: '#ffffff',
        cursor: 'pointer',
        borderRadius: '0.25rem',
        transition: 'background-color 0.3s, transform 0.2s',
        height: '2rem',
        boxSizing: 'border-box',
        '&:hover': {
            backgroundColor: '#2a2d3d',
            transform: 'scale(1.02)',
        },
        '&:active': {
            backgroundColor: '#1a1b33',
            transform: 'scale(0.98)',
        },
    },
    evenRow: {
        backgroundColor: '#101123',
    },
    oddRow: {
        backgroundColor: '#050614',
    },
    td: {
        textAlign: 'center',
        padding: '0.3rem',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        width: '1%',
        boxSizing: 'border-box',
        fontSize: '0.875rem',
    },
    payoutPositive: {
        color: 'rgb(33 216 51)',
    },
    payoutNegative: {
        color: 'white',
    },
    payoutZeroOrNegative: {
        color: 'white',
    },
    timestamp: {
        color: '#fff',
    },
}));

const getCurrencyIcon = (currency) => {
    switch (currency?.toUpperCase()) {
        case 'BTC':
            return require('../assets/icons/btc.png');
        case 'ETH':
            return require('../assets/icons/eth.png');
        case 'USDT':
            return require('../assets/icons/ltc.png');
        case 'USD':
            return <UsdFiatIcon style={{width: 15, height: 15}} />;
        default:
            return require('../assets/icons/coin.png');
    }
};

const CurrencyIcon = ({ currency, className }) => {
    const icon = getCurrencyIcon(currency);
    if (currency?.toUpperCase() === 'USD') {
        return icon;
    }
    return <img style={{height: 15, width: 15}} src={icon} className={className} alt={currency} />;
};

const BettingHistoryTable = ({ user, isAuthenticated, addToast, isLoading, logout }) => {
    const classes = useStyles();
    const [data, setData] = useState([]);
    const [selectedButton, setSelectedButton] = useState('Latest Bets');
    const [showTable, setShowTable] = useState(true);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleButtonClick = (buttonName) => {
        setSelectedButton(buttonName);
        // Request new data when button is clicked
        chatSocket.emit('request-bet-history', {
            type: buttonName
        });
    };

    useEffect(() => {
        // Initial data load
        chatSocket.emit('request-bet-history', {
            type: selectedButton
        });

        // Listen for initial history data
        const handleInitialHistory = (history) => {
            setData(history);
        };

        // Listen for live bet updates
        const handleLiveBetUpdate = (bet) => {
            setData(prevData => {
                // Add new bet to the beginning and keep only last 10
                const updatedData = [bet, ...prevData].slice(0, 10);
                return updatedData;
            });
        };

        // Subscribe to socket events
        chatSocket.on('bet-history', handleInitialHistory);
        chatSocket.on('live-bet-update', handleLiveBetUpdate);

        // Cleanup
        return () => {
            chatSocket.off('bet-history', handleInitialHistory);
            chatSocket.off('live-bet-update', handleLiveBetUpdate);
        };
    }, [selectedButton]);

    return (
        <div className={classes.root}>
            <div className={classes.buttonWrapper}>
                <div className={classes.buttonContainer}>
                    <motion.div 
                        className={`${classes.button} ${selectedButton === 'Latest Bets' ? classes.selectedButton : ''}`}
                        onClick={() => handleButtonClick('Latest Bets')}
                    >
                        Latest Bets
                    </motion.div>
                    <motion.div 
                        className={`${classes.button} ${selectedButton === 'High Rollers' ? classes.selectedButton : ''}`}
                        onClick={() => handleButtonClick('High Rollers')}
                    >
                        High Rollers
                    </motion.div>
                </div>
            </div>

            {showTable && (
                <motion.div
                    className={classes.clickableTable}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.table
                        className={classes.table}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <thead className={classes.thead}>
                            <tr>
                                <th className={classes.th}>User</th>
                                <th className={classes.th}>Game</th>
                                <th className={classes.th}>Bet Amount</th>
                                <th className={classes.th}>Multiplier</th>
                                <th className={classes.th}>Payout</th>
                                <th className={classes.th}>Time</th>
                            </tr>
                        </thead>
                        <tbody className={classes.tbody}>
                            {Array.isArray(data) && data.map((row, index) => (
                                <motion.tr 
                                    key={index} 
                                    className={`${classes.tr} ${index % 2 === 0 ? classes.evenRow : classes.oddRow}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <td className={classes.td}>
                                        <div className={classes.levelBox}>{row.user}</div>
                                    </td>
                                    <td className={classes.td}>
                                        <OriginalIcon className={classes.gameImage} />
                                        {row.game}
                                    </td>
                                    <td className={classes.td}>
                                        <CurrencyIcon currency={row.currency} className={classes.gameImage} />
                                        {parseFloat(row.betAmount).toFixed(2)}
                                    </td>
                                    <td className={classes.td}>
                                        <IncreaseIcon className={classes.gameImage} />
                                        {parseFloat(row.multiplier).toFixed(2)}x
                                    </td>
                                    <td className={`${classes.td} ${
                                        row.status === 'LOSE' 
                                            ? classes.payoutZeroOrNegative 
                                            : parseFloat(row.payout) <= 0 
                                                ? classes.payoutNegative 
                                                : classes.payoutPositive
                                    }`}>
                                        <CurrencyIcon currency={row.currency} className={classes.gameImage} />
                                        {parseFloat(row.payout).toFixed(2)}
                                    </td>
                                    <td className={classes.td}>
                                        <span className={classes.timestamp}>{row.timestamp}</span>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </motion.table>
                </motion.div>
            )}
        </div>
    );
};

BettingHistoryTable.propTypes = {
    isAuthenticated: PropTypes.bool,
    isLoading: PropTypes.bool,
    user: PropTypes.object,
    addToast: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    isLoading: state.auth.isLoading,
    user: state.auth.user,
});

export default connect(mapStateToProps, { logout })(BettingHistoryTable);
