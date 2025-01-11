import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

      console.log(localStorage.getItem('token'));
      alert('Login exitoso!');
      navigate('/'); // Redirige a la página deseada
    } catch (error) {
      console.error('Error de autenticación:', error);
      alert('Usuario o contraseña incorrectos.');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <label>
        Usuario:
        <input 
          type="text" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
      </label>
      <br />
      <label>
        Contraseña:
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
      </label>
      <br />
      <button type="submit">Iniciar sesión</button>
    </form>
  );
};

export default Login;
