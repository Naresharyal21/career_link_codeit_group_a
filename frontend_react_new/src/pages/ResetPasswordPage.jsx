import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const emailParam = queryParams.get('email') || '';

  const [email, setEmail] = useState(emailParam);
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const response = await axios.post('http://localhost:8000/api/v1/accounts/reset/password/', {
        email: email,
        new_password: newPassword
      });
      setMessage(response.data.message || 'Password reset successfully!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm max-w-md w-full space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
          <p className="text-gray-500 mt-2">Enter your new password below.</p>
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
          <div>
            <label className="block text-sm font-semibold text-gray-700">New Password</label>
            <input 
              type="password" 
              placeholder="Min 8 characters"
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
              required 
            />
          </div>
          <button type="submit" className="w-full py-3 px-4 rounded-lg text-white bg-blue-700 hover:bg-blue-800 font-bold text-lg transition">
            Reset Password
          </button>
        </form>

        <div className="text-center text-sm">
          <Link to="/login" className="text-blue-700 font-semibold hover:underline">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
