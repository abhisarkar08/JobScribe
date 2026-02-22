import React, { useContext } from "react"
import styles from "./Footer.module.css"
import { JobContext } from "../../Context/JobContext"
import { Link } from "react-router-dom"

const Footer = () => {
  const { appName } = useContext(JobContext)

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        {/* LEFT */}
        <div className={styles.brand}>
          <div className={styles.logoRow}>
            <div className={styles.logo}>
              <img src="/logoo.png" alt={appName} />
            </div>
            <span className={styles.name}>{appName}</span>
          </div>

          <p className={styles.desc}>
            Smart resume analysis & job matching platform to help you
            crack interviews faster.
          </p>

          <div className={styles.subscribeBox}>
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </div>

          <p className={styles.privacy}>
            We respect your privacy. No spam ever.
          </p>
        </div>

        {/* RIGHT */}
        <div className={styles.links}>
          <div>
            <h4>Pages</h4>
            <Link to="/">Home</Link>
            <Link to="/#features">Features</Link>
            <Link to="/#about">About</Link>
            <Link to="/#pricing">Pricing</Link>
          </div>

          <div>
            <h4>Product</h4>
            <Link to="/resume">Resume ATS</Link>
            <Link to="/JD">JD Match</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/dashboard">Analytics</Link>
          </div>
        </div>
      </div>

      <p className={styles.copy}>
        © 2026 Created by Abhishek Sarkar. Built for job seekers.
      </p>
    </footer>
  )
}

export default Footer