import React from 'react'
import styles from './Home.module.css'

const Home = () => {
  return (
    <div className={styles.home}>
      <div className={styles.section1}>
        <h2>Turn Your Resume into</h2>
        <h2>an Interview-Ready Profile</h2>
        <h4>Upload your resume, match it with job roles, track skill gaps, and</h4>
        <h4>get clear guidance on what to improve—before you apply.</h4>
        <button className={styles.ctaButton}>Get Started</button>
        <img src="/homedas.png" alt="Resume Analyzer" />
      </div>
      <div className={styles.section2}></div>
      <div className={styles.section3}>
        <h2 className={styles.section3Title}>
          Powerful features built for job seekers
        </h2>

        <p className={styles.section3Subtitle}>
          JobScribe helps you analyze resumes, match them with job descriptions,
          and clearly understand what skills you need to improve before applying.
        </p>

        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <img src="/Resume-rafiki.svg" alt="Resume Analysis" />
            <h3>Resume Analysis</h3>
            <p>
              Upload your resume and get a detailed breakdown of skills, experience,
              and keyword relevance for your target roles.
            </p>
          </div>

          <div className={styles.featureCard}>
            <img src="/Job hunt-cuate.svg" alt="Job Matching" />
            <h3>Job Match Score</h3>
            <p>
              Compare your resume with job descriptions and receive a clear match
              score showing how well you fit the role.
            </p>
          </div>

          <div className={styles.featureCard}>
            <img src="/Design.svg" alt="Skill Gaps" />
            <h3>Skill Gap Insights</h3>
            <p>
              Identify missing skills, track weaknesses, and know exactly what to
              learn next to become interview-ready.
            </p>
          </div>
        </div>
      </div>
      <div className={styles.section4}></div>
    </div>
  )
}

export default Home