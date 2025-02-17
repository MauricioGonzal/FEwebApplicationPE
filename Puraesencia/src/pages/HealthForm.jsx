import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import api from "../Api";

const HealthForm = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    age: "",
    preexisting_conditions: "",
    previous_injuries: "",
    previous_surgeries: "",
    current_medication: "",
    allergies: ""
  });

  useEffect(() => {
    if (!userId) return;

    api.get(`/users/getById/${userId}`)
      .then(response => {
        console.log("Usuario obtenido:", response.data);
        setUser(response.data);
      })
      .catch(error => {
        console.error("Error al obtener el usuario", error);
      });
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);

    api.post(`/health-records/create/${userId}`, formData)
    .then(response => {
      navigate('/')
    })
    .catch(error => {
      console.error("Error al guardar ficha de salud", error);
    });
  };

  return (
    <Container className="mt-5 d-flex justify-content-center">
      <Card className="p-4 shadow-lg" style={{ maxWidth: "600px", width: "100%" }}>
        <h2 className="text-center mb-4">Ficha de Salud {user?.fullName || "Cargando..."}</h2>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Edad</Form.Label>
                <Form.Control type="number" name="age" value={formData.age} onChange={handleChange} required />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Condiciones Médicas Preexistentes</Form.Label>
            <Form.Control as="textarea" name="preexisting_conditions" value={formData.preexisting_conditions} onChange={handleChange} rows={2} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Lesiones Previas</Form.Label>
            <Form.Control as="textarea" name="previous_injuries" value={formData.previous_injuries} onChange={handleChange} rows={2} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Cirugías Previas</Form.Label>
            <Form.Control as="textarea" name="previous_surgeries" value={formData.previous_surgeries} onChange={handleChange} rows={2} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Medicación Actual</Form.Label>
            <Form.Control as="textarea" name="current_medication" value={formData.current_medication} onChange={handleChange} rows={2} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Alergias</Form.Label>
            <Form.Control as="textarea" name="allergies" value={formData.allergies} onChange={handleChange} rows={2} />
          </Form.Group>
          <div className="d-flex justify-content-between">
            <Button variant="outline-danger" onClick={() => navigate('/')}>Cancelar</Button>
            <Button variant="primary" type="submit">Guardar</Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default HealthForm;
