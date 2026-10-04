import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs]       = useState([]);
  const [userRole, setUserRole]         = useState('');
  const [loading, setLoading]           = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = sessionStorage.getItem('access_token');
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
      setApplications(Array.isArray(appRes.data) ? appRes.data : (appRes.data.results || []));

      if (role === 'js') {
        const savedRes = await axios.get('http://localhost:8000/api/v1/applications/saved-jobs/', config);
        setSavedJobs(Array.isArray(savedRes.data) ? savedRes.data : (savedRes.data.results || []));
      }
    } catch (err) {
      console.error("Error fetching data", err);
      if (err.response && err.response.status === 401) {
        sessionStorage.removeItem('access_token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUnapply = async (appId) => {
    const token = sessionStorage.getItem('access_token');
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
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="skeleton h-24" />)}
        </div>
      </div>
    );
  }

  const isEmployer = userRole === 'ep';

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-fade-in">

      {/* ─── Page Header ─── */}
      <div>
        <p className="text-sm font-semibold text-blue-600 mb-1 uppercase tracking-wider">Applications</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          {isEmployer ? "Received Applications" : "My Applications"}
        </h1>
        <p className="text-gray-500 mt-2 text-sm font-medium">
          {isEmployer
            ? "Review and manage applications submitted by job seekers."
            : "Track and manage the jobs you have applied for."}
        </p>
      </div>

      {/* ─── Summary Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Total Apps */}
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500">Total Applications</p>
              <p className="text-3xl font-extrabold text-gray-900 mt-2">{applications.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Saved Jobs */}
        {!isEmployer && (
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500">Saved Jobs</p>
                <p className="text-3xl font-extrabold text-gray-900 mt-2">{savedJobs.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V5z" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Account Type */}
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500">Account Type</p>
              <p className="text-lg font-bold text-gray-900 mt-2">{isEmployer ? "Employer" : "Job Seeker"}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Applications Section ─── */}
      <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 sm:px-8 py-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isEmployer ? "Applications Received" : "Your Applications"}
            </h2>
          </div>
          <span className="badge badge-info">{applications.length} Total</span>
        </div>

        <div className="p-6 sm:p-8">
          {applications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mt-2 text-lg font-semibold text-gray-900">No applications found</h3>
              <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                {isEmployer
                  ? "Applications submitted to your job postings will appear here."
                  : "Once you apply for a job, your application status will appear here."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map(app => {
                const status = app.status?.toLowerCase();
                let badgeClass = "badge badge-default";
                if (status === "accepted" || status === "approved") badgeClass = "badge badge-success";
                else if (status === "rejected" || status === "declined") badgeClass = "badge badge-danger";
                else if (status === "pending" || status === "submitted" || status === "reviewing") badgeClass = "badge badge-warning";

                return (
                  <div key={app.id} className="job-card !p-5 lg:!p-6 group flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                    
                    {/* Info */}
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="w-12 h-12 shrink-0 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg group-hover:bg-blue-600 group-hover:text-white transition-colors border border-blue-100 group-hover:border-transparent">
                        {app.job_title?.charAt(0).toUpperCase() || "J"}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-700 transition-colors">
                          {app.job_title}
                        </h3>
                        {isEmployer && app.job_seeker && (
                          <p className="text-sm font-medium text-gray-500 mt-1">
                            Applicant: <span className="font-bold text-gray-700">{app.job_seeker}</span>
                          </p>
                        )}
                        <div className="mt-3">
                          <span className={`${badgeClass} capitalize`}>{app.status}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                      <Link to={`/job/${app.job}`} className="btn-secondary py-2 px-4 text-xs">
                        View Job →
                      </Link>
                      {!isEmployer && (
                        <button onClick={() => handleUnapply(app.id)} className="btn-danger py-2 px-4 text-xs">
                          Unapply
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ─── Saved Jobs Section ─── */}
      {!isEmployer && (
        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 sm:px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Saved Jobs</h2>
            </div>
            <span className="badge badge-warning">{savedJobs.length} Saved</span>
          </div>

          <div className="p-6 sm:p-8">
            {savedJobs.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon !bg-amber-50 !text-amber-500">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V5z" />
                  </svg>
                </div>
                <h3 className="mt-2 text-lg font-semibold text-gray-900">No saved jobs</h3>
                <p className="mt-1 text-sm text-gray-500">Jobs you save for later will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedJobs.map(job => (
                  <div key={job.id} className="group border border-gray-200 rounded-2xl p-5 hover:border-amber-300 hover:shadow-md transition-all duration-200 bg-white flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-11 h-11 shrink-0 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold border border-amber-100 group-hover:bg-amber-500 group-hover:text-white transition-all">
                        {job.job_title?.charAt(0).toUpperCase() || "J"}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-gray-900 truncate group-hover:text-amber-700">{job.job_title}</h3>
                        <p className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-wider">Saved job</p>
                      </div>
                    </div>
                    <Link to={`/job/${job.job}`} className="shrink-0 btn-secondary p-2 border-none bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600" title="View details">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default ApplicationsPage;
