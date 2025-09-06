import React, { useState, useEffect, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { withStyles, makeStyles } from "@material-ui/core/styles";
// import Button from '@material-ui/core/Button';
import Preloader from '../Preloader';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logout } from '../actions/auth';
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Coin from "../assets/icons/coin.png";
import debounce from 'lodash/debounce';
import { SearchOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import Buttons from '@material-ui/core/Button';
import { Select, Checkbox, ConfigProvider, Input, Button } from 'antd';

const BetInput = withStyles({
  root: {
    width: "100%",
    marginTop: "auto",
    border: "1px solid transparent",
    background: "#1A1B33",
    borderRadius: "5px",
    overflow: "hidden",
    "& :before": {
      display: "none",
    },
    "& :after": {
      display: "none",
    },
    "& label": {
      color: "#323956",
      fontSize: 15,
    },
    "& div input": {
      color: "#e4e4e4",
      fontFamily: "Poppins",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".1em",
      padding: "0rem 0rem",
    },
    "& div": {
      height: "2.5rem",
      borderRadius: 4,
    },
    "&:hover": {
    }
  }
})(TextField);

const useStyles = makeStyles(theme => ({
  titleContainer: {
    borderBottom: '2px solid #101123',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    marginBottom: '20px',
    color: "#fff",
  },
  backButton: {
    marginRight: '1rem',
    backgroundColor: '#1d2341',
    color: '#fff',
    borderRadius: '6px',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: '#0a0a1e',
    },
  },

  root: {
    padding: '1rem 5rem',
    borderBottom: '2px solid #101123',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      padding: '1rem',
    },
  },
  select: {
    flex: 1, // Ensure it grows to fill available space
    minWidth: '200px',
    backgroundColor: '#1A1B33',
    borderColor: '#1A1B33',
    color: '#fff',
    borderRadius: '6px',
  },

  inputIcon: {
    marginTop: "0 !important",
    color: "#fff",
    background: "transparent !important",
  },
  container: {
    maxWidth: '1200px',
    width: '100%',
    [theme.breakpoints.down('lg')]: {
      maxWidth: '1000px',
       padding: '1rem',
      width: '100%',

    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },

    },
  topControls: {
    display: 'flex',
    justifyContent: 'space-between',
    borderRadius: '6px',
    // padding: '5px',
    marginBottom: '28px',
    [theme.breakpoints.down('sm')]: {
      // padding: '1rem',
      flexDirection: 'column',
    },
  },
  searchContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '0.5rem',
    width: '100%',
    color: 'inherit',
    flexWrap: 'unset',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',

    },
  },
  input: {
    minWidth: '10rem', // Minimum width

    width: '100%', // Full width
    height: '100%', // Full height
    padding: '0.5rem', // Padding inside the input    backgroundColor: '#1A1B33',
    borderColor: '#1A1B33',
    color: '#fff',
    fontSize: '14px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
  },

  dropdownContainer: {
    position: 'relative',
    width: '200px',
  },
  dropdownButton: {
    width: '100%',
    height: '50px',
    padding: '0 16px',
    border: '1px solid #282f58',
    borderRadius: '6px',
    background: 'radial-gradient(ellipse farthest-corner at 50% 100%, #262c51, #1d2341)',
    color: '#fff',
    cursor: 'pointer',
    textAlign: 'left',
    lineHeight: '50px',
    fontSize: '16px',
    fontWeight: 500,
    position: 'relative',
    '&:focus': {
      outline: 'none',
      borderColor: '#1d2341',
    },
  },
  dropdownMenu: {
    display: 'none',
    position: 'absolute',
    top: '100%',
    left: '0',
    width: '100%',
    background: '#262c51',
    borderRadius: '6px',
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.3)',
    zIndex: 1,
    maxHeight: '370px',
    overflowY: 'auto',
  },
  dropdownMenuItem: {
    padding: '12px 16px',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '&:hover': {
      background: '#1d2341',
    },
  },
  showMenu: {
    display: 'block',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '16px',
    [theme.breakpoints.down('lg')]: {
      // padding: '20px',
      gridTemplateColumns: 'repeat(6, 1fr)',
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: 'repeat(2, 1fr)',

    },
  },
  gridItem: {
    position: 'relative',
    aspectRatio: '1/1',
    borderRadius: '8px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },

  gameImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  gameFooter: {
    padding: '10px',
  },
  gameTitle: {
    margin: '5px 0 4px',
    fontSize: '14px', // Slightly larger font size
    fontFamily: '"Bebas Neue", "Cinzel", "Playfair Display", sans-serif', // Casino-themed fonts
    fontWeight: 600, // Medium bold weight
    lineHeight: '1.4', // Adequate line height for readability
    color: '#fff', // Ensure text color contrasts well with background
    textTransform: 'capitalize', // Capitalize first letters of words
    overflow: 'hidden', // Hide overflow text
    textOverflow: 'ellipsis', // Show ellipsis for overflow text
    whiteSpace: 'nowrap', // Prevent text from wrapping to the next line
  },


  gameProvider: {
    margin: '0',
    fontSize: '14px',
    color: '#999',
  },  loadMoreContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '2rem',
    marginBottom: '2rem',
  },
  loadMoreButton: {
    padding: '0.5rem 2rem',
    fontSize: '1rem',
    borderRadius: '6px',
  },
}));

