import { useState } from "react";
import { Container, Form, Button, Table, Card, Row, Col, Modal } from "react-bootstrap";
import api from "../Api";

const CreateMonthlyClosure = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totals, setTotals] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalData, setModalData] = useState([]);

  const handleCalcular = () => {
    api.get(`/cash-closure/calculate?startDate=${startDate}&endDate=${endDate}`)
      .then(response => setTotals(response.data))
      .catch(error => console.error("Error al calcular totales", error));
  };

  const handleVerDetalles = (category) => {
    let endpoint = "";
    switch (category) {
      case "Gastos Fijos":
        endpoint = "/fixed-expenses/active";
        break;
      case "Total Ingresos":
        endpoint = "/income/details";
        break;
      case "Total Egresos":
        endpoint = "/expenses/details";
        break;
      case "Total Salarios":
        endpoint = "/salaries/details";
        break;
      default:
        return;
    }

    api.get(endpoint)
      .then(response => {
        setModalTitle(category);
        setModalData(response.data);
        setShowModal(true);
      })
      .catch(error => console.error(`Error al obtener detalles de ${category}`, error));
  };

  const handleCrearCierre = () => {
    api.post("/cash-closure/create", { startDate, endDate })
      .then(response => alert("Cierre mensual creado exitosamente"))
      .catch(error => console.error("Error al crear el cierre mensual", error));
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4 text-center text-primary">Cierre Mensual</h2>

      <Card className="shadow-sm p-4 mb-4">
        <Row>
          <Col md={5} sm={12}>
            <Form.Group>
              <Form.Label>Desde</Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={5} sm={12}>
            <Form.Group>
              <Form.Label>Hasta</Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={2} sm={12} className="d-flex align-items-end">
            <Button className="w-100" onClick={handleCalcular}>
              Calcular
            </Button>
          </Col>
        </Row>
      </Card>

      {totals && (
        <Card className="shadow-sm p-4">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Categoría</th>
                <th>Monto</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Total Ingresos", value: totals.totalIngresos },
                { name: "Total Egresos", value: totals.totalEgresos },
                { name: "Total Salarios", value: totals.totalSalarios },
                { name: "Gastos Fijos", value: totals.totalFixedExpenses }
              ].map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.value.toFixed(2)}</td>
                  <td>
                    <Button variant="info" onClick={() => handleVerDetalles(item.name)}>
                      Ver
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="text-center mt-3">
            <Button variant="success" onClick={handleCrearCierre}>
              Crear
            </Button>
          </div>
        </Card>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles de {modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Descripción</th>
                <th>Monto</th>
              </tr>
            </thead>
            <tbody>
              {modalData.map((item, index) => (
                <tr key={index}>
                  <td>{item.description}</td>
                  <td>{item.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
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

export default CreateMonthlyClosure;
