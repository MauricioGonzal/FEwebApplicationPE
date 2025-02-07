import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../Api"; 

const EditRoutine = () => {
    const { id } = useParams(); // Obtiene el id del alumno desde la URL
    const navigate = useNavigate();

    const [routine, setRoutine] = useState([]);
    const [allExercises, setAllExercises] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Obtener la rutina del estudiante
        api.get(`/routines/${id}`)
            .then(response => {
                setRoutine(response.data.exercises);
                setLoading(false);
            })
            .catch(error => console.error("Error al cargar la rutina:", error));

        // Obtener todos los ejercicios disponibles
        api.get("/exercises")
            .then(response => {
                setAllExercises(response.data);
            })
            .catch(error => console.error("Error al cargar los ejercicios:", error));
    }, [id]);

    // Agregar un ejercicio a la rutina
    const addExercise = (exercise) => {
        if (!routine.some(e => e.id === exercise.id)) {
            setRoutine([...routine, exercise]);
        }
    };

    // Eliminar un ejercicio de la rutina
    const removeExercise = (exerciseId) => {
        setRoutine(routine.filter(e => e.id !== exerciseId));
    };

    // Guardar la rutina
    const saveRoutine = () => {
        api.put(`/routines/${id}`, { exercises: routine })
            .then(() => {
                alert("Rutina guardada exitosamente");
                navigate("/dashboard"); // Redirigir al dashboard
            })
            .catch(error => console.error("Error al guardar la rutina:", error));
    };

    if (loading) {
        return <div className="text-center mt-5"><h4>Cargando rutina...</h4></div>;
    }

    return (
        <div className="container">
            <h2 className="mb-4">Editar Rutina</h2>

            {/* Lista de ejercicios en la rutina */}
            <div className="card mb-4">
                <div className="card-header bg-primary text-white">
                    <h5>Ejercicios en la Rutina</h5>
                </div>
                <div className="card-body">
                    {routine.length === 0 ? (
                        <p>No hay ejercicios en esta rutina.</p>
                    ) : (
                        <ul className="list-group">
                            {routine.map((exercise) => (
                                <li key={exercise.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    {exercise.name}
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => removeExercise(exercise.id)}
                                    >
                                        Eliminar
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Lista de todos los ejercicios disponibles */}
            <div className="card mb-4">
                <div className="card-header bg-success text-white">
                    <h5>Agregar Ejercicio</h5>
                </div>
                <div className="card-body">
                    <ul className="list-group">
                        {allExercises.map((exercise) => (
                            <li key={exercise.id} className="list-group-item d-flex justify-content-between align-items-center">
                                {exercise.name}
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => addExercise(exercise)}
                                >
                                    Agregar
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Botón Guardar */}
            <button className="btn btn-success" onClick={saveRoutine}>Guardar Rutina</button>
        </div>
    );
};

export default EditRoutine;
