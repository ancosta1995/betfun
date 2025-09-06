import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import { getUserProfileData, getUserVipData } from "../../services/api.service";
import { connect } from "react-redux";
import { motion } from "framer-motion";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    height: "100%"
  },
  userContainer: {
    display: "flex",
    gap: "1rem",
    alignItems: "center"
  },
  avatar: {
    height: 60,
    width: 60,
    borderRadius: "0.25rem",
  },
  username: {
    fontSize: 15,
    fontWeight: 500
  },
  progressionConatainer: {

  }
}));

const Account = ({ isAuthenticated, isLoading, user }) => {
  const classes = useStyles();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [vipData, setVipData] = useState(null);
  const [vipDataColor, setVipDataColor] = useState(null);
  const [vipDataName, setVipDataName] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserProfileData(user._id);
        setProfile(data);
        const data2 = await getUserVipData();
        setVipData(data2);
        const currentMajorLevel = data2.majorLevelNames.find((levelName, index) => {
          const currentLevelIndex = data2.allLevels.findIndex((level) => level.name === data2.currentLevel.name);
          const nextIndex = data2.allLevels.findIndex((level) => level.levelName === data2.majorLevelNames[index + 1]);
          if (currentLevelIndex >= index && (nextIndex === -1 || currentLevelIndex < nextIndex)) {
            return true;
          }
          return false;
        });
        const currentMajorLevelIndex = data2.majorLevelNames.indexOf(currentMajorLevel);
        setVipDataColor(data2.majorLevelColors[currentMajorLevelIndex]);
        setVipDataName(currentMajorLevel);

        setDisplayname(user.username);
        setAvatar(data.avatar)
        setLoading(false);
      } catch (error) {
        console.log("There was an error while loading user profile data:", error);
      }
    };
    if (!isLoading && isAuthenticated) {
      fetchData();
    }
  }, [isLoading, isAuthenticated, user?.username]);

  return (
    <div className={classes.root}>
      <div className={classes.userContainer}>
        <img className={classes.avatar} src={user.avatar}/>
        <div className={classes.username}>{user.username}</div>
      </div>
      <div className={classes.progressionConatainer}>

      </div>
    </div>
  );
};

Account.propTypes = {
  isAuthenticated: PropTypes.bool,
  isLoading: PropTypes.bool,
  user: PropTypes.object,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading,
  user: state.auth.user,
});

export default connect(mapStateToProps, {})(Account);