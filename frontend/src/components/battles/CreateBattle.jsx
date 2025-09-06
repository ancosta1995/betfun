import React, { useState, useEffect, Fragment } from "react";
import { makeStyles, Switch } from "@material-ui/core";
import { getActiveCases } from "../../services/api.service";
import { battlesSocket } from "../../services/websocket.service";
import { useToasts } from "react-toast-notifications";
import { useHistory } from 'react-router-dom';
import parseCommasToThousands from "../../utils/parseCommasToThousands.js";
import cutDecimalPoints from "../../utils/cutDecimalPoints.js";
import { motion } from "framer-motion";

import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import CaseModal from "./CaseModal.jsx";

import placebet from "../../assets/sounds/place-bet.mp3";
import error from "../../assets/sounds/error.mp3";
import coin from "../../assets/icons/coin.png"

const errorAudio = new Audio(error);
const placebetAudio = new Audio(placebet);

const playSound = audioFile => {
  audioFile.play();
};


// Custom Styles
const useStyles = makeStyles(theme => ({
  modal: {
    "& .MuiDialog-paperWidthSm": {
      scrollbarWidth: "none",
      width: "100%",
      maxWidth: "800px",
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
  topBar: {
    display: "grid",
    padding: "2rem 0",
    width: "100%",
    gap: "0.5rem",
    gridTemplateColumns: "repeat(3,minmax(0,1fr))",
  },
  mainBox: {
    display: "flex",
    flexDirection: "column",
    padding: "1rem",
    backgroundColor: "#101123",
    borderRadius: "0.25rem"
  },
  mainHeader: {
    display: "flex",
    gap: "0.5rem",
    alignItems: "center"
  },
  selectionContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: "1.5rem",
    gap: "0.25rem",  
  },
  crazyActive: {
    color: "#FF5353",
    border: "1px solid #FF5353",
    backgroundColor: "#101123",
    flex: 1,
    height: "auto",
    paddingTop: "1em",
    paddingBottom: "1em",
    cursor: "pointer",
    display: "inline-flex",
    outline: "none",
    padding: "0 0.75em",
    position: "relative",
    alignItems: "center",
    fontWeight: "bold",
    userSelect: "none",
    whiteSpace: "nowrap",
    willChange: "opacity",
    borderRadius: "0.25rem",
    justifyContent: "center",
    transitionDuration: "300ms",
    cursor: "pointer",
    textDecoration: "none",
    fontWeight: 500,
  },
  active: {
    color: "hsl(220, 22%, 85%)",
    backgroundColor: "#1a1b33",
    cursor: "pointer",
    display: "inline-flex",
    padding: "0.25rem 0.5rem",
    fontSize: "12px",
    alignItems: "center",
    userSelect: "none",
    whiteSpace: "nowrap",
    borderRadius: "0.25rem",
    justifyContent: "center",
    transitionDuration: "300ms",
    cursor: "pointer",
    textDecoration: "none",
    fontWeight: 400,
    filter: "brightness(140%)",
    "&:hover": {

    }
  },
  notactive: {
    color: "hsl(220, 22%, 85%)",
    backgroundColor: "#1a1b33",
    cursor: "pointer",
    display: "inline-flex",
    padding: "0.25rem 0.5rem",
    fontSize: "12px",
    alignItems: "center",
    userSelect: "none",
    whiteSpace: "nowrap",
    borderRadius: "0.25rem",
    justifyContent: "center",
    transitionDuration: "300ms",
    cursor: "pointer",
    textDecoration: "none",
    fontWeight: 400,
    "&:hover": {
      filter: "brightness(140%)",
    }
  },
  casesGrid: {
    scrollbarWidth: "none",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(20%, 1fr))",
    columnGap: "0.5rem",
    rowGap: "0.5rem",
    maxHeight: "24.5rem",
    overflow: "auto",
    margin: "2rem 0",
    "@media (max-width: 1100px)": {
      gridTemplateColumns: "repeat(auto-fill, minmax(15%, 1fr))",
    },
    "@media (max-width: 700px)": {
      gridTemplateColumns: "repeat(auto-fill, minmax(25%, 1fr))",
    },
  },
  addCaseButton: {
    height: "12rem",
    display: "flex",
    alignItems: "center",
    background: "#101123",
    color: "hsl(220, 22%, 100%)",
    borderRadius: "0.25rem",
    justifyContent: "center",
    cursor: "pointer",
    transitionDuration: "200ms",
    "&:hover": {
      filter: "brightness(120%)"
    }
  },
  button: {
    flex: "none",
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
    color: "#fff",
    backgroundColor: "hsl(215, 75%, 50%)",
    marginRight: "0.5rem",
  },
  buttonIcon: {
    marginRight: ".5em",
    fill: "currentColor",
    flex: "none",
    width: "1.25em",
    height: "1.25em",
    display: "inline-block",
    outline: "none",
  },
  bottomRow: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "1rem"
  },
  caseBox: {
    position: "relative",
    height: "12rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "#101123",
    borderRadius: "0.25rem",
    justifyContent: "center",
    gap: "0.5rem"
  },
  counterBox: {
    display: "flex",
    gap: "0.75rem",
    alignItems: "center",
    backgroundColor: "#1a1b33",
    borderRadius: "3px",
    padding: "0 0.5rem",
  },
  addCaseBox: {
    display: "flex",
    gap: "0.25rem",
    alignItems: "center",
    textAlign: "center",
    verticalAlign: "baseline",
    backgroundColor: "#1a1b33",
    borderRadius: "3px",
    fontSize: "13px",
    padding: "0.5rem",
    cursor: "pointer",
    color: "rgb(224, 228, 235)",
  },
  caseOptionsBox: {
    display: "grid",
    scrollbarWidth: "none",
    gridTemplateColumns: "repeat(auto-fill, minmax(20%, 1fr))",
    columnGap: "0.5rem",
    rowGap: "0.5rem",
    maxHeight: "25rem",
    minHeight: "25rem",
    overflow: "auto",
    "@media (max-width: 1100px)": {
      gridTemplateColumns: "repeat(auto-fill, minmax(15%, 1fr))",
    },
    "@media (max-width: 700px)": {
      gridTemplateColumns: "repeat(auto-fill, minmax(25%, 1fr))",
    },
  },
  inputSearch: {
    borderRadius: "0.25rem",
    width: "100%",
    outline: "none",
    background: "#101123",
    color: "hsl(220, 22%, 100%)",
    "& input": {
      height: "2.5rem",
      width: "100%",
      color: "hsl(220, 22%, 100%)",
      fontFamily: "Poppins",
      borderBottom: "none", 
      "::placeholder": {
        color: "hsl(220, 22%, 100%)", 
        fontFamily: "Poppins",
      },
    },
    "&:hover": {
      "& .MuiInput-underline:before": {
        borderBottom: "none",
      },
    },
    "& .MuiInput-underline:before": {
      borderBottom: "none", 
      fontFamily: "Poppins",
    },
    "& .MuiInput-underline:after": {
      borderBottom: "none",
      fontFamily: "Poppins",
    },
    "& .MuiInputAdornment-root": {
      color: "hsl(220, 22%, 100%)", 
      fontFamily: "Poppins",
    },
  },
  middleText: {
    color: "#9E9FBD",
    display: "flex",
    justifyContent: "space-between",
  },
  clearSelction: {
    cursor: "pointer",
    textDecorationLine: "underline",
    fontWeight: 500,
    userSelect: "none"
  },
  crazySwitch: {
    "& .MuiSwitch-colorSecondary.Mui-checked": {
      color: "rgb(63,74,98)"
    },
    "& .MuiSwitch-colorSecondary.Mui-checked + .MuiSwitch-track": {
      backgroundColor: "rgb(63,74,98)"
    }
  },
  infoButton: {
    position: "absolute",
    height: 15,
    width: 15,
    top: 10, 
    right: 10,
    color: "infoButton",
    cursor: "pointer"
  }
}));

