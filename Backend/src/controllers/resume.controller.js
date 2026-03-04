const cloudinary = require("../config/cloudinary");
const pdfParse = require("pdf-parse");
const Resume = require("../models/resume.model");
const { resumeAnalysis } = require("../services/resumeAnalysis.service");
const JobMatch = require("../models/jobMatch.model");
const {
  analyzeJD,
  generateImprovementSuggestions,
  generateInterviewQuestions,
} = require("../services/ai.service");
const {
  basicInterviewQuestions,
  basicImprovementSuggestions,
} = require("../utils/aiFallBack");

exports.uploadResume = async (req, res) => {
  console.log("➡️ Upload API hit");

  let cloudRes;

  try {
    if (!req.file) {
      console.error("❌ No file in request");
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("✅ File received:", req.file.originalname);

    // 1️⃣ Cloudinary upload
    cloudRes = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "jobscribe/resumes",
            resource_type: "raw",
          },
          (error, result) => {
            if (error) {
              console.error("❌ Cloudinary error:", error);
              reject(error);
            } else {
              console.log("✅ Cloudinary upload success");
              resolve(result);
            }
          },
        )
        .end(req.file.buffer);
    });

    // 2️⃣ PDF parse (SAFE)
    let extractedText = "";
    try {
      const data = await pdfParse(req.file.buffer);
      extractedText = data.text?.trim() || "";
      console.log("📄 PDF parsed, text length:", extractedText.length);
    } catch (pdfErr) {
      console.error("⚠️ PDF parse failed:", pdfErr.message);
    }

    // 3️⃣ AI analysis (SAFE)
    let analysis = {};
    try {
      const {
        analyzeWithFallback,
      } = require("../services/resumeHybrid.service");
      analysis = extractedText
        ? await analyzeWithFallback(extractedText)
        : {
            score: 0,
            skills: [],
            source: "fallback",
            reason: "No text extracted",
          };
      console.log("🤖 AI analysis done");
    } catch (aiErr) {
      console.error("⚠️ AI failed:", aiErr.message);
      analysis = {
        score: 0,
        skills: [],
        source: "fallback",
        reason: "AI error",
      };
    }

    // 4️⃣ DB SAVE
    const resume = await Resume.create({
      user: req.user.id,
      originalFileName: req.file.originalname,
      resumeUrl: cloudRes.secure_url,
      extractedText,
      analysis,
    });

    console.log("✅ Resume saved in DB:", resume._id);

    return res.status(200).json({
      success: true,
      resumeId: resume._id,
      analysis: resume.analysis || { score: 0, skills: [] },
    });
  } catch (error) {
    console.error("🔥 UPLOAD HARD FAIL:", error.message);

    return res.status(500).json({
      message: "Resume upload failed",
    });
  }
};

exports.analyzeJDController = async (req, res) => {
  try {
    const { jdText } = req.body;

    if (!jdText) {
      return res.status(400).json({ message: "JD text is required" });
    }

    const analysis = await analyzeJD(jdText);

    res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to analyze JD",
    });
  }
};

exports.getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id })
      .select("_id originalFileName analysis.score createdAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      resumes,
    });
  } catch (error) {
    console.error("FETCH RESUMES ERROR:", error);
    return res.status(500).json({
      message: "Failed to fetch resumes",
    });
  }
};

exports.matchJDController = async (req, res) => {
  try {
    const { resumeId, jdText } = req.body;

    if (!resumeId || !jdText) {
      return res.status(400).json({
        message: "resumeId and jdText are required",
      });
    }

    const resume = await Resume.findOne({
      _id: resumeId,
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    const jdAnalysis = await analyzeJD(jdText); // 🔥 AI CALL

    const resumeSkills = resume.analysis?.skills || [];
    const jdSkills = [
      ...(jdAnalysis.requiredSkills || []),
      ...(jdAnalysis.tools || []),
    ];

    const normalize = (skill) => skill.toLowerCase().replace(/[^a-z0-9]/g, "");

    const resumeSet = new Set(resumeSkills.map((skill) => normalize(skill)));

    const matchedSkills = [];
    const missingSkills = [];

    jdSkills.forEach((skill) => {
      if (resumeSet.has(normalize(skill))) {
        matchedSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    });

    const matchPercentage =
      jdSkills.length === 0
        ? 0
        : Math.round((matchedSkills.length / jdSkills.length) * 100);

    await JobMatch.create({
      user: req.user.id,
      resume: resume._id,
      jobTitle: jdAnalysis.jobTitle || "Custom JD",
      matchScore: matchPercentage,
      matchedSkills,
      missingSkills,
    });

    return res.status(200).json({
      success: true,
      selectedResume: resume.originalFileName,
      resumeScore: resume.analysis.score,
      matchPercentage,
      matchedSkills,
      missingSkills,
      totalRequiredSkills: jdSkills.length,
    });
  } catch (error) {
    console.error("MATCH ERROR:", error.message);

    // 🔥 IMPORTANT: preserve 429
    if (error.status === 429) {
      return res.status(429).json({
        message: "AI limit reached. Please try again later.",
      });
    }

    return res.status(500).json({
      message: "Matching failed",
    });
  }
};

exports.improveResumeController = async (req, res) => {
  try {
    const { resumeId, jdText } = req.body;

    const resume = await Resume.findOne({
      _id: resumeId,
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const jdAnalysis = await analyzeJD(jdText);

    const jdSkills = [
      ...(jdAnalysis.requiredSkills || []),
      ...(jdAnalysis.tools || []),
    ];

    const resumeSkills = resume.analysis.skills || [];

    const missingSkills = jdSkills.filter(
      (skill) =>
        !resumeSkills.map((s) => s.toLowerCase()).includes(skill.toLowerCase()),
    );

    const suggestions = await generateImprovementSuggestions(
      resume.extractedText,
      jdText,
      missingSkills,
    );

    res.json({
      success: true,
      suggestions: Array.isArray(suggestions)
        ? suggestions
        : Object.values(suggestions).flat(),
    });
  } catch (error) {
    console.error("IMPROVE ERROR:", error.message);

    if (error.status === 429) {
      return res.status(200).json({
        success: true,
        source: "fallback",
        suggestions: basicImprovementSuggestions,
        message: "AI limit reached. Showing basic resume tips.",
      });
    }

    res.status(500).json({ message: "Improvement failed" });
  }
};

exports.generateInterviewController = async (req, res) => {
  try {
    const { resumeId, jdText } = req.body;

    if (!resumeId || !jdText) {
      return res.status(400).json({
        message: "resumeId and jdText required",
      });
    }

    const resume = await Resume.findOne({
      _id: resumeId,
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    const questions = await generateInterviewQuestions(
      resume.extractedText,
      jdText,
    );

    res.json({
      success: true,
      questions: Object.values(questions).flat(),
    });
  } catch (error) {
    console.error("INTERVIEW ERROR:", error.message);

    if (error.status === 429) {
      return res.status(200).json({
        success: true,
        source: "fallback",
        questions: basicInterviewQuestions,
        message: "AI limit reached. Showing basic interview questions.",
      });
    }

    res.status(500).json({
      message: "Interview question generation failed",
    });
  }
};

exports.deleteResume = async (req, res) => {
  const resume = await Resume.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!resume) {
    return res.status(404).json({ message: "Resume not found" });
  }

  await JobMatch.deleteMany({ resume: resume._id });

  res.json({ success: true });
};
