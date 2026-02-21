import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Api/Axioscon";
import styles from "./Register.module.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
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

    if (!formData.firstName || !formData.email || !formData.password) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", {
        fullName: {
          firstName: formData.firstName,
          lastName: formData.lastName,
        },
        email: formData.email,
        password: formData.password,
      });

      navigate("/user"); // or /login
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
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
          <h2>Create Account</h2>

          <form onSubmit={handleSubmit}>
            <button
              type="button"
              className={styles.googleBtn}
              onClick={() =>
                (window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`)
              }
            >
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

            {error && <p className={styles.error}>{error}</p>}

            <button type="submit" className={styles.createBtn} disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <p className={styles.loginText}>
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Log in</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;