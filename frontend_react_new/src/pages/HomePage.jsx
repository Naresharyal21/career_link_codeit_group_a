import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);

    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/jobs/');
        setJobs(response.data);
      } catch (err) {
        console.error("Error fetching jobs", err);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center px-12 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-primary">Career Link</h1>
        <div className="space-x-6 flex items-center">
          <Link to="#" className="text-gray-600 hover:text-primary">Find Jobs</Link>
          <Link to="#" className="text-gray-600 hover:text-primary">Companies</Link>
          {isLoggedIn ? (
            <Link to="/dashboard" className="bg-primary text-white px-5 py-2 rounded-lg font-semibold">Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-primary">Login</Link>
              <Link to="/signup" className="bg-primary text-white px-5 py-2 rounded-lg font-semibold">Sign Up</Link>
            </>
          )}
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
          {jobs.map(function(job) {
            return (
              <div key={job.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
                <h3 className="text-lg font-bold mb-1">{job.title}</h3>
                <p className="text-primary font-medium mb-4">{job.employer ? job.employer.company_name : 'N/A'}</p>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
                  <span>{job.location}</span>
                  <span>{job.job_type}</span>
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
