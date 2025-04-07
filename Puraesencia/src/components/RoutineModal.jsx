import React from "react";
import { useState, useEffect } from "react";
import api from '../Api';

const RoutineModal = ({ routine, onClose }) => {
    const [exercises, setExercises] = useState([]);
    useEffect(() => {
        api
          .get("/exercises")
          .then((response) => {
            setExercises(response.data);
          })
          .catch((error) => {
            console.error("Error al obtener los ejercicios", error);
          });
      }, []);
    if (!routine || routine.length === 0) return null;



    // Definir los días de la semana
    const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    
    // Organizar los ejercicios por día
    const routinesByDay = {};
    daysOfWeek.forEach((day, index) => {
        routinesByDay[index + 1] = routine.filter(r => r.dayNumber === index + 1);
    });

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
            <div className="modal-dialog modal-xl">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Rutina de Entrenamiento</h5>
                        <button className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        {daysOfWeek.map((day, index) => (
                                            <th key={index} className="text-center bg-primary text-white">{day}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        {daysOfWeek.map((_, index) => (
                                            <td key={index} className="align-top">
                                                {routinesByDay[index + 1].length > 0 ? (
                                                    <ul className="list-unstyled">
                                                        {routinesByDay[index + 1].map((set, idx) => {
                                                            // Convertir el string JSON a un array de IDs
                                                            const exerciseIds = JSON.parse(set.exerciseIds || "[]");

                                                            return (
                                                                <li key={idx} className="mb-2">
                                                                    <strong>
                                                                        {exerciseIds.map((id) => {
                                                                            const exercise = exercises.find(ex => ex.id === id);
                                                                            return exercise ? exercise.name : "Ejercicio no encontrado";
                                                                        }).join(", ")}
                                                                    </strong>
                                                                    <br /> {set.series} series de {set.repetitions} repeticiones
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                ) : (
                                                    <span className="text-muted">Descanso</span>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoutineModal;