import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@material-ui/core';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Settings as SettingsIcon,
  Casino as CasinoIcon,
  CardGiftcard as CouponIcon,
  LiveHelp as TriviaIcon,
} from '@material-ui/icons';
import Users from './components/Users';
import Games from './components/Games';
import Settings from './components/Settings';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    backgroundColor: '#050614',
    minHeight: '100vh',
  },
  appBar: {
    backgroundColor: '#101123',
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: '#101123',
    color: '#fff',
    borderRight: '1px solid #2f3947',
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    color: '#fff',
    fontFamily: 'Poppins',
  },
  card: {
    backgroundColor: '#101123',
    color: '#fff',
    border: '1px solid #2f3947',
    borderRadius: '8px',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-4px)',
    },
  },
  cardTitle: {
    color: '#9EA9BF',
    fontFamily: 'Poppins',
    fontSize: '14px',
    fontWeight: 500,
  },
  cardValue: {
    color: '#fff',
    fontFamily: 'Poppins',
    fontSize: '24px',
    fontWeight: 600,
    marginTop: theme.spacing(1),
  },
  listItem: {
    color: '#9EA9BF',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
  },
  listItemIcon: {
    color: '#9EA9BF',
  },
  divider: {
    backgroundColor: '#2f3947',
  },
}));

const AdminPanel = () => {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalBets: 0,
    totalVolume: 0,
  });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, value: 'dashboard' },
    { text: 'Users', icon: <PeopleIcon />, value: 'users' },
    { text: 'Transactions', icon: <MoneyIcon />, value: 'transactions' },
    { text: 'Games', icon: <CasinoIcon />, value: 'games' },
    { text: 'Coupons', icon: <CouponIcon />, value: 'coupons' },
    { text: 'Trivia', icon: <TriviaIcon />, value: 'trivia' },
    { text: 'Settings', icon: <SettingsIcon />, value: 'settings' },
  ];

  const drawer = (
    <div>
      <Toolbar />
      <div className={classes.drawerContainer}>
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              className={classes.listItem}
              selected={selectedTab === item.value}
              onClick={() => setSelectedTab(item.value)}
            >
              <ListItemIcon className={classes.listItemIcon}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  );

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap className={classes.title}>
            Admin Panel
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        {drawer}
      </Drawer>
      <main className={classes.content}>
        <Toolbar />
        <Container maxWidth="lg">
          {selectedTab === 'dashboard' && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Card className={classes.card}>
                  <CardContent>
                    <Typography className={classes.cardTitle}>
                      Total Users
                    </Typography>
                    <Typography className={classes.cardValue}>
                      {stats.totalUsers.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card className={classes.card}>
                  <CardContent>
                    <Typography className={classes.cardTitle}>
                      Active Users
                    </Typography>
                    <Typography className={classes.cardValue}>
                      {stats.activeUsers.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card className={classes.card}>
                  <CardContent>
                    <Typography className={classes.cardTitle}>
                      Total Bets
                    </Typography>
                    <Typography className={classes.cardValue}>
                      {stats.totalBets.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card className={classes.card}>
                  <CardContent>
                    <Typography className={classes.cardTitle}>
                      Total Volume
                    </Typography>
                    <Typography className={classes.cardValue}>
                      ${stats.totalVolume.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
          {selectedTab === 'users' && <Users />}
          {selectedTab === 'games' && <Games />}
          {selectedTab === 'settings' && <Settings />}
        </Container>
      </main>
    </div>
  );
};

export default AdminPanel;
