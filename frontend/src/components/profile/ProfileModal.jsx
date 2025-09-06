import React, { useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import { motion, AnimatePresence } from "framer-motion";

import Account from "./Account";
import Games from "./Games";
import Settings from "./Settings";
import Transactions from "./Transactions";

// Custom Styles
const useStyles = makeStyles(theme => ({
  modal: {
    "& .MuiDialog-paperWidthSm": {
      scrollbarWidth: "none",
      width: "100%",
      height: "60%",
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
  content: {
    display: "flex",
    height: "100%",
    width: "100%"
  },
  componentContainer: {
    width: "calc(100% - 175px)",
    padding: "1rem"
  },
  navBar: {
    height: "100%",
    width: "175px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#101123",
    padding: "0.5rem",
    gap: "0.35rem",
    userSelect: "none",
    fontWeight: 500
  },
  navButton: {
    width: "100%",
    height: "2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingLeft: "0.5rem",
    gap: "0.3rem",
    backgroundColor: "#1a1b33",
    borderRadius: "0.25rem",
    cursor: "pointer",
    color: "#9E9FBD",
    "& > svg": {
      color: "#9E9FBD",
      height: 15,
      width: 15
    }
  },
  activeNavButton: {
    width: "100%",
    height: "2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingLeft: "0.5rem",
    gap: "0.3rem",
    backgroundColor: "#242647",
    borderRadius: "0.25rem",
    cursor: "pointer",
    color: "#fff",
    "& > svg": {
      color: "hsl(215, 75%, 50%)",
      height: 15,
      width: 15
    }
  },
}));

const ProfileModal = ({ open, handleClose }) => {
  const classes = useStyles();

  const [tab, setTab] = useState("account");

  const tabComponents = {
    account: Account,
    games: Games,
    settings: Settings,
    transactions: Transactions,
  };

  const Component = tabComponents[tab] || (() => <div />);

  const variants = {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { type: 'tween', duration: 0.2 } },
    exit: { x: 100, opacity: 0, transition: { type: 'tween', duration: 0.1 } },
  };

  return (
    <Dialog
      className={classes.modal}
      onClose={handleClose}
      open={open}
    >
      <div className={classes.content}>
        <div className={classes.navBar}>
          <motion.div 
            className={tab == "account" ? classes.activeNavButton : classes.navButton}
            animate={{ filter: "brightness(100%)" }} 
            whileHover={{ filter: "brightness(95%)" }} 
            whileTap={{ filter: "brightness(85%)" }} 
            onClick={() => setTab("account")}
          >
            <motion.svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none"><path d="M9.5 9.20455C10.2939 9.20455 11.0553 8.88918 11.6166 8.32781C12.178 7.76644 12.4934 7.00506 12.4934 6.21116C12.4934 5.41727 12.178 4.65589 11.6166 4.09452C11.0553 3.53315 10.2939 3.21777 9.5 3.21777C8.7061 3.21777 7.94472 3.53315 7.38335 4.09452C6.82198 4.65589 6.50661 5.41727 6.50661 6.21116C6.50661 7.00506 6.82198 7.76644 7.38335 8.32781C7.94472 8.88918 8.7061 9.20455 9.5 9.20455ZM9.5 10.5197C5.52009 10.5197 2.96875 12.716 2.96875 13.7853V15.7821H16.0312V13.7853C16.0312 12.4921 13.6159 10.5197 9.5 10.5197Z" fill="currentColor"/></motion.svg>
            Account
          </motion.div>
          <motion.div 
            className={tab == "settings" ? classes.activeNavButton : classes.navButton}
            animate={{ filter: "brightness(100%)" }} 
            whileHover={{ filter: "brightness(95%)" }} 
            whileTap={{ filter: "brightness(85%)" }} 
            onClick={() => setTab("settings")}
          >
            <motion.svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.2788 2.15224C13.9085 2 13.439 2 12.5 2C11.561 2 11.0915 2 10.7212 2.15224C10.2274 2.35523 9.83509 2.74458 9.63056 3.23463C9.53719 3.45834 9.50065 3.7185 9.48635 4.09799C9.46534 4.65568 9.17716 5.17189 8.69017 5.45093C8.20318 5.72996 7.60864 5.71954 7.11149 5.45876C6.77318 5.2813 6.52789 5.18262 6.28599 5.15102C5.75609 5.08178 5.22018 5.22429 4.79616 5.5472C4.47814 5.78938 4.24339 6.1929 3.7739 6.99993C3.30441 7.80697 3.06967 8.21048 3.01735 8.60491C2.94758 9.1308 3.09118 9.66266 3.41655 10.0835C3.56506 10.2756 3.77377 10.437 4.0977 10.639C4.57391 10.936 4.88032 11.4419 4.88029 12C4.88026 12.5581 4.57386 13.0639 4.0977 13.3608C3.77372 13.5629 3.56497 13.7244 3.41645 13.9165C3.09108 14.3373 2.94749 14.8691 3.01725 15.395C3.06957 15.7894 3.30432 16.193 3.7738 17C4.24329 17.807 4.47804 18.2106 4.79606 18.4527C5.22008 18.7756 5.75599 18.9181 6.28589 18.8489C6.52778 18.8173 6.77305 18.7186 7.11133 18.5412C7.60852 18.2804 8.2031 18.27 8.69012 18.549C9.17714 18.8281 9.46533 19.3443 9.48635 19.9021C9.50065 20.2815 9.53719 20.5417 9.63056 20.7654C9.83509 21.2554 10.2274 21.6448 10.7212 21.8478C11.0915 22 11.561 22 12.5 22C13.439 22 13.9085 22 14.2788 21.8478C14.7726 21.6448 15.1649 21.2554 15.3694 20.7654C15.4628 20.5417 15.4994 20.2815 15.5137 19.902C15.5347 19.3443 15.8228 18.8281 16.3098 18.549C16.7968 18.2699 17.3914 18.2804 17.8886 18.5412C18.2269 18.7186 18.4721 18.8172 18.714 18.8488C19.2439 18.9181 19.7798 18.7756 20.2038 18.4527C20.5219 18.2105 20.7566 17.807 21.2261 16.9999C21.6956 16.1929 21.9303 15.7894 21.9827 15.395C22.0524 14.8691 21.9088 14.3372 21.5835 13.9164C21.4349 13.7243 21.2262 13.5628 20.9022 13.3608C20.4261 13.0639 20.1197 12.558 20.1197 11.9999C20.1197 11.4418 20.4261 10.9361 20.9022 10.6392C21.2263 10.4371 21.435 10.2757 21.5836 10.0835C21.9089 9.66273 22.0525 9.13087 21.9828 8.60497C21.9304 8.21055 21.6957 7.80703 21.2262 7C20.7567 6.19297 20.522 5.78945 20.2039 5.54727C19.7799 5.22436 19.244 5.08185 18.7141 5.15109C18.4722 5.18269 18.2269 5.28136 17.8887 5.4588C17.3915 5.71959 16.7969 5.73002 16.3099 5.45096C15.8229 5.17191 15.5347 4.65566 15.5136 4.09794C15.4993 3.71848 15.4628 3.45833 15.3694 3.23463C15.1649 2.74458 14.7726 2.35523 14.2788 2.15224ZM12.5 15C14.1695 15 15.5228 13.6569 15.5228 12C15.5228 10.3431 14.1695 9 12.5 9C10.8305 9 9.47716 10.3431 9.47716 12C9.47716 13.6569 10.8305 15 12.5 15Z" fill="currentColor"/></motion.svg>            
            Settings
          </motion.div>
          <motion.div 
            className={tab == "bets" ? classes.activeNavButton : classes.navButton}
            animate={{ filter: "brightness(100%)" }} 
            whileHover={{ filter: "brightness(95%)" }} 
            whileTap={{ filter: "brightness(85%)" }} 
            onClick={() => setTab("bets")}
          >
            <motion.svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><g clip-path="url(#clip0_522_37)"><mask id="mask0_522_37" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20"><path d="M20 0H0V20H20V0Z" fill="white"/></mask><g mask="url(#mask0_522_37)"><path d="M4.69672 15.3033C7.62564 18.2322 12.3744 18.2322 15.3033 15.3033C18.2322 12.3744 18.2322 7.62563 15.3033 4.6967C12.3744 1.76777 7.62564 1.76777 4.69672 4.6967C3.23131 6.16211 2.49908 8.08305 2.50002 10.0037L2.5 11.6666" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M0.833008 10L2.49967 11.6667L4.16634 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.16602 6.66699V10.8336H13.3327" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></g></g><defs><clipPath id="clip0_522_37"><rect width="20" height="20" fill="white"/></clipPath></defs></motion.svg>
            Bet History
          </motion.div>
          <motion.div 
            className={tab == "transactions" ? classes.activeNavButton : classes.navButton}
            animate={{ filter: "brightness(100%)" }} 
            whileHover={{ filter: "brightness(95%)" }} 
            whileTap={{ filter: "brightness(85%)" }} 
            onClick={() => setTab("transactions")}
          >
            <motion.svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><g clip-path="url(#clip0_522_59)"><path d="M8.0004 9.99795C4.91496 9.99795 2.31387 9.18799 1.10938 7.99219V9.95363C1.49017 11.2356 4.15991 12.4998 8.0004 12.4998C11.8408 12.4998 14.5106 11.2357 14.8915 9.9537V7.99219C13.687 9.18799 11.086 9.99795 8.0004 9.99795Z" fill="currentColor"/><path d="M8.0004 6.71767C4.91496 6.71767 2.31387 5.90771 1.10938 4.71191V6.78531C1.49017 8.06744 4.15991 9.33162 8.0004 9.33162C11.8408 9.33162 14.5106 8.06751 14.8915 6.78545V4.71191C13.687 5.90771 11.086 6.71767 8.0004 6.71767Z" fill="currentColor"/><path d="M8.00046 0C4.19461 0 1.10938 1.42919 1.10938 3.19225V3.50482C1.49017 4.78695 4.15991 6.05113 8.0004 6.05113C11.8408 6.05113 14.5106 4.78702 14.8915 3.50496V3.19225C14.8915 1.42919 11.8063 0 8.00046 0Z" fill="currentColor"/><path d="M8.0004 13.1668C4.91496 13.1668 2.31387 12.3569 1.10938 11.1611V12.8078C1.10938 14.5708 4.19461 16 8.00046 16C11.8063 16 14.8916 14.5708 14.8916 12.8078V11.1612C13.687 12.3569 11.086 13.1668 8.0004 13.1668Z" fill="currentColor"/></g><defs><clipPath id="clip0_522_59"><rect width="16" height="16" fill="white"/></clipPath></defs></motion.svg>
            TX History
          </motion.div>
          <motion.div 
            className={tab == "selfban" ? classes.activeNavButton : classes.navButton}
            animate={{ filter: "brightness(100%)" }} 
            whileHover={{ filter: "brightness(95%)" }} 
            whileTap={{ filter: "brightness(85%)" }} 
            onClick={() => setTab("selfban")}
          >
            <motion.svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none"><g clip-path="url(#clip0_522_91)"><path d="M0 9.5C0 10.792 0.253333 12.0207 0.76 13.186C1.26667 14.3513 1.938 15.3647 2.774 16.226C3.61 17.0873 4.62333 17.765 5.814 18.259C7.00467 18.753 8.23333 19 9.5 19C10.7667 19 11.9953 18.753 13.186 18.259C14.3767 17.765 15.39 17.0873 16.226 16.226C17.062 15.3647 17.7333 14.3513 18.24 13.186C18.7467 12.0207 19 10.792 19 9.5C19 8.208 18.7467 6.97933 18.24 5.814C17.7333 4.64867 17.062 3.63533 16.226 2.774C15.39 1.91267 14.383 1.24133 13.205 0.76C12.027 0.278667 10.792 0.0253333 9.5 0C8.208 0 6.97933 0.253333 5.814 0.76C4.64867 1.26667 3.63533 1.938 2.774 2.774C1.91267 3.61 1.24133 4.62333 0.76 5.814C0.278667 7.00467 0.0253333 8.23333 0 9.5ZM2.375 9.5C2.375 8.208 2.69167 7.01733 3.325 5.928C3.95833 4.83867 4.826 3.97733 5.928 3.344C7.03 2.71067 8.22067 2.38767 9.5 2.375C10.7793 2.36233 11.97 2.68533 13.072 3.344C14.174 4.00267 15.0417 4.864 15.675 5.928C16.3083 6.992 16.625 8.18267 16.625 9.5C16.625 10.8173 16.3083 12.0143 15.675 13.091C15.0417 14.1677 14.174 15.029 13.072 15.675C11.97 16.321 10.7793 16.6377 9.5 16.625C8.22067 16.6123 7.03 16.2957 5.928 15.675C4.826 15.0543 3.95833 14.193 3.325 13.091C2.69167 11.989 2.375 10.792 2.375 9.5ZM5.795 12.027C5.795 12.3563 5.909 12.635 6.137 12.863C6.365 13.091 6.65 13.2113 6.992 13.224C7.334 13.2367 7.61267 13.1163 7.828 12.863L9.5 11.191L11.172 12.863C11.4 13.1037 11.6787 13.224 12.008 13.224C12.3373 13.224 12.6223 13.1037 12.863 12.863C13.1037 12.6223 13.2177 12.3437 13.205 12.027C13.1923 11.7103 13.0783 11.4317 12.863 11.191L11.172 9.5L12.863 7.828C13.091 7.6 13.205 7.32133 13.205 6.992C13.205 6.66267 13.091 6.384 12.863 6.156C12.635 5.928 12.35 5.80767 12.008 5.795C11.666 5.78233 11.3873 5.90267 11.172 6.156L9.5 7.828L7.828 6.156C7.6 5.91533 7.32133 5.795 6.992 5.795C6.66267 5.795 6.37767 5.91533 6.137 6.156C5.89633 6.39667 5.78233 6.67533 5.795 6.992C5.80767 7.30867 5.92167 7.58733 6.137 7.828L7.828 9.5L6.137 11.191C5.909 11.419 5.795 11.6977 5.795 12.027Z" fill="currentColor"/></g><defs><clipPath id="clip0_522_91"><rect width="19" height="19" fill="currentColor"/></clipPath></defs></motion.svg>
            Self Ban
          </motion.div>
        </div>
        <div className={classes.componentContainer}>
          <AnimatePresence exitBeforeEnter>
            <motion.div
              key={tab} 
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Component />
            </motion.div>
          </AnimatePresence>
        </div>
      </div> 
    </Dialog>
  );
};

export default ProfileModal;
