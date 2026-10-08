import { useEffect, useState } from 'react';
import apiClient from '../api';

const DashboardPage = () => {
  const [data, setData] = useState({ applications: [], savedJobs: [], profile: {} });

  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem('access_token');
      if (!token) return;

      try {
        const config = { headers: { Authorization: 'Bearer ' + token } };
        // Fetch profile first to know the role
        const profileRes = await apiClient.get('/accounts/me/', config);
        const profile = profileRes.data;

        const requests = [apiClient.get('/applications/', config)];

        // Only fetch saved jobs for Job Seekers
        if (profile.role === 'js') {
          requests.push(apiClient.get('/applications/saved-jobs/', config));
        }

        const responses = await Promise.all(requests);

        const applications = Array.isArray(responses[0].data) ? responses[0].data : (responses[0].data.results || []);
        const savedJobs = profile.role === 'js'
          ? (Array.isArray(responses[1].data) ? responses[1].data : (responses[1].data.results || []))
          : [];

        setData({
          applications: applications,
          savedJobs: savedJobs,
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
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">

      {/* ─── Dashboard Header ─── */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="p-6 sm:p-8 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">

            <div className="flex items-center gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-200"
                style={{ background: 'linear-gradient(135deg, #1d4ed8, #4338ca)' }}>
                {data.profile.username?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Welcome back 👋</p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  {data.profile.username || "N/A"}
                </h2>
                <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                  {getRoleDisplay(data.profile.role)}
                </div>
              </div>
            </div>

            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Dashboard</p>
              <p className="text-sm font-medium text-gray-600 mt-1">Manage your activity</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Summary Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Applications */}
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500">
                {isEmployer ? "Received Applications" : "My Applications"}
              </p>
              <p className="text-3xl font-extrabold text-gray-900 mt-2">
                {data.applications.length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Saved Jobs - Job Seeker */}
        {!isEmployer && (
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500">Saved Jobs</p>
                <p className="text-3xl font-extrabold text-gray-900 mt-2">
                  {data.savedJobs.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V5z" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Account Status */}
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500">Account Status</p>
              <p className="text-lg font-bold text-emerald-600 mt-2">Active</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 12c0 5.591 3.824 10.291 9 11.622C17.176 22.291 21 17.591 21 12c0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Applications */}
        <div className={isEmployer ? "lg:col-span-3" : "lg:col-span-2"}>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {isEmployer ? "Received Applications" : "My Applications"}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {isEmployer ? "Review applications submitted for your jobs." : "Track the status of your job applications."}
                </p>
              </div>
              <span className="badge badge-default">{data.applications.length}</span>
            </div>

            <div className="p-6">
              {data.applications.length > 0 ? (
                <div className="space-y-3">
                  {data.applications.map(app => {
                    const status = app.status?.toLowerCase();
                    let badgeClass = "badge badge-default";
                    if (status === "accepted" || status === "approved") badgeClass = "badge badge-success";
                    else if (status === "rejected" || status === "declined") badgeClass = "badge badge-danger";
                    else if (status === "pending" || status === "submitted") badgeClass = "badge badge-warning";

                    return (
                      <div key={app.id} className="group p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-sm hover:bg-blue-50/30 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-11 h-11 rounded-xl bg-gray-100 group-hover:bg-white border border-transparent group-hover:border-blue-100 flex items-center justify-center text-gray-600 font-bold transition-all">
                            {app.job_title?.charAt(0).toUpperCase() || "J"}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-gray-900 truncate group-hover:text-blue-700 transition-colors">
                              {app.job_title}
                            </h4>
                            <p className="text-xs font-medium text-gray-500 mt-1">Job Application</p>
                          </div>
                        </div>
                        <span className={`${badgeClass} capitalize shrink-0`}>
                          {app.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900">No applications yet</h4>
                  <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                    {isEmployer ? "Applications for your job postings will appear here." : "Your submitted job applications will appear here."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Saved Jobs */}
        {!isEmployer && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Saved Jobs</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Bookmarked roles</p>
                </div>
                <span className="badge badge-warning">{data.savedJobs.length}</span>
              </div>
              <div className="p-6">
                {data.savedJobs.length > 0 ? (
                  <div className="space-y-3">
                    {data.savedJobs.map(job => (
                      <div key={job.id} className="group p-4 rounded-2xl border border-gray-100 hover:border-amber-200 hover:shadow-sm hover:bg-amber-50/30 transition-all duration-200 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 group-hover:bg-white border border-transparent group-hover:border-amber-100 flex items-center justify-center text-amber-600 font-bold transition-all shrink-0">
                          {job.job_title?.charAt(0).toUpperCase() || "J"}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-gray-900 truncate group-hover:text-amber-700 transition-colors">
                            {job.job_title}
                          </h4>
                          <p className="text-xs font-medium text-gray-500 mt-1">Saved job</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-state-icon !bg-amber-50 !text-amber-500">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V5z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900">No saved jobs</h4>
                    <p className="text-xs text-gray-500 mt-1">Jobs you save will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default DashboardPage;
