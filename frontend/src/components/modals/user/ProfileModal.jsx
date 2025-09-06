import React, { useEffect, useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useToasts } from "react-toast-notifications";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import { getUserProfileData } from "../../../services/api.service";
import parseCommasToThousands from "../../../utils/parseCommasToThousands";
import { chatSocket } from "../../../services/websocket.service";
import coin from "../../../assets/icons/coin.png";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logout } from "../../../actions/auth";

const ColorCircularProgress = withStyles({
  root: {
    color: "#9E9FBD !important",
  },
})(CircularProgress);

const useStyles = makeStyles(theme => ({
  modal: {
    "& .MuiDialog-paperWidthSm": {
      scrollbarWidth: "none",
      background: "#050614",
      borderRadius: "0.5em",
      width: "50%",
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
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
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
  loader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "15rem",
    gap: "0.75rem",
    color: "#9E9FBD"
  },
  upperInfo: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    gap: "0.5rem"
  },
  userContainer: {
    margin: "auto",
    display: "flex",
    alignItems: "center",
    gap: "1rem",  
    marginBottom: "1rem",
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 3
  },
  boxesContainer: {
    display: "flex",
    flexDirection: "row",
    gap: "0.5rem",
    width: "100%"
  },
  box: {
    display: "flex",
    padding: "1rem",
    // border: "1px solid hsl(220, 22%, 62%)",
    borderRadius: "0.25rem",
    backgroundColor: "#101123",
    fontSize: "10px",
    color: "#9E9FBD",
    flexDirection: "column",
    minWidth: "calc(50% - 0.25rem)",
    gap: "0.2rem"
  },
  number: {
    fontSize: "15px", 
    color: "#fff", 
    display: "flex", 
    alignItems: "center", 
    gap: "0.2rem",
  },
  lowerInfo: { 

  }
}));

const Profile = ({ open, handleClose, userid, isLoading, isAuthenticated, user, logout }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getUserProfileData(userid);
      setProfile(response);
      setLoading(false);
    } catch (error) {
      console.log("Error getting user profile data: " + error);
    }
  };


  useEffect(() => {
    if(open) fetchData();
  }, [open])

  const formatDate = (date) => {
    const options = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric' 
    };
    const formattedDate = new Date(date).toLocaleDateString('en-US', options);
    return formattedDate;
  };

  return (
      <Dialog
        className={classes.modal}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >  
        <div className={classes.titleBox} onClose={handleClose} >
          <span style={{flex: "auto", fontSize: "1.5rem", color: "#E0E4EB" }}>{loading ? "Users" : profile.username}'s Profile</span>
          <svg className={classes.buttonIcon} style={{cursor: "pointer"}} onClick={() => handleClose()} fill="currentColor" tabIndex="-1" viewBox="0 0 320 512"><path d="M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z"></path></svg>
        </div>
        <div className={classes.content} >
          {loading ? (
            <div className={classes.loader}>
              <ColorCircularProgress />
              Loading...
            </div>
          ) : (
            <>
              <div className={classes.upperInfo}>
                <div className={classes.userContainer}>
                  <img className={classes.avatar} src={profile.avatar} alt="avatar" />
                  <div>{profile.username}</div>
                </div>
                <div className={classes.boxesContainer}>
                  <div className={classes.box}>
                    Wagered
                    <div className={classes.number}>
                      <img style={{height: 17, width: 17}} src={coin} />                      
                      {parseCommasToThousands(profile.wager)}
                    </div>
                  </div>
                  <div className={classes.box}>
                    Profit
                    <div className={classes.number}>
                      <img style={{height: 17, width: 17}} src={coin} />
                      {parseCommasToThousands(profile.profit)}
                    </div>
                  </div>
                </div>
                <div className={classes.boxesContainer}>
                  <div className={classes.box}>
                    Bets Placed
                    <div className={classes.number}>
                      {profile.gamesPlayed}
                    </div>
                  </div>
                  <div className={classes.box}>
                    Bets Won
                    <div className={classes.number}>
                      {profile.gamesWon}
                    </div>
                  </div>
                </div>
                <div className={classes.boxesContainer}>
                  <div className={classes.box}>
                    Registered
                    <div className={classes.number}>
                      {formatDate(profile.created)}
                    </div>
                  </div>
                  <div className={classes.box}>
                    UserID
                    <div className={classes.number}>
                      {profile._id}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}     
        </div> 
      </Dialog>
  );
};

Profile.propTypes = {
  isAuthenticated: PropTypes.bool,
  isLoading: PropTypes.bool,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading,
  user: state.auth.user,
  logout: PropTypes.func.isRequired,
});

export default connect(mapStateToProps, { logout })(Profile);