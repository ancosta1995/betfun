import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { motion } from 'framer-motion';
import { FiClock, FiDollarSign, FiStar } from 'react-icons/fi';
import { IoStatsChart } from 'react-icons/io5';

const MotionButton = motion(Button);

// Demo verisi
const demoMarkets = [
  {
    id: 1,
    category: 'CRYPTO',
    title: 'BTC PRICE OVER $100K BY EOY?',
    lockDays: '30',
    volume: 15800,
    odds: {
      yes: { price: 0.35, change: '+0.01' },
      no: { price: 0.65, change: '-0.01' }
    }
  },
  {
    id: 2,
    category: 'POLITICS',
    title: 'WILL TRUMP PARDON JAN 6TH CRIMES?',
    lockDays: '2',
    volume: 4280,
    odds: {
      yes: { price: 0.45, change: '+0.02' },
      no: { price: 0.55, change: '-0.02' }
    }
  },
  {
    id: 3,
    category: 'STOCKS',
    title: 'TESLA STOCK ABOVE $300 THIS MONTH?',
    lockDays: '7',
    volume: 9240,
    odds: {
      yes: { price: 0.28, change: '+0.03' },
      no: { price: 0.72, change: '-0.03' }
    }
  },
  {
    id: 4,
    category: 'CRYPTO',
    title: 'ETH MERGE SUCCESSFUL BY SEPTEMBER?',
    lockDays: '15',
    volume: 12460,
    odds: {
      yes: { price: 0.82, change: '+0.01' },
      no: { price: 0.18, change: '-0.01' }
    }
  }
];

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: 'rgb(8, 8, 8)',
    minHeight: '100vh',
    padding: '20px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  featuredGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '24px',
    '@media (max-width: 1024px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    '@media (max-width: 600px)': {
      gridTemplateColumns: '1fr',
    },
  },
  marketGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    '@media (max-width: 1200px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
    '@media (max-width: 900px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    '@media (max-width: 600px)': {
      gridTemplateColumns: '1fr',
    },
  },
  bannerCard: {
    position: 'relative',
    height: '180px',
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      '& $bannerImage': {
        transform: 'scale(1.05)',
      },
    },
  },
  bannerImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 100%)',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  bannerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerCategory: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#00ff00',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: '4px 8px',
    borderRadius: '4px',
  },
  bannerTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    marginBottom: '8px',
    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
  },
  bannerStats: {
    display: 'flex',
    gap: '12px',
  },
  bannerStat: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.9)',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: '4px 8px',
    borderRadius: '4px',
  },
  marketCard: {
    background: 'rgba(22, 24, 29, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '12px',
    minWidth: '240px',
    maxWidth: '100%',
    height: 'fit-content',
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      borderColor: 'rgba(255, 255, 255, 0.12)',
    },
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  category: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#00ff00',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  lockTime: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.5)',
    '& svg': {
      fontSize: '12px',
    },
  },
  title: {
    fontSize: '13px',
    fontWeight: '500',
    lineHeight: '1.4',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: '12px',
    minHeight: '36px',
  },
  oddsContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    marginBottom: '8px',
  },
  oddsButton: {
    height: '36px !important',
    display: 'flex !important',
    justifyContent: 'space-between !important',
    alignItems: 'center !important',
    padding: '0 12px !important',
    borderRadius: '8px !important',
    fontSize: '13px !important',
    fontWeight: '500 !important',
    letterSpacing: '0.3px !important',
    textTransform: 'none !important',
    width: '100% !important',
  },
  buttonLabel: {
    fontWeight: '600',
  },
  buttonPrice: {
    opacity: 0.9,
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '1px',
    '&::after': {
      content: '"%"',
      marginLeft: '1px',
    },
  },
  yesButton: {
    backgroundColor: 'rgba(0, 200, 83, 0.1) !important',
    borderColor: 'rgba(0, 200, 83, 0.3) !important',
    color: '#00c853 !important',
    '&:hover': {
      backgroundColor: 'rgba(0, 200, 83, 0.15) !important',
      borderColor: '#00c853 !important',
    },
  },
  noButton: {
    backgroundColor: 'rgba(255, 23, 68, 0.1) !important',
    borderColor: 'rgba(255, 23, 68, 0.3) !important',
    color: '#ff1744 !important',
    '&:hover': {
      backgroundColor: 'rgba(255, 23, 68, 0.15) !important',
      borderColor: '#ff1744 !important',
    },
  },
  priceTag: {
    fontSize: '12px',
    fontWeight: '600',
    textAlign: 'center',
    padding: '4px 8px',
    borderRadius: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  yesPrice: {
    color: '#00c853',
  },
  noPrice: {
    color: '#ff1744',
  },
  stats: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px',
    marginTop: '12px',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.6)',
    '& svg': {
      fontSize: '12px',
      opacity: 0.7,
    },
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
}));

