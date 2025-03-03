import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUser, FaLock } from "react-icons/fa";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Estado para el mensaje de error
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar error anterior

    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data);
      navigate("/");
    } catch (error) {
      console.error("Error de autenticación:", error);
      setError("Usuario o contraseña incorrectos."); // Actualizar mensaje de error
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
    >
      <div className="card p-4 shadow-lg rounded-4 border-0" style={{ width: "100%", maxWidth: "400px" }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-3 text-dark fw-bold">Bienvenido 👋</h2>
          <p className="text-center text-muted">Inicia sesión para continuar</p>

          {error && <div className="alert alert-danger text-center">{error}</div>} {/* Mensaje de error */}

          <form onSubmit={handleLogin}>
            <div className="mb-3 input-group">
              <span className="input-group-text bg-primary text-white">
                <FaUser />
              </span>
              <input
                type="text"
                className="form-control shadow-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo electrónico"
                required
              />
            </div>

            <div className="mb-3 input-group">
              <span className="input-group-text bg-primary text-white">
                <FaLock />
              </span>
              <input
                type="password"
                className="form-control shadow-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100 fw-bold shadow-sm">
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
