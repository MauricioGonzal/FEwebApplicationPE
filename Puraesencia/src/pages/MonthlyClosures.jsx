import { useState, useEffect } from "react";
import { Container, Form, Button, Table, Modal, Card, Row, Col, Alert } from "react-bootstrap";
import api from "../Api";

const MonthlyClosures = () => {
  const [cierres, setCierres] = useState([]);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [detalle, setDetalle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    api.get('/cash-closure/monthly')
      .then(response => setCierres(response.data))
      .catch(error => console.error("Error al cargar los cierres", error));
  }, []);

  const handleBuscar = () => {
    if (!month || !year) {
      alert("Por favor, selecciona un mes y un año.");
      return;
    }

    api.get(`/cash-closure/getByMonthAndYear?month=${month}&year=${year}`)
      .then(response => {
        if (response.data.length === 0) {
          setAlertMessage("No se encontró cierre mensual para la fecha ingresada.");
          setCierres([]);
        } else {
          setAlertMessage("");
          setCierres(response.data);
        }
      })
      .catch(error => {
        console.error("Error al filtrar los cierres", error);
        setAlertMessage("Hubo un error al buscar los cierres.");
      });
  };

  const handleVerDetalles = (cierre) => {
    console.log(cierre);
    setDetalle(cierre);
    setShowModal(true);
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4 text-center text-primary">Cierres Mensuales</h2>

      {alertMessage && <Alert variant="warning">{alertMessage}</Alert>}

      {/* Formulario de búsqueda */}
      <Card className="shadow-sm p-4 mb-4">
        <Row className="align-items-center">
          <Col md={4} sm={12} className="mb-3 mb-md-0">
            <Form.Group>
              <Form.Label>Mes</Form.Label>
              <Form.Control
                as="select"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                <option value="">Selecciona un mes</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('es-ES', { month: 'long' })}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>

          <Col md={4} sm={12} className="mb-3 mb-md-0">
            <Form.Group>
              <Form.Label>Año</Form.Label>
              <Form.Control
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Ejemplo: 2024"
              />
            </Form.Group>
          </Col>

          <Col md={4} sm={12} className="d-flex justify-content-start justify-content-md-end">
            <Button className="w-100 w-md-auto" onClick={handleBuscar}>
              Buscar
            </Button>
          </Col>
        </Row>
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
                <td>{new Date(cierre.startDate + "T00:00:00").toLocaleDateString("es-ES")}</td>
                <td>{new Date(cierre.endDate + "T00:00:00").toLocaleDateString("es-ES")}</td>
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
              <p><strong>Total:</strong> {detalle.discrepancy.toFixed(2)}</p>
              <p><strong>Detalles:</strong></p>
              <ul>
                <li key="sales">Ingresos: {detalle.totalSales.toFixed(2)}</li>
                <li key="payments">Egresos: {detalle.totalPayments.toFixed(2)}</li>
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

export default MonthlyClosures;