const { Option } = Select;

const CustomInput = ({ value, onChange }) => {
  const classes = useStyles();

  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            colorBgContainer: '#1A1B33', // Background color of the input container
            colorBorder: '#1A1B33', // Border color of the input
            colorText: '#fff', // Text color inside the input
            colorTextPlaceholder: '#fff', // Placeholder text color
            borderRadius: 6, // Border radius
          },
        },
      }}
    >
      <Input
        value={value}
        onChange={onChange}
        placeholder="Search "
        prefix={<SearchOutlined style={{ color: '#fff' }} />} // Prefix icon
        className={classes.input} // Custom styles
      />
    </ConfigProvider>
  );
};


const CustomSelect = ({ options = [], value, onChange }) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Select: {
            selectorBg: '#1A1B33', // Background color of the selector
            colorBorder: '#1A1B33', // Border color of the select component
            colorBgContainer: '#1A1B33', // Background color of the container
            colorBgElevated: '#1A1B33', // Background color of the elevated popup layer
            colorText: '#fff', // Text color inside the select component
            borderRadius: 6, // Border radius for rounded corners
            colorTextPlaceholder: '#fff', // Placeholder text color
            optionSelectedBg: '#2871FF',
          },
          SelectDropdown: {
            colorBorder: '#1A1B33', // Border color of dropdown menu
            colorBgContainer: '#1A1B33', // Background color of dropdown menu
            colorText: '#fff', // Text color inside the dropdown menu
            optionSelectedBg: '#2871FF',

          },
          SelectOption: {
            
            colorBorder: '#1A1B33', // Border color of options
            colorBgContainer: '#050614', // Background color of options
            colorText: '#fff', // Text color inside the select component
            optionSelectedBg: '#2871FF',

          },
          // Customizing the selected option style (this may not always work as expected)
          SelectItemOptionSelected: {
            colorBgContainer: '#080F27', // Background color of selected option
            colorText: '#fff', // Text color inside the selected option
            optionSelectedBg: '#2871FF',

          },
        },
      }}
    >
      <Select
        value={value}
        onChange={onChange}
        placeholder="Sort by"
        
        style={{
          width: '150px',
          backgroundColor: '#1A1B33', // Background color of the select
          borderColor: '#1A1B33', // Border color
          color: '#fff', // Text color
          borderRadius: '6px', // Border radius for select

        }}
        dropdownStyle={{ backgroundColor: '#1A1B33' }}
      >
        {options.map(option => (
          <Option key={option} value={option}>
            {option}
          </Option>
        ))}
      </Select>
    </ConfigProvider>
  );
};

const CustomDropdown = ({ options = [], value = [], onChange, gameCounts = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const classes = useStyles();
  // Handle changes to the selected options
  const handleSelect = (selectedValues) => {
    onChange(selectedValues);
  };

  // Handle clicks on options
  const handleOptionClick = (option) => {
    const newValue = value.includes(option)
      ? value.filter(v => v !== option)
      : [...value, option];
    onChange(newValue);
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Select: {
            selectorBg: '#1A1B33', // Background color of the selector
            colorBorder: '#1A1B33', // Border color of the select component
            colorBgContainer: '#1A1B33', // Background color of the container
            colorBgElevated: '#1A1B33', // Background color of the elevated popup layer
            colorText: '#fff', // Text color inside the select component
            borderRadius: 6, // Border radius for rounded corners
            colorTextPlaceholder: '#fff', // Placeholder text color
            
          },
          SelectDropdown: {
            colorBorder: '#1A1B33', // Border color of dropdown menu
            colorBgContainer: '#1A1B33', // Background color of dropdown menu
            colorText: '#fff', // Text color inside the dropdown menu
          },
          SelectOption: {
            colorBorder: '#1A1B33', // Border color of options
            colorBgContainer: '#050614', // Background color of options
            colorText: '#fff', // Text color inside the select component
          },
        },
      }}
    >
      <Select
        mode="multiple"
        placeholder="All providers"
        value={[]} // Display an empty array to hide selected items
        onChange={handleSelect}
        onDropdownVisibleChange={setIsOpen}
        showSearch={false} // Disable search functionality
        className={classes.ss} // Custom styles

        open={isOpen}
        style={{
          height: "2.5rem",
          width: '100%',
          borderColor: '#1A1B33',
          color: '#fff', // Text color of the selected items
        }}
        
        dropdownRender={menu => (
          <div style={{ maxHeight: 340, overflowY: 'auto' }}>
            {options.map(option => (
              <div
                key={option}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px 8px',
                  cursor: 'pointer',
                  backgroundColor: value.includes(option) ? '#1A1B33' : 'transparent',
                  borderBottom: '1px solid #1A1B33',
                  color: '#fff', // Text color inside dropdown items
                }}
                
                onClick={() => handleOptionClick(option)}
              >
                <Checkbox checked={value.includes(option)} style={{ marginRight: '8px' }} />
                {option}
                <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#888' }}>
                  ({gameCounts[option] || 0})
                </span>
              </div>
            ))}
          </div>
        )}
      >
        {options.map(option => (
          <Option key={option} value={option} style={{ display: 'none' }}>
            {option} ({gameCounts[option] || 0})
          </Option>
        ))}
      </Select>
    </ConfigProvider>
  );
};

