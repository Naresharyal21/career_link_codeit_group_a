

import { Route, Routes } from 'react-router'


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
import EmailConformPasswordPage from '../pages/accounts/EmailConformPasswordPage'
import EmailChangePage from '../pages/accounts/EmailChangePage'






const AppRoutes = () => {
  return (
    <ThemeContext>


      <Routes>

       
        <Route path="login/" element={<Login />} />
        <Route path="signup/" element={<Signup />} />



     

        <Route element={<DashboardLayout />}>
          <Route index element={<Home />} />

          

            <Route path="Profile/" element={<MyProfilecart />} />
          

            
            {/* /* accounts route ends  */}


      

          <Route path="jobs" element={<BrowseJobsPage />} />
          <Route path="jobs/:id" element={<JobDetailPage />} />


            {/* Jobs routes ends  */}
          </Route>

<Route>

   <Route path="pr/verifyotp/:purpose" element={<VerifyOTPpage />} />
</Route>
  <Route path = "conformpassword" element={<EmailConformPasswordPage/>}/>
  <Route path = "get/new/email" element={<EmailChangePage/>}/>

        </Route>





      </Routes>
    </ThemeContext>)
}

export default Routes;