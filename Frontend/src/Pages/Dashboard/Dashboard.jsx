import React from "react";
import styles from "./Dashboard.module.css";
import {
  FileText,
  BadgeCheck,
  Target,
  Trophy,
} from "lucide-react";
import { Icon } from "@iconify/react";
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

const resumeData = [
  { name: "Deepak_Developer.pdf", score: 92, match: "79%" },
  { name: "Project_Manager.pdf", score: 88, match: "82%" },
  { name: "Sales_Resume.docx", score: 80, match: "65%" },
  { name: "Marketing_Profile.pdf", score: 69, match: "77%" },
];

const readinessData = [{ value: 75 }];

/* ---------------- HELPERS ---------------- */

const colorByValue = (v) =>
  v < 50 ? "#ef4444" : v < 70 ? "#facc15" : "#22c55e";

const getFileIcon = (filename) => {
  const ext = filename.split(".").pop()?.toLowerCase();

  if (ext === "pdf") {
    return <FileText size={26} color="#ef4444" />; // red = PDF
  }

  if (ext === "doc" || ext === "docx") {
    return <FileText size={26} color="#2563eb" />; // blue = DOCX
  }

  return <FileText size={26} color="#64748b" />; // fallback
};

/* ---------------- COMPONENT ---------------- */

const Dashboard = () => {
  return (
    <div className={styles.page}>
      {/* STATS */}
      <section className={styles.stats}>
        <StatCard icon={<FileText />} label="Total Resumes" value="3" />
        <StatCard icon={<BadgeCheck />} label="Avg Resume Score" value="85%" />
        <StatCard icon={<Target />} label="Avg Match %" value="68%" />
        <StatCard icon={<Trophy />} label="Best Match" value="82%" />
      </section>

      {/* GRID */}
      <section className={styles.grid}>
        {/* TREND */}
        <div className={`${styles.card} ${styles.chartCard}`}>
          <h3>Match Trend Over Time</h3>
          <div className={styles.chart}>
            <ResponsiveContainer>
              <LineChart data={trendData}>
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line
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
                <span
                  style={{
                    width: `${s.value}%`,
                    background: colorByValue(s.value),
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* READINESS */}
        <div className={styles.card}>
          <h3>Interview Readiness</h3>

          <div className={styles.radialWrap}>
            <ResponsiveContainer width="100%" height={200}>
              <RadialBarChart
                innerRadius="72%"
                outerRadius="90%"
                data={[{ value: 75 }]}
                startAngle={180}
                endAngle={0}
              >
                <RadialBar
                  dataKey="value"
                  cornerRadius={30}
                  fill="#22c55e"
                />
              </RadialBarChart>
            </ResponsiveContainer>

            <div className={styles.radialText}>
              <b>75%</b>
              <span>Interview Ready</span>
            </div>
          </div>

          {/* SUPPORTING INFO */}
          <div className={styles.readinessMeta}>
            <div>
              <p>Skill Coverage</p>
              <b>78%</b>
            </div>
            <div>
              <p>JD Match</p>
              <b>72%</b>
            </div>
            <div>
              <p>Consistency</p>
              <b>80%</b>
            </div>
          </div>

          <p className={styles.readinessHint}>
            You're close to being interview-ready. Improve weak skills to cross 85%.
          </p>
        </div>
        {/* RESUMES */}
        <div className={styles.card}>
          <h3>Your Resumes</h3>
          <div className={styles.resumeGrid}>
            {resumeData.map((r) => (
              <div key={r.name} className={styles.resumeCard}>
                <div className={styles.resumeIcon}>
                  {getFileIcon(r.name)}
                </div>

                <div className={styles.resumeInfo}>
                  <b>{r.name}</b>
                  <p>Score: {r.score}</p>
                  <p>Best Match: {r.match}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* HEATMAP */}
        <div className={styles.card}>
          <h3>Skill Heatmap</h3>
          <div className={styles.heatmap}>
            {heatmapData.map((h) => (
              <div
                key={h.skill}
                className={styles.heatCell}
                style={{ background: colorByValue(h.value) }}
              >
                <span>{h.skill}</span>
                <b>{h.value}%</b>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT */}
        <div className={styles.card}>
          <h3>Recent Matches</h3>
          <ul className={styles.matches}>
            <li>Node.js Developer <b>79%</b></li>
            <li>E-commerce PM <b>82%</b></li>
            <li>Sales Executive <b>65%</b></li>
          </ul>
        </div>
      </section>
    </div>
  );
};

/* ---------------- SMALL COMPONENT ---------------- */

const StatCard = ({ icon, label, value }) => (
  <div className={styles.statCard}>
    <div className={styles.statIcon}>{icon}</div>
    <div>
      <p>{label}</p>
      <h2>{value}</h2>
    </div>
  </div>
);

export default Dashboard;