const GameFooter = ({ game }) => {
  const classes = useStyles();
  return (
    <motion.div 
      className={classes.gameFooter}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className={classes.gameTitle}>{game.name}</h3>
      <p className={classes.gameProvider}>{game.category}</p>
    </motion.div>
  );
};


const GameImage = ({ game }) => {
  const classes = useStyles();
  return (
    <motion.img 
      src={game.image}
      alt={game.name}
      className={classes.gameImage}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    />
  );
};




const Slots = ({ user, logout }) => {
  
  const classes = useStyles();
  const [gameData, setGameData] = useState([]);
  const [displayedImages, setDisplayedImages] = useState(35);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredGameData, setFilteredGameData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState([]);
  const [gameCounts, setGameCounts] = useState({});
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [sortOption, setSortOption] = useState('Recommended');
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://raw.githubusercontent.com/blancos13/games32/refs/heads/main/games-cache.json");
        const data = await response.json();
        
        setGameData(data);
        setFilteredGameData(data);

        const uniqueProviders = [...new Set(data.map(game => game.provider_name))];
        setProviders(uniqueProviders);

        const counts = uniqueProviders.reduce((acc, provider) => {
          acc[provider] = data.filter(game => game.provider_name === provider).length;
          return acc;
        }, {});
        setGameCounts(counts);

        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching game data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const debouncedSearch = useCallback(
    debounce((query, selectedProviders, gameData) => {
      let filteredData = gameData.filter(game =>
        game.name.toLowerCase().includes(query.toLowerCase())
      );

      if (selectedProviders.length > 0) {
        filteredData = filteredData.filter(game => selectedProviders.includes(game.provider_name));
      }

      switch (sortOption) {
        case 'Newest release':
          filteredData.sort((a, b) => new Date(b.last_updated) - new Date(a.last_updated));
          break;
        case 'Alphabetical A-Z':
          filteredData.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'Alphabetical Z-A':
          filteredData.sort((a, b) => b.name.localeCompare(a.name));
          break;
        default:
          break;
      }

      setFilteredGameData(filteredData);
    }, 300),
    [sortOption]
  );

  useEffect(() => {
    debouncedSearch(searchQuery, selectedProviders, gameData);
  }, [searchQuery, selectedProviders, gameData, debouncedSearch, sortOption]);

  const handleLoadMore = () => {
    setDisplayedImages(displayedImages + 35);
  };

  return (
    <>
      {loading ? (
        <Preloader />
      ) : (
        <div className={classes.root}>
          <div className={classes.container}>
            <div className={classes.titleContainer}>
              <Buttons
                className={classes.backButton}
                onClick={() => history.goBack()}
              >
                Back
              </Buttons>
              <h1 className={classes.title}>Slots</h1>
            </div>
            <div className={classes.topControls}>
              <div className={classes.searchContainer}>
                <CustomInput
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <CustomDropdown
                  options={providers}
                  value={selectedProviders}
                  onChange={setSelectedProviders}
                  gameCounts={gameCounts}
                />
                <CustomSelect
                  options={['Recommended', 'Newest release', 'Alphabetical A-Z', 'Alphabetical Z-A']}
                  value={sortOption}
                  onChange={setSortOption}
                />
              </div>
            </div>
            <div className={classes.gridContainer}>
              {filteredGameData.slice(0, displayedImages).map((game, index) => (
                <Link to={`/slots/${game.gameId}`} key={index} className={classes.gridItem}>
                  <GameImage game={game} />
                </Link>
              ))}
            </div>
            {displayedImages < filteredGameData.length && (
              <motion.div
                className={classes.loadMoreContainer}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  type="primary"
                  style={{
                    backgroundColor: 'hsl(215, 75%, 50%)',
                    borderColor: 'hsl(215, 75%, 50%)',
                  }}
                  className={classes.loadMoreButton}
                  onClick={handleLoadMore}
                >
                  Load More
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

Slots.propTypes = {
  user: PropTypes.object,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, { logout })(Slots);
