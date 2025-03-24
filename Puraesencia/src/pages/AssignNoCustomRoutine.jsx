import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../Api";
import jwtDecode from "jwt-decode";
import ErrorModal from "../components/ErrorModal";
import { toast } from "react-toastify";
import RoutineModal from "../components/RoutineModal";

const StudentRow = () => {
    const [groupedRoutines, setGroupedRoutines] = useState({});
    const [selectedRoutine, setSelectedRoutine] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showRoutineModal, setShowRoutineModal] = useState(false);
    const [selectedRoutineDetails, setSelectedRoutineDetails] = useState(null);

    useEffect(() => {
        api.get("/routines/nocustom")
            .then((response) => {
                const grouped = response.data.reduce((acc, routineSet) => {
                    const { routine } = routineSet;
                    if (!acc[routine.id]) {
                        acc[routine.id] = {
                            routine,
                            routineSets: [],
                        };
                    }
                    acc[routine.id].routineSets.push(routineSet);
                    return acc;
                }, {});
                setGroupedRoutines(grouped);
                console.log(grouped);
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
                setErrorMessage(error.response?.data?.message || "Error al realizar la solicitud");
                setShowErrorModal(true);
            });
    };

    const viewRoutine = (routine) => {
        setSelectedRoutineDetails(groupedRoutines[routine.id].routineSets);
        setShowRoutineModal(true);
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light p-4">
            <div className="bg-white shadow rounded p-4 w-100" style={{ maxWidth: "900px" }}>
                <h2 className="text-center text-dark mb-4">Seleccionar Rutina</h2>

                <ul className="list-unstyled">
                    {Object.values(groupedRoutines).map(({ routine, routineSets }) => (
                        <div key={`routine-${routine.id}`} className="bg-white shadow-sm rounded p-4 mb-3">
                            <div className="form-check">
                                <input
                                    type="radio"
                                    id={`routine-${routine.id}`}
                                    name="routine"
                                    value={routine.id}
                                    onChange={() => setSelectedRoutine(routine.id)}
                                    className="form-check-input"
                                />
                                <label htmlFor={`routine-${routine.id}`} className="form-check-label h5">
                                    {routine.name}
                                </label>
                            </div>
                            <p className="text-muted">{routine.description}</p>
                            <button
                                className="btn btn-info btn-sm mt-2"
                                onClick={() => viewRoutine(routine)}
                            >
                                Ver
                            </button>
                        </div>
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
                    <button className="btn btn-outline-secondary" onClick={() => navigate("/")}>Cancelar</button>
                </div>
            </div>

            <ErrorModal showErrorModal={showErrorModal} setShowErrorModal={setShowErrorModal} errorMessage={errorMessage} />
            {showRoutineModal && <RoutineModal routine={selectedRoutineDetails} onClose={() => setShowRoutineModal(false)} />}
        </div>
    );
};

export default StudentRow;