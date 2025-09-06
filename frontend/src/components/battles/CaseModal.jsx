import React from "react";
import { makeStyles, withStyles } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import { motion } from "framer-motion";
import parseCommasToThousands from "../../utils/parseCommasToThousands";
import Coin from "../../assets/icons/coin.png";
import Gold from "../../assets/colors/gold.png";
import Red from "../../assets/colors/red.png";
import Purple from "../../assets/colors/purple.png";
import Blue from "../../assets/colors/blue.png";
import Grey from "../../assets/colors/grey.png";
import GoldBG from "../../assets/colors/goldbg.png";
import RedBG from "../../assets/colors/redbg.png";
import PurpleBG from "../../assets/colors/purplebg.png";
import BlueBG from "../../assets/colors/bluebg.png";
import GreyBG from "../../assets/colors/greybg.png";
import GoldBlob from "../../assets/colors/goldblob.png";
import RedBlob from "../../assets/colors/redblob.png";
import PurpleBlob from "../../assets/colors/purpleblob.png";
import BlueBlob from "../../assets/colors/blueblob.png";
import GreyBlob from "../../assets/colors/greyblob.png";

const useStyles = makeStyles(theme => ({
  modal: {
    position: "relative",
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
    padding: "1.5em 1.5em 1.5em 1.5em",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    scrollbarWidth: "none",
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
    position: "absolute",
    top: 35,
    right: 25
  },
  caseDescriptionContainer: {
    fontSize: "20px",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: "1rem",
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
  },
  lootTableContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(145px, 1fr))',
    gap: '1rem',
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    },
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
}));


const CaseModal = ({ open, handleClose, caseData }) => {
  const classes = useStyles();

  if (!caseData || !caseData.items) {
    return null;
  }

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
    <Dialog
      className={classes.modal}
      onClose={handleClose}
      open={open}
    >
      <svg className={classes.buttonIcon} style={{cursor: "pointer"}} onClick={() => handleClose()} fill="currentColor" tabIndex="-1" viewBox="0 0 320 512"><path d="M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z"></path></svg>
      <div className={classes.content}>
        <div className={classes.caseDescriptionContainer}>
          {caseData.name}
          <img src={caseData.image} style={{height: 60, width: 60}} />
        </div>
        <div className={classes.lootTableContainer}>
          {caseData?.items.map((item, index) => {
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
    </Dialog>
  );
};

export default CaseModal;