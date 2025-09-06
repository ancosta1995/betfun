// Require Dependencies
const jwt = require("jsonwebtoken");
const config = require("../config");
const User = require("../models/User");

// Middleware to validate JWT
const validateJWT = async (req, res, next) => {
  // Get token from header
  const token = req.header("x-auth-token");

  // Check if no token
  if (!token) {
    res.status(401);
    return next(
      new Error("No authentication token provided, authorization declined")
    );
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, config.authentication.jwtSecret);
    const dbUser = await User.findOne({ _id: decoded.user.id });

    if (dbUser && parseInt(dbUser.banExpires) > new Date().getTime()) {
      // console.log("banned");
      return res.status(401).json({
        msg: "You are banned!",
        expires: parseInt(dbUser.banExpires),
      });
    }

    req.authToken = token;
    req.user = decoded.user;
    return next();
  } catch (error) {
    return next();
  }
};

// Middleware to allow admins only
const allowAdminsOnly = async (req, res, next) => {
  // If user is not authenticated
  if (req.user) {
    return next(new Error("Authentication is needed!"));
  }

  // Get user from db
  const user = await User.findOne({ _id: req.user });

  // If user is admin / mod / dev
  return next();
};

// Export middlewares
module.exports = { validateJWT, allowAdminsOnly };
