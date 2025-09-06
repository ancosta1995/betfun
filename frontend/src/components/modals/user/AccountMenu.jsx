import React, { useState, useEffect, useRef } from 'react';
import { styled } from '@material-ui/core/styles';
import { FaWallet, FaCrown, FaCode, FaUserFriends, FaCog, FaLifeRing, FaSignOutAlt, FaAngleRight } from 'react-icons/fa';
import { AiOutlineTransaction } from 'react-icons/ai';
import { Box, Typography, Divider as MuiDivider, IconButton } from '@material-ui/core';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserVipData } from "../../../services/api.service";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logout } from "../../../actions/auth";

// Main Component
function AvatarWithDropdown(props) {
  const { isAuthenticated, isLoading, user, logout } = props;

  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(0);
  const [vipData, setVipData] = useState(null);
  const [currentMajorLevelIndex, setCurrentMajorLevelIndex] = useState(null);
  const [previousTotal, setPreviousTotal] = useState(0);
  const [currentTotal, setCurrentTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserVipData();
        setVipData(data);
        setCurrentMajorLevelIndex(
          data.majorLevelNames.findIndex((levelName) => levelName === data.currentLevel.levelName)
        );
        let lastObject = data.allLevels[data.allLevels.length - 1];
        let wagerNeededLastLevel = lastObject.wagerNeeded;
        setCompleted(data.wager >= wagerNeededLastLevel ? 1 : 0);
        setLoading(false);
      } catch (error) {
        console.log("Error loading VIP data:", error);
      }
    };

    setPreviousTotal(currentTotal);
    setCurrentTotal(user?.wallet ?? 0.0);

    const timer = setTimeout(fetchData, 1000);
    return () => clearTimeout(timer);
  }, [user?.wallet]);

  const handleMenuToggle = () => setMenuOpen(prev => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      style={{ position: 'relative', width: "35px", marginLeft: "8px" }}
      ref={dropdownRef}
    >
      <motion.div 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleMenuToggle}
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          cursor: 'pointer'
        }}
      >
        <motion.div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: '1px solid rgba(41, 42, 68, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#1a1b33',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.15s ease'
          }}
        >
          <IconButton color="inherit" style={{ padding: 0 }}>
            <motion.svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              width="16px" 
              height="16px"
              className="text-base text-neutral"
              whileHover={{ scale: 1.1 }}
            >
              <path fill="currentColor" d="M10 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8m-1.4 1.5C5.5 11.5 3 14 3 17.1c0 .5.4.9 1 .9h12c.6 0 1-.4 1-1 0-3-2.5-5.5-5.6-5.5z"></path>
            </motion.svg>
          </IconButton>
        </motion.div>
      </motion.div>
      <AnimatePresence>
        {menuOpen && <AccountMenu open={menuOpen} vipData={vipData} logout={props.logout} />}
      </AnimatePresence>
    </div>
  );
}

// Styled components with modern aesthetics
const AccountModalContainer = styled(motion.div)(({ theme }) => ({
  backgroundColor: 'rgba(10, 11, 28, 0.95)',
  backdropFilter: 'blur(10px)',
  color: '#fff',
  width: '250px',
  padding: '15px',
  borderRadius: '12px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
  border: '1px solid rgba(26, 27, 51, 0.6)',
  fontFamily: "'Inter', sans-serif",
  position: 'absolute',
  zIndex: 1000,
  top: '50px',
  right: '1px',
  transform: 'translateY(10px)',
  opacity: 0,
  transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)'
}));

const Divider = styled(MuiDivider)({
  height: '1px',
  background: 'linear-gradient(90deg, rgba(26, 27, 51, 0) 0%, rgba(26, 27, 51, 0.8) 50%, rgba(26, 27, 51, 0) 100%)',
  margin: '10px 0'
});

const AccountHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 0',
  borderBottom: '1px solid rgba(26, 27, 51, 0.6)'
});

const AccountName = styled(Typography)({
  fontSize: '14px',
  fontWeight: '600',
  background: 'linear-gradient(45deg, #fff, #a8b1ff)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent'
});

const MenuItemsContainer = styled(Box)({
  paddingTop: '10px'
});

const LevelBox = styled(motion.div)({
  background: 'linear-gradient(135deg, #1a2b6d, #2871FF)',
  color: '#fff',
  fontWeight: '600',
  fontSize: '10px',
  borderRadius: '6px',
  padding: '3px 8px',
  boxShadow: '0 2px 8px rgba(40, 113, 255, 0.2)'
});

