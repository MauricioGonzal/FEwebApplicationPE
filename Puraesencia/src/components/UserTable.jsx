import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import api from "../Api";
import { toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";
import ErrorModal from "../components/ErrorModal";


const UserTable = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  

  useEffect(() => {
    api.get("/users/getAllByRole/clients")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error al obtener usuarios", error));
  }, [refresh]);

  const filteredUsers =
    search.trim().length > 0
      ? users.filter(
          (user) =>
            user.fullName.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
        )
      : [];

  const handleShowModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      api.delete(`/users/${selectedUser.id}`)
        .then(() => {
          toast.success("Usuario eliminado correctamente", {
            position: "top-right",
          });
          setRefresh((prev) => !prev);
          setShowModal(false);
        })
        .catch((error) =>{
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.message || "Error desconocido");
              } else {
                setErrorMessage("Error al realizar la solicitud");
              }
              setShowErrorModal(true);
              setShowModal(false);
        });
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Gestión de Usuarios</h2>

      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar usuario por nombre o correo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="input-group-text">
          <i className="bi bi-search"></i>
        </span>
      </div>

      {search.trim().length > 0 && (
        <>
          {filteredUsers.length > 0 ? (
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
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleShowModal(user)}
                        >
                          <FaTimes className="me-1" /> Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-muted">No se encontraron usuarios.</p>
          )}
        </>
      )}

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
