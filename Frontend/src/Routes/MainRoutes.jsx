import { Route, Routes } from 'react-router-dom'
import Home from '../pages/Home/Home'
import Login from '../pages/Login/Login'
import Register from '../pages/Register/Register'
import User from '../pages/UserDash/UserDash'
import Resume from '../pages/Resume/Resume'
import Dashboard from '../pages/Dashboard/Dashboard'
import JD from '../pages/JD/JD'

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
        </Routes>
    </div>
  )
}

export default MainRoutes