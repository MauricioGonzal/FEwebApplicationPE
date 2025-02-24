import { useState, useEffect } from "react";
import { FaCheck, FaCalendarAlt } from "react-icons/fa";
import api from "../Api";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const UserGymAttendance = () => {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showModalDueDate, setShowModalDueDate] = useState(false);

    const [selectedUser, setSelectedUser] = useState(null);
    const [attendances, setAttendances] = useState([]);
    const [dueDate, setDueDate] = useState(new Date().toISOString().split("T")[0]); // Fecha de hoy


    const [selectedUserForDueDate, setSelectedUserForDueDate] = useState(null);


    const [attendancesToday, setAttendancesToday] = useState([]);

    useEffect(() => {
        api.get("/users/getAllByRole/clients")
            .then((response) => setUsers(response.data))
            .catch((error) => console.error("Error al obtener usuarios", error));
    }, []);

    useEffect(() => {
        api.get('/attendance/today')
        .then((response) => {
            setAttendancesToday(response.data);
        })
        .catch((error) => console.error("Error al obtener transacciones", error));
    }, []);



    const handleMarkAttendance = (userId) => {
        api.get("/payments/isOutDueDate/" + userId)
        .then((response) => {
            if (response.data) { // Asegura que funcione con true, "true" o cualquier truthy
                setSelectedUserForDueDate(userId); // Guardar el usuario para actualizar la cuota
                setDueDate(new Date().toISOString().split("T")[0]); // Fecha de hoy
                setShowModalDueDate(true); // Mostrar el modal
            }
        api.post("/attendance", { userId, attendanceTypeId: 1 })
            .then(() => {
                toast.success("Asistencia registrada con éxito", {
                    position: "top-right",
                });
                api.get('/attendance/today')
                .then((response) => {
                    console.log(response.data);
                    setAttendancesToday(response.data);
                })
                .catch((error) => console.error("Error al obtener transacciones", error));
            })
            .catch((error) => console.error("Error al registrar la asistencia:", error));
    })};

    

    const getMonthlyAttendance = (user) => {
        api.get(`/attendance/${user.id}/details`)
            .then((response) => {
                const attendanceCount = response.data.reduce((acc, attendance) => {
                    const date = new Date(attendance.date).toLocaleDateString();
                    acc[date] = (acc[date] || 0) + 1;
                    return acc;
                }, {});
                setAttendances(attendanceCount);
                setSelectedUser(user);
                setShowModal(true);
            })
            .catch((error) => console.error("Error al obtener asistencias", error));
    };

    const filteredUsers = users.filter(
        (user) =>
            (user.role === "CLIENT_GYM" || user.role === "CLIENT_BOTH") &&
            (user.fullName.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase()))
    );

    const handleUpdateDueDate = () => {
        if (selectedUserForDueDate) {
            api.put(`/payments/updateDueDate/${selectedUserForDueDate}`, { dueDate })
                .then(() => {
                    toast.success("Fecha de vencimiento actualizada con éxito", {
                        position: "top-right", // Ahora directamente como string
                    });
                    setShowModal(false);
                })
                .catch((error) => console.error("Error al actualizar la fecha de vencimiento", error));
        }
    };

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
    const isPresentToday = attendancesToday.some((attendance) => attendance.user.id === user.id);

    return (
        <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.fullName}</td>
            <td>{user.email}</td>
            <td>
                {isPresentToday ? (
                    <span className="badge bg-success me-2">Presente Hoy</span>
                ) : (
                    <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => handleMarkAttendance(user.id)}
                    >
                        <FaCheck className="me-1" /> Marcar Presente
                    </button>
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

            {/* Modal de actualización de cuota */}
            <Modal show={showModalDueDate} onHide={() => setShowModalDueDate(false)}>
                <Modal.Header closeButton>
                <Modal.Title>Actualizar Fecha de Vencimiento</Modal.Title>
                </Modal.Header>
                <Modal.Body>            <label>Fecha de vencimiento:</label>
                            <input 
                                type="date" 
                                value={dueDate} 
                                onChange={(e) => setDueDate(e.target.value)} 
                            />
                            <button onClick={handleUpdateDueDate}>Actualizar</button>
                            </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModalDueDate(false)}>
                    Cerrar
                </Button>
                </Modal.Footer>
                </Modal>

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
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(attendances).map(([date, count], index) => (
                                    <tr key={index}>
                                        <td>{date}</td>
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

export default UserGymAttendance;
