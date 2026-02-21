import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import styles from "./Improvement.module.css";
import api from "../../Api/Axioscon";

export default function Improvement() {
  const navigate = useNavigate();
  const { resumeId } = useParams();
  const location = useLocation();
  const { jdText } = location.state || {};

  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!jdText) {
      navigate("/JD", { replace: true });
      return;
    }

    const fetchImprovements = async () => {
      try {
        const res = await api.post("/resume/improve-resume", {
          resumeId,
          jdText,
        });

        const raw =
          res.data.suggestions?.content ||
          res.data.suggestions?.text ||
          res.data.suggestions;
        let parsed = [];

        if (Array.isArray(raw)) {
          parsed = raw;
        } else if (typeof raw === "string") {
          parsed = raw
            .split("\n")
            .map(s => s.replace(/^[-•\d.]+\s*/, "").trim())
            .filter(Boolean);
        }

        setSuggestions(parsed);
      } catch (err) {
        setError("Failed to generate improvements");
      } finally {
        setLoading(false);
      }
    };

    fetchImprovements();
  }, [resumeId, jdText, navigate]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 className={styles.title}>Resume Improvement</h1>
      </header>

      <main className={styles.container}>
        {loading && <p>Analyzing resume...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {!loading && !error && (
          <section className={styles.columns}>
            <div className={styles.panel}>
              <h2 className={styles.panelTitle}>Suggestions</h2>
              <div className={styles.list}>
                {suggestions.map((item, i) => (
                  <div key={i} className={styles.card}>
                    <div className={styles.step}>S{i + 1}</div>
                    <p className={styles.cardText}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}