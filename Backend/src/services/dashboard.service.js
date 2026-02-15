const mongoose = require("mongoose");
const Resume = require("../models/resume.model");
const JobMatch = require("../models/jobMatch.model");

exports.getDashboardData = async (userId) => {
  try {
    // ✅ Convert userId string → ObjectId (VERY IMPORTANT)
    const objectUserId = new mongoose.Types.ObjectId(userId);

    // -------- Overview --------

    const totalResumes = await Resume.countDocuments({
      user: objectUserId,
    });

    const avgResumeAgg = await Resume.aggregate([
      { $match: { user: objectUserId } },
      {
        $group: {
          _id: null,
          avg: { $avg: "$analysis.score" },
        },
      },
    ]);

    const avgMatchAgg = await JobMatch.aggregate([
      { $match: { user: objectUserId } },
      {
        $group: {
          _id: null,
          avg: { $avg: "$matchScore" },
        },
      },
    ]);

    const bestMatchAgg = await JobMatch.aggregate([
      { $match: { user: objectUserId } },
      {
        $group: {
          _id: null,
          max: { $max: "$matchScore" },
        },
      },
    ]);

    const avgResumeScore = Math.round(avgResumeAgg[0]?.avg || 0);
    const avgMatch = Math.round(avgMatchAgg[0]?.avg || 0);
    const bestMatch = bestMatchAgg[0]?.max || 0;

    // -------- Trend --------

    const trend = await JobMatch.find({ user: objectUserId })
      .sort({ createdAt: 1 })
      .select("createdAt matchScore");

    // -------- Weakest Skills --------

    const weakestSkills = await JobMatch.aggregate([
      { $match: { user: objectUserId } },
      { $unwind: "$missingSkills" },
      {
        $group: {
          _id: "$missingSkills",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // -------- Heatmap (Matched Skills Frequency) --------

    const heatmap = await JobMatch.aggregate([
      { $match: { user: objectUserId } },
      { $unwind: "$matchedSkills" },
      {
        $group: {
          _id: "$matchedSkills",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // -------- Recent Matches --------

    const recentMatches = await JobMatch.find({
      user: objectUserId,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("jobTitle matchScore createdAt");

    // -------- Interview Readiness --------

    const interviewReadiness = Math.round((avgResumeScore + avgMatch) / 2);

    return {
      overview: {
        totalResumes,
        avgResumeScore,
        avgMatch,
        bestMatch,
      },
      trend,
      weakestSkills,
      heatmap,
      recentMatches,
      interviewReadiness,
    };
  } catch (error) {
    console.error("Dashboard Service Error:", error);
    throw error;
  }
};
