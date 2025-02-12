import api from "../Api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateUserForm = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    api.post('/users', { fullName, email, password, role })
      .then((response) => {
        alert("Usuario creado exitosamente!");
        navigate('/');
      })
      .catch((error) => {
        console.error("Error al crear usuario", error);
        alert("Hubo un error al crear el usuario.");
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Crear Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="fullName" className="form-label">Nombre completo</label>
          <input
            id="fullName"
            type="text"
            className="form-control"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            aria-describedby="fullNameHelp"
          />
          <div id="fullNameHelp" className="form-text">Introduce el nombre completo del usuario.</div>
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Correo electrónico</label>
          <input
            id="email"
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-describedby="emailHelp"
          />
          <div id="emailHelp" className="form-text">Asegúrate de que el correo sea válido.</div>
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Contraseña</label>
          <input
            id="password"
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-describedby="passwordHelp"
          />
          <div id="passwordHelp" className="form-text">La contraseña debe tener al menos 8 caracteres.</div>
        </div>

        <div className="mb-3">
          <label htmlFor="role" className="form-label">Rol</label>
          <select
            id="role"
            className="form-control"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="member">Miembro</option>
            <option value="trainer">Entrenador</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <div className="d-flex justify-content-between">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate('/')}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
          >
            Crear Usuario
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUserForm;
