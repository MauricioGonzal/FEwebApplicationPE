import { useState, useEffect } from "react";
import { Container, Form, Button, Table, Modal, Card, Row, Col } from "react-bootstrap";
import api from "../Api";
import { useNavigate } from "react-router-dom";

const MonthlyCLosures = () => {
  const [cierres, setCierres] = useState([]);
  const [fecha, setFecha] = useState("");
  const [detalle, setDetalle] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    api.get('/cash-closure/monthly')
      .then(response => setCierres(response.data))
      .catch(error => console.error("Error al cargar los cierres", error));
  }, []);

  const handleBuscar = () => {
    api.get(`/cierres?fecha=${fecha}`)
      .then(response => setCierres(response.data))
      .catch(error => console.error("Error al filtrar los cierres", error));
  };

  const handleVerDetalles = (cierre) => {
    setDetalle(cierre);
    setShowModal(true);
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4 text-center text-primary">Cierres Mensuales</h2>

      {/* Formulario de búsqueda con un diseño más integrado */}
      <Card className="shadow-sm p-4 mb-4">
        <Row className="align-items-center">
          <Col md={8} sm={12} className="mb-3 mb-md-0">
            <Form.Group className="d-flex">
              <Form.Label className="me-2">Buscar por Mes</Form.Label>
              <Form.Control
                type="input"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4} sm={12} className="d-flex justify-content-start justify-content-md-end">
            <Button className="w-100 w-md-auto" onClick={handleBuscar}>
              Buscar
            </Button>
          </Col>
        </Row>
        <Button 
          variant="outline-primary" 
          className="btn-sm mt-3 w-100 w-md-auto" 
          onClick={() => navigate('/')}
        >
          Volver al Dashboard
        </Button>
      </Card>

      {/* Tabla de cierres */}
      <Card className="shadow-sm p-4">
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Desde</th>
              <th>Hasta</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cierres.map((cierre) => (
              <tr key={cierre.id}>
                <td>{new Date(cierre.startDate).toLocaleDateString('es-ES')}</td>
                <td>{new Date(cierre.endDate).toLocaleDateString('es-ES')}</td>
                <td>{cierre.discrepancy.toFixed(2)}</td>
                <td>
                  <Button variant="info" onClick={() => handleVerDetalles(cierre)}>
                    Ver Detalles
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* Modal de detalles */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Cierre</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detalle && (
            <div>
              <p><strong>Fecha:</strong> {new Date(detalle.fecha).toLocaleDateString('es-ES')}</p>
              <p><strong>Total:</strong> {detalle.total.toFixed(2)}</p>
              <p><strong>Detalles:</strong></p>
              <ul>
                {detalle.items.map((item, index) => (
                  <li key={index}>{item.descripcion}: {item.monto.toFixed(2)}</li>
                ))}
              </ul>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MonthlyCLosures;
