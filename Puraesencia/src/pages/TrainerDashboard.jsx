import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import jwtDecode from "jwt-decode";
import api from "../Api";
import { logout } from "./Logout";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { FaUser, FaSignOutAlt, FaSearch, FaPlus, FaClipboardList } from "react-icons/fa";

const TrainerDashboard = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [filteredAllStudents, setFilteredAllStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        api.get(`/users/${decoded.id}/clients`)
            .then((response) => {
                setStudents(response.data);
                setFilteredStudents(response.data);
                setLoading(false);
                console.log(decoded);
            })
            .catch((error) => console.error("Error al cargar los datos:", error));
    }, []);

    useEffect(() => {
        api.get("/users/getAllByRole/client")
            .then((response) => {
                setAllStudents(response.data);
                setFilteredAllStudents(response.data);
                setLoading(false);
            })
            .catch((error) => console.error("Error al cargar los datos:", error));
    }, []);

    const handleSearch = (e, setFiltered, data) => {
        const query = e.target.value.toLowerCase();
        setFiltered(query ? data.filter(student => student.fullName.toLowerCase().includes(query)) : [...data]);
    };

    if (loading) {
        return <div className="text-center mt-5"><h4>Cargando datos...</h4></div>;
    }

    return (
        <div className="container-fluid">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
            <div className="container d-flex justify-content-between">
                <a className="navbar-brand fw-bold" href="/">
                        <img src="./puraesencia.png" alt="Logo" width="40" height="40" className="me-2" />
                        Trainer Panel
                    </a>                    <div className="dropdown">
                        <button className="btn btn-light dropdown-toggle" data-bs-toggle="dropdown">
                            <FaUser />
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li><button className="dropdown-item" onClick={() => navigate("/create-routine/0")}>Crear Nueva Rutina</button></li>
                            <li><button className="dropdown-item" onClick={() => navigate("/create-exercise")}>Crear Ejercicio</button></li>
                            <li><button className="dropdown-item" onClick={() => navigate("/changepass")}>Cambiar Contraseña</button></li>
                            <li><button className="dropdown-item text-danger" onClick={() => logout(navigate)}><FaSignOutAlt /> Cerrar Sesión</button></li>
                        </ul>
                    </div>
                </div>
            </nav>

            {[{ title: "Mis Alumnos", data: filteredStudents, setData: setFilteredStudents, allData: students },
              { title: "Lista de Alumnos", data: filteredAllStudents, setData: setFilteredAllStudents, allData: allStudents }]
              .map((section, index) => (
                <div key={index} className="row my-4">
                    <div className="col-md-12">
                        <div className="card shadow">
                            <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
                                <h5>{section.title}</h5>
                                <div className="input-group w-25">
                                    <span className="input-group-text"><FaSearch /></span>
                                    <input type="text" className="form-control" placeholder="Buscar..." onChange={(e) => handleSearch(e, section.setData, section.allData)} />
                                </div>
                            </div>
                            <div className="card-body">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {section.data.map(student => (
                                            <tr key={student.id}>
                                                <td>{student.fullName}</td>
                                                <td>
                                                    {student.routine ? (
                                                        <button className="btn btn-primary btn-sm me-2" onClick={() => navigate(`/edit-routine/${student.routine.id}/${student.id}`)}>
                                                            <FaClipboardList /> Ver Rutina
                                                        </button>
                                                    ) : (
                                                        <>
                                                            <button className="btn btn-success btn-sm me-2" onClick={() => navigate(`/assign-routine/${student.id}`)}>
                                                                <FaPlus /> Asignar Rutina
                                                            </button>
                                                            <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/create-routine/1/${student.id}`)}>
                                                                <FaClipboardList /> Crear Rutina Personalizada
                                                            </button>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <footer className="text-center py-3 bg-light mt-4">
                <small>&copy; 2025 Pura Esencia - Todos los derechos reservados.</small>
            </footer>
        </div>
    );
};

export default TrainerDashboard;