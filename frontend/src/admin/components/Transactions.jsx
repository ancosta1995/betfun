import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@material-ui/core';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as SuccessIcon,
  Cancel as FailedIcon,
  Schedule as PendingIcon,
  Info as InfoIcon,
} from '@material-ui/icons';
import { useToasts } from 'react-toast-notifications';
import { getTransactionsList, getTransactionDetails, confirmTransaction, cancelTransaction } from '../../services/api.service';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    backgroundColor: '#101123',
    color: '#fff',
    border: '1px solid #2f3947',
  },
  table: {
    minWidth: 750,
  },
  tableHead: {
    backgroundColor: '#050614',
  },
  tableHeadCell: {
    color: '#9EA9BF',
    fontFamily: 'Poppins',
    fontWeight: 500,
    fontSize: '14px',
  },
  tableCell: {
    color: '#fff',
    fontFamily: 'Poppins',
    borderBottom: '1px solid #2f3947',
  },
  searchField: {
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
  chip: {
    fontFamily: 'Poppins',
    fontWeight: 500,
  },
  chipSuccess: {
    backgroundColor: '#4CAF50',
    color: '#fff',
  },
  chipPending: {
    backgroundColor: '#FF9800',
    color: '#fff',
  },
  chipFailed: {
    backgroundColor: '#f44336',
    color: '#fff',
  },
  chipManual: {
    backgroundColor: '#2196F3',
    color: '#fff',
  },
  amount: {
    fontFamily: 'Poppins',
    fontWeight: 500,
  },
  amountPositive: {
    color: '#4CAF50',
  },
  amountNegative: {
    color: '#f44336',
  },
  dialogPaper: {
    backgroundColor: '#101123',
    color: '#fff',
    border: '1px solid #2f3947',
  },
  dialogTitle: {
    color: '#9EA9BF',
    fontFamily: 'Poppins',
    fontSize: '18px',
    fontWeight: 500,
  },
  dialogContent: {
    color: '#fff',
  },
  dialogLabel: {
    color: '#9EA9BF',
    fontWeight: 500,
    display: 'inline-block',
    width: '120px',
  },
  dialogValue: {
    color: '#fff',
  },
}));

