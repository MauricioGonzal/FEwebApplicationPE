import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import jwtDecode from 'jwt-decode';
import api from '../Api';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import ErrorModal from "../components/ErrorModal";
import { Client } from '@stomp/stompjs'; 
import SockJS from 'sockjs-client';  
import { toast } from 'react-toastify';

const ClientGymDashboard = () => {
    const daysOfWeek = [
        { index: 1, name: "Lunes" }, { index: 2, name: "Martes" }, { index: 3, name: "Miércoles" },
        { index: 4, name: "Jueves" }, { index: 5, name: "Viernes" }, { index: 6, name: "Sábado" }, { index: 7, name: "Domingo" }
    ];

    const [routine, setRoutine] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exercises, setExercises] = useState([]);
    const [expandedDays, setExpandedDays] = useState({});
    const [expandedExercises, setExpandedExercises] = useState({});
    const [sessionData, setSessionData] = useState({});
    const [selectedExercise, setSelectedExercise] = useState(null); // Added state for selectedExercise

    const [hasPendingPayment, setHasPendingPayment] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    
    const [refresh, setRefresh] = useState(false);


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const decoded = jwtDecode(token);
        const userId = decoded.id;

        const client = new Client({
            brokerURL: 'ws://localhost:8080/ws', 
            connectHeaders: {},
            debug: function (str) {
                console.log(str);
            },
            onConnect: () => {
                client.subscribe(`/topic/assign-routine/${userId}`, () => {
                    setRefresh(prev => !prev);
                });
            },
            onStompError: (frame) => {
                console.error(frame);
            },
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'), 
        });

        client.activate(); 

        return () => {
            client.deactivate(); 
        };
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const decoded = jwtDecode(token);
        
        // Verificar estado de pago
        api.get(`/payment/overduePayments/${decoded.id}`)
            .then(response => {
                if (response.data.length > 0) {
                    setHasPendingPayment(true);
                }
            })
            .catch(error => console.error("Error al verificar pagos:", error));
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const decoded = jwtDecode(token);

        // Cargar rutina
        api.get(`/user/${decoded.id}/routine`)
            .then(response => {
                setRoutine(response.data);
                setLoading(false);
            })
            .catch(error => console.error("Error al cargar la rutina:", error));
    }, [refresh]);

    useEffect(() => {
        api.get("/exercise")
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
        setSessionData(prevState => ({
            ...prevState,
            [exerciseId]: {
                series: 0,
                details: Array.from({ length: 0 }, () => ({ weight: "", reps: "" }))
            }
        }));
        setExpandedExercises(prev => ({ ...prev, [exerciseId]: !prev[exerciseId] }));
    };

    const handleSeriesChange = (exerciseId, seriesCount) => {
        const count = parseInt(seriesCount) || 0;
        setSessionData(prevState => ({
            ...prevState,
            [exerciseId]: {
                series: count,
                details: Array.from({ length: count }, () => ({ weight: "", reps: "" }))
            }
        }));
    };

    const handleSeriesInputChange = (exerciseId, index, field, value) => {
        const updatedDetails = [...sessionData[exerciseId].details];
        updatedDetails[index][field] = value;
        setSessionData(prevState => ({
            ...prevState,
            [exerciseId]: {
                ...prevState[exerciseId],
                details: updatedDetails
            }
        }));
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

    const saveWorkoutSession = () => {
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);
    
        const sets = Object.entries(sessionData)
            .flatMap(([exerciseId, data]) =>
                data.details.map((series, index) => ({
                    exerciseId: parseInt(exerciseId),
                    repetitions: parseInt(series.reps),
                    weight: parseFloat(series.weight),
                }))
            )
            .filter(log => log.repetitions && log.weight);

        if (sets.length === 0) {
            setErrorMessage("Debes ingresar al menos un ejercicio con peso y repeticiones.");
            setShowErrorModal(true);
            return;
        }
    
        const workoutSession = {
            userId: decoded.id,
            exerciseId: selectedExercise,  // Using selectedExercise here
            date: new Date().toISOString(),
            sets: sets,
            series: sets.length,
            note: sessionData[selectedExercise]?.notes
        };
    
        api.post("/workout-session", workoutSession)
            .then(() => {
                toast.success("Sesión creada correctamente");
                setSessionData({});
                setSelectedExercise(null);  // Clear selected exercise after saving
            })
            .catch(error => {
                if (error.response && error.response.data) {
                    setErrorMessage(error.response.data.message || "Error desconocido");
                } else {
                    setErrorMessage("Error al realizar la solicitud");
                }
                setShowErrorModal(true);
            });
    };

    if (loading) {
        return <div className="text-center mt-5"><h4>Cargando rutina...</h4></div>;
    }
    

    return (
        
        <div style={{ backgroundColor: '#121212', minHeight: '100vh' }}>
            <div className="container-fluid" style={{ color: '#fff' }}>
                {hasPendingPayment && (
                    <div className="alert alert-warning text-center" role="alert" style={{ backgroundColor: '#ff9800', color: '#fff', fontWeight: 'bold' }}>
                        ⚠️ Tienes una cuota vencida. Por favor, regulariza tu pago.
                    </div>
                )}
                {routine.length === 0 ? (
                    <div className="container d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                        <div className="text-center p-5 border rounded shadow-lg" style={{ backgroundColor: "#333" }}>
                            <h4 className="text-danger fw-bold">🚨 No tienes una rutina asignada</h4>
                            <p className="text-muted">Por favor, contacta a tu entrenador para obtener una.</p>
                        </div>
                    </div>
                ):
    
                <div className="container mt-4" style={{ backgroundColor: "#121212", paddingBottom: "20px", borderRadius: "10px" }}>
                    <div className="row">
                        {daysOfWeek.map((day) => {
                            const dayExercises = routine.filter(r => r.dayNumber === day.index);
                            console.log(dayExercises);
                            return (
                                <div key={day.index} className="col-md-6 mb-3">
                                    <div className="card p-3 shadow-lg" style={{ backgroundColor: '#1e1e1e', borderRadius: '12px' }}>
                                        <h5
                                            className="card-title p-2 rounded"
                                            onClick={() => toggleDay(day.index)}
                                            style={{
                                                cursor: "pointer",
                                                fontFamily: 'Roboto',
                                                backgroundColor: day.index % 2 === 0 ? "#222" : "#333",
                                                color: "#fff",
                                                borderRadius: '8px',
                                                transition: 'background-color 0.3s',
                                            }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = '#444'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = day.index % 2 === 0 ? "#222" : "#333"}
                                        >
                                            {day.name}
                                        </h5>
                                        {expandedDays[day.index] && dayExercises.map((exercise, idx) => (
                                            <div key={idx} className="mb-3 p-2 border rounded" style={{ backgroundColor: "#333" }}>
<div
  className="mb-2"
  onClick={() => {
    setSelectedExercise(exercise.id); // usar el ID del "exercise" original
    toggleExercise(exercise.id);
  }}
  style={{ cursor: "pointer" }}
>
  <span style={{ color: "#f1f1f1" }}>
    {JSON.parse(exercise.exerciseIds)
      .map((exerciseId) => {
        const details = exercises.find((ex) => ex.id === exerciseId);
        return details?.name;
      })
      .filter(Boolean)
      .join(" + ")}{" "}
      
    -       {exercise.series} series de {
          exercise.repetitionsPerSeries.join(', ')
      } repeticiones, descanso: {exercise.rest}s
  </span>

  {expandedExercises[exercise.id] && (
    <div className="mt-2" style={{ backgroundColor: "#444", padding: "10px", borderRadius: "8px" }}>
      <input
        type="number"
        className="form-control mb-2"
        placeholder="Cantidad de series"
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => handleSeriesChange(exercise.id, e.target.value)}
        style={{ backgroundColor: "#555", color: "#fff", border: "none", borderRadius: "5px" }}
      />

      {sessionData[exercise.id]?.details?.map((_, index) => (
        <div key={index} className="border p-2 mb-2 rounded" style={{ backgroundColor: "#222" }}>
          <h6>Serie {index + 1}</h6>
          <input
            type="number"
            className="form-control mb-2"
            placeholder="Peso (kg)"
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => handleSeriesInputChange(exercise.id, index, "weight", e.target.value)}
            style={{ backgroundColor: "#555", color: "#fff", border: "none", borderRadius: "5px" }}
          />
          <input
            type="number"
            className="form-control mb-2"
            placeholder="Repeticiones"
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => handleSeriesInputChange(exercise.id, index, "reps", e.target.value)}
            style={{ backgroundColor: "#555", color: "#fff", border: "none", borderRadius: "5px" }}
          />
        </div>
      ))}

      <textarea
        className="form-control mb-2"
        placeholder="Comentario"
        rows="2"
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => handleInputChange(exercise.id, "notes", e.target.value)}
        style={{ backgroundColor: "#555", color: "#fff", border: "none", borderRadius: "5px" }}
      />
      <button
        className="btn btn-success"
        onClick={saveWorkoutSession}
        style={{ backgroundColor: "#28a745", borderRadius: "5px", width: "100%" }}
      >
        Guardar Sesión
      </button>
    </div>
  )}
</div>

                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
    }
                <ErrorModal showErrorModal={showErrorModal} setShowErrorModal={setShowErrorModal} errorMessage={errorMessage} />
            </div>
        </div>
    );
    
    
};

export default ClientGymDashboard;
