import React from 'react'


import { Route, Routes } from 'react-router'


import Home from '../pages/Home'


import Login from '../pages/accounts/Login'
import Signup from '../pages/accounts/Signup'



import DashboardLayout from '../layout/DashboardLayout'


import JobDetailPage from '../pages/jobs/JobDetailPage'
import BrowseJobsPage from '../pages/jobs/BrowseJobsPage'





const AppRoutes = () => {
  return (
    <Routes>

      {/* public pages */}
      <Route path="login/" element={<Login />} />
      <Route path="signup/" element={<Signup />} />



      {/* DashboardLayout */}

      <Route element={<DashboardLayout />}>
        <Route index element={<Home />} />

        {/* accounts route */}


        {/* accounts route ends  */}


        {/* Jobs routes */}
        <Route path="jobs" element={<BrowseJobsPage />} />
        <Route path="jobs/:id" element={<JobDetailPage />} />


        {/* Jobs routes ends  */}
      </Route>





    </Routes>
  )
}

export default AppRoutes
