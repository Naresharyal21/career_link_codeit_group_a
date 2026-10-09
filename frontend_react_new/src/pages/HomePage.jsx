import { useEffect, useState } from 'react';
import apiClient from '../api';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [isLoggedIn] = useState(() => {
    const token = sessionStorage.getItem('access_token');
    return !!token && token !== 'undefined' && token !== 'null';
  });
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoadError('');
        const response = await apiClient.get('/jobs/');
        const jobsData = Array.isArray(response.data)
          ? response.data
          : (response.data.results || []);
        setJobs(jobsData);
      } catch (err) {
        console.error("Error fetching jobs", err);
        setLoadError('Unable to load jobs right now. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [reloadCount]);

  const filteredJobs = jobs.filter(job =>
    job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.employer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const jobTypeBadgeClass = (display) => {
    switch (display) {
      case 'Full-time': return 'badge badge-success';
      case 'Part-time': return 'badge badge-info';
      case 'Remote':    return 'badge badge-default';
      case 'Contract':  return 'badge badge-warning';
      default:          return 'badge badge-default';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ═══ NAVBAR ═══ */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="h-[70px] flex items-center justify-between">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200"
                style={{ background: 'linear-gradient(135deg,#1d4ed8,#4338ca)' }}>
                <span className="text-white text-lg font-extrabold">C</span>
              </div>
              <div className="leading-none">
                <h1 className="text-xl font-extrabold tracking-tight text-gray-900">
                  Career<span className="text-blue-600">Link</span>
                </h1>
                <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase mt-0.5">
                  Find Your Future
                </p>
              </div>
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="relative text-sm font-semibold text-blue-600 group">
                Find Jobs
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
              </Link>
              <a href="#why" className="relative text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors group">
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 rounded-full group-hover:w-full transition-all duration-200" />
              </a>
            </div>

            {/* Auth */}
            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <Link to="/dashboard" className="btn-primary">
                  Dashboard →
                </Link>
              ) : (
                <>
                  <Link to="/login" className="hidden sm:block px-4 py-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
                    Login
                  </Link>
                  <Link to="/signup" className="btn-primary">
                    Get Started →
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <div className="hero-gradient py-24 text-center">
        <div className="relative z-10 max-w-4xl mx-auto px-6 animate-fade-in-up">

          {/* Live badge */}
          <span className="glass-card inline-flex items-center gap-2 px-4 py-1.5 text-sm font-semibold text-blue-100 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400" style={{ animation: 'pulse-ring 2s ease infinite' }} />
            {jobs.length > 0 ? `${jobs.length}+ jobs available right now` : 'New jobs added daily'}
          </span>

          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-5">
            Find Your Dream<br />
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(90deg,#7dd3fc,#a5b4fc)' }}>
              Career in Nepal
            </span>
          </h1>

          <p className="text-blue-200 text-lg mb-10 max-w-2xl mx-auto">
            Connect with top employers and discover opportunities tailored to your skills and ambitions.
          </p>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-2xl flex"
            style={{ background: '#fff' }}>
            <div className="flex flex-1 items-center px-5 gap-3">
              <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Job title, skill, or company…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 py-4 text-sm font-medium text-gray-800 placeholder-gray-400 outline-none bg-transparent"
              />
            </div>
            <button className="btn-primary rounded-none px-8 text-sm">
              Search Jobs
            </button>
          </div>

          {/* Popular tags */}
          <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm">
            <span className="text-blue-300 font-medium mr-1">Popular:</span>
            {['IT', 'Banking', 'NGO', 'Engineering', 'Marketing', 'Finance'].map(tag => (
              <button
                key={tag}
                onClick={() => setSearchTerm(tag)}
                className="glass-card px-3 py-1 text-blue-100 text-xs font-semibold hover:bg-white/20 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ STATS BAR ═══ */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: `${jobs.length}+`, label: 'Active Jobs' },
              { value: '50+',   label: 'Companies Hiring' },
              { value: '2K+',   label: 'Job Seekers' },
              { value: '98%',   label: 'Satisfaction Rate' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-2xl font-extrabold text-blue-700">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ JOB LISTINGS ═══ */}
      <div className="max-w-6xl mx-auto py-14 px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Opportunities</p>
            <h2 className="text-3xl font-bold text-gray-900">
              {searchTerm ? `Results for "${searchTerm}"` : 'Featured Opportunities'}
            </h2>
          </div>
          {!loading && filteredJobs.length > 0 && (
            <span className="text-sm text-gray-400 font-medium">{filteredJobs.length} jobs found</span>
          )}
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                <div className="flex justify-between">
                  <div className="skeleton w-12 h-12" />
                  <div className="skeleton w-20 h-7" />
                </div>
                <div className="skeleton h-4 w-3/4" />
                <div className="skeleton h-3 w-1/2" />
                <div className="flex gap-2">
                  <div className="skeleton h-7 w-24" />
                  <div className="skeleton h-7 w-20" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Job Cards */}
        {!loading && filteredJobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map(job => (
              <div key={job.id} className="job-card animate-fade-in-up flex flex-col">

                {/* Top */}
                <div className="flex items-start justify-between gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg text-blue-700 border border-blue-100 transition-all duration-300 group-hover:border-0"
                    style={{ background: 'linear-gradient(135deg,#eff6ff,#e0e7ff)' }}>
                    {(job.employer_name || 'C').charAt(0).toUpperCase()}
                  </div>
                  <span className={jobTypeBadgeClass(job.job_type_display)}>
                    {job.job_type_display || job.job_type}
                  </span>
                </div>

                {/* Info */}
                <div className="mt-5 flex-1">
                  <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-2 hover:text-blue-700 transition-colors">
                    {job.title}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-blue-600">
                    {job.employer_name || 'Company Not Available'}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {job.location && (
                    <span className="badge badge-default">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {job.location}
                    </span>
                  )}
                  {job.category_name && (
                    <span className="badge badge-info">{job.category_name}</span>
                  )}
                  {(job.salary_min || job.salary_max) && (
                    <span className="badge badge-success">
                      NPR {Number(job.salary_min || 0).toLocaleString()}–{Number(job.salary_max || 0).toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 mt-5 pt-4 flex items-center justify-between">
                  <Link
                    to={`/job/${job.id}`}
                    className="text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-1"
                  >
                    View Details →
                  </Link>
                  <Link to={`/job/${job.id}`} className="btn-primary py-2 px-4 text-xs">
                    Apply Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && loadError && (
          <div className="empty-state" role="alert">
            <h3 className="text-lg font-semibold text-gray-900">Jobs are temporarily unavailable</h3>
            <p className="mt-2 text-sm text-gray-500">{loadError}</p>
            <button onClick={() => {
              setLoading(true);
              setReloadCount(count => count + 1);
            }} className="btn-primary mt-5">
              Try again
            </button>
          </div>
        )}

        {!loading && !loadError && filteredJobs.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No jobs found</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
              {searchTerm ? `No results for "${searchTerm}". Try a different keyword.` : 'Check back soon for new opportunities.'}
            </p>
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="btn-primary mt-5">
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>

      {/* ═══ WHY CAREERLINK ═══ */}
      <div id="why" className="bg-white border-t border-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">Why CareerLink?</p>
            <h2 className="text-3xl font-bold text-gray-900">The smarter way to find work</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 12c0 5.591 3.824 10.291 9 11.622C17.176 22.291 21 17.591 21 12c0-1.042-.133-2.052-.382-3.016z" /></svg>,
                color: 'bg-blue-50 text-blue-600',
                title: 'Verified Employers',
                desc: 'Every employer on our platform is verified, ensuring you apply to legitimate companies.',
              },
              {
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
                color: 'bg-amber-50 text-amber-600',
                title: 'Apply in Seconds',
                desc: 'One-click applications with your saved profile mean faster response from employers.',
              },
              {
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
                color: 'bg-emerald-50 text-emerald-600',
                title: 'Real-time Updates',
                desc: 'Track your application status in real time and get notified instantly on updates.',
              },
            ].map(f => (
              <div key={f.title} className="stat-card flex flex-col items-center text-center p-6">
                <div className={`w-14 h-14 rounded-2xl ${f.color} flex items-center justify-center mb-5`}>{f.icon}</div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ background: '#111827' }} className="text-gray-400 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)' }}>
              <span className="text-white text-sm font-extrabold">C</span>
            </div>
            <span className="font-bold text-white text-sm">CareerLink Nepal</span>
          </div>
          <p className="text-sm text-center">© {new Date().getFullYear()} CareerLink. Built for Nepal's workforce.</p>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/login"  className="hover:text-white transition-colors">Login</Link>
            <Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
