import React from 'react'


import { Route, Routes } from 'react-router-dom'


import Home from '../pages/Home'


import Login from '../pages/accounts/Login'
import Signup from '../pages/accounts/Signup'



import DashboardLayout from '../layout/DashboardLayout'


import JobDetailPage from '../pages/jobs/JobDetailPage'
import BrowseJobsPage from '../pages/jobs/BrowseJobsPage'

import MyProfilecart from '../pages/accounts/MyProfilecart'
import ThemeContext from '../context/ThemeContext'
import ProtectedRoute from '../context/ProtectedRoute'
import ForgetPasswordPage from '../pages/accounts/ForgetPasswordPage'
import VerifyOTPpage from '../pages/accounts/VerifyOTPpage'
import ResetPasswordPage from '../pages/accounts/ResetPasswordPage'






const AppRoutes = () => {
  return (
    <ThemeContext>


      <Routes>

        {/* public pages */}
        <Route path="login/" element={<Login />} />
        <Route path="signup/" element={<Signup />} />
        <Route path="forgetpassword/" element={<ForgetPasswordPage />} />
        <Route path="resetpassword/" element={<ResetPasswordPage/>} />
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

        </Route>





      </Routes>
    </ThemeContext>)
}

export default AppRoutes
