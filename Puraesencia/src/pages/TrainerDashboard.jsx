import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import jwtDecode from "jwt-decode";
import api from "../Api";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { FaSearch, FaPlus, FaClipboardList } from "react-icons/fa";
import RoutineModal from "../components/RoutineModal";
import ConfirmationDeleteModal from "../components/ConfirmationDeleteModal";
import ErrorModal from "../components/ErrorModal";
import { toast } from 'react-toastify';


const TrainerDashboard = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [filteredAllStudents, setFilteredAllStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoutineDetails, setSelectedRoutineDetails] = useState([]);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showRoutineModal, setShowRoutineModal] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [selectedRoutine, setSelectedRoutine] = useState(null);
    const [action, setAction] = useState("eliminar");

    useEffect(() => {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        api.get(`/users/${decoded.id}/clients`)
            .then((response) => {
                setStudents(response.data);
                setFilteredStudents(response.data);
                setLoading(false);
            })
            .catch((error) => console.error("Error al cargar los datos:", error));
    }, [refresh]);

    useEffect(() => {
        api.get("/users/getAllGymUsers")
            .then((response) => {
                setAllStudents(response.data);
                setFilteredAllStudents(response.data);
                setLoading(false);
            })
            .catch((error) => console.error("Error al cargar los datos:", error));
    }, [refresh]);

    const handleSearch = (e, setFiltered, data) => {
        const query = e.target.value.toLowerCase();
        setFiltered(query ? data.filter(student => student.fullName.toLowerCase().includes(query)) : [...data]);
    };

    const handleDelete = () => {
        if(selectedRoutine.isCustom){
            api.delete(`/routines/${selectedRoutine.id}`)
            .then(() => {
              toast.success("Rutina eliminada correctamente", {
                position: "top-right", // Ahora directamente como string
              });
              setRefresh(prev => !prev);
              setShowConfirmationModal(false);
            })
            .catch(error => {
              if (error.response && error.response.data) {
                setErrorMessage(error.response.data.message || "Error desconocido");
              } else {
                setErrorMessage("Error al realizar la solicitud");
              }
              setShowErrorModal(true);  // Mostrar modal con el error
              setShowConfirmationModal(false);
            });
        }
        else{
            api.put(`/routines/unassign/${selectedRoutine.id}`)
            .then(() => {
              toast.success("Rutina desasignada correctamente", {
                position: "top-right", // Ahora directamente como string
              });
              setRefresh(prev => !prev);
              setShowConfirmationModal(false);
            })
            .catch(error => {
              if (error.response && error.response.data) {
                setErrorMessage(error.response.data.message || "Error desconocido");
              } else {
                setErrorMessage("Error al realizar la solicitud");
              }
              setShowErrorModal(true);  // Mostrar modal con el error
              setShowConfirmationModal(false);
            });
        }

      };

    const handleShowConfirmationModal = (routine) => {
    if(!routine.isCustom) setAction("desasignar");
    setSelectedRoutine(routine);
    setShowConfirmationModal(true);
    };

    const handleView = (routine) => {
        // Cargar rutina
        api.get('/routines/routine-set/' + routine.id)
        .then(response => {
            setSelectedRoutineDetails(response.data);
            setShowRoutineModal(true);
        })
        .catch(error => console.error("Error al cargar la rutina:", error));
      };

    if (loading) {
        return <div className="text-center mt-5"><h4>Cargando datos...</h4></div>;
    }

    return (
        <div className="container-fluid">

            {[{ title: "Mis Alumnos", data: filteredStudents, setData: setFilteredStudents, allData: students },
              { title: "Lista de Alumnos", data: filteredAllStudents, setData: setFilteredAllStudents, allData: allStudents }]
              .map((section, index) => (
                <div key={index} className="row my-4">
                    <div className="col-md-12">
                        <div className="card shadow">
                            <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
                                <h5>{section.title}</h5>
                                <div className="input-group w-25">
                                    <span className="input-group-text"><FaSearch /></span>
                                    <input type="text" className="form-control" placeholder="Buscar..." onChange={(e) => handleSearch(e, section.setData, section.allData)} />
                                </div>
                            </div>
                            <div className="card-body">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {section.data.map(student => (
                                            <tr key={student.id}>
                                                <td>{student.fullName}</td>
                                                <td>
                                                    {student.routine && student.routine.isCustom ? (
                                                        <>
                                                        <button className="btn btn-primary btn-sm me-2" onClick={() => navigate(`/edit-routine/${student.routine.id}/${student.id}`)}>
                                                            <FaClipboardList /> Ver Rutina
                                                        </button>
                                                        <button className="btn btn-danger" onClick={() => handleShowConfirmationModal(student.routine)}>Eliminar</button>
                                                        </>
                                                    ) : student.routine && !student.routine.isCustom ? (
                                                        <>
                                                        <button className="btn btn-primary btn-sm me-2" onClick={() => handleView(student.routine)}>
                                                            <FaClipboardList /> Ver Rutina
                                                        </button>
                                                        <button className="btn btn-danger" onClick={() => handleShowConfirmationModal(student.routine)}>Desasignar</button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button className="btn btn-success btn-sm me-2" onClick={() => navigate(`/assign-routine/${student.id}`)}>
                                                                <FaPlus /> Asignar Rutina
                                                            </button>
                                                            <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/create-routine/1/${student.id}`)}>
                                                                <FaClipboardList /> Crear Rutina Personalizada
                                                            </button>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <footer className="text-center py-3 bg-light mt-4">
                <small>&copy; 2025 Pura Esencia - Todos los derechos reservados.</small>
            </footer>
            <ErrorModal showErrorModal={showErrorModal} setShowErrorModal={setShowErrorModal} errorMessage={errorMessage} />
            <ConfirmationDeleteModal showModal={showConfirmationModal} setShowModal={setShowConfirmationModal} message={`Seguro que quieres ${action} la rutina?`} handleDelete= {handleDelete}   /> 
            {showRoutineModal && <RoutineModal routine={selectedRoutineDetails} onClose={() => setShowRoutineModal(false)} />}
        </div>
    );
};

export default TrainerDashboard;