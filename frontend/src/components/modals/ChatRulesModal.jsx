import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";

// MUI Components
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";

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
import Yey from "../../assets/emoji/Yey.png";
import Clown from "../../assets/emoji/clown.png";
import Rip from "../../assets/emoji/rip.png";
import Pepe from "../../assets/emoji/pepe.png";
import Monkas from "../../assets/emoji/monkaS.png";

// Custom Styles
const useStyles = makeStyles(theme => ({
  modal: {
    minHeight: "35rem",
    "& .MuiDialog-paperWidthSm": {
      scrollbarWidth: "none",
      width: "50%",
      background: "#050614",
      borderRadius: "0.5em",
      color: "#fff",
      [theme.breakpoints.down("xs")]: {
        width: "100%",
        margin: "15px",
        marginTop: "80px",
        maxHeight: "80%",
      },
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        margin: "15px",
        marginTop: "80px",
        maxHeight: "80%",
      },
      [theme.breakpoints.down("md")]: {
        width: "100%",
        margin: "15px",
        marginTop: "80px",
        maxHeight: "80%",
      },
    },
  },
  buttontest: {
    color: "#e4e4e4",
    fontFamily: "Poppins",
    fontSize: "13px",
    fontWeight: 300,
    letterSpacing: ".1em",
  },
  titlePoppins: {
    fontFamily: "Poppins",
  },
  numbers: {
    color: "#9e9e9e",
    fontFamily: "Poppins",
    fontSize: "15px",
    fontWeight: 400,
    letterSpacing: ".1em",
  },
  titleBox: {
    display: "flex",
    boxShadow: "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
    alignItems: "center",
    paddingTop: "1em",
    paddingLeft: "1.5em",
    paddingRight: "1em",
    paddingBottom: "1em",
    fontFamily: "Poppins", 
    backgroundColor: "#101123", 
    justifyContent: "space-between",
    width: "100%"
  },
  content: {
    padding: "1.5em",
    display: "block",
  },
  buttonIcon: {
    color: "#9E9FBD",
    marginRight: ".5em",
    fill: "currentColor",
    flex: "none",
    width: "1.25em",
    height: "1.25em",
    display: "inline-block",
    outline: "none",
  },
}));

