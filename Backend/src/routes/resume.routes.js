const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.middleware");
const {
  uploadResume,
  analyzeJDController,
  getUserResumes,
  matchJDController,
  improveResumeController,
  generateInterviewController,
} = require("../controllers/resume.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/upload", authMiddleware, upload.single("resume"), uploadResume);
router.get("/my-resumes", authMiddleware, getUserResumes);
router.post("/analyze-jd", authMiddleware, analyzeJDController);
router.post("/improve-resume", authMiddleware, improveResumeController);
router.post("/match-jd", authMiddleware, matchJDController);
router.post(
  "/interview-questions",
  authMiddleware,
  generateInterviewController,
);

module.exports = router;
