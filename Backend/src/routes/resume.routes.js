const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.middleware");
const { uploadResume } = require("../controllers/resume.controller");

router.post("/upload", upload.single("resume"), uploadResume);

module.exports = router;
