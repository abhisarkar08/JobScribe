import { useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from './Login.module.css'

const Login = () => {
  const navig = useNavigate();

  const [formData, setFormData] = useState({
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
              <h2>Login to your Account</h2>
    
              {/* 👇 FORM starts here but UI flow same */}
              <form onSubmit={handleSubmit}>
                <button type="button" className={styles.googleBtn}>
                  <img src="/google.jpg" alt="google" />
                  Sign in with Google
                </button>
    
                <div className={styles.or}>— OR —</div>
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
                  Login
                </button>
              </form>
              {/* 👆 FORM end */}
    
              <p className={styles.loginText}>
                Don't have an account?{" "}
                <span onClick={() => navig('/register')}>Sign up</span>
              </p>
            </div>
          </div>
        </div>
  )
}

export default Login