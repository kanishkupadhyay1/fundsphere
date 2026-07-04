import axios from 'axios';

export const normalizeApiBaseUrl = (url) => {
  const baseUrl = (url || '').replace(/\/+$/, '');
  if (!baseUrl) return '/api';
  return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
};

const api = axios.create({
  baseURL: normalizeApiBaseUrl(import.meta.env.VITE_API_URL),
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fundsphere_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
