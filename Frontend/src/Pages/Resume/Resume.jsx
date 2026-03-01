import React, { useState, useContext } from "react";
import styles from "./Resume.module.css";
import { JobContext } from "../../Context/JobContext";
import api from "../../Api/Axioscon";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

/* ---------------- Animations ---------------- */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

/* =====================================================
   🔥 SKILLS NORMALIZER (HANDLES STRING / OBJECT)
===================================================== */
const normalizeSkills = (skills = []) =>
  skills
    .map((s) =>
      typeof s === "string"
        ? s
        : typeof s === "object" && s !== null
        ? s.name || s.skill || ""
        : ""
    )
    .filter(Boolean);

const Resume = () => {
  const { resumeData, setResumeData } = useContext(JobContext);

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  /* =====================================================
     🔥 ONLY BUTTON CLICK TRIGGERS ANALYSIS
  ===================================================== */
  const handleGenerate = async () => {
    if (!file) {
      toast.warning("Please upload a resume first");
      return;
    }

    setLoading(true);
    setError("");

    // 🔥 RESET UI BEFORE ANALYSIS
    setResumeData((prev) => ({
      ...prev,
      atsScore: 0,
      skills: [],
    }));

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await api.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { resumeId, analysis } = res.data;

      setResumeData({
        file,
        resumeId,
        atsScore: analysis?.score ?? 0,
        skills: normalizeSkills(analysis?.skills),
      });

      toast.success("Resume analyzed successfully 🚀");
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Resume analysis failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- ATS SCORE UI ---------- */
  const safeScore = Math.max(
    0,
    Math.min(resumeData.atsScore || 0, 100)
  );

  let progressColor = "#e5e7eb";
  if (safeScore >= 70) progressColor = "#22c55e";
  else if (safeScore >= 40) progressColor = "#facc15";
  else if (safeScore > 0) progressColor = "#ef4444";

  const progressDeg = `${safeScore * 3.6}deg`;

  /* =====================================================
     🔥 UI
  ===================================================== */
  return (
    <div className={styles.page}>
      <motion.div
        className={styles.container}
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {/* ---------- LEFT ---------- */}
        <motion.section className={styles.left} variants={fadeUp}>
          <motion.h1>Analyze Your Resume</motion.h1>

          <motion.div className={styles.uploadCard}>
            <h3>Upload Your Resume</h3>

            <input
              type="file"
              hidden
              id="resume"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />

            <label htmlFor="resume" className={styles.chooseBtn}>
              Choose File
            </label>

            {file && (
              <div className={styles.fileRow}>
                <span>{file.name}</span>
                <button onClick={handleRemove}>✕</button>
              </div>
            )}

            {error && <p className={styles.error}>{error}</p>}

            <button
              className={styles.generateBtn}
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Generate ATS Report →"}
            </button>
          </motion.div>
        </motion.section>

        {/* ---------- RIGHT ---------- */}
        <motion.section className={styles.right} variants={fadeUp}>
          <div className={styles.reportCard}>
            <h3>ATS Report Preview</h3>

            <div className={styles.scoreBox}>
              <div
                className={styles.scoreCircle}
                style={{
                  background: `conic-gradient(
                    ${progressColor} ${progressDeg},
                    #e5e7eb 0deg
                  )`,
                }}
              >
                {safeScore}
              </div>
              <span>ATS Score</span>
            </div>

            <div className={styles.skills}>
              <h4>Skills Found</h4>

              <div className={styles.skillTags}>
                {resumeData.skills.length > 0 ? (
                  resumeData.skills.map((s, i) => (
                    <span key={s + i}>{s}</span>
                  ))
                ) : (
                  <span className={styles.muted}>
                    No skills extracted yet
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default Resume;