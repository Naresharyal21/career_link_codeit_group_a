

import { Route, Routes } from 'react-router'


import Home from '../pages/Home'


import Login from '../pages/accounts/Login'
import Signup from '../pages/accounts/Signup'



import DashboardLayout from '../layout/DashboardLayout'


import JobDetailPage from '../pages/jobs/JobDetailPage'
import BrowseJobsPage from '../pages/jobs/BrowseJobsPage'

import MyProfilecart from '../pages/accounts/MyProfilecart'





const AppRoutes = () => {
  return (
    <ThemeContext>


      <Routes>

       
        <Route path="login/" element={<Login />} />
        <Route path="signup/" element={<Signup />} />



     

        <Route element={<DashboardLayout />}>
          <Route index element={<Home />} />

          

          <Route path="Profile/" element={<MyProfilecart />} />
      


      

          <Route path="jobs" element={<BrowseJobsPage />} />
          <Route path="jobs/:id" element={<JobDetailPage />} />


  
        </Route>





      </Routes>
    </ThemeContext>)
}

export default Routes;