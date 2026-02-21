import React, { useState, useContext, useEffect } from "react";
import styles from "./JD.module.css";
import { JobContext } from "../../Context/JobContext";
import api from "../../Api/Axioscon";
import { useNavigate } from "react-router-dom";

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


  useEffect(() => {
    if (jdData.resumeId && resumes.length) {
      const found = resumes.find(r => r._id === jdData.resumeId);
      if (found) setSelectedResume(found);
    }
  }, [jdData.resumeId, resumes]);
  /* 🔹 FETCH USER RESUMES */
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await api.get("/resume/my-resumes");
        setResumes(res.data.resumes || []);
      } catch (err) {
        setError("Failed to fetch resumes");
      }
    };

    fetchResumes();
  }, []);

  /* 🔹 MATCH JD WITH SELECTED RESUME */
  const handleMatch = async () => {
    if (!jdText.trim() || !selectedResume) return;

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/resume/match-jd", {
        resumeId: selectedResume._id,
        jdText,
      });

      setMatched(res.data.matchedSkills || []);
      setMissing(res.data.missingSkills || []);

      /* 🔥 store in context */
      setJdData({
        text: jdText,
        matchedSkills: res.data.matchedSkills || [],
        missingSkills: res.data.missingSkills || [],
        resumeId: selectedResume._id,
      });

      setShowModal(false);
    } catch (err) {
      setError("JD matching failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* HEADER */}
        <header className={styles.header}>
          <h1>Analyze Job Description</h1>
          <p>
            Paste job description below & discover matched and missing skills.
          </p>
        </header>

        {/* MAIN CONTENT */}
        <div className={styles.content}>
          {/* LEFT */}
          <section className={styles.left}>
            <h3>Paste Job Description</h3>

            <textarea
              placeholder="Paste job description here..."
              value={jdText}
              onChange={(e) => {
                setJdText(e.target.value);
                setJdData(prev => ({
                  ...prev,
                  text: e.target.value,
                }));
              }}
            />

            <p className={styles.tip}>
              💡 Include responsibilities & required technologies.
            </p>

            <button
              className={styles.matchBtn}
              disabled={!jdText.trim()}
              onClick={() => setShowModal(true)}
            >
              Match Skills →
            </button>

            {error && <p className={styles.error}>{error}</p>}
          </section>

          {/* RIGHT */}
          <section className={styles.right}>
            {/* MATCHED */}
            <div className={styles.card}>
              <h4>
                Skills Found{" "}
                <span>{matched.length} Matched</span>
              </h4>

              <div className={styles.tags}>
                {matched.length ? (
                  matched.map((skill) => (
                    <span key={skill} className={styles.matched}>
                      ✓ {skill}
                    </span>
                  ))
                ) : (
                  <span className={styles.muted}>
                    No matched skills yet
                  </span>
                )}
              </div>
            </div>

            {/* MISSING */}
            <div className={styles.card}>
              <h4>Skills Missing</h4>

              <div className={styles.tags}>
                {missing.length ? (
                  missing.map((skill) => (
                    <span key={skill} className={styles.missing}>
                      ✕ {skill}
                    </span>
                  ))
                ) : (
                  <span className={styles.muted}>
                    No missing skills
                  </span>
                )}
              </div>
            </div>

            {/* ACTIONS */}
            <div className={styles.actions}>
              <button
                className={styles.interviewBtn}
                disabled={!selectedResume || !jdText}
                onClick={() =>
                  navigate(`/JD/interview/${selectedResume._id}`, {
                    state: { jdText },
                  })
                }
              >
                Generate Interview Questions →
              </button>

              <button
                className={styles.improveBtn}
                disabled={!selectedResume || !jdText}
                onClick={() =>
                  navigate(`/JD/improvement/${selectedResume._id}`, {
                    state: { jdText },
                  })
                }
              >
                Improve Resume →
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* 🔥 RESUME SELECT MODAL */}
      {showModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <h3>Select Resume</h3>

            {resumes.length === 0 && (
              <p>No resumes uploaded yet</p>
            )}

            <ul className={styles.resumeList}>
              {resumes.map((r) => (
                <li
                  key={r._id}
                  className={
                    selectedResume?._id === r._id
                      ? styles.active
                      : ""
                  }
                  onClick={() => setSelectedResume(r)}
                >
                  {r.originalFileName}
                  <span>{r.analysis?.score || 0} ATS</span>
                </li>
              ))}
            </ul>

            <div className={styles.modalActions}>
              <button onClick={() => setShowModal(false)}>
                Cancel
              </button>

              <button
                onClick={handleMatch}
                disabled={!selectedResume || loading}
              >
                {loading ? "Matching..." : "Continue"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JD;