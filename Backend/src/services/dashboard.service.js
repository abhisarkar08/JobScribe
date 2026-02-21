const mongoose = require("mongoose");
const Resume = require("../models/resume.model");
const JobMatch = require("../models/jobMatch.model");

exports.getDashboardData = async (userId) => {
  try {
    const objectUserId = new mongoose.Types.ObjectId(userId);

    /* ---------- OVERVIEW ---------- */

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
    const avgMatchPercentage = Math.round(avgMatchAgg[0]?.avg || 0);
    const bestMatch = bestMatchAgg[0]?.max || 0;

    /* ---------- TREND ---------- */

    const trendRaw = await JobMatch.find({ user: objectUserId })
      .sort({ createdAt: 1 })
      .select("createdAt matchScore");

    const trend = trendRaw.map((m) => ({
      date: new Date(m.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      score: m.matchScore,
    }));

    /* ---------- WEAKEST SKILLS ---------- */

    const weakestAgg = await JobMatch.aggregate([
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

    const weakestSkills = weakestAgg.map((s) => ({
      name: s._id,
      value: Math.max(30, 100 - s.count * 10),
    }));

    /* ---------- HEATMAP ---------- */

    const heatmapAgg = await JobMatch.aggregate([
      { $match: { user: objectUserId } },
      { $unwind: "$matchedSkills" },
      {
        $group: {
          _id: "$matchedSkills",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]);

    const skillHeatmap = heatmapAgg.map((h) => ({
      skill: h._id,
      value: Math.min(100, 40 + h.count * 10),
    }));

    /* ---------- RESUMES ---------- */

    const resumes = await Resume.find({ user: objectUserId });

    const matches = await JobMatch.find({ user: objectUserId });

    const resumeCards = resumes.map((r) => {
  const match = matches.find(
    (m) => m.resume.toString() === r._id.toString()
  );

  return {
    id: r._id, // 🔥 REQUIRED
    name: r.originalFileName,
    score: r.analysis?.score || 0,
    match: match ? `${match.matchScore}%` : "—",
  };
});

    /* ---------- RECENT MATCHES ---------- */

    const recentMatches = matches
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 3)
      .map((m) => ({
        jobTitle: m.jobTitle,
        matchScore: m.matchScore,
      }));

    /* ---------- READINESS ---------- */

    const interviewReadiness = Math.round(
      (avgResumeScore + avgMatchPercentage) / 2
    );

    return {
      totalResumes,
      avgResumeScore,
      avgMatchPercentage,
      bestMatch,
      trend,
      weakestSkills,
      skillHeatmap,
      resumes: resumeCards,
      recentMatches,
      interviewReadiness,
    };
  } catch (error) {
    console.error("Dashboard Service Error:", error);
    throw error;
  }
};