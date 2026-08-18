import React from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'

const DashboardLayout = () => {
  return (
    <div className="wrapper h-screen flex flex-col bg-white dark:bg-gray-600 overflow-hidden">
      
      
      <div className="w-full bg-gray-70 dark:bg-gray-400 dark:text-white shadow-lg shadow-black/12 z-50">
        <Navbar />
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar */}
        <div className="w-60 bg-gray-50 dark:bg-gray-800 dark:text-white ">
          <Sidebar />
        </div>

     
        <div className="content flex-1  p-6 overflow-y-auto z-0">
          <Outlet />
        </div>

      </div>
    </div>
  )
}

export default DashboardLayout