import React, { useState, useContext } from "react";
import styles from "./Home.module.css";
import { JobContext } from "../../Context/JobContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const faqs = [
  {
    question: "What is JobScribe?",
    answer:
      "JobScribe is a smart resume analysis and job-matching platform that helps you compare your resume with job descriptions and identify skill gaps before applying.",
  },
  {
    question: "How does resume analysis work?",
    answer:
      "You upload your resume, select or paste a job description, and JobScribe analyzes skills, keywords, and experience to generate a match score and insights.",
  },
  {
    question: "Is JobScribe free to use?",
    answer:
      "Yes, JobScribe offers a free version with basic resume analysis. Advanced features like detailed skill insights may be part of premium plans.",
  },
  {
    question: "Which roles is JobScribe best for?",
    answer:
      "JobScribe works best for students, freshers, and early professionals applying for roles like Software Developer, Frontend, Backend, Data Analyst, and more.",
  },
  {
    question: "Will JobScribe help me get interview-ready?",
    answer:
      "Yes. JobScribe highlights missing skills, weak areas, and improvements needed so you can focus on the right preparation before interviews.",
  },
];

// reusable animation
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const Home = () => {
  const navigate = useNavigate();
  const { appName } = useContext(JobContext);
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={styles.home}>
      {/* HERO SECTION */}
      <div className={styles.section1}>
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6 }}
        >
          Turn Your Resume into
        </motion.h2>

        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          an Interview-Ready Profile
        </motion.h2>

        <motion.h4
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Upload your resume, match it with job roles, track skill gaps, and
        </motion.h4>

        <motion.h4
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          get clear guidance on what to improve—before you apply on {appName}.
        </motion.h4>

        <motion.button
          className={styles.ctaButton}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
          onClick={() => navigate("/login")} 
        >
          Get Started
        </motion.button>

        <motion.img
          src="/homedas.png"
          alt={`${appName} Dashboard`}
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* SPACER */}
      <div className={styles.section2}></div>

      {/* FEATURES SECTION */}
      <div className={styles.section3} id="section3">
        <motion.h2
          className={styles.section3Title}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Powerful features built for job seekers
        </motion.h2>

        <motion.p
          className={styles.section3Subtitle}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {appName} helps you analyze resumes, match them with job descriptions,
          and clearly understand what skills you need to improve before
          applying.
        </motion.p>

        <motion.div
          className={styles.featuresGrid}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: { transition: { staggerChildren: 0.2 } },
          }}
        >
          {[
            {
              img: "/Resume-rafiki.svg",
              title: "Resume Analysis",
              text: "Upload your resume and get a detailed breakdown of skills, experience, and keyword relevance.",
            },
            {
              img: "/Job hunt-cuate.svg",
              title: "Job Match Score",
              text: "Compare your resume with job descriptions and receive a clear match score.",
            },
            {
              img: "/Design.svg",
              title: "Skill Gap Insights",
              text: "Identify missing skills, track weaknesses, and know exactly what to learn next.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className={styles.featureCard}
              variants={fadeUp}
              whileHover={{ y: -10 }}
            >
              <img src={item.img} alt={item.title} />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* FAQ SECTION */}
      <div className={styles.section4} id="section4">
        <motion.h2
          className={styles.faqTitle}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Frequently Asked Questions
        </motion.h2>

        <p className={styles.faqSubtitle}>
          Find answers to common questions about {appName} and how it helps you
          improve your resume and job matches.
        </p>

        <div className={styles.faqList}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={index}
                className={`${styles.faqItem} ${isOpen ? styles.active : ""}`}
                onClick={() => toggleFAQ(index)}
                layout
              >
                <div className={styles.faqQuestion}>
                  <span>{faq.question}</span>
                  <motion.span
                    className={styles.icon}
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {isOpen ? "−" : "+"}
                  </motion.span>
                </div>

                {isOpen && (
                  <motion.p
                    className={styles.faqAnswer}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    {faq.answer}
                  </motion.p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
