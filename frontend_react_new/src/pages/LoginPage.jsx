import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPw, setShowPw]     = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // The backend LoginSerializer expects 'email' and 'password' in the request payload
      const response = await axios.post('http://localhost:8000/api/v1/accounts/login/', formData);
      sessionStorage.setItem('access_token', response.data.access);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.data?.email?.includes("Please verify your email before logging in")) {
        navigate('/verify-otp?email=' + encodeURIComponent(formData.email) + '&purpose=emv');
        return;
      }
      setError(err.response?.data?.detail || err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* ─── Left branding panel ─── */}
      <div className="auth-panel hidden md:flex md:w-1/2 p-12 items-center justify-center">
        <div className="relative z-10 max-w-md w-full text-white animate-fade-in-up">

          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-3 mb-12">
            <div className="w-11 h-11 rounded-2xl glass-card flex items-center justify-center">
              <span className="text-white font-extrabold text-lg">C</span>
            </div>
            <span className="font-extrabold text-xl">Career<span className="text-blue-300">Link</span></span>
          </Link>

          <h1 className="text-5xl font-extrabold mb-5 leading-tight">
            Your Career,<br />
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(90deg,#7dd3fc,#a5b4fc)' }}>
              Elevated.
            </span>
          </h1>
          <p className="text-blue-200 text-base leading-relaxed mb-10">
            Connect with top employers and discover opportunities tailored to your skills.
          </p>

          <div className="space-y-4">
            {[
              'Access hundreds of verified job listings',
              'One-click apply with your saved profile',
              'Real-time application status tracking',
            ].map(text => (
              <div key={text} className="flex items-center gap-3">
                <div className="glass-card w-6 h-6 flex items-center justify-center shrink-0 rounded-full">
                  <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-blue-100 text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Right: login form ─── */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-14 lg:px-16 bg-white">
        <div className="w-full max-w-md space-y-8 animate-fade-in">

          {/* Mobile logo */}
          <Link to="/" className="flex md:hidden items-center gap-3 justify-center mb-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#1d4ed8,#4338ca)' }}>
              <span className="text-white font-extrabold">C</span>
            </div>
            <span className="font-extrabold text-gray-900">Career<span className="text-blue-600">Link</span></span>
          </Link>

          <div className="text-center md:text-left">
            <h2 className="text-4xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-500 mt-2 text-sm">Sign in to access your dashboard.</p>
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

            {/* Email */}
            <div>
              <label className="form-label">Email Address</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  type="email" name="email" value={formData.email} onChange={handleChange}
                  placeholder="name@company.com"
                  className="form-input !pl-11"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="form-label mb-0">Password</label>
                <Link to="/forgot-password" className="text-xs text-blue-600 font-semibold hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type={showPw ? 'text' : 'password'} name="password" value={formData.password}
                  onChange={handleChange} placeholder="Enter your password"
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

            {/* Submit */}
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-sm">
              {loading
                ? <><svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg> Signing In…</>
                : 'Sign In →'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 font-bold hover:underline">Create one free →</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
