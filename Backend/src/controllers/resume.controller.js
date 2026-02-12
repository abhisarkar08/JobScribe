const fs = require("fs");
const pdfParse = require("pdf-parse");
const Resume = require("../models/resume.model");
const { resumeAnalysis } = require("../services/resumeAnalysis.service");

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
