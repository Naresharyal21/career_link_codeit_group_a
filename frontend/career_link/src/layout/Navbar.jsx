import React, { use, useContext, useEffect, useRef, useState } from 'react'




import { IoIosNotificationsOutline } from "react-icons/io";

import { CiLight, CiDark } from "react-icons/ci";

import logo from "../assets/logo.png";
import MyProfilecart from '../pages/accounts/MyProfilecart';
import { useTheme } from '../context/ThemeContext';
import accountsApi from '../apis/accountsApi';
import { AuthenticationContext } from '../context/AuthContext';



const Navbar = () => {


  const { theme, toggleModes } = useTheme();

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const { user, setUser } = useContext(AuthenticationContext);



  const MEDIA_BASE_URL = import.meta.env.VITE_MEDIA_BASE_URL;
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
              {user?.profile?.profile_pictur ? (
                <img
                  src={`${MEDIA_BASE_URL}${user.profile.profile_pictur}`}
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
