import React, { useState, useEffect, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { withStyles, makeStyles } from "@material-ui/core/styles";
// import Button from '@material-ui/core/Button';
import Preloader from '../Preloader';
import pragmaticGameData from './games.json';
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

import { Select, Checkbox, ConfigProvider, Input, Button  } from 'antd';

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
    backgroundColor: '#101123',
    borderRadius: '8px',
    overflow: 'hidden',
    textAlign: 'center',
    textDecoration: 'none',
    color: '#fff',
    transition: 'transform 0.3s ease',
    willChange: 'transform', // Optimize rendering
    transform: 'translateZ(0)', // Force hardware acceleration
    backfaceVisibility: 'hidden', // Hide back face
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)', // Improve text rendering
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },

  gameImage: {
    width: '100%',
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
    padding: '2rem 1rem',
    width: "100%",
    height: "100%"
  },
  loadMoreButton: {
    width: "20vh",
    height: "5vh",

    padding: '1rem 1rem',
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
        placeholder="Select an option"
        
        style={{
          height: "2.5rem",
          width: '100%',
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
    const newSelectedOptions = value.includes(option)
      ? value.filter(item => item !== option)
      : [...value, option];
    onChange(newSelectedOptions);
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
  const imageUrl = game.cover 
    ? `http://localhost:3001/${game.cover}` 
    : (game.image || 'path/to/default-image.png');

  return (
    <motion.img 
      src={imageUrl} 
      alt={game.game_name} 
      className={classes.gameImage} 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    />
  );
};




const Originals = ({ user, logout }) => {
  const classes = useStyles();
  const history = useHistory();
  
  const games = [
    {
      id: 1,
      name: "Dice",
      image: "https://qbot.gg/wp-content/uploads/2023/06/7_Dice.png",
      path: "/dice",
      available: true,
    },
    {
      id: 2,
      name: "Limbo",
      image: "https://qbot.gg/wp-content/uploads/2023/06/18_Limbo.png",
      path: "/limbo",
      available: true,
    },
    {
      id: 3,
      name: "Crash",
      image: "https://qbot.gg/wp-content/uploads/2023/06/11_Crash.png",
      path: "/crash",
      available: true,
    },
    {
      id: 4,
      name: "Plinko",
      image: "https://qbot.gg/wp-content/uploads/2023/06/1_Plinko.png",
      path: "/plinko",
      available: false,
    },
    {
      id: 5,
      name: "Mines",
      image: "https://qbot.gg/wp-content/uploads/2023/06/12_Mines.png",
      path: "/mines",
      available: false,
    },
    {
      id: 6,
      name: "Keno",
      image: "https://qbot.gg/wp-content/uploads/2023/06/10_Keno.png",
      path: "/keno",
      available: false,
    },
    {
      id: 7,
      name: "Hilo",
      image: "https://qbot.gg/wp-content/uploads/2023/06/9_hilo.png", // Update with actual image
      path: "/hilo",
      available: false,
    },
    {
      id: 8,
      name: "Roulette",
      image: "https://qbot.gg/wp-content/uploads/2023/06/13_Roulette.png", // Update with actual image
      path: "/roulette",
      available: false,
    }
  ];

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div className={classes.titleContainer}>
          <Buttons
            className={classes.backButton}
            onClick={() => history.goBack()}
          >
            Back
          </Buttons>
          <h1 className={classes.title}>Originals</h1>
        </div>
        <div className={classes.gridContainer}>
          {games.map((game) => (
            <div 
              key={game.id} 
              className={classes.gridItem}
              style={{ opacity: game.available ? 1 : 0.5, cursor: game.available ? 'pointer' : 'not-allowed' }}
              onClick={() => game.available && history.push(game.path)}
            >
              <motion.img 
                src={game.image} 
                alt={game.name} 
                className={classes.gameImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
              <motion.div 
                className={classes.gameFooter}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className={classes.gameTitle}>{game.name}</h3>
                <p className={classes.gameProvider}>
                  {game.available ? 'Available' : 'Coming Soon'}
                </p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

Originals.propTypes = {
  user: PropTypes.object,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, { logout })(Originals);
