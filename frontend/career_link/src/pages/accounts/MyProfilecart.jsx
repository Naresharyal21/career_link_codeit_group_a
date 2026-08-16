import React from 'react'

import { useNavigate } from 'react-router'

const MyProfilecart = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    navigate("/login")
  }

  return (
    <div className="bg-gray-100 shadow-lg shadow-black-800/50 mt-7 pb-4  w-65 -ml-45 position absolute rounded-b-2xl  h-fit">
      <ul>
        <li>

        </li>
        <li>a</li>
        <li>a</li>
        <li>a</li>
        <li>a</li>
        <li>a</li>
        <li>a</li>
        <li>a</li>
        <li>a</li>
        <li>a</li>
        <hr className='m-2'></hr>
        <li> <button onClick={handleLogout} className=" w-full  p-2  hover:text-purple hover:bg-gray-300 cursor-pointer">Logout</button></li>
      </ul>
    </div>
  )
}

export default MyProfilecart
