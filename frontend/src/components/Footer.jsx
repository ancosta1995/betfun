import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Grid, Typography, Box, useTheme, useMediaQuery } from '@material-ui/core';
import { themeConfig } from '../config/config';

const useStyles = makeStyles((theme) => ({
  footer: {
    backgroundColor: themeConfig.secondbackground,
    padding: theme.spacing(6, 0, 4),
    marginTop: 'auto',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    fontFamily: 'Poppins',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '1px',
      background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)',
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(4, 0, 3),
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(3, 0, 2),
    },
  },
  container: {
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0, 2),
    },
  },
  logo: {
    marginBottom: theme.spacing(2),
    transition: 'transform 0.3s ease',
    display: 'inline-block',
    '&:hover': {
      transform: 'translateY(-2px)',
    },
    '& img': {
      height: 35,
      [theme.breakpoints.down('sm')]: {
        height: 28,
      },
      [theme.breakpoints.down('xs')]: {
        height: 24,
      },
    },
  },
  companyInfo: {
    color: '#9EA9BF',
    fontSize: '0.813rem',
    marginBottom: theme.spacing(2.5),
    lineHeight: 1.7,
    opacity: 0.85,
    fontFamily: 'Poppins',
    maxWidth: '90%',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
      textAlign: 'center',
      fontSize: '0.75rem',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.7rem',
      lineHeight: 1.6,
    },
  },
  ageRestriction: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    marginTop: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
    },
    '& img': {
      height: 24,
      opacity: 0.9,
      transition: 'opacity 0.3s ease',
      '&:hover': {
        opacity: 1,
      },
      [theme.breakpoints.down('xs')]: {
        height: 20,
      },
    },
  },
  sectionTitle: {
    color: '#fff',
    fontSize: '0.875rem',
    fontWeight: 600,
    marginBottom: theme.spacing(2.5),
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontFamily: 'Poppins',
    position: 'relative',
    display: 'inline-block',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: -8,
      left: 0,
      width: '30px',
      height: '2px',
      background: 'linear-gradient(90deg, #4F79FD 0%, rgba(79,121,253,0.3) 100%)',
      [theme.breakpoints.down('sm')]: {
        left: '50%',
        transform: 'translateX(-50%)',
      },
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.8rem',
      marginBottom: theme.spacing(2),
    },
  },
  link: {
    color: '#9EA9BF',
    textDecoration: 'none',
    display: 'block',
    marginBottom: theme.spacing(1.5),
    fontSize: '0.813rem',
    transition: 'all 0.3s ease',
    opacity: 0.85,
    fontFamily: 'Poppins',
    position: 'relative',
    paddingLeft: theme.spacing(0),
    '&:hover': {
      color: '#fff',
      opacity: 1,
      transform: 'translateX(8px)',
      '&::before': {
        opacity: 1,
        transform: 'translateX(0)',
      },
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      left: -8,
      top: '50%',
      width: 4,
      height: 4,
      backgroundColor: '#4F79FD',
      borderRadius: '50%',
      transform: 'translateX(-10px)',
      opacity: 0,
      transition: 'all 0.3s ease',
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
      fontSize: '0.75rem',
      marginBottom: theme.spacing(1.2),
      '&:hover': {
        transform: 'translateY(-2px)',
      },
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.7rem',
      marginBottom: theme.spacing(1),
    },
  },
  gridContainer: {
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
    },
  },
  gridItem: {
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(4),
    },
    [theme.breakpoints.down('xs')]: {
      marginBottom: theme.spacing(3),
    },
  },
  socialLinks: {
    display: 'flex',
    gap: theme.spacing(2),
    marginTop: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
    },
  },
  platformLinks: {
    [theme.breakpoints.up('md')]: {
      paddingLeft: theme.spacing(4),
    },
  },
  copyright: {
    textAlign: 'center',
    color: '#9EA9BF',
    opacity: 0.7,
    fontSize: '0.75rem',
    marginTop: theme.spacing(6),
    paddingTop: theme.spacing(3),
    borderTop: '1px solid rgba(255,255,255,0.05)',
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(3),
      fontSize: '0.7rem',
    },
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(2),
      paddingTop: theme.spacing(2),
      fontSize: '0.65rem',
    },
  },
  columnWrapper: {
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(4),
    },
  },
  mobileColumn: {
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      marginBottom: theme.spacing(0),
    },
  },
}));

