import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';



import AppRoutes from './Routes'
import { BrowserRouter } from 'react-router'
import AppRoutes from './routes/Routes';
import { ToastContainer } from "react-toastify";
import AuthContext from './context/AuthContext';






createRoot(document.getElementById('root')).render(
  <StrictMode>

    <BrowserRouter>

      <AuthContext>

        <AppRoutes />

      </AuthContext>

      <ToastContainer
        position='top-right'
        autoClose={3000}
        closeOnClick
        pauseOnHover />

    </BrowserRouter>

  </StrictMode>,
)
