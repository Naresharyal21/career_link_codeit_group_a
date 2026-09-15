import { useEffect, useState } from 'react';
import axios from 'axios';

const DashboardPage = () => {
  const [data, setData] = useState({ applications: [], savedJobs: [], profile: {} });

  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem('access_token');
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
        
        // Normalize response data to ensure array access
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
    <div className="space-y-6 max-w-7xl mx-auto">

  {/* Dashboard Header */}
  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">

        {/* Profile */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-100">
            {data.profile.username?.charAt(0).toUpperCase() || "U"}
          </div>

          <div>
            <p className="text-sm font-medium text-gray-400 mb-1">
              Welcome back 👋
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              {data.profile.username || "N/A"}
            </h2>

            <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
              {getRoleDisplay(data.profile.role)}
            </div>
          </div>
        </div>

        {/* Dashboard Label */}
        <div className="hidden sm:block text-right">
          <p className="text-sm text-gray-400">Dashboard</p>
          <p className="text-sm font-medium text-gray-700 mt-1">
            Manage your activity
          </p>
        </div>

      </div>
    </div>
  </div>


  {/* Summary Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

    {/* Applications */}
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {isEmployer ? "Received Applications" : "My Applications"}
          </p>

          <p className="text-3xl font-bold text-gray-900 mt-2">
            {data.applications.length}
          </p>
        </div>

        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
      </div>
    </div>


    {/* Saved Jobs - Job Seeker */}
    {!isEmployer && (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Saved Jobs
            </p>

            <p className="text-3xl font-bold text-gray-900 mt-2">
              {data.savedJobs.length}
            </p>
          </div>

          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V5z"
              />
            </svg>
          </div>
        </div>
      </div>
    )}


    {/* Account Status */}
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            Account Status
          </p>

          <p className="text-lg font-bold text-green-600 mt-2">
            Active
          </p>
        </div>

        <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 12c0 5.591 3.824 10.291 9 11.622C17.176 22.291 21 17.591 21 12c0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
      </div>
    </div>

  </div>


  {/* Main Dashboard Content */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

    {/* Applications */}
    <div
      className={
        isEmployer
          ? "lg:col-span-3"
          : "lg:col-span-2"
      }
    >
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Section Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {isEmployer ? "Received Applications" : "My Applications"}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              {isEmployer
                ? "Review applications submitted for your jobs."
                : "Track the status of your job applications."}
            </p>
          </div>

          <span className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold">
            {data.applications.length}
          </span>
        </div>


        {/* Applications List */}
        <div className="p-6">

          {data.applications.length > 0 ? (
            <div className="space-y-3">

              {data.applications.map(function (app) {

                const status = app.status?.toLowerCase();

                let statusClasses =
                  "bg-gray-100 text-gray-700";

                if (status === "accepted") {
                  statusClasses = "bg-green-50 text-green-700";
                } else if (status === "rejected") {
                  statusClasses = "bg-red-50 text-red-700";
                } else if (
                  status === "pending" ||
                  status === "submitted"
                ) {
                  statusClasses = "bg-amber-50 text-amber-700";
                }

                return (
                  <div
                    key={app.id}
                    className="group p-4 sm:p-5 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                      {/* Job Info */}
                      <div className="flex items-center gap-4">

                        <div className="w-11 h-11 rounded-xl bg-gray-100 group-hover:bg-white flex items-center justify-center text-gray-600 font-bold transition-colors">
                          {app.job_title?.charAt(0).toUpperCase() || "J"}
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                            {app.job_title}
                          </h4>

                          <p className="text-sm text-gray-500 mt-1">
                            Job Application
                          </p>
                        </div>

                      </div>

                      {/* Status */}
                      <span
                        className={`inline-flex w-fit items-center px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${statusClasses}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current mr-2"></span>
                        {app.status}
                      </span>

                    </div>
                  </div>
                );
              })}

            </div>
          ) : (

            /* Empty State */
            <div className="py-12 text-center">

              <div className="w-14 h-14 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>

              <h4 className="mt-4 font-semibold text-gray-900">
                No applications yet
              </h4>

              <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                {isEmployer
                  ? "Applications for your job postings will appear here."
                  : "Your submitted job applications will appear here."}
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

          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Saved Jobs
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Jobs you've bookmarked.
              </p>
            </div>

            <span className="px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-sm font-semibold">
              {data.savedJobs.length}
            </span>
          </div>


          {/* Saved Jobs List */}
          <div className="p-6">

            {data.savedJobs.length > 0 ? (
              <div className="space-y-3">

                {data.savedJobs.map(function (job) {

                  return (
                    <div
                      key={job.id}
                      className="group p-4 rounded-2xl border border-gray-100 hover:border-amber-200 hover:bg-amber-50/30 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-xl bg-amber-50 group-hover:bg-white flex items-center justify-center text-amber-600 font-bold transition-colors">
                          {job.job_title?.charAt(0).toUpperCase() || "J"}
                        </div>

                        <div className="min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">
                            {job.job_title}
                          </h4>

                          <p className="text-xs text-gray-500 mt-1">
                            Saved job
                          </p>
                        </div>

                      </div>
                    </div>
                  );
                })}

              </div>
            ) : (

              <div className="py-10 text-center">

                <div className="w-12 h-12 mx-auto rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V5z"
                    />
                  </svg>
                </div>

                <h4 className="mt-3 font-semibold text-gray-900">
                  No saved jobs
                </h4>

                <p className="text-xs text-gray-500 mt-1">
                  Jobs you save will appear here.
                </p>

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
