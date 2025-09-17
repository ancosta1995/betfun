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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import {
  Search as SearchIcon,
  Block as BlockIcon,
  Check as CheckIcon,
  Edit as EditIcon,
} from '@material-ui/icons';
import { useToasts } from 'react-toast-notifications';
import { getUsersList, updateUser } from '../../services/api.service';

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
  editButton: {
    color: '#2196F3',
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
  formControl: {
    marginBottom: theme.spacing(2),
    width: '100%',
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
  avatar: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    marginRight: theme.spacing(1),
  },
}));

const Users = () => {
  const classes = useStyles();
  const { addToast } = useToasts();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState({
    _id: '',
    banExpires: 0,
    muteExpires: 0,
    transactionsLocked: false,
    betsLocked: false,
    rank: 1,
    wallet: 0,
    customWagerLimit: 0,
    verified: false,
  });

  // Fetch users data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getUsersList();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        addToast('Failed to fetch users', { appearance: 'error' });
        setLoading(false);
      }
    };

    fetchUsers();
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

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditingUser({
      _id: user._id,
      banExpires: parseInt(user.banExpires) || 0,
      muteExpires: parseInt(user.muteExpires) || 0,
      transactionsLocked: user.transactionsLocked || false,
      betsLocked: user.betsLocked || false,
      rank: user.rank || 1,
      wallet: user.wallet?.USD?.balance || 0,
      customWagerLimit: user.customWagerLimit || 0,
      verified: user.hasVerifiedAccount || false,
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUser(null);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditingUser({
      ...editingUser,
      [name]: value,
    });
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setEditingUser({
      ...editingUser,
      [name]: value,
    });
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setEditingUser({
      ...editingUser,
      [name]: checked,
    });
  };

  const handleSaveUser = async () => {
    try {
      await updateUser(editingUser);
      addToast('User updated successfully', { appearance: 'success' });
      handleCloseDialog();
      // Refresh users list
      const data = await getUsersList();
      setUsers(data);
    } catch (error) {
      console.error('Error updating user:', error);
      addToast('Failed to update user: ' + (error.response?.data?.error || error.message), { appearance: 'error' });
    }
  };

  const getStatus = (user) => {
    const now = Date.now();
    if (parseInt(user.banExpires) > now) {
      return 'blocked';
    }
    return 'active';
  };

  const filteredUsers = users.filter((user) =>
    Object.values(user).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className={classes.root}>
        <p style={{ color: '#fff' }}>Loading users...</p>
      </div>
    );
  }

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
                <TableCell className={classes.tableHeadCell}>User</TableCell>
                <TableCell className={classes.tableHeadCell}>Rank</TableCell>
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
                  <TableRow key={user._id}>
                    <TableCell className={classes.tableCell}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className={classes.avatar}
                        />
                        <div>
                          <div>{user.username}</div>
                          <div style={{ fontSize: '12px', color: '#9EA9BF' }}>
                            {user.providerId}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <Chip
                        label={`Level ${user.rank}`}
                        size="small"
                        style={{
                          backgroundColor:
                            user.rank === 5
                              ? '#f44336' // Admin - Red
                              : user.rank === 4
                              ? '#2196F3' // Moderator - Blue
                              : user.rank === 3
                              ? '#FF9800' // Developer - Orange
                              : user.rank === 2
                              ? '#9C27B0' // Sponsor - Purple
                              : '#4CAF50', // User - Green
                          color: '#fff',
                        }}
                      />
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      ${user.wallet?.USD?.balance?.toFixed(2) || '0.00'}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {user.betsPlaced?.toLocaleString() || 0}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <span
                        className={
                          getStatus(user) === 'active'
                            ? classes.statusActive
                            : classes.statusBlocked
                        }
                      >
                        {getStatus(user)}
                      </span>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {new Date(user.created).toLocaleDateString()}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <IconButton
                        size="small"
                        className={classes.editButton}
                        onClick={() => handleEditUser(user)}
                      >
                        <EditIcon />
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

      {/* Edit User Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        classes={{ paper: classes.dialogPaper }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className={classes.dialogTitle}>
          Edit User: {selectedUser?.username}
        </DialogTitle>
        <DialogContent>
          <TextField
            className={classes.formControl}
            label="Ban Expires (UNIX timestamp)"
            variant="outlined"
            fullWidth
            name="banExpires"
            type="number"
            value={editingUser.banExpires}
            onChange={handleInputChange}
          />
          <TextField
            className={classes.formControl}
            label="Mute Expires (UNIX timestamp)"
            variant="outlined"
            fullWidth
            name="muteExpires"
            type="number"
            value={editingUser.muteExpires}
            onChange={handleInputChange}
          />
          <FormControlLabel
            className={classes.formControl}
            control={
              <Checkbox
                name="transactionsLocked"
                checked={editingUser.transactionsLocked}
                onChange={handleCheckboxChange}
                color="primary"
              />
            }
            label="Transactions Locked"
          />
          <FormControlLabel
            className={classes.formControl}
            control={
              <Checkbox
                name="betsLocked"
                checked={editingUser.betsLocked}
                onChange={handleCheckboxChange}
                color="primary"
              />
            }
            label="Bets Locked"
          />
          <FormControlLabel
            className={classes.formControl}
            control={
              <Checkbox
                name="verified"
                checked={editingUser.verified}
                onChange={handleCheckboxChange}
                color="primary"
              />
            }
            label="Verified Account"
          />
          <FormControl className={classes.formControl} variant="outlined">
            <InputLabel>Rank</InputLabel>
            <Select
              name="rank"
              value={editingUser.rank}
              onChange={handleSelectChange}
              label="Rank"
            >
              <MenuItem value={1}>User</MenuItem>
              <MenuItem value={2}>Sponsor</MenuItem>
              <MenuItem value={3}>Developer</MenuItem>
              <MenuItem value={4}>Moderator</MenuItem>
              <MenuItem value={5}>Admin</MenuItem>
            </Select>
          </FormControl>
          <TextField
            className={classes.formControl}
            label="Wallet Balance (USD)"
            variant="outlined"
            fullWidth
            name="wallet"
            type="number"
            value={editingUser.wallet}
            onChange={handleInputChange}
          />
          <TextField
            className={classes.formControl}
            label="Custom Wager Limit"
            variant="outlined"
            fullWidth
            name="customWagerLimit"
            type="number"
            value={editingUser.customWagerLimit}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} style={{ color: '#9EA9BF' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveUser}
            style={{ color: '#4CAF50' }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Users;
