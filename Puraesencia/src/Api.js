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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error);
      if (error.response && error.response.status === 401) {
          localStorage.removeItem("token"); // Elimina el token inválido
          window.location.href = "/login"; // Redirige al login
      }
      return Promise.reject(error);
  }
);

export default api;