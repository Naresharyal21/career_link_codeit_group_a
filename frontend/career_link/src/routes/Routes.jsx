import React from 'react'


import { Route, Routes } from 'react-router-dom'


import Home from '../pages/Home'


import Login from '../pages/accounts/Login'
import Signup from '../pages/accounts/Signup'



import DashboardLayout from '../layout/DashboardLayout'


import JobDetailPage from '../pages/jobs/JobDetailPage'
import BrowseJobsPage from '../pages/jobs/BrowseJobsPage'

import ThemeContext from '../context/ThemeContext'
import ProtectedRoute from '../context/ProtectedRoute'
import VerifyOTPpage from '../pages/accounts/VerifyOTPpage'
import MyProfilecart from '../pages/accounts/MyProfilecart'
import EmailChangePage from '../pages/accounts/EmailChangePage'
import ResetPasswordPage from '../pages/accounts/ResetPasswordPage'
import ForgetPasswordPage from '../pages/accounts/ForgetPasswordPage'
import EmailConformPasswordPage from '../pages/accounts/EmailConformPasswordPage'
import AdminLogin from '../pages/moderator/AdminLogin'






const AppRoutes = () => {
  return (
    <ThemeContext>


      <Routes>
        {/* admin routes */}
        <Route path="admin/login" element={<AdminLogin/>}/>

        {/* public pages */}
        <Route path="login/" element={<Login />} />
        <Route path="signup/" element={<Signup />} />
        <Route path="forgetpassword/" element={<ForgetPasswordPage />} />
        <Route path="resetpassword/" element={<ResetPasswordPage />} />
        <Route path="verifyotp/:purpose" element={<VerifyOTPpage />} />

        <Route element={<ProtectedRoute />}>


          {/* DashboardLayout */}

          <Route element={<DashboardLayout />}>
            <Route index element={<Home />} />

            {/* accounts route */}

            <Route path="Profile/" element={<MyProfilecart />} />



            {/* /* accounts route ends  */}


            {/* /* Jobs routes */}

            <Route path="jobs" element={<BrowseJobsPage />} />
            <Route path="jobs/:id" element={<JobDetailPage />} />


            {/* Jobs routes ends  */}
          </Route>

          <Route>

            <Route path="pr/verifyotp/:purpose" element={<VerifyOTPpage />} />
          </Route>
          <Route path="conformpassword" element={<EmailConformPasswordPage />} />
          <Route path="get/new/email" element={<EmailChangePage />} />

        </Route>





      </Routes>
    </ThemeContext>)
}

export default AppRoutes
