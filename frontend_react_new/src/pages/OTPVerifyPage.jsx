import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const OTPVerifyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const emailParam = queryParams.get('email') || '';
  const purposeParam = queryParams.get('purpose') || 'emv';

  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState('');
  const [purpose] = useState(purposeParam);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/v1/accounts/verify/otp/', {
        email: email,
        otp: otp,
        purpose: purpose
      });
      setMessage(response.data.message || 'Verification successful!');
      if (purpose === 'emv') {
        setTimeout(() => navigate('/login'), 2000);
      } else if (purpose === 'prv') {
        setTimeout(() => navigate('/reset-password?email=' + encodeURIComponent(email)), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed. Please check your OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setMessage('');
    setResendLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/v1/accounts/verify/resend/otp/', {
        email: email
      });
      setMessage(response.data.message || 'Verification code resent successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend code.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 hero-gradient relative overflow-hidden">
      
      {/* Decorative Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />
      
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
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">Verify Your Email</h2>
            <p className="text-gray-500 mt-2 text-sm">Enter the 6-digit code sent to your email.</p>
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

          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <label className="form-label">Email Address</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input !pl-11" required />
              </div>
            </div>
            <div>
              <label className="form-label text-center block">Verification Code</label>
              <input type="text" placeholder="• • • • • •" value={otp} onChange={(e) => setOtp(e.target.value)} className="form-input text-center text-2xl tracking-[0.5em] font-extrabold" required maxLength="6" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 mt-2">
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <button onClick={handleResend} disabled={resendLoading} className="text-sm font-bold text-blue-600 hover:text-blue-700 transition">
              {resendLoading ? 'Sending...' : 'Resend Code'}
            </button>
            <div className="block">
              <Link to="/login" className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerifyPage;
