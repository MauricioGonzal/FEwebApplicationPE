import React, { useState, useEffect } from "react";
import { Form, Button, Container, Table } from "react-bootstrap";
import api from "../Api";
import ErrorModal from "../components/ErrorModal";
import Select from "react-select";
import { toast } from 'react-toastify';

const ClassesPage = () => {

  const [instructors, setInstructors] = useState([]);
  const [classes, setClasses] = useState([]);
  const [name, setName] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    api.get('/users/getAllByRole/teacher')
        .then((response) =>{ 
            setInstructors(response.data)}
        )
        .catch((error) => console.error("Error al obtener profesores", error));
}, []);

useEffect(() => {
    api.get('/classTypes')
        .then((response) =>{ 
            setClasses(response.data);
        })
        .catch((error) => console.error("Error al obtener clases", error));
}, [refresh]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Clase creada:", {
        name: name,
        teacher: selectedTeacher
    });
    api.post('/classTypes', {
        name: name,
        teacher: selectedTeacher.value
    })
    .then((response) =>{ 
        toast.success("Clase creada correctamente", {
            position: "top-right", // Ahora directamente como string
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
  };

  const teacherOptions = instructors.map(instructor => ({
    value: instructor, // Guarda el objeto entero en `value`
    label: `${instructor.fullName}`
}));

  return (
    <Container className="mt-4 p-4 bg-light rounded shadow">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre de la clase</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ej. Yoga, Spinning"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Instructor Asignado</Form.Label>
            <Select
                options={teacherOptions}
                value={selectedTeacher}
                onChange={setSelectedTeacher}
                placeholder="Seleccionar instructor..."
                isSearchable
                className="mb-3"
            />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100 mt-3">
          Crear Clase
        </Button>
      </Form>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Instructor</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((classItem) => (
            <tr key={classItem.id}>
              <td>{classItem.name}</td>
              <td>{classItem.teacher.fullName}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ErrorModal showErrorModal={showErrorModal} setShowErrorModal={setShowErrorModal} errorMessage={errorMessage} />
    </Container>
  );
};

export default ClassesPage;
