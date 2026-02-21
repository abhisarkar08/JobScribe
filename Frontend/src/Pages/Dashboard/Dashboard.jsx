import React, { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import {
  FileText,
  BadgeCheck,
  Target,
  Trophy,
  Trash2,
} from "lucide-react";
import api from "../../Api/Axioscon";
import { toast } from "react-toastify";
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
import { motion, AnimatePresence } from "framer-motion";

/* ---------------- HELPERS ---------------- */

const colorByValue = (v) =>
  v < 50 ? "#ef4444" : v < 70 ? "#facc15" : "#22c55e";

const getFileIcon = (filename) => {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return <FileText size={26} color="#ef4444" />;
  if (ext === "doc" || ext === "docx")
    return <FileText size={26} color="#2563eb" />;
  return <FileText size={26} color="#64748b" />;
};

/* ---------------- ANIMATIONS ---------------- */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const scaleFade = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

/* ---------------- COMPONENT ---------------- */

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalResumes: 0,
    avgResumeScore: 0,
    avgMatchPercentage: 0,
    bestMatch: 0,
  });

  const [trendData, setTrendData] = useState([]);
  const [weakestSkills, setWeakestSkills] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [resumeData, setResumeData] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [readiness, setReadiness] = useState(0);

  const [confirmDelete, setConfirmDelete] = useState({
    show: false,
    id: null,
  });

  /* ---------- FETCH DASHBOARD ---------- */
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/dashboard");
        const d = res.data;

        setStats({
          totalResumes: d.totalResumes,
          avgResumeScore: d.avgResumeScore,
          avgMatchPercentage: d.avgMatchPercentage,
          bestMatch: d.bestMatch,
        });

        setTrendData(d.trend || []);
        setWeakestSkills(d.weakestSkills || []);
        setHeatmapData(d.skillHeatmap || []);
        setResumeData(d.resumes || []);
        setRecentMatches(d.recentMatches || []);
        setReadiness(d.interviewReadiness || 0);
      } catch {
        toast.error("Dashboard load failed");
      }
    };

    fetchDashboard();
  }, []);

  /* ---------- CONFIRMED DELETE ---------- */
  const confirmDeleteResume = async () => {
    const id = confirmDelete.id;
    if (!id) return;

    try {
      await api.delete(`/resume/${id}`);

      setResumeData((prev) => prev.filter((r) => r.id !== id));
      setStats((prev) => ({
        ...prev,
        totalResumes: Math.max(0, prev.totalResumes - 1),
      }));

      toast.success("Resume deleted successfully");
    } catch {
      toast.error("Resume delete failed");
    } finally {
      setConfirmDelete({ show: false, id: null });
    }
  };

  return (
    <>
      <div className={styles.page}>
        {/* ================= STATS ================= */}
        <motion.section
          className={styles.stats}
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <StatCard icon={<FileText />} label="Total Resumes" value={stats.totalResumes} />
          <StatCard icon={<BadgeCheck />} label="Avg Resume Score" value={`${stats.avgResumeScore}%`} />
          <StatCard icon={<Target />} label="Avg Match %" value={`${stats.avgMatchPercentage}%`} />
          <StatCard icon={<Trophy />} label="Best Match" value={`${stats.bestMatch}%`} />
        </motion.section>

        {/* ================= GRID ================= */}
        <motion.section
          className={styles.grid}
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {/* TREND */}
          <motion.div className={`${styles.card} ${styles.chartCard}`} variants={fadeUp} whileHover={{ y: -4 }}>
            <h3>Match Trend Over Time</h3>
            <div className={styles.chart}>
              <ResponsiveContainer>
                <LineChart data={trendData}>
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line dataKey="score" stroke="#2563eb" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* WEAKEST SKILLS */}
          <motion.div className={styles.card} variants={fadeUp} whileHover={{ y: -4 }}>
            <h3>Weakest Skills</h3>
            {weakestSkills.map((s) => (
              <motion.div
                key={s.name}
                className={styles.skillRow}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <span>{s.name}</span>
                <div className={styles.bar}>
                  <span style={{ width: `${s.value}%`, background: colorByValue(s.value) }} />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* INTERVIEW READINESS */}
          <motion.div className={styles.card} variants={fadeUp} whileHover={{ y: -4 }}>
            <h3>Interview Readiness</h3>
            <div className={styles.radialWrap}>
              <ResponsiveContainer width="100%" height={160}>
                <RadialBarChart
                  innerRadius="72%"
                  outerRadius="90%"
                  data={[{ value: readiness }]}
                  startAngle={180}
                  endAngle={0}
                >
                  <RadialBar dataKey="value" fill={colorByValue(readiness)} />
                </RadialBarChart>
              </ResponsiveContainer>
              <motion.div
                className={styles.radialText}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <b>{readiness}%</b>
                <span>Interview Ready</span>
              </motion.div>
            </div>
          </motion.div>

          {/* RESUMES */}
          <motion.div className={styles.card} variants={fadeUp}>
            <h3>Your Resumes</h3>
            <div className={styles.resumeGrid}>
              {resumeData.map((r) => (
                <motion.div
                  key={r.id}
                  className={styles.resumeCard}
                  whileHover={{ y: -6 }}
                >
                  <div className={styles.resumeIcon}>{getFileIcon(r.name)}</div>

                  <div className={styles.resumeInfo}>
                    <b>{r.name}</b>
                    <p>Score: {r.score}</p>
                    <p>Best Match: {r.match}</p>
                  </div>

                  <button
                    className={styles.deleteBtn}
                    onClick={() => setConfirmDelete({ show: true, id: r.id })}
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* HEATMAP */}
          <motion.div className={styles.card} variants={fadeUp}>
            <h3>Skill Heatmap</h3>
            <div className={styles.heatmap}>
              {heatmapData.map((h) => (
                <motion.div
                  key={h.skill}
                  className={styles.heatCell}
                  style={{ background: colorByValue(h.value) }}
                  whileHover={{ scale: 1.05 }}
                >
                  <span>{h.skill}</span>
                  <b>{h.value}%</b>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RECENT MATCHES */}
          <motion.div className={styles.card} variants={fadeUp}>
            <h3>Recent Matches</h3>
            <ul className={styles.matches}>
              {recentMatches.map((m, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  {m.jobTitle} <b>{m.matchScore}%</b>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.section>
      </div>

      {/* 🔔 CONFIRM DELETE POPUP */}
      <AnimatePresence>
        {confirmDelete.show && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.confirmBox}
              variants={scaleFade}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <h3>Delete Resume</h3>
              <p>Are you sure you want to delete this resume?</p>

              <div className={styles.actions}>
                <button onClick={() => setConfirmDelete({ show: false, id: null })}>
                  Cancel
                </button>
                <button className={styles.dangerBtn} onClick={confirmDeleteResume}>
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

/* ---------------- STAT CARD ---------------- */

const StatCard = ({ icon, label, value }) => (
  <motion.div className={styles.statCard} variants={fadeUp} whileHover={{ y: -6 }}>
    <div className={styles.statIcon}>{icon}</div>
    <div>
      <p>{label}</p>
      <h2>{value}</h2>
    </div>
  </motion.div>
);

export default Dashboard;