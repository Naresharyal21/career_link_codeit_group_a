import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const SignupPage = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'js' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:8000/api/v1/accounts/register/', formData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Please check your inputs.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      <div className="hidden md:flex md:w-1/2 bg-blue-900 p-12 items-center justify-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-800 opacity-50"></div>
        <div className="relative z-10 max-w-md">
          <h1 className="text-5xl font-extrabold mb-6 leading-tight">Join Career Link Today</h1>
          <p className="text-xl text-blue-100">Create your account to start your journey.</p>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-4xl font-bold text-gray-900">Create Account</h2>
          
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-200">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Username</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Role</label>
              <select name="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="js">Job Seeker</option>
                <option value="ep">Employer</option>
              </select>
            </div>
            <button type="submit" className="w-full py-3 px-4 rounded-lg text-white bg-blue-700 hover:bg-blue-800 font-bold text-lg transition">Sign Up</button>
          </form>
          <p className="text-center text-gray-600 mt-4 text-sm">Already have an account? <Link to="/login" className="text-blue-700 font-semibold hover:underline">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
