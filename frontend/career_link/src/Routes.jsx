import React from 'react'
import { Route, Routes } from 'react-router'
import DashboardLayout from './layout/DashboardLayout'
import Home from './pages/Home'
import BrowseJobsPage from './pages/BrowseJobsPage'
import JobDetailPage from './pages/JobDetailPage'

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<Home />} />
        <Route path="jobs" element={<BrowseJobsPage />} />
        <Route path="jobs/:id" element={<JobDetailPage />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
