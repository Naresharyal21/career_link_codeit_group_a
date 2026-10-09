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
  const [storedUnreadCount, setStoredUnreadCount] = useState(0);
  const { isAuthenticated, user } = useContext(AuthenticationContext);
  const location = useLocation();
  const unreadCount = isAuthenticated ? storedUnreadCount : 0;

  const MEDIA_BASE_URL = import.meta.env.VITE_MEDIA_BASE_URL;
  const profileRef = useRef(null);

  // Refetch the unread count on every page change, every 30 seconds,
  // and when the notifications page announces a change.
  useEffect(() => {
    if (!isAuthenticated) return;

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
        setStoredUnreadCount(data.unread_count || 0);
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

    const handleEscape = (event) => {
      if (event.key === "Escape") setShowProfileMenu(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="flex h-full min-w-0 items-center justify-between gap-3 px-3 sm:px-6 lg:px-8">
      <div className="flex h-full shrink-0 items-center">
        <img src={logo} alt="CareerLink" className="h-12 w-auto object-contain sm:h-14" />
      </div>

      <div className="hidden min-w-0 flex-1 truncate text-center font-mono text-sm text-green-700 sm:block">
        {user?.role_display ? `${user.role_display.toUpperCase()} PORTAL` : "CAREERLINK"}
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <button
          type="button"
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
          aria-pressed={theme === "dark"}
          onClick={toggleTheme}
          className="theme-action rounded-xl p-2 transition hover:bg-purple-100"
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
            onClick={() => setShowProfileMenu(false)}
            className="theme-action relative rounded-xl p-2 text-2xl text-black transition hover:bg-purple-100"
          >
            <IoIosNotificationsOutline />

            {unreadCount > 0 && (
              <span className="absolute right-[8px] top-[7px] h-2 w-2 rounded-full bg-[#6C4DFF] ring-2 ring-white" />
            )}
          </Link>
        )}

        {isAuthenticated ? (
        <div ref={profileRef} className="relative flex items-center gap-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-full sm:h-12 sm:w-12">
            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-600 text-sm font-semibold text-white transition hover:ring-2 hover:ring-violet-300 sm:h-11 sm:w-11"
              aria-label="Open account menu"
              aria-expanded={showProfileMenu}
              aria-controls="account-menu"
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
            type="button"
            className="hidden items-center gap-2 text-left sm:flex"
            aria-expanded={showProfileMenu}
            aria-controls="account-menu"
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
            <div
              id="account-menu"
              className="absolute right-0 top-full z-[100] mt-2 w-72 max-w-[calc(100vw-2rem)]"
            >
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