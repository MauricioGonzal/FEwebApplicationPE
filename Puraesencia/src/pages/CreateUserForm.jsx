import api from "../Api";
import { useState } from "react";
import { Card, Row, Col, Button, Form } from "react-bootstrap";
import { FaUserPlus} from "react-icons/fa";
import { toast } from 'react-toastify';
import ErrorModal from "../components/ErrorModal";
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';


const CreateUserForm = ({setRefresh}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client');

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    console.log(role);

    api.post('/users/byAdmin', { fullName, email, password, role: role.toUpperCase(), adminId: decoded.id})
      .then(() => {
        toast.success("Usuario creado correctamente", {
          position: "top-right", // Ahora directamente como string
        });
        setFullName('');
        setEmail('');
        setPassword('');
        setRole('client');
        setRefresh((prev) => !prev);
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setErrorMessage(error.response.data.message || "Error desconocido");
        } else {
          setErrorMessage("Error al realizar la solicitud");
        }
        setShowErrorModal(true);
        setFullName('');
        setEmail('');
        setPassword('');
        setRole('client');
      });
  };

  const handleGoBack = () => {
    navigate('/');  // Redirige a la pantalla principal
  };
  

  return (
    <div className="container mt-5 mb-5">
      <Card className="shadow-lg p-4">        
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
                  <option value="client">Cliente</option>
                  <option value="trainer">Entrenador</option>
                  <option value="teacher">Profesor</option>
                  <option value="receptionist">Empleado</option>
                  <option value="admin">Administrador</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <hr />
          <div className="d-flex justify-content-between mt-4">
            <Button className="btn btn-secondary mt-3" onClick={handleGoBack}>
              Volver a la pantalla principal
            </Button>
            <Button type="submit" variant="primary" className="d-flex align-items-center" disabled={fullName === '' || email === '' || password === ''}>
              <FaUserPlus className="me-2" /> Crear Usuario
            </Button>
          </div>
        </Form>
      </Card>
      <ErrorModal showErrorModal={showErrorModal} setShowErrorModal={setShowErrorModal} errorMessage={errorMessage} />
    </div>
  );
};

export default CreateUserForm;
