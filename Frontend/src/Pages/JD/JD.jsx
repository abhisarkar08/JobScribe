import React, { useState, useContext, useEffect } from "react";
import styles from "./JD.module.css";
import { JobContext } from "../../Context/JobContext";
import api from "../../Api/Axioscon";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

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

const scaleFade = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

const JD = () => {
  const navigate = useNavigate();
  const { jdData, setJdData } = useContext(JobContext);

  const [jdText, setJdText] = useState(jdData.text || "");
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);

  const [matched, setMatched] = useState(jdData.matchedSkills || []);
  const [missing, setMissing] = useState(jdData.missingSkills || []);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* sync context → state */
  useEffect(() => {
    if (jdData.matchedSkills) {
      setMatched(jdData.matchedSkills);
      setMissing(jdData.missingSkills || []);
    }
  }, [jdData.matchedSkills, jdData.missingSkills]);

  useEffect(() => {
    if (jdData.resumeId && resumes.length) {
      const found = resumes.find((r) => r._id === jdData.resumeId);
      if (found) setSelectedResume(found);
    }
  }, [jdData.resumeId, resumes]);

  /* 🔹 FETCH USER RESUMES */
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await api.get("/resume/my-resumes");
        setResumes(res.data.resumes || []);
      } catch {
        setError("Failed to fetch resumes");
        toast.error("Failed to fetch resumes");
      }
    };

    fetchResumes();
  }, []);

  /* 🔹 MATCH JD */
  const handleMatch = async () => {
    if (!jdText.trim() || !selectedResume) {
      toast.warning("Please select a resume first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/resume/match-jd", {
        resumeId: selectedResume._id,
        jdText,
      });

      const matchedSkills = res.data.matchedSkills || [];
      const missingSkills = res.data.missingSkills || [];

      setMatched(matchedSkills);
      setMissing(missingSkills);

      setJdData({
        text: jdText,
        matchedSkills,
        missingSkills,
        resumeId: selectedResume._id,
      });

      matchedSkills.length >= missingSkills.length
        ? toast.success("JD matched successfully 🎯")
        : toast.info("JD matched, but many skills are missing ⚠️");

      setShowModal(false);
    } catch (err) {
      err.response?.status === 429
        ? toast.error("AI limit reached. Please try again later ⏳")
        : toast.error("JD matching failed");
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
        {/* HEADER */}
        <motion.header className={styles.header} variants={fadeUp}>
          <h1>Analyze Job Description</h1>
          <p>
            Paste job description below & discover matched and missing skills.
          </p>
        </motion.header>

        {/* CONTENT */}
        <div className={styles.content}>
          {/* LEFT */}
          <motion.section className={styles.left} variants={fadeUp}>
            <h3>Paste Job Description</h3>

            <textarea
              placeholder="Paste job description here..."
              value={jdText}
              onChange={(e) => {
                setJdText(e.target.value);
                setJdData((prev) => ({ ...prev, text: e.target.value }));
              }}
            />

            <p className={styles.tip}>
              💡 Include responsibilities & required technologies.
            </p>

            <motion.button
              className={styles.matchBtn}
              disabled={!jdText.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(true)}
            >
              Match Skills →
            </motion.button>

            {error && (
              <motion.p
                className={styles.error}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {error}
              </motion.p>
            )}
          </motion.section>

          {/* RIGHT */}
          <motion.section className={styles.right} variants={fadeUp}>
            {/* MATCHED */}
            <motion.div className={styles.card} whileHover={{ y: -4 }}>
              <h4>
                Skills Found <span>{matched.length} Matched</span>
              </h4>

              <motion.div
                className={styles.tags}
                variants={stagger}
                initial="hidden"
                animate="visible"
              >
                {matched.length ? (
                  matched.map((skill) => (
                    <motion.span
                      key={skill}
                      className={styles.matched}
                      variants={fadeUp}
                      whileHover={{ scale: 1.1 }}
                    >
                      ✓ {skill}
                    </motion.span>
                  ))
                ) : (
                  <span className={styles.muted}>No matched skills yet</span>
                )}
              </motion.div>
            </motion.div>

            {/* MISSING */}
            <motion.div className={styles.card} whileHover={{ y: -4 }}>
              <h4>Skills Missing</h4>

              <motion.div
                className={styles.tags}
                variants={stagger}
                initial="hidden"
                animate="visible"
              >
                {missing.length ? (
                  missing.map((skill) => (
                    <motion.span
                      key={skill}
                      className={styles.missing}
                      variants={fadeUp}
                      whileHover={{ scale: 1.1 }}
                    >
                      ✕ {skill}
                    </motion.span>
                  ))
                ) : (
                  <span className={styles.muted}>No missing skills</span>
                )}
              </motion.div>
            </motion.div>

            {/* ACTIONS */}
            <motion.div className={styles.actions} variants={fadeUp}>
              <button
                className={styles.interviewBtn}
                disabled={!jdData.resumeId || !jdText}
                onClick={() =>
                  navigate(`/JD/interview/${jdData.resumeId}`, {
                    state: { jdText },
                  })
                }
              >
                Generate Interview Questions →
              </button>

              <button
                className={styles.improveBtn}
                disabled={!jdData.resumeId || !jdText}
                onClick={() =>
                  navigate(`/JD/improvement/${jdData.resumeId}`, {
                    state: { jdText },
                  })
                }
              >
                Improve Resume →
              </button>
            </motion.div>
          </motion.section>
        </div>
      </motion.div>

      {/* 🔥 MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className={styles.modalBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.modal}
              variants={scaleFade}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <h3>Select Resume</h3>

              {resumes.length === 0 && <p>No resumes uploaded yet</p>}

              <ul className={styles.resumeList}>
                {resumes.map((r) => (
                  <li
                    key={r._id}
                    className={
                      selectedResume?._id === r._id ? styles.active : ""
                    }
                    onClick={() => setSelectedResume(r)}
                  >
                    {r.originalFileName}
                    <span>{r.analysis?.score || 0} ATS</span>
                  </li>
                ))}
              </ul>

              <div className={styles.modalActions}>
                <button onClick={() => setShowModal(false)}>Cancel</button>

                <button
                  onClick={handleMatch}
                  disabled={!selectedResume || loading}
                >
                  {loading ? "Matching..." : "Continue"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JD;
