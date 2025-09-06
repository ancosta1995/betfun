import React, { useState } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import BettingHistory from './BettingHistory'; // Import the BettingHistory component

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};

const TabsExample = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box 
      sx={{
        display: 'flex',
        backgroundColor: 'var(--color-gray800)',
        borderRadius: '.375rem',
        padding: '.375rem .375rem 0',
        gap: '.2rem',
        overflow: 'hidden',
        overflowX: 'auto',
        width: '100%',
      }}
    >
      <Box 
        sx={{ 
          display: 'flex',
          justifyContent: 'space-between',
          gap: '0.625rem',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', gap: '0.375rem' }}>
          <Button
            variant="contained"
            color={value === 0 ? "primary" : "default"}
            style={{
              padding: '0.25rem 0.5rem',
              borderRadius: '.25rem',
              backgroundColor: value === 0 ? 'var(--dark-800)' : 'gray',
              color: 'white',
              transition: 'background-color 0.3s',
            }}
            onClick={() => setValue(0)}
          >
            All Bets
          </Button>
          <Button
            variant="contained"
            color={value === 1 ? "primary" : "default"}
            style={{
              padding: '0.25rem 0.5rem',
              borderRadius: '.25rem',
              backgroundColor: value === 1 ? 'var(--dark-800)' : 'gray',
              color: 'white',
              transition: 'background-color 0.3s',
            }}
            onClick={() => setValue(1)}
          >
            Big Bets
          </Button>
          <Button
            variant="contained"
            color={value === 2 ? "primary" : "default"}
            style={{
              padding: '0.25rem 0.5rem',
              borderRadius: '.25rem',
              backgroundColor: value === 2 ? 'var(--dark-800)' : 'gray',
              color: 'white',
              transition: 'background-color 0.3s',
            }}
            onClick={() => setValue(2)}
          >
            Race
          </Button>
        </div>
      </Box>

      <Box sx={{ width: '100%' }}>
        <TabPanel value={value} index={0}>
          All Bets content goes here.
        </TabPanel>
        <TabPanel value={value} index={1}>
          Big Bets content goes here.
        </TabPanel>
        <TabPanel value={value} index={2}>
          <BettingHistory /> {/* BettingHistory content goes here */}
        </TabPanel>
      </Box>
    </Box>
  );
};

export default TabsExample;
