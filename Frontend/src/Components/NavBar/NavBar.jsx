import React from 'react'
import styles from './NavBar.module.css'
import { NavLink } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link'

const NavBar = () => {
  return (
    <div className={styles.navBar}>
      <div className={styles.navRight}>
        <div className={styles.Logs}>
          <div className={styles.logo}>
            <img src="/logo.png" alt="Logo" />
          </div>
          <div className={styles.name}>JobScribe</div>
        </div>

        <div className={styles.rest}>
          <HashLink smooth to="/#home">Home</HashLink>
          <HashLink smooth to="/#features">Features</HashLink>
          <HashLink smooth to="/#about">About</HashLink>
        </div>
      </div>

      <div className={styles.navLeft}>
        <NavLink to="/register" className={styles.getStarted}>
          Get Started
        </NavLink>
      </div>
    </div>
  )
}

export default NavBar