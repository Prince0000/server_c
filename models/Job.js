const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    jobTitle: { type: String, required: true },
    jobDescription: { type: String, required: true },
    experienceLevel: { type: String, required: true },
    candidates: { type: [String], default: [] },
    endDate: { type: Date, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
