import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import jwtDecode from 'jwt-decode';
import api from '../Api';
import { logout } from "./Logout";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const ClientDashboard = () => {
    const navigate = useNavigate();
    const [routine, setRoutine] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);
        api.get(`/users/${decoded.id}/routine`) // Ajusta la URL según tu API
            .then(response => {
                setRoutine(response.data);
                setLoading(false);
                console.log(response.data);
            })
            .catch(error => console.error("Error al cargar la rutina:", error));
    }, []);

    if (loading) {
        return <div className="text-center mt-5"><h4>Cargando rutina...</h4></div>;
    }

    return (
        <div className="container-fluid">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
                <div className="container">
                    <button className="btn btn-secondary" onClick={() => navigate('/perfil')}>Perfil</button>
                    <button className="btn btn-danger ms-auto" onClick={() => logout(navigate)}>Cerrar Sesión</button>
                </div>
            </nav>

            {/* Rutina */}
            <div className="row mb-4">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <h5>Mi Rutina</h5>
                        </div>
                        <div className="card-body">
                            {routine ? (
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Ejercicio</th>
                                            <th>Repeticiones</th>
                                            <th>Series</th>
                                            <th>Descanso</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {routine.exercisesByDay.map(exercise => (
                                            <tr key={exercise.id}>
                                                <td>{exercise.name}</td>
                                                <td>{exercise.repetitions}</td>
                                                <td>{exercise.series}</td>
                                                <td>{exercise.rest}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No tienes una rutina asignada aún.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="text-center py-3 bg-light">
                <small>&copy; 2025 Gimnasio Pura Esencia</small>
            </footer>
        </div>
    );
};

export default ClientDashboard;