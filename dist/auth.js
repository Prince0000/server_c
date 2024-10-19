"use strict";

var jwt = require("jsonwebtoken");
module.exports = function (req, res, next) {
  try {
    var authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({
        message: "No authorization header provided"
      });
    }
    var token = authHeader.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        message: "No token provided"
      });
    }
    var decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      userId: decoded.userId
    };
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token"
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired"
      });
    }
    res.status(401).json({
      message: "Authentication failed"
    });
  }
};