import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Table, Form, Modal, InputGroup, FormControl } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Usando iconos de React Icons
import api from '../Api'; 
import { toast } from 'react-toastify';
import '../css/CreateExercise.css'; // Archivo CSS para agregar estilo
import ConfirmationDeleteModal from "../components/ConfirmationDeleteModal";

const CreateExercise = () => {
  const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [item, setItem] = useState(null);
  
  // Estado para el formulario de creación
  const [exercise, setExercise] = useState({
    name: '',
    description: '',
    url: ''
  });

  // Estado para almacenar los ejercicios y el buscador
  const [exercises, setExercises] = useState([]);
  const [search, setSearch] = useState('');

  // Estado para el modal de edición
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Manejo de cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setExercise((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleShowModal = (item) => {
    setItem(item);
    setShowModal(true);
  };

  // Manejo del envío del formulario de creación
  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/exercises/create', {
      name: exercise.name,
      description: exercise.description,
      url: exercise.url 
    })
    .then((response) => {
      toast.success("Ejercicio creado correctamente", {
        position: "top-right",
      });
      setExercise({
        name: '',
        description: '',
        url: ''
      });
      loadExercises(); // Cargar nuevamente los ejercicios
    })
    .catch((error) => console.error("Error al cargar los datos:", error));    
  };

  // Cargar los ejercicios desde el endpoint
  const loadExercises = () => {
    api.get('/exercises')
      .then((response) => {
        setExercises(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los ejercicios:", error);
      });
  };

  // Eliminar un ejercicio
  const handleDelete = () => {
    api.delete(`/exercises/${item.id}`)
      .then(() => {
        toast.success("Ejercicio eliminado correctamente", {
          position: "top-right",
        });
        loadExercises(); // Recargar los ejercicios
        setShowModal(false);
      })
      .catch((error) => {
        toast.error("Error al eliminar el ejercicio", {
          position: "top-right",
        });
        console.error("Error al eliminar ejercicio:", error);
        setShowModal(false);
      });
  };

  // Filtrar los ejercicios por nombre
  const filteredExercises = exercises.filter(exercise =>
    exercise.name.toLowerCase().includes(search.toLowerCase())
  );

  // Cargar los ejercicios cuando el componente se monte
  useEffect(() => {
    loadExercises();
  }, []);

  // Manejo del clic en editar
  const handleEditClick = (exercise) => {
    setSelectedExercise(exercise);  // Guardar el ejercicio seleccionado
    setShowEditModal(true);         // Abrir el modal
  };

  // Manejo del cambio en los campos del modal
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedExercise((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  // Guardar cambios del modal de edición
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (selectedExercise) {
      api.put(`/exercises/${selectedExercise.id}`, {
        name: selectedExercise.name,
        url: selectedExercise.url,
        description: selectedExercise.description  // Agregado campo description
      })
      .then(() => {
        toast.success("Ejercicio actualizado correctamente", {
          position: "top-right",
        });
        setShowEditModal(false);  // Cerrar el modal
        loadExercises();          // Recargar los ejercicios
      })
      .catch((error) => {
        toast.error("Error al actualizar el ejercicio", {
          position: "top-right",
        });
        console.error("Error al actualizar ejercicio:", error);
      });
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg border-0 rounded-4 custom-card">
            <div className="card-body">
              <h2 className="text-center mb-4 text-primary">Crear Ejercicio</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Nombre:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control custom-input"
                    value={exercise.name}
                    onChange={handleChange}
                    required
                    placeholder="Ej. Flexiones"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Descripción:</label>
                  <textarea
                    id="description"
                    name="description"
                    className="form-control custom-textarea"
                    value={exercise.description}
                    onChange={handleChange}
                    placeholder="Descripción detallada del ejercicio"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="url" className="form-label">URL (opcional):</label>
                  <input
                    type="url"
                    id="url"
                    name="url"
                    className="form-control custom-input"
                    value={exercise.url}
                    onChange={handleChange}
                    placeholder="Ej. https://ejemplo.com/video"
                  />
                </div>

                <div className="d-flex justify-content-between">
                  <Button variant="secondary" onClick={() => navigate('/')}>
                    Cancelar
                  </Button>
                  <Button variant="primary" type="submit" disabled={exercise.name === ""}>
                    Crear Ejercicio
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Buscador de ejercicios */}
          <div className="mt-5">
            <h3 className="text-center text-primary mb-4">Listado de Ejercicios</h3>
            <InputGroup className="mb-3">
              <InputGroup.Text>
                <i className="fas fa-search"></i>
              </InputGroup.Text>
              <FormControl
                placeholder="Buscar ejercicio..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="custom-search-input"
              />
            </InputGroup>

            <Table striped bordered hover responsive className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredExercises.map(exercise => (
                  <tr key={exercise.id}>
                    <td>{exercise.id}</td>
                    <td>{exercise.name}</td>
                    <td>{exercise.description}</td>
                    <td>
                      <Button 
                        variant="warning" 
                        size="sm" 
                        className="me-2 custom-btn"
                        onClick={() => handleEditClick(exercise)}
                      >
                        <FaEdit />
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm" 
                        className="custom-btn"
                        onClick={() => handleShowModal(exercise)}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
      {/* Modal para editar ejercicio */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar Ejercicio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group controlId="editName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={selectedExercise?.name || ''}
                onChange={handleEditChange}
                required
                className="custom-input"
              />
            </Form.Group>

            <Form.Group controlId="editDescription" className="mt-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={selectedExercise?.description || ''}
                onChange={handleEditChange}
                className="custom-textarea"
              />
            </Form.Group>

            <Form.Group controlId="editUrl" className="mt-3">
              <Form.Label>URL (opcional)</Form.Label>
              <Form.Control
                type="url"
                name="url"
                value={selectedExercise?.url || ''}
                onChange={handleEditChange}
                className="custom-input"
              />
            </Form.Group>

            <div className="d-flex justify-content-end mt-4">
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit" className="ms-2">
                Guardar Cambios
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      <ConfirmationDeleteModal
        showModal={showModal}
        setShowModal={setShowModal}
        message={`Seguro que quieres eliminar el ejercicio ${item?.name}`}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default CreateExercise;
