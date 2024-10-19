const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendOTPEmail } = require("../services/emailService");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, phone, companyName, companyEmail, employeeSize } = req.body;

    // Check if user already exists
    let user = await User.findOne({ companyEmail });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    user = new User({
      name,
      phone,
      companyName,
      companyEmail,
      employeeSize,
    });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

    await user.save();

    // Send OTP email
    const emailSent = await sendOTPEmail(companyEmail, otp);

    if (!emailSent) {
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, name: user.name },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { otp, token } = req.body;

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }

    // Check OTP
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Mark user as verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login-request", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ companyEmail: email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

    await user.save();

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp);

    if (!emailSent) {
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login-verify", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ companyEmail: email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check OTP
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Clear OTP
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, name: user.name },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ token, message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
