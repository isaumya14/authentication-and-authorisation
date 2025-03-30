const jwt = require("jsonwebtoken");
require("dotenv").config();

//FOR AUTHENTICATION
exports.auth = (req, res, next) => {
  try {
    const token = req.body.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "token missing",
      });
    }
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload;
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "token is invalid",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "something went wrong while verifying the token ",
    });
  }
};

// FOR AUTHORISATION
exports.isStudent = (req, res, next) => {
  try {
    if (req.user.role != "Student") {
      return res.status(401).json({
        success: false,
        message: "this is the route for student.",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User Role is not matching",
    });
  }
};
exports.isAdmin = (req, res, next) => {
  try {
    if (req.user.role != "Admin") {
      return res.status(401).json({
        success: false,
        message: "this is the route for Admins.",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User Role is not matching",
    });
  }
};
