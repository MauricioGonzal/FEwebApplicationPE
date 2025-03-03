import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; // Cambia esto según tu backend

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Esto es importante si tu backend requiere credenciales
});

// Interceptor para agregar el token a cada solicitud
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;