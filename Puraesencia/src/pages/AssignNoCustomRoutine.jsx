import { useState, useEffect } from "react";
import api from "../Api"; 

const StudentRow = ({ student }) => {
    const [routines, setRoutines] = useState([]);
    const [selectedRoutine, setSelectedRoutine] = useState(null);

    // Obtener rutinas del backend
    useEffect(() => {
        api.get('/routines/nocustom') // Cambia la URL según tu API
            .then((response) => {
                console.log(response.data);
                setRoutines(response.data);
            })
            .catch((error) => console.error("Error al cargar los datos:", error));
    }, []);

    // Función para asignar la rutina al estudiante
    const assignRoutine = () => {
        if (!selectedRoutine) return;

        api.post(`/${student.id}/assign-routine/${selectedRoutine.id}`)
            .then(response => response.json())
            .then(() => {
                alert("Rutina asignada correctamente");
            })
            .catch(error => console.error("Error al asignar rutina:", error));
    };

    return (
        <div>
            {/* Modal para seleccionar rutina */}
            {(
                <div>
                    <div>
                        <h3>Seleccionar Rutina</h3>
                        <ul>
                            {routines.map(routine => (
                                <li key={routine.id} className="routine-item">
                                    <input
                                        type="radio"
                                        name="routine"
                                        value={routine.id}
                                        onChange={() => setSelectedRoutine(routine)}
                                    />
                                    <strong>{routine.name}</strong> - {routine.description}
                                    <ul>
                                        {Object.entries(routine.exercisesByDay).map(([day, exercises]) => (
                                            <li key={day}>
                                                <strong>{day}</strong>
                                                <ul>
                                                    {exercises.map(ex => (
                                                        <li key={ex.exerciseId}>
                                                            {`Ejercicio ${ex.exerciseId}: ${ex.series} series de ${ex.repetitions} repeticiones`}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                        <button className="btn btn-primary" onClick={assignRoutine} disabled={!selectedRoutine}>
                            Asignar
                        </button>
                        <button className="btn btn-secondary">
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentRow;