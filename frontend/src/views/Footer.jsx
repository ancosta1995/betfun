import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Grid, Typography, Link, Box } from '@material-ui/core';
import TwitterIcon from '@material-ui/icons/Twitter';
import TelegramIcon from '@material-ui/icons/Telegram';

const useStyles = makeStyles((theme) => ({
  footer: {
    backgroundColor: 'rgb(10, 11, 28)',
    color: '#ffffff',
    padding: theme.spacing(2, 0),
    marginTop: theme.spacing(4),
    margin: '0 auto',   // Centers the footer horizontally
  },
  logo: {
    fontWeight: 'bold',
    fontSize: '1.2rem',
    marginBottom: theme.spacing(1),
  },
  socialIcons: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'flex-start',
      marginTop: theme.spacing(1),
    },
  },
  icon: {
    marginLeft: theme.spacing(1),
    color: '#ffffff',
    '&:hover': {
      color: 'hsl(215, 75%, 50%)',
    },
  },
  links: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      marginRight: theme.spacing(2),
      marginBottom: theme.spacing(0.5),
      color: '#ffffff',
      fontSize: '0.8rem',
      '&:hover': {
        color: 'hsl(215, 75%, 50%)',
        textDecoration: 'none',
      },
    },
  },
  disclaimer: {
    fontSize: '0.7rem',
    marginTop: theme.spacing(1),
    color: '#8e8e8e',
  },
  copyright: {
    fontSize: '0.7rem',
    marginTop: theme.spacing(1),
    color: '#8e8e8e',
  },
  gambleAware: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'flex-start',
      marginTop: theme.spacing(1),
    },
  },
}));

export default function Footer() {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <Container maxWidth="lg">
        <Grid container spacing={1}>
          <Grid item xs={12} sm={6}>
            <Typography className={classes.logo}>
              JestBet
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box className={classes.socialIcons}>
              <Typography variant="body2">Community</Typography>
              <Link href="#" className={classes.icon}>
                <TwitterIcon fontSize="small" />
              </Link>
              <Link href="#" className={classes.icon}>
                <TelegramIcon fontSize="small" />
              </Link>
            </Box>
          </Grid>
        </Grid>
        <Box className={classes.links}>
          <Link href="#">Terms of Service</Link>
          <Link href="#">Provably Fair</Link>
          <Link href="#">Privacy Policy</Link>
          <Link href="#">AML & KYC Policy</Link>
          <Link href="#">Responsible Gaming & Self-Exclusion</Link>
          <Link href="#">Dispute Resolution</Link>
        </Box>
        <Typography className={classes.disclaimer}>
          www.jest.bet is operated by Topia Casino LTD. N.V. registered under No 162057, at Kaya W.F.G. Jombi Mensing 24, Unit A, Willemstad, Curacao. This website is licensed and regulated by Curacao eGaming (Curacao license No. 1668 JAZ issued by Curacao eGaming). In order to register for this website, the user is required to accept the General Terms and Conditions. In the event the General Terms and Conditions are updated, existing users may choose to discontinue using the products and services before the said update shall become effective, which is a minimum of two weeks after it has been announced.
        </Typography>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Typography className={classes.copyright}>
              © 2024 Jest.bet | All Rights Reserved
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box className={classes.gambleAware}>
              <img src="/begambleaware.png" alt="BeGambleAware" height="20" />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </footer>
  );
}