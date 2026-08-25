import { useEffect, useState } from 'react';
import axios from 'axios';

const DashboardPage = () => {
  const [data, setData] = useState({ applications: [], savedJobs: [], profile: {} });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      try {
        const config = { headers: { Authorization: 'Bearer ' + token } };
        // Fetch profile first to know the role
        const profileRes = await axios.get('http://localhost:8000/api/v1/accounts/me/', config);
        const profile = profileRes.data;

        const requests = [axios.get('http://localhost:8000/api/v1/applications/', config)];
        
        // Only fetch saved jobs for Job Seekers
        if (profile.role === 'js') {
            requests.push(axios.get('http://localhost:8000/api/v1/applications/saved-jobs/', config));
        }

        const responses = await Promise.all(requests);
        
        setData({ 
            applications: responses[0].data, 
            savedJobs: profile.role === 'js' ? responses[1].data : [],
            profile: profile 
        });
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      }
    };
    fetchData();
  }, []);

  const getRoleDisplay = (role) => {
    if (role === 'js') return 'Job Seeker';
    if (role === 'ep') return 'Employer';
    return role;
  };

  const isEmployer = data.profile.role === 'ep';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-800 text-xl">
            {data.profile.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{data.profile.username || 'N/A'}</h2>
            <p className="text-gray-500">{getRoleDisplay(data.profile.role)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={isEmployer ? "lg:col-span-3 space-y-6" : "lg:col-span-2 space-y-6"}>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-lg mb-4">{isEmployer ? "Received Applications" : "My Applications"} ({data.applications.length})</h3>
            {data.applications.map(app => (
              <div key={app.id} className="p-4 border border-gray-100 rounded-xl mb-3 flex justify-between items-center">
                <h4 className="font-semibold">{app.job_title}</h4>
                <span className="text-blue-600 font-semibold text-sm">{app.status}</span>
              </div>
            ))}
          </div>
        </div>
        
        {!isEmployer && (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-lg mb-4">Saved Jobs ({data.savedJobs.length})</h3>
                {data.savedJobs.map(job => (
                  <div key={job.id} className="p-4 border border-gray-100 rounded-xl mb-3">
                    <h4 className="font-semibold">{job.job_title}</h4>
                  </div>
                ))}
            </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
