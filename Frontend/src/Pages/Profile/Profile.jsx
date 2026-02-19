import React, { useState } from "react";
import styles from "./Profile.module.css";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "Thomas",
    lastName: "Hardison",
    email: "thomashardison@dayrep.com",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log("Saved Data:", formData);
    // 👉 API call later
  };

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileCard}>
        <h2 className={styles.title}>Profile Details</h2>

        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label>First Name</label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Enter first name"
            />
          </div>

          <div className={styles.field}>
            <label>Last Name</label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Enter last name"
            />
          </div>

          <div className={`${styles.field} ${styles.full}`}>
            <label>Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Enter email"
            />
          </div>

          <div className={`${styles.field} ${styles.full}`}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="••••••••"
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
