import React from 'react'

import Navbar from './Navbar'
import Sidebar from './Sidebar'

import { Outlet } from 'react-router'

const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-20 shrink-0 bg-gray-50 shadow-lg shadow-black/12 rounded">
        <Navbar />
      </div>

      <div className="flex flex-1">
        <div className="w-60 shrink-0 bg-gray-50">
          <Sidebar />
        </div>

        <div className="content flex-1 p-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout