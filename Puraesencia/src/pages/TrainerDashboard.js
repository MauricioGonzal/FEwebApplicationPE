import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import jwtDecode from 'jwt-decode';
import api from '../Api'; 

const TrainerDashboard = () => {
    const [trainerData, setTrainerData] = useState({});
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulación: Fetch de datos del entrenador
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);
        api.get('/users/' + decoded.sub) // Cambia la URL según tu API
            .then((response) => {
                console.log(response.data);
                setTrainerData(response.data);
                //setStudents(response.data.students);
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
                        <img src="/logo.png" alt="Pura Esencia" width="30" height="30" className="d-inline-block align-top" />
                        Trainer
                    
                    <div className="ml-auto">
                        <span className="navbar-text mr-3">
                            Bienvenido, {trainerData.firstName}
                        </span>
                        <button className="btn btn-danger btn-sm">Cerrar Sesión</button>
                    </div>
                </div>
            </nav>

            {/* Datos personales */}
            <div className="row mb-4">
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <h5>Datos Personales</h5>
                        </div>
                        <div className="card-body">
                            <p><strong>Nombre:</strong> {trainerData.firstName} {trainerData.lastName}</p>
                            <p><strong>Email:</strong> {trainerData.email}</p>
                        </div>
                    </div>
                </div>

                {/* Opcional: Estadísticas */}
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header bg-info text-white">
                            <h5>Estadísticas del Entrenador</h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-4 text-center">
                                    <h3>{students.length}</h3>
                                    <p>Alumnos</p>
                                </div>
                                <div className="col-md-4 text-center">
                                    <h3>{trainerData.totalRoutines}</h3>
                                    <p>Rutinas Creadas</p>
                                </div>
                                <div className="col-md-4 text-center">
                                    <h3>{trainerData.experienceYears}</h3>
                                    <p>Años de Experiencia</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lista de alumnos */}
            <div className="row mb-4">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
                            <h5>Lista de Alumnos</h5>
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
                                        <th>Email</th>
                                        <th>Teléfono</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((student) => (
                                        <tr key={student.id}>
                                            <td>{student.name}</td>
                                            <td>{student.email}</td>
                                            <td>{student.phone}</td>
                                            <td>
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => alert(`Mostrando rutina para ${student.name}`)}
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

            {/* Footer */}
            <footer className="text-center py-3 bg-light">
                <small>© 2025 Gimnasio Dashboard. Todos los derechos reservados.</small>
            </footer>
        </div>
    );
};

export default TrainerDashboard;