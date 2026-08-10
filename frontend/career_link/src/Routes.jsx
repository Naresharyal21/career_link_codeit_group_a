import React from 'react'
import { Route, Routes } from 'react-router'
import DashboardLayout from './layout/DashboardLayout'
import Home from './pages/Home'

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<Home />} />



      </Route>





    </Routes>
  )
}

export default AppRoutes
