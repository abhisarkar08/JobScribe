import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../Api/Axioscon";
import styles from "./Login.module.css";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/login", formData);
      navigate("/user");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.register}>
        {/* LEFT */}
        <div className={styles.left}>
          <h2>
            Optimize Your Resume
            <br />
            Beat the ATS with Confidence
          </h2>
          <img src="/illus.png" alt="illustration" />
        </div>

        {/* RIGHT */}
        <div className={styles.right}>
          <h2>Login to your Account</h2>

          <form onSubmit={handleSubmit}>
            <button
              type="button"
              className={styles.googleBtn}
              onClick={() =>
                (window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`)
              }
            >
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

            {error && <p className={styles.error}>{error}</p>}

            <button type="submit" className={styles.createBtn} disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className={styles.loginText}>
            Don't have an account?{" "}
            <span onClick={() => navigate("/register")}>Sign up</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;