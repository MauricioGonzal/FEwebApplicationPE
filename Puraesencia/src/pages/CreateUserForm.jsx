import api from "../Api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Button, Form, ProgressBar } from "react-bootstrap";
import { FaUserPlus, FaSave, FaTimes } from "react-icons/fa";

const CreateUserForm = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client');

  // Ficha de salud
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [healthConditions, setHealthConditions] = useState('');

  const [healthRecordId, setHealthRecordId] = useState(null);
  const navigate = useNavigate();

  const handleHealthRecordSubmit = () => {
    const fichaData = { height, weight, bloodType, healthConditions };

    api.post('/health-records', fichaData)
      .then((response) => {
        setHealthRecordId(response.data.id);
        alert("Ficha de salud guardada.");
      })
      .catch((error) => {
        console.error("Error al guardar ficha de salud", error);
        alert("Hubo un error al guardar la ficha de salud.");
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!healthRecordId) {
      alert("Primero debe crear una ficha de salud.");
      return;
    }

    api.post('/users', { fullName, email, password, role: role.toUpperCase(), healthRecordId })
      .then(() => {
        alert("Usuario creado exitosamente!");
        navigate('/');
      })
      .catch((error) => {
        console.error("Error al crear usuario", error);
        alert("Hubo un error al crear el usuario.");
      });
  };

  return (
    <div className="container mt-5">
      <Card className="shadow-lg p-4">
        <h2 className="text-center mb-4 text-primary">Crear Usuario</h2>
        
        {/* Barra de progreso */}
        <ProgressBar now={healthRecordId ? 100 : 50} className="mb-3" variant={healthRecordId ? "success" : "warning"} />

        <Form onSubmit={handleSubmit}>
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre completo</Form.Label>
                <Form.Control type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Correo electrónico</Form.Label>
                <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Rol</Form.Label>
                <Form.Select value={role} onChange={(e) => setRole(e.target.value)} required>
                  <option value="client">Miembro</option>
                  <option value="trainer">Entrenador</option>
                  <option value="admin">Administrador</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <h4 className="mt-4 text-success">Ficha de Salud</h4>
          <hr />

          <Row className="mb-4">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Altura (cm)</Form.Label>
                <Form.Control type="number" value={height} onChange={(e) => setHeight(e.target.value)} required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Peso (kg)</Form.Label>
                <Form.Control type="number" value={weight} onChange={(e) => setWeight(e.target.value)} required />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tipo de sangre</Form.Label>
                <Form.Control type="text" value={bloodType} onChange={(e) => setBloodType(e.target.value)} required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Condiciones de salud</Form.Label>
                <Form.Control as="textarea" value={healthConditions} onChange={(e) => setHealthConditions(e.target.value)} required />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-between mt-4">
            <Button variant="outline-danger" onClick={() => navigate('/')} className="d-flex align-items-center">
              <FaTimes className="me-2" /> Cancelar
            </Button>

            <Button variant="success" onClick={handleHealthRecordSubmit} className="d-flex align-items-center">
              <FaSave className="me-2" /> Guardar Ficha de Salud
            </Button>

            <Button type="submit" variant="primary" className="d-flex align-items-center">
              <FaUserPlus className="me-2" /> Crear Usuario
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default CreateUserForm;
