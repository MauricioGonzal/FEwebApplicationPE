import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import jwtDecode from 'jwt-decode';
import api from '../Api'; 
import { logout } from "./Logout";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const TrainerDashboard = () => {
    const navigate = useNavigate();

    //const [trainerData, setTrainerData] = useState({});
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]); // Nueva variable para la búsqueda

    const [allStudents, setAllStudents] = useState([]);
    const [filteredAllStudents, setFilteredAllStudents] = useState([]); // Nueva variable para la búsqueda

    const [loading, setLoading] = useState(true);

    /*useEffect(() => {
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);
        api.get('/users/' + decoded.sub) // Cambia la URL según tu API
            .then((response) => {
                setTrainerData(response.data);
                setLoading(false);
            })
            .catch((error) => console.error("Error al cargar los datos:", error));
    }, []);*/

    useEffect(() => {
        // Simulación: Fetch de datos del entrenador
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);
        api.get('/users/' + decoded.id + '/clients') // Cambia la URL según tu API
            .then((response) => {
                setStudents(response.data);
                setFilteredStudents(response.data); // Inicializa la búsqueda con todos los datos
                setLoading(false);
            })
            .catch((error) => console.error("Error al cargar los datos:", error));
    }, []);

    useEffect(() => {
        api.get('/users/getAllByRole/client') // Cambia la URL según tu API
            .then((response) => {
                setAllStudents(response.data);
                setFilteredAllStudents(response.data); // Inicializa la búsqueda con todos los datos
                setLoading(false);
            })
            .catch((error) => console.error("Error al cargar los datos:", error));
    }, []);

    if (loading) {
        return <div className="text-center mt-5"><h4>Cargando datos...</h4></div>;
    }

    return (
        <div className="container-fluid">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
                <div className="container">
                    <div className="dropdown ms-auto">
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                        <img src="./puraesencia.png" alt="Pura Esencia" width="30" height="30" className="d-inline-block align-top" />
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <li><button className="dropdown-item" onClick={() => navigate('/perfil')}>Perfil</button></li>
                            <li><button className="dropdown-item" onClick={() => navigate('/create-routine/0')}>Crear Nueva Rutina</button></li>
                            <li><button className="dropdown-item" onClick={() => navigate('/create-exercise')}>Crear Ejercicio</button></li>
                            <li><button className="dropdown-item text-danger" onClick={() => logout(navigate)}>Cerrar Sesión</button></li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Mis alumnos */}
            <div className="row mb-4">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
                            <h5>Mis Alumnos</h5>
                            <input
                                type="text"
                                className="form-control form-control-sm w-25"
                                placeholder="Buscar alumno..."
                                onChange={(e) => {
                                    const query = e.target.value.toLowerCase();
                                    if (query === "") {
                                        setFilteredStudents([...students]); // Restaurar lista completa
                                    } else {
                                        setFilteredStudents(students.filter(student =>
                                            student.fullName.toLowerCase().includes(query)
                                        ));
                                    }
                                }}
                            />
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
                                    {filteredStudents.map((student) => (
                                        <tr key={student.id}>
                                        <td>{student.fullName}</td>
                                        <td>
                                        {student.routine !== null ? (
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => navigate(`/edit-routine/${student.id}`)}
                                            >
                                                Ver Rutina
                                            </button>
                                        ) : (
                                            <>
                                            <button
                                                className="btn btn-success btn-sm me-2"
                                                onClick={() => navigate(`/assign-routine/${student.id}`)}
                                            >
                                                Asignar Rutina
                                            </button>
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => console.log(`Opción extra para ${student.fullName}`)}
                                            >
                                                Crear Rutina Personalizada
                                            </button>
                                            </> // Texto alternativo si no tiene rutina
                                            
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
            {/* Lista de alumnos */}
            <div className="row mb-4">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
                            <h5>Lista de alumnos</h5>
                            <input
                                type="text"
                                className="form-control form-control-sm w-25"
                                placeholder="Buscar alumno..."
                                onChange={(e) => {
                                    const query = e.target.value.toLowerCase();
                                    if (query === "") {
                                        setFilteredAllStudents([...allStudents]); // Restaurar lista completa
                                    } else {
                                        setFilteredAllStudents(allStudents.filter(student =>
                                            student.fullName.toLowerCase().includes(query)
                                        ));
                                    }
                                }}
                            />
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
                                    {filteredAllStudents.map((student) => (
                                        <tr key={student.id}>
                                            <td>{student.fullName}</td>
                                            <td>
                                            {student.routine !== null ? (
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => navigate(`/edit-routine/${student.id}`)}
                                                >
                                                    Ver Rutina
                                                </button>
                                            ) : (
                                                <>
                                                <button
                                                    className="btn btn-success btn-sm me-2"
                                                    onClick={() => navigate(`/assign-routine/${student.id}`)}
                                                >
                                                    Asignar Rutina
                                                </button>
                                                <button
                                                    className="btn btn-secondary btn-sm"
                                                    onClick={() => navigate(`/create-routine/1/${student.id}`)}
                                                >
                                                    Crear Rutina Personalizada
                                                </button>
                                                </> // Texto alternativo si no tiene rutina
                                                
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
            {/* Footer */}
            <footer className="text-center py-3 bg-light">
                <small></small>
            </footer>
        </div>
    );
};

export default TrainerDashboard;