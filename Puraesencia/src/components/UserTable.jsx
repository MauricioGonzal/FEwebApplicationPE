import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import api from "../Api";
import { toast } from 'react-toastify';



const UserTable = () => {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);


    useEffect(() => {
        api.get('/users/getAllByRole/clients')
            .then((response) =>{ 
                setUsers(response.data)}
            )
            .catch((error) => console.error("Error al obtener usuarios", error));
    }, []);

    const filteredUsers = users.filter(user =>
        user.fullName.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    
    const handleDeleteUser = (userId) => {
        const confirmDelete = window.confirm("¿Seguro que quiere eliminar este usuario?");
        if (confirmDelete) {
            api.delete(`/users/${userId}`)
                .then(() => {
                    setUsers(users.filter(user => user.id !== userId));
                    toast.success("Usuario eliminado correctamente", {
                        position: "top-right", // Ahora directamente como string
                      });                
                    })
                .catch((error) => console.error("Error al eliminar usuario", error));
        }
    };


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
