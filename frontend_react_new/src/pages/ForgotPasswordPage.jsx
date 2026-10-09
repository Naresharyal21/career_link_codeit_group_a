import { useState } from 'react';
import apiClient from '../api';
import { useNavigate, Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const response = await apiClient.post('/accounts/forgot/password/', { email });
      setMessage(response.data.message || 'OTP code sent successfully!');
      setTimeout(() => {
        navigate('/verify-otp?email=' + encodeURIComponent(email) + '&purpose=prv');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to request password reset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 hero-gradient relative overflow-hidden">
      
      {/* Decorative Blobs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />
      
      <div className="w-full max-w-md animate-fade-in-up relative z-10">
        
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl glass-card flex items-center justify-center">
              <span className="text-white font-extrabold text-lg">C</span>
            </div>
            <span className="font-extrabold text-xl text-white">Career<span className="text-blue-300">Link</span></span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">Forgot Password</h2>
            <p className="text-gray-500 mt-2 text-sm">Enter your registered email to receive a password reset code.</p>
          </div>

          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 p-4 rounded-xl mb-6 animate-fade-in">
              <span className="text-red-600 font-bold shrink-0 mt-0.5">!</span>
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}
          {message && (
            <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 p-4 rounded-xl mb-6 animate-fade-in">
              <span className="text-emerald-600 font-bold shrink-0 mt-0.5">✓</span>
              <p className="text-sm font-medium text-emerald-800">{message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="form-label">Email Address</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="form-input !pl-11" required />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 mt-2">
              {loading ? 'Sending Request...' : 'Send Reset Code'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link to="/login" className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
