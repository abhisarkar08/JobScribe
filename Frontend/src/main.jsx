import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import JobContextProvider from './Context/JobContext.jsx'
import './styles/skeleton.css'

createRoot(document.getElementById('root')).render(
  <JobContextProvider>
    <BrowserRouter>
      <App />
      <ToastContainer/>    
    </BrowserRouter>
  </JobContextProvider>
)
