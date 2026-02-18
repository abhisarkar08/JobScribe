import React from "react";
import styles from "./UserDash.module.css";
import { useNavigate } from "react-router-dom";

const UserDash = () => {
  const navig = useNavigate();
  return (
    <div className={styles.userDash}>
      <div className={styles.wrapper}>
        {/* HERO TEXT */}
        <section className={styles.hero}>
          <h1>AI-Powered Resume & JD Analyzer</h1>
          <p>Optimize Your Job Search with Smart Insights</p>

          <button className={styles.heroBtn} onClick={() => navig('/resume')}>
            Upload Your Resume
          </button>
        </section>

        {/* CARDS */}
        <section className={styles.cards}>
          {/* Resume Card */}
          <div className={styles.card}>
            <img
              src="/Resume-rafiki.svg"
              alt="Resume Analyzer"
              className={styles.cardImg}
            />
            <h3>Resume Analyzer</h3>
            <p>Get instant feedback on your resume.</p>
            <button onClick={() => navig('/resume')}>Get Started →</button>
          </div>

          {/* JD Card */}
          <div className={`${styles.card} ${styles.highlight}`}>
            <img
              src="/Job hunt-cuate.svg"
              alt="Job Description Matcher"
              className={styles.cardImg}
            />
            <h3>Job Description Matcher</h3>
            <p>Match your resume to job listings.</p>
            <button onClick={() => navig('/JD')}>Try Now →</button>
          </div>

          {/* Dashboard Card */}
          <div className={styles.card}>
            <img
              src="/Design.svg"
              alt="Dashboard Insights"
              className={styles.cardImg}
            />
            <h3>Dashboard Insights</h3>
            <p>Track your job application progress.</p>
            <button onClick={() => navig('/dashboard')}>View Analytics →</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserDash;
