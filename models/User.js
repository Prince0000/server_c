const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  companyName: { type: String, required: true },
  companyEmail: { type: String, required: true, unique: true },
  employeeSize: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date },
});

module.exports = mongoose.model("User", userSchema);
