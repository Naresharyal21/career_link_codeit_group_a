import { useState, useEffect } from 'react';
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
  const [purpose, setPurpose] = useState(purposeParam);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
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
    }
  };

  const handleResend = async () => {
    setError('');
    setMessage('');
    try {
      const response = await axios.post('http://localhost:8000/api/v1/accounts/verify/resend/otp/', {
        email: email
      });
      setMessage(response.data.message || 'Verification code resent successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend code.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm max-w-md w-full space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Verify Your Email</h2>
          <p className="text-gray-500 mt-2">Enter the verification code sent to your email.</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-200">{error}</div>}
        {message && <div className="bg-green-50 text-green-600 p-4 rounded-lg text-sm border border-green-200">{message}</div>}

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Verification Code (OTP)</label>
            <input 
              type="text" 
              placeholder="Enter OTP" 
              value={otp} 
              onChange={(e) => setOtp(e.target.value)} 
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-center text-xl font-bold tracking-widest" 
              required 
            />
          </div>
          <button type="submit" className="w-full py-3 px-4 rounded-lg text-white bg-blue-700 hover:bg-blue-800 font-bold text-lg transition">
            Verify Code
          </button>
        </form>

        <div className="text-center space-y-2 text-sm">
          <button onClick={handleResend} className="text-blue-700 font-semibold hover:underline">
            Resend Verification Code
          </button>
          <div>
            <Link to="/login" className="text-gray-500 hover:text-gray-700 font-semibold">Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerifyPage;
