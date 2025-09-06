import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from '@material-ui/core';
import { casesSocket } from "../services/websocket.service";
import { useToasts } from "react-toast-notifications";
import parseCommasToThousands from "../utils/parseCommasToThousands";
import { getCase, getCurrentSeedPair } from "../services/api.service";
import { useHistory } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Grow } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Provably from "../components/modals/upgrader/ProvablyModal";
import { motion } from "framer-motion";
import Grid from '@material-ui/core/Grid';

import Coin from "../assets/icons/coin.png";
import Gold from "../assets/colors/gold.png";
import Red from "../assets/colors/red.png";
import Purple from "../assets/colors/purple.png";
import Blue from "../assets/colors/blue.png";
import Grey from "../assets/colors/grey.png";
import GoldBG from "../assets/colors/goldbg.png";
import RedBG from "../assets/colors/redbg.png";
import PurpleBG from "../assets/colors/purplebg.png";
import BlueBG from "../assets/colors/bluebg.png";
import GreyBG from "../assets/colors/greybg.png";
import GoldBlob from "../assets/colors/goldblob.png";
import RedBlob from "../assets/colors/redblob.png";
import PurpleBlob from "../assets/colors/purpleblob.png";
import BlueBlob from "../assets/colors/blueblob.png";
import GreyBlob from "../assets/colors/greyblob.png";

