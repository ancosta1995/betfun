import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import { useHistory } from 'react-router-dom';
import { Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0c0d15',
    zIndex: 10000,
    display: 'flex',
    flexDirection: 'column',
    animation: '$slideIn 0.3s ease-out'
  },
  '@keyframes slideIn': {
    from: {
      transform: 'translateY(100%)'
    },
    to: {
      transform: 'translateY(0)'
    }
  },
  header: {
    padding: '20px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    position: 'sticky',
    top: 0,
    backgroundColor: '#0c0d15',
    zIndex: 1,
    backdropFilter: 'blur(10px)'
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#1b1c2a',
    borderRadius: '16px',
    padding: '4px 16px',
    gap: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    position: 'relative',
    '&:focus-within': {
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      transform: 'translateY(-1px)'
    }
  },
  searchIcon: {
    color: '#6c757d'
  },
  searchInput: {
    flex: 1,
    padding: '14px 0',
    fontSize: '16px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#fff',
    fontFamily: 'Poppins, sans-serif',
    width: 'calc(100% - 80px)',
    '&::placeholder': {
      color: '#6c757d'
    },
    '&:focus': {
      outline: 'none'
    }
  },
  closeButton: {
    position: 'absolute',
    right: '8px',
    background: 'none',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '50%',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.1)',
      transform: 'rotate(90deg)'
    }
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    '&::-webkit-scrollbar': {
      width: '8px'
    },
    '&::-webkit-scrollbar-track': {
      background: '#0c0d15'
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#1b1c2a',
      borderRadius: '4px'
    }
  },
  categoryTabs: {
    display: 'flex',
    gap: '16px',
    padding: '20px',
    overflowX: 'auto',
    marginBottom: '10px',
    backgroundColor: '#0c0d15',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  },
  categoryTab: {
    padding: '12px 24px',
    borderRadius: '30px',
    backgroundColor: '#1b1c2a',
    color: '#fff',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.3s ease',
    fontWeight: 600,
    fontSize: '14px',
    letterSpacing: '0.5px',
    border: '2px solid transparent',
    fontFamily: 'Poppins, sans-serif',
    '&.active': {
      backgroundColor: theme.palette.primary.main,
      transform: 'scale(1.05)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      border: '2px solid rgba(255,255,255,0.1)'
    },
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      border: '2px solid rgba(255,255,255,0.05)'
    }
  },
  gamesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '16px',
    padding: '10px 0'
  },
  gameCard: {
    position: 'relative',
    borderRadius: '16px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: '#1b1c2a',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
      '& $gameImage': {
        transform: 'scale(1.05)'
      }
    }
  },
  gameImage: {
    width: '100%',
    aspectRatio: '1',
    objectFit: 'cover',
    transition: 'transform 0.5s ease'
  },
  gameName: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '16px',
    background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 600,
    textAlign: 'center',
    fontFamily: 'Poppins, sans-serif',
    backdropFilter: 'blur(4px)'
  },
  newBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    background: 'linear-gradient(45deg, #ff4757, #ff6b81)',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 600,
    boxShadow: '0 2px 8px rgba(255,71,87,0.3)',
    fontFamily: 'Poppins, sans-serif',
    animation: '$pulse 2s infinite'
  },
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)'
    },
    '50%': {
      transform: 'scale(1.05)'
    },
    '100%': {
      transform: 'scale(1)'
    }
  },
  loadMoreContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '20px 0'
  },
  loadMoreButton: {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    padding: '12px 32px',
    borderRadius: '25px',
    fontWeight: 600,
    textTransform: 'none',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
    }
  },
  [theme.breakpoints.down('sm')]: {
    searchContainer: {
      margin: '0 8px',
    },
    categoryTabs: {
      padding: '12px',
    },
    categoryTab: {
      padding: '8px 16px',
      fontSize: '12px',
    },
    content: {
      padding: '12px',
    },
    gamesGrid: {
      gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
      gap: '8px',
    },
    gameName: {
      fontSize: '12px',
      padding: '12px',
    }
  }
}));

const SearchModal = ({ isOpen, onClose }) => {
  const classes = useStyles();
  const history = useHistory();
  const [searchTerm, setSearchTerm] = useState('');
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [visibleGames, setVisibleGames] = useState(10);

  const categories = [
    { id: 'all', name: 'All Games' },
    { id: 'blackjack', name: 'Blackjack' },
    { id: 'roulette', name: 'Roulette' },
    { id: 'live', name: 'Live Casino' },
    { id: 'video-slots', name: 'Slots' }
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      fetch('https://raw.githubusercontent.com/blancos13/games/refs/heads/main/games.json')
        .then(res => res.json())
        .then(data => {
          const gamesArray = Object.values(data);
          setGames(gamesArray);
          setFilteredGames(gamesArray);
        })
        .catch(err => console.error('Error fetching games:', err));
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    let filtered = games;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(game => 
        game.category?.toLowerCase() === selectedCategory.toLowerCase() || 
        game.type?.toLowerCase() === selectedCategory.toLowerCase() ||
        game.name?.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }
    
    if (searchTerm) {
      filtered = filtered.filter(game => 
        game.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredGames(filtered);
    setVisibleGames(10);
  }, [searchTerm, games, selectedCategory]);

  const handleGameClick = useCallback((game) => {
    history.push(`/${game.id_hash}`);
    onClose();
  }, [history, onClose]);

  const loadMore = () => {
    setVisibleGames(prev => prev + 10);
  };

  if (!isOpen) return null;

  return (
    <div className={classes.modal}>
      <div className={classes.header}>
        <div className={classes.searchContainer}>
          <SearchIcon className={classes.searchIcon} />
          <input
            type="text"
            placeholder="Search games..."
            className={classes.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          <button className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
      </div>

      <div className={classes.categoryTabs}>
        {categories.map(category => (
          <div
            key={category.id}
            className={`${classes.categoryTab} ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </div>
        ))}
      </div>

      <div className={classes.content}>
        <div className={classes.gamesGrid}>
          {filteredGames.slice(0, visibleGames).map((game) => (
            <div 
              key={game.id} 
              className={classes.gameCard}
              onClick={() => handleGameClick(game)}
            >
              <img 
                src={game.image_square} 
                alt={game.name}
                className={classes.gameImage}
                loading="lazy"
              />
              <div className={classes.gameName}>{game.name}</div>
              {game.new && <div className={classes.newBadge}>NEW</div>}
            </div>
          ))}
        </div>
        {visibleGames < filteredGames.length && (
          <div className={classes.loadMoreContainer}>
            <Button 
              className={classes.loadMoreButton}
              onClick={loadMore}
              variant="contained"
            >
              Load More Games
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;
