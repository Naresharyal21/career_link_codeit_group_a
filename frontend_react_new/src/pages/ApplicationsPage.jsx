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
        sessionStorage.removeItem('access_token');
        navigate('/login');
      }
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
    return <div className="text-gray-500 p-8">Loading Applications...</div>;
  }

  const isEmployer = userRole === 'ep';

  return (
    <div className="space-y-8 max-w-7xl mx-auto">

      {/* Page Header */}
      <div>
        <p className="text-sm font-semibold text-blue-600 mb-2">
          APPLICATIONS
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {isEmployer ? "Received Applications" : "My Applications"}
        </h1>

        <p className="text-gray-500 mt-2">
          {isEmployer
            ? "Review and manage applications submitted by job seekers."
            : "Track and manage the jobs you have applied for."}
        </p>
      </div>


      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Total Applications */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Applications
              </p>

              <p className="text-3xl font-bold text-gray-900 mt-2">
                {applications.length}
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


        {/* Saved Jobs */}
        {!isEmployer && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Saved Jobs
                </p>

                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {savedJobs.length}
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


        {/* Account Type */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Account Type
              </p>

              <p className="text-lg font-bold text-gray-900 mt-2">
                {isEmployer ? "Employer" : "Job Seeker"}
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>

          </div>
        </div>

      </div>


      {/* Applications Section */}
      <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Section Header */}
        <div className="px-6 sm:px-8 py-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isEmployer ? "Applications Received" : "Your Applications"}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {applications.length === 0
                ? "There are currently no applications."
                : `${applications.length} application${applications.length !== 1 ? "s" : ""} found`}
            </p>
          </div>

          <span className="w-fit px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold">
            {applications.length} Total
          </span>

        </div>


        {/* Applications */}
        <div className="p-6 sm:p-8">

          {applications.length === 0 ? (

            /* Empty State */
            <div className="py-14 text-center">

              <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                No applications found
              </h3>

              <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                {isEmployer
                  ? "Applications submitted to your job postings will appear here."
                  : "Once you apply for a job, your application status will appear here."}
              </p>

            </div>

          ) : (

            <div className="space-y-4">

              {applications.map(function (app) {

                const status = app.status?.toLowerCase();

                let statusClasses = "bg-gray-100 text-gray-700";
                let statusDot = "bg-gray-500";

                if (status === "accepted" || status === "approved") {
                  statusClasses = "bg-green-50 text-green-700";
                  statusDot = "bg-green-500";
                } else if (status === "rejected" || status === "declined") {
                  statusClasses = "bg-red-50 text-red-700";
                  statusDot = "bg-red-500";
                } else if (
                  status === "pending" ||
                  status === "submitted" ||
                  status === "reviewing"
                ) {
                  statusClasses = "bg-amber-50 text-amber-700";
                  statusDot = "bg-amber-500";
                }

                return (
                  <div
                    key={app.id}
                    className="group border border-gray-100 rounded-2xl p-5 sm:p-6 hover:border-blue-200 hover:shadow-md transition-all duration-200"
                  >

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                      {/* Application Information */}
                      <div className="flex items-start gap-4 min-w-0">

                        <div className="w-12 h-12 shrink-0 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          {app.job_title?.charAt(0).toUpperCase() || "J"}
                        </div>

                        <div className="min-w-0">

                          <h3 className="text-lg font-bold text-gray-900 truncate">
                            {app.job_title}
                          </h3>

                          {isEmployer && app.job_seeker && (
                            <p className="text-sm text-gray-500 mt-1">
                              Applicant:{" "}
                              <span className="font-semibold text-gray-700">
                                {app.job_seeker}
                              </span>
                            </p>
                          )}

                          <div className="mt-3">
                            <span
                              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${statusClasses}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full mr-2 ${statusDot}`}
                              ></span>

                              {app.status}
                            </span>
                          </div>

                        </div>

                      </div>


                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-3">

                        <Link
                          to={`/job/${app.job}`}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors"
                        >
                          View Job

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
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Link>


                        {!isEmployer && (
                          <button
                            onClick={() => handleUnapply(app.id)}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors"
                          >
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>

                            Unapply
                          </button>
                        )}

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>

          )}

        </div>

      </section>


      {/* Saved Jobs */}
      {!isEmployer && (
        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Header */}
          <div className="px-6 sm:px-8 py-6 border-b border-gray-100 flex items-center justify-between">

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Saved Jobs
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Keep track of opportunities you want to explore.
              </p>
            </div>

            <span className="px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-sm font-semibold">
              {savedJobs.length}
            </span>

          </div>


          {/* Saved Jobs List */}
          <div className="p-6 sm:p-8">

            {savedJobs.length === 0 ? (

              <div className="py-12 text-center">

                <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V5z"
                    />
                  </svg>
                </div>

                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  No saved jobs
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Jobs you save for later will appear here.
                </p>

              </div>

            ) : (

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {savedJobs.map(function (job) {

                  return (
                    <div
                      key={job.id}
                      className="group border border-gray-100 rounded-2xl p-5 hover:border-blue-200 hover:shadow-md transition-all duration-200"
                    >

                      <div className="flex items-center justify-between gap-4">

                        <div className="flex items-center gap-4 min-w-0">

                          <div className="w-11 h-11 shrink-0 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold group-hover:bg-amber-100 transition-colors">
                            {job.job_title?.charAt(0).toUpperCase() || "J"}
                          </div>

                          <div className="min-w-0">

                            <h3 className="font-bold text-gray-900 truncate">
                              {job.job_title}
                            </h3>

                            <p className="text-xs text-gray-500 mt-1">
                              Saved job
                            </p>

                          </div>

                        </div>


                        <Link
                          to={`/job/${job.job}`}
                          className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                          title="View job details"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Link>

                      </div>

                    </div>
                  );

                })}

              </div>

            )}

          </div>

        </section>
      )}

    </div>
  );
};

export default ApplicationsPage;
