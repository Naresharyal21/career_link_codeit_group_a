import React from 'react'
import { Link } from "react-router";

import { MdOutlineDashboard, MdOutlineDataSaverOff } from "react-icons/md";
import { IoBagOutline } from "react-icons/io5";
import { FaRegFilePdf } from "react-icons/fa";
import { MdReport } from "react-icons/md";



const Sidebar = () => {
  return (
    <>
      <div className="wrapper">
   

     
      <ul className='pl-4'>
        <li className="text-black hover:text-white hover:bg-purple-900 transition-colors rounded-md">
          <button className="flex items-center gap-2 pl-4 pr-2 mb-1 h-13 mt-4 w-55">
            <MdOutlineDashboard className="text-xl" />
            <span>Dashboard</span>
          </button>
        </li>
        <li className="text-black hover:text-white hover:bg-purple-900 transition-colors rounded-md">
          <button className="flex items-center gap-2 pl-4 mb-1 h-13 pr-2 w-55">
            <IoBagOutline className="text-xl" />
            <span>Applied Jobs</span>
          </button>
        </li>
        <li className="text-black hover:text-white hover:bg-purple-900 transition-colors rounded-md">
          <button className="flex items-center gap-2 pl-4 pr-2 mb-1 h-13 w-55">
            <MdOutlineDataSaverOff className="text-xl" />
            <span>Saved Jobs</span>
          </button>
        </li>
        <li className="text-black hover:text-white hover:bg-purple-900 transition-colors rounded-md">
          <button className="flex items-center gap-2 pl-4 pr-2 mb-1 h-13 w-55">
            <FaRegFilePdf className="text-xl" />
            <span>Resume/CV</span>
          </button>
        </li>

        <li className="text-black hover:text-white hover:bg-purple-900 transition-colors rounded-md">
          <button
            to="/moderator/reports"
            className="flex items-center gap-2 pl-4 pr-2 mb-1 h-13 w-55"
          >
            <MdReport className="text-xl" />
            <span>Reports</span>
          </button>
        </li>

      </ul>
      <div className="h-45 mt-35 ml-3 pl-4 pt-3 w-55 flex flex-col bg-gray-50 shadow shadow-black/12  rounded  ">
        <span>
        Need Help?<br></br>

        Our Support team is here to assist your career Journey.


        </span>
        <span>
          <button className="mt-7 rounded bg-amber-200  w-45 h-10">Contact Us</button>
        </span>
      </div>
 </div >
    </>
  )
}

export default Sidebar
