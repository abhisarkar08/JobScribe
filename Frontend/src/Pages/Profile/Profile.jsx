import React, { useEffect, useState } from "react";
import styles from "./Profile.module.css";
import api from "../../Api/Axioscon";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const scaleFade = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

/* Component */

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [confirmSave, setConfirmSave] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  /*LOAD USER DATA */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/me");

        setFormData({
          firstName: res.data.fullName.firstName,
          lastName: res.data.fullName.lastName,
          email: res.data.email,
          password: "",
        });
      } catch {
        setError("Failed to load profile");
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* 🔹 CONFIRMED SAVE */
  const confirmSaveProfile = async () => {
    setError("");

    try {
      await api.put("/auth/update", {
        fullName: {
          firstName: formData.firstName,
          lastName: formData.lastName,
        },
        email: formData.email,
        password: formData.password || undefined,
      });

      toast.success("Profile updated successfully ");

      setIsEditing(false);
      setFormData((prev) => ({ ...prev, password: "" }));
    } catch {
      setError("Failed to update profile");
      toast.error("Failed to update profile");
    } finally {
      setConfirmSave(false);
    }
  };

  if (loading) return null;

  return (
    <>
      <div className={styles.profilePage}>
        <motion.div
          className={styles.profileCard}
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 className={styles.title} variants={fadeUp}>
            Profile Details
          </motion.h2>

          {error && (
            <motion.p
              className={styles.error}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}

          <motion.div className={styles.formGrid} variants={stagger}>
            <motion.div className={styles.field} variants={fadeUp}>
              <label>First Name</label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </motion.div>

            <motion.div className={styles.field} variants={fadeUp}>
              <label>Last Name</label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </motion.div>

            <motion.div
              className={`${styles.field} ${styles.full}`}
              variants={fadeUp}
            >
              <label>Email</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </motion.div>

            <motion.div
              className={`${styles.field} ${styles.full}`}
              variants={fadeUp}
            >
              <label>New Password</label>
              <input
                type="password"
                name="password"
                value={isEditing ? formData.password : ""}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="*****"
              />
            </motion.div>
          </motion.div>

          <motion.div className={styles.buttonRow} variants={fadeUp}>
            {!isEditing ? (
              <motion.button
                className={styles.editBtn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
              >
                Edit
              </motion.button>
            ) : (
              <motion.button
                className={styles.saveBtn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setConfirmSave(true)}
              >
                Save
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* SAVE POPUP */}
      <AnimatePresence>
        {confirmSave && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.confirmBox}
              variants={scaleFade}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <h3>Save Changes</h3>
              <p>Are you sure you want to save these changes?</p>

              <div className={styles.actions}>
                <button onClick={() => setConfirmSave(false)}>Cancel</button>
                <button
                  className={styles.primaryBtn}
                  onClick={confirmSaveProfile}
                >
                  Yes, Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Profile;
