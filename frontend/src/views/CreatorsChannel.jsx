import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { 
  Container, 
  Typography, 
  Grid, 
  Button, 
  Card, 
  CardMedia, 
  CardContent, 
  Box,
  Avatar,
  Chip,
  useMediaQuery,
  useTheme
} from '@material-ui/core';
import { themeConfig } from '../config/config';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import VideogameAssetIcon from '@material-ui/icons/VideogameAsset';
import PeopleIcon from '@material-ui/icons/People';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: themeConfig.background,
    minHeight: '100vh',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(8),
    overflow: 'hidden',
  },
  heroSection: {
    position: 'relative',
    backgroundImage: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(https://cdn.softswiss.net/i/s2/hacksaw/SlayersInc94.webp)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: theme.spacing(1.5),
    padding: theme.spacing(8, 4),
    marginBottom: theme.spacing(6),
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(45deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)',
      zIndex: 1,
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(6, 2),
      borderRadius: theme.spacing(1),
    },
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    animation: '$fadeIn 1s ease-out',
  },
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0,
      transform: 'translateY(20px)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  heroTitle: {
    color: '#fff',
    fontWeight: 800,
    marginBottom: theme.spacing(1),
    textTransform: 'uppercase',
    fontSize: '2.5rem',
    textShadow: '0 2px 10px rgba(0,0,0,0.3)',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.8rem',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '1.5rem',
    },
  },
  heroSubtitle: {
    color: '#fff',
    fontSize: '3.5rem',
    fontWeight: 900,
    marginBottom: theme.spacing(4),
    textTransform: 'uppercase',
    textShadow: '0 2px 15px rgba(0,0,0,0.4)',
    background: 'linear-gradient(90deg, #fff, #4F79FD)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    [theme.breakpoints.down('sm')]: {
      fontSize: '2.5rem',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '2rem',
    },
  },
  infoBox: {
    backgroundColor: themeConfig.secondbackground,
    borderRadius: theme.spacing(1.5),
    padding: theme.spacing(3),
    marginBottom: theme.spacing(4),
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      width: '30%',
      height: '100%',
      backgroundImage: 'url(https://via.placeholder.com/300x300/1a1a2e/ffffff?text=Slots)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity: 0.1,
      [theme.breakpoints.down('sm')]: {
        width: '20%',
      },
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2),
    },
  },
  infoTitle: {
    color: '#fff',
    fontWeight: 700,
    marginBottom: theme.spacing(2),
    position: 'relative',
    display: 'inline-block',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: -8,
      left: 0,
      width: 40,
      height: 3,
      background: themeConfig.primary,
      borderRadius: 2,
    },
  },
  infoText: {
    color: '#9EA9BF',
    marginBottom: theme.spacing(2.5),
    maxWidth: '70%',
    lineHeight: 1.6,
    [theme.breakpoints.down('sm')]: {
      maxWidth: '80%',
    },
    [theme.breakpoints.down('xs')]: {
      maxWidth: '100%',
    },
  },
  button: {
    backgroundColor: themeConfig.primary,
    color: '#fff',
    padding: theme.spacing(1, 3),
    borderRadius: theme.spacing(0.5),
    fontWeight: 600,
    textTransform: 'uppercase',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
      transform: 'translateY(-2px)',
      boxShadow: '0 5px 15px rgba(79, 121, 253, 0.4)',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
      transition: 'all 0.5s ease',
    },
    '&:hover::after': {
      left: '100%',
    },
  },
  searchBar: {
    backgroundColor: themeConfig.secondbackground,
    borderRadius: theme.spacing(1.5),
    padding: theme.spacing(1, 2),
    marginBottom: theme.spacing(4),
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
    },
    '& .MuiInputBase-root': {
      color: '#fff',
    },
    '& .MuiInputBase-input': {
      padding: theme.spacing(1.2, 1, 1.2, 0),
    },
    '& .MuiInputAdornment-root': {
      color: '#9EA9BF',
    },
  },
  categoryTabs: {
    marginBottom: theme.spacing(4),
    '& .MuiTabs-indicator': {
      backgroundColor: themeConfig.primary,
      height: 3,
      borderRadius: '3px 3px 0 0',
    },
    '& .MuiTab-root': {
      color: '#9EA9BF',
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.9rem',
      minWidth: 100,
      transition: 'all 0.3s ease',
      '&.Mui-selected': {
        color: '#fff',
      },
      '&:hover': {
        color: '#fff',
        backgroundColor: 'rgba(79, 121, 253, 0.1)',
      },
      [theme.breakpoints.down('xs')]: {
        minWidth: 80,
        fontSize: '0.8rem',
        padding: theme.spacing(1),
      },
    },
    '& .MuiTabs-flexContainer': {
      [theme.breakpoints.down('xs')]: {
        justifyContent: 'flex-start',
      },
    },
  },
  gameCard: {
    backgroundColor: themeConfig.secondbackground,
    borderRadius: theme.spacing(1.5),
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 12px 30px rgba(0,0,0,0.2)',
    },
  },
  gameMedia: {
    height: 0,
    paddingTop: '56.25%', // 16:9 aspect ratio
    position: 'relative',
    overflow: 'hidden',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%)',
      zIndex: 1,
    },
  },
  gameContent: {
    padding: theme.spacing(2.5),
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
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
  },
  gameTitle: {
    color: '#fff',
    fontWeight: 700,
    fontSize: '1.1rem',
    marginBottom: theme.spacing(1.5),
    lineHeight: 1.3,
    transition: 'color 0.3s ease',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical',
    height: '2.6rem',
  },
  streamerInfo: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    padding: theme.spacing(0.5, 0),
  },
  streamerAvatar: {
    width: 28,
    height: 28,
    marginRight: theme.spacing(1),
    border: '2px solid ' + themeConfig.primary,
  },
  streamerName: {
    color: '#9EA9BF',
    fontSize: '0.85rem',
    fontWeight: 500,
    transition: 'color 0.3s ease',
    '&:hover': {
      color: '#fff',
    },
  },
  statsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: theme.spacing(1.5),
    borderTop: '1px solid rgba(255,255,255,0.05)',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    color: '#9EA9BF',
    fontSize: '0.85rem',
    '& svg': {
      fontSize: '1.1rem',
      marginRight: theme.spacing(0.5),
      opacity: 0.7,
    },
  },
  countryFlag: {
    width: 22,
    height: 16,
    marginRight: theme.spacing(0.5),
    borderRadius: 2,
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  sectionTitle: {
    color: '#fff',
    fontWeight: 700,
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(8),
    position: 'relative',
    display: 'inline-block',
    fontSize: '1.5rem',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: -10,
      left: 0,
      width: 50,
      height: 3,
      background: themeConfig.primary,
      borderRadius: 2,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '1.3rem',
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(3),
    },
  },
  streamerCard: {
    backgroundColor: themeConfig.secondbackground,
    borderRadius: theme.spacing(1.5),
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 12px 30px rgba(0,0,0,0.2)',
    },
  },
  streamerCardMedia: {
    height: 180,
    backgroundColor: 'rgba(0,0,0,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'radial-gradient(circle, rgba(79,121,253,0.1) 0%, rgba(10,11,28,0.4) 100%)',
      zIndex: 1,
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '30%',
      background: 'linear-gradient(0deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)',
      zIndex: 1,
    },
  },
  streamerCardContent: {
    padding: theme.spacing(3),
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
  },
  streamerCardAvatar: {
    width: 90,
    height: 90,
    border: '3px solid ' + themeConfig.primary,
    marginTop: -45,
    boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
    position: 'relative',
    zIndex: 2,
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  streamerCardName: {
    color: '#fff',
    fontWeight: 600,
    fontSize: '1.2rem',
    marginTop: theme.spacing(2),
    textAlign: 'center',
    transition: 'color 0.3s ease',
  },
  streamerCardFollowers: {
    color: '#9EA9BF',
    fontSize: '0.85rem',
    textAlign: 'center',
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& svg': {
      fontSize: '1rem',
      marginRight: theme.spacing(0.5),
      color: themeConfig.primary,
    },
  },
  statusChip: {
    position: 'absolute',
    top: theme.spacing(1.5),
    right: theme.spacing(1.5),
    backgroundColor: '#1E2128',
    color: '#9EA9BF',
    fontWeight: 600,
    fontSize: '0.7rem',
    zIndex: 2,
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    border: '1px solid rgba(255,255,255,0.05)',
    padding: theme.spacing(0.5, 1),
  },
  winStatus: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing(1.5),
    gap: theme.spacing(1.5),
    flexWrap: 'wrap',
  },
  winStatusText: {
    color: '#4CAF50',
    fontSize: '0.8rem',
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.spacing(0.5),
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    '& svg': {
      fontSize: '1rem',
      marginRight: theme.spacing(0.5),
    },
  },
  loseStatusText: {
    color: '#F44336',
    fontSize: '0.8rem',
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.spacing(0.5),
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    '& svg': {
      fontSize: '1rem',
      marginRight: theme.spacing(0.5),
    },
  },
  lastBroadcast: {
    color: '#9EA9BF',
    fontSize: '0.8rem',
    textAlign: 'center',
    marginTop: theme.spacing(1.5),
    padding: theme.spacing(1),
    borderRadius: theme.spacing(0.5),
    backgroundColor: 'rgba(255,255,255,0.03)',
    width: '100%',
  },
  noGamesMessage: {
    color: '#9EA9BF',
    textAlign: 'center',
    padding: theme.spacing(4),
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: theme.spacing(1),
    width: '100%',
    marginBottom: theme.spacing(4),
  },
  loadMoreButton: {
    margin: '0 auto',
    display: 'block',
    marginTop: theme.spacing(4),
  },
}));

