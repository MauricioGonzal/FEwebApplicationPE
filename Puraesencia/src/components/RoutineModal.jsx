import React from "react";

const RoutineModal = ({ routine, onClose }) => {
    if (!routine) return null;

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{routine.name}</h5>
                        <button className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {Object.entries(routine).map(([day, exercises]) => (
                            <div key={day} className="mb-4">
                                <h4 className="text-primary">{day}</h4>
                                <ul className="list-group">
                                    {exercises.map((ex, index) => (
                                        <li key={index} className="list-group-item">
                                            <strong>
                                                {ex.exerciseList.map(exercise => exercise.name).join(" + ")}
                                            </strong> - {ex.series} series de {ex.repetitions} repeticiones
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
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
