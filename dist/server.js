"use strict";

var express = require("express");
var mongoose = require("mongoose");
var cors = require("cors");
var dotenv = require("dotenv");
var authRoutes = require("./routes/auth");
var jobRoutes = require("./routes/jobs");
dotenv.config();
var app = express();
app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(function () {
  return console.log("Connected to MongoDB");
})["catch"](function (err) {
  return console.error("MongoDB connection error:", err);
});
app.use("/api", authRoutes);
app.use("/api/jobs", jobRoutes); // This line ensures all job routes are available

var PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  console.log("Server is running on port ".concat(PORT));
});