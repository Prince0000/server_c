const express = require("express");
const Job = require("../models/Job");
const User = require("../models/User");
const auth = require("../middleware/auth");
const { sendCandidateEmail } = require("../services/emailService");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const {
      jobTitle,
      jobDescription,
      experienceLevel,
      candidates,
      endDate,
      createdBy,
    } = req.body;

    const newJob = new Job({
      jobTitle,
      jobDescription,
      experienceLevel,
      candidates,
      endDate,
      createdBy: createdBy,
    });

    await newJob.save();
    res.status(201).json({ message: "Job created successfully", job: newJob });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add this new route to fetch jobs
router.get("/", auth, async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.user.userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/send-email", auth, async (req, res) => {
  try {
    const { jobId, candidate } = req.body;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const result = await sendCandidateEmail(
      candidate,
      job.jobTitle,
      user.companyName
    );

    if (result.success) {
      res.status(200).json({ message: "Email sent successfully" });
    } else {
      res
        .status(500)
        .json({ message: "Failed to send email", error: result.error });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add this new route for sending emails to all candidates
router.post("/send-all-emails", auth, async (req, res) => {
  console.log("Received request to send all emails");
  try {
    const { jobId } = req.body;
    console.log("JobId:", jobId);
    const job = await Job.findById(jobId);

    if (!job) {
      console.log("Job not found");
      return res.status(404).json({ message: "Job not found" });
    }

    console.log("Job found:", job);

    const user = await User.findById(req.user.userId);

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User found:", user);

    const emailStatus = {};
    for (const candidate of job.candidates) {
      try {
        const result = await sendCandidateEmail(
          candidate,
          job.jobTitle,
          user.companyName
        );
        emailStatus[candidate] = result.success ? "success" : "failed";
      } catch (error) {
        console.error(`Error sending email to ${candidate}:`, error);
        emailStatus[candidate] = "failed";
      }
    }

    const failedEmails = Object.values(emailStatus).filter(
      (status) => status === "failed"
    );

    if (failedEmails.length === 0) {
      console.log("All emails sent successfully");
      res
        .status(200)
        .json({ message: "All emails sent successfully", emailStatus });
    } else {
      console.log("Some emails failed to send");
      res.status(500).json({
        message: "Some emails failed to send",
        failedCount: failedEmails.length,
        emailStatus,
      });
    }
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
