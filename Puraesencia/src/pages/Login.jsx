import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook para redirigir

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Realiza una solicitud POST para autenticar al usuario
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email: email,
        password: password
      });

      // Guarda el token JWT recibido en el almacenamiento local
      localStorage.setItem('token', response.data);
      navigate('/'); // Redirige a la página deseada
    } catch (error) {
      console.error('Error de autenticación:', error);
      alert('Usuario o contraseña incorrectos.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="card-title text-center mb-4">Iniciar sesión</h2>
        
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Usuario:</label>
            <input
              id="email"
              type="text"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Introduce tu correo"
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña:</label>
            <input
              id="password"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Introduce tu contraseña"
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary w-100">Iniciar sesión</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
