import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";


const UserTable = ({ users, handleDeleteUser }) => {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const filteredUsers = users.filter(user =>
        user.fullName.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );



    return (
        <div>
            <input
                type="text"
                className="form-control mb-3"
                placeholder="Buscar usuario por nombre o correo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {search.length > 0 && filteredUsers.length > 0 && (
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
                        {filteredUsers.map((user) => {
                            return (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.fullName}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        {user.healthRecord === null && (
                                            <button
                                                className="btn btn-success btn-sm"
                                                onClick={() => navigate('/create-health-record/' + user.id)}
                                            >
                                                Cargar Ficha de salud
                                            </button>
                                        )}
                                                                              <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDeleteUser(user.id)}
                                      >
                                        <FaTimes className="me-1" /> Eliminar
                                      </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}

            {search.length > 0 && filteredUsers.length === 0 && (
                <p className="text-center text-muted">No se encontraron usuarios.</p>
            )}
        </div>
    );
};

export default UserTable;
