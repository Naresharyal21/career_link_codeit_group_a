import React, { useContext, useEffect, useRef, useState } from "react";

import { IoIosNotificationsOutline } from "react-icons/io";
import { CiLight, CiDark } from "react-icons/ci";
import { FiChevronDown } from "react-icons/fi";
import { useLocation } from "react-router-dom";

import logo from "../assets/logo.png";
import MyProfilecart from "../pages/accounts/MyProfilecart";
import { useTheme } from "../context/ThemeContext";
import { AuthenticationContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";
const POLL_INTERVAL_MS = 30000;

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isAuthenticated, user } = useContext(AuthenticationContext);
  const location = useLocation();

  const MEDIA_BASE_URL = import.meta.env.VITE_MEDIA_BASE_URL;
  const profileRef = useRef(null);

  // Refetch the unread count on every page change, every 30 seconds,
  // and when the notifications page announces a change.
  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return;
    }

    const controller = new AbortController();

    const fetchUnreadCount = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        const res = await fetch(`${API_BASE}/notifications/unread-count/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        if (!res.ok) return;

        const data = await res.json();
        setUnreadCount(data.unread_count || 0);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error fetching unread count:", err);
        }
      }
    };

    fetchUnreadCount();

    const interval = setInterval(() => {
      if (!document.hidden) fetchUnreadCount();
    }, POLL_INTERVAL_MS);

    window.addEventListener("notifications:changed", fetchUnreadCount);

    return () => {
      controller.abort();
      clearInterval(interval);
      window.removeEventListener("notifications:changed", fetchUnreadCount);
    };
  }, [location.pathname, isAuthenticated]);

  const initials = user?.username
    ?.split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
      <div className="flex h-full items-center">
        <img src={logo} alt="CareerLink" className="h-16 w-auto object-contain" />
      </div>

      <div className=" font-mono text-green-700">
        {user?.role_display ? `${user.role_display.toUpperCase()} PORTAL` : "CAREERLINK"}
      </div>

      <div className="flex items-center gap-2 pr-[3%]">
        <button
          type="button"
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
          aria-pressed={theme === "dark"}
          onClick={toggleTheme}
          className="rounded-xl p-2 transition hover:bg-purple-100"
        >
          {theme === "light" ? (
            <CiDark className="text-2xl" />
          ) : (
            <CiLight className="text-2xl text-black" />
          )}
        </button>

        {isAuthenticated && (
          <Link
            to="/dashboard/notifications"
            aria-label="Notifications"
            className="relative rounded-xl p-2 text-2xl text-black transition hover:bg-purple-100"
          >
            <IoIosNotificationsOutline />

            {unreadCount > 0 && (
              <span className="absolute right-[8px] top-[7px] h-2 w-2 rounded-full bg-[#6C4DFF] ring-2 ring-white" />
            )}
          </Link>
        )}

        {isAuthenticated ? (
        <div ref={profileRef} className="relative flex gap-2">
          <div className="h-14 w-14 p-1 rounded flex  justify-center hover:bg-purple-900 ">
            <button
              className="relative group flex rounded-full h-12 w-13 text-white justify-center items-center bg-gray-600 hover:cursor-pointer"
              aria-label="Open account menu"
              aria-expanded={showProfileMenu}
              onClick={() => setShowProfileMenu((open) => !open)}
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
                />
              ) : (
                initials
              )}
            </button>
          </div>

          <button
            className="hidden items-center gap-2 text-left sm:flex"
            aria-expanded={showProfileMenu}
            onClick={() => setShowProfileMenu((open) => !open)}
          >
            <div>
              <p className="max-w-[130px] truncate text-sm font-semibold text-[#172337]">
                {user?.username || "User"}
              </p>

              <p className="text-xs text-[#64748B]">{user?.role || "Account"}</p>
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
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="rounded-lg bg-blue-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;