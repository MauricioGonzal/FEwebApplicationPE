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
        api.get(`/payments/overduePayments/${decoded.id}`)
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
        api.get(`/users/${decoded.id}/routine`)
            .then(response => {
                setRoutine(response.data);
                setLoading(false);
            })
            .catch(error => console.error("Error al cargar la rutina:", error));
    }, [refresh]);

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
            alert("Debes ingresar al menos un ejercicio con peso y repeticiones.");
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
    
        api.post("/workout-sessions", workoutSession)
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
        <div className="container-fluid">
            {hasPendingPayment && (
                <div className="alert alert-warning text-center" role="alert">
                    ⚠️ Tienes una cuota vencida. Por favor, regulariza tu pago.
                </div>
            )}
            {routine.length === 0 &&
                <div className="container d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                    <div className="text-center p-4 border rounded shadow-lg" style={{ backgroundColor: "#f8f9fa" }}>
                        <h4 className="text-danger fw-bold">🚨 No tienes una rutina asignada</h4>
                        <p className="text-muted">Por favor, contacta a tu entrenador para obtener una.</p>
                    </div>
                </div>
            }

            <div className="container mt-4">
                <div className="row">
                    {daysOfWeek.map((day) => {
                        // Filtrar los ejercicios por día
                        const dayExercises = routine.filter(r => r.dayNumber === day.index);

                        return (
                            <div key={day.index} className="col-md-6 mb-3">
                                <div className="card p-3 shadow-sm">
                                    <h5 className="card-title p-2 rounded" onClick={() => toggleDay(day.index)} style={{cursor: "pointer", fontFamily: 'Roboto', backgroundColor: day.index % 2 === 0 ? "#0a0a08" : "#626260", color: "#fff" }}>
                                        {day.name}
                                    </h5>
                                    {expandedDays[day.index] && dayExercises.map((exercise, idx) => (
                                        <div key={idx} className="mb-3 p-2 border rounded">
                                            {JSON.parse(exercise.exerciseIds).map((exerciseId) => {
                                                const exerciseDetails = exercises.find(ex => ex.id === exerciseId);
                                                return (
                                                    <div key={exerciseId} className="mb-2" onClick={() => {
                                                        setSelectedExercise(exerciseId);  // Set selected exercise
                                                        toggleExercise(exerciseId);
                                                    }} style={{ cursor: "pointer" }}>
                                                        <span>{exerciseDetails?.name}</span> - {exercise.series} series de {exercise.repetitions} repeticiones, descanso: {exercise.rest}s
                                                        {expandedExercises[exerciseId] && (
                                                            <div className="mt-2">
                                                                <input
                                                                    type="number"
                                                                    className="form-control mb-2"
                                                                    placeholder="Cantidad de series"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    onChange={(e) => handleSeriesChange(exerciseId, e.target.value)}
                                                                />

                                                                {sessionData[exerciseId]?.details?.map((_, index) => (
                                                                    <div key={index} className="border p-2 mb-2 rounded">
                                                                        <h6>Serie {index + 1}</h6>
                                                                        <input
                                                                            type="number"
                                                                            className="form-control mb-2"
                                                                            placeholder="Peso (kg)"
                                                                            onClick={(e) => e.stopPropagation()}
                                                                            onChange={(e) => handleSeriesInputChange(exerciseId, index, "weight", e.target.value)}
                                                                        />
                                                                        <input
                                                                            type="number"
                                                                            className="form-control mb-2"
                                                                            placeholder="Repeticiones"
                                                                            onClick={(e) => e.stopPropagation()}
                                                                            onChange={(e) => handleSeriesInputChange(exerciseId, index, "reps", e.target.value)}
                                                                        />
                                                                    </div>
                                                                ))}

                                                                <textarea
                                                                    className="form-control mb-2"
                                                                    placeholder="Comentario"
                                                                    rows="2"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    onChange={(e) => handleInputChange(exerciseId, "notes", e.target.value)}
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
                        );
                    })}
                </div>
            </div>
            <ErrorModal showErrorModal={showErrorModal} setShowErrorModal={setShowErrorModal} errorMessage={errorMessage} />
        </div>
    );
};

export default ClientGymDashboard;
