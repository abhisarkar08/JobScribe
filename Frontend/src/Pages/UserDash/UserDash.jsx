import styles from "./UserDash.module.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const containerStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const floatImg = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const UserDash = () => {
  const navig = useNavigate();

  return (
    <div className={styles.userDash}>
      <div className={styles.wrapper}>
        {/* HERO TEXT */}
        <section className={styles.hero}>
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6 }}
          >
            AI-Powered Resume & JD Analyzer
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Optimize Your Job Search with Smart Insights
          </motion.p>

          <motion.button
            className={styles.heroBtn}
            onClick={() => navig("/resume")}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 260 }}
          >
            Upload Your Resume
          </motion.button>
        </section>

        {/* CARDS */}
        <motion.section
          className={styles.cards}
          variants={containerStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Resume Card */}
          <motion.div
            className={styles.card}
            variants={fadeUp}
            whileHover={{ y: -12 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <motion.img
              src="/Resume-rafiki.svg"
              alt="Resume Analyzer"
              className={styles.cardImg}
              variants={floatImg}
              animate="animate"
            />
            <h3>Resume Analyzer</h3>
            <p>Get instant feedback on your resume.</p>
            <button onClick={() => navig("/resume")}>Get Started →</button>
          </motion.div>

          {/* JD Card*/}
          <motion.div
            className={`${styles.card} ${styles.highlight}`}
            variants={fadeUp}
            whileHover={{ y: -14, scale: 1.03 }}
            transition={{ type: "spring", stiffness: 220 }}
          >
            <motion.img
              src="/Job hunt-cuate.svg"
              alt="Job Description Matcher"
              className={styles.cardImg}
              variants={floatImg}
              animate="animate"
            />
            <h3>Job Description Matcher</h3>
            <p>Match your resume to job listings.</p>
            <button onClick={() => navig("/JD")}>Try Now →</button>
          </motion.div>

          {/* Dashboard Card */}
          <motion.div
            className={styles.card}
            variants={fadeUp}
            whileHover={{ y: -12 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <motion.img
              src="/Design.svg"
              alt="Dashboard Insights"
              className={styles.cardImg}
              variants={floatImg}
              animate="animate"
            />
            <h3>Dashboard Insights</h3>
            <p>Track your job application progress.</p>
            <button onClick={() => navig("/dashboard")}>
              View Analytics →
            </button>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
};

export default UserDash;
