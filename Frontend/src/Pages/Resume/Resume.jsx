import React, { useState, useContext } from "react";
import styles from "./Resume.module.css";
import { JobContext } from "../../Context/JobContext";

const Resume = () => {
  const { resumeData, setResumeData } = useContext(JobContext);
  const [file, setFile] = useState(resumeData.file);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);

    setResumeData({
      ...resumeData,
      file: selected,
    });
  };

  const handleRemove = () => {
    setFile(null);
    setResumeData({
      ...resumeData,
      file: null,
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* LEFT */}
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
              <span>OR</span> <br />

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

              <small>Accepted Formats: PDF, DOCX (Max 2MB)</small>
            </div>

            {file && (
              <div className={styles.fileRow}>
                <span className={styles.fileName}>{file.name}</span>

                <div className={styles.fileActions}>
                  <span className={styles.success}>Uploaded</span>

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

            <button className={styles.generateBtn}>
              Generate ATS Report →
            </button>

            <p className={styles.tip}>
              💡 Add proper headings, skills & keywords for better results.
            </p>
          </div>
        </section>

        {/* RIGHT */}
        <section className={styles.right}>
          <div className={styles.reportCard}>
            <h3>ATS Report Preview</h3>

            <div className={styles.scoreBox}>
              <div className={styles.scoreCircle}>
                {resumeData.atsScore}
              </div>
              <span>Good Match</span>
            </div>

            <div className={styles.skills}>
              <h4>Skills Found</h4>
              <div className={styles.skillTags}>
                {resumeData.skills.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Resume;