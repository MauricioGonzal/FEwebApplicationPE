import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import jwtDecode from 'jwt-decode';
import api from '../Api';
import { logout } from "./Logout";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { FaUser } from "react-icons/fa";

const ClientDashboard = () => {
    const daysOfWeek = [
        { index: 1, name: "Lunes" }, { index: 2, name: "Martes" }, { index: 3, name: "Miércoles" },
        { index: 4, name: "Jueves" }, { index: 5, name: "Viernes" }, { index: 6, name: "Sábado" }, { index: 7, name: "Domingo" }
    ];

    const navigate = useNavigate();
    const [routine, setRoutine] = useState(null);
    const [loading, setLoading] = useState(true);
    const [exercises, setExercises] = useState([]);
    const [sessionData, setSessionData] = useState({}); // Estado individual por ejercicio
  

    useEffect(() => {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
        api.get(`/users/${decoded.id}/routine`)
            .then(response => {
                setRoutine(response.data);
                setLoading(false);
            })
            .catch(error => console.error("Error al cargar la rutina:", error));
    }, []);

    useEffect(() => {
        api.get("/exercises")
            .then(response => {
                setExercises(response.data);
            })
            .catch(error => {
                console.error("Error al obtener los ejercicios", error);
            });
    }, []);

    // Manejar cambios en los inputs de peso, repeticiones y comentarios
    const handleInputChange = (exerciseId, field, value) => {
      console.log(exerciseId);
      console.log(field);
      console.log(value);
        setSessionData(prevState => ({
            ...prevState,
            [exerciseId]: {
                ...prevState[exerciseId],
                [field]: value
            }
        }));
    };

    const saveWorkoutSession = () => {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
  
      // Filtrar solo los ejercicios donde el usuario ingresó datos
      const logs = Object.entries(sessionData).map(([exerciseId, data]) => {
          console.log(exerciseId, data);  // Verifica los datos para cada ejercicio
          return {
              exerciseId: parseInt(exerciseId), // Asegúrate de que exerciseId sea un número válido
              repetitions: parseInt(data.reps),
              weight: parseFloat(data.weight),
              notes: data.notes || ""  // Asegúrate de que se esté capturando la nota
          };
      }).filter(log => log.repetitions && log.weight);  // Filtra solo los ejercicios con datos completos
  
      if (logs.length === 0) {
          alert("Debes ingresar al menos un ejercicio con peso y repeticiones.");
          return;
      }
  
      const workoutSession = {
          userId: decoded.id,
          date: new Date().toISOString(),
          logs: logs
      };
  
      api.post("/workout-sessions", workoutSession)
          .then(() => {
              alert("Sesión guardada correctamente");
              setSessionData({});
          })
          .catch(error => console.error("Error al guardar la sesión", error));
  };

    if (loading) {
        return <div className="text-center mt-5"><h4>Cargando rutina...</h4></div>;
    }

    return (
        <div className="container-fluid">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
                <div className="container d-flex justify-content-between">
                    <a className="navbar-brand fw-bold" href="/">
                        <img src="./puraesencia.png" alt="Logo" width="40" height="40" className="me-2" />
                    </a>
                    <div className="dropdown">
                        <button className="btn btn-light dropdown-toggle" data-bs-toggle="dropdown">
                            <FaUser />
                        </button>
                        <ul className="dropdown-menu">
                            <button className="btn btn-secondary" onClick={() => navigate('/perfil')}>Perfil</button>
                            <button className="dropdown-item" onClick={() => navigate("/changepass")}>Cambiar Contraseña</button>
                            <button className="dropdown-item" onClick={() => navigate("/workout-sessions")}>Mi progreso</button>
                            <button className="btn btn-danger ms-auto" onClick={() => logout(navigate)}>Cerrar Sesión</button>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Rutina */}
            {routine !== "" ?
                <div className="container mt-4">
                    <div className="row">
                        {daysOfWeek.map((day) => (
                            <div key={day.index} className="col-md-6 mb-3">
                                <div className="card p-3 shadow-sm">
                                    <h5 className="card-title">{day.name}</h5>
                                    <div className="card-text">
                                        {routine.exercisesByDay[day.index] && routine.exercisesByDay[day.index].length > 0
                                            ? routine.exercisesByDay[day.index].map((ex, idx) => (
                                                <div key={idx} className="mb-3 p-2 border rounded">
                                                  <>
                                                  {ex.exerciseIds.length > 1 && 
                                                    <strong>Ejercicio Combinado</strong> 
                                                  }
                                                    </>
                                                    {ex.exerciseIds.map((exerciseId) => {
                                                        const exerciseDetails = exercises.find((exercise) => exercise.id === exerciseId);
                                                        return (
                                                            <div key={exerciseId} className="mb-2">
                                                                <span>{exerciseDetails?.name}</span> - {ex.series} series de {ex.repetitions} repeticiones, descanso: {ex.rest}s

                                                                {/* Inputs para registrar el peso, repeticiones y comentario */}
                                                                <div className="mt-2">
                                                                    <input
                                                                        type="number"
                                                                        className="form-control mb-2"
                                                                        placeholder="Peso (kg)"
                                                                        value={sessionData[exerciseId]?.weight || ""}
                                                                        onChange={(e) => handleInputChange(exerciseId, "weight", e.target.value)}
                                                                    />
                                                                    <input
                                                                        type="number"
                                                                        className="form-control mb-2"
                                                                        placeholder="Repeticiones"
                                                                        value={sessionData[exerciseId]?.reps || ""}
                                                                        onChange={(e) => handleInputChange(exerciseId, "reps", e.target.value)}
                                                                    />
                                                                    <textarea
                                                                        className="form-control mb-2"
                                                                        placeholder="Comentario"
                                                                        rows="2"
                                                                        value={sessionData[exerciseId]?.notes || ""}
                                                                        onChange={(e) => handleInputChange(exerciseId, "notes", e.target.value)}
                                                                    />
                                                                    <button
                                                                        className="btn btn-success"
                                                                        onClick={() => saveWorkoutSession(exerciseId)}
                                                                    >
                                                                        Guardar Sesión
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ))
                                            : <p>Sin ejercicios</p>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                :
                <div className="alert alert-warning text-center" role="alert">
                    <h4 className="alert-heading">¡Atención!</h4>
                    <p>Todavía no tienes una rutina asignada.</p>
                </div>
            }
            {/* Footer */}
            <footer className="text-center py-3 bg-light">
                <small>&copy; 2025 Gimnasio Pura Esencia</small>
            </footer>
        </div>
    );
};

export default ClientDashboard;
