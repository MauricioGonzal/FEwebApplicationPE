import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import jwtDecode from "jwt-decode";
import api from "../Api";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { FaSearch, FaPlus, FaClipboardList } from "react-icons/fa";
import RoutineModal from "../components/RoutineModal";


const TrainerDashboard = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [filteredAllStudents, setFilteredAllStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoutineDetails, setSelectedRoutineDetails] = useState([]);
    const [showRoutineModal, setShowRoutineModal] = useState(false);


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
    }, []);

    useEffect(() => {
        api.get("/users/getAllGymUsers")
            .then((response) => {
                setAllStudents(response.data);
                setFilteredAllStudents(response.data);
                setLoading(false);
            })
            .catch((error) => console.error("Error al cargar los datos:", error));
    }, []);

    const handleSearch = (e, setFiltered, data) => {
        const query = e.target.value.toLowerCase();
        setFiltered(query ? data.filter(student => student.fullName.toLowerCase().includes(query)) : [...data]);
    };

    const handleView = (routine) => {
        // Cargar rutina
        api.get('/routines/routine-set/' + routine.id)
        .then(response => {
            setSelectedRoutineDetails(response.data);
            setShowRoutineModal(true);
            console.log(response.data);
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
                                                    {student.routine && !student.routine.isCustom ? (
                                                        <button className="btn btn-primary btn-sm me-2" onClick={() => navigate(`/edit-routine/${student.routine.id}/${student.id}`)}>
                                                            <FaClipboardList /> Ver Rutina
                                                        </button>
                                                    ) : student.routine.isCustom ? (
                                                        <button className="btn btn-primary btn-sm me-2" onClick={() => handleView(student.routine)}>
                                                            <FaClipboardList /> Ver Rutina
                                                        </button>
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
            {showRoutineModal && <RoutineModal routine={selectedRoutineDetails} onClose={() => setShowRoutineModal(false)} />}
        </div>
    );
};

export default TrainerDashboard;