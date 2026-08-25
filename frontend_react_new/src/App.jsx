import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import JobDetailPage from './pages/JobDetailPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ApplicationsPage from './pages/ApplicationsPage';
import ManageJobsPage from './pages/ManageJobsPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';
import DashboardLayout from './layout/DashboardLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/job/:id" element={<JobDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="applications" element={<ApplicationsPage />} />
          <Route path="saved-jobs" element={<div className="bg-white p-6 rounded-lg shadow">Saved Jobs Page</div>} />
          <Route path="cv" element={<div className="bg-white p-6 rounded-lg shadow">CV / Resume Page</div>} />
          <Route path="manage-jobs" element={<ManageJobsPage />} />
          <Route path="profile" element={<ProfileSettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
