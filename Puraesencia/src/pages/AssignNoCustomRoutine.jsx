import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../Api";
import jwtDecode from "jwt-decode";
import ErrorModal from "../components/ErrorModal";

const StudentRow = () => {
    const [routines, setRoutines] = useState([]);
    const [selectedRoutine, setSelectedRoutine] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        api.get("/routines/nocustom")
            .then((response) => {
                setRoutines(response.data);
            })
            .catch((error) => console.error("Error al cargar los datos:", error));
    }, []);

    const assignRoutine = () => {
        if (!selectedRoutine) return;
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        api.put("/users/assign-routine", {
            trainerId: decoded.id,
            userId: id,
            routineId: selectedRoutine,
        })
            .then(() => {
                alert("Rutina asignada correctamente");
                navigate("/");
            })
            .catch((error) =>{
                if (error.response && error.response.data) {
                    setErrorMessage(error.response.data.message || "Error desconocido");
                  } else {
                    setErrorMessage("Error al realizar la solicitud");
                  }
                  setShowErrorModal(true);  // Mostrar modal con el error
            })
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light p-4">
            <div className="bg-white shadow rounded p-4 w-100" style={{ maxWidth: "900px" }}>
                <h2 className="text-center text-dark mb-4">Seleccionar Rutina</h2>
    
                <ul className="list-unstyled">
                    {Object.entries(routines).map(([id, routine]) => (
                        <div 
                            key={`routine-${id}`} 
                            className="bg-white shadow-sm rounded p-4 mb-3"
                        >
                            <div className="form-check">
                                <input 
                                    type="radio" 
                                    id={`routine-${id}`}
                                    name="routine" 
                                    value={id} 
                                    onChange={() => setSelectedRoutine(id)} 
                                    className="form-check-input"
                                />
                                <label htmlFor={`routine-${id}`} className="form-check-label h5">
                                    {routine.name}
                                </label>
                            </div>
                            <p className="text-muted">{routine.description}</p>
    
                            {Object.entries(routine).map(([day, exercises]) => (
                                <div key={`routine-${id}-day-${day}`} className="mb-4">
                                    <h4 className="text-primary">{day}</h4>
                                    <div className="d-flex flex-column gap-3">
                                        {exercises.map((ex, index) => (
                                            <div 
                                                key={`routine-${id}-day-${day}-exercise-${index}`} 
                                                className={`p-3 rounded shadow-sm ${ex.exerciseList.length > 1 ? "bg-warning-subtle" : "bg-white"}`}
                                            >
                                                {ex.exerciseList.length > 1 && (
                                                    <h5 className="fw-bold text-dark mb-2">Ejercicios Combinados</h5>
                                                )}
                                                <div className="card border-0">
                                                    <div className="card-body p-2">
                                                        <ul className="list-group list-group-flush">
                                                            {ex.exerciseList.map((exercise) => (
                                                                <li 
                                                                    key={`routine-${id}-exercise-${exercise.id}`} 
                                                                    className="list-group-item d-flex justify-content-between align-items-center border-0"
                                                                >
                                                                    <span className="fw-semibold">{exercise.name}</span>
                                                                    <small className="text-muted">
                                                                        {ex.series} series de {ex.repetitions} repeticiones
                                                                    </small>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </ul>
    
                {/* Botones de acción */}
                <div className="mt-4 d-flex justify-content-end">
                    <button
                        onClick={assignRoutine}
                        disabled={!selectedRoutine}
                        className={`btn ${selectedRoutine ? "btn-primary" : "btn-secondary"} me-2`}
                    >
                        Asignar
                    </button>
                    <button className="btn btn-outline-secondary" onClick={() => navigate("/")}>
                        Cancelar
                    </button>
                </div>
            </div>
            
            {/* Modal emergente de error */}
            <ErrorModal showErrorModal={showErrorModal} setShowErrorModal={setShowErrorModal} errorMessage={errorMessage} />
        </div>
    );
    
};

export default StudentRow;
