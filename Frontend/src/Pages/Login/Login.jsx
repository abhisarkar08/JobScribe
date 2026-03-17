import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../Api/Axioscon";
import styles from "./Login.module.css";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    /* USER SIDE VALIDATION */
    if (!formData.email || !formData.password) {
      const msg = "Please enter email and password";
      setFormError(msg);
      toast.warning(msg);
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/login", formData);

      toast.success("Login successful ");

      setTimeout(() => {
        navigate("/user");
      }, 700);
    } catch (err) {
      const msg = err?.response?.data?.message || "Invalid email or password";
      setFormError(msg);
      toast.error(msg);
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
              onClick={() => {
                window.location.href = "/api/auth/google";
              }}
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

            {/*FORM ERROR */}
            {formError && <p className={styles.error}>{formError}</p>}

            <button
              type="submit"
              className={styles.createBtn}
              disabled={loading}
            >
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
