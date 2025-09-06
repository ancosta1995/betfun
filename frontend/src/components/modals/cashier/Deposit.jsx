import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core";
import { tryCreateOrderSkinsBack } from "../../../services/api.service.js";

// Components
import Bitcoin from "./deposit/Bitcoin";
import Ethereum from "./deposit/Ethereum";
import Litecoin from "./deposit/Litecoin";
import Dogecoin from "./deposit/Dogecoin";
import Trx from "./deposit/Trx";
import Bnb from "./deposit/Bnb";
import Ton from "./deposit/Ton";

import Usdt from "./deposit/Usdt";
import Usdc from "./deposit/Usdc";
import Giftcard from "./deposit/Giftcard";
import Sol from "./deposit/Sol";

// Assets
import bitcoin from "../../../assets/cashier/bitcoin.png";
import ethereum from "../../../assets/cashier/ether.png";
import litecoin from "../../../assets/cashier/litecoin.png";
import dogecoin from "../../../assets/cashier/dogecoin.png";
import usdtimg from "../../../assets/cashier/usdt-erc20.png";
import usdcimg from "../../../assets/cashier/usdc.png";
import solimg from "../../../assets/cashier/solanalogo.png";

import credit from  "../../../assets/cashier/credit.png";
import gift from  "../../../assets/cashier/giftcard.png";
import dota2 from "../../../assets/cashier/dota.png";
import rust from "../../../assets/cashier/rust.png";
import csgo from "../../../assets/cashier/csgo.png";

