import React, { useState, useContext } from "react";
import styles from "./Resume.module.css";
import { JobContext } from "../../Context/JobContext";
import api from "../../Api/Axioscon";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

/* ---------------- Animations ---------------- */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 }
  }
};

const Resume = () => {
  const { resumeData, setResumeData } = useContext(JobContext);

  const [file, setFile] = useState(resumeData?.file || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------- ATS SCORE LOGIC ---------- */
  const score = resumeData?.atsScore ?? 0;
  const safeScore = Math.max(0, Math.min(score, 100));

  let progressColor = "#e5e7eb";
  if (safeScore >= 70) progressColor = "#22c55e";
  else if (safeScore >= 40) progressColor = "#facc15";
  else if (safeScore > 0) progressColor = "#ef4444";

  const progressDeg = `${safeScore * 3.6}deg`;

  /* ---------- FILE HANDLERS ---------- */
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setError("");
  };

  const handleRemove = () => {
    setFile(null);
    setResumeData({
      file: null,
      resumeId: null,
      atsScore: 0,
      skills: [],
    });
  };

  const handleGenerate = async () => {
    if (!file) {
      const msg = "Please upload a resume first";
      setError(msg);
      toast.warning(msg);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await api.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { resumeId, analysis } = res.data;

// 🔥 SAFE DEFAULTS
const safeAnalysis = analysis || {};

setResumeData({
  file,
  resumeId,
  atsScore: safeAnalysis.score ?? 0,
  skills: safeAnalysis.skills ?? [],
});

toast.success("Resume uploaded successfully 🚀");
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Resume upload failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <motion.div
        className={styles.container}
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {/* ---------- LEFT ---------- */}
        <motion.section
          className={styles.left}
          variants={fadeUp}
        >
          <motion.h1 variants={fadeUp}>
            Analyze Your Resume
          </motion.h1>

          <motion.p variants={fadeUp}>
            Get Instant <span>ATS Score</span> & Detailed Feedback
          </motion.p>

          <motion.div
            className={styles.uploadCard}
            variants={fadeUp}
            whileHover={{ y: -4 }}
          >
            <h3>Upload Your Resume</h3>

            <motion.div
              className={styles.dropBox}
              whileHover={{ scale: 1.02 }}
            >
              <p>
                Drag & Drop your <b>PDF Resume</b> here
              </p>
              <br />
              <span>OR</span>
              <br />

              <input
                type="file"
                id="resume"
                hidden
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />

              <label htmlFor="resume" className={styles.chooseBtn}>
                Choose File
              </label>

              <small>Accepted Formats: PDF, DOCX</small>
            </motion.div>

            {file && (
              <motion.div
                className={styles.fileRow}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className={styles.fileName}>{file.name}</span>
                <div className={styles.fileActions}>
                  <span className={styles.success}>Ready</span>
                  <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={handleRemove}
                  >
                    ✕
                  </button>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.p
                className={styles.error}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {error}
              </motion.p>
            )}

            <motion.button
              className={styles.generateBtn}
              onClick={handleGenerate}
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? "Analyzing..." : "Generate ATS Report →"}
            </motion.button>

            <p className={styles.tip}>
              💡 Add proper headings, skills & keywords for better results.
            </p>
          </motion.div>
        </motion.section>

        {/* ---------- RIGHT ---------- */}
        <motion.section
          className={styles.right}
          variants={fadeUp}
        >
          <motion.div
            className={styles.reportCard}
            whileHover={{ y: -4 }}
          >
            <h3>ATS Report Preview</h3>

            <motion.div
              className={styles.scoreBox}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className={styles.scoreCircle}
                style={{
                  background: `conic-gradient(
                    ${progressColor} ${progressDeg},
                    #e5e7eb 0deg
                  )`,
                }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {safeScore}
              </motion.div>
              <span>ATS Score</span>
            </motion.div>

            <div className={styles.skills}>
              <h4>Skills Found</h4>

              <motion.div
                className={styles.skillTags}
                variants={stagger}
                initial="hidden"
                animate="visible"
              >
                {resumeData?.skills?.length > 0 ? (
                  resumeData.skills.map((s) => (
                    <motion.span
                      key={s}
                      variants={fadeUp}
                      whileHover={{ scale: 1.1 }}
                    >
                      {s}
                    </motion.span>
                  ))
                ) : (
                  <span className={styles.muted}>
                    No skills extracted yet
                  </span>
                )}
              </motion.div>
            </div>
          </motion.div>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default Resume;