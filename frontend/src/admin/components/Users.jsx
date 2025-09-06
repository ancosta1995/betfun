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
  IconButton,
  TextField,
  InputAdornment,
} from '@material-ui/core';
import {
  Search as SearchIcon,
  Block as BlockIcon,
  Check as CheckIcon,
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
  statusActive: {
    color: '#4CAF50',
  },
  statusBlocked: {
    color: '#f44336',
  },
}));

const Users = () => {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockUsers = Array.from({ length: 50 }, (_, index) => ({
      id: index + 1,
      username: `user${index + 1}`,
      email: `user${index + 1}@example.com`,
      balance: Math.floor(Math.random() * 10000),
      totalBets: Math.floor(Math.random() * 1000),
      status: Math.random() > 0.2 ? 'active' : 'blocked',
      joinDate: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString(),
    }));
    setUsers(mockUsers);
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

  const filteredUsers = users.filter((user) =>
    Object.values(user).some(
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
        placeholder="Search users..."
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
                <TableCell className={classes.tableHeadCell}>Username</TableCell>
                <TableCell className={classes.tableHeadCell}>Email</TableCell>
                <TableCell className={classes.tableHeadCell}>Balance</TableCell>
                <TableCell className={classes.tableHeadCell}>Total Bets</TableCell>
                <TableCell className={classes.tableHeadCell}>Status</TableCell>
                <TableCell className={classes.tableHeadCell}>Join Date</TableCell>
                <TableCell className={classes.tableHeadCell}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className={classes.tableCell}>{user.username}</TableCell>
                    <TableCell className={classes.tableCell}>{user.email}</TableCell>
                    <TableCell className={classes.tableCell}>
                      ${user.balance.toLocaleString()}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {user.totalBets.toLocaleString()}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span
                        className={
                          user.status === 'active'
                            ? classes.statusActive
                            : classes.statusBlocked
                        }
                      >
                        {user.status}
                      </span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>{user.joinDate}</TableCell>
                    <TableCell className={classes.tableCell}>
                      <IconButton
                        size="small"
                        style={{ color: user.status === 'active' ? '#f44336' : '#4CAF50' }}
                      >
                        {user.status === 'active' ? <BlockIcon /> : <CheckIcon />}
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
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          style={{ color: '#9EA9BF' }}
        />
      </Paper>
    </div>
  );
};

export default Users;
