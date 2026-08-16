import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      const config = { headers: { Authorization: 'Bearer ' + token } };
      const appRes = await axios.get('http://localhost:8000/api/v1/applications/', config);
      const savedRes = await axios.get('http://localhost:8000/api/v1/applications/saved-jobs/', config);
      
      setApplications(appRes.data);
      setSavedJobs(savedRes.data);
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  const handleUnapply = async (appId) => {
    const token = localStorage.getItem('access_token');
    try {
      await axios.delete('http://localhost:8000/api/v1/applications/' + appId + '/', {
        headers: { Authorization: 'Bearer ' + token }
      });
      fetchData();
    } catch (err) {
      console.error("Error unapplying", err);
    }
  };

  return (
    <div className="space-y-8">
      <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h2 className="text-2xl font-bold mb-8 text-gray-900">My Applications</h2>
        {applications.length === 0 ? <p className="text-gray-500">No applications found.</p> : (
          <div className="space-y-4">
            {applications.map(function(app) {
              return (
                <div key={app.id} className="flex justify-between items-center p-6 border border-gray-100 rounded-2xl hover:shadow-sm transition">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{app.job_title}</h3>
                    <p className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block mt-2">Status: {app.status}</p>
                  </div>
                  <div className="flex gap-3">
                    <Link to={'/job/' + app.job} className="px-5 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition">View</Link>
                    <button onClick={() => handleUnapply(app.id)} className="px-5 py-2.5 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition">Unapply</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h2 className="text-2xl font-bold mb-8 text-gray-900">Saved Jobs</h2>
        {savedJobs.length === 0 ? <p className="text-gray-500">No saved jobs found.</p> : (
          <div className="space-y-4">
            {savedJobs.map(function(job) {
              return (
                <div key={job.id} className="flex justify-between items-center p-6 border border-gray-100 rounded-2xl hover:shadow-sm transition">
                  <h3 className="text-lg font-bold text-gray-900">{job.job_title}</h3>
                  <Link to={'/job/' + job.job} className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition">View Details</Link>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default ApplicationsPage;
