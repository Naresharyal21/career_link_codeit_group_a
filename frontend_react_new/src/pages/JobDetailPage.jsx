import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

const JobDetailPage = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [applying, setApplying] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('access_token');
    setIsLoggedIn(!!token && token !== 'undefined' && token !== 'null');

    const fetchData = async () => {
      try {
        const config = token ? { headers: { Authorization: 'Bearer ' + token } } : {};

        // Fetch Job Details
        const jobRes = await axios.get('http://localhost:8000/api/v1/jobs/' + id + '/');
        setJob(jobRes.data);

        // Check if already applied
        if (token) {
          const appRes = await axios.get('http://localhost:8000/api/v1/applications/', config);
          const apps = Array.isArray(appRes.data) ? appRes.data : (appRes.data.results || []);
          const applied = apps.some(app => String(app.job) === String(id));
          setHasApplied(applied);
        }
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };
    fetchData();
  }, [id]);

  const handleApply = async () => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }
    setApplying(true);
    try {
      await axios.post('http://localhost:8000/api/v1/applications/',
        { job: id },
        { headers: { Authorization: 'Bearer ' + token } }
      );
      setHasApplied(true);
      setSuccessMessage('🎉 Application submitted successfully!');
      setTimeout(() => setSuccessMessage(''), 6000);
    } catch (err) {
      console.error("Error applying for job", err);
      alert('Failed to apply. You might have already applied for this job.');
    } finally {
      setApplying(false);
    }
  };

  // Loading State
  if (!job) return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar skeleton */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-extrabold">C</span>
            </div>
            <span className="font-extrabold text-gray-900">Career<span className="text-blue-600">Link</span></span>
          </Link>
        </div>
      </nav>
      <div className="max-w-5xl mx-auto py-20 px-6">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-gray-200 rounded w-48" />
          <div className="bg-white rounded-3xl border border-gray-100 p-10 space-y-6">
            <div className="flex gap-6">
              <div className="w-16 h-16 bg-gray-200 rounded-2xl shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="h-7 bg-gray-200 rounded w-2/3" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="flex gap-2">
                  <div className="h-7 bg-gray-200 rounded-full w-24" />
                  <div className="h-7 bg-gray-200 rounded-full w-20" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded w-4/6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const jobTypeColor = (type) => {
    switch (type) {
      case 'Full-time': return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200';
      case 'Part-time': return 'bg-violet-50 text-violet-700 ring-1 ring-violet-200';
      case 'Remote':    return 'bg-sky-50 text-sky-700 ring-1 ring-sky-200';
      case 'Contract':  return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200';
      default:          return 'bg-gray-100 text-gray-600 ring-1 ring-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ─── Navbar ─── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                <span className="text-white font-extrabold">C</span>
              </div>
              <span className="font-extrabold text-gray-900 text-lg">
                Career<span className="text-blue-600">Link</span>
              </span>
            </Link>
            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <Link to="/dashboard" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all">
                  Dashboard →
                </Link>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors px-3 py-2">Login</Link>
                  <Link to="/signup" className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ─── Success Toast ─── */}
      {successMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-white border border-emerald-200 shadow-xl rounded-2xl p-4 flex items-center gap-3 min-w-80 animate-bounce-once">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 text-lg">✓</div>
          <div>
            <p className="font-bold text-gray-900 text-sm">Application Submitted!</p>
            <p className="text-xs text-gray-500 mt-0.5">{successMessage}</p>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto py-10 px-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Link to="/" className="text-gray-500 hover:text-blue-600 transition-colors font-medium">Home</Link>
          <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
          <Link to="/" className="text-gray-500 hover:text-blue-600 transition-colors font-medium">Jobs</Link>
          <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 font-semibold truncate max-w-xs">{job.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ─── Main Content ─── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Job Header Card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-8">
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-md shrink-0">
                    {(job.employer_name || job.employer?.company_name || 'C').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">{job.title}</h1>
                    <p className="text-base font-semibold text-blue-600 mt-1">
                      {job.employer_name || job.employer?.company_name || 'Company'}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {job.job_type_display && (
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${jobTypeColor(job.job_type_display)}`}>
                          {job.job_type_display}
                        </span>
                      )}
                      {job.experience_level && (
                        <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200">
                          {job.experience_level === 'EN' ? 'Entry Level' : job.experience_level === 'MD' ? 'Mid Level' : 'Senior Level'}
                        </span>
                      )}
                      {job.is_urgent && (
                        <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-red-50 text-red-600 ring-1 ring-red-200">
                          🔥 Urgent Hire
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {job.description && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-blue-600 rounded-full block" />
                  Job Description
                </h2>
                <p className="text-sm text-gray-600 leading-7 whitespace-pre-line">{job.description}</p>
              </div>
            )}

            {/* Responsibilities */}
            {job.responsibilities && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-indigo-500 rounded-full block" />
                  Responsibilities
                </h2>
                <p className="text-sm text-gray-600 leading-7 whitespace-pre-line">{job.responsibilities}</p>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-amber-500 rounded-full block" />
                  Requirements
                </h2>
                <p className="text-sm text-gray-600 leading-7 whitespace-pre-line">{job.requirements}</p>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-emerald-500 rounded-full block" />
                  Benefits & Perks
                </h2>
                <p className="text-sm text-gray-600 leading-7 whitespace-pre-line">{job.benefits}</p>
              </div>
            )}

          </div>

          {/* ─── Sidebar ─── */}
          <div className="space-y-5">

            {/* Apply CTA */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <p className="text-sm text-gray-500 mb-4 font-medium">Ready to join the team?</p>

              {hasApplied ? (
                <button disabled className="w-full py-3.5 rounded-2xl bg-gray-100 text-gray-500 font-bold text-sm cursor-not-allowed flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  Already Applied
                </button>
              ) : (
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {applying ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>Apply Now →</>
                  )}
                </button>
              )}

              {!isLoggedIn && (
                <p className="text-xs text-gray-400 text-center mt-3">
                  <Link to="/login" className="text-blue-600 font-semibold hover:underline">Login</Link> to apply for this job
                </p>
              )}

              <div className="mt-5 pt-5 border-t border-gray-100 space-y-3">

                {/* Job Meta */}
                {[
                  {
                    label: 'Location',
                    value: job.location || 'Not specified',
                    icon: (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    ),
                  },
                  ...(job.salary_min || job.salary_max ? [{
                    label: 'Salary Range',
                    value: `NPR ${(job.salary_min || 0).toLocaleString()} – ${(job.salary_max || 0).toLocaleString()}`,
                    icon: (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ),
                  }] : []),
                  ...(job.deadline ? [{
                    label: 'Deadline',
                    value: job.deadline,
                    icon: (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    ),
                  }] : []),
                  ...(job.category_name ? [{
                    label: 'Category',
                    value: job.category_name,
                    icon: (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    ),
                  }] : []),
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 shrink-0 mt-0.5">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium">{item.label}</p>
                      <p className="text-sm font-semibold text-gray-800 mt-0.5">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map(skill => (
                    <span key={skill.id} className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Back to Jobs */}
            <Link
              to="/"
              className="block w-full text-center py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              ← Browse More Jobs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
