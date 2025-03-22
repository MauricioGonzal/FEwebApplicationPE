import { useState } from "react";
import { Container, Form, Button, Table, Card, Row, Col, Modal } from "react-bootstrap";
import api from "../Api";
import { toast } from 'react-toastify';
import ErrorModal from "../components/ErrorModal";

const CreateMonthlyClosure = () => {
  const [totals, setTotals] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalData, setModalData] = useState([]);
  const [modalColumns, setModalColumns] = useState([]);
  const [modalFields, setModalFields] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];


  const handleCalcular = () => {
    api.get(`/cash-closure/calculate/monthly?month=${selectedMonth}`)
      .then(response => setTotals(response.data))
      .catch(error => console.error("Error al calcular totales", error));
  };

  const handleVerDetalles = (category) => {
    setModalTitle(category);
    var data = [];
    switch (category) {
      case "Gastos Fijos":
        setModalColumns(["Descripcion", "Monto Mensual"]);
        data = totals.fixedExpenses;
        setModalFields(["name", "monthlyAmount"]);
        break;
      case "Total Ingresos":
        setModalColumns(["Categoria", "Usuario", "Membresia", "Monto"]);
        data = totals.ingresos;
        setModalFields(["transactionCategory.name", "user.fullName", "membership.name", "amount"]);
        break;
      case "Total Egresos":
        setModalColumns(["Descripcion", "Monto"]);
        data = totals.egresos;
        setModalFields(["comment", "amount"]);
        break;
      case "Total Salarios":
        setModalColumns(["Empleado", "Monto"]);
        data = totals.salarios;
        setModalFields(["user.fullName","amount"]);
        break;
      default:
        return;
    }

    setModalData(data);
    setShowModal(true);
  };

const handleCrearCierre = () => {
      api.post(`/cash-closure/monthlyClosing?month=${selectedMonth}`)
      .then(response =>{
        toast.success("Cierre Mensual creado correctamente", {
          position: "top-right", // Ahora directamente como string
        });
        setTotals(null);
        setSelectedMonth("");
        setShowModal(false);
      })
      .catch((error) => {
        if (error.response && error.response.data) {
            setErrorMessage(error.response.data.message || "Error desconocido");
          } else {
            setErrorMessage("Error al realizar la solicitud");
          }
          setShowErrorModal(true);  // Mostrar modal con el error
    });
      
  };

  return (
    <Container className="mt-5">
      <Card className="shadow-sm p-4 mb-4">
        <Row>
          <Col md={5} sm={12}>
            <Form.Group>
              <Form.Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                <option value="">Seleccione un mes</option>
                {months.map((month, index) => (
                  <option key={index} value={index + 1}>{month}</option>
                ))}
              </Form.Select>
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
                {modalColumns.map((item,index) => (
                    <td>{item}</td>
                ))}
              </tr>
            </thead>
            <tbody>
              {modalData.map((item, index) => (
                <tr key={index}>
                    {modalFields.map((field, index) => {
                              const value = field.split('.').reduce((obj, key) => obj?.[key], item);
                              return <td>{value}</td>;
                    })}
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
      <ErrorModal showErrorModal={showErrorModal} setShowErrorModal={setShowErrorModal} errorMessage={errorMessage} />
    </Container>
  );
};

export default CreateMonthlyClosure;
