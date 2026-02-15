import React from 'react'
import styles from './NavBar.module.css'
const NavBar = () => {
  return (
    <div className={styles.navBar}>
      <div className={styles.navRight}>
        <div className={styles.Logs}>
          <div className={styles.logo}></div>
          <div className={styles.name}>JobScribe</div>
        </div>
        <div className={styles.rest}>
          <NavLinks>Home</NavLinks>
          <NavLinks>About</NavLinks>
          <NavLinks>Features</NavLinks>
        </div>
      </div>
      <div className={styles.navLeft}>
        <button className={styles.getStarted}>Get Started</button>
      </div>
    </div>
  )
}

export default NavBar