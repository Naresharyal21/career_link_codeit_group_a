import React, { use, useContext, useEffect, useRef, useState } from 'react'




import { IoIosNotificationsOutline } from "react-icons/io";

import { CiLight, CiDark } from "react-icons/ci";
import { FiChevronDown } from "react-icons/fi";

import logo from "../assets/logo.png";
import MyProfilecart from '../pages/accounts/MyProfilecart';
import { useTheme } from '../context/ThemeContext';
import accountsApi from '../apis/accountsApi';
import { AuthenticationContext } from '../context/AuthContext';
// import { data } from 'react-router';


import { useTheme } from "../context/ThemeContext";
import accountsApi from "../apis/accountsApi";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const { theme, toggleModes } = useTheme();

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const { user, setUser } = useContext(AuthenticationContext);



  const MEDIA_BASE_URL = import.meta.env.VITE_MEDIA_BASE_URL;
  const profileRef = useRef(null);

  useEffect(() => {

    const fetchuser = async () => {
      

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await accountsApi.getMe();



        setUser(data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);


  const initials = user?.username
    ?.split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase();



  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );


    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  return (
    <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">


      <div className="flex h-full items-center">
        <img
          src={logo}
          alt="CareerLink"
          className="h-16 w-auto object-contain"
        />
      </div>
      <div className=" font-mono text-green-700">


        {user?.role_display.toUpperCase()} PORTAL
      </div>






      <div className="flex  gap-2 justify-between items-center w-70 pr-[3%]">

        <button onClick={toggleModes} className="  p-1 rounded-xl ml-20 hover:cursor-pointer hover:bg-purple-100  " >  {theme === "light" ? <CiDark className="text-2xl" />
          : <CiLight className="text-2xl text-black" />}</button>
        <div className="">
          <button className="text-2xl text-black mt-1"><IoIosNotificationsOutline />
          </button>
        </div>

        <div ref={profileRef} className=" flex gap-2">


          <div className="h-14 w-14 p-1 rounded flex  justify-center hover:bg-purple-900 ">

       

            <button
              className="relative group flex rounded-full h-12 w-13 text-white justify-center items-center bg-gray-600 hover:cursor-pointer"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              {user?.role === "js" && user?.profile?.profile_pictur ? (
                <img
                  src={`${MEDIA_BASE_URL}${user.profile.profile_pictur}`}
                  alt="profile"
                  className="w-full h-full rounded-full object-cover "
                />
                
              ) : user?.role === "ep" && user?.profile?.logo ? (
                <img
                  src={`${MEDIA_BASE_URL}${user.profile.logo}`}
                  alt="company logo"
                  className="w-full h-full rounded-full object-cover bg-white"
                />) : (
                initials
              )}
            </div>



            <div className="hidden text-left sm:block">
              <p className="max-w-[130px] truncate text-sm font-semibold text-[#172337]">
                {user?.username || "User"}
              </p>

              <p className="text-xs text-[#64748B]">
                {user?.role || "Account"}
              </p>
            </div>



            <FiChevronDown
              className={`
                hidden text-[#64748B] transition-transform
                duration-200 sm:block
                ${showProfileMenu ? "rotate-180" : ""}
              `}
            />
          </button>


          {showProfileMenu && (
            <div className="absolute right-0 top-14 z-[100]">
              <MyProfilecart />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;