// ...existing code...
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './interview.module.css';

export default function Interview() {
  const navigate = useNavigate();

  const questions = [
    'Tell me about a challenging technical problem you solved and how you approached it.',
    'Explain a project where you had to work closely with cross-functional teams.',
    'How do you design scalable systems? Describe key considerations.',
    'Describe a time you made a mistake in production — what happened and what did you learn?',
    'What is your process for debugging complex issues in a large codebase?',
    'Explain the differences between synchronous and asynchronous programming and when to use each.',
    'How do you ensure code quality and maintainability in a growing project?',
    'Describe how you optimize an API for both performance and security.'
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)} aria-label="Back">
          ← Back
        </button>
        <h1 className={styles.title}>Interview Questions</h1>
      </header>

      <main className={styles.container}>
        <section className={styles.list}>
          {questions.map((q, idx) => (
            <article key={idx} className={styles.card}>
              <div className={styles.meta}>
                <span className={styles.qNumber}>Q{idx + 1}</span>
              </div>
              <p className={styles.questionText}>{q}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}