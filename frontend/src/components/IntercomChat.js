import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { INTERCOM_APP_ID } from '../config/intercom';

const IntercomChat = ({ isAuthenticated, user }) => {
  useEffect(() => {
    // Set up Intercom settings
    window.intercomSettings = { 
      app_id: INTERCOM_APP_ID 
    };
    
    // Add user data if authenticated
    if (isAuthenticated && user) {
      window.intercomSettings.user_id = user._id;
      window.intercomSettings.name = user.username;
      window.intercomSettings.email = user.email;
      window.intercomSettings.created_at = Math.floor(new Date(user.createdAt).getTime() / 1000);
    }
    
    // Initialize Intercom with the standard script
    (function(){
      var w = window;
      var ic = w.Intercom;
      if(typeof ic === "function"){
        ic('reattach_activator');
        ic('update', window.intercomSettings);
      } else {
        var d = document;
        var i = function(){
          i.c(arguments);
        };
        i.q = [];
        i.c = function(args){
          i.q.push(args);
        };
        w.Intercom = i;
        function l(){
          var s = d.createElement('script');
          s.type = 'text/javascript';
          s.async = true;
          s.src = 'https://widget.intercom.io/widget/' + INTERCOM_APP_ID;
          var x = d.getElementsByTagName('script')[0];
          x.parentNode.insertBefore(s, x);
        }
        if(w.attachEvent){
          w.attachEvent('onload', l);
        } else {
          w.addEventListener('load', l, false);
        }
      }
    })();
    
    return () => {
      // Shutdown Intercom when component unmounts
      if (window.Intercom && typeof window.Intercom === 'function') {
        window.Intercom('shutdown');
      }
    };
  }, [isAuthenticated, user]);

  return null; // This component doesn't render anything
};

IntercomChat.propTypes = {
  isAuthenticated: PropTypes.bool,
  user: PropTypes.object
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user
});

export default connect(mapStateToProps)(IntercomChat); 