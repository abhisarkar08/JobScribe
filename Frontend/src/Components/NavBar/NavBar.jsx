import React, { useEffect, useRef, useState, useContext } from 'react'
import styles from './NavBar.module.css'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link'
import { User, UserCog, Trash2, LogOut } from 'lucide-react'
import { JobContext } from '../../Context/JobContext'

const NavBar = () => {
  const { appName } = useContext(JobContext)   // ✅ CONTEXT USED
  const navig = useNavigate()
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={styles.navBar}>
      {/* LEFT */}
      <div className={styles.navRight}>
        <div className={styles.Logs}>
          <div className={styles.logo}>
            <img src="/logo.png" alt={appName} />
          </div>
          <div className={styles.name} onClick={() => navig("/")}>
            {appName}
          </div>
        </div>

        {isHomePage && (
          <div className={styles.rest}>
            <HashLink smooth to="/#">Home</HashLink>
            <HashLink smooth to="/#section3">About</HashLink>
            <HashLink smooth to="/#section4">Frequently Asked Questions</HashLink>
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div className={styles.navLeft}>
        {isHomePage ? (
          <NavLink to="/register" className={styles.getStarted}>
            Get Started
          </NavLink>
        ) : (
          <div className={styles.profileWrapper} ref={dropdownRef}>
            <div
              className={styles.avatar}
              onClick={() => setOpen(prev => !prev)}
            >
              <User size={20} />
            </div>

            {open && (
              <div className={styles.dropdown}>
                <button>
                  <UserCog size={16} />
                  Edit Profile
                </button>

                <button className={styles.danger}>
                  <Trash2 size={16} />
                  Delete Account
                </button>

                <button>
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default NavBar