const ChatRulesModal = ({ open, handleClose }) => {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      className={classes.modal}
      onClose={handleClose}
      fullScreen={fullScreen}
      style={{ fontFamily: "Poppins", }}
      open={open}
    >
      <div className={classes.titleBox} onClose={handleClose} >
        <span style={{flex: "auto", fontSize: "1.5rem", color: "#E0E4EB" }}>Chat Rules</span>
        <svg className={classes.buttonIcon} style={{cursor: "pointer"}} onClick={() => handleClose()} fill="currentColor" tabIndex="-1" viewBox="0 0 320 512"><path d="M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z"></path></svg>
      </div>
      <div className={classes.content} >
      <p><span className={classes.numbers}>1.</span> Don't spam & don't use excessive capital letters when chatting.</p>
        <p><span className={classes.numbers}>2.</span> Don't harass or be offensive to other users or Solanaspin staff.</p>
        <p><span className={classes.numbers}>3.</span> Don't share any personal information (including socials) of you or other customers.</p>
        <p><span className={classes.numbers}>4.</span> Don't use alternative (alts) accounts on chat, that is strictly forbidden.</p>
        <p><span className={classes.numbers}>5.</span> No suspicious behavior that can be seen as potential scams.</p>
        <p><span className={classes.numbers}>6.</span> Don't engage in any forms of advertising/trading/selling/buying or offering services.</p>
        <p><span className={classes.numbers}>7.</span> Only use the language specified in the chat channel, potential abuse will be sanctioned.</p>
        <p><span className={classes.numbers}>8.</span> Do not ask for items, trivia or giveaways.</p>
        {/*<br />
        <h2 style={{ fontFamily: "Poppins", fontWeight: "300", }}>Emotes</h2>
        <Box style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(50px, 1fr))", fontSize: "12px", gridGap: "2px", }}>
          <p>Kappa </p>
          <img style={{ width: "30px", height: "32px", }} src={Kappa} alt="Kappa" title="Kappa" />
          <p>Kek </p>
          <img style={{ width: "30px", height: "32px", }} src={Kek} alt="Kek" title="Kek" />
          <p>Stonks </p>
          <img style={{ width: "30px", height: "32px", }} src={Stonks} alt="Stonks" title="Stonks" />          <p>Yes </p>
          <img style={{ width: "30px", height: "32px", }} src={Yes} alt="Yes" title="Yes" />          <p>No </p>
          <img style={{ width: "30px", height: "32px", }} src={No} alt="No" title="No" />          <p>Stfu </p>
          <img style={{ width: "30px", height: "32px", }} src={Stfu} alt="Stfu" title="Stfu" />          <p>Knife </p>
          <img style={{ width: "30px", height: "32px", }} src={Knife} alt="Knife" title="Knife" />          <p>Chill </p>
          <img style={{ width: "30px", height: "32px", }} src={Chill} alt="Chill" title="Chill" />          <p>Fax </p>
          <img style={{ width: "30px", height: "32px", }} src={Fax} alt="Fax" title="Fax" />          <p>Cap </p>
          <img style={{ width: "30px", height: "32px", }} src={Cap} alt="Cap" title="Cap" />          <p>Bruh </p>
          <img style={{ width: "30px", height: "32px", }} src={Bruh} alt="Bruh" title="Bruh" />           <p>Tate </p>
          <img style={{ width: "30px", height: "32px", }} src={Tate} alt="Tate" title="Tate" />          <p>BTC </p>
          <img style={{ width: "30px", height: "32px", }} src={BTC} alt="BTC" title="BTC" />          <p>Damn </p>
          <img style={{ width: "30px", height: "32px", }} src={Damn} alt="Damn" title="Damn" />          <p>Pray </p>
          <img style={{ width: "30px", height: "32px", }} src={Pray} alt="Pray" title="Pray" />          <p>Sus </p>
          <img style={{ width: "30px", height: "32px", }} src={Sus} alt="Sus" title="Sus" />          <p>Sadge </p>
          <img style={{ width: "30px", height: "32px", }} src={Sadge} alt="Sadge" title="Sadge" /><p>Tom </p>
          <img style={{ width: "30px", height: "32px", }} src={Tom} alt="Tom" title="Tom" /><p>Yikes </p>
          <img style={{ width: "30px", height: "32px", }} src={Yikes} alt="Yikes" title="Yikes" /><p>Angry </p>
          <img style={{ width: "30px", height: "32px", }} src={Angry} alt="Angry" title="Angry" /><p>Sad </p>
          <img style={{ width: "30px", height: "32px", }} src={Sad} alt="Sad" title="Sad" /><p>Cry </p>
          <img style={{ width: "30px", height: "32px", }} src={Cry} alt="Cry" title="Cry" /><p>Wtf </p>
          <img style={{ width: "30px", height: "32px", }} src={Wtf} alt="Wtf" title="Wtf" /><p>Swag </p>
          <img style={{ width: "30px", height: "32px", }} src={Swag} alt="Swag" title="Swag" /><p>Fuck </p>
          <img style={{ width: "30px", height: "32px", }} src={Fuck} alt="Fuck" title="Fuck" /><p>Yey </p>
          <img style={{ width: "30px", height: "32px", }} src={Yey} alt="Yey" title="Yey" /><p>Clown </p>
          <img style={{ width: "30px", height: "32px", }} src={Clown} alt="Clown" title="Clown" /><p>Rip </p>
          <img style={{ width: "30px", height: "32px", }} src={Rip} alt="Rip" title="Rip" /><p>Pepe </p>
          <img style={{ width: "30px", height: "32px", }} src={Pepe} alt="Pepe" title="Pepe" /><p>Monkas </p>
          <img style={{ width: "30px", height: "32px", }} src={Monkas} alt="Monkas" title="Monkas" />
        </Box>*/}
      </div> 
    </Dialog>
  );
};

export default ChatRulesModal;