const MenuItem = styled(motion.div)({
  display: 'flex',
  alignItems: 'center',
  padding: '8px 12px',
  cursor: 'pointer',
  color: '#fff',
  borderRadius: '8px',
  fontSize: '13px',
  transition: 'all 0.15s ease',
  '&:hover': {
    background: 'linear-gradient(90deg, rgba(26, 27, 51, 0.6), rgba(26, 27, 51, 0.2))',
    transform: 'translateX(5px)'
  }
});

const IconWrapper = styled(Box)({
  marginRight: '10px',
  display: 'flex',
  alignItems: 'center',
  color: '#a8b1ff',
  fontSize: '14px'
});

const ProgressBarContainer = styled(Box)({
  width: '100%',
  marginTop: '8px',
  borderRadius: '6px',
  background: 'rgba(36, 38, 69, 0.5)',
  height: '6px',
  overflow: 'hidden'
});

const ProgressBar = styled(motion.div)(({ progress }) => ({
  height: '100%',
  width: `${progress}%`,
  background: 'linear-gradient(90deg, #2871FF, #6d9fff)',
  borderRadius: '6px',
  transition: 'width 0.25s ease-out'
}));

const ProgressSection = styled(Box)({
  margin: '10px 0',
  padding: '8px',
  borderRadius: '10px',
  background: 'rgba(12, 19, 46, 0.5)',
  backdropFilter: 'blur(5px)',
  transition: '0.15s ease',
  '&:hover': {
    background: 'rgba(12, 19, 46, 0.7)'
  }
});

const AccountDetails = styled(Box)({
  fontSize: '12px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  color: '#a8b1ff',
  fontWeight: '500'
});

const AccountMenu = ({ open, vipData, logout }) => {
  if (!vipData) return null;

  const progress = ((vipData.wager - vipData.currentLevel.wagerNeeded) / 
    (vipData.nextLevel.wagerNeeded - vipData.currentLevel.wagerNeeded) * 100).toFixed(2);

  const menuVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.15, ease: "easeOut" } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.1 } }
  };

  return (
    <AccountModalContainer
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={menuVariants}
    >
      <AccountHeader>
        <AccountName>{vipData?.username || "User"}</AccountName>
        <LevelBox whileHover={{ scale: 1.05 }}>
          {`${vipData.currentLevel.levelName} Level`}
        </LevelBox>
      </AccountHeader>

      <ProgressSection>
        <AccountDetails>
          <span>{`${progress}%`}</span>
          <span>{vipData.currentLevel.levelName} <FaAngleRight size={10} /></span>
        </AccountDetails>

        <ProgressBarContainer>
          <ProgressBar progress={progress} />
        </ProgressBarContainer>
      </ProgressSection>

      <Divider />

      <MenuItemsContainer>
        {[
          { icon: <FaWallet size={14} />, text: "Wallet" },
          { icon: <FaCrown size={14} />, text: "VIP Club" },
          { icon: <FaCode size={14} />, text: "Redeem Code" },
          { icon: <FaUserFriends size={14} />, text: "Affiliate" },
          { icon: <AiOutlineTransaction size={14} />, text: "Transactions" }
        ].map((item, index) => (
          <MenuItem
            key={index}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <IconWrapper>{item.icon}</IconWrapper>
            {item.text}
          </MenuItem>
        ))}

        <Divider />

        {[
          { icon: <FaCog size={14} />, text: "Settings" },
          { icon: <FaLifeRing size={14} />, text: "Live Support" }
        ].map((item, index) => (
          <MenuItem
            key={index}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <IconWrapper>{item.icon}</IconWrapper>
            {item.text}
          </MenuItem>
        ))}

        <Divider />

        <MenuItem
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.98 }}
          style={{ color: '#ff4d4d' }}
          onClick={() => logout()}
        >
          <IconWrapper style={{ color: '#ff4d4d' }}><FaSignOutAlt size={14} /></IconWrapper>
          Log Out
        </MenuItem>
      </MenuItemsContainer>
    </AccountModalContainer>
  );
};

AvatarWithDropdown.propTypes = {
  isAuthenticated: PropTypes.bool,
  isLoading: PropTypes.bool,
  user: PropTypes.object,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading,
  user: state.auth.user,
});

export default connect(mapStateToProps, { logout })(AvatarWithDropdown);