import error from "../assets/sounds/error.mp3";
const errorAudio = new Audio(error);

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
    width: "100%",
    maxWidth: "1250px",
    margin: "0 auto",
    color: "#fff",
    overflowY: "scroll",
    scrollbarWidth: "none"
  },
  reelContainer: {
    marginBottom: "1.5rem",
    backgroundColor: "#0A0B1C",
    overflow: "hidden",
    justifyContent: "center",
    display: "flex",
    borderRadius: "25px",
    border: "5px solid #101123"
  },
  reel: {
    display: "flex",
    position: "relative",
    alignItems: "center",
    padding: "1rem 0"
  },
  reelSelector: {
    left: "50%",
    backgroundColor: "#fff",
    borderRadius: "0.4rem",
    height: "50px",
    position: "absolute",
    width: "1px",
    zIndex: 1,
    transform: "translate(-50%, 0)",
    transitionDuration: "300ms"
  },
  reelItemSecondContainer: {
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
    width: "50px",
    height: "50px",
    objectFit: "contain", 
    transform: "translate(-50%,-50%)",
    zIndex: 10
  },
  reelItemContainer: {
    height: "100px",
    width: "100px",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    position: "relative",
  },
  reelItemRadialGradient: {
    opacity: .15,
    width: "100%",
    height: "100%",
    zIndex: 0,
    top: 0,
    left: 0,
    position: "absolute",
  },
  
  topBar: {
    position: "relative",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    display: "flex",
    marginBottom: "1rem"
  },
  backButtonContainer2: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    color: "#808080",
    gap: "0.5rem",
    cursor: "pointer",
    transitionDuration: "300ms",
    "&:hover": {
      filter: "brightness(125%)"
    }
  },
  popupButton: {
    flex: "none",
    border: "none",
    cursor: "pointer",
    height: "2.25rem",
    display: "inline-flex",
    outline: "none",
    padding: "0 0.75rem",
    position: "relative",
    alignItems: "center",
    fontWeight: "bold",
    userSelect: "none",
    whiteSpace: "nowrap",
    willChange: "opacity",
    borderRadius: "0.25rem",
    justifyContent: "center",
    transitionDuration: "350ms",
    fontWeight: 500,
    color: "#9E9FBD",
    backgroundColor: "hsla(220, 100%, 82%, 0)",
    "&:hover": {
      backgroundColor: "#313A4D",
      filter: "brightness(130%)"
    }
  },
  buttonIcon: {
    marginRight: ".5em",
    fill: "#9E9FBD",
    flex: "none",
    display: "inline-block",
    outline: "none",
  },

  midBar: {
    position: "relative",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    display: "flex",
    marginBottom: "2rem"
  },
  openBox: {
    display: "flex",
    gap: "0.25rem"
  },
  openButton: {
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: "0.3rem",
    padding: "0.5rem 1rem",
    backgroundColor: "hsl(215, 75%, 50%)",
    borderRadius: "0.25rem",
    cursor: "pointer",
    userSelect: "none",
    color: "#fff",
  },
  demoButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#2D353F",
    borderRadius: "0.25rem",
    cursor: "pointer",
    userSelect: "none",
    color: "#fff",
    transitionDuration: "300ms",
    "&:hover": {
      filter: "brightness(120%)",
      backgroundColor: "hsla(0,0%,100%,.1)",
    }
  },
  costBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.3rem",
    padding: "0.5rem 1rem",
    borderRadius: "0.25rem",
    backgroundColor: "#0A0B1C",
    color: "#fff"
  },


  bottomBar: {
    position: "relative",
    display: "flex",
    width: "100%",
    overflowX: "scroll",

  },
  caseBox: {
    background: "#101123",
    height: "fit-content",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    borderRadius: "0.5rem",
    padding: "0.5rem",
    cursor: "pointer",
    transitionDuration: "300ms",
    "&:hover": {
      filter: "brightness(130%)",
    },    
    [theme.breakpoints.down("md")]: {
      padding: "0.5rem",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "0.5rem",
    },
  },
  imageContainer: {
    backgroundColor: "#0A0B1C",
    borderRadius: "0.5rem",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  caseImage: {
    width: 110
  },
  popularCasesContainer: {
    width: "100%",
    display: "flex",
    gap: "1rem"
  },

  lootTableContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(145px, 1fr))',
    gap: '1rem',
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    },
  },
  lootBoxContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.5rem",
    backgroundColor: "#101123",
    color: "hsl(220, 22%, 85%)",
    boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.5)",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      alignItems: "flex-start",
    },
  },
  priceContainer: {
    flex: "0 0 auto",
    marginRight: "1rem",
  },
  price: {
    display: "flex",
    alignItems: "center",
    color: "#fff",
    gap: "0.3rem"
  },
  itemNameText: {
    flex: "1 1 auto",
    marginRight: "1rem",
    color: "hsl(220, 22%, 85%)",
    [theme.breakpoints.down("sm")]: {
      marginBottom: "0.5rem",
    },
  },
  itemPercentContainer: {
    flex: "0 0 auto",
    textAlign: "right",
  },
  dropRateText: {
    fontSize: 12,
    color: "hsl(220, 22%, 85%)",
  },

  detailsContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    marginTop: "1rem",
    opacity: 0,
    transitionDuration: "1000ms"
  },
  itemNumber: {
    fontSize: "12px",
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: "0.5rem",
  },
  itemName2: {
    fontSize: "12px",
    color: "#ffffff",
    maxWidth: "150px",
    minWidth: "150px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  numOfCases: {
    cursor: "pointer",
    borderRadius: "7px",
    border: "1px solid hsl(215, 75%, 50%)",
    backgroundColor: "transparent",
    opacity: 0.5,
    width: "3rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.5rem 0",
    fontWeight: 500,
  },
  caseDescriptionContainer: {
    fontSize: "20px",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  provablyFairButton: {
    padding: "0.5rem 0.75rem",
    backgroundColor: "hsl(215, 75%, 50%)",
    bottom: 10,
    right: 10,
    borderRadius: "0.25rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer"
  },
  itemBox: {
    height: '200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderRadius: '0.5rem',
    overflow: 'hidden',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: "#0A0B1C",
  },
  itemImage: {
    width: "100px",
    height: "75px",
    objectFit: "contain",
    zIndex: 2
  },
  itemColor: {
    width: "150px",
    height: "auto",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 1
  },
  itemPrice: {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    gap: "0.3rem",
    padding: "0.25rem 0.5rem",
    fontSize: "12px",
    borderTopRightRadius: "0.25rem",
    borderBottomRightRadius: "0.25rem",
    bottom: 10,
    left: 0,
    fontWeight: 500
  },
  percentText: {
    position: "absolute",
    fontWeight: 500,
    fontSize: 12,
    top: 10,
    right: 10,
    color: "#fff",
    opacity: 0.36
  }
}));