// Örnek banner resimleri
const bannerImages = {
  CRYPTO: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d',
  POLITICS: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620',
  STOCKS: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3',
};

function BannerCard({ market }) {
  const classes = useStyles();
  
  return (
    <div className={classes.bannerCard}>
      <img 
        src={bannerImages[market.category]} 
        alt={market.category}
        className={classes.bannerImage}
      />
      <div className={classes.bannerOverlay}>
        <div className={classes.bannerHeader}>
          <div className={classes.bannerCategory}>
            <IoStatsChart size={12} />
            {market.category}
          </div>
          <div className={classes.bannerStat}>
            <FiClock size={12} />
            {market.lockDays}d
          </div>
        </div>
        
        <div>
          <h3 className={classes.bannerTitle}>{market.title}</h3>
          <div className={classes.bannerStats}>
            <div className={classes.bannerStat}>
              <FiDollarSign size={12} />
              ${market.volume.toLocaleString()}
            </div>
            <div className={classes.bannerStat}>
              <FiStar size={12} />
              {((market.odds.yes.price) * 100).toFixed(0)}% Yes
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MarketCard({ market }) {
  const classes = useStyles();
  const isYesNo = !market.odds.higher;

  return (
    <div className={classes.marketCard}>
      <div className={classes.cardHeader}>
        <div className={classes.category}>
          <IoStatsChart size={12} />
          {market.category}
        </div>
        <div className={classes.lockTime}>
          <FiClock size={12} />
          {market.lockDays}d
        </div>
      </div>

      <h3 className={classes.title}>{market.title}</h3>

      <div className={classes.oddsContainer}>
        <MotionButton 
          className={`${classes.oddsButton} ${classes.yesButton}`}
          variant="outlined"
        >
          <span className={classes.buttonLabel}>Yes</span>
          <span className={classes.buttonPrice}>
            {((isYesNo ? market.odds.yes.price : market.odds.higher.price) * 100).toFixed(0)}
          </span>
        </MotionButton>

        <MotionButton 
          className={`${classes.oddsButton} ${classes.noButton}`}
          variant="outlined"
        >
          <span className={classes.buttonLabel}>No</span>
          <span className={classes.buttonPrice}>
            {((isYesNo ? market.odds.no.price : market.odds.lower.price) * 100).toFixed(0)}
          </span>
        </MotionButton>
      </div>

      <div className={classes.stats}>
        <div className={classes.statItem}>
          <FiDollarSign size={12} />
          ${market.volume.toLocaleString()}
        </div>
        <div className={classes.statItem}>
          <FiStar size={12} />
          {market.category}
        </div>
      </div>
    </div>
  );
}

function Predictions() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.featuredGrid}>
        {demoMarkets.slice(0, 3).map(market => (
          <BannerCard key={market.id} market={market} />
        ))}
      </div>
      <div className={classes.marketGrid}>
        {demoMarkets.map(market => (
          <MarketCard key={market.id} market={market} />
        ))}
      </div>
    </div>
  );
}

export default Predictions; 