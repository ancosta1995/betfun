import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { casesSocket } from "../../../services/websocket.service";
import { useToasts } from "react-toast-notifications";
import { getCase, getLastOpen } from "../../../services/api.service";
import parseCommasToThousands from "../../../utils/parseCommasToThousands";
import { useHistory } from 'react-router-dom';
import confetti from 'canvas-confetti';
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Countdown from "react-countdown";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import spinSound from "../../../assets/spin.wav";
import error from "../../../assets/sounds/error.mp3";
import confettiSound1 from "../../../assets/small_celebration.wav";
import coin from "../../../assets/icons/coin.png";

const confettiAudio1 = new Audio(confettiSound1);
confettiAudio1.volume = 0.075;

const errorAudio = new Audio(error);

const spinAudio = new Audio(spinSound);
spinAudio.playbackRate = 1.3;

const playSound = audioFile => {
  audioFile.play();
};

const ColorCircularProgress = withStyles({
  root: {
    color: "#fff !important",
  },
})(CircularProgress);

const useStyles = makeStyles(theme => ({
  root: {
    color: "#fff",
    fontFamily: "Poppins",
    overflowY: "hidden",
    minHeight: "35rem",
  },
  topBar: {
    backgroundColor: "#101123",
    borderTopLeftRadius: "8px",
    borderTopRightRadius: "8px",
    position: "relative",
    alignItems: "center",
    border: "1px solid transparent",
    justifyContent: "space-between",
    width: "100%",
    paddingBottom: ".75rem",
    paddingTop: ".75rem",
    marginBottom: ".5rem",
    display: "flex",
  },
  titleText: {
    textAlign: "center",
    display: "inline-block",
    lineHeight: "1em",
    margin: 0,
    fontSize: "1.5rem",
    color: "#fff",
    fontWeight: 400,
    letterSpacing: 0,
    lineHeight: "140%",
  },
  container: {
    margin: "0 auto",
    flexFlow: "column",
    width: "100%",
    display: "flex",
    position: "relative",
  },
  lootTableTitle: {
    fontWeight: 400,
    fontSize: "1.5rem",
    lineHeight: "140%",
    marginBottom: "1rem",
    marginTop: "2rem",
    lineHeight: "140%",
    margin: 0,
    padding: 0,
  },
  lootTableItemsContainer: {
    gap: ".5rem",
    flexFlow: "row wrap",
    width: "100%",
    display: "flex",
    position: "relative",
  },
  lootBoxContainer: {
    borderRadius: "0.5em",
    gap: "0.25rem",
    overflow: "hidden",
    width: "calc(33.33% - .5rem)",
    backgroundColor: "#101123",
    alignItems: "center",
    justifyContent: "flex-start",
    flexFlow: "column",
    padding: ".5rem",
    display: "flex",
    position: "relative",
  },
  itemImageContainer: {
    width: "65px",
    height: "65px",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center"
  },
  itemImage: {
    height: "auto",
    width: "100%",
    display: "block",
  },
  priceContainer: {
    marginTop: "0.5rem",
    backdropFilter: "blur(7px)",
    background: "hsla(0,0%,100%,.2)",
    borderRadius: "8px",
    padding: ".3rem",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    position: "relative",
  },
  priceText: {
    fontSize: ".875rem",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    margin: 0,
    padding: 0,
  },
  itemNameText: {
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
    fontWeight: 400,
    fontSize: ".75rem",
    lineHeight: "150%",
    color: "#b4b9de",
    marginTop: ".25rem",
    lineHeight: "140%",
    margin: 0,
    padding: 0,
  },
  itemPercentContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: ".25rem",
    display: "flex",
    position: "relative",
  },
  itemPercentText: {
    fontSize: ".625rem",
    lineHeight: "150%",
    color: "#b4b9de",
    lineHeight: "140%",
    margin: 0,
    padding: 0,
  },
  dropRateText: {
    fontSize: ".625rem",
    lineHeight: "150%",
    color: "#b4b9de",
    marginLeft: ".25rem",
    lineHeight: "140%",
    margin: 0,
    padding: 0,
  },
  chestReelContainer: {
    height: "150px",
    overflowX: "clip",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "1rem",
    display: "flex",
    position: "relative",
  },
  faderLeft: {
    backgroundImage: "linear-gradient(to right,var(--background-color-3a1),var(--background-color-3a0))",
    left: "-1rem",
    height: "150px",
    position: "absolute",
    width: "25%",
    zIndex: 1,
    display: "flex",
    position: "relative",
  },
  faderRight: {
    backgroundImage: "linear-gradient(to left,var(--background-color-3a1),var(--background-color-3a0))",
    right: "-1rem",
    height: "150px",
    position: "absolute",
    width: "25%",
    zIndex: 1,
    display: "flex",
    position: "relative",
  },
  reelInner: {
    transform: "translateX(0px)",
    position: "absolute",
    gap: ".25rem",
    display: "flex",
  },
  reelSelector: {
    backgroundColor: "#fff",
    borderRadius: "0.4rem",
    height: "175px",
    left: "50%",
    position: "absolute",
    width: "4px",
    zIndex: 1,
    display: "flex",
  },
  reelItemContainer: {
    height: "150px",
    width: "100px",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#101123",
    borderRadius: "0.4rem",
    // border: "1px solid transparent",
    paddingRight: ".15rem",
    paddingLeft: ".15rem",
    display: "flex",
    position: "relative",
  },
  reelTtemSecondContainer: {
    width: "100px",
    height: "0px",
    paddingTop: "100px",
    overflow: "hidden",
    position: "relative",
    display: "flex",
  },
  reelItemImage: {
    height: "auto",
    left: "50%",
    position: "absolute",
    right: 0,
    top: "50%",
    width: "70px",
    transform: "translate(-50%,-50%)",
  },
  interactionContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    gap: ".75rem",
    justifyContent: "space-between",
    borderTop: "1px solid transparent",
    borderBottom: "1px solid transparent",
    padding: "1.5rem 0",
    marginTop: "2rem",
    marginBottom: "2rem",
    display: "flex",
  },
  casePriceContainer: {
    height: "fit-content",
    gap: ".75rem",
    alignItems: "center",
    justifyContent: "flex-start",
    justifyContent: "center",
    display: "flex",
    position: "relative",
  },
  caseOpenContainer: {
    width: "fit-content",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  caseDemoContainer: {
    gap: ".5rem",
    alignItems: "center",
    display: "flex",
  },
  casePriceText: {
    color: "#fff",
    lineHeight: "140%",
    margin: 0,
    padding: 0,
  },
  casePriceBox: {
    backgroundColor: "hsla(0,0%,100%,.2)",
    borderRadius: "0.4rem",
    border: "1px solid transparent",
    display: "flex",
    position: "relative",
  },
  casePriceBoxSecondary:  {
    alignItems: "center",
    backgroundColor: "#101123",
    display: "flex",
    justifyContent: "center",
    borderRadius: "0.4rem",
    border: "1px solid transparent",
    paddingBottom: ".75rem",
    paddingTop: ".75rem",
    paddingRight: "1.5rem",
    paddingLeft: "1.5rem",
    display: "flex",
    position: "relative",
  },
  casePriceSpanText: {
    fontSize: ".9375rem",
    lineHeight: "140%",
    color: "#fff",
    margin: 0,
    padding: 0,
  },
  openButton: {
    cursor: "not-allowed",
    paddingBottom: "1.25rem",
    paddingTop: "1.25rem",
    width: "100%",
    backgroundColor: "hsl(215, 75%, 50%)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "0.25rem",
    height: "2.15rem",
    padding: ".5rem 4.5rem",
    display: "flex",
    transitionDuration: "300ms",
    "&:hover": {
      cursor: "pointer",
      opacity: 0.75,
      filter: "brightness(120%)",
      backgroundColor: "hsl(215, 75%, 50%)",
    }
  },
  openButtonText: {
    color: "#fff",
    fontSize: ".9375rem",
    lineHeight: "140%",
    margin: 0,
    padding: 0,
  },
  demoButton: {
    background: "hsla(0,0%,100%,.05)",
    width: "100px",
    height: "2.5rem",
    padding: ".5rem .75rem",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "0.4rem",
    border: "none",
    outline: "none !important",
    display: "flex",
    position: "relative",
    transitionDuration: "300ms",
    "&:hover": {
      cursor: "pointer",
      opacity: 0.75
    }
  },
  demoButtonDisabled: {
    pointerEvents: "none",
    width: "25%",
    gap: ".5rem",
    alignItems: "center",
    justifyContent: "flex-end",
    display: "flex",
    position: "relative",
    cursor: "not-allowed",
    opacity: 0.5
  },
  caseButtonDisabled: {
    pointerEvents: "none",
    cursor: "not-allowed",
    opacity: 0.5,
  },
  demoButtonText: {
    fontSize: ".9375rem",
    lineHeight: "140%",
    color: "#9E9FBD",
    margin: 0,
    padding: 0,
  },
  canvas: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    pointerEvents: "none",
    zIndex: 10000,
  },
  itemNumber: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: 600,
    fontFamily: "Poppins",
  },
  winItem: {
    position: "relative",
    zIndex: 100000,
  },
  backButtonContainer: {
    border: "none",
    alignItems: "center",
    justifyContent: "center",
    height: "2.15rem",
    outline: "none !important",
    padding: ".5rem .75rem",
    display: "flex",
    position: "relative",
  },
  backButtonContainer2: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex"
  },
  backButtonSVG: {
    height: "2rem !important",
    width: "2rem !important",
    "&:hover": {
      filter: "brightness(120%)"
    }
  },
  loader: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "35rem",
  },
}));


