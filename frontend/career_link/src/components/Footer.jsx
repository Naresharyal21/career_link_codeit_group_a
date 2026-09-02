import React from "react";
import { Link } from "react-router-dom";
import careerLinkIcon from "../assets/careerlink_icon.png";

function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-4 gap-16 px-8 py-16">
        <div className="space-y-6">
          <Link to="/" className="inline-flex items-center gap-3">
            <img src={careerLinkIcon} alt="CareerLink logo" className="h-10 w-10" />
            <span className="text-4xl font-bold">CareerLink</span>
          </Link>
          <p className="max-w-xs text-lg leading-8 text-slate-300">
            The hiring platform that connects capable people with the companies that need them.
          </p>

          <div className="flex items-center gap-4">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-slate-300 transition-colors duration-300 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.24 8.25h4.5V23H.24V8.25zM8.25 8.25h4.31v2.01h.06c.6-1.14 2.07-2.34 4.26-2.34 4.56 0 5.4 3 5.4 6.9V23h-4.5v-6.36c0-1.52-.03-3.47-2.11-3.47-2.11 0-2.44 1.65-2.44 3.36V23h-4.5V8.25z" />
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-slate-300 transition-colors duration-300 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                <path d="M23.64 4.94c-.83.37-1.72.62-2.65.73a4.62 4.62 0 0 0 2.03-2.55c-.9.53-1.9.92-2.96 1.13a4.6 4.6 0 0 0-7.86 4.2 13.06 13.06 0 0 1-9.48-4.81 4.6 4.6 0 0 0 1.43 6.15c-.75-.02-1.45-.23-2.06-.57v.06c0 2.23 1.58 4.09 3.68 4.51-.38.1-.79.16-1.2.16-.29 0-.58-.03-.86-.08a4.62 4.62 0 0 0 4.31 3.2A9.24 9.24 0 0 1 0 19.54a13.03 13.03 0 0 0 7.06 2.07c8.48 0 13.12-7.02 13.12-13.12 0-.2 0-.4-.01-.6a9.36 9.36 0 0 0 2.29-2.38z" />
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-slate-300 transition-colors duration-300 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07zM12 0C8.74 0 8.33.01 7.05.07c-1.28.06-2.15.26-2.91.56a5.87 5.87 0 0 0-2.13 1.38A5.87 5.87 0 0 0 .63 4.14c-.3.76-.5 1.63-.56 2.91C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.28.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13.67.66 1.34 1.07 2.13 1.38.76.3 1.63.5 2.91.56 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c1.28-.06 2.15-.26 2.91-.56a5.87 5.87 0 0 0 2.13-1.38 5.87 5.87 0 0 0 1.38-2.13c.3-.76.5-1.63.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.28-.26-2.15-.56-2.91a5.87 5.87 0 0 0-1.38-2.13A5.87 5.87 0 0 0 19.86.63c-.76-.3-1.63-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zM12 16a4 4 0 1 1 4-4 4 4 0 0 1-4 4zm6.41-10.44a1.44 1.44 0 1 1-1.44-1.44 1.44 1.44 0 0 1 1.44 1.44z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white">Candidates</h3>
          <ul className="space-y-4">
            <li><Link to="/browse" className="text-lg text-slate-300 transition-colors duration-300 hover:text-white">Find Jobs</Link></li>
            <li><Link to="/companies" className="text-lg text-slate-300 transition-colors duration-300 hover:text-white">Companies</Link></li>
            <li><Link to="/dashboard" className="text-lg text-slate-300 transition-colors duration-300 hover:text-white">My Dashboard</Link></li>
            <li><Link to="/resume" className="text-lg text-slate-300 transition-colors duration-300 hover:text-white">Resume Manager</Link></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white">Employers</h3>
          <ul className="space-y-4">
            <li><Link to="/employer/dashboard" className="text-lg text-slate-300 transition-colors duration-300 hover:text-white">Employer Dashboard</Link></li>
            <li><Link to="/employer/post-job" className="text-lg text-slate-300 transition-colors duration-300 hover:text-white">Post a Job</Link></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white">Company</h3>
          <ul className="space-y-4">
            <li><Link to="/about" className="text-lg text-slate-300 transition-colors duration-300 hover:text-white">About</Link></li>
            <li><Link to="/faq" className="text-lg text-slate-300 transition-colors duration-300 hover:text-white">FAQ</Link></li>
            <li><Link to="/contact" className="text-lg text-slate-300 transition-colors duration-300 hover:text-white">Contact</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-8 py-6">
          <p className="text-center text-base text-slate-400">© 2026 CareerLink. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;