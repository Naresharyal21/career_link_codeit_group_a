import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const SavedJobsPage = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedJobs = async () => {
      const token = sessionStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const config = { headers: { Authorization: 'Bearer ' + token } };
        const response = await axios.get('http://localhost:8000/api/v1/applications/saved-jobs/', config);
        const data = Array.isArray(response.data) ? response.data : (response.data.results || []);
        setSavedJobs(data);
      } catch (err) {
        console.error("Error fetching saved jobs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSavedJobs();
  }, [navigate]);

  if (loading) {
    return (
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">

      {/* ─── Page Header ─── */}
      <div>
        <p className="text-sm font-semibold text-blue-600 mb-2 uppercase tracking-wider">Bookmarked</p>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Saved Jobs</h1>
        <p className="text-gray-500 mt-2 text-sm">
          Jobs you've bookmarked for later review.
        </p>
      </div>

      {/* ─── Summary Card ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Saved Jobs</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{savedJobs.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V5z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Ready to Apply</p>
              <p className="text-lg font-bold text-emerald-600 mt-2">Browse Now →</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Jobs Section ─── */}
      <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="px-6 sm:px-8 py-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Your Saved Jobs</h2>
            <p className="text-sm text-gray-500 mt-1">
              {savedJobs.length === 0
                ? 'No bookmarked jobs yet.'
                : `${savedJobs.length} job${savedJobs.length !== 1 ? 's' : ''} saved`}
            </p>
          </div>
          <span className="px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-sm font-semibold border border-amber-100">
            {savedJobs.length} Saved
          </span>
        </div>

        <div className="p-6 sm:p-8">

          {/* Empty State */}
          {savedJobs.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 text-amber-400 flex items-center justify-center mb-5">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">No saved jobs yet</h3>
              <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                Browse jobs and save the ones you're interested in to easily find them later.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold shadow-sm hover:shadow-md transition-all"
              >
                Browse Jobs →
              </Link>
            </div>
          ) : (

            <div className="space-y-4">
              {savedJobs.map(job => (
                <div
                  key={job.id}
                  className="group border border-gray-100 rounded-2xl p-5 hover:border-amber-200 hover:shadow-md transition-all duration-200 hover:bg-amber-50/20"
                >
                  <div className="flex items-center justify-between gap-4">

                    <div className="flex items-center gap-4 min-w-0">
                      {/* Avatar */}
                      <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 text-amber-600 flex items-center justify-center font-bold text-lg group-hover:from-amber-500 group-hover:to-orange-500 group-hover:text-white transition-all duration-300">
                        {(job.job_title || 'J').charAt(0).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        {job ? (
                          <>
                            <h3 className="font-bold text-gray-900 truncate group-hover:text-amber-700 transition-colors">
                              {job.job_title || 'Job Title Unavailable'}
                            </h3>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-gray-500 font-medium">
                                Job #{job.job}
                              </span>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-100">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V5z" />
                                </svg>
                                Saved
                              </span>
                            </div>
                          </>
                        ) : (
                          <p className="text-red-500 text-sm font-medium">Job details unavailable</p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        to={`/job/${job.job}`}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 text-sm font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200"
                      >
                        View Job
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Browse More CTA */}
      {savedJobs.length > 0 && (
        <div className="flex justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-white hover:border-gray-300 hover:shadow-sm transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Browse More Jobs
          </Link>
        </div>
      )}
    </div>
  );
};

export default SavedJobsPage;
