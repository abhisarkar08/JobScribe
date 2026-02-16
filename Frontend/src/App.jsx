import { useLocation } from 'react-router-dom'
import NavBar from './Components/NavBar/NavBar.jsx'
import Mainroutes from './Routes/MainRoutes.jsx'
import Footer from './Components/Footer/Footer.jsx'
import Style from './App.module.css'

function App() {
  const location = useLocation()

  const hideLayout =
    location.pathname === '/login' ||
    location.pathname === '/register'

  return (
    <div className={Style.app}>
      {!hideLayout && <NavBar />}

      <Mainroutes />

      {!hideLayout && <Footer />}
    </div>
  )
}

export default App
