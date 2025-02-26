import { useState, useEffect } from "react";
import { Container, Form, Button, Alert, Table, ListGroup, Modal } from "react-bootstrap";
import api from "../Api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";



const CreateSalary = () => {
  const [user, setUser] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [salaries, setSalaries] = useState([]); // Estado para los salarios
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [newAmount, setNewAmount] = useState("");
  
  
  

  const navigate = useNavigate();


  useEffect(() => {
    // Cargar los usuarios desde la API
    api.get('/users/getForSalary')
      .then((response) => {
        setUsers(response.data);
      })
      .catch((err) => console.error("Error al cargar los usuarios", err));

    // Cargar los salarios activos desde la API
    api.get('/salaries')
      .then((response) => {
        setSalaries(response.data); // Establecer los salarios en el estado
      })
      .catch((err) => console.error("Error al cargar los salarios", err));
  }, []);

  useEffect(() => {
    // Filtrar los usuarios cuando el texto de búsqueda cambie
    if (search) {
      setFilteredUsers(
        users.filter(user =>
          user.fullName.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setFilteredUsers([]);
    }
  }, [search, users]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    console.log(user.id);
    console.log(amount);
    api.post(`/salaries?userId=${user.id}&amount=${amount}`)
      .then(() => {
        setMessage(`Salario creado correctamente para el empleado ID: ${user.id}`);
        setUser("");
        setAmount("");
        setSearch("");  // Limpiar el campo de búsqueda después de enviar
        // Refrescar la lista de salarios después de crear uno nuevo
        api.get('/salaries')
          .then((response) => {
            setSalaries(response.data);
          })
          .catch((err) => console.error("Error al obtener los salarios", err));
      })
      .catch((error) => {
        setError("Error al crear el salario");
        console.error("Error al crear el salario", error);
      });
  };

  const handleUserSelect = (user, fullName) => {
    setUser(user);  // Establecer el ID del empleado
    setSearch(fullName); // Establecer el nombre completo en el campo de búsqueda
    setFilteredUsers([]); // Limpiar la lista de usuarios filtrados para que desaparezca
  };

  const handleDelete = (id) => {
    setSalaries(salaries.filter((salary) => salary.id !== id));
  };

  const handleEditClick = (salary) => {
    setSelectedSalary(salary);
    setNewAmount(salary.amount);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!selectedSalary || newAmount === "") return;

    api
      .put(`/salaries/${selectedSalary.id}/updateAmount`, newAmount)
      .then((response) => {
        setShowEditModal(false);
        console.log(salaries);
        api.get('/salaries')
        .then((response) => {
          setSalaries(response.data);
        })
        .catch((err) => console.error("Error al obtener los salarios", err));
        toast.success("Salario actualizado correctamente", { position: "top-right" });
      })
      .catch((error) => {
        setErrorMessage(error.response?.data?.error || "Error al realizar la solicitud");
        setShowErrorModal(true);
      });
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Crear Salario</h2>

      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-4">
          <Form.Label>Buscar Empleado</Form.Label>
          <Form.Control
            type="text"
            placeholder="Escribe el nombre del empleado"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          {/* Mostrar la lista de usuarios filtrados solo si hay texto en el campo de búsqueda */}
          {search && filteredUsers.length > 0 && (
            <ListGroup className="mt-2 shadow-sm" style={{ maxHeight: '200px', overflowY: 'scroll' }}>
              {filteredUsers.map((user) => (
                <ListGroup.Item
                  key={user.id}
                  onClick={() => handleUserSelect(user, user.fullName)}
                  style={{ cursor: "pointer" }}
                >
                  {user.fullName}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Monto del Salario</Form.Label>
          <Form.Control
            type="number"
            placeholder="Ingrese el monto del salario"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100" disabled={!user || !amount}>
            Crear Salario
        </Button>
        <Button variant="secondary" className="mt-3" onClick={() => navigate('/')}>
            Volver al Dashboard
        </Button>
        
      </Form>

      <h3 className="mt-5">Salarios Activos</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID Empleado</th>
            <th>Empleado</th>
            <th>Salario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {salaries.length > 0 ? (
            salaries.map((salary) => (
              <tr key={salary.id}>
                <td>{salary.user.id}</td>
                <td>{salary.user.fullName}</td>
                <td>{salary.amount.toFixed(2)}</td>
                <td>
                    <button className="btn btn-primary btn-sm me-2" onClick={() => handleEditClick(salary)}>
                      Editar
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(salary.id)}>
                      Eliminar
                    </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">No hay salarios activos.</td>
            </tr>
          )}
        </tbody>
      </Table>
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Monto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNewAmount">
              <Form.Label>Nuevo Monto</Form.Label>
              <Form.Control
                type="number"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                min="0"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>

            {/* Modal de Error */}
            <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Error</Modal.Title>
              </Modal.Header>
              <Modal.Body>{errorMessage}</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
                  Cerrar
                </Button>
              </Modal.Footer>
            </Modal>
    </Container>
    
  );
};

export default CreateSalary;
