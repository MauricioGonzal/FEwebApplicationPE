import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import jwtDecode from 'jwt-decode';
import api from '../Api'; 
import { logout } from "./Logout";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const TrainerDashboard = () => {
    const navigate = useNavigate();

    const [trainerData, setTrainerData] = useState({});
    const [students, setStudents] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exercises, setExercises] = useState([]);
    const [selectedExercises, setSelectedExercises] = useState([]);
    const [routineName, setRoutineName] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);
        api.get('/users/' + decoded.sub) // Cambia la URL según tu API
            .then((response) => {
                setTrainerData(response.data);
                setLoading(false);
            })
            .catch((error) => console.error("Error al cargar los datos:", error));
    }, []);

    useEffect(() => {
        // Simulación: Fetch de datos del entrenador
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);
        //console.log(decoded);
        api.get('/users/' + decoded.id + '/clients') // Cambia la URL según tu API
            .then((response) => {
                setStudents(response.data);
                setLoading(false);
            })
            .catch((error) => console.error("Error al cargar los datos:", error));
    }, []);

    useEffect(() => {
        api.get('/users/getAllByRole/client') // Cambia la URL según tu API
            .then((response) => {
                console.log(response);
                setAllStudents(response.data);
                setLoading(false);
            })
            .catch((error) => console.error("Error al cargar los datos:", error));
    }, []);


    useEffect(() => {
        api.get('/exercises') // Cambia la URL según tu API
            .then((response) => {
                setExercises(response.data);
            })
            .catch((error) => console.error("Error al cargar los ejercicios:", error));
    }, []);

    const handleExerciseSelection = (exercise) => {
        setSelectedExercises((prevSelected) => {
            if (prevSelected.includes(exercise)) {
                return prevSelected.filter((e) => e.id !== exercise.id);
            } else {
                return [...prevSelected, exercise];
            }
        });
    };

    const handleRoutineName = (event) => {
        setRoutineName(event.target.value);
      };

    const handleRoutineSubmit = (event) => {
        event.preventDefault();
        console.log("Ejercicios seleccionados:", selectedExercises);
        // Aquí puedes enviar los datos de la rutina a la API
        var aux = [];

        selectedExercises.forEach(element => {
            aux.push(element.id);
        }); 

        api.post('/routines/create', {
            name: routineName,
            exerciseIds: aux
          });
    };

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
                            <li><button className="dropdown-item" data-bs-toggle="modal" data-bs-target="#createRoutineModal">Crear Nueva Rutina</button></li>
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
                                    setStudents(trainerData.students.filter(student =>
                                        student.name.toLowerCase().includes(query)
                                    ));
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
                                    {students.map((student) => (
                                        <tr key={student.id}>
                                            <td>{student.firstName} {student.lastName}</td>
                                            <td>
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => navigate(`/edit-routine/${student.id}`)}
                                                >
                                                    Ver Rutina
                                                </button>
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
                                    setAllStudents(trainerData.students.filter(student =>
                                        student.name.toLowerCase().includes(query)
                                    ));
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
                                    {allStudents.map((student) => (
                                        <tr key={student.id}>
                                            <td>{student.firstName} {student.lastName}</td>
                                            <td>
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => navigate(`/edit-routine/${student.id}`)}
                                                >
                                                    Ver Rutina
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="createRoutineModal" tabIndex="-1" aria-labelledby="createRoutineModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="createRoutineModalLabel">Crear Nueva Rutina</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                        </div>
                        <div className="modal-body">
                        <form onSubmit={handleRoutineSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Nombre de la Rutina</label>
                                    <input type="text" value={routineName} onChange={handleRoutineName} className="form-control" required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Seleccionar Ejercicios</label>
                                    <ul className="list-group">
                                        {exercises.map((exercise) => (
                                            <li key={exercise.id} className="list-group-item">
                                                <input 
                                                    type="checkbox" 
                                                    className="form-check-input me-2"
                                                    onChange={() => handleExerciseSelection(exercise)}
                                                />
                                                {exercise.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Guardar Rutina</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="text-center py-3 bg-light">
                <small>© 2025 Pura Esencia. Todos los derechos reservados.</small>
            </footer>
        </div>
    );
};

export default TrainerDashboard;