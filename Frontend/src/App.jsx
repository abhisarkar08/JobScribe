import { useLocation } from "react-router-dom";
import NavBar from "./Components/NavBar/NavBar.jsx";
import MainRoutes from "./Routes/MainRoutes.jsx";
import Footer from "./Components/Footer/Footer.jsx";
import PageWrapper from "./Components/Loader/PageWrapper";
import Style from "./App.module.css";

function App() {
  const location = useLocation();

  const hideLayout =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <PageWrapper>
      <div className={Style.app}>
        {!hideLayout && <NavBar />}
        <MainRoutes />
        {!hideLayout && <Footer />}
      </div>
    </PageWrapper>
  );
}

export default App;
