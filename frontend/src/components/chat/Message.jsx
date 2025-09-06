import React from "react";
import Moment from 'react-moment';
import { makeStyles } from "@material-ui/core";
import { useHistory } from 'react-router-dom';


// MUI Components
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";

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

import Emoji from './Emoji';

const useStyles = makeStyles({
  content: {
    opacity: .4,
    color: "rgb(156, 163, 175)",
    fontSize: "13px",
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "normal",
    whiteSpace: "normal",
    marginTop: 10,
    marginRight: "20px",
    wordWrap: "break-word",
    hyphens: "auto",
  },
  avatar: {
    width: 35,
    height: 35,
    marginTop: "-5px",
    marginLeft: "20px",
    marginRight: "8px",
    borderRadius: "100%",
  },
  chatbox: {
    display: "flex",
    padding: "20px 0px 20px 0px",
    // borderTop: "1.5px solid #1b1f22",
    fontFamily: "Poppins",
    borderRadius: 0,
    "& .message": {
      display: "flex",
      width: "100%",
      flexDirection: "column",
      justifyContent: "center",
      "& > div": {
        maxWidth: "210px",
      },
    },
    "& .message .username": {
      color: "#e0e0e0",
      fontFamily: "Poppins",
      fontWeight: 600,
      letterSpacing: ".15em",
      position: "relative",
      fontSize: "9.6px",
      margin: "auto",
      fontSize: "13px",
      fontStyle: "normal",
      fontWeight: 600,
      lineHeight: "normal",
      "&:hover": {
        opacity: "0.5",
        cursor: "pointer",
      },
    },
    "& .developer": {
      width: "15px",
      height: "15px",
      position: "absolute",
      marginLeft: "5px"
    },
    "& .whale": {
      width: "15px",
      height: "15px",
      position: "absolute",
      marginLeft: "5px"
    },
    "& .highroller": {
      width: "15px",
      height: "15px",
      position: "absolute",
      marginLeft: "5px"
    },
    "& .user": {
      background: "#31363c",
      borderRadius: "2.5px",
      fontSize: "9.6px",
      marginRight: 10,
      padding: "5px 4.5px",
      color: "#fff",
      fontFamily: "Poppins",
      fontWeight: 500,
      letterSpacing: ".15em",
      marginTop: "-4px",
    },
    "& .userlevel": {
      fontSize: "9px",
      padding: "5px 4.5px",
      marginRight: "8px",
      color: "#ffffff",
      fontFamily: "Poppins",
      fontWeight: 500,
      letterSpacing: ".15em",
      marginTop: "-4px",
      borderRadius: "4px",
    },
    "& .bronze": {
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
      borderRadius: "5.1px",
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
    width: "75%",
    borderRadius: 5,
    marginTop: 5,
  },
});

const Message = ({ message }) => {
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

  return (
    <Box className={classes.chatbox}>    
      <div className="message"> 
        <Avatar
          variant="rounded"
          src={"data:image/png;base64,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"}
          className={classes.avatar}
        />
        <div>
          <div className="username" style={{ color: message.user.rank === 5 ? "#FF2121" : message.user.rank === 4 ? "#00A0FF" : message.user.rank === 3 ? "#FCBF2D" : ""}}>
            {message.user.rank === 5 && <img src={Developer} className="developer" />}
            {message.user.rank === 4 && <img src={Whale} className="whale" />}
            {message.user.rank === 3 && <img src={Highroller} className="highroller" />}
            {message.user.rank === 2 && <img src={""} className="sponsor" />}
            {message.user.username}{" "}
          </div>
          <div className={classes.content} style={{ background: message.content.toLowerCase().includes("@" + user?.username) ? "#2871FF" : "101123" }}>
            {message.content == "https://betfun.gg/battles/65ee473a95a13b4bfc01f5d2" ? 
            (
              <span onClick={() => history.push(`/battles/65ee473a95a13b4bfc01f5d2`)} style={{color: "#2871FF", cursor: "pointer"}}>Case Battle</span>
            )
            : message.content.split(/\b/).map((word, i) => {
              let emote = emotes.find(emote => emote.word.toLowerCase() === word.toLowerCase());;
              if (emote) {
                return <Emoji key={i} src={emote.src} alt={emote.alt} title={emote.alt} />
              }
              return word
            })}
          </div>
        </div>
        
      </div>
    </Box>
  );
};

export default Message;
