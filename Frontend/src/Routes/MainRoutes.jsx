import { Route, Routes } from 'react-router-dom'
import Home from '../pages/Home/Home'
import Login from '../Pages/Login/Login'
import Register from '../Pages/Register/Register'
import User from '../pages/UserDash/UserDash'
import Resume from '../pages/Resume/Resume'
import Dashboard from '../pages/Dashboard/Dashboard'
import JD from '../Pages/JD/JD'
import Interview from '../Components/Interview/Interview'
import Improvement from '../Components/Improvement/Improvement'

const MainRoutes = () => {
  return (
    <div>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/user" element={<User/>}/>
            <Route path="/resume" element={<Resume/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/JD" element={<JD/>}/>
            <Route path="/JD/interview" element={<Interview/>}/>
            <Route path="/JD/improvement" element={<Improvement/>}/>
        </Routes>
    </div>
  )
}

export default MainRoutes