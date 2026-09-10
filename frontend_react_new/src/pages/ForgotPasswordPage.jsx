import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const response = await axios.post('http://localhost:8000/api/v1/accounts/forgot/password/', { email });
      setMessage(response.data.message || 'OTP code sent successfully!');
      setTimeout(() => {
        navigate('/verify-otp?email=' + encodeURIComponent(email) + '&purpose=prv');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to request password reset.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm max-w-md w-full space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Forgot Password</h2>
          <p className="text-gray-500 mt-2">Enter your registered email to receive a password reset code.</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-200">{error}</div>}
        {message && <div className="bg-green-50 text-green-600 p-4 rounded-lg text-sm border border-green-200">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
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
          <button type="submit" className="w-full py-3 px-4 rounded-lg text-white bg-blue-700 hover:bg-blue-800 font-bold text-lg transition">
            Request Reset Code
          </button>
        </form>

        <div className="text-center text-sm">
          <Link to="/login" className="text-blue-700 font-semibold hover:underline">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
