import { useState, useEffect } from "react";
import api from "../Api"; 
import { useNavigate, useParams } from "react-router-dom";
import jwtDecode from 'jwt-decode';


const StudentRow = () => {
    const [routines, setRoutines] = useState([]);
    const [selectedRoutine, setSelectedRoutine] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    // Obtener rutinas del backend
    useEffect(() => {
        api.get('/routines/nocustom') // Cambia la URL según tu API
            .then((response) => {
                setRoutines(response.data);
            })
            .catch((error) => console.error("Error al cargar los datos:", error));
    }, []);

    // Función para asignar la rutina al estudiante
    const assignRoutine = () => {
        if (!selectedRoutine) return;
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);
        console.log(decoded);
        api.put(`/users/assign-routine`, {
            trainerId: decoded.id,
            userId: id,
            routineId: selectedRoutine.id
        }
        )
            .then(() => {
                alert("Rutina asignada correctamente");
                navigate('/')
            })
            .catch(error => console.error("Error al asignar rutina:", error));
    };


    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light p-4">
            <div className="bg-white shadow rounded p-4 w-100" style={{ maxWidth: '900px' }}>
                <h2 className="text-center text-dark mb-4">Seleccionar Rutina</h2>
                
                <ul className="list-unstyled">
                    {routines.map(routine => (
                        <li key={routine.id} className="p-4 border rounded shadow-sm bg-light mb-3 hover:bg-secondary transition">
                            <div className="form-check">
                                <input 
                                    type="radio" 
                                    name="routine" 
                                    value={routine.id} 
                                    onChange={() => setSelectedRoutine(routine)} 
                                    className="form-check-input"
                                />
                                <label className="form-check-label">
                                    <strong className="h5">{routine.name}</strong>
                                    <p className="text-muted">{routine.description}</p>

                                    <ul className="mt-2">
                                        {Object.entries(routine.exercisesByDay).map(([day, exercises]) => (
                                            <li key={day} className="border-start ps-3">
                                                <strong className="text-primary">{day}</strong>
                                                <ul className="mt-1">
                                                    {exercises.map(ex => (
                                                        <li key={ex.exerciseId} className="text-dark">
                                                            {`${ex.name}: ${ex.series} series de ${ex.repetitions} repeticiones`}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                        ))}
                                    </ul>
                                </label>
                            </div>
                        </li>
                    ))}
                </ul>

                <div className="mt-4 d-flex justify-content-end">
                    <button 
                        onClick={assignRoutine} 
                        disabled={!selectedRoutine} 
                        className={`btn ${selectedRoutine ? "btn-primary" : "btn-secondary"} me-2`}
                    >
                        Asignar
                    </button>
                    <button className="btn btn-outline-secondary" onClick={()=> navigate('/')}>
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default StudentRow;