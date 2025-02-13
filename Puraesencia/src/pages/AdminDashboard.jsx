import api from "../Api"; 
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "./Logout";
import { FaUserPlus, FaSignOutAlt, FaTrash } from "react-icons/fa";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/users/getAllByRole/client')
            .then((response) => setUsers(response.data))
            .catch((error) => console.error("Error al obtener usuarios", error));
    }, []);

    return (
        <div className="bg-light min-vh-100">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
                <div className="container">
                    <a className="navbar-brand fw-bold" href="/">
                        <img src="./puraesencia.png" alt="Logo" width="40" height="40" className="me-2" />
                        Admin Panel
                    </a>
                    <div className="ms-auto">
                        <button className="btn btn-outline-light me-2" onClick={() => navigate('/create-user')}>
                            <FaUserPlus className="me-1" /> Crear Usuario
                        </button>
                        <button className="btn btn-danger" onClick={() => logout(navigate)}>
                            <FaSignOutAlt className="me-1" /> Cerrar Sesión
                        </button>
                    </div>
                </div>
            </nav>

            {/* Panel de administración */}
            <div className="container mt-4">
                <h2 className="text-center fw-bold mb-4 text-dark">Usuarios Registrados</h2>

                <div className="table-responsive">
                    <table className="table table-hover table-bordered shadow-sm">
                        <thead className="table-dark text-center">
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.fullName}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <button className="btn btn-danger btn-sm">
                                            <FaTrash className="me-1" /> Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
