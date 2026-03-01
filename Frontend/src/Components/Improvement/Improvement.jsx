import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import styles from "./Improvement.module.css";
import api from "../../Api/Axioscon";

/* =====================================================
   🔥 NORMALIZE SUGGESTIONS
   - STRING
   - OBJECT (skills_to_add, bullet_point_improvements, etc.)
===================================================== */
const normalizeSuggestions = (raw = []) => {
  const result = [];

  raw.forEach((item) => {
    // ✅ string case
    if (typeof item === "string") {
      result.push(item);
      return;
    }

    // ✅ object case (AI structured response)
    if (typeof item === "object" && item !== null) {
      if (Array.isArray(item.skills_to_add)) {
        item.skills_to_add.forEach((s) =>
          result.push(`Add skill: ${s}`)
        );
      }

      if (Array.isArray(item.bullet_point_improvements)) {
        result.push(...item.bullet_point_improvements);
      }

      if (Array.isArray(item.ats_keyword_improvements)) {
        item.ats_keyword_improvements.forEach((k) =>
          result.push(`Include ATS keyword: ${k}`)
        );
      }

      if (
        item.section_improvements &&
        typeof item.section_improvements === "object"
      ) {
        Object.entries(item.section_improvements).forEach(
          ([section, text]) => {
            result.push(`${section.toUpperCase()}: ${text}`);
          }
        );
      }
    }
  });

  return result;
};

export default function Improvement() {
  const navigate = useNavigate();
  const { resumeId } = useParams();
  const location = useLocation();
  const { jdText } = location.state || {};

  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFallback, setIsFallback] = useState(false);

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

        const raw = res.data.suggestions;

        if (Array.isArray(raw)) {
          setSuggestions(normalizeSuggestions(raw));
        } else {
          setSuggestions([]);
        }

        setIsFallback(res.data.source === "fallback");
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

        {!loading && isFallback && (
          <p className={styles.fallbackNote}>
            High demand right now — showing basic resume improvement tips.
          </p>
        )}

        {error && <p className={styles.error}>{error}</p>}

        {!loading && !error && suggestions.length === 0 && (
          <p>No improvement suggestions generated.</p>
        )}

        {!loading && !error && suggestions.length > 0 && (
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