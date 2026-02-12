const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.middleware");
const { uploadResume } = require("../controllers/resume.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/upload", authMiddleware, upload.single("resume"), uploadResume);

module.exports = router;
