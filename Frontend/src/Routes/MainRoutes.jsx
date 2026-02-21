// src/Routes/MainRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom"
import { lazy, Suspense, useEffect, useState } from "react"
import api from "../Api/Axioscon"
import Skeleton from "../Components/Loader/Skeleton"

/* lazy imports */
const Home = lazy(() => import("../pages/Home/Home"))
const Login = lazy(() => import("../Pages/Login/Login"))
const Register = lazy(() => import("../Pages/Register/Register"))
const User = lazy(() => import("../pages/UserDash/UserDash"))
const Resume = lazy(() => import("../pages/Resume/Resume"))
const Dashboard = lazy(() => import("../Pages/Dashboard/Dashboard"))
const JD = lazy(() => import("../Pages/JD/JD"))
const Interview = lazy(() => import("../Components/Interview/Interview"))
const Improvement = lazy(() => import("../Components/Improvement/Improvement"))
const Profile = lazy(() => import("../Pages/Profile/Profile"))
const Err404 = lazy(() => import("../Pages/Error/Err404"))

/* 🔐 Protected Route */
const ProtectedRoute = ({ children }) => {
  const [checking, setChecking] = useState(true)
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/dashboard")
        setAllowed(true)
      } catch {
        setAllowed(false)
      } finally {
        setChecking(false)
      }
    }

    checkAuth()
  }, [])

  if (checking) return <Skeleton />

  return allowed ? children : <Navigate to="/login" replace />
}

const MainRoutes = () => {
  return (
    <Suspense fallback={<Skeleton />}>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PROTECTED */}
        <Route path="/user" element={<ProtectedRoute><User /></ProtectedRoute>} />
        <Route path="/resume" element={<ProtectedRoute><Resume /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/JD" element={<ProtectedRoute><JD /></ProtectedRoute>} />
        <Route path="/JD/interview/:resumeId" element={<ProtectedRoute><Interview /></ProtectedRoute>} />
        <Route path="/JD/improvement/:resumeId" element={<ProtectedRoute><Improvement /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        <Route path="*" element={<Err404 />} />
      </Routes>
    </Suspense>
  )
}

export default MainRoutes