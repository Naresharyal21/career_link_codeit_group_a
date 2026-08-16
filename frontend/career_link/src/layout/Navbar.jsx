import React, { use, useEffect, useRef, useState } from 'react'

import { useNavigate } from "react-router";

import logo from "../assets/logo.png";
import MyProfilecart from '../pages/accounts/MyProfilecart';
import { useTheme } from '../context/ThemeContext';



const Navbar = () => {

  const { theme, toggleModes } = useTheme();

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navigate = useNavigate();

  const profileRef = useRef(null);

  useEffect(() => {

    const handleoutsideClick = (event) => {
      if (
        profileRef.current && !profileRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleoutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleoutsideClick)
    };

  }, []);
  return (
    <div className="flex h-20  justify-between items-center ">


      <div className="position relative ">
        <img
          src={logo}
          alt="Logo"
          className="w-50 -ml-9 h-20"
        />

      </div>



      <div className="flex  gap-2 justify-between  w-70 pr-[3%]">

        <button onClick={toggleModes} className="hover:cursor-pointer" >  {theme === "light" ? "Dark Mode" : "Light Mode"}</button>

        <div ref={profileRef} className="">



          <button className="hover:cursor-pointer" onClick={() => setShowProfileMenu(!showProfileMenu)}> My profile</button>
          {showProfileMenu && <MyProfilecart />}
        </div>
      </div>
    </div>
  )
}

export default Navbar
