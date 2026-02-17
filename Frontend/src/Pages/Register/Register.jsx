import React from 'react'
import styles from './Register.module.css'

const Register = () => {
  return (
    <div className={styles.page}>
      <img src="img1.svg" className={`${styles.bg} ${styles.i1}`}></img>
      <img src="img2.svg" className={`${styles.bg} ${styles.i2}`}></img>
      <img src="img3.svg" className={`${styles.bg} ${styles.i3}`}></img>
      <div className={styles.register}></div>
    </div>
  )
}

export default Register