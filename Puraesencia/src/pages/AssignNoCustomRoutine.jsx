import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../Api";
import jwtDecode from "jwt-decode";
import ErrorModal from "../components/ErrorModal";
import { toast } from "react-toastify";
import RoutineModal from "../components/RoutineModal"; // Importamos el modal

const StudentRow = () => {
    const [routines, setRoutines] = useState([]);
    const [selectedRoutine, setSelectedRoutine] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Estado para el modal de rutina
    const [showRoutineModal, setShowRoutineModal] = useState(false);
    const [selectedRoutineDetails, setSelectedRoutineDetails] = useState(null);

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
                toast.success("Rutina asignada correctamente", { position: "top-right" });
            })
            .catch((error) => {
                if (error.response && error.response.data) {
                    setErrorMessage(error.response.data.message || "Error desconocido");
                } else {
                    setErrorMessage("Error al realizar la solicitud");
                }
                setShowErrorModal(true);
            });
    };

    // Función para abrir el modal y ver los detalles de la rutina
    const viewRoutine = (routine) => {
        setSelectedRoutineDetails(routine);
        setShowRoutineModal(true);
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light p-4">
            <div className="bg-white shadow rounded p-4 w-100" style={{ maxWidth: "900px" }}>
                <h2 className="text-center text-dark mb-4">Seleccionar Rutina</h2>

                <ul className="list-unstyled">
                    {Object.entries(routines).map(([id, routine]) => (
                        <div key={`routine-${id}`} className="bg-white shadow-sm rounded p-4 mb-3">
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

                            {/* Botón para ver la rutina */}
                            <button
                                className="btn btn-info btn-sm mt-2"
                                onClick={() => viewRoutine(routine)}
                            >
                                Ver
                            </button>
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
            <ErrorModal
                showErrorModal={showErrorModal}
                setShowErrorModal={setShowErrorModal}
                errorMessage={errorMessage}
            />

            {/* Modal para ver la rutina */}
            {showRoutineModal && (
                <RoutineModal
                    routine={selectedRoutineDetails}
                    onClose={() => setShowRoutineModal(false)}
                />
            )}
        </div>
    );
};

export default StudentRow;