const Transactions = () => {
  const classes = useStyles();
  const { addToast } = useToasts();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState(null);

  // Fetch transactions data
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await getTransactionsList();
        setTransactions(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        addToast('Failed to fetch transactions', { appearance: 'error' });
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [addToast]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleMenuClick = (event, transaction) => {
    setAnchorEl(event.currentTarget);
    setSelectedTransaction(transaction);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTransaction(null);
  };

  const handleViewDetails = async () => {
    try {
      const details = await getTransactionDetails(selectedTransaction._id);
      setTransactionDetails(details);
      setDialogOpen(true);
      handleMenuClose();
    } catch (error) {
      console.error('Error fetching transaction details:', error);
      addToast('Failed to fetch transaction details', { appearance: 'error' });
    }
  };

  const handleConfirmTransaction = async () => {
    try {
      await confirmTransaction(selectedTransaction._id);
      addToast('Transaction confirmed successfully', { appearance: 'success' });
      handleMenuClose();
      // Refresh transactions list
      const data = await getTransactionsList();
      setTransactions(data);
    } catch (error) {
      console.error('Error confirming transaction:', error);
      addToast('Failed to confirm transaction: ' + (error.response?.data?.error || error.message), { appearance: 'error' });
    }
  };

  const handleCancelTransaction = async () => {
    try {
      await cancelTransaction(selectedTransaction._id);
      addToast('Transaction cancelled successfully', { appearance: 'success' });
      handleMenuClose();
      // Refresh transactions list
      const data = await getTransactionsList();
      setTransactions(data);
    } catch (error) {
      console.error('Error cancelling transaction:', error);
      addToast('Failed to cancel transaction: ' + (error.response?.data?.error || error.message), { appearance: 'error' });
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setTransactionDetails(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 1: // pending
        return <PendingIcon fontSize="small" />;
      case 2: // failed
        return <FailedIcon fontSize="small" />;
      case 3: // success
        return <SuccessIcon fontSize="small" />;
      case 4: // manual
        return <InfoIcon fontSize="small" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 1:
        return 'Pending';
      case 2:
        return 'Failed';
      case 3:
        return 'Success';
      case 4:
        return 'Manual Hold';
      default:
        return 'Unknown';
    }
  };

  const getStatusChipClass = (status) => {
    switch (status) {
      case 1: // pending
        return classes.chipPending;
      case 2: // failed
        return classes.chipFailed;
      case 3: // success
        return classes.chipSuccess;
      case 4: // manual
        return classes.chipManual;
      default:
        return '';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'deposit':
        return 'Deposit';
      case 'withdraw':
        return 'Withdrawal';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const filteredTransactions = transactions.filter((transaction) =>
    Object.values(transaction).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className={classes.root}>
        <p style={{ color: '#fff' }}>Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <TextField
        className={classes.searchField}
        variant="outlined"
        fullWidth
        placeholder="Search transactions..."
        value={searchTerm}
        onChange={handleSearch}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon style={{ color: '#9EA9BF' }} />
            </InputAdornment>
          ),
        }}
      />
      <Paper className={classes.paper}>
        <TableContainer>
          <Table className={classes.table}>
            <TableHead className={classes.tableHead}>
              <TableRow>
                <TableCell className={classes.tableHeadCell}>ID</TableCell>
                <TableCell className={classes.tableHeadCell}>User</TableCell>
                <TableCell className={classes.tableHeadCell}>Type</TableCell>
                <TableCell className={classes.tableHeadCell}>Amount</TableCell>
                <TableCell className={classes.tableHeadCell}>Status</TableCell>
                <TableCell className={classes.tableHeadCell}>Date</TableCell>
                <TableCell className={classes.tableHeadCell}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((transaction) => (
                  <TableRow key={transaction._id}>
                    <TableCell className={classes.tableCell}>
                      {transaction._id.substring(0, 8)}...
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {transaction._user?.username || 'Unknown User'}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {getTypeLabel(transaction.type)}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span
                        className={`${classes.amount} ${
                          transaction.type === 'deposit'
                            ? classes.amountPositive
                            : classes.amountNegative
                        }`}
                      >
                        {transaction.type === 'deposit' ? '+' : '-'}$
                        {Math.abs(transaction.siteValue).toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <Chip
                        icon={getStatusIcon(transaction.state)}
                        label={getStatusLabel(transaction.state)}
                        className={`${classes.chip} ${getStatusChipClass(
                          transaction.state
                        )}`}
                        size="small"
                      />
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {new Date(transaction.created).toLocaleString()}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, transaction)}
                        style={{ color: '#9EA9BF' }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredTransactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          style={{ color: '#9EA9BF' }}
        />
      </Paper>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          style: {
            backgroundColor: '#101123',
            color: '#fff',
            border: '1px solid #2f3947',
          },
        }}
      >
        <MenuItem
          onClick={handleViewDetails}
          style={{ fontFamily: 'Poppins', fontSize: '14px' }}
        >
          View Details
        </MenuItem>
        {selectedTransaction?.state === 4 && (
          <>
            <MenuItem
              onClick={handleConfirmTransaction}
              style={{ fontFamily: 'Poppins', fontSize: '14px', color: '#4CAF50' }}
            >
              Approve
            </MenuItem>
            <MenuItem
              onClick={handleCancelTransaction}
              style={{ fontFamily: 'Poppins', fontSize: '14px', color: '#f44336' }}
            >
              Reject
            </MenuItem>
          </>
        )}
      </Menu>

      {/* Transaction Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        classes={{ paper: classes.dialogPaper }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className={classes.dialogTitle}>
          Transaction Details
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          {transactionDetails && (
            <div>
              <div style={{ marginBottom: '10px' }}>
                <span className={classes.dialogLabel}>ID:</span>
                <span className={classes.dialogValue}>{transactionDetails._id}</span>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <span className={classes.dialogLabel}>User:</span>
                <span className={classes.dialogValue}>
                  {transactionDetails._user?.username || 'Unknown User'}
                </span>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <span className={classes.dialogLabel}>Type:</span>
                <span className={classes.dialogValue}>
                  {getTypeLabel(transactionDetails.type)}
                </span>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <span className={classes.dialogLabel}>Currency:</span>
                <span className={classes.dialogValue}>
                  {transactionDetails.currency} ({transactionDetails.network})
                </span>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <span className={classes.dialogLabel}>Amount:</span>
                <span className={classes.dialogValue}>
                  ${Math.abs(transactionDetails.siteValue).toFixed(2)}
                </span>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <span className={classes.dialogLabel}>Crypto Amount:</span>
                <span className={classes.dialogValue}>
                  {Math.abs(transactionDetails.cryptoValue).toFixed(8)} {transactionDetails.currency}
                </span>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <span className={classes.dialogLabel}>Address:</span>
                <span className={classes.dialogValue}>{transactionDetails.address}</span>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <span className={classes.dialogLabel}>Status:</span>
                <Chip
                  icon={getStatusIcon(transactionDetails.state)}
                  label={getStatusLabel(transactionDetails.state)}
                  className={`${classes.chip} ${getStatusChipClass(
                    transactionDetails.state
                  )}`}
                  size="small"
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <span className={classes.dialogLabel}>Transaction ID:</span>
                <span className={classes.dialogValue}>{transactionDetails.txid || 'N/A'}</span>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <span className={classes.dialogLabel}>Created:</span>
                <span className={classes.dialogValue}>
                  {new Date(transactionDetails.created).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} style={{ color: '#9EA9BF' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Transactions;
