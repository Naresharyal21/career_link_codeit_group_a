import React from 'react'

import logo from "../assets/logo.png";
const Navbar = () => {
  return (
    <div className="flex h-20  justify-between items-center ">


      <div className="">
  <img
    src={logo}
    alt="Logo"
    className="w-50"
  />

      </div>



      <div className="flex  justify-between  w-70 pr-[3%]">
        <button>Logout</button>
        <button>theme toggle</button>
      </div>
    </div>
  )
}

export default Navbar