const DailyCase = (isAuthenticated, user) => {
  const classes = useStyles();
  const history = useHistory();
  const { addToast } = useToasts();

  const [loading, setLoading] = useState(true);
  const [caseData, setCaseData] = useState([]);
  const [demo, setDemo] = useState(false);
  const [itemWon, setItemWon] = useState(false);
  const [lastOpen, setLastOpen] = useState(null);
  
  const [timeUntilNextOpen, setTimeUntilNextOpen] = useState(null);

  let items = [];
  let doors = document.querySelectorAll('#door');

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      function z(t) {
        return t < 10 ? `0${t}` : t;
      }
      return (
        <span>{z(hours)}h {z(minutes)}:{z(seconds)}</span>
      );
    } else {
      function z(t) {
        return t < 10 ? `0${t}` : t;
      }

      return (
          <span>{z(hours)}h {z(minutes)}:{z(seconds)}</span>
      );
    }
  };

  const calculateTimeUntilNextOpen = (lastOpen) => {
    const nextOpenTime = new Date(lastOpen).getTime() + 24 * 60 * 60 * 1000;
    return nextOpenTime - Date.now();
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getCase("daily");
        const res2 = await getLastOpen();

        setCaseData(res);
        items = getRandomWeightedItems(res, 60);

        setLastOpen(res2);
        setTimeUntilNextOpen(calculateTimeUntilNextOpen(res2));
        console.log((Date.now() - new Date(lastOpen).getTime()) / (1000 * 60 * 60))
        setLoading(false);
      } catch (error) {
        console.log("There was an error while loading case data:", error);
      }
    };

    fetchData();

    const error = msg => {
      addToast(msg, { appearance: "error" });
      playSound(errorAudio);
    };

    const success = msg => {
      addToast(msg, { appearance: "success" });
    };

    const open = async (x) => {
      setItemWon(false);
      setDemo(true);
      items = getRandomWeightedItems(x.case, 60);
      await spin({ item: x.caseResult });
      setDemo(false);
    };

    casesSocket.on("cases:error", error);
    casesSocket.on("cases:success", success);
    casesSocket.on("cases:opened", open);
    return () => {
      casesSocket.off("cases:error", error);
      casesSocket.off("cases:success", success);
      casesSocket.off("cases:opened", open);
    };
  }, [addToast]);

  async function init(firstInit = true, groups = 1, duration = 1, data) {
    let i = 0;

    doors = document.querySelectorAll('#door2');

    for (const door of doors) {
      if (firstInit) {
        door.dataset.spinned = '0';
      } else if (door.dataset.spinned === '1') {
        return;
      }

      const boxes = door.querySelector('#boxes2');
      const boxesClone = boxes.cloneNode(false);
      let pool = ['❓'];

      if (!firstInit) {
        const arr = [];
        for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
          arr.push(...items);
        }
        let t = shuffle(arr);
        t.splice(15, 0, data.item);
        pool = t;
      }

      boxesClone.innerHTML = '';

      for (let i = pool.length - 1; i >= 0; i--) {
        const reelItemContainer = document.createElement('div');
        reelItemContainer.classList.add('box2');
        reelItemContainer.classList.add(classes.reelItemContainer);
        reelItemContainer.dataset.index = i;
  
        const reelTtemSecondContainer = document.createElement('div');
        reelTtemSecondContainer.classList.add(classes.reelTtemSecondContainer);
  
        const image = document.createElement('img');
        image.classList.add(classes.reelItemImage);
        image.src = pool[i].image; 

        //const rarityFilter = getFilterForItem(pool[i]); 
        //image.style.filter = rarityFilter;

        reelTtemSecondContainer.appendChild(image);
        reelItemContainer.appendChild(reelTtemSecondContainer);
        boxesClone.appendChild(reelItemContainer);
      }
      
      boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
      boxesClone.style.transform = `translateX(${(door.clientWidth / boxes.childElementCount) * 26}px)`;
      door.replaceChild(boxesClone, boxes);
      i++;
    }
  }

  async function spin(data) {
    init(false, 1, 2, data);
    playSound(spinAudio)
    let w = [];
    for (const door of doors) {
      const boxes = door.querySelector('#boxes2');
      const duration = parseInt(boxes.style.transitionDuration);
      
      const widthPerBox = door.clientWidth / boxes.childElementCount;
      const targetPosition = 15 * widthPerBox;

      boxes.style.transform = `translateX(-${targetPosition}px)`;
      boxes.style.transition = `5s cubic-bezier(0.2, 0.4, 0.1, 1.0)`;
      boxes.style.transitionDuration = `${duration + 2}s`;
      const boxToScaleUp = door.querySelector('.box2[data-index="15"]');
      w.push(boxToScaleUp);
    }

    await new Promise((resolve) => setTimeout(resolve, 4000));

    let i = 0;
    for (const box of w) {
      if(!box) return;
      setItemWon(true);
      box.classList.add(classes.winItem)
      box.style.transitionDuration = '0.5s';
      box.style.transform = 'scale(1.2)';

      const number = parseCommasToThousands(parseFloat((data.item.price)));

      const numberElement = document.createElement('span');
      numberElement.classList.add('number');
      numberElement.classList.add(classes.itemNumber)
      numberElement.textContent = `$${number}`;
      if(data.item.color == "gold" || data.item.color == "orange" || data.item.color == "red") {
        triggerConfetti();
      }
      box.appendChild(numberElement);
      i++;
    }
  }

  function shuffle([...arr]) {
    let m = arr.length;
    while (m) {
      const i = Math.floor(Math.random() * m--);
      [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
  }

  const handleDemoButtonClick = async () => {
    setItemWon(false);
    setDemo(true);
    items = getRandomWeightedItems(caseData, 60);
    const ticket = ~~(Math.random() * 100_000)
    const item = caseData.items.find(
      (item) => ticket >= item.ticketsStart && ticket <= item.ticketsEnd
    );
    await spin({item: item });
    setDemo(false);
  };

  function getRandomWeightedItems(data, totalItems) {
    const itemList = data.items;
    let weightedList = [];

    for (const item of itemList) {
      const weight = item.ticketsEnd - item.ticketsStart + 1;
      for (let i = 0; i < weight; i++) {
        weightedList.push(item);
      }
    }

    for (let i = weightedList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [weightedList[i], weightedList[j]] = [weightedList[j], weightedList[i]];
    }

    return weightedList.slice(0, totalItems);
  }

  const triggerConfetti = () => {
    const containerLeft = document.querySelector(`#canvas-left`);
    const containerRight = document.querySelector(`#canvas-right`);
  
    if (containerLeft && containerRight) {
      const confettiLeft = confetti.create(containerLeft, {
        resize: true,
      });
  
      const confettiRight = confetti.create(containerRight, {
        resize: true,
      });
  
      playSound(confettiAudio1);

      confettiLeft({
        particleCount: 75,
        spread: 40,
        angle: 30, 
        origin: {
          x: 0,
          y: 1.2,
        },
      });
  
      confettiRight({
        particleCount: 75,
        spread: 40,
        angle: 150,  
        origin: {
          x: 1,
          y: 1.2,
        },
      });
    }
  };

  const getFilterForItem = (item) => {  
    let filter = "";
    if (item.color === "blue") {
      filter = "drop-shadow(rgba(54, 86, 255, 0.75) 0px 0px 10px)"; // blue
    } else if (item.color === "purple") {
      filter = "drop-shadow(rgba(124, 46, 223, 0.75) 0px 0px 10px)"; // purple
    } else if (item.color === "pink") {
      filter = "drop-shadow(rgba(188, 0, 255, 0.75) 0px 0px 10px)"; // pink
    } else if (item.color === "gold") {
      filter = "drop-shadow(rgba(252, 177, 34, 0.75) 0px 0px 10px)"; // gold
    } else if (item.color === "orange") {
      filter = "drop-shadow(rgba(255, 119, 76, 0.75) 0px 0px 10px)"; // orange
    } else {
      filter = "drop-shadow(rgba(240, 50, 118, 0.75) 0px 0px 10px)"; // red
    }
    return filter;
  };

  const getBackgroundForItem = (item) => {
  
    let background = "";
    if (item.color === "blue") {
      background = "linear-gradient(160.31deg, rgba(54, 86, 255, 0.2), rgba(54, 86, 255, 0) 51.78%, rgba(54, 86, 255, 0.2) 104.36%), #101123"; // blue
    } else if (item.color === "purple") {
      background = "linear-gradient(160.31deg, rgba(124, 46, 223, 0.2), rgba(124, 46, 223, 0) 51.78%, rgba(124, 46, 223, 0.2) 104.36%), #101123"; // purple
    } else if (item.color === "pink") {
      background = "linear-gradient(160.31deg, rgba(188, 0, 255, 0.2), rgba(188, 0, 255, 0) 51.78%, rgba(188, 0, 255, 0.2) 104.36%), #101123"; // pink
    } else if (item.color === "gold") {
      background = "linear-gradient(160.31deg, rgba(252, 177, 34, 0.2), rgba(252, 177, 34, 0) 51.78%, rgba(252, 177, 34, 0.2) 104.36%), #101123"; // gold
    } else if (item.color === "orange") {
      background = "linear-gradient(160.31deg, rgba(255, 119, 76, 0.2), rgba(255, 119, 76, 0) 51.78%, rgba(255, 119, 76, 0.2) 104.36%), #101123"; // orange
    } else {
      background = "linear-gradient(160.31deg, rgba(240, 50, 118, 0.2), rgba(240, 50, 118, 0) 51.78%, rgba(240, 50, 118, 0.2) 104.36%), #101123"; // red
    }
  
    return background;
  };

  const getBorderForItem = (item) => {
    let border = "";
    if (item.color === "blue") {
      border = "rgba(54, 86, 255, 1)"; // blue
    } else if (item.color === "purple") {
      border = "rgba(124, 46, 223, 1)"; // purple
    } else if (item.color === "pink") {
      border = "rgba(188, 0, 255, 1)"; // pink
    } else if (item.color === "gold") {
      border = "rgba(252, 177, 34, 1)"; // gold
    } else if (item.color === "orange") {
      border = "rgba(255, 119, 76, 1)"; // orange
    } else {
      border = "rgba(240, 50, 118, 1)"; // red
    }
  
    return border;
  };

  const getPercentForItem = (item) => {
    const totalTickets = item.ticketsEnd - (item.ticketsStart == 0 ? +1 : item.ticketsStart) + 1;
    const percentChance = totalTickets / 1000;
    return percentChance;
  };

  const renderLootTableBoxes = () => {
    let allBoxes = [];
    try {
      caseData?.items.map(item => {
        const background = getBackgroundForItem(item);
        const border = getBorderForItem(item);
        const percent = getPercentForItem(item);

        allBoxes.push(
          <div className={classes.lootBoxContainer} >
            <div className={classes.itemImageContainer}>
              <img className={classes.itemImage} src={item.image} />
            </div>
            <div className={classes.priceContainer}>
              <span className={classes.priceText}><img style={{height: 17, width: 17}} src={coin} />{parseCommasToThousands(item?.price)}</span>
            </div>
            <span className={classes.itemNameText}>{item?.name}</span>
          </div>
        )
      })
    } catch (error) {
      console.log(error)
    }
    return allBoxes;
  };

  const renderX = () => {
    let allBoxes = [];
    try {
      items = getRandomWeightedItems(caseData, 15);
      for(let i = 0; i < items.length; i++) {
        allBoxes.push(
          <div className={classes.reelItemContainer}>
            <div className={classes.reelTtemSecondContainer}>
              <img className={classes.reelItemImage} src={items[i]?.image} />
            </div>
          </div>
        )
      }
    } catch (error) {
      console.log(error)
    }
    return allBoxes;
  };

  const openCase = () => {
    try {
      casesSocket.emit("cases:free", "daily");
    } catch (error) {
      addToast("Request to open case failed!", { appearance: "error" });
    }
  };  
  
  return (
    loading ? (
      <Box className={classes.loader}>
        <ColorCircularProgress />
      </Box>
    ) : isAuthenticated && user ? (
    <div className={classes.root}> 
      <div className={classes.container}>
        <div className={classes.chestReelContainer}>
          <canvas id={`canvas-left`} className={classes.canvas}></canvas>
          <div className={classes.faderLeft}></div>
          <div className={classes.reelInner}>
            <div id="door2" style={{display: "flex", gap: ".25rem"}}>
              <div id="boxes2" style={{display: "flex", gap: ".25rem"}}>
                {renderX()}
              </div>
            </div>
          </div>
          <div className={classes.reelSelector} style={{display: itemWon ? "none" : ""}}></div>
          <div className={classes.faderRight}></div>
          <canvas id={`canvas-right`} className={classes.canvas}></canvas>
        </div>
        <div className={classes.interactionContainer}>
          <div className={`${demo ? classes.caseButtonDisabled : "" } ${classes.caseOpenContainer} ${(Date.now() - new Date(lastOpen).getTime()) / (1000 * 60 * 60) < 24 ? classes.caseButtonDisabled : "" }`} onClick={() => openCase()}>
            <div className={classes.openButton}>
              <span className={classes.openButtonText}>{(Date.now() - new Date(lastOpen).getTime()) / (1000 * 60 * 60) > 24 ? "Open" : <Countdown date={Date.now() + timeUntilNextOpen} renderer={renderer} style={{ color: "#fff" }}/>}</span>
            </div>
          </div>
          <div className={demo ? classes.demoButtonDisabled : classes.caseDemoContainer}>
            <div className={classes.demoButton} onClick={handleDemoButtonClick}>
              <span className={classes.demoButtonText}>Demo</span>
            </div>
          </div>
        </div>  
        <div className={classes.lootTableItemsContainer}>
          {renderLootTableBoxes()}
        </div>
      </div>
    </div>
    ) : (
      <span style={{color:"#9E9FBD"}}>Please <a href="/login/steam" style={{color:"#9E9FBD"}}>log in</a> to view your free daily case.</span>
    ) 
  );
};

DailyCase.propTypes = {
  isAuthenticated: PropTypes.bool,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps, {})(DailyCase);