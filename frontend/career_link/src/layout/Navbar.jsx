import React, { use, useEffect, useRef, useState } from 'react'

import { useNavigate } from "react-router";

import { IoIosNotificationsOutline } from "react-icons/io";
import { MdDarkMode } from "react-icons/md";
import { MdOutlineLightMode, MdOutlineNightlight } from "react-icons/md";
import { CiLight, CiDark } from "react-icons/ci";

import logo from "../assets/logo.png";
import MyProfilecart from '../pages/accounts/MyProfilecart';
import { useTheme } from '../context/ThemeContext';
import accountsApi from '../apis/accountsApi';



const Navbar = () => {

  const [user, setUser] = useState(null);

  const { theme, toggleModes } = useTheme();

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navigate = useNavigate();

  const profileRef = useRef(null);

  useEffect(() => {

    const fetchuser = async () => {

      try {
        const data = await accountsApi.getMe();
        console.log(data)
        setUser(data);
      } catch (err) {
        console.error("error")
      }

    };
    fetchuser();
  }, []);


  const initials = user?.username
    ?.split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase();


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



      <div className="flex  gap-2 justify-between items-center w-70 pr-[3%]">

        <button onClick={toggleModes} className=" pl-20 hover:cursor-pointer " >  {theme === "light" ? <CiDark className="text-2xl" />
          : <CiLight className="text-2xl text-black" />}</button>
        <div className="">
          <button className="text-2xl text-black mt-1"><IoIosNotificationsOutline />
          </button>
        </div>

        <div ref={profileRef} className=" flex gap-2">


          <div className="h-12 w-12 p-1 rounded flex  justify-center hover:bg-purple-900 ">


            <button
              className="relative group flex rounded-full h-10 w-10 text-white justify-center items-center p-2 bg-gray-600 hover:cursor-pointer"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              {user?.profile_pictur ? (
                <img
                  src={user.profile_pictur}
                  alt="profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                initials
              )}

              <span className={`absolute top-full mt-2 whitespace-nowrap bg-gray-800 text-white text-sm px-3 py-1 rounded ${showProfileMenu ? "hidden" : "hidden group-hover:block"
                }`}>
                {user?.username}
              </span>
            </button>

            {showProfileMenu && <MyProfilecart />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar;
