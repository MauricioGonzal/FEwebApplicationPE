import { useState, useEffect } from "react";
import { FaCheck, FaCalendarAlt } from "react-icons/fa";
import api from "../Api";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ErrorModal from "../components/ErrorModal";

const UserClassAttendance = () => {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [attendances, setAttendances] = useState([]);

    const [classes, setClasses] = useState([]);
    const [classSearch, setClassSearch] = useState("");
    const [showClassModal, setShowClassModal] = useState(false);

    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        api.get("/users/getAllByRole/clients")
            .then((response) => {setUsers(response.data)})
            .catch((error) => console.error("Error al obtener usuarios", error));
    }, []);

    useEffect(() => {
        api.get(`/attendance/current-month`)
            .then((response) => {
                setAttendances(response.data);
            })
            .catch((error) => console.error("Error al obtener asistencias", error));
    }, [refresh]);

    /*const handleMarkAttendance = (userId) => {
        api.post("/attendance", { userId, attendanceTypeId: 2 })
            .then((response) => {
                toast.success("Asistencia registrada con éxito", {
                    position: "top-right",
                });
                setRefresh(prev => !prev);
            })
            .catch((error) =>{
                if (error.response && error.response.data) {
                    setErrorMessage(error.response.data.message || "Error desconocido");
                  } else {
                    setErrorMessage("Error al realizar la solicitud");
                  }
                  setShowErrorModal(true);
            });
    };*/

    const handleOpenClassModal = (user) => {
        setSelectedUser(user);
        setShowClassModal(true);
    };

    useEffect(() => {
        api.get("/classTypes")
            .then((response) => setClasses(response.data))
            .catch((error) => console.error("Error al obtener clases", error));
    }, []);

    const handleSelectClass = (classTypeId) => {
        api.post("/attendance", { userId: selectedUser.id, classTypeId: classTypeId, attendanceTypeId: 2 })
            .then(() => {
                toast.success("Asistencia registrada con éxito", { position: "top-right" });
                setRefresh(prev => !prev);
                setShowClassModal(false);
            })
            .catch((error) => {
                setErrorMessage(error.response?.data?.message || "Error al registrar asistencia");
                setShowErrorModal(true);
            });
    };

    const filteredClasses = classes.filter(c => c.name.toLowerCase().includes(classSearch.toLowerCase()));

    const getMonthlyAttendance = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const filteredUsers = users.filter(
        (user) =>
            (user.role === "CLIENT_CLASSES" || user.role === "CLIENT_BOTH") &&
            (user.fullName.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div>
            <div>
                <input
                    type="text"
                    className="form-control mb-3 w-75 mx-auto"
                    placeholder="Buscar usuario por nombre o correo..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {search.length > 0 && filteredUsers.length > 0 && (
                    <table className="table table-hover table-bordered shadow-sm">
                        <thead className="table-dark text-center">
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {filteredUsers.map((user) => {
                                var reachedLimit = false;
                                if(attendances[user.id] !== undefined){
                                    const totalAttendance = Object.values(attendances[user.id].attendance).reduce((sum, val) => sum + val, 0);
                                    const maxAttendance = attendances[user.id].max_classes;
                                    reachedLimit = totalAttendance >= maxAttendance;
                                }

                                return (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.fullName}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            {!reachedLimit ? (
                                                <button
                                                    className="btn btn-primary btn-sm me-2"
                                                    onClick={() => handleOpenClassModal(user)}
                                                >
                                                    <FaCheck className="me-1" /> Marcar Presente
                                                </button>
                                            ) : (
                                                <span className="text-danger fw-bold">Máximo de clases alcanzado</span>
                                            )}
                                            <button
                                                className="btn btn-info btn-sm"
                                                onClick={() => getMonthlyAttendance(user)}
                                            >
                                                <FaCalendarAlt className="me-1" /> Ver Asistencias
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}

                {search.length > 0 && filteredUsers.length === 0 && (
                    <p className="text-center text-muted">No se encontraron usuarios.</p>
                )}
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Asistencias de {selectedUser?.fullName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {Object.keys(attendances).length > 0 ? (
                        <table className="table table-bordered text-center">
                            <thead className="table-dark">
                                <tr>
                                    <th>Fecha</th>
                                    <th>Cantidad</th>
                                </tr>
                            </thead>
                            <tbody>
                            {Object.entries(attendances).map(([userId, userAttendances], index) => {
                                if (parseInt(userId) === selectedUser?.id) {  // Verificamos si el id coincide
                                    return Object.entries(userAttendances.attendance).map(([date, count]) => (
                                        <tr key={date}>
                                            <td>{new Date(`${date}T00:00:00`).toLocaleDateString('es-ES')}</td>
                                            <td>{count}</td>
                                        </tr>
                                    ));
                                }
                                return null;  // Si no coincide, no renderizamos nada para este usuario
                            })}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-center text-muted">No hay asistencias registradas este mes.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showClassModal} onHide={() => setShowClassModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Seleccionar Clase</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input type="text" className="form-control mb-3" placeholder="Buscar clase..." value={classSearch} onChange={(e) => setClassSearch(e.target.value)} />
                    {filteredClasses.length > 0 ? (
                        <ul className="list-group">
                            {filteredClasses.map((c) => (
                                <li key={c.id} className="list-group-item list-group-item-action" onClick={() => handleSelectClass(c.id)}>
                                    {c.name}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-muted">No se encontraron clases.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowClassModal(false)}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
            <ErrorModal showErrorModal={showErrorModal} setShowErrorModal={setShowErrorModal} errorMessage={errorMessage} />
        </div>
    );
};

export default UserClassAttendance;