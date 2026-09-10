import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('access_token');
    if (!token || token === 'undefined' || token === 'null') {
      navigate('/login');
      return;
    }

    try {
      const config = { headers: { Authorization: 'Bearer ' + token } };
      
      const meRes = await axios.get('http://localhost:8000/api/v1/accounts/me/', config);
      const role = meRes.data.role;
      setUserRole(role);

      const appRes = await axios.get('http://localhost:8000/api/v1/applications/', config);
      // Ensure array mapping
      setApplications(Array.isArray(appRes.data) ? appRes.data : (appRes.data.results || []));

      if (role === 'js') {
        const savedRes = await axios.get('http://localhost:8000/api/v1/applications/saved-jobs/', config);
        // Ensure array mapping
        setSavedJobs(Array.isArray(savedRes.data) ? savedRes.data : (savedRes.data.results || []));
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data", err);
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('access_token');
        navigate('/login');
      }
      setLoading(false);
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

  if (loading) {
    return <div className="text-gray-500 p-8">Loading Applications...</div>;
  }

  const isEmployer = userRole === 'ep';

  return (
    <div className="space-y-8">
      <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h2 className="text-2xl font-bold mb-8 text-gray-900">
          {isEmployer ? "Received Applications" : "My Applications"}
        </h2>
        {applications.length === 0 ? (
          <p className="text-gray-500">No applications found.</p>
        ) : (
          <div className="space-y-4">
            {applications.map(function(app) {
              return (
                <div key={app.id} className="flex justify-between items-center p-6 border border-gray-100 rounded-2xl hover:shadow-sm transition">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{app.job_title}</h3>
                    <p className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block mt-2">Status: {app.status}</p>
                    {isEmployer && app.job_seeker && (
                      <p className="text-sm text-gray-500 mt-1">Applicant: <span className="font-semibold text-gray-700">{app.job_seeker}</span></p>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <Link to={'/job/' + app.job} className="px-5 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition">View Job</Link>
                    {!isEmployer && (
                      <button onClick={() => handleUnapply(app.id)} className="px-5 py-2.5 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition">Unapply</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {!isEmployer && (
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
      )}
    </div>
  );
};

export default ApplicationsPage;
