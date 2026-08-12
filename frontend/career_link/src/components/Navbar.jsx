import React, { useState } from "react";
import { Link } from "react-router-dom";
import careerLinkIcon from "../assets/careerlink_icon.png";

function Navbar() {
  // TODO: replace this with real auth state (context / redux / whatever we end up using)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200">
      <nav className="flex mx-auto max-w-7xl items-center justify-between px-8 py-4">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <img src={careerLinkIcon} alt="career-logo" className="w-10 h-10" />
            <span className="text-2xl font-semibold text-slate-800">CareerLink</span>
          </Link>
        </div>

        {/* main links - hidden on mobile, shown on md and up */}
        <ul className="hidden md:flex items-center gap-4">
          <li>
            <Link to="/browse" className="text-slate-600 hover:text-slate-950 px-1 py-3 rounded-lg hover:bg-blue-200 transition-colors duration-300">
              Find Jobs
            </Link>
          </li>
          <li>
            <Link to="/companies" className="text-slate-600 hover:text-slate-950 px-1 py-3 rounded-lg hover:bg-blue-200 transition-colors duration-300">
              Companies
            </Link>
          </li>
          <li>
            <Link to="/about" className="text-slate-600 hover:text-slate-950 px-1 py-3 rounded-lg hover:bg-blue-200 transition-colors duration-300">
              About
            </Link>
          </li>
          <li>
            <Link to="/contact" className="text-slate-600 hover:text-slate-950 px-1 py-3 rounded-lg hover:bg-blue-200 transition-colors duration-300">
              Contact
            </Link>
          </li>
        </ul>

        {/* right side - login/signup OR profile dropdown, hidden on mobile */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-blue-100 duration-300"
              >
                Profile ▾
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-2">
                  <Link to="/dashboard" className="block px-4 py-2 text-slate-600 hover:bg-blue-100">
                    Dashboard
                  </Link>
                  <Link to="/saved-jobs" className="block px-4 py-2 text-slate-600 hover:bg-blue-100">
                    Saved Jobs
                  </Link>
                  <Link to="/notifications" className="block px-4 py-2 text-slate-600 hover:bg-blue-100">
                    Notifications
                  </Link>
                  <button
                    onClick={() => {
                      // TODO: hook this up to real logout logic later
                      setIsLoggedIn(false);
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-slate-600 hover:bg-blue-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="text-slate-900 px-2 py-2 rounded-lg hover:bg-blue-100 duration-300">
                Log in
              </Link>
              <Link to="/signup" className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-800 transition-colors duration-300">
                Get started
              </Link>
            </>
          )}
        </div>

        {/* hamburger button - only shown on mobile */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-slate-600 text-3xl"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden flex flex-col gap-2 px-8 pb-4">
          <Link to="/browse" className="text-slate-600 py-2">Find Jobs</Link>
          <Link to="/companies" className="text-slate-600 py-2">Companies</Link>
          <Link to="/about" className="text-slate-600 py-2">About</Link>
          <Link to="/contact" className="text-slate-600 py-2">Contact</Link>

          <hr className="my-2" />

          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="text-slate-600 py-2">Dashboard</Link>
              <Link to="/saved-jobs" className="text-slate-600 py-2">Saved Jobs</Link>
              <Link to="/notifications" className="text-slate-600 py-2">Notifications</Link>
              <button onClick={() => setIsLoggedIn(false)} className="text-left text-slate-600 py-2">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-600 py-2">Log in</Link>
              <Link to="/signup" className="text-blue-500 py-2 font-semibold">Get started</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
