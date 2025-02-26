import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import jwtDecode from 'jwt-decode';
import api from '../Api';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const ClientGymDashboard = () => {
    const daysOfWeek = [
        { index: 1, name: "Lunes" }, { index: 2, name: "Martes" }, { index: 3, name: "Miércoles" },
        { index: 4, name: "Jueves" }, { index: 5, name: "Viernes" }, { index: 6, name: "Sábado" }, { index: 7, name: "Domingo" }
    ];

    const [routine, setRoutine] = useState(null);
    const [loading, setLoading] = useState(true);
    const [exercises, setExercises] = useState([]);
    const [sessionData, setSessionData] = useState({});
    const [expandedDays, setExpandedDays] = useState({});
    const [expandedExercises, setExpandedExercises] = useState({});
  
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

    const toggleDay = (dayIndex) => {
        setExpandedDays(prev => ({ ...prev, [dayIndex]: !prev[dayIndex] }));
    };

    const toggleExercise = (exerciseId) => {
        setExpandedExercises(prev => ({ ...prev, [exerciseId]: !prev[exerciseId] }));
    };

    const handleInputChange = (exerciseId, field, value) => {
        setSessionData(prevState => ({
            ...prevState,
            [exerciseId]: {
                ...prevState[exerciseId],
                [field]: value
            }
        }));
    };

    const handleInputClick = (e) => {
        e.stopPropagation(); // Detiene la propagación del clic
    };

    const saveWorkoutSession = () => {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      
      const logs = Object.entries(sessionData).map(([exerciseId, data]) => {
          return {
              exerciseId: parseInt(exerciseId),
              repetitions: parseInt(data.reps),
              weight: parseFloat(data.weight),
              notes: data.notes || ""
          };
      }).filter(log => log.repetitions && log.weight);
      
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
            <div className="container mt-4">
                <div className="row">
                    {daysOfWeek.map((day) => (
                        <div key={day.index} className="col-md-6 mb-3">
                            <div className="card p-3 shadow-sm">
                                <h5 className="card-title" onClick={() => toggleDay(day.index)} style={{ cursor: "pointer" }}>{day.name}</h5>
                                {expandedDays[day.index] && routine.exercisesByDay[day.index]?.map((ex, idx) => (
                                    <div key={idx} className="mb-3 p-2 border rounded">
                                        {ex.exerciseIds.map((exerciseId) => {
                                            const exerciseDetails = exercises.find((exercise) => exercise.id === exerciseId);
                                            return (
                                                <div key={exerciseId} className="mb-2" onClick={() => toggleExercise(exerciseId)} style={{ cursor: "pointer" }}>
                                                    <span>{exerciseDetails?.name}</span> - {ex.series} series de {ex.repetitions} repeticiones, descanso: {ex.rest}s
                                                    {expandedExercises[exerciseId] && (
                                                        <div className="mt-2">
                                                            <input
                                                                type="number"
                                                                className="form-control mb-2"
                                                                placeholder="Peso (kg)"
                                                                onChange={(e) => handleInputChange(exerciseId, "weight", e.target.value)}
                                                                onClick={handleInputClick} // Detiene la propagación
                                                            />
                                                            <input
                                                                type="number"
                                                                className="form-control mb-2"
                                                                placeholder="Repeticiones"
                                                                onChange={(e) => handleInputChange(exerciseId, "reps", e.target.value)}
                                                                onClick={handleInputClick} // Detiene la propagación
                                                            />
                                                            <textarea
                                                                className="form-control mb-2"
                                                                placeholder="Comentario"
                                                                rows="2"
                                                                onChange={(e) => handleInputChange(exerciseId, "notes", e.target.value)}
                                                                onClick={handleInputClick} // Detiene la propagación
                                                            />
                                                            <button className="btn btn-success" onClick={saveWorkoutSession}>Guardar Sesión</button>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ClientGymDashboard;
