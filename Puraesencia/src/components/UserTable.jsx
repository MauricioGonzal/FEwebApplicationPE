import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaEdit } from "react-icons/fa";
import api from "../Api";
import { toast } from "react-toastify";
import { Modal, Button, Form} from "react-bootstrap";
import ErrorModal from "../components/ErrorModal";
import CreateUserForm from "../pages/CreateUserForm";

const UserTable = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUserData, setEditUserData] = useState({ fullName: "", email: "", role: "" });

  useEffect(() => {
    api.get("/users/getAllByRole/clients")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error al obtener usuarios", error));
  }, [refresh]);

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleShowModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      api.delete(`/users/${selectedUser.id}`)
        .then(() => {
          toast.success("Usuario eliminado correctamente", { position: "top-right" });
          setRefresh((prev) => !prev);
          setShowModal(false);
        })
        .catch((error) => {
          setErrorMessage(error.response?.data?.message || "Error desconocido");
          setShowErrorModal(true);
          setShowModal(false);
        });
    }
  };

  const handleEditUser = (user) => {
    setEditUserData({ fullName: user.fullName, email: user.email, role: user.role });
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    api.put(`/users/${selectedUser.id}`, editUserData)
      .then(() => {
        toast.success("Usuario actualizado correctamente", { position: "top-right" });
        setRefresh((prev) => !prev);
        setShowEditModal(false);
      })
      .catch((error) => {
        setErrorMessage(error.response?.data?.message || "Error desconocido");
        setShowErrorModal(true);
      });
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Gestión de Usuarios</h2>
      <CreateUserForm/>

      <div className="input-group mb-3">
        <input type="text" className="form-control" placeholder="Buscar usuario..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="table-responsive">
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
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>
                {user.healthRecord === null && (
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={() =>
                              navigate("/create-health-record/" + user.id)
                            }
                          >
                            Cargar Ficha de salud
                          </button>
                        )}
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditUser(user)}>
                    <FaEdit className="me-1" /> Editar
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleShowModal(user)}>
                    <FaTimes className="me-1" /> Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Edición */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre Completo</Form.Label>
              <Form.Control type="text" value={editUserData.fullName} onChange={(e) => setEditUserData({ ...editUserData, fullName: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control type="email" value={editUserData.email} onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Select value={editUserData.role} onChange={(e) => setEditUserData({ ...editUserData, role: e.target.value })} required>
                <option value="client_gym">Miembro Gimnasio</option>
                <option value="client_classes">Miembro Clases</option>
                <option value="client_both">Miembro Ambas</option>
                <option value="trainer">Entrenador</option>
                <option value="receptionist">Asistente Administrativo</option>
                <option value="admin">Administrador</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleSaveEdit}>Guardar Cambios</Button>
        </Modal.Footer>
      </Modal>

            {/* MODAL DE CONFIRMACIÓN */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar al usuario{" "}
          <strong>{selectedUser?.fullName}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteUser}>
            <FaTimes className="me-1" /> Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      <ErrorModal showErrorModal={showErrorModal} setShowErrorModal={setShowErrorModal} errorMessage={errorMessage} />
    </div>
  );
};

export default UserTable;