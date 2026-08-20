import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import { IoIosNotificationsOutline } from "react-icons/io";
import { CiLight, CiDark } from "react-icons/ci";
import { FiChevronDown } from "react-icons/fi";

import logo from "../assets/logo.png";
import MyProfilecart from "../pages/accounts/MyProfilecart";

import { useTheme } from "../context/ThemeContext";
import accountsApi from "../apis/accountsApi";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const { theme, toggleModes } = useTheme();

  const profileRef = useRef(null);

  /* ================= FETCH CURRENT USER ================= */

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await accountsApi.getMe();

        console.log("Current user:", data);

        setUser(data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  /* ================= USER INITIALS ================= */

  const initials =
    user?.username
      ?.split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  /* ================= CLOSE PROFILE MENU ================= */

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

      {/* =====================================================
          LOGO
      ===================================================== */}

      <div className="flex h-full items-center">
        <img
          src={logo}
          alt="CareerLink"
          className="h-16 w-auto object-contain"
        />
      </div>

      {/* =====================================================
          RIGHT SIDE
      ===================================================== */}

      <div className="flex items-center gap-2 sm:gap-4">

        {/* ================= THEME BUTTON ================= */}

        <button
          type="button"
          onClick={toggleModes}
          aria-label="Toggle theme"
          className="
            flex h-10 w-10 items-center justify-center
            rounded-xl
            text-[#64748B]
            transition-all duration-200
            hover:bg-[#F0ECFF]
            hover:text-[#6C4DFF]
            focus:outline-none
            focus:ring-4
            focus:ring-violet-500/10
          "
        >
          {theme === "light" ? (
            <CiDark className="text-[24px]" />
          ) : (
            <CiLight className="text-[24px]" />
          )}
        </button>

        {/* ================= NOTIFICATIONS ================= */}

        <button
          type="button"
          aria-label="Notifications"
          className="
            relative
            flex h-10 w-10 items-center justify-center
            rounded-xl
            text-[#64748B]
            transition-all duration-200
            hover:bg-[#F0ECFF]
            hover:text-[#6C4DFF]
            focus:outline-none
            focus:ring-4
            focus:ring-violet-500/10
          "
        >
          <IoIosNotificationsOutline className="text-[25px]" />

          {/* Notification indicator */}
          <span className="
            absolute right-[8px] top-[7px]
            h-2 w-2
            rounded-full
            bg-[#6C4DFF]
            ring-2 ring-white
          " />
        </button>

        {/* ================= PROFILE ================= */}

        <div
          ref={profileRef}
          className="relative ml-1"
        >
          <button
            type="button"
            onClick={() =>
              setShowProfileMenu((prev) => !prev)
            }
            className="
              flex items-center gap-2
              rounded-full
              p-1
              transition-all duration-200
              hover:bg-[#F0ECFF]
              focus:outline-none
              focus:ring-4
              focus:ring-violet-500/10
            "
          >

            {/* Avatar */}

            <div
              className="
                flex h-10 w-10
                items-center justify-center
                overflow-hidden
                rounded-full
                bg-[#64748B]
                text-sm font-semibold
                text-white
                transition-all duration-200
                hover:bg-[#6C4DFF]
              "
            >
              {user?.profile_pictur ? (
                <img
                  src={user.profile_pictur}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>

            {/* User information */}

            <div className="hidden text-left sm:block">
              <p className="max-w-[130px] truncate text-sm font-semibold text-[#172337]">
                {user?.username || "User"}
              </p>

              <p className="text-xs text-[#64748B]">
                {user?.role || "Account"}
              </p>
            </div>

            {/* Chevron */}

            <FiChevronDown
              className={`
                hidden text-[#64748B] transition-transform
                duration-200 sm:block
                ${showProfileMenu ? "rotate-180" : ""}
              `}
            />
          </button>

          {/* Profile dropdown */}

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