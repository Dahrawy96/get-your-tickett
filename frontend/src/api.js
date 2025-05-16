// src/api.js
import axios from 'axios';

// Create axios instance with your backend base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1', // change if your backend URL differs
});

// Add a request interceptor to include token if available
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (or you can later change to get from AuthContext)
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
