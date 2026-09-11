import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      sessionStorage.setItem('access_token', response.data.token.access);
      sessionStorage.setItem('refresh_token', response.data.token.refresh);
      sessionStorage.setItem('role', response.data.user.role);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-on-background">
      <form onSubmit={handleSubmit} className="p-8 bg-surface-container-lowest rounded-lg shadow-md border border-surface-variant">
        <h2 className="text-headline-md mb-6">Sign In</h2>
        <input 
          type="email" 
          placeholder="Email" 
          className="block w-full p-3 mb-4 border border-outline rounded-md" 
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="block w-full p-3 mb-4 border border-outline rounded-md" 
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
          required 
        />
        <button type="submit" className="w-full bg-primary text-on-primary p-3 rounded-md font-label-md">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
