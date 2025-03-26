import { useState, useEffect } from "react";
import { Container, Form, Button, Table, Modal, Card, Row, Col } from "react-bootstrap";
import api from "../Api";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import ErrorModal from "../components/ErrorModal";

const CierresDiarios = () => {
  const [cierres, setCierres] = useState([]);
  const [fecha, setFecha] = useState("");
  const [detalle, setDetalle] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [refresh, setRefresh] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [cierreAEliminar, setCierreAEliminar] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    api.get('/cash-closure/daily')
      .then(response => setCierres(response.data))
      .catch(error => console.error("Error al cargar los cierres", error));
  }, [refresh]);

  const handleBuscar = () => {
    
    api.get(`/cash-closure/getByDate?date=${fecha}`)
      .then(response => setCierres(response.data))
      .catch(error => console.error("Error al filtrar los cierres", error));
  };

  const handleVerDetalles = (cierre) => {
    setDetalle(cierre);
    setShowModal(true);
  };

  const handleDeleteConfirm = () => {
    if (cierreAEliminar) {
      api.delete(`/cash-closure/${cierreAEliminar.id}`)
        .then(() => {
          toast.success("Cierre eliminado exitosamente", { position: "top-right" });
          setRefresh(prev => !prev);
        })
        .catch(error => {
          if (error.response && error.response.data) {
            setErrorMessage(error.response.data.message || "Error desconocido");
          } else {
            setErrorMessage("Error al realizar la solicitud");
          }
          setShowErrorModal(true);
        })
        .finally(() => {
          setShowConfirmModal(false);
          setCierreAEliminar(null);
        });
    }
  };

  const handleDelete = (cierre) => {
    setCierreAEliminar(cierre);
    setShowConfirmModal(true);
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4 text-center text-primary">Cierres Diarios</h2>

      {/* Formulario de búsqueda */}
      <Card className="shadow-sm p-4 mb-4">
        <Row className="align-items-center">
          <Col md={8} sm={12} className="mb-3 mb-md-0">
            <Form.Group className="d-flex">
              <Form.Label className="me-2">Buscar por Fecha</Form.Label>
              <Form.Control
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4} sm={12} className="d-flex justify-content-start justify-content-md-end">
            <Button className="w-100 w-md-auto" onClick={handleBuscar} disabled={fecha === ''}>
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
              <th>Fecha</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cierres.map((cierre) => (
              <tr key={cierre.id}>
                <td>{new Date(`${cierre.startDate}T00:00:00`).toLocaleDateString('es-ES')}</td>
                <td>{cierre.discrepancy.toFixed(2)}</td>
                <td>
                  <Button variant="info" onClick={() => handleVerDetalles(cierre)} className="me-2">
                    Ver Detalles
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(cierre)}>
                    Eliminar
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
              <p><strong>Ingresos:</strong> ${detalle.totalSales}</p>
              <p><strong>Egresos:</strong> ${detalle.totalPayments}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que quieres eliminar este cierre diario? Esta acción no se puede deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      <ErrorModal showErrorModal={showErrorModal} setShowErrorModal={setShowErrorModal} errorMessage={errorMessage} />
    </Container>
  );
};

export default CierresDiarios;
