import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const HomePage = () => {
  // Synchronously initialize login state from sessionStorage to avoid flickering on first render
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = sessionStorage.getItem('access_token');
    return !!token && token !== 'undefined' && token !== 'null';
  });
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/jobs/');
        const jobsData = Array.isArray(response.data)
          ? response.data
          : (response.data.results || []);
        setJobs(jobsData);
      } catch (err) {
        console.error("Error fetching jobs", err);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between">

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 group"
            >
              {/* Logo Icon */}
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200">
                <span className="text-white text-lg font-extrabold">
                  C
                </span>
              </div>

              {/* Logo Text */}
              <div className="leading-none">
                <h1 className="text-xl font-extrabold tracking-tight text-gray-900">
                  Career<span className="text-primary">Link</span>
                </h1>

                <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase mt-1">
                  Find Your Future
                </p>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">

              <Link
                to="/jobs"
                className="relative text-sm font-semibold text-gray-600 hover:text-primary transition-colors duration-200 group"
              >
                Find Jobs

                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary rounded-full group-hover:w-full transition-all duration-200" />
              </Link>

              <Link
                to="/companies"
                className="relative text-sm font-semibold text-gray-600 hover:text-primary transition-colors duration-200 group"
              >
                Companies

                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary rounded-full group-hover:w-full transition-all duration-200" />
              </Link>

            </div>

            {/* Authentication */}
            <div className="flex items-center gap-3">

              {isLoggedIn ? (

                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all duration-200"
                >
                  Dashboard

                  <span className="text-base">
                    →
                  </span>
                </Link>

              ) : (

                <>
                  <Link
                    to="/login"
                    className="hidden sm:block px-4 py-2.5 text-sm font-semibold text-gray-600 hover:text-primary transition-colors"
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    Get Started

                    <span className="text-base">
                      →
                    </span>
                  </Link>
                </>

              )}

            </div>

          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-blue-50 py-20 text-center">
        <h1 className="text-5xl font-extrabold mb-6 text-primary-dark">Find Your Dream Career in Nepal</h1>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto bg-white p-2 rounded-full shadow-lg flex items-center mt-8">
          <input type="text" placeholder="Job title, skill, or company" className="flex-1 px-6 py-4 rounded-full focus:outline-none" />
          <select className="px-4 py-4 focus:outline-none text-gray-500">
            <option>Kathmandu</option>
            <option>Pokhara</option>
          </select>
          <button className="bg-primary text-white px-10 py-4 rounded-full font-bold">Search Jobs</button>
        </div>

        {/* Tags */}
        <div className="mt-6 space-x-3 text-sm">
          {['IT', 'Banking', 'NGO', 'Engineering'].map(tag => <span key={tag} className="bg-white px-4 py-1 rounded-full border border-gray-200">{tag}</span>)}
        </div>
      </div>

      {/* Job List */}
      <div className="max-w-6xl mx-auto py-12 px-6">
        <h2 className="text-3xl font-bold mb-8">Featured Opportunities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map(function (job) {
            return (
              <div
                key={job.id}
                className="group bg-white rounded-2xl border border-gray-200 p-6
             hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/40
             transition-all duration-300"
              >
                {/* Top Section */}
                <div className="flex items-start justify-between gap-4">

                  {/* Company Logo */}
                  <div
                    className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100
                 flex items-center justify-center text-primary font-bold text-lg
                 group-hover:bg-primary group-hover:text-white
                 transition-all duration-300"
                  >
                    {(job.employer_name || "C").charAt(0).toUpperCase()}
                  </div>

                  {/* Job Type */}
                  <span className="px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-semibold">
                    {job.job_type_display || job.job_type}
                  </span>

                </div>

                {/* Job Information */}
                <div className="mt-6">

                  <h3
                    className="text-lg font-bold text-gray-900 leading-snug
                 group-hover:text-primary transition-colors duration-200"
                  >
                    {job.title}
                  </h3>

                  <p className="mt-1 text-sm font-semibold text-primary">
                    {job.employer_name || "Company Not Available"}
                  </p>

                </div>

                {/* Job Details */}
                <div className="flex flex-wrap gap-2 mt-5">

                  {/* Location */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-500 text-xs font-medium">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 21s8-7 8-13a8 8 0 10-16 0c0 6 8 13 8 13z"
                      />
                      <circle cx="12" cy="8" r="2.5" />
                    </svg>

                    {job.location || "Location not specified"}
                  </span>

                  {/* Job Type */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-500 text-xs font-medium">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M20 7h-4V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V5h8v2"
                      />
                    </svg>

                    {job.job_type_display || job.job_type}
                  </span>

                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 mt-6 pt-5">

                  <div className="flex items-center justify-between">

                    {/* View Details */}
                    <Link
                      to={`/job/${job.id}`}
                      className="inline-flex items-center gap-1.5
                   text-sm font-semibold text-gray-600
                   hover:text-primary transition-colors duration-200"
                    >
                      View Details

                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        →
                      </span>
                    </Link>

                    {/* Apply Button */}
                    <Link
                      to={`/job/${job.id}`}
                      className="inline-flex items-center gap-2
                   bg-primary text-white
                   px-4 py-2.5 rounded-xl
                   text-sm font-bold
                   hover:bg-primary-dark
                   shadow-sm hover:shadow-md
                   transition-all duration-200"
                    >
                      Apply Now
                      <span>→</span>
                    </Link>

                  </div>

                </div>
              </div>

            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
