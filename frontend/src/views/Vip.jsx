import React from 'react';
import {
  Box,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@material-ui/core'; // Changed import to @material-ui/core
import { makeStyles } from '@material-ui/core/styles'; // Adjusted makeStyles import
import { ExpandMore, CheckCircle } from '@material-ui/icons'; // Adjusted icons import

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#000000',
    color: '#ffffff',
    minHeight: '100vh',
    padding: theme.spacing(3),
  },
  card: {
    backgroundColor: '#121212',
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
  },
  progressCard: {
    background: 'linear-gradient(45deg, #2c0052 30%, #4a0082 90%)',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
  },
  table: {
    backgroundColor: '#121212',
  },
  tableCell: {
    borderBottom: '1px solid #1e1e1e',
    color: '#ffffff',
  },
  checkIcon: {
    color: '#4caf50',
  },
}));

const VIPPrograms = () => {
  const classes = useStyles();
  return (
    <div className={classes.card}>
      <Box className={classes.progressInfo}>
        <Typography variant="h5">Your VIP Progress</Typography>
        <Typography variant="h6">Sapphire 3 (1.67% Progress)</Typography>
      </Box>
      <Typography variant="body2" color="textSecondary" mb={2}>
        Keep playing to level up and unlock bigger rewards!
      </Typography>
      <div className={classes.progressCard}>
        <Typography variant="h6">Next Level: Sapphire 4</Typography>
        <Box width={80} height={80} bgcolor="#6a0dad" borderRadius={2} />
      </div>
    </div>
  );
};

const AvailableRewards = () => {
  const classes = useStyles();
  return (
    <div className={classes.card}>
      <Typography variant="h6">Available Rewards</Typography>
      <Typography variant="body2" color="textSecondary" mb={2}>
        Instant Rakeback, Weekly Bonuses, VIP Host, and more.
      </Typography>
      <Button variant="contained" color="primary">
        View Rewards
      </Button>
    </div>
  );
};

const VIPPrivileges = () => {
  const classes = useStyles();
  const privileges = ['Instant Rakeback', 'Weekly Bonus', 'Monthly Bonus', 'VIP Host', 'Exclusive Events'];

  return (
    <Box mb={3}>
      <Typography variant="h6" mb={2}>
        VIP Privileges
      </Typography>
      {privileges.map((privilege, index) => (
        <Accordion key={index} className={classes.accordion}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>{privilege}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="textSecondary">
              Details of {privilege} privilege will be listed here.
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

const FeatureComparison = () => {
  const classes = useStyles();
  const features = [
    'Instant Rakeback',
    'Weekly Bonus',
    'Level-Up Bonus',
    'Monthly Bonus',
    'VIP Host',
    'Special Events',
  ];
  const levels = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Jade', 'Sapphire', 'Ruby', 'Diamond'];

  return (
    <TableContainer component={Paper} className={classes.table}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableCell}>Features</TableCell>
            {levels.map((level) => (
              <TableCell key={level} align="center" className={classes.tableCell}>
                {level}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {features.map((feature) => (
            <TableRow key={feature}>
              <TableCell component="th" scope="row" className={classes.tableCell}>
                {feature}
              </TableCell>
              {levels.map((level, index) => (
                <TableCell key={`${level}-${index}`} align="center" className={classes.tableCell}>
                  <CheckCircle className={classes.checkIcon} fontSize="small" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default function VIPProgramsDashboard() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <VIPPrograms />
      <AvailableRewards />
      <VIPPrivileges />
      <FeatureComparison />
    </div>
  );
}
