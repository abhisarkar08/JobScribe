const mongoose = require("mongoose");

const jobMatchSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },
    jobTitle: {
      type: String,
      default: "Custom JD",
    },
    matchScore: {
      type: Number,
      required: true,
    },
    matchedSkills: [String],
    missingSkills: [String],
  },
  { timestamps: true },
);

module.exports = mongoose.model("JobMatch", jobMatchSchema);
