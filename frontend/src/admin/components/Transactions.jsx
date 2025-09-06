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
} from '@material-ui/core';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as SuccessIcon,
  Cancel as FailedIcon,
  Schedule as PendingIcon,
} from '@material-ui/icons';

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
}));

const Transactions = () => {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockTransactions = Array.from({ length: 50 }, (_, index) => ({
      id: index + 1,
      user: `user${Math.floor(Math.random() * 100)}`,
      type: ['deposit', 'withdraw', 'bet', 'win'][Math.floor(Math.random() * 4)],
      amount: (Math.random() * 1000).toFixed(2),
      status: ['success', 'pending', 'failed'][Math.floor(Math.random() * 3)],
      date: new Date(Date.now() - Math.random() * 10000000000).toLocaleString(),
      txHash: '0x' + Math.random().toString(16).substr(2, 40),
    }));
    setTransactions(mockTransactions);
  }, []);

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <SuccessIcon fontSize="small" />;
      case 'pending':
        return <PendingIcon fontSize="small" />;
      case 'failed':
        return <FailedIcon fontSize="small" />;
      default:
        return null;
    }
  };

  const getStatusChipClass = (status) => {
    switch (status) {
      case 'success':
        return classes.chipSuccess;
      case 'pending':
        return classes.chipPending;
      case 'failed':
        return classes.chipFailed;
      default:
        return '';
    }
  };

  const filteredTransactions = transactions.filter((transaction) =>
    Object.values(transaction).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

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
                  <TableRow key={transaction.id}>
                    <TableCell className={classes.tableCell}>
                      {transaction.id}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {transaction.user}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span
                        className={`${classes.amount} ${
                          ['deposit', 'win'].includes(transaction.type)
                            ? classes.amountPositive
                            : classes.amountNegative
                        }`}
                      >
                        ${transaction.amount}
                      </span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <Chip
                        icon={getStatusIcon(transaction.status)}
                        label={transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        className={`${classes.chip} ${getStatusChipClass(
                          transaction.status
                        )}`}
                        size="small"
                      />
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {transaction.date}
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
          onClick={handleMenuClose}
          style={{ fontFamily: 'Poppins', fontSize: '14px' }}
        >
          View Details
        </MenuItem>
        {selectedTransaction?.status === 'pending' && (
          <>
            <MenuItem
              onClick={handleMenuClose}
              style={{ fontFamily: 'Poppins', fontSize: '14px', color: '#4CAF50' }}
            >
              Approve
            </MenuItem>
            <MenuItem
              onClick={handleMenuClose}
              style={{ fontFamily: 'Poppins', fontSize: '14px', color: '#f44336' }}
            >
              Reject
            </MenuItem>
          </>
        )}
      </Menu>
    </div>
  );
};

export default Transactions;
