import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CRISP_WEBSITE_ID, CRISP_THEME } from '../config/crisp';

const CrispChat = ({ isAuthenticated, user }) => {
  useEffect(() => {
    // Initialize Crisp chat
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = "9cdb9409-66cd-47de-b861-11b9cb7a7cf3";
    
    // Load Crisp script
    (function() {
      const d = document;
      const s = d.createElement('script');
      s.src = 'https://client.crisp.chat/l.js';
      s.async = 1;
      d.getElementsByTagName('head')[0].appendChild(s);
    })();

    // Function to set up Crisp event handlers
    const setupCrispEvents = () => {
      // Check if Crisp is loaded
      if (window.$crisp && window.$crisp.is) {
        // When chat is opened
        window.$crisp.push(["on", "chat:opened", () => {
          console.log("Crisp chat opened");
        }]);

        // When chat is closed
        window.$crisp.push(["on", "chat:closed", () => {
          console.log("Crisp chat closed");
        }]);

        // When a message is sent by the user
        window.$crisp.push(["on", "message:sent", (message) => {
          console.log("Message sent:", message);
        }]);

        // When a message is received from an operator
        window.$crisp.push(["on", "message:received", (message) => {
          console.log("Message received:", message);
        }]);
      }
    };

    // Set up event handlers when Crisp is ready
    window.$crisp.push(["on", "session:loaded", setupCrispEvents]);

    // Set user information if authenticated
    if (isAuthenticated && user) {
      window.$crisp.push(["set", "user:email", user.email || ""]);
      window.$crisp.push(["set", "user:nickname", user.username || ""]);
      
      // You can also set custom user data
      window.$crisp.push(["set", "session:data", [
        ["userId", user._id || ""],
        ["balance", user.wallet ? user.wallet.balance : "0"],
        ["registeredAt", user.createdAt || ""]
      ]]);
    }

    // Apply theme configuration
    window.$crisp.push(["set", "website:name", CRISP_THEME.websiteName]);
    window.$crisp.push(["set", "chat:theme", CRISP_THEME.colorTheme]);
    window.$crisp.push(["set", "chat:position", CRISP_THEME.position]);
    window.$crisp.push(["set", "chat:locale", CRISP_THEME.locale]);

    // Hide the crisp chat on mobile devices initially
    if (window.innerWidth < 768) {
      window.$crisp.push(["do", "chat:hide"]);
    }

    return () => {
      // Cleanup if needed
      // Note: There's no official way to completely remove Crisp once loaded
    };
  }, [isAuthenticated, user]);

  // Helper functions to expose Crisp functionality
  const openChat = () => {
    if (window.$crisp) {
      window.$crisp.push(["do", "chat:open"]);
    }
  };

  const closeChat = () => {
    if (window.$crisp) {
      window.$crisp.push(["do", "chat:close"]);
    }
  };

  const showChat = () => {
    if (window.$crisp) {
      window.$crisp.push(["do", "chat:show"]);
    }
  };

  const hideChat = () => {
    if (window.$crisp) {
      window.$crisp.push(["do", "chat:hide"]);
    }
  };

  // Expose these methods globally for use in other components
  React.useEffect(() => {
    window.crispHelpers = {
      openChat,
      closeChat,
      showChat,
      hideChat
    };
    
    return () => {
      delete window.crispHelpers;
    };
  }, []);

  return null; // This component doesn't render anything
};

CrispChat.propTypes = {
  isAuthenticated: PropTypes.bool,
  user: PropTypes.object
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user
});

export default connect(mapStateToProps)(CrispChat); 