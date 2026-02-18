import React from "react";
import styles from "./Dashboard.module.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from "recharts";

/* ---------------- DATA ---------------- */

const trendData = [
  { date: "Apr 1", score: 45 },
  { date: "Apr 10", score: 55 },
  { date: "Apr 15", score: 60 },
  { date: "Apr 19", score: 63 },
  { date: "Apr 21", score: 72 },
];

const weakestSkills = [
  { name: "Docker", value: 80 },
  { name: "AWS", value: 70 },
  { name: "MongoDB", value: 60 },
  { name: "TypeScript", value: 50 },
  { name: "Redis", value: 40 },
];

const heatmapData = [
  { skill: "Node.js", value: 78 },
  { skill: "Express", value: 72 },
  { skill: "MongoDB", value: 68 },
  { skill: "Docker", value: 49 },
  { skill: "AWS", value: 43 },
];

const readinessData = [
  { name: "Readiness", value: 75, fill: "#22c55e" },
];

const getHeatColor = (value) => {
  if (value < 50) return "#ef4444";   // red
  if (value < 70) return "#facc15";   // yellow
  return "#22c55e";                   // green
};

/* ---------------- COMPONENT ---------------- */

const Dashboard = () => {
  return (
    <div className={styles.page}>
      {/* TOP STATS */}
      <section className={styles.stats}>
        <div className={styles.statCard}>
          <p>Total Resumes</p>
          <h2>3</h2>
        </div>
        <div className={styles.statCard}>
          <p>Avg Resume Score</p>
          <h2>85%</h2>
        </div>
        <div className={styles.statCard}>
          <p>Avg Match %</p>
          <h2>68%</h2>
        </div>
        <div className={styles.statCard}>
          <p>Best Match</p>
          <h2>82%</h2>
        </div>
      </section>

      {/* MAIN GRID */}
      <section className={styles.grid}>
        {/* MATCH TREND */}
        <div className={styles.card}>
          <h3>Match Trend Over Time</h3>
          <div className={styles.chart}>
            <ResponsiveContainer>
              <LineChart data={trendData}>
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* WEAKEST SKILLS */}
        <div className={styles.card}>
          <h3>Weakest Skills</h3>
          {weakestSkills.map((s) => (
            <div key={s.name} className={styles.skillRow}>
              <span>{s.name}</span>
              <div className={styles.bar}>
                <span style={{ width: `${s.value}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* INTERVIEW READINESS */}
        <div className={styles.card}>
          <h3>Interview Readiness</h3>

          <div className={styles.radialWrap}>
            <ResponsiveContainer width="100%" height={220}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="70%"
                outerRadius="100%"
                barSize={16}
                data={readinessData}
                startAngle={180}
                endAngle={0}
              >
                <RadialBar dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>

            <div className={styles.radialText}>
              <b>75%</b>
              <span>Ready</span>
            </div>
          </div>
        </div>

        {/* YOUR RESUMES */}
        <div className={styles.card}>
          <h3>Your Resumes</h3>
          <div className={styles.resumeGrid}>
            {[
              ["Deepak_Developer.pdf", "92", "79%"],
              ["Project_Manager.pdf", "88", "82%"],
              ["Sales_Resume.docx", "80", "65%"],
              ["Marketing_Profile.pdf", "69", "77%"],
            ].map(([name, score, match]) => (
              <div key={name} className={styles.resumeCard}>
                <b>{name}</b>
                <p>Score: {score}</p>
                <p>Best Match: {match}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SKILL HEATMAP */}
        <div className={styles.card}>
          <h3>Skill Heatmap</h3>
          <div className={styles.heatmap}>
            {heatmapData.map((item) => (
              <div
                key={item.skill}
                className={styles.heatCell}
                style={{ background: getHeatColor(item.value) }}
              >
                <span>{item.skill}</span>
                <b>{item.value}%</b>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT MATCHES */}
        <div className={styles.card}>
          <h3>Recent Matches</h3>
          <ul className={styles.matches}>
            <li>Node.js Developer — <b>79%</b></li>
            <li>E-commerce PM — <b>82%</b></li>
            <li>Sales Executive — <b>65%</b></li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
