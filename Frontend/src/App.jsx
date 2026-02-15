import NavBar from './Components/NavBar/NavBar.jsx';
import Mainroutes from './Routes/MainRoutes.jsx';
import Footer from './Components/Footer/Footer.jsx';
import Style from './App.module.css';

function App() {

  return (
    <div className={Style.app}>
      <NavBar/>
      <Mainroutes/>
      <Footer/>
    </div>
  )
}

export default App
