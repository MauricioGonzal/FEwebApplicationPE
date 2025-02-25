import api from "../Api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Button, Form } from "react-bootstrap";
import { FaUserPlus, FaTimes } from "react-icons/fa";
import Select from "react-select";


const CreateUserForm = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client_gym');
  const [memberships, setMemberships] = useState([]);
  const [selectedMembership, setSelectedMembership] = useState([]);

  const navigate = useNavigate();

  
  useEffect(() => {
    api.get('/membership')
        .then((response) =>{ 
          setMemberships(response.data);
        }
        )
        .catch((error) => console.error("Error al categorias de membresias", error));
}, []);

  const handleSubmit = (e) => {
    e.preventDefault();

console.log(selectedMembership);

    api.post('/users', { fullName, email, password, role: role.toUpperCase(), membership: selectedMembership.value })
      .then(() => {
        setSelectedMembership([]);
        alert("Usuario creado exitosamente!");
        navigate('/');
      })
      .catch((error) => {
        console.error("Error al crear usuario", error);
        alert("Hubo un error al crear el usuario.");
      });
  };


  const membershipsOptions = memberships.map(m => ({
    value: m,
    label: m.name
  }));
  

  return (
    <div className="container mt-5">
      <Card className="shadow-lg p-4">
        <h2 className="text-center mb-4 text-primary">Crear Usuario</h2>
        
        {/* Barra de progreso */}
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
                  <option value="client_gym">Miembro Gimnasio</option>
                  <option value="client_classes">Miembro Clases</option>
                  <option value="client_both">Miembro Ambas</option>
                  <option value="trainer">Entrenador</option>
                  <option value="receptionist">Asistente Administrativo</option>
                  <option value="admin">Administrador</option>
                </Form.Select>
              </Form.Group>
            </Col>
            {(role === "client_classes" || role === "client_both") && 
                        <Select
                        options={membershipsOptions}
                        value={selectedMembership}
                        onChange={(selectedOption) => {setSelectedMembership(selectedOption)}}
                        placeholder="Seleccionar membresia..."
                        isSearchable
                    />
            }

          </Row>
          <hr />
          <div className="d-flex justify-content-between mt-4">
            <Button variant="outline-danger" onClick={() => navigate('/')} className="d-flex align-items-center">
              <FaTimes className="me-2" /> Cancelar
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
