import React, { useEffect, useRef, useState, useContext } from "react";
import styles from "./NavBar.module.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { User, UserCog, Trash2, LogOut } from "lucide-react";
import { JobContext } from "../../Context/JobContext";
import api from "../../Api/Axioscon";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NavBar = () => {
  const { appName } = useContext(JobContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [confirmBox, setConfirmBox] = useState({
    show: false,
    type: "",
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* LOGOUT */
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      toast.success("Logged out successfully");
      navigate("/");
    } catch {
      toast.error("Logout failed");
    }
  };

  /* DELETE ACCOUNT */
  const handleDeleteAccount = async () => {
    try {
      await api.delete("/auth/delete");
      toast.success("Account deleted");
      navigate("/register");
    } catch {
      toast.error("Failed to delete account");
    }
  };

  const handleConfirm = () => {
    if (confirmBox.type === "logout") handleLogout();
    if (confirmBox.type === "delete") handleDeleteAccount();
    setConfirmBox({ show: false, type: "" });
  };

  return (
    <>
      <div className={styles.navBar}>
        {/* LEFT */}
        <div className={styles.navRight}>
          <div className={styles.Logs}>
            <div className={styles.logo}>
              <img src="/logoo.png" alt={appName} />
            </div>
            <div className={styles.name} onClick={() => navigate("/")}>
              {appName}
            </div>
          </div>

          {isHomePage && (
            <div className={styles.rest}>
              <HashLink smooth to="/#">
                Home
              </HashLink>
              <HashLink smooth to="/#section3">
                About
              </HashLink>
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
              <div className={styles.avatar} onClick={() => setOpen((p) => !p)}>
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
                    onClick={() =>
                      setConfirmBox({ show: true, type: "delete" })
                    }
                  >
                    <Trash2 size={16} />
                    Delete Account
                  </button>

                  <button
                    onClick={() =>
                      setConfirmBox({ show: true, type: "logout" })
                    }
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* POPUP */}
      {confirmBox.show && (
        <div className={styles.overlay}>
          <div className={styles.confirmBox}>
            <h3>
              {confirmBox.type === "logout"
                ? "Logout Confirmation"
                : "Delete Account"}
            </h3>

            <p>
              {confirmBox.type === "logout"
                ? "Are you sure you want to logout?"
                : "This action is permanent. Are you sure?"}
            </p>

            <div className={styles.actions}>
              <button onClick={() => setConfirmBox({ show: false, type: "" })}>
                Cancel
              </button>
              <button className={styles.dangerBtn} onClick={handleConfirm}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