const CasePage = () => {
  const classes = useStyles();
  const history = useHistory();
  const { caseSlug } = useParams();
  const { addToast } = useToasts();

  const [loading, setLoading] = useState(true);
  const [caseData, setCaseData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selector, setSelector] = useState(true);
  const [clientSeed, setClientSeed] = useState("clientseed");
  const [serverSeedHashed, setServerSeedHashed] = useState("serverseedhashed");
  const [nonce, setNonce] = useState(0);
  const [openProvably, setOpenProvably] = useState(false);
  const [numOfCases, setNumOfCases] = useState(1)

  let items = [];
  let doors = document.querySelectorAll('#door');

  const fetchData = async () => {
    try {
      const data = await getCase(caseSlug);
      setCaseData(data);
    } catch (error) {
      console.log("There was an error while loading case data:", error);
      setCaseData({}); // Set default case data
    }
  
    try {
      const response = await getCurrentSeedPair();
      setClientSeed(response.clientSeed);
      setServerSeedHashed(response.serverSeedHash);
      setNonce(response.nonce);
    } catch (error) {
      console.log("There was an error while loading seed data:", error);
      setClientSeed("defaultClientSeed");
      setServerSeedHashed("defaultServerSeedHash");
      setNonce(0); // Set default nonce
    }
  
    setLoading(false); // Ensure loading is set to false after both attempts
  };
    

  useEffect(() => {
    fetchData();  

    const error = msg => {
      addToast(msg, { appearance: "error" });
      playSound(errorAudio);
    };

    const success = msg => {
      addToast(msg, { appearance: "success" });
    };

    const open = async (x) => {
      setOpen(true);
      items = getRandomWeightedItems(x.case, 70);
      await spin({ item: x.caseResult });
      setOpen(false);
    };

    casesSocket.on("cases:error", error);
    casesSocket.on("cases:success", success);
    casesSocket.on("cases:opened", open);
    return () => {
      casesSocket.off("cases:error", error);
      casesSocket.off("cases:success", success);
      casesSocket.off("cases:opened", open);
    };
  }, []);

  const getBackgroundForItem = (item) => {
    let background = "";
    
    switch (item.color) {
        case "grey":
            background = "radial-gradient(50% 50% at 50% 50%, rgb(128, 128, 128) 0%, rgba(0, 0, 0, 0) 100%)";
            break;
        case "blue":
            background = "radial-gradient(50% 50% at 50% 50%, rgb(54, 86, 255) 0%, rgba(0, 0, 0, 0) 100%)";
            break;
        case "purple":
            background = "radial-gradient(50% 50% at 50% 50%, rgb(124, 46, 223) 0%, rgba(0, 0, 0, 0) 100%)";
            break;
        case "red":
            background = "radial-gradient(50% 50% at 50% 50%, rgb(255, 51, 51) 0%, rgba(0, 0, 0, 0) 100%)";
            break;
        case "gold":
            background = "radial-gradient(50% 50% at 50% 50%, rgb(252, 177, 34) 0%, rgba(0, 0, 0, 0) 100%)";
            break;
        default:
            background = ""; 
    }
    
    return background;
  };

  async function init(firstInit = true, groups = 1, duration = 1, data) {
    let i = 0;

    doors = document.querySelectorAll('#door');

    for (const door of doors) {
      if (firstInit) {
        door.dataset.spinned = '0';
      } else if (door.dataset.spinned === '1') {
        return;
      }

      const boxes = door.querySelector('#boxes');
      const boxesClone = boxes.cloneNode(false);
      let pool = ['❓'];

      if (!firstInit) {
        const arr = [];
        for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
          arr.push(...items);
        }
        let t = shuffle(arr);
        t.splice(25, 0, data.item);
        pool = t;
      }

      boxesClone.innerHTML = '';

      for (let i = pool.length - 1; i >= 0; i--) {
        const reelItemContainer = document.createElement('div');
        reelItemContainer.classList.add('box');
        reelItemContainer.classList.add(classes.reelItemContainer);
        reelItemContainer.dataset.index = i;
  
        const reelItemSecondContainer = document.createElement('div');
        reelItemSecondContainer.classList.add(classes.reelItemSecondContainer);
  
        const image = document.createElement('img');
        image.classList.add(classes.reelItemImage);
        image.src = pool[i].image; 

        const gradient = document.createElement('div');
        gradient.classList.add(classes.reelItemRadialGradient);
        gradient.style.background = getBackgroundForItem(pool[i]);

        reelItemSecondContainer.appendChild(gradient);
        reelItemSecondContainer.appendChild(image);
        reelItemContainer.appendChild(reelItemSecondContainer);
        boxesClone.appendChild(reelItemContainer);
      }
      
      boxesClone.style.transform = `translateX(0px)`;
      boxesClone.style.transform = `translateX(${(door.clientWidth / boxes.childElementCount) * 26}px)`;
      door.replaceChild(boxesClone, boxes);
      i++;
    }
  };

  async function spin(data) {
    init(false, 1, 2, data);

    await new Promise((resolve) => setTimeout(resolve, 50));

    let w = [];
    for (const door of doors) {
      const boxes = door.querySelector('#boxes');

      const randomPixelValue = Math.floor(Math.random() * 101) - 50;

      boxes.style.transition = `all 4.25s cubic-bezier(0.2, 0.4, 0.1, 1.0)`;
      boxes.style.transform = `translateX(-${1000 + randomPixelValue}px)`;

      const boxToSave = door.querySelector('.box[data-index="25"]');
      w.push(boxToSave);
    };

    await new Promise((resolve) => setTimeout(resolve, 4500));

    for (const door of doors) {
      const boxes = door.querySelector('#boxes');

      boxes.style.transitionDuration = `350ms`;
      boxes.style.transform = `translateX(-1000px)`;
    };

    await new Promise((resolve) => setTimeout(resolve, 350));

    let i = 0;
    for (const box of w) {
      if(!box) return;
      setSelector(false);
      box.style.transitionDuration = "300ms";
      box.style.width = "250px";
      box.style.margin = "0 1rem";
      box.style.justifyContent = "left";

      await new Promise((resolve) => setTimeout(resolve, 300));

      const number = parseCommasToThousands(parseFloat((data.item.price.toFixed(2))));


      const container = document.createElement('div');
      container.classList.add(classes.detailsContainer);

      const numberElement = document.createElement('span');
      numberElement.classList.add(classes.itemNumber);
      numberElement.textContent = `$${number}`;

      const nameElement = document.createElement('span');
      nameElement.classList.add(classes.itemName2);
      nameElement.textContent = data.item.name;

      container.appendChild(nameElement);
      container.appendChild(numberElement);
      box.appendChild(container);

      container.style.opacity = 1;

      i++;
    }
  };

  function shuffle([...arr]) {
    let m = arr.length;
    while (m) {
      const i = Math.floor(Math.random() * m--);
      [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
  };

  const demoSpin = async () => {
    if(open) return;
    setSelector(true);
    setOpen(true);
    items = getRandomWeightedItems(caseData, 70);
    const ticket = ~~(Math.random() * 100_000)
    const item = caseData.items.find(
      (item) => ticket >= item.ticketsStart && ticket <= item.ticketsEnd
    );
    await spin({item: item });
    setOpen(false)
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
  };

  const openCase = () => {
    if(open) return;
    setSelector(true);
    setOpen(true);
    try {
      casesSocket.emit("cases:open", caseSlug);
    } catch (error) {
      addToast("Request to open case failed!", { appearance: "error" });
    }
    setOpen(false);
  };

  const copyLinkAction = () => {
    const caseLink = `https://betfun.gg/cases/${caseSlug}`;
    navigator.clipboard.writeText(caseLink)
      .then(() => {
        addToast("Successfully copied case link!", { appearance: "success" });
      })
      .catch((error) => {
        addToast("Failed to copy case link.", { appearance: "error" });
        console.error("Error copying text to clipboard:", error);
      });
  };

  const getColorSet = (color) => {
    switch(color) {
      case "grey":
        return { Color: Grey, Background: GreyBG, Hex: "#91A0B1", Blob: GreyBlob }
      case "blue":
        return { Color: Blue, Background: BlueBG, Hex: "#4159CF", Blob: BlueBlob }
      case "purple":
        return { Color: Purple, Background: PurpleBG, Hex: "#703ECF", Blob: PurpleBlob }
      case "red":
        return { Color: Red, Background: RedBG, Hex: "#BF4141", Blob: RedBlob }
      case "gold":
        return { Color: Gold, Background: GoldBG, Hex: "#B69768", Blob: GoldBlob }
      default:
        return { Color: Grey, Background: GreyBG, Hex: "#91A0B1", Blob: GreyBlob }
    }
  };

  return (
    loading ? (
      <div style={{margin: "auto", display: "flex"}}>
        <ColorCircularProgress />
      </div>
    ) : (
    <Grow in timeout={620}>
      <div className={classes.root}> 
        <Provably 
          open={openProvably}
          handleClose={() => setOpenProvably(!openProvably)}
          serverSeedHash={serverSeedHashed}
          clientSeed={clientSeed}
          nonce={nonce}
        />
        <div className={classes.topBar}>
          <div className={classes.caseDescriptionContainer}>
            {caseData.name}
            <img src={caseData.image} style={{height: 60, width: 60}} />
          </div>
          <motion.div className={classes.provablyFairButton} whileTap={{ scale: 0.97 }} animate={{ filter: "brightness(100%)" }} whileHover={{ filter: "brightness(85%)" }} onClick={() => setOpenProvably(!openProvably)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="18" viewBox="0 0 20 18" fill="none"><path d="M12.4702 6.75L9.30354 9.75L7.7202 8.25M16.4285 7.62375C16.4285 12.55 12.4955 14.7586 10.8281 15.4735L10.826 15.4744C10.6506 15.5496 10.5628 15.5873 10.3635 15.6197C10.2373 15.6403 9.95389 15.6403 9.8277 15.6197C9.62765 15.5872 9.53882 15.5494 9.36212 15.4735C7.69471 14.7586 3.76187 12.55 3.76187 7.62375V4.65015C3.76187 3.81007 3.76187 3.38972 3.93445 3.06885C4.08624 2.7866 4.32829 2.5573 4.62621 2.41349C4.9649 2.25 5.40861 2.25 6.29536 2.25H13.8954C14.7821 2.25 15.2249 2.25 15.5636 2.41349C15.8615 2.5573 16.1043 2.7866 16.2561 3.06885C16.4285 3.3894 16.4285 3.80924 16.4285 4.64768V7.62375Z" stroke="white" stroke-width="1.5" stroke-linecap="round" strokeLinejoin="round"/></svg>
          </motion.div>
        </div>
      
        <div className={classes.reelContainer}>
          <div className={classes.reel}>
            <div className={classes.reelSelector} style={{opacity: selector ? 1 : 0}} />
            <div id="door" style={{display: "flex"}}>
              <div id="boxes" style={{display: "flex"}}>
                {getRandomWeightedItems(caseData, 21).map((item) => {
                  return (
                    <div className={classes.reelItemContainer}>
                      <div className={classes.reelItemSecondContainer}>
                        <img className={classes.reelItemImage} src={item.image} />
                        <div className={classes.reelItemRadialGradient} style={{background: getBackgroundForItem(item)}}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className={classes.midBar}>
          <div className={classes.openBox}>
            <motion.div 
              animate={{ filter: "brightness(100%)" }} 
              whileHover={{ filter: "brightness(85%)" }} 
              className={classes.openButton}
              onClick={() => openCase()}
              style={{
                opacity: open ? 0.5 : 1,
                cursor: open ? "not-allowed" : "pointer",
              }}
            >
              {!open ? (
                <>
                  Open for
                  <img style={{ height: 17, width: 17 }} src={Coin} />
                  {parseCommasToThousands(caseData.price)}
                </>
              ) : "Opening..."}
            </motion.div>
            <motion.div 
              animate={{ filter: "brightness(100%)" }} 
              whileHover={{ filter: "brightness(85%)" }} 
              className={classes.demoButton} 
              onClick={() => demoSpin()}
              style={{
                opacity: open ? 0.5 : 1,
                cursor: open ? "not-allowed" : "pointer",

              }}
            >
              Demo Spin
            </motion.div>
          </div>         
        </div>

        <h4 style={{fontWeight: 500, margin: "10px 0", padding: 0}}>Case Contents</h4>
        <div className={classes.lootTableContainer}>
          {caseData.items.map((item, index) => {
            const { Color, Background, Hex, Blob } = getColorSet(item.color);
            const totalTickets = item.ticketsEnd - (item.ticketsStart == 0 ? +1 : item.ticketsStart) + 1;
            const percent = totalTickets / 1000;
            return (
              <motion.div
                key={index}
                className={classes.itemBox}
                style={{
                  backgroundImage: `url(${Background})`
                }}
              >
                <div className={classes.percentText}>{percent.toFixed(2)}%</div>
                <img src={item.image} alt={item.name} className={classes.itemImage} />
                <img src={Blob} alt={item.color} className={classes.itemColor} />
                <div className={classes.itemPrice} style={{ backgroundColor: Hex }}>
                  <img src={Coin} alt="Coin" style={{height: 12.5, width: 12.5}} />
                  {parseCommasToThousands(item.price.toFixed(2))}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </Grow>
    
    )
  );
};

export default CasePage;