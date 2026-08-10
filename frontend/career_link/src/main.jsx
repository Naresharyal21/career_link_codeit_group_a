import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';




import { BrowserRouter } from 'react-router'
import AppRoutes from './routes/Routes';
import { ToastContainer } from "react-toastify";






createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppRoutes />
      <ToastContainer
        position='top-right'
        autoClose={3000}
        closeOnClick
        pauseOnHover />
    </BrowserRouter>
  </StrictMode>,
)