const CreateBattle = ({ open, handleClose }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();
  const history = useHistory();

  const [loading, setLoading] = useState(true);
  const [availableCases, setAvailableCases] = useState([]);
  const [selectedCases, setSelectedCases] = useState([]);
  const [totalCaseCount, setTotalCaseCount] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [selectedMode, setSelectedMode] = useState("1v1");
  const [selectedBox, setSelectedBox] = useState("standard");
  const [addCasesDialogOpen, setAddCasesDialogOpen] = useState(false);
  const [sortType, setSortType] = useState("highest");
  const [searchInputState, setSearchInputState] = useState("");
  const [creating, setCreating] = useState(false);
  const [caseData, setCaseData] = useState({});
  const [openCase, setOpenCase] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const cases = await getActiveCases();
        setAvailableCases(cases);      
        setLoading(false)
      } catch (error) {
        console.log("There was an error while loading active case data:", error);
      }
    };
    
    if (open) {
      fetchData();
    } else {

    }

    const error = msg => {
      setCreating(false);
      addToast(msg, { appearance: "error" });
      playSound(errorAudio);
    };

    const success = msg => {
      addToast(msg, { appearance: "success" });
    };

    const fwd = (battleId) => {
      setCreating(false);
      history.push(`/battles/${battleId}`);
    }
    
    battlesSocket.on("battles:error", error);
    battlesSocket.on("battles:success", success);
    battlesSocket.on("battles:created", fwd);

    return () => {
      battlesSocket.off("battles:error", error);
      battlesSocket.off("battles:success", success);
      battlesSocket.off("battles:created", fwd);
    };
  }, [open]);

  const handleCreateBattle = () => {
    setCreating(true);
    playSound(placebetAudio);
    battlesSocket.emit(
      "battles:create",
      selectedCases,
      selectedBox,
      selectedMode,
      totalCost,
      totalCaseCount,
    )
  };

  const changeState = (state) => {
    if(selectedBox == state) {
      setSelectedBox("standard");
    } else {
      setSelectedBox("crazy");
    }
  };

  const handleClick = async (item) => {
    let newarr = selectedCases;
    newarr.push(item);
    newarr.sort((a, b) => a.price - b.price)
    setSelectedCases(newarr);
    setTotalCaseCount(totalCaseCount+1);
    setTotalCost(parseFloat((totalCost).toFixed(2))+parseFloat((item.price).toFixed(2)));
  };

  const handleRemoveOne = async (item) => {
    const arr = selectedCases;
    const index = selectedCases.findIndex(obj => obj.id === item.id);
    if (index !== -1) {
      arr.splice(index, 1);
    }
    setSelectedCases(arr);
    setTotalCaseCount(totalCaseCount-1);
    setTotalCost(parseFloat((totalCost).toFixed(2))-parseFloat((item.price).toFixed(2)));
  };

  const handleAddOne = async (item) => {
    let newarr = selectedCases;
    newarr.push(item);
    newarr.sort((a, b) => a.price - b.price);
    setSelectedCases(newarr);
    setTotalCaseCount(totalCaseCount+1);
    setTotalCost(parseFloat((totalCost).toFixed(2))+parseFloat((item.price).toFixed(2)));
  };

  const handleSearchInputChange = event => {
    setSearchInputState(event.target.value);
  };

  const updateCase = (item) => {
    setCaseData(item);
    setOpenCase(true);
  }

  const renderCaseOptions = () => {
    let sortedCases = [...availableCases]; 

    const searchInput = searchInputState; 
    const filteredCases = sortedCases.filter(item =>
      item.name.toLowerCase().includes(searchInput.toLowerCase())
    );

    if (sortType === "highest") {
      filteredCases.sort((a, b) => b.price - a.price);
    } else if (sortType === "lowest") {
      filteredCases.sort((a, b) => a.price - b.price);
    }

    let allBoxes = [];
    try {
      filteredCases.map((item, i) => {
        allBoxes.push(
          <div className={classes.caseBox} key={item.id} >
            <motion.svg onClick={() => updateCase(item)} whileTap={{ scale: 0.9 }} className={classes.infoButton} xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none"><path d="M12 17V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="1" cy="1" r="1" transform="matrix(1 0 0 -1 11 9)" fill="currentColor"/><path d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></motion.svg>
            <div className={classes.caseImage}>
              <img src={item.image} style={{ width: "100px" }}/>
            </div>
            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
              <div style={{color: "hsl(220, 22%, 85%)", fontSize: "12px"}}>{item.name}</div>
              <div style={{display: "flex", alignItems: "center", gap: "0.25rem"}}>
                
              </div>
            </div>
            {selectedCases.find(e => e.id === item.id) ? (
              <div>
                <div className={classes.counterBox} style={{padding: "0.2rem 0.5rem"}}>
                <div style={{ cursor: "pointer", fontSize: "20px", userSelect: "none", fontWeight: 550}} onClick={() => handleRemoveOne(item)}>-</div>
                  {selectedCases.filter((caseItem) => caseItem.id === item.id).length}
                  <div style={{ cursor: "pointer", fontSize: "20px", userSelect: "none", fontWeight: 550}} onClick={() => handleAddOne(item)}>+</div>
                </div>
              </div>
            ) : (
              <div className={classes.addCaseBox} onClick={() => handleClick(item)}>
                <img style={{height: 14, width: 14}} src={coin} />
                {parseCommasToThousands(parseFloat((item.price)))}
              </div>
            )}
          </div>
        );
      });
    } catch (error) {
      console.log(error)
    }
    return allBoxes;
  };  

  const renderSelectedCases = () => {
    let allBoxes = [];
      try {
      const uniqueCases = [...new Set(selectedCases.map((item) => item.id))];
  
      uniqueCases.forEach((id) => {
        const item = selectedCases.find((item) => item.id === id);
  
        allBoxes.push(
          <div className={classes.caseBox} key={item.id} >
            <div className={classes.caseImage}>
              <img src={item.image} style={{ width: "80px" }}/>
            </div>
            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
              <div style={{color: "hsl(220, 22%, 85%)", fontSize: "12px"}}>{item.name}</div>
              <div style={{display: "flex", alignItems: "center", gap: "0.25rem"}}>
                <img style={{height: 14, width: 14}} src={coin} />
                {parseCommasToThousands(parseFloat((item.price)))}
              </div>
            </div>
            <div className={classes.caseCount}>
              <div className={classes.counterBox}>
              <div style={{ cursor: "pointer", fontSize: "20px", userSelect: "none", fontWeight: 550}} onClick={() => handleRemoveOne(item)}>-</div>
                {selectedCases.filter((caseItem) => caseItem.id === item.id).length}
                <div style={{ cursor: "pointer", fontSize: "20px", userSelect: "none", fontWeight: 550}} onClick={() => handleAddOne(item)}>+</div>
              </div>
            </div>
          </div>
        );
      });
    } catch (error) {
      console.log(error);
    }
  
    return allBoxes;
  };

  return (
      <Dialog
        className={classes.modal}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >    
        {!addCasesDialogOpen ? (
          <div className={classes.titleBox} onClose={handleClose} >
            <span style={{flex: "auto", fontSize: "1.5rem", color: "#E0E4EB" }}>Create Battle</span>
            <svg className={classes.buttonIcon} style={{cursor: "pointer"}} onClick={() => handleClose()} fill="currentColor" tabIndex="-1" viewBox="0 0 320 512"><path d="M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z"></path></svg>
          </div>
          ): (
          <div className={classes.titleBox} onClose={handleClose} >
            <span style={{flex: "auto", fontSize: "1.5rem", color: "#E0E4EB" }}>Add Cases</span>
            <svg style={{cursor: "pointer", height: 25, width: 25}} onClick={() => setAddCasesDialogOpen(!addCasesDialogOpen)} width="75" height="78" viewBox="0 0 75 78" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M44.9688 24.1324L31.0312 37.5L44.9688 50.8676" stroke="#fff" strokeWidth="3"></path><rect x="1.5" y="1.5" width="72" height="72.1676" rx="25.5" stroke="#fff" strokeWidth="3"></rect></svg>
          </div>    
        )}
        <div className={classes.content} >
          <CaseModal
            open={openCase}
            handleClose={() => setOpenCase(!openCase)}
            caseData={caseData}
          />
          {!addCasesDialogOpen ? (
            <div>
              <div style={{color: "#9E9FBD"}}>Choose the game mode and the number of players you desire.</div>
              <div className={classes.topBar}>
                <div className={classes.mainBox}>
                  <div className={classes.mainHeader}>
                    <svg style={{ height: "1.5rem", width: "1.5rem" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" id="Sword"><script xmlns=""/><g data-name="Layer 82" fill="#ffffff" class="color000000 svgShape"><path d="M7.64,19.34a1.85,1.85,0,0,0,.46.71L18.63,30.58l12-11.95L20.05,8.1a1.85,1.85,0,0,0-.71-.46L4.7,2.13A2,2,0,0,0,2.13,4.7Z" fill="#ffffff" class="color000000 svgShape"/><path d="M25.07,50.88,55.9,20.05a2,2,0,0,0,.46-.71L61.87,4.71A2,2,0,0,0,59.3,2.13L44.66,7.64A2,2,0,0,0,44,8.1L13.12,38.93l-2.07-2.07a2,2,0,0,0-2.83,2.83l6.63,6.63L2.59,58.59a2,2,0,0,0,2.82,2.82L17.68,49.15l6.63,6.63A2,2,0,0,0,27.14,53Z" fill="#ffffff" class="color000000 svgShape"/><path d="M61.41,58.59,49.15,46.32l6.63-6.63A2,2,0,0,0,53,36.86l-2.07,2.07-5.51-5.51L33.42,45.37l5.51,5.51L36.86,53a2,2,0,0,0,2.83,2.83l6.63-6.63L58.59,61.41A2,2,0,0,0,61.41,58.59Z" fill="#ffffff" class="color000000 svgShape"/></g></svg>
                    Regular Battle
                  </div>
                  <div className={classes.selectionContainer}>
                    <div 
                      className={selectedMode == "1v1" ? classes.active : classes.notactive}
                      onClick={() => setSelectedMode("1v1")}
                    >
                      1v1
                    </div>
                    <div 
                      className={selectedMode == "1v1v1" ? classes.active : classes.notactive}
                      onClick={() => setSelectedMode("1v1v1")}
                    >
                      3 Way
                    </div>
                    <div 
                      className={selectedMode == "1v1v1v1" ? classes.active : classes.notactive}
                      onClick={() => setSelectedMode("1v1v1v1")}
                    >
                      4 Way
                    </div>
                  </div>
                </div>
                <div className={classes.mainBox}>
                  <div className={classes.mainHeader}>
                    <svg style={{ height: "1.5rem", width: "1.5rem" }} xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" strokeLinejoin="round" stroke-miterlimit="2" clipRule="evenodd" viewBox="0 0 48 48" id="Group"><script xmlns=""/><path d="M155.469,79.103C155.009,79.037 154.52,79 154,79C150.17,79 148.031,81.021 147.211,82.028C147.078,82.201 147.007,82.413 147.007,82.632C147.007,82.638 147.007,82.644 147.006,82.649C147,83.019 147,83.509 147,84C147,84.552 147.448,85 148,85L155.172,85C155.059,84.682 155,84.344 155,84C155,84 155,84 155,84C155,82.862 155,81.506 155.004,80.705C155.004,80.135 155.167,79.58 155.469,79.103ZM178,85L158,85C157.735,85 157.48,84.895 157.293,84.707C157.105,84.52 157,84.265 157,84C157,82.865 157,81.515 157.004,80.711C157.004,80.709 157.004,80.707 157.004,80.705C157.004,80.475 157.084,80.253 157.229,80.075C158.47,78.658 162.22,75 168,75C174.542,75 177.827,78.651 178.832,80.028C178.943,80.197 179,80.388 179,80.583L179,84C179,84.265 178.895,84.52 178.707,84.707C178.52,84.895 178.265,85 178,85ZM180.828,85L188,85C188.552,85 189,84.552 189,84L189,82.631C189,82.41 188.927,82.196 188.793,82.021C187.969,81.021 185.829,79 182,79C181.507,79 181.042,79.033 180.604,79.093C180.863,79.546 181,80.06 181,80.585L181,84C181,84.344 180.941,84.682 180.828,85ZM154,67C151.24,67 149,69.24 149,72C149,74.76 151.24,77 154,77C156.76,77 159,74.76 159,72C159,69.24 156.76,67 154,67ZM182,67C179.24,67 177,69.24 177,72C177,74.76 179.24,77 182,77C184.76,77 187,74.76 187,72C187,69.24 184.76,67 182,67ZM168,59C164.137,59 161,62.137 161,66C161,69.863 164.137,73 168,73C171.863,73 175,69.863 175,66C175,62.137 171.863,59 168,59Z" transform="translate(-144 -48)" fill="#ffffff" class="color000000 svgShape"/></svg>
                    Team Battle
                  </div>
                  <div className={classes.selectionContainer}>
                    <div 
                      className={selectedMode == "2v2" ? classes.active : classes.notactive}
                      onClick={() => setSelectedMode("2v2")}
                    >
                      2v2
                    </div>
                  </div>
                </div>
                <div className={classes.mainBox}>
                  <div className={classes.mainHeader}>
                    <svg style={{ height: "1.5rem", width: "1.5rem" }} xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64"><g><g><path d="M53.56,27.37c-0.55,0-1.07,0.15-1.53,0.4c-2.48-1.6-4.8-2.35-6.92-2.55c0.66-1.69,2.18-4.68,4.77-4.75    c0.59,0.58,1.39,0.94,2.28,0.94c1.8,0,3.26-1.47,3.26-3.27c0-1.8-1.46-3.27-3.26-3.27c-0.73,0-1.39,0.24-1.93,0.64    C41.8,11.68,37,15.35,34.57,18.74c-1.27-1.85-2.95-3.58-5.14-4.73c-3.89-2.05-8.58-1.85-13.92,0.59c-0.6-0.64-1.44-1.04-2.38-1.04    c-1.8,0-3.27,1.46-3.27,3.26c0,1.81,1.47,3.27,3.27,3.27c0.87,0,1.66-0.35,2.25-0.9c3.24,0.38,5.06,4.3,5.76,6.23    c-5.15,0.33-9.92,2.71-10.45,2.98c-0.08-0.01-0.17-0.02-0.25-0.02c-1.81,0-3.27,1.46-3.27,3.26c0,1.81,1.46,3.27,3.27,3.27    c0.8,0,1.52-0.3,2.09-0.78l0.69-0.15c1.43-0.22,2.52,0.03,3.34,0.75c1.41,1.22,1.73,3.56,1.8,4.92c-0.43,0.1-0.86,0.19-1.29,0.29    c-0.45,0.11-0.77,0.51-0.77,0.97v6.87c0,0.43,0.28,0.82,0.69,0.95c5.44,1.77,10.92,2.65,16.4,2.65c5.48,0,10.96-0.88,16.4-2.65    c0.42-0.13,0.69-0.52,0.69-0.95v-6.87c0-0.46-0.31-0.86-0.76-0.97c-0.46-0.11-0.93-0.21-1.39-0.31c-0.24-3.66,0.21-6.55,1.2-7.46    c0.2-0.18,0.5-0.36,1.02-0.29c0.49,1.19,1.65,2.02,3.01,2.02c1.81,0,3.27-1.46,3.27-3.26C56.83,28.83,55.37,27.37,53.56,27.37z     M52.16,16.87c0.69,0,1.26,0.57,1.26,1.27c0,0.7-0.57,1.27-1.26,1.27c-0.7,0-1.27-0.57-1.27-1.27    C50.89,17.44,51.46,16.87,52.16,16.87z M10.44,32.91c-0.7,0-1.27-0.57-1.27-1.27c0-0.7,0.57-1.26,1.27-1.26    c0.69,0,1.26,0.56,1.26,1.26C11.7,32.34,11.13,32.91,10.44,32.91z M16.35,17.32c0.02-0.16,0.05-0.32,0.05-0.5    c0-0.14-0.03-0.27-0.04-0.41c4.75-2.16,8.83-2.37,12.13-0.64c5.59,2.94,7.42,10.62,7.71,11.97c-1.77,1.2-3.05,2.56-3.74,3.38    c-0.97-1.86-2.3-3.3-4-4.27c-1.61-0.92-3.4-1.34-5.2-1.44C22.7,23.65,20.68,18.35,16.35,17.32z M48.48,41.71v5.34    c-10.01,3.1-20.16,3.1-30.18,0v-5.34C28.32,39.42,38.47,39.42,48.48,41.71z M50.39,29.88c-0.84-0.01-1.59,0.25-2.21,0.81    c-1.84,1.7-2.03,5.65-1.88,8.52c-4.01-0.75-8.03-1.16-12.05-1.21c-0.15-1.79-0.45-3.41-0.92-4.82c0.05-0.05,0.12-0.09,0.17-0.15    c0.28-0.42,7.06-9.94,17.12-3.79C50.52,29.45,50.45,29.66,50.39,29.88z" fill="currentColor" /></g></g></svg>
                    Crazy Mode
                  </div>
                  <div className={classes.selectionContainer} style={{marginTop: "1rem"}}>
                    <Switch
                      className={classes.crazySwitch}
                      checked={selectedBox == "crazy"}
                      onChange={() => changeState("crazy")}
                    />
                  </div>
                </div>
              </div>
              <div className={classes.middleText}>
                <div>Add battle rounds</div>
                <motion.div whileTap={{ scale: 0.97 }} className={classes.clearSelction} onClick={() => { setSelectedCases([]); setTotalCost(0); setTotalCaseCount(0) }}>Clear Selection</motion.div>
              </div>
              <div className={classes.casesGrid}>
                <div className={classes.addCaseButton} onClick={() => setAddCasesDialogOpen(!addCasesDialogOpen)}> + Add Round </div>
                {renderSelectedCases()}
              </div>
            </div>
          ): (
            <div>
              <TextField
                className={classes.inputSearch}
                value={searchInputState}
                onChange={handleSearchInputChange}
                placeholder="Search cases..."
                InputProps={{
                  endAdornment: (<div style={{display: "flex"}}>
                    <div className={classes.button} style={{ fontSize: "0.7rem", backgroundColor: "transparent" }}
                    onClick={() => setSortType("highest")}>High</div>
                    <div className={classes.button} style={{ fontSize: "0.7rem", backgroundColor: "transparent" }}
                    onClick={() => setSortType("lowest")}>Low</div>
                  </div>),
                  startAdornment: (<svg style={{height: 40, width: 40, margin: "0 0.75rem"}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><div xmlns="" id="in-page-channel-node-id" data-channel-name="in_page_channel_lafwh7" bis_skin_checked="1"/><path d="M9.75 3C13.4777 3 16.5 6.02232 16.5 9.75C16.5 11.3098 15.9662 12.7414 15.0774 13.8844L20.7525 19.5594C20.9173 19.7243 21 19.9397 21 20.1562C21 20.3722 20.9173 20.5882 20.7525 20.7531C20.5882 20.9179 20.3723 21 20.1562 21C19.9402 21 19.7242 20.9179 19.56 20.7531L13.8844 15.0774C12.7414 15.9662 11.3098 16.5 9.75 16.5C6.02232 16.5 3 13.4777 3 9.75C3 6.02232 6.02232 3 9.75 3ZM9.75 14.8125C12.5417 14.8125 14.8125 12.5417 14.8125 9.75C14.8125 6.95832 12.5417 4.6875 9.75 4.6875C6.95832 4.6875 4.6875 6.95832 4.6875 9.75C4.6875 12.5417 6.95832 14.8125 9.75 14.8125Z" fill="#9E9FBD"/></svg>),
                }}
              />
              <div style={{width: "100%", border: "#1a1b33", margin: "0.5rem auto",}} />
              <div className={classes.caseOptionsBox}>
                {renderCaseOptions()}
              </div>
            </div>
          )}
          <div className={classes.bottomRow}>
            <div style={{display: "flex", alignItems: "center", gap: "0.25rem"}}>
              <img style={{height: 14, width: 14}} src={coin} />
              {parseCommasToThousands(cutDecimalPoints(totalCost))} - {totalCaseCount} {totalCaseCount == 0 ? "Cases" : totalCaseCount > 1 ? "Cases" : "Case"}
            </div>
            {!addCasesDialogOpen ? 
            <motion.div 
              className={classes.button} 
              onClick={() => handleCreateBattle()}
              whileTap={{ scale: 0.97 }}
              style={{
                pointerEvents: creating ? "none" : "all", 
                opacity: creating ? 0.5 : 1, 
                cursor: creating ? "not-allowed" : "pointer" 
              }}
            >
              {creating ? "Creating..." : "Create Battle"}
            </motion.div> : <div className={classes.button} onClick={() => setAddCasesDialogOpen(!addCasesDialogOpen)}>
              <svg className={classes.buttonIcon} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg>
              Add Cases
            </div>}
          </div>  
        </div> 
      </Dialog>
  );
};

export default CreateBattle;