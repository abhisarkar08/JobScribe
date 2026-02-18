import React, { useState } from "react";
import styles from "./Resume.module.css";

const Resume = () => {
  const [file, setFile] = useState(null);

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* LEFT SECTION */}
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
              </p><br />
              <span>OR</span> <br />

              <input
                type="file"
                id="resume"
                hidden
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files[0])}
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
                    onClick={() => setFile(null)}
                    aria-label="Remove file"
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

        {/* RIGHT SECTION */}
        <section className={styles.right}>
          <div className={styles.reportCard}>
            <h3>ATS Report Preview</h3>

            <div className={styles.scoreBox}>
              <div className={styles.scoreCircle}>85</div>
              <span>Good Match</span>
            </div>

            <div className={styles.breakdown}>
              <div>
                <span>Skills</span>
                <div className={styles.bar}><span /></div>
              </div>
              <div>
                <span>Education</span>
                <div className={styles.bar}><span /></div>
              </div>
              <div>
                <span>Experience</span>
                <div className={styles.bar}><span /></div>
              </div>
              <div>
                <span>Keywords</span>
                <div className={styles.bar}><span /></div>
              </div>
            </div>

            <div className={styles.skills}>
              <h4>Skills Found</h4>
              <div className={styles.skillTags}>
                <span>JavaScript</span>
                <span>React</span>
                <span>Node.js</span>
                <span>HTML</span>
                <span>CSS</span>
                <span>MongoDB</span>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Resume;
