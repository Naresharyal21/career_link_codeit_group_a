import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // The backend LoginSerializer expects 'email' and 'password' in the request payload
      const response = await axios.post('http://localhost:8000/api/v1/accounts/login/', formData);
      console.log('Login successful:', response.data);
      localStorage.setItem('access_token', response.data.access);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.data?.email && err.response.data.email.includes("Please verify your email before logging in")) {
        // Redirect to OTP verification page if email is unverified
        navigate('/verify-otp?email=' + encodeURIComponent(formData.email) + '&purpose=emv');
        return;
      }
      
      const errMsg = err.response?.data?.detail || err.response?.data?.error || 'Invalid email or password';
      setError(errMsg);
      console.error("Login error details:", err.response?.data);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left side: Hero/Branding */}
      <div className="hidden md:flex md:w-1/2 bg-blue-900 p-12 items-center justify-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-800 opacity-50"></div>
        <div className="relative z-10 max-w-md">
          <h1 className="text-5xl font-extrabold mb-6 leading-tight">Your Career, Elevated.</h1>
          <p className="text-xl text-blue-100">
            Connect with top employers and discover opportunities tailored to your skills.
          </p>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-bold text-gray-900">Sign in</h2>
            <p className="text-gray-500 mt-2">Enter your credentials to access your dashboard.</p>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@company.com"
                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>
            <div>
              <div className="flex justify-between items-center">
                <label className="block text-sm font-semibold text-gray-700">Password</label>
                <Link to="/forgot-password" className="text-sm text-blue-700 font-semibold hover:underline">Forgot Password?</Link>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 rounded-lg text-white bg-blue-700 hover:bg-blue-800 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Sign In
            </button>
          </form>
          <p className="text-center text-gray-600 mt-6 text-sm">
            Don't have an account? <Link to="/signup" className="text-blue-700 font-semibold hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
