import React, { useState, useContext } from "react";
import styles from "./Resume.module.css";
import { JobContext } from "../../Context/JobContext";
import api from "../../Api/Axioscon";

const Resume = () => {
  const { resumeData, setResumeData } = useContext(JobContext);

  const [file, setFile] = useState(resumeData?.file || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------- ATS SCORE LOGIC ---------- */
  const score = resumeData?.atsScore ?? 0;
  const safeScore = Math.max(0, Math.min(score, 100));

  let progressColor = "#e5e7eb"; // grey (default)
  if (safeScore >= 70) progressColor = "#22c55e"; // green
  else if (safeScore >= 40) progressColor = "#facc15"; // yellow
  else if (safeScore > 0) progressColor = "#ef4444"; // red

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
      setError("Please upload a resume first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("resume", file); // backend expects "resume"

      const res = await api.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { resumeId, analysis } = res.data;

      setResumeData({
        file,
        resumeId,
        atsScore: analysis.score,
        skills: analysis.skills || [],
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Resume upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* ---------- LEFT ---------- */}
        <section className={styles.left}>
          <h1>Analyze Your Resume</h1>
          <p>
            Get Instant <span>ATS Score</span> & Detailed Feedback
          </p>

          <div className={styles.uploadCard}>
            <h3>Upload Your Resume</h3>

            <div className={styles.dropBox}>
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
            </div>

            {file && (
              <div className={styles.fileRow}>
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

            <p className={styles.tip}>
              💡 Add proper headings, skills & keywords for better results.
            </p>
          </div>
        </section>

        {/* ---------- RIGHT ---------- */}
        <section className={styles.right}>
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
                {resumeData?.skills?.length > 0 ? (
                  resumeData.skills.map((s) => <span key={s}>{s}</span>)
                ) : (
                  <span className={styles.muted}>
                    No skills extracted yet
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Resume;