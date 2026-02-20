import React, { useState, useContext } from "react";
import styles from "./JD.module.css";
import { JobContext } from "../../Context/JobContext";

const JD = () => {
  const { setJdData } = useContext(JobContext);

  const [jdText, setJdText] = useState("");

  const matched = [
    "JavaScript",
    "React",
    "Node.js",
    "Git",
    "HTML",
  ];

  const missing = [
    "Python",
    "Express",
    "AWS",
    "MongoDB",
  ];

  const handleMatch = () => {
    setJdData({
      text: jdText,
      matchedSkills: matched,
      missingSkills: missing,
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* HEADER */}
        <header className={styles.header}>
          <h1>Analyze Job Description</h1>
          <p>
            Paste job description below & discover matched and
            missing skills.
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
              onChange={(e) => setJdText(e.target.value)}
            />

            <p className={styles.tip}>
              💡 Include responsibilities & required technologies.
            </p>

            <button
              className={styles.matchBtn}
              disabled={!jdText.trim()}
              onClick={handleMatch}
            >
              Match Skills →
            </button>
          </section>

          {/* RIGHT */}
          <section className={styles.right}>
            {/* MATCHED */}
            <div className={styles.card}>
              <h4>
                Skills Found <span>{matched.length}/8 Matched</span>
              </h4>

              <div className={styles.tags}>
                {matched.map((skill) => (
                  <span key={skill} className={styles.matched}>
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* MISSING */}
            <div className={styles.card}>
              <h4>Skills Missing</h4>

              <div className={styles.tags}>
                {missing.map((skill) => (
                  <span key={skill} className={styles.missing}>
                    ✕ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* ACTIONS */}
            <div className={styles.actions}>
              <button className={styles.interviewBtn}>
                Generate Interview Questions →
              </button>

              <button className={styles.improveBtn}>
                Improve Resume →
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default JD;