// Custom Styles
const useStyles = makeStyles(theme => ({
  modal: {
    fontFamily: "Poppins",
    "& .MuiDialog-paperWidthSm": {
      scrollbarWidth: "none",
      maxWidth: "800px !important",
      width: "100%",
      background: "#050614",
      borderRadius: "0.5em",
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
    overflow: "hidden",
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
  tabContainer: {
    marginBottom: "2em",
    display: "flex",
    borderBottom: "1px solid #272847",
  },
  tabButton: {
    color: "#9E9FBD",
    fontWeight: 500,
    userSelect: "none",
    paddingLeft: "0.5em",
    paddingRight: "0.5em",
    paddingBottom: "0.5em",
    cursor: "pointer",
    transitionDuration: "300ms",
    borderBottom: "2px solid transparent"
  },
  buttonActive: {
    color: "hsl(220, 22%, 90%)",
    borderBottom: "2px solid hsl(220, 22%, 90%)"
  },
  lowerSection: {
    display: "grid",
    padding: "1.25rem",
    gap: "1.5rem"
  },
  container: {
    display: "flex",
    width: "calc(200% + 3rem)",
    gap: "3rem",
    transition: "transform 0.75s",
  },
  sectionContainer: {
    gap: "0.75rem",
    gridTemplateColumns: "repeat(1,minmax(0,1fr))",
    width: "100%",
    display: "grid",
    paddingBottom: "0.5rem"
  },
  coin: {
    position: "absolute",
    top: 0,
    left: 0
  },
  grid: {
    gridTemplateColumns: "repeat(5,minmax(0,1fr))",
    gap: "0.75rem",
    width: "100%",
    display: "grid",
    outline: 0,
  },
  gridv2: {
    gridTemplateColumns: "repeat(3,minmax(0,1fr))",
    gap: "0.75rem",
    width: "100%",
    display: "grid",
    outline: 0,
  },
  choiceBox: {
    userSelect: "none",
    cursor: "pointer",
    borderRadius: "0.5rem",
    height: "120px",
    width: "100%",
    backgroundColor: "#101123",
    padding: "0.5rem",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    gap: "0.75rem",
    textAlign: "center",
    transitionDuration: "300ms",
    position: "relative",
    zIndex: 1,
    "&:hover" : {
      "& > div": {
        opacity: 1
      },
    },
    [theme.breakpoints.down("xs")]: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
  },
  imageContainer: {
    backgroundColor: "#0A0B1C",
    borderRadius: "0.5rem",
    padding: "1rem",
    width: "100%",
    overflow: "visible",
    display: "flex",
    position: "relative",
    alignItems: "center",
    zIndex: 3,
    justifyContent: "center"
  },
  optionImage: {
    width: "32px",
    height: "32px",
    maxHeight: "100%",
    zIndex: 4
  },
  box: {
    userSelect: "none",
    cursor: "pointer",
    borderRadius: "0.5rem",
    height: "100px",
    width: "100%",
    backgroundColor: "#101123",
    padding: "0.5rem",
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    gap: "0.5rem",
    textAlign: "center",
    transitionDuration: "300ms",
    "&:hover": {
      filter: "brightness(125%)"
    },
    [theme.breakpoints.down("xs")]: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
  },
  image: {
    maxHeight: "100%",
    backgroundColor: "#0A0B1C",
    width: "70px",
    padding: "0.5rem",
    borderRadius: "0.5rem",
  },
  optionText: {
    color: "#fff",
    fontSize: "12px",
    zIndex: 3,
    [theme.breakpoints.down("xs")]: {
      display: "none"
    },
  },
  gradientBitcoin: {
    position: "absolute",
    borderRadius: "0.5rem",
    background: "radial-gradient(1247.5% 175% at 0% 0%, #101123 0%, #f4941c 100%)",
    transition: "0.5s all",
    zIndex: 2,
    opacity: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  gradientEthereum: {
    position: "absolute",
    borderRadius: "0.5rem",
    background: "radial-gradient(1247.5% 175% at 0% 0%, #101123 0%, #647cec 100%)",
    transition: "0.5s all",
    zIndex: 2,
    opacity: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  gradientLitecoin: {
    position: "absolute",
    borderRadius: "0.5rem",
    background: "radial-gradient(1247.5% 175% at 0% 0%, #101123 0%, #3389B9 100%)",
    transition: "0.5s all",
    zIndex: 2,
    opacity: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  gradientUSDT: {
    position: "absolute",
    borderRadius: "0.5rem",
    background: "radial-gradient(1247.5% 175% at 0% 0%, #101123 0%, #50b494 100%)",
    transition: "0.5s all",
    zIndex: 2,
    opacity: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  gradientTRON: {
    position: "absolute",
    borderRadius: "0.5rem",
    background: "radial-gradient(1247.5% 175% at 0% 0%, #101123 0%, #e1b303 100%)",
    transition: "0.5s all",
    zIndex: 2,
    opacity: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  gradientDODA: {
    position: "absolute",
    borderRadius: "0.5rem",
    background: "radial-gradient(1247.5% 175% at 0% 0%, #101123 0%, #a50809 100%)",
    transition: "0.5s all",
    zIndex: 2,
    opacity: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  gradientUSDC: {
    position: "absolute",
    borderRadius: "0.5rem",
    background: "radial-gradient(1247.5% 175% at 0% 0%, #101123 0%, #2474cc 100%)",
    transition: "0.5s all",
    zIndex: 2,
    opacity: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  gradientRUST: {
    position: "absolute",
    borderRadius: "0.5rem",
    background: "radial-gradient(1247.5% 175% at 0% 0%, #101123 0%, #ff5434 100%)",
    transition: "0.5s all",
    zIndex: 2,
    opacity: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  gradientCSGO: {
    position: "absolute",
    borderRadius: "0.5rem",
    background: "radial-gradient(1247.5% 175% at 0% 0%, #101123 0%, #E19001 100%)",
    transition: "0.5s all",
    zIndex: 2,
    opacity: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  gradientKINGUIN: {
    position: "absolute",
    borderRadius: "0.5rem",
    background: "radial-gradient(1247.5% 2300% at 0% 0%, #101123 0%, #fff 100%)",
    transition: "0.5s all",
    zIndex: 2,
    opacity: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  gradientCASHAPP: {
    position: "absolute",
    borderRadius: "0.5rem",
    background: "radial-gradient(1247.5% 175% at 0% 0%, #101123 0%, #04d32c 100%)",
    transition: "0.5s all",
    zIndex: 2,
    opacity: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  gradientCREDIT: {
    position: "absolute",
    borderRadius: "0.5rem",
    background: "radial-gradient(1247.5% 175% at 0% 0%, #101123 0%, #113675 100%)",
    transition: "0.5s all",
    zIndex: 2,
    opacity: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  gradientSolana: {
    position: "absolute",
    borderRadius: "0.5rem",
    background: "radial-gradient(1247.5% 175% at 0% 0%, #3b08dc 0%, #BABABA 100%)",
    transition: "0.5s all",
    zIndex: 2,
    opacity: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
}));

const Deposit = ({ user }) => {
  // Declare State
  const classes = useStyles();

  const [btc, setBtc] = useState(false);
  const [eth, setEth] = useState(false);
  const [ltc, setLtc] = useState(false);
  const [doge, setDoge] = useState(false);
  const [usdt, setUsdt] = useState(false);
  const [sol, setSol] = useState(false);

  const [usdc, setUsdc] = useState(false);
  const [card, setCard] = useState(false);
  const [gifts, setGifts] = useState(false);
  const [skins, setSkins] = useState(false);
  const [sbIframeUrl, setSbIframeUrl] = useState("");
  const [method, setMethod] = useState(null);
  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        let order_data = await tryCreateOrderSkinsBack(user._id);
        setSbIframeUrl(`https://skinsback.com/pay/${order_data.hash}`);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
    
    if (method) setAnimation(true);   
  }, [skins, user, method]);

  const handleClose = () => {
    setAnimation(false);
    setTimeout(() => {
      setMethod(null);
    }, 750); 
  };

  const renderPaymentComponent = () => {
    switch (method) {
      case "btc":
        return <Bitcoin handleClose={handleClose} />;
      case "eth":
        return <Ethereum handleClose={handleClose} />;
      case "ltc":
        return <Litecoin handleClose={handleClose} />;
      case "doge":
        return <Dogecoin handleClose={handleClose} />;
        case "ton":
          return <Ton handleClose={handleClose} />;
          case "bnb":
          return <Bnb handleClose={handleClose} />;
          case "trx":
          return <Trx handleClose={handleClose} />;

      case "usdt":
        return <Usdt handleClose={handleClose} />;
      case "usdc":
        return <Usdc handleClose={handleClose} />;
        case "sol":
          return <Sol handleClose={handleClose} />;
  
      case "gifts":
        return <Giftcard handleClose={handleClose} />;
      case "giftcard":
        return <Giftcard  handleClose={handleClose} />;
      default:
        return null;
    }
  };

  return (
    <div className={classes.container} style={{ transform: animation ? "translateX(calc(-50%))" : "translateX(0)" }}>
      <div style={{width: "50%"}}>   
        {/* <div className={classes.sectionContainer}> */}
          {/* <h4 style={{color:"#fff", fontWeight: 500, margin: 0, padding: 0}}>Fiat</h4>
          <div className={classes.grid}>
            <div className={classes.choiceBox} onClick={() => setMethod("card")}>
              <div className={classes.gradientCREDIT} />
              <div className={classes.imageContainer}>
                <img className={classes.optionImage} src={credit} />
              </div>
              <span className={classes.optionText}>Card</span>
            </div>
            <div className={classes.choiceBox} onClick={() => setMethod("cashapp")}>
              <div className={classes.gradientCASHAPP}/>
              <div className={classes.imageContainer}>
                <img className={classes.optionImage} src={cashapp} />
              </div>
              <span className={classes.optionText}>Cashapp</span>
            </div>
            <div className={classes.choiceBox} onClick={() => setMethod("giftcard")}>
              <div className={classes.gradientKINGUIN} />
              <div className={classes.imageContainer}>
                <img className={classes.optionImage} src={gift} />
              </div>
              <span className={classes.optionText}>GiftCard</span>
            </div>
          </div>
        </div> */}
        <div className={classes.sectionContainer} style={{marginTop: "1rem"}}>
          <h4 style={{color:"#fff", fontWeight: 500, margin: 0, padding: 0}}>Cryptocurrency</h4>
          <div className={classes.grid}>
          <div className={classes.choiceBox} onClick={() => setMethod("sol")}>
              <div className={classes.gradientSolana} />
              <div className={classes.imageContainer}>
                <img className={classes.optionImage} src={"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAABOvAAATrwFj5o7DAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAA4FJREFUWIXFl01oXVUUhb91Xn4QRJuMSlVIjbR04EDaitY6atIkENsE/BkLbdJ0ULVG0IEOVFCwoVChIUkdOrH400JpTBoVAi3FqAO1FCU1iqEzk1iFJn33LAcvSZP47nv3kUL37Jyz2N+69+2z375wl0OViI01tIcdMfC0iA8L6gv7/GXCtRAZPzjGhJDvqIGhvd6cxNgrqQPYVEY+bfuMq8IHPcOaWpeBUy2uz8f4llAPUJPF7IqYxz6Z1IZ3Dp/TTMUGTrZ6ay7xWWBLheC1hElJ+7u+1M/FjkOxzYFm783l/e264QCm0dEXB5vcVNzfmhhq8rYoXwLuXzd8tZEbMWhXz4h+SjVwqsX1SfQEsPmOwm/TJpNq7VxZE1UrzxcLrhT8IjBdAfJeoG15ZRpz8/FN4OhtT4vR3+qGkPgqUFs0lfm6rk6tz5/WQhbyJ885NzvnT232rzlaSKxthy/oGqwoQuXja6lw+HG+Wh1Z4QAzc/HDInCAmpziK0uLAIUOJ2lfSq7rWO1HzuvvrPDBJvdi9aQr1GksWPwJ+lv8eIi+XExq/J4IP2SFIxqw3yflit/Oq52HRjVRBaDI7vR8egMyt/bM0gBPAQUDODailKYovdQ9ohNZ+f2tbgjRlzAbS/uMjywaAQU2pCt9fLDZnVkN9AxrKqB24N8y0g3LBhxLvrhg/PFQk5/IauLgiL7DegFIymmXCmWujO6eGPx5f6sbsprovqBzSEdLSGZhqRMqTJatHrMxJP5toDlm9QAukdNhctlAiIy75KUBICK9jpnKzCc+VrhF/48QGIfFPmCswWb/ATyYnk693aPqywr/qNmb8vhySs7prlE9JFR47sIM5zPpbPdXAj/R5vvyeDgFjuTPlubG5Rcfc+EYMF9Ef/76QjiSFT6w3dW1eZ8GHk2R3Az5sPwwq7rPwN7kONbLaw0A/2Q1ADwA7Eo/dl/3aK53abVqHkiqw9u5W34G07hiu407F7/W3ArvrtxYVfuFSUXtlO8LlYe5oaDOF7/RbKoBgO4RXZX1LJD57zdDzFnqLDYZp47lg3u8xfJZxNZ1ocWkE+07NKYrxY5T20/XmH5JavUk9nGK345ycRPcV7OgHWnwgr8MUZgX46ugDko2KwD+BH+RS8KxA1/p93K5K/44HWhmu8xuFBtt6gAkZnCYDIHxAyN8X8nH6V2P/wA8OVXfgv+0tgAAAABJRU5ErkJggg=="} />
              </div>
              <span className={classes.optionText}>Solana</span>
            </div>

            <div className={classes.choiceBox} onClick={() => setMethod("btc")}>
              <div className={classes.gradientBitcoin} />
              <div className={classes.imageContainer}>
                <img className={classes.optionImage} src={bitcoin} />
              </div>
              <span className={classes.optionText}>Bitcoin</span>
            </div>
            <div className={classes.choiceBox} onClick={() => setMethod("eth")}>
              <div className={classes.gradientEthereum} />
              <div className={classes.imageContainer}>
                <img className={classes.optionImage} src={ethereum} />
              </div>
              <span className={classes.optionText}>Ethereum</span>
            </div>
            <div className={classes.choiceBox} onClick={() => setMethod("ltc")}>
              <div className={classes.gradientLitecoin} />
              <div className={classes.imageContainer}>
                <img className={classes.optionImage} src={litecoin} />
              </div>
              <span className={classes.optionText}>Litecoin</span>
            </div>
            <div className={classes.choiceBox} onClick={() => setMethod("usdt")}>
              <div className={classes.gradientUSDT} />
              <div className={classes.imageContainer}>
                <img className={classes.optionImage} src={usdtimg} />
              </div>
              <span className={classes.optionText}>USDT</span>
            </div>
            <div className={classes.choiceBox} onClick={() => setMethod("usdc")}>
              <div className={classes.gradientUSDC} />
              <div className={classes.imageContainer}>
                <img className={classes.optionImage} src={usdcimg} />
              </div>
              <span className={classes.optionText}>USDC</span>
            </div>
            <div className={classes.choiceBox} onClick={() => setMethod("trx")}>
              <div className={classes.gradientSolana} />
              <div className={classes.imageContainer}>
                <img className={classes.optionImage} src={"https://app.oxapay.com/media/svg/coins/tron.svg"} />
              </div>
              <span className={classes.optionText}>TRX</span>
            </div>
            <div className={classes.choiceBox} onClick={() => setMethod("bnb")}>
              <div className={classes.gradientSolana} />
              <div className={classes.imageContainer}>
                <img className={classes.optionImage} src={"https://app.oxapay.com/media/svg/coins/bnb.svg"} />
              </div>
              <span className={classes.optionText}>BNB</span>
            </div>
            <div className={classes.choiceBox} onClick={() => setMethod("ton")}>
              <div className={classes.gradientSolana} />
              <div className={classes.imageContainer}>
                <img className={classes.optionImage} src={"https://app.oxapay.com/media/svg/coins/ton.svg"} />
              </div>
              <span className={classes.optionText}>TON</span>
            </div>
            <div className={classes.choiceBox} onClick={() => setMethod("doge")}>
              <div className={classes.gradientSolana} />
              <div className={classes.imageContainer}>
                <img className={classes.optionImage} src={"https://app.oxapay.com/media/svg/coins/dogecoin.svg"} />
              </div>
              <span className={classes.optionText}>DOGE</span>
            </div>

          </div>
        </div>    
        <div className={classes.sectionContainer} style={{marginTop: "1rem"}}>
          <h4 style={{color:"#fff", fontWeight: 500, margin: 0, padding: 0}}>Steam</h4>
          <div className={classes.grid}>
            <a href={sbIframeUrl} style={{textTransform: "none", underline: "none"}}>
              <div className={classes.choiceBox}>
                <div className={classes.gradientCSGO} />
                <div className={classes.imageContainer}>
                  <img className={classes.optionImage} src={csgo} />
                </div>
                <span className={classes.optionText} style={{textTransform: "none", underline: "none"}}>CSGO</span>
              </div>
            </a>
            <a href={sbIframeUrl} style={{textTransform: "none", underline: "none"}}>
              <div className={classes.choiceBox}>
                <div className={classes.gradientRUST} />
                <div className={classes.imageContainer}>
                  <img className={classes.optionImage} src={rust} />
                </div>
                <span className={classes.optionText} style={{textTransform: "none", underline: "none"}}>Rust</span>
              </div>
            </a>
            <a href={sbIframeUrl} style={{textTransform: "none", underline: "none"}}>
              <div className={classes.choiceBox}>
                <div className={classes.gradientDODA} />
                <div className={classes.imageContainer}>
                  <img className={classes.optionImage} src={dota2} />
                </div>
                <span className={classes.optionText} style={{textTransform: "none", underline: "none"}}>DOTA2</span>
              </div>
            </a>          
          </div>
        </div>

          </div> 

      <div style={{width: animation ? "" : "3rem"}} />
      
      <div style={{width: "50%"}}>
        {renderPaymentComponent()}
      </div>
    </div>
  );
};

export default Deposit;