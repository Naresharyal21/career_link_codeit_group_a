import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { logout } from './api';

function App() {
  useEffect(() => {
    const handleTabClose = () => {
      const refreshToken = sessionStorage.getItem('refresh_token');
      if (refreshToken) {
        // We use sendBeacon for logout on close as it's more reliable during page unload
        // However, axios might not work well in beforeunload, so we try our best
        // or just clear the storage.
        logout(refreshToken).catch(() => {}); 
      }
      sessionStorage.clear();
    };

    window.addEventListener('beforeunload', handleTabClose);
    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