// Sample data for games
const games = [
  {
    id: 1,
    title: 'WANTED: DEAD OR A WILD',
    image: 'https://cdn.softswiss.net/i/s2/hacksaw/SlayersInc94.webp',
    streamer: {
      name: 'Drouinsky',
      avatar: 'https://www.hype.bet/_nuxt/Astronaut_11.BA7EiOaz.png',
    },
    viewers: 13,
    plays: 3,
    country: 'ca',
  },
  {
    id: 2,
    title: 'CLEOCAT-RA',
    image: 'https://cdn.softswiss.net/i/s2/hacksaw/SlayersInc94.webp',
    streamer: {
      name: 'TheNamesMagoo',
      avatar: 'https://www.hype.bet/_nuxt/Astronaut_11.BA7EiOaz.png',
    },
    viewers: 24,
    plays: 1,
    country: 'ca',
    winStatus: {
      bigWins: true,
      smallWins: false,
    },
  },
  {
    id: 3,
    title: '5 LIONS MEGAWAYS 2',
    image: 'https://cdn.softswiss.net/i/s2/hacksaw/SlayersInc94.webp',
    streamer: {
      name: 'UMADD',
      avatar: 'https://www.hype.bet/_nuxt/Astronaut_11.BA7EiOaz.png',
    },
    viewers: 10,
    plays: 2,
    country: 'ca',
    winStatus: {
      bigWins: false,
      smallWins: true,
    },
  },
];

