import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const HealthForm = ({ onSave }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    edad: "",
    peso: "",
    altura: "",
    presion: "",
    condiciones: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Container className="mt-5 d-flex justify-content-center">
      <Card className="p-4 shadow-lg" style={{ maxWidth: "600px", width: "100%" }}>
        <h2 className="text-center mb-4">Ficha de Salud</h2>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Edad</Form.Label>
                <Form.Control type="number" name="edad" value={formData.edad} onChange={handleChange} required />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Peso (kg)</Form.Label>
                <Form.Control type="number" name="peso" value={formData.peso} onChange={handleChange} required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Altura (cm)</Form.Label>
                <Form.Control type="number" name="altura" value={formData.altura} onChange={handleChange} required />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Presión Arterial</Form.Label>
            <Form.Control type="text" name="presion" value={formData.presion} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Condiciones Médicas</Form.Label>
            <Form.Control as="textarea" name="condiciones" value={formData.condiciones} onChange={handleChange} rows={3} />
          </Form.Group>
          <div className="d-flex justify-content-between">
            <Button variant="outline-danger" onClick={() => navigate('/')}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default HealthForm;
