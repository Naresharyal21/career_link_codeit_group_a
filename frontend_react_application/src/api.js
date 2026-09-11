import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (credentials) => api.post('/accounts/login/', credentials);
export const logout = (refresh_token) => api.post('/accounts/logout/', { refresh: refresh_token });
export const getApplications = () => api.get('/applications/');
export const createApplication = (data) => api.post('/applications/', data);

export default api;
