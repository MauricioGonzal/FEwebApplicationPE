
import api from "../Api"; 
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "./Logout";


const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

  useEffect(() => {
    api.get('/users/getAllByRole/client')
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => console.error("Error al obtener usuarios", error));
  }, []);

  return (
    <div>
      {/* Barra de navegación */}
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
                <div className="container">
                    <div className="dropdown ms-auto">
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                        <img src="./puraesencia.png" alt="Pura Esencia" width="30" height="30" className="d-inline-block align-top" />
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <li><button className="dropdown-item" onClick={() => navigate('/create-user')}>Crear Usuario</button></li>
                            <li><button className="dropdown-item text-danger" onClick={() => logout(navigate)}>Cerrar Sesión</button></li>
                        </ul>
                    </div>
                </div>
            </nav>

      {/* Panel de administración */}
      <div className="container mt-4">
        <h2 className="text-center mb-4">Panel de Administración</h2>
        <h4>Usuarios del Gimnasio</h4>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Nombre</th>
              <th scope="col">Correo</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button className="btn btn-danger btn-sm">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
    </div>
  );
};

export default AdminDashboard;