import React, { useEffect, useState } from "react";
import styles from "./Profile.module.css";
import api from "../../Api/Axioscon";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  /* 🔹 LOAD USER DATA */
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
      } catch (err) {
        setError("Failed to load profile");
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

  /* 🔹 SAVE PROFILE */
  const handleSave = async () => {
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

      setIsEditing(false);
      setFormData((prev) => ({ ...prev, password: "" }));
    } catch (err) {
      setError("Failed to update profile");
    }
  };

  if (loading) return null;

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileCard}>
        <h2 className={styles.title}>Profile Details</h2>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label>First Name</label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div className={styles.field}>
            <label>Last Name</label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div className={`${styles.field} ${styles.full}`}>
            <label>Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div className={`${styles.field} ${styles.full}`}>
            <label>New Password</label>
            <input
              type="password"
              name="password"
              value={isEditing ? formData.password : ""}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="*****"
            />
          </div>
        </div>

        <div className={styles.buttonRow}>
          {!isEditing ? (
            <button
              className={styles.editBtn}
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          ) : (
            <button className={styles.saveBtn} onClick={handleSave}>
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;