const Footer = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isExtraSmall = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <footer className={classes.footer}>
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={isMobile ? (isExtraSmall ? 3 : 4) : 4} className={classes.gridContainer}>
          {/* Company Info */}
          <Grid item xs={12} md={4} className={classes.gridItem}>
            <div className={classes.logo}>
              <img src="/BetFunFullLogo.png" alt="Betfun" />
            </div>
            <Typography className={classes.companyInfo}>
              Betfun.gg
            </Typography>
            <div className={classes.ageRestriction}>
              <Typography variant="h6" style={{ 
                color: '#fff', 
                fontSize: isExtraSmall ? '0.9rem' : '1rem', 
                fontWeight: 600 
              }}>18+</Typography>
              <img src="/wheelCup.png" alt="Gamble Aware" />
            </div>
          </Grid>

          {/* Columns for mobile view */}
          {isExtraSmall ? (
            <Grid item xs={12} className={classes.columnWrapper}>
              {/* Support & Legal */}
              <div className={classes.mobileColumn}>
                <Typography variant="h6" className={classes.sectionTitle}>
                  SUPPORT & LEGAL
                </Typography>
                <Link to="/terms" className={classes.link}>Terms of Service</Link>
                <Link to="/live-support" className={classes.link}>Live Support</Link>
                <Link to="/help" className={classes.link}>Help Center</Link>
              </div>

              {/* Platform & Socials */}
              <div className={classes.mobileColumn}>
                <Typography variant="h6" className={classes.sectionTitle}>
                  PLATFORM & SOCIALS
                </Typography>
                <Link to="/affiliate" className={classes.link}>Affiliate Program</Link>
                <Link to="/vip" className={classes.link}>VIP Program</Link>
                <a href="https://x.com/betfungg" target="_blank" rel="noopener noreferrer" className={classes.link}>X (Twitter)</a>
                <a href="https://t.me/betfungg" target="_blank" rel="noopener noreferrer" className={classes.link}>Telegram</a>
                <a href="https://instagram.com/betfungg" target="_blank" rel="noopener noreferrer" className={classes.link}>Instagram</a>
              </div>
            </Grid>
          ) : (
            <>
              {/* Support & Legal */}
              <Grid item xs={12} sm={6} md={4} className={classes.gridItem}>
                <Typography variant="h6" className={classes.sectionTitle}>
                  SUPPORT & LEGAL
                </Typography>
                <Link to="/terms" className={classes.link}>Terms of Service</Link>
                <Link to="/live-support" className={classes.link}>Live Support</Link>
                <Link to="/help" className={classes.link}>Help Center</Link>
              </Grid>

              {/* Platform & Socials */}
              <Grid item xs={12} sm={6} md={4} className={classes.gridItem}>
                <Typography variant="h6" className={classes.sectionTitle}>
                  PLATFORM & SOCIALS
                </Typography>
                <Link to="/affiliate" className={classes.link}>Affiliate Program</Link>
                <Link to="/vip" className={classes.link}>VIP Program</Link>
                <a href="https://x.com/betfungg" target="_blank" rel="noopener noreferrer" className={classes.link}>X (Twitter)</a>
                <a href="https://t.me/betfungg" target="_blank" rel="noopener noreferrer" className={classes.link}>Telegram</a>
                <a href="https://instagram.com/betfungg" target="_blank" rel="noopener noreferrer" className={classes.link}>Instagram</a>
              </Grid>
            </>
          )}
        </Grid>

        <Typography className={classes.copyright}>
          © {new Date().getFullYear()} Betfun.gg - All rights reserved
        </Typography>
      </Container>
    </footer>
  );
};

export default Footer; 