import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import styles from "./interview.module.css";
import api from "../../Api/Axioscon";

export default function Interview() {
  const navigate = useNavigate();
  const { resumeId } = useParams();
  const location = useLocation();
  const { jdText } = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!jdText) {
      navigate("/JD", { replace: true });
      return;
    }

    const fetchQuestions = async () => {
      try {
        const res = await api.post("/resume/interview-questions", {
          resumeId,
          jdText,
        });

        setQuestions(
          Array.isArray(res.data.questions)
            ? res.data.questions
            : []
        );
      } catch (err) {
        if (err.response?.status === 429) {
          setError("AI limit reached. Try again later.");
        } else {
          setError("Failed to generate interview questions");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
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
        <h1 className={styles.title}>Interview Questions</h1>
      </header>

      <main className={styles.container}>
        {loading && <p>Generating questions...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {!loading && !error && (
          <section className={styles.list}>
            {questions.map((q, idx) => (
              <article key={idx} className={styles.card}>
                <span className={styles.qNumber}>Q{idx + 1}</span>
                <p className={styles.questionText}>{q}</p>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}