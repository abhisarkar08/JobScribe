import { useState } from "react";
import styles from './Register.module.css'
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navig = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  return (
    <div className={styles.page}>
      <div className={styles.register}>
        {/* Left Section */}
        <div className={styles.left}>
          <h2>
            Optimize Your Resume
            <br />
            Beat the ATS with Confidence
          </h2>
          <img src="/illus.png" alt="illustration" />
        </div>

        {/* Right Section */}
        <div className={styles.right}>
          <h2>Create Account</h2>

          {/* 👇 FORM starts here but UI flow same */}
          <form onSubmit={handleSubmit}>
            <button type="button" className={styles.googleBtn}>
              <img src="/google.jpg" alt="google" />
              Sign up with Google
            </button>

            <div className={styles.or}>— OR —</div>

            <div className={styles.nameRow}>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />

            <button type="submit" className={styles.createBtn}>
              Create Account
            </button>
          </form>
          {/* 👆 FORM end */}

          <p className={styles.loginText}>
            Already have an account?{" "}
            <span onClick={() => navig('/login')}>Log in</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
