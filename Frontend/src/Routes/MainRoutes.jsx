import { Routes, Route } from "react-router-dom"
import { lazy, Suspense } from "react"

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

const MainRoutes = () => {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user" element={<User />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/JD" element={<JD />} />
        <Route path="/JD/interview" element={<Interview />} />
        <Route path="/JD/improvement" element={<Improvement />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Err404 />} />
      </Routes>
    </Suspense>
  )
}

export default MainRoutes