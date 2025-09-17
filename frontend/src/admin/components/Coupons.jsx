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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@material-ui/core';
import {
  Search as SearchIcon,
  Add as AddIcon,
} from '@material-ui/icons';
import { useToasts } from 'react-toast-notifications';
import { getCouponsList, createCoupon } from '../../services/api.service';

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
  addButton: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    marginBottom: theme.spacing(2),
    '&:hover': {
      backgroundColor: '#43A047',
    },
  },
  activeChip: {
    backgroundColor: '#4CAF50',
    color: '#fff',
  },
  inactiveChip: {
    backgroundColor: '#f44336',
    color: '#fff',
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
}));

const Coupons = () => {
  const classes = useStyles();
  const { addToast } = useToasts();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    message: '',
    uses: 1,
    payout: 0,
    minLevel: 1,
  });

  // Fetch coupons data
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true);
        const data = await getCouponsList();
        setCoupons(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching coupons:', error);
        addToast('Failed to fetch coupons', { appearance: 'error' });
        setLoading(false);
      }
    };

    fetchCoupons();
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

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewCoupon({
      code: '',
      message: '',
      uses: 1,
      payout: 0,
      minLevel: 1,
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewCoupon({
      ...newCoupon,
      [name]: value,
    });
  };

  const handleCreateCoupon = async () => {
    try {
      await createCoupon(newCoupon);
      addToast('Coupon created successfully', { appearance: 'success' });
      handleCloseDialog();
      // Refresh coupons list
      const data = await getCouponsList();
      setCoupons(data);
    } catch (error) {
      console.error('Error creating coupon:', error);
      addToast('Failed to create coupon: ' + (error.response?.data?.error || error.message), { appearance: 'error' });
    }
  };

  const filteredCoupons = coupons.filter((coupon) =>
    Object.values(coupon).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className={classes.root}>
        <p style={{ color: '#fff' }}>Loading coupons...</p>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <Button
        variant="contained"
        className={classes.addButton}
        startIcon={<AddIcon />}
        onClick={handleOpenDialog}
      >
        Add New Coupon
      </Button>
      <TextField
        className={classes.searchField}
        variant="outlined"
        fullWidth
        placeholder="Search coupons..."
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
                <TableCell className={classes.tableHeadCell}>Code</TableCell>
                <TableCell className={classes.tableHeadCell}>Message</TableCell>
                <TableCell className={classes.tableHeadCell}>Payout</TableCell>
                <TableCell className={classes.tableHeadCell}>Uses</TableCell>
                <TableCell className={classes.tableHeadCell}>Min Level</TableCell>
                <TableCell className={classes.tableHeadCell}>Status</TableCell>
                <TableCell className={classes.tableHeadCell}>Created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCoupons
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((coupon) => (
                  <TableRow key={coupon._id}>
                    <TableCell className={classes.tableCell}>
                      {coupon.code}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {coupon.message}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      ${coupon.payout}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {coupon.claimedUsers?.length || 0} / {coupon.uses}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {coupon.minLevel}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <Chip
                        label={coupon.active ? 'Active' : 'Inactive'}
                        className={
                          coupon.active ? classes.activeChip : classes.inactiveChip
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {new Date(coupon.created).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredCoupons.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          style={{ color: '#9EA9BF' }}
        />
      </Paper>

      {/* Add Coupon Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          style: {
            backgroundColor: '#101123',
            color: '#fff',
            border: '1px solid #2f3947',
          },
        }}
      >
        <DialogTitle>Add New Coupon</DialogTitle>
        <DialogContent>
          <TextField
            className={classes.formControl}
            label="Coupon Code"
            variant="outlined"
            fullWidth
            name="code"
            value={newCoupon.code}
            onChange={handleInputChange}
          />
          <TextField
            className={classes.formControl}
            label="Message"
            variant="outlined"
            fullWidth
            name="message"
            value={newCoupon.message}
            onChange={handleInputChange}
          />
          <TextField
            className={classes.formControl}
            label="Payout ($)"
            variant="outlined"
            fullWidth
            type="number"
            name="payout"
            value={newCoupon.payout}
            onChange={handleInputChange}
          />
          <TextField
            className={classes.formControl}
            label="Uses Allowed"
            variant="outlined"
            fullWidth
            type="number"
            name="uses"
            value={newCoupon.uses}
            onChange={handleInputChange}
          />
          <FormControl className={classes.formControl} variant="outlined">
            <InputLabel>Minimum Level</InputLabel>
            <Select
              name="minLevel"
              value={newCoupon.minLevel}
              onChange={handleInputChange}
              label="Minimum Level"
            >
              {[1, 2, 3, 4, 5].map((level) => (
                <MenuItem key={level} value={level}>
                  Level {level}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} style={{ color: '#9EA9BF' }}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateCoupon}
            style={{ color: '#4CAF50' }}
            disabled={!newCoupon.code || !newCoupon.message || newCoupon.payout <= 0}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Coupons;