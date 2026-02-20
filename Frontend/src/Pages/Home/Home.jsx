import React, { useState, useContext } from 'react'
import styles from './Home.module.css'
import { JobContext } from '../../Context/JobContext'

const faqs = [
  {
    question: "What is JobScribe?",
    answer:
      "JobScribe is a smart resume analysis and job-matching platform that helps you compare your resume with job descriptions and identify skill gaps before applying."
  },
  {
    question: "How does resume analysis work?",
    answer:
      "You upload your resume, select or paste a job description, and JobScribe analyzes skills, keywords, and experience to generate a match score and insights."
  },
  {
    question: "Is JobScribe free to use?",
    answer:
      "Yes, JobScribe offers a free version with basic resume analysis. Advanced features like detailed skill insights may be part of premium plans."
  },
  {
    question: "Which roles is JobScribe best for?",
    answer:
      "JobScribe works best for students, freshers, and early professionals applying for roles like Software Developer, Frontend, Backend, Data Analyst, and more."
  },
  {
    question: "Will JobScribe help me get interview-ready?",
    answer:
      "Yes. JobScribe highlights missing skills, weak areas, and improvements needed so you can focus on the right preparation before interviews."
  }
]

const Home = () => {
  const { appName } = useContext(JobContext) // ✅ CONTEXT USED
  const [openIndex, setOpenIndex] = useState(null)

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className={styles.home}>
      {/* HERO SECTION */}
      <div className={styles.section1}>
        <h2>Turn Your Resume into</h2>
        <h2>an Interview-Ready Profile</h2>
        <h4>
          Upload your resume, match it with job roles, track skill gaps, and
        </h4>
        <h4>
          get clear guidance on what to improve—before you apply on {appName}.
        </h4>
        <button className={styles.ctaButton}>Get Started</button>
        <img src="/homedas.png" alt={`${appName} Dashboard`} />
      </div>

      {/* SPACER / DESIGN SECTION */}
      <div className={styles.section2}></div>

      {/* FEATURES SECTION */}
      <div className={styles.section3} id="section3">
        <h2 className={styles.section3Title}>
          Powerful features built for job seekers
        </h2>

        <p className={styles.section3Subtitle}>
          {appName} helps you analyze resumes, match them with job descriptions,
          and clearly understand what skills you need to improve before applying.
        </p>

        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <img src="/Resume-rafiki.svg" alt="Resume Analysis" />
            <h3>Resume Analysis</h3>
            <p>
              Upload your resume and get a detailed breakdown of skills,
              experience, and keyword relevance for your target roles.
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

      {/* FAQ SECTION */}
      <div className={styles.section4} id="section4">
        <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
        <p className={styles.faqSubtitle}>
          Find answers to common questions about {appName} and how it helps you
          improve your resume and job matches.
        </p>

        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`${styles.faqItem} ${
                openIndex === index ? styles.active : ""
              }`}
              onClick={() => toggleFAQ(index)}
            >
              <div className={styles.faqQuestion}>
                <span>{faq.question}</span>
                <span className={styles.icon}>
                  {openIndex === index ? "−" : "+"}
                </span>
              </div>

              {openIndex === index && (
                <p className={styles.faqAnswer}>{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home