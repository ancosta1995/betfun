import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core";
import { chatSocket } from "../../services/websocket.service";
import { getChatData } from "../../services/api.service";
import { motion } from "framer-motion";

// Components
import Header from "./Header";
import Messages from "./Messages";
import Controls from "./Controls";

const useStyles = makeStyles({
  root: {
    // display: "flex",
    // disable CHAT FOR RIGHT NOW
    display: "none",
    filter: "blur(10px)",
    transition: 'transform 0.2s ease-in-out, opacity 0.2s ease-in-out',

  },
  switchContainer: {
    position: "fixed",
    bottom: "1.25rem",
    transition: 'left 0.2s'
  },
  switch: {
    postition: "relative",
    backgroundColor: "#131426",
    borderBottomRightRadius: "0.25rem",
    borderTopRightRadius: "0.25rem",
    padding: "0.5rem",
    color: "#4D527C",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    width: "40px",
    height: "40px",
    transitionDuration: "300ms",
    "&:hover": {
      filter: "brightness(125%)"
    }
  }
});

const Chat = ({ mobileChat, setMobile, setMobileProps }) => {
  // Declare State
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [rain, setRain] = useState(null);
  const [trivia, setTrivia] = useState(null);
  const [giveaway, setGiveaway] = useState(null);


  // Rain server state changed
  const rainStateChanged = newState => {
    setRain(newState);
  };

  // Trivia server state changed
  const triviaStateChanged = newState => {
    setTrivia(newState);
  };

  const giveawayStateChanged = newState => {
    setGiveaway(newState);
  };

  // Add new chat message to the state
  const addMessage = message => {
    // Update state
    setChatMessages(state =>
      state.length > 29
        ? [...state.slice(1, state.length), message]
        : [...state, message]
    );
  };

  // Remove message from state
  const removeMessage = msgId => {
    // Update state
    setChatMessages(state => state.filter(message => message.msgId !== msgId));
  };

  // Fetch chat messages from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getChatData();

      // Update state
      setChatMessages(response.messages);
      setRain(response.rain);
      setTrivia(response.trivia);
      setGiveaway(response.giveaway);
      setLoading(false);
    } catch (error) {
      console.log("There was an error while fetching chat messages:", error);
    }
  };

  // componentDidMount
  useEffect(() => {
    fetchData();

    // Listeners
    chatSocket.on("new-chat-message", addMessage);
    chatSocket.on("remove-message", removeMessage);
    chatSocket.on("rain-state-changed", rainStateChanged);
    chatSocket.on("trivia-state-changed", triviaStateChanged);
    chatSocket.on("giveaway-state-changed", giveawayStateChanged);

    // componentDidUnmount
    return () => {
      // Remove listeners
      chatSocket.off("new-chat-message", addMessage);
      chatSocket.off("remove-message", removeMessage);
      chatSocket.off("rain-state-changed", rainStateChanged);
      chatSocket.off("trivia-state-changed", triviaStateChanged);
      chatSocket.off("giveaway-state-changed", giveawayStateChanged);
    };
  }, []);

  return (
      <Fragment>
        <Header setMobile={setMobileProps.setMobile} />
        <Messages loading={loading} chatMessages={chatMessages} />
        <Controls rain={rain} trivia={trivia} />
      </Fragment>
  );
};

export default Chat;
