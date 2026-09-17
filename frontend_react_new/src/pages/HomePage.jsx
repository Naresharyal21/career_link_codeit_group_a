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
              <div key={job.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
                <h3 className="text-lg font-bold mb-1">{job.title}</h3>
                <p className="text-primary font-medium mb-4">{job.employer_name || 'N/A'}</p>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
                  <span>{job.location}</span>
                  <span>{job.job_type_display || job.job_type}</span>
                </div>
                <div className="flex justify-between items-center">
                  <Link to={'/job/' + job.id} className="text-gray-600 font-semibold hover:text-primary">View Details</Link>
                  <Link to={'/job/' + job.id} className="bg-blue-50 text-primary px-4 py-2 rounded-lg font-semibold hover:bg-blue-100">Apply Now</Link>
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
