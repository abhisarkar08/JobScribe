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
  const [isFallback, setIsFallback] = useState(false); // 🔥 NEW

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

        setSuggestions(
          Array.isArray(res.data.suggestions)
            ? res.data.suggestions
            : []
        );

        // 🔥 fallback detect
        setIsFallback(res.data.source === "fallback");
      } catch (err) {
        // ❌ ab 429 pe error nahi dikhana
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
        <button
          className={styles.backButton}
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        <h1 className={styles.title}>Resume Improvement</h1>
      </header>

      <main className={styles.container}>
        {loading && <p>Analyzing resume...</p>}

        {/* 🔥 fallback info */}
        {!loading && isFallback && (
          <p className={styles.fallbackNote}>
            High demand right now — showing basic resume improvement tips.
          </p>
        )}

        {error && <p className={styles.error}>{error}</p>}

        {!loading && !error && (
          <section className={styles.list}>
            {suggestions.map((item, i) => (
              <div key={i} className={styles.card}>
                <span className={styles.step}>S{i + 1}</span>
                <p className={styles.cardText}>{item}</p>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}