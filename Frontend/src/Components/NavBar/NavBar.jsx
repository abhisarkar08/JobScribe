import React, { useEffect, useRef, useState, useContext } from "react"
import styles from "./NavBar.module.css"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { HashLink } from "react-router-hash-link"
import { User, UserCog, Trash2, LogOut } from "lucide-react"
import { JobContext } from "../../Context/JobContext"
import api from "../../Api/Axioscon"

const NavBar = () => {
  const { appName } = useContext(JobContext)
  const navigate = useNavigate()
  const location = useLocation()
  const isHomePage = location.pathname === "/"

  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  /* 🔓 LOGOUT */
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout")
    } catch (err) {
      // even if error, still force logout on frontend
    } finally {
      navigate("/login")
    }
  }

  /* ❌ DELETE ACCOUNT */
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure? This will permanently delete your account."
    )

    if (!confirmDelete) return

    try {
      await api.delete("/auth/delete")
      navigate("/register")
    } catch (err) {
      alert("Failed to delete account. Try again.")
    }
  }

  return (
    <div className={styles.navBar}>
      {/* LEFT */}
      <div className={styles.navRight}>
        <div className={styles.Logs}>
          <div className={styles.logo}>
            <img src="/logo.png" alt={appName} />
          </div>
          <div className={styles.name} onClick={() => navigate("/")}>
            {appName}
          </div>
        </div>

        {isHomePage && (
          <div className={styles.rest}>
            <HashLink smooth to="/#">Home</HashLink>
            <HashLink smooth to="/#section3">About</HashLink>
            <HashLink smooth to="/#section4">
              Frequently Asked Questions
            </HashLink>
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
              onClick={() => setOpen((prev) => !prev)}
            >
              <User size={20} />
            </div>

            {open && (
              <div className={styles.dropdown}>
                <button onClick={() => navigate("/profile")}>
                  <UserCog size={16} />
                  Edit Profile
                </button>

                <button
                  className={styles.danger}
                  onClick={handleDeleteAccount}
                >
                  <Trash2 size={16} />
                  Delete Account
                </button>

                <button onClick={handleLogout}>
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