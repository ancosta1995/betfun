import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Typography, Button, Modal, Input } from 'antd';
import { useSpring, animated } from 'react-spring';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { makeStyles } from "@material-ui/core/styles";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import TypographyMUI from '@material-ui/core/Typography';
import Big from 'big.js'; // Import Big.js

const { Text } = Typography;

const useStyles = makeStyles((theme) => ({
  container: {
    height: '100vh',
    color: '#8b4513',
    textAlign: 'center',
    padding: '50px',
  },
  button: {
    userSelect: 'none',
    padding: '12px 24px',
    backgroundColor: '#32cd32',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginRight: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
  },
  harvestButton: {
    padding: '12px 24px',
    backgroundColor: '#32cd32',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginRight: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
  },
  upgradeButton: {
    backgroundColor: '#ffd700',
    color: '#8b4513',
    marginRight: '10px',
  },
  inventoryButton: {
    userSelect: 'none',
    padding: '8px 16px',
    backgroundColor: '#4682b4',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  card: {
    backgroundColor: '#101123',
    color: '#fff',
    marginBottom: '16px',
  },
  cardHeader: {
    display: "flex",
    boxShadow: "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
    alignItems: "center",
    paddingTop: "1em",
    paddingLeft: "1.5em",
    paddingRight: "1em",
    paddingBottom: "1em",
    fontFamily: "Poppins",
    backgroundColor: "#0a0b1c",
    justifyContent: "space-between",
    width: "100%",
    height: '40px',
  },
  cardTitle: {
    padding: '4px 16px',
    fontSize: '16px',
  },
  monospaceText: {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
    fontSize: '2rem', // Adjust font size as needed
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 'auto',
  },

  spinnerImage: {
    cursor: 'pointer',
    maxWidth: '260px',
    height: 'auto',
    display: 'block',
    margin: 'auto',
  },


}));

const App = () => {
  const classes = useStyles();
  const [coins, setCoins] = useState(Big(100));
  const [minedCoins, setMinedCoins] = useState(Big(0.0090000000));
  const [hashRate, setHashRate] = useState(Big(1));
  const [upgradeCost, setUpgradeCost] = useState(Big(50));
  const [dailyEarnings, setDailyEarnings] = useState(Big(0.01));
  const [inventory, setInventory] = useState({
    miner: { count: 0, price: Big(100), dailyEarnings: Big(0.05), image: '/path/to/miner.jpg' },
    drill: { count: 0, price: Big(50), dailyEarnings: Big(0.02), image: '/path/to/drill.jpg' },
    excavator: { count: 0, price: Big(200), dailyEarnings: Big(0.1), image: '/path/to/excavator.jpg' },
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [amountToBuy, setAmountToBuy] = useState('');
  const [animationKey, setAnimationKey] = useState(0);

  const lastClickTime = useRef(0); // Ref to store the timestamp of the last click

  const handleMineCoinsClick = () => {
    const now = Date.now();

    if (now - lastClickTime.current >= 500) { // Check if 1 second has passed
      setAnimationKey(prevKey => prevKey + 1); // Trigger animation effect

      // Your mine coins logic here
      console.log('Mined coins');
      
      lastClickTime.current = now; // Update the last click time
    }
  };


  const handleBuyEquipment = (equipmentType) => {
    setSelectedEquipment(inventory[equipmentType]);
    setShowModal(true);
  };

  const handlePurchase = () => {
    if (selectedEquipment && coins.gte(selectedEquipment.price.times(amountToBuy))) {
      setCoins(coins.minus(selectedEquipment.price.times(amountToBuy)));
      setInventory(prevInventory => ({
        ...prevInventory,
        [selectedEquipment.name]: {
          ...selectedEquipment,
          count: selectedEquipment.count + parseInt(amountToBuy, 10),
        },
      }));
      setShowModal(false);
    }
  };

  useEffect(() => {
    const updateEarnings = () => {
      const equipmentEarnings = Object.values(inventory).reduce((total, equipment) => {
        return total.plus(Big(equipment.count).times(equipment.dailyEarnings));
      }, Big(0));

      setDailyEarnings(dailyEarnings.plus(equipmentEarnings));
    };

    const earningsInterval = setInterval(updateEarnings, 1000);

    return () => clearInterval(earningsInterval);
  }, [inventory]);

  useEffect(() => {
    const miningInterval = setInterval(() => {
      setMinedCoins(prevCoins => prevCoins.plus(hashRate.times(0.000000001))); // Adjusted for gradual increase
    }, 5); // Update every 1 second

    return () => clearInterval(miningInterval);
  }, [hashRate]);

  const mineCoins = () => {
    setCoins(coins.plus(minedCoins));
    setMinedCoins(Big(0));
  };

  const upgradeMining = () => {
    if (coins.gte(upgradeCost)) {
      setHashRate(hashRate.times(1.5));
      setCoins(coins.minus(upgradeCost));
      setUpgradeCost(upgradeCost.times(1.5));
    }
  };

  const buyEquipment = (equipmentType) => {
    const equipment = inventory[equipmentType];
    if (coins.gte(equipment.price)) {
      setCoins(coins.minus(equipment.price));
      setInventory(prevInventory => ({
        ...prevInventory,
        [equipmentType]: {
          ...equipment,
          count: equipment.count + 1,
        },
      }));
    }
  };

  const minedCoinsSpring = useSpring({
    number: minedCoins.toNumber(),
    from: { number: 0 },
    config: { tension: 200, friction: 20 }
  });

  return (
    <div className={classes.container}>
      {/* Status Cards */}
      <Row gutter={16} justify="center">
        <Col span={24} md={12} lg={6}>
          <motion.div 
            initial={{ scale: 0.9 }} 
            animate={{ scale: 1 }} 
            transition={{ duration: 0.3 }} 
          >
            <Card className={classes.card}>
              <CardHeader
                title="Coins"
                classes={{ root: classes.cardHeader }}
                titleTypographyProps={{ variant: 'subtitle1' }}
              />
              <CardContent>
            <TypographyMUI
              variant="h5"
              className={classes.monospaceText}
            >
                  <CountUp start={0} end={coins.toNumber()} duration={0.5} separator="," />
                </TypographyMUI>
              </CardContent>
            </Card>
          </motion.div>
        </Col>
        <Col span={24} md={12} lg={6}>
      <motion.div 
        initial={{ scale: 0.9 }} 
        animate={{ scale: 1 }} 
        transition={{ duration: 0.3 }} 
      >
        <Card className={classes.card}>
          <CardHeader
            title="Ton Mined"
            classes={{ root: classes.cardHeader, title: classes.cardTitle }}
          />
          <CardContent>
            <TypographyMUI
              variant="h5"
              className={classes.monospaceText}
            >
              <animated.span>
                {minedCoinsSpring.number.interpolate(n => n.toFixed(10))}
              </animated.span>
            </TypographyMUI>
          </CardContent>
        </Card>
      </motion.div>
    </Col>
        <Col span={24} md={12} lg={6}>
          <motion.div 
            initial={{ scale: 0.9 }} 
            animate={{ scale: 1 }} 
            transition={{ duration: 0.3 }} 
          >
            <Card className={classes.card} >
              <CardHeader 
                title="Hash Rate" 
                classes={{ root: classes.cardHeader, title: classes.cardTitle }}
              />
              <CardContent>
              <TypographyMUI
              variant="h5"
              className={classes.monospaceText}
            >
{hashRate.toFixed(2)} GH/s</TypographyMUI>
              </CardContent>
            </Card>
          </motion.div>
        </Col>
        <Col span={24} md={12} lg={6}>
          <motion.div 
            initial={{ scale: 0.9 }} 
            animate={{ scale: 1 }} 
            transition={{ duration: 0.3 }} 
          >
            <Card className={classes.card} >
              <CardHeader 
                title="Upgrade Cost" 
                classes={{ root: classes.cardHeader, title: classes.cardTitle }}
              />
              <CardContent>
              <TypographyMUI
              variant="h5"
              className={classes.monospaceText}
            >

                  <CountUp start={0} end={upgradeCost.toNumber()} duration={0.5} separator="," />
                </TypographyMUI>
              </CardContent>
            </Card>
          </motion.div>
        </Col>
      </Row>
      
      {/* Buttons */}
      <div>
      <motion.img
        key={animationKey} // Change key to trigger re-render
        src="https://miniapp.tonix.pro/images/spinner.webp"
        alt="Mine Coins"
        className={classes.spinnerImage}
        onClick={handleMineCoinsClick}
        animate={{ rotate: [0, 360], scale: [1, 0.85, 1] }}
        transition={{ 
          rotate: { duration: 0.5, ease: "easeInOut", repeat: Infinity },
          scale: { duration: 0.5, ease: "easeInOut", repeat: Infinity }
        }}
      />

        <Button className={classes.upgradeButton} onClick={upgradeMining}>Upgrade Mining</Button>
      </div>

      {/* Inventory */}
      <Row gutter={16} justify="center">
        {Object.keys(inventory).map(equipmentType => (
          <Col key={equipmentType} span={24} md={12} lg={6}>
            <Card className={classes.card} >
              <CardHeader 
                title={equipmentType.charAt(0).toUpperCase() + equipmentType.slice(1)} 
                classes={{ root: classes.cardHeader, title: classes.cardTitle }}
              />
              <CardContent>
                <img src={inventory[equipmentType].image} alt={equipmentType} style={{ width: '100%', height: 'auto' }} />
                <TypographyMUI variant="body1">
                  Price: {inventory[equipmentType].price.toFixed(2)} Coins
                </TypographyMUI>
                <TypographyMUI variant="body1">
                  Daily Earnings: {inventory[equipmentType].dailyEarnings.toFixed(2)} Coins
                </TypographyMUI>
                <Button className={classes.inventoryButton} onClick={() => handleBuyEquipment(equipmentType)}>Buy</Button>
              </CardContent>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal for Buying Equipment */}
      <Modal
        title={`Buy ${selectedEquipment ? selectedEquipment.name : ''}`}
        visible={showModal}
        onOk={handlePurchase}
        onCancel={() => setShowModal(false)}
      >
        <p>Price: {selectedEquipment ? selectedEquipment.price.toFixed(2) : 0} Coins</p>
        <p>Daily Earnings: {selectedEquipment ? selectedEquipment.dailyEarnings.toFixed(2) : 0} Coins</p>
        <p>How many would you like to buy?</p>
        <Input
          type="number"
          value={amountToBuy}
          onChange={(e) => setAmountToBuy(e.target.value)}
          min={1}
        />
      </Modal>
    </div>
  );
};

export default App;
