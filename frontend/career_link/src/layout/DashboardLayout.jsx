import React from 'react'


import Navbar from './Navbar'
import Sidebar from './Sidebar'


import { Outlet } from 'react-router'


const DashboardLayout = () => {
  return (
    <>
      <div className="wrapper flex  flex-col">
        <div className="h-20 bg-gray-50 shadow-lg shadow-black/12 rounded">

          <Navbar />
        </div>
        <div className=" w-60 mt-4 bg-gray-50 flex ">
          <Sidebar />
        </div>


        <div className="content pl-32 absolute mt-20 ml-28">
          <Outlet />
        </div>
      </div>
    </>


  )
}

export default DashboardLayout
