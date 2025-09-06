import React, { Fragment, useState } from "react";
import Moment from 'react-moment';
import { makeStyles } from "@material-ui/core";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import { chatSocket } from "../../services/websocket.service";
import { useHistory } from 'react-router-dom';

import bronzeIcon from "../../assets/rank/bronze.svg";
import silverIcon from "../../assets/rank/silver.svg";
import goldIcon from "../../assets/rank/gold.svg";
import platinumIcon from "../../assets/rank/platinum.svg";
import emeraldIcon from "../../assets/rank/emerald.svg";
import rubyIcon from "../../assets/rank/ruby.svg";
import diamondIcon from "../../assets/rank/diamond.svg";

import PropTypes from "prop-types";
import { connect } from "react-redux";

// MUI Components
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";

import TipModal from "../modals/user/TipModal";

import Kappa from "../../assets/emoji/kappa.png";
import Kek from "../../assets/emoji/kek.png";
import Stonks from "../../assets/emoji/stonks.png";
import Yes from "../../assets/emoji/yes.png";
import No from "../../assets/emoji/no.png";
import Stfu from "../../assets/emoji/stfu.png";
import Knife from "../../assets/emoji/knife.png";
import Chill from "../../assets/emoji/chill.png";
import Fax from "../../assets/emoji/fax.png";
import Cap from "../../assets/emoji/cap.png";
import Bruh from "../../assets/emoji/bruh.png";
import Comrade from "../../assets/emoji/comrade.png";
import Tate from "../../assets/emoji/andrewtate.png";
import BTC from "../../assets/emoji/bitcoin.png";
import Damn from "../../assets/emoji/damn.png";
import Pray from "../../assets/emoji/pray.png";
import Sus from "../../assets/emoji/sus.png";
import Sadge from "../../assets/emoji/sadge.png";
import Tom from "../../assets/emoji/tom.png";
import Yikes from "../../assets/emoji/yikes.png";
import Angry from "../../assets/emoji/angry.png";
import Sad from "../../assets/emoji/sad.png";
import Cry from "../../assets/emoji/pepehands.png";
import Wtf from "../../assets/emoji/wtf.png";
import Swag from "../../assets/emoji/swag.png";
import Fuck from "../../assets/emoji/fuck.png";
import Pepebusiness from "../../assets/emoji/pepebusiness.png";
import Yey from "../../assets/emoji/Yey.png";
import Clown from "../../assets/emoji/clown.png";
import Rip from "../../assets/emoji/rip.png";
import Pepe from "../../assets/emoji/pepe.png";
import Monkas from "../../assets/emoji/monkaS.png";

import Developer from "../../assets/developer.png";
import Highroller from "../../assets/highroller.png";
import Whale from "../../assets/whale.png";

import Profile from "../modals/user/ProfileModal";

import Emoji from './Emoji';

import notifySound from "../../assets/sounds/notification.mp3";
const notifyAudio = new Audio(notifySound);


const useStyles = makeStyles({
  content: {
    width: "100%",
    lineHeight: "1.25rem",
    color: "#C0C1DE",
    fontSize: "13px",
    display: "block",
    fontStyle: "normal",
    whiteSpace: "normal",
    wordWrap: "break-word",
    hyphens: "auto",
    display: "flex",
    flexDirection: "column"
  },
  avatar: {
    width: 19,
    height: 19,
    padding: "0.08rem",
    alignContent: "center",
    borderRadius: "0.25rem",
    cursor: "pointer",
  },
  chatbox: {
    
    display: "flex",
    fontFamily: "Poppins",
    borderRadius: "0.5em",
    maxWidth: "340px",
    // backgroundColor: "#101123",
    marginBottom: "0.5rem",
    padding: "0.25rem 0.5rem",
    "& .message": {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      fontFamily: "Poppins",
      fontSize: 11,
      gap: "0.5rem"
    },
    "& .username": {
      color: "#fff",
      fontFamily: "Poppins",
      position: "relative",
      fontSize: ".875rem",
      fontStyle: "normal",
      fontWeight: 500,
      lineHeight: "1.25rem",
      display: "flex",
      alignItems: "center",
      cursor: "pointer"
    },
    "& .username2": {
      color: "#9E9FBD",
      fontFamily: "Poppins",
      fontWeight: 500,
      letterSpacing: ".1em",
      position: "relative",
      fontSize: "9.6px",
    },
    "& .developer": {
      opacity: 1,
      marginLeft: "5px"
    },
    "& .whale": {
      marginLeft: "5px"
    },
    "& .highroller": {
      marginLeft: "5px"
    },
    "& .user": {
      background: "#31363c",
      borderRadius: "2.5px",
      fontSize: "9.4px",
      marginRight: 10,
      padding: "5px 4.5px",
      color: "#fff",
      fontFamily: "Poppins",
      fontWeight: 500,
      letterSpacing: ".15em",
      marginTop: "-4px",
    },
    "& .userlevel": {
      padding: "5px 4.5px",
      marginRight: "8px",
      color: "#ffffff",
      fontFamily: "Poppins",
      fontWeight: 500,
      letterSpacing: ".15em",
      marginTop: "-4px",
      borderRadius: "4px",
      fontSize: "9px",
    },
    "& .bronze": {
      background: "#C27C0E",
      borderRadius: "2.5px",
      fontSize: "9.4px",
      marginRight: 10,
      padding: "5px 5.1px",
      color: "#fff",
      fontFamily: "Poppins",
      fontWeight: 500,
      letterSpacing: ".15em",
      marginTop: "-4px",
    },
    "& .silver": {
      background: "#95A5A6",
      borderRadius: "2.5px",
      fontSize: "9.4px",
      marginRight: 10,
      padding: "5px 5.1px",
      color: "#fff",
      fontFamily: "Poppins",
      fontWeight: 500,
      letterSpacing: ".15em",
      marginTop: "-4px",
    },
    "& .gold": {
      background: "#b99309",
      borderRadius: "2.5px",
      fontSize: "9.4px",
      marginRight: 10,
      padding: "5px 5.1px",
      color: "#fff",
      fontFamily: "Poppins",
      fontWeight: 500,
      letterSpacing: ".15em",
      marginTop: "-4px",
    },
    "& .diamond": {
      background: "#3498DB",
      borderRadius: "2.5px",
      fontSize: "9.4px",
      marginRight: 10,
      padding: "5px 5.1px",
      color: "#fff",
      fontFamily: "Poppins",
      fontWeight: 500,
      letterSpacing: ".15em",
      marginTop: "-4px",
    },
  },
  gif: {
    width: "100%",
    borderRadius: 5,
    marginTop: 5,
  },
  contextMenu: {
    background: "#212529",
    border: "1px solid #212529",
    color: "#fff",
    fontFamily: "Poppins",
    fontWeight: 500,
    letterSpacing: ".1em",
    padding: "1rem 0 0 0",
    zIndex: "100",
  },
  contextMenuItem: {
    cursor: "pointer",
    color: "white",
    padding: ".7rem 1.5rem",
    transition: "all .3s ease",
    // borderTop: "1px solid #2d334a42",
    "&:hover": {
      color: "#737990",
    },
  },
});

const Message = ({ rank, message, isAuthenticated, isLoading, user }) => {
  // Declare state
  const classes = useStyles();
  const history = useHistory();

  const emotes = [
    { word: "Kappa", src: `${Kappa}`, alt: "Kappa" },
    { word: "Kek", src: `${Kek}`, alt: "Kek" },
    { word: "Stonks", src: `${Stonks}`, alt: "Stonks" },
    { word: "Yes", src: `${Yes}`, alt: "Yes" },
    { word: "No", src: `${No}`, alt: "Yes" },
    { word: "Stfu", src: `${Stfu}`, alt: "Yes" },
    { word: "Knife", src: `${Knife}`, alt: "Knife" },
    { word: "Chill", src: `${Chill}`, alt: "Chill" },
    { word: "Fax", src: `${Fax}`, alt: "Fax" },
    { word: "Cap", src: `${Cap}`, alt: "Cap" },
    { word: "Bruh", src: `${Bruh}`, alt: "Bruh" },
    { word: "Comrade", src: `${Comrade}`, alt: "Comrade" },
    { word: "Tate", src: `${Tate}`, alt: "Tate" },
    { word: "BTC", src: `${BTC}`, alt: "BTC" },
    { word: "Damn", src: `${Damn}`, alt: "Damn" },
    { word: "Pray", src: `${Pray}`, alt: "Pray" },
    { word: "Sus", src: `${Sus}`, alt: "Sus" },
    { word: "Sadge", src: `${Sadge}`, alt: "Sadge" },
    { word: "Tom", src: `${Tom}`, alt: "Tom" },
    { word: "Yikes", src: `${Yikes}`, alt: "Yikes" },
    { word: "Angry", src: `${Angry}`, alt: "Angry" },
    { word: "Sad", src: `${Sad}`, alt: "Sad" },
    { word: "WTF", src: `${Wtf}`, alt: "WTF" },
    { word: "Swag", src: `${Swag}`, alt: "Swag" },
    { word: "Fuck", src: `${Fuck}`, alt: "Fuck" },
    { word: "Clown", src: `${Clown}`, alt: "Clown" },
    { word: "Yey", src: `${Yey}`, alt: "Yey" },
    { word: "Pepe", src: `${Pepe}`, alt: "Pepe" },
    { word: "MonkaS", src: `${Monkas}`, alt: "MonkaS" },
    { word: "Rip", src: `${Rip}`, alt: "Rip" },
    { word: "Cry", src: `${Cry}`, alt: "Cry" },
    { word: "Pepebusiness", src: `${Pepebusiness}`, alt: "Pepebusiness" },
  ];

  const [modalVisible, setModalVisible] = useState(false);
  const [profile, setProfile] = useState(false);

  const openTipUserModal = () => {
    setModalVisible(true);
  }

  // MenuItem onClick event handler
  const onContextClick = (event, action, props) => {
    switch (action) {
      case "mute":
        return chatSocket.emit(
          "send-chat-message",
          `.mute-user ${props.userId}`
        );
      case "ban":
        return chatSocket.emit(
          "send-chat-message",
          `.ban-user ${props.userId}`
        );
      case "remove-message":
        return chatSocket.emit(
          "send-chat-message",
          `.remove-message ${props.msgId}`
        );
      default:
        break;
    }
  };

  const handleLeftClick = e => {
    openTipUserModal();
  };

  // Define base64 images or URLs for avatars based on level ranges
const LEVEL_IMAGES = {
  1: bronzeIcon,
  15: silverIcon,
  29: goldIcon,
  42: platinumIcon,
  56: emeraldIcon,
  70: rubyIcon,
  83: diamondIcon,
  97: "https://shuffle.com/images/vip/dragon.svg",

  // Add more ranges and images as needed
};

const getAvatarSrc = (level) => {
  if (level >= 1 && level <= 25) {
    return LEVEL_IMAGES[1];
  } else if (level >= 26 && level <= 50) {
    return LEVEL_IMAGES[15];
  } else if (level >=  51&& level <= 75) {
    return LEVEL_IMAGES[29];
  } else if (level >= 76 && level <= 100) {
    return LEVEL_IMAGES[42];
  } else if (level >= 101 && level <= 125) {
    return LEVEL_IMAGES[56];
  } else if (level >= 126 && level <= 150) {
    return LEVEL_IMAGES[70];
  } else if (level >= 151 && level <= 175) {
    return LEVEL_IMAGES[83];
  } else if (level >= 176 && level <= 200) {
    return LEVEL_IMAGES[97];

  }
  // Return a default avatar if no image is found for the level
  return message.user.avatar;
};

  // Move the battle link check inside a try-catch
  const isBattleLink = /https:\/\/betfun.gg\/battles\/([a-f0-9]+)$/i;
  let match = null;
  try {
    match = message?.content?.match(isBattleLink) || null;
  } catch (error) {
    console.error('Error matching battle link:', error);
  }

  return (
    <Fragment>
      <TipModal
        handleClose={() => setModalVisible(!modalVisible)}
        open={modalVisible}
        userId={message.user.id}
        userName={message.user.username}
        userAvatar={message.user.avatar}
      />
      <Profile 
        handleClose={() => setProfile(!profile)}
        open={profile}
        userid={message.user.id}
      />
      {
        rank >= 5 ? (
          <Fragment>
            <ContextMenu className={classes.contextMenu} id={message.msgId}>
              <p style={{ marginTop: 0, paddingLeft: "1.5rem", color: "#4F79FD" }}>
                CONTROLS:
              </p>
              <MenuItem
                className={classes.contextMenuItem}
                onClick={e =>
                  onContextClick(e, "remove-message", {
                    msgId: message.msgId,
                  })
                }
              >
                <i className="fas fa-trash-alt" /> DELETE MESSAGE
              </MenuItem>
              <MenuItem
                className={classes.contextMenuItem}
                onClick={e => onContextClick(e, "mute", { userId: message.user.id })}
              >
                <i className="fas fa-microphone-slash Blue" /> MUTE USER
              </MenuItem>
              <MenuItem
                className={classes.contextMenuItem}
                onClick={e =>
                  onContextClick(e, "ban", {
                    userId: message.user.id,
                  })
                }
              >
                <i className="fas fa-gavel Red" /> BAN USER
              </MenuItem>
            </ContextMenu>
          </Fragment>
        ) : (
          <Fragment>
          </Fragment>
        )
      }
      <ContextMenuTrigger id={message.msgId}>
        <Box 
          className={classes.chatbox} 
          // style={{ background: message.content.toLowerCase().includes("@" + user?.username) ? "#2871FF" : "101123" }} 
        >
          <div className="message">
           <Avatar
            src={getAvatarSrc(message.user.level.name)}
                          className={classes.avatar}
              onClick={() => setProfile(!profile)}
            />
            <div className={classes.content}>
              <span
                className="username"
                style={{
                  color: message.user.rank === 5 ? "#FF2121" : message.user.rank === 4 ? "#00A0FF" : message.user.rank === 3 ? "#FCBF2D" : "#fff",
                  display: 'flex',
                  alignItems: 'center'
                }}
                onClick={() => setProfile(!profile)}
              >
              </span>

    <span style={{ color: "white"}}>
      <span
        style={{

          color: "#fff",
          fontFamily: "Poppins",
          position: "relative",
          fontSize: ".875rem",
          fontStyle: "normal",
          fontWeight: 600,
          lineHeight: "1.25rem",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={() => setProfile(!profile)} // Toggle profile visibility
      >
        {message.user.username}
      </span>
      :&nbsp;
      <span style={{ color: "#fff", fontWeight: 500 }}>
        {message.content}
      </span>
    </span>



                
            </div>
          </div>
        </Box>
      </ContextMenuTrigger>
    </Fragment>
  );
};

Message.propTypes = {
  isAuthenticated: PropTypes.bool,
  isLoading: PropTypes.bool,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading,
  user: state.auth.user,
});

export default connect(mapStateToProps, {})(Message);
