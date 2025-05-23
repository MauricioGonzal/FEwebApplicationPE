import { useEffect, useState } from "react";
import { Table, Spinner, Alert } from "react-bootstrap";
import api from "../Api";


const PaymentsList = () => {
  const [installments, setInstallments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/payment/getbystatus/transaction/pagado")
      .then((response) => {
        setInstallments(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
    });
  }, []);

  return (
    <div className="container mt-4">      
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Fecha de Pago</th>
              <th>Fecha de Vencimiento</th>
              <th>Membresía</th>
              <th>Forma de Pago</th>
              <th>Valor Abonado</th>
            </tr>
          </thead>
          <tbody>
            {installments.map((installment, index) => (
              <tr key={index}>
                <td>{installment.payment.user.fullName}</td>
                <td>{new Date(installment.payment.paymentDate + "T00:00:00").toLocaleDateString("es-ES")}</td>
                <td>{new Date(installment.payment.dueDate + "T00:00:00").toLocaleDateString("es-ES")}</td>
                <td>{installment.payment.membership.name}</td>
                <td>{installment.transaction.paymentMethod.name}</td>
                <td>{installment.transaction.amount}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default PaymentsList;
