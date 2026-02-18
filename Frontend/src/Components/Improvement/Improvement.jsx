import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Improvement.module.css';

export default function Improvement() {
  const navigate = useNavigate();

  const areasToImprove = [
    'Add quantified achievements (metrics, % improvement, revenue impact).',
    'Remove generic phrases; use impact-oriented verbs.',
    'Prioritize most relevant projects and shorten older roles.',
    'List technical stack per project in a concise format.'
  ];

  const recommendations = [
    'Start bullets with action verbs and include one measurable outcome.',
    'Use consistent date and heading formats for readability.',
    'Condense similar bullets and group related technologies.',
    'Add a 2–3 line summary highlighting target role & strengths.'
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)} aria-label="Back">
          ← Back
        </button>
        <h1 className={styles.title}>Resume Improvement</h1>
      </header>

      <main className={styles.container}>
        <section className={styles.columns}>
          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>Areas to Improve</h2>
            <div className={styles.list}>
              {areasToImprove.map((item, i) => (
                <div key={i} className={styles.card}>
                  <div className={styles.dot} aria-hidden>•</div>
                  <p className={styles.cardText}>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>Recommendations</h2>
            <div className={styles.list}>
              {recommendations.map((item, i) => (
                <div key={i} className={styles.card}>
                  <div className={styles.step}>R{i + 1}</div>
                  <p className={styles.cardText}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}