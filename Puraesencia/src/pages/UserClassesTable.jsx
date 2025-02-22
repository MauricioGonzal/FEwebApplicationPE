import { useState, useEffect } from "react";
import { FaCheck, FaCalendarAlt, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../Api";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const UserClassAttendance = () => {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [attendances, setAttendances] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/users/getAllByRole/clients")
            .then((response) => setUsers(response.data))
            .catch((error) => console.error("Error al obtener usuarios", error));
    }, []);

    const handleMarkAttendance = (userId) => {
        api.post("/attendance", { userId })
            .then(() => {
                toast.success("Asistencia registrada con éxito", {
                    position: "top-right",
                });
                // Refrescar la lista de asistencias después de registrar
                getMonthlyAttendance(users.find(user => user.id === userId));
            })
            .catch((error) => console.error("Error al registrar la asistencia:", error));
    };

    const getMonthlyAttendance = (user) => {
        api.get(`/attendance/${user.id}/details`)
            .then((response) => {
                const attendanceCount = response.data.reduce((acc, attendance) => {
                    const date = new Date(attendance.date).toLocaleDateString();
                    acc[date] = (acc[date] || 0) + 1;
                    return acc;
                }, {});
                console.log(attendanceCount);
                setAttendances(attendanceCount);
                setSelectedUser(user);
                setShowModal(true);
            })
            .catch((error) => console.error("Error al obtener asistencias", error));
    };

    const filteredUsers = users.filter(
        (user) =>
            user.role === "CLIENT_CLASSES" &&
            (user.fullName.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="bg-light min-vh-100">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
                <div className="container d-flex justify-content-between">
                    <a className="navbar-brand fw-bold" href="/">
                        <img src="./puraesencia.png" alt="Logo" width="40" height="40" className="me-2" />
                        Admin Panel
                    </a>                    
                </div>
            </nav>
            <div className="col-md-8 mx-auto">
                <Button variant="secondary" className="mb-3" onClick={() => navigate("/")}> 
                    <FaArrowLeft className="me-2" /> Volver
                </Button>

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
                                const totalAttendance = Object.values(attendances).reduce((sum, val) => sum + val, 0);
                                const maxAttendance = user.membership?.maxClasses || 0;
                                const reachedLimit = totalAttendance >= maxAttendance;
                                
                                console.log(user.membership);
                                return (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.fullName}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            {!reachedLimit ? (
                                                <button
                                                    className="btn btn-primary btn-sm me-2"
                                                    onClick={() => handleMarkAttendance(user.id)}
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
                                {Object.entries(attendances).map(([date, count], index) => (
                                    <tr key={index}>
                                        <td>{date}</td>
                                        <td>{count}</td>
                                    </tr>
                                ))}
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
        </div>
    );
};

export default UserClassAttendance;