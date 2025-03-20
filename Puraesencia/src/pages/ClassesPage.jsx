import React, { useState, useEffect } from "react";
import { Form, Button, Container, Table } from "react-bootstrap";
import api from "../Api";
import ErrorModal from "../components/ErrorModal";
import { toast } from 'react-toastify';

const ClassesPage = () => {

  const [classes, setClasses] = useState([]);
  const [name, setName] = useState("");

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [refresh, setRefresh] = useState(false);

useEffect(() => {
    api.get('/classTypes')
        .then((response) =>{ 
            setClasses(response.data);
        })
        .catch((error) => console.error("Error al obtener clases", error));
}, [refresh]);

  const handleSubmit = (e) => {
    e.preventDefault();

    api.post('/classTypes', {
        name: name,
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
        <Button variant="primary" type="submit" className="w-100 mt-3">
          Crear Clase
        </Button>
      </Form>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Nombre</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((classItem) => (
            <tr key={classItem.id}>
              <td>{classItem.name}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ErrorModal showErrorModal={showErrorModal} setShowErrorModal={setShowErrorModal} errorMessage={errorMessage} />
    </Container>
  );
};

export default ClassesPage;
