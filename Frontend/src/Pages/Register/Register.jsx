import React from 'react'
import styles from './Register.module.css'

const Register = () => {
  return (
    <div className={styles.page}>
      <img src="img1.svg" className={`${styles.bg} ${styles.i1}`}></img>
      <img src="img2.svg" className={`${styles.bg} ${styles.i2}`}></img>
      <img src="img3.svg" className={`${styles.bg} ${styles.i3}`}></img>
      <div className={styles.register}>
        {/* Left Section */}
        <div className={styles.left}>
          <h2>Find 3D Objects, Mockups<br />and Illustrations here</h2>
          <img src="/register-illustration.png" alt="illustration" />
        </div>

        {/* Right Section */}
        <div className={styles.right}>
          <h2>Create Account</h2>

          <button className={styles.googleBtn}>
            <img src="/google.svg" alt="google" />
            Sign up with Google
          </button>

          <div className={styles.or}>— OR —</div>

          <div className={styles.nameRow}>
            <input type="text" placeholder="First Name" />
            <input type="text" placeholder="Last Name" />
          </div>

          <input type="email" placeholder="Email Address" />
          <input type="password" placeholder="Password" />

          <button className={styles.createBtn}>Create Account</button>

          <p className={styles.loginText}>
            Already have an account? <span>Log in</span>
          </p>
        </div>
      </div>

    </div>
  )
}

export default Register