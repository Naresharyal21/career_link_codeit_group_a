import React from "react";
import { Link } from "react-router-dom";
import careerLinkIcon from "../assets/careerlink_icon.png"

function Navbar() {
  return (
    <header className="bg-white border-b border-slate-200">
      <nav className="flex mx-auto max-w-7xl items-center justify-between px-8 py-4">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <img src={careerLinkIcon} alt="career-logo" className="w-10 h-10" />
            <span className="text-2xl font-semibold text-slate-800">CareerLink</span>
          </Link>
        </div>

        <ul className="flex items-center gap-4">
          <li>
            <Link to="/browse" className="text-slate-600 hover:text-slate-950 px-1 py-3 rounded-lg hover:bg-blue-200 transition-colors duration-300">
              Browse Jobs
            </Link>
          </li>
          <li>
            <Link to="/about" className="text-slate-600 hover:text-slate-950 px-1 py-3 rounded-lg hover:bg-blue-200 transition-colors duration-300">
              About
            </Link>
          </li>
          <li>
            <Link to="/faq" className="text-slate-600 hover:text-slate-950 px-1 py-3 rounded-lg hover:bg-blue-200 transition-colors duration-300">
              FAQ
            </Link>
          </li>
          <li>
            <Link to="/contact" className="text-slate-600 hover:text-slate-950 px-1 py-3 rounded-lg hover:bg-blue-200 transition-colors duration-300">
              Contact
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-4">
          <Link to="/login" className="text-slate-900 px-2 py-2 rounded-lg hover:bg-blue-100 duration-300">
            Log in
          </Link>
          <Link to="/signup" className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-800 transition-colors duration-300">
            Get started
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;