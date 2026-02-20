import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Err404.module.css'

const Err404 = () => {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.oops}>Oops!</h1>

      <h2 className={styles.code}>404 - Page Not Found</h2>

      <p className={styles.desc}>
        The page you are looking for might have been removed,
        had its name changed or is temporarily unavailable.
      </p>

      <Link to="/" className={styles.btn}>
        Go to Homepage
      </Link>
    </div>
  )
}

export default Err404