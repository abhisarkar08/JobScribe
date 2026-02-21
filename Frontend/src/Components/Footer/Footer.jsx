import React from 'react'
import styles from './Footer.module.css'
import { JobContext } from "../../Context/JobContext"
import { useContext } from "react"

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
            <span className={styles.name}>JobScribe</span>
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
            <a href="#">Home</a>
            <a href="#">Features</a>
            <a href="#">About</a>
            <a href="#">Pricing</a>
          </div>

          <div>
            <h4>Product</h4>
            <a href="#">Resume ATS</a>
            <a href="#">JD Match</a>
            <a href="#">Dashboard</a>
            <a href="#">Analytics</a>
          </div>
        </div>
      </div>

      {/* SIMPLE COPYRIGHT */}
      <p className={styles.copy}>
        © 2026 Created by Abhishek Sarkar. Built for job seekers.
      </p>
    </footer>
  )
}

export default Footer
