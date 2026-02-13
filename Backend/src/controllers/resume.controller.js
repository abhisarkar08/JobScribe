const fs = require("fs");
const pdfParse = require("pdf-parse");
const Resume = require("../models/resume.model");
const { resumeAnalysis } = require("../services/resumeAnalysis.service");
const { analyzeJD, generateImprovementSuggestions, generateInterviewQuestions } = require("../services/ai.service");



exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {  
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileBuffer = fs.readFileSync(req.file.path);
    const data = await pdfParse(fileBuffer);

    let extractedText = data.text
      .replace(/\r\n/g, "\n")
      .replace(/\n{2,}/g, "\n")
      .replace(/[ \t]{2,}/g, " ")
      .trim();

    const { analyzeWithFallback } = require("../services/resumeHybrid.service");
    const analysis = await analyzeWithFallback(extractedText);


      const resume = await Resume.create({
        user: req.user.id,
        originalFileName: req.file.originalname,
        extractedText,
        analysis
      });


    fs.unlinkSync(req.file.path);

    return res.status(200).json({
      message: "Resume uploaded & parsed successfully",
      resumeId: resume._id,
      analysis: resume.analysis
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Resume processing failed",
      error: error.message,
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
      data: analysis
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to analyze JD"
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
      resumes
    });

  } catch (error) {
    console.error("FETCH RESUMES ERROR:", error);
    return res.status(500).json({
      message: "Failed to fetch resumes"
    });
  }
};

exports.matchJDController = async (req, res) => {
  try {
    const { resumeId, jdText } = req.body;

    if (!resumeId || !jdText) {
      return res.status(400).json({
        message: "resumeId and jdText are required"
      });
    }

    // 1️⃣ Resume find karo (sirf current user ka)
    const resume = await Resume.findOne({
      _id: resumeId,
      user: req.user.id
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found"
      });
    }

    // 2️⃣ JD AI analysis
    const jdAnalysis = await analyzeJD(jdText);

    const resumeSkills = resume.analysis?.skills || [];
    const jdSkills = [
      ...(jdAnalysis.requiredSkills || []),
      ...(jdAnalysis.tools || [])
    ];


    // 3️⃣ Smart Normalization function
    const normalize = (skill) =>
      skill.toLowerCase().replace(/[^a-z0-9]/g, "");

    const resumeSet = new Set(
      resumeSkills.map(skill => normalize(skill))
    );

    const matchedSkills = [];
    const missingSkills = [];

    jdSkills.forEach(skill => {
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

    return res.status(200).json({
      success: true,
      selectedResume: resume.originalFileName,
      resumeScore: resume.analysis.score,
      matchPercentage,
      matchedSkills,
      missingSkills,
      totalRequiredSkills: jdSkills.length
    });

  } catch (error) {
    console.error("MATCH ERROR:", error);
    return res.status(500).json({
      message: "Matching failed"
    });
  }
};

exports.improveResumeController = async (req, res) => {
  try {
    const { resumeId, jdText } = req.body;

    const resume = await Resume.findOne({
      _id: resumeId,
      user: req.user.id
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const jdAnalysis = await analyzeJD(jdText);

    const jdSkills = [
      ...(jdAnalysis.requiredSkills || []),
      ...(jdAnalysis.tools || [])
    ];

    const resumeSkills = resume.analysis.skills || [];

    const missingSkills = jdSkills.filter(
      skill =>
        !resumeSkills
          .map(s => s.toLowerCase())
          .includes(skill.toLowerCase())
    );

    const suggestions = await generateImprovementSuggestions(
      resume.extractedText,
      jdText,
      missingSkills
    );

    res.json({
      success: true,
      suggestions
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Improvement failed" });
  }
};

exports.generateInterviewController = async (req, res) => {
  try {
    const { resumeId, jdText } = req.body;

    if (!resumeId || !jdText) {
      return res.status(400).json({
        message: "resumeId and jdText required"
      });
    }

    const resume = await Resume.findOne({
      _id: resumeId,
      user: req.user.id
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found"
      });
    }

    const questions = await generateInterviewQuestions(
      resume.extractedText,
      jdText
    );

    res.json({
      success: true,
      questions
    });

  } catch (error) {
    console.error("INTERVIEW GEN ERROR:", error);
    res.status(500).json({
      message: "Interview question generation failed"
    });
  }
};
