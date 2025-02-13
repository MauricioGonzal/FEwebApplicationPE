import { useState } from "react";
import { Form, Button, InputGroup, Container } from "react-bootstrap";
import { Eye, EyeOff } from "lucide-react";
import jwtDecode from "jwt-decode";
import api from "../Api";
import { useNavigate } from "react-router-dom";

export default function ChangePasswordForm() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setError("");

    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);

    api.post('/users/change-password', {
      userId: decoded.id,
      currentPassword: form.currentPassword,
      newPassword: form.newPassword
    })
      .then(() => {
        navigate('/');
      })
      .catch(error => console.error("Error al crear rutina:", error));
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Form onSubmit={handleSubmit} className="p-4 shadow-lg rounded bg-light w-100" style={{ maxWidth: "400px" }}>
        <h4 className="mb-3 text-center text-primary">🔒 Cambiar Contraseña</h4>
        {error && <p className="text-danger text-center">{error}</p>}
        
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">Contraseña Actual</Form.Label>
          <Form.Control
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            required
            placeholder="Ingresa tu contraseña actual"
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">Nueva Contraseña</Form.Label>
          <InputGroup>
            <Form.Control
              type={showPassword ? "text" : "password"}
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              required
              placeholder="Nueva contraseña"
            />
            <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </Button>
          </InputGroup>
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">Confirmar Nueva Contraseña</Form.Label>
          <Form.Control
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Repite la nueva contraseña"
          />
        </Form.Group>
        
        <Button variant="primary" type="submit" className="w-100 fw-bold">🔄 Actualizar Contraseña</Button>
      </Form>
    </Container>
  );
}