// Sample data for streamers
const streamers = [
  {
    id: 1,
    name: 'wantedslots',
    avatar: 'https://www.hype.bet/_nuxt/Astronaut_11.BA7EiOaz.png',
    followers: 115,
    status: 'OFFLINE',
    lastBroadcast: '21 hours ago',
  },
  {
    id: 2,
    name: 'legendardesvideos',
    avatar: 'https://www.hype.bet/_nuxt/Astronaut_11.BA7EiOaz.png',
    followers: 107,
    status: 'OFFLINE',
    lastBroadcast: '1 hour ago',
  },
  {
    id: 3,
    name: 'Supersmask',
    avatar: 'https://www.hype.bet/_nuxt/Astronaut_11.BA7EiOaz.png',
    followers: 31,
    status: 'OFFLINE',
    lastBroadcast: '6 days ago',
  },
];

const CreatorsChannel = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const isTablet = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div className={classes.root}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box className={classes.heroSection}>
          <div className={classes.heroContent}>
            <Typography variant="h4" className={classes.heroTitle}>
              EXPERIENCE THE THRILL OF
            </Typography>
            <Typography variant="h2" className={classes.heroSubtitle}>
              MULTIPLAYER SLOTS
            </Typography>
          </div>
        </Box>

        {/* How It Works Section */}
        <Grid container spacing={isTablet ? 3 : 4}>
          <Grid item xs={12} md={6}>
            <Box className={classes.infoBox}>
              <Typography variant="h5" className={classes.infoTitle}>
                HOW IT WORKS
              </Typography>
              <Typography variant="body1" className={classes.infoText}>
                Find out more about how multiplayer works and how you can play slots with your favorite streamer.
              </Typography>
              <Button variant="contained" className={classes.button}>
                LEARN MORE
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box className={classes.infoBox}>
              <Typography variant="h5" className={classes.infoTitle}>
                WANT TO BECOME A CASINO STREAMER?
              </Typography>
              <Typography variant="body1" className={classes.infoText}>
                Get tips, commissions, and bonuses. Start earning from day one.
              </Typography>
              <Button variant="contained" className={classes.button}>
                LEARN MORE
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Live Games Section */}
        <Typography variant="h5" className={classes.sectionTitle} style={{ marginTop: theme.spacing(4) }}>
          Live Games
        </Typography>

        {/* Live Games Grid */}
        {games.length > 0 ? (
          <Grid container spacing={isTablet ? 2 : 3}>
            {games.map((game) => (
              <Grid item xs={12} sm={6} md={4} key={game.id}>
                <Card className={classes.gameCard}>
                  <CardMedia
                    className={classes.gameMedia}
                    image={game.image}
                    title={game.title}
                  />
                  <img 
                    src={`https://via.placeholder.com/30x20/1a1a2e/ffffff?text=${game.country}`} 
                    alt={game.country} 
                    className={classes.countryFlag} 
                  />
                  <CardContent className={classes.gameContent}>
                    <div className={classes.streamerInfo}>
                      <Avatar src={game.streamer.avatar} className={classes.streamerAvatar} />
                      <Typography className={classes.streamerName}>{game.streamer.name}</Typography>
                    </div>
                    <Typography className={classes.gameTitle}>{game.title}</Typography>
                    <div className={classes.statsContainer}>
                      <div className={classes.statItem}>
                        <PeopleIcon />
                        <Typography variant="body2">{game.viewers}</Typography>
                      </div>
                      <div className={classes.statItem}>
                        <VideogameAssetIcon />
                        <Typography variant="body2">{game.plays}</Typography>
                      </div>
                    </div>
                    {game.winStatus && (
                      <div className={classes.winStatus}>
                        {game.winStatus.bigWins && (
                          <Typography className={classes.winStatusText}>
                            <CheckCircleIcon /> Big wins only
                          </Typography>
                        )}
                        {game.winStatus.smallWins === false && (
                          <Typography className={classes.loseStatusText}>
                            <CancelIcon /> No small wins
                          </Typography>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography className={classes.noGamesMessage}>
            No live games available at the moment. Check back later!
          </Typography>
        )}

        {/* Offline Rooms Section */}
        <Typography variant="h5" className={classes.sectionTitle}>
          Offline Rooms
        </Typography>

        <Grid container spacing={isTablet ? 2 : 3}>
          {streamers.map((streamer) => (
            <Grid item xs={12} sm={6} md={4} key={streamer.id}>
              <Card className={classes.streamerCard}>
                <CardMedia className={classes.streamerCardMedia}>
                  <Chip
                    label={streamer.status}
                    className={classes.statusChip}
                    size="small"
                  />
                </CardMedia>
                <CardContent className={classes.streamerCardContent}>
                  <Avatar src={streamer.avatar} className={classes.streamerCardAvatar} />
                  <Typography className={classes.streamerCardName}>{streamer.name}</Typography>
                  <Typography className={classes.streamerCardFollowers}>
                    <PeopleIcon /> {streamer.followers} followers
                  </Typography>
                  <Typography className={classes.lastBroadcast}>
                    Last live broadcast {streamer.lastBroadcast}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Button 
          variant="contained" 
          className={`${classes.button} ${classes.loadMoreButton}`}
        >
          LOAD MORE
        </Button>
      </Container>
    </div>
  );
};

export default CreatorsChannel; 