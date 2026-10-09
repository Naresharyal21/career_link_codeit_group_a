import { useState } from 'react';
import apiClient from '../api';
import { useNavigate, Link } from 'react-router-dom';

const SignupPage = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'js', location: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiClient.post('/accounts/register/', formData);
      navigate('/verify-otp?email=' + encodeURIComponent(formData.email) + '&purpose=emv');
    } catch (err) {
      const responseData = err.response?.data;
      const fieldErrors = responseData && typeof responseData === 'object'
        ? Object.values(responseData).flat().filter(Boolean).join(' ')
        : '';
      setError(fieldErrors || responseData?.error || 'Registration failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* ─── Left Branding ─── */}
      <div className="auth-panel hidden md:flex md:w-1/2 p-12 items-center justify-center">
        <div className="relative z-10 max-w-md w-full text-white animate-fade-in-up">

          <Link to="/" className="inline-flex items-center gap-3 mb-12">
            <div className="w-11 h-11 rounded-2xl glass-card flex items-center justify-center">
              <span className="text-white font-extrabold text-lg">C</span>
            </div>
            <span className="font-extrabold text-xl">Career<span className="text-blue-300">Link</span></span>
          </Link>

          <h1 className="text-5xl font-extrabold mb-5 leading-tight">
            Join Career<br />
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(90deg,#7dd3fc,#a5b4fc)' }}>
              Link Today
            </span>
          </h1>
          <p className="text-blue-200 text-base leading-relaxed mb-10">
            Create your free account and start your journey toward your dream career.
          </p>

          {/* Role info cards */}
          <div className="space-y-4">
            <div className="glass-card p-4 flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-emerald-400/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Job Seeker</p>
                <p className="text-blue-200 text-xs mt-0.5">Browse jobs, apply, track applications</p>
              </div>
            </div>
            <div className="glass-card p-4 flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-indigo-400/20 border border-indigo-400/30 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Employer</p>
                <p className="text-blue-200 text-xs mt-0.5">Post jobs, manage listings, find talent</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Right: Signup Form ─── */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-14 lg:px-16 bg-white">
        <div className="w-full max-w-md space-y-7 animate-fade-in">

          {/* Mobile logo */}
          <Link to="/" className="flex md:hidden items-center gap-3 justify-center mb-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#1d4ed8,#4338ca)' }}>
              <span className="text-white font-extrabold">C</span>
            </div>
            <span className="font-extrabold text-gray-900">Career<span className="text-blue-600">Link</span></span>
          </Link>

          <div className="text-center md:text-left">
            <h2 className="text-4xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-500 mt-2 text-sm">Fill in the details below to get started.</p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 p-4 rounded-2xl animate-fade-in">
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-red-600 text-xs font-bold">!</span>
              </div>
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Username */}
            <div>
              <label className="form-label" htmlFor="signup-username">Username</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <input
                  id="signup-username" type="text" name="username" value={formData.username} onChange={handleChange}
                  placeholder="Choose a username"
                  className="form-input !pl-11"
                  required
                />
              </div>
            </div>

            <div>
              <label className="form-label" htmlFor="signup-location">Location</label>
              <input
                id="signup-location"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Kathmandu"
                className="form-input"
                autoComplete="address-level2"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="form-label" htmlFor="signup-email">Email Address</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  id="signup-email" type="email" name="email" value={formData.email} onChange={handleChange}
                  placeholder="name@company.com"
                  className="form-input !pl-11"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="form-label" htmlFor="signup-password">Password</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  id="signup-password" type={showPw ? 'text' : 'password'} name="password" value={formData.password}
                  onChange={handleChange} placeholder="Min 8 characters"
                  className="form-input !pl-11 !pr-12"
                  required
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                  {showPw
                    ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  }
                </button>
              </div>
            </div>

            {/* Role selector */}
            <div>
              <label className="form-label">I am a…</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'js', label: 'Job Seeker', icon: '🎯', desc: 'Find jobs' },
                  { value: 'ep', label: 'Employer',   icon: '🏢', desc: 'Hire talent' },
                ].map(role => (
                  <label key={role.value}
                    className={`cursor-pointer rounded-2xl border-2 p-4 flex flex-col items-center text-center transition-all duration-150 ${
                      formData.role === role.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}>
                    <input type="radio" name="role" value={role.value}
                      checked={formData.role === role.value} onChange={handleChange}
                      className="sr-only" />
                    <span className="text-2xl mb-1">{role.icon}</span>
                    <span className={`text-sm font-bold ${formData.role === role.value ? 'text-blue-700' : 'text-gray-900'}`}>
                      {role.label}
                    </span>
                    <span className="text-xs text-gray-400 mt-0.5">{role.desc}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-sm">
              {loading
                ? <><svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg> Creating Account…</>
                : 'Create Account →'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">Login here →</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
