import { useState, useEffect } from "react";
import { Table, Button, Form, Container, Row, Col, Card } from "react-bootstrap";
import api from "../Api";
import { toast } from 'react-toastify';
import ErrorModal from "../components/ErrorModal";
import styles from '../css/MembershipsPage.module.css';  // Importa el módulo CSS
import ConfirmationDeleteModal from "../components/ConfirmationDeleteModal";

const MembershipsPage = () => {
  const [memberships, setMemberships] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [transactionCategories, setTransactionCategories] = useState([]);
  const [editingMembership, setEditingMembership] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [formValues, setFormValues] = useState({ name: "", transactionCategory: "", maxDays: "", maxClasses: "", amount: "", paymentMethod:"" });
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [item, setItem] = useState(null);

  useEffect(() => {
    api.get("/transaction-categories/payments")
      .then((response) => setTransactionCategories(response.data))
      .catch((error) => console.error("Error al obtener categorías de transacción", error));

    api.get("/payment-methods")
    .then((response) => setPaymentMethods(response.data))
    .catch((error) => console.error("Error al obtener métodos de pago", error));
  }, []);

  useEffect(() => {
    api.get("/membership/priceList")
      .then((response) => {
        setMemberships(response.data);
      })
      .catch((error) => console.error("Error al obtener membresías", error));
  }, [refresh]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(formValues);

    if (name === "transactionCategory") {
      const selectedCategoryObj = transactionCategories.find(cat => cat.id.toString() === value);
      console.log(selectedCategoryObj)
      setSelectedCategory(selectedCategoryObj);
      setFormValues(prev => ({ ...prev, transactionCategory: selectedCategoryObj }));
    } 
    else if (name === "paymentMethod") {
      const selectedPaymentObj = paymentMethods.find(pm => pm.id.toString() === value);
      console.log(selectedPaymentObj)
      setSelectedPaymentMethod(selectedPaymentObj);
      setFormValues(prev => ({ ...prev, paymentMethod: selectedPaymentObj }));
    } 
    else {
      setFormValues(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    console.log(formValues);
    if(editingMembership){
      api.put('/membership/update/' + editingMembership.membership.id, {"data":formValues, "membershipResponse":editingMembership})
      .then((response) => {
        toast.success("Membresía editada correctamente", {
          position: "top-right",
        });
        setRefresh(prev => !prev);
      })
      .catch((error) => {
        setErrorMessage(error.response?.data?.message || "Error desconocido");
        setShowErrorModal(true);
      });
    }
    else{
      api.post('/membership/create-membership-price', formValues)
      .then((response) => {
        toast.success("Membresía creada correctamente", {
          position: "top-right",
        });
        setRefresh(prev => !prev);
      })
      .catch((error) => {
        setErrorMessage(error.response?.data?.message || "Error desconocido");
        setShowErrorModal(true);
      });
    }

    setFormValues({ name: "", transactionCategory: "", maxDays: "", maxClasses: "", amount: "", paymentMethod:"" });
    setSelectedCategory("");
    setSelectedPaymentMethod("");
  };

  const handleEdit = (membership) => {
    setEditingMembership(membership);
    setFormValues({ 
      name: membership.membership.name, 
      transactionCategory: membership.membership.transactionCategory, 
      maxDays: membership.membership.maxDays, 
      maxClasses: membership.membership.maxClasses, 
      amount: membership.priceList.amount, 
      paymentMethod: membership.priceList.paymentMethod 
    });
    setSelectedCategory(membership.membership.transactionCategory);
    setSelectedPaymentMethod(membership.priceList.paymentMethod);
  };

  const handleDelete = () => {
    console.log(item);
    api.post(`/membership/delete-with-price`, item)
    .then(() => {
      setRefresh(prev => !prev); // Refresca el estado después de eliminar
      toast.success("Membresía eliminada exitosamente");
      setShowModal(false);
    })
    .catch((error) => {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || "Error desconocido");
      } else {
        setErrorMessage("Error al realizar la solicitud");
      }
      setShowErrorModal(true);
      setShowModal(false);
    });
  };

  const handleShowModal = (item) => {
    setItem(item);
    setShowModal(true);
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <h3 className="text-center mb-4">{editingMembership ? "Editar Membresía" : "Crear Membresía"}</h3>
              <Form onSubmit={handleSave}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control name="name" value={formValues.name} onChange={handleInputChange} required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Categoría</Form.Label>
                  <Form.Select name="transactionCategory" value={selectedCategory?.id || ""} onChange={handleInputChange} required>
                    <option value="">Seleccione una categoría</option>
                    {transactionCategories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Forma de pago</Form.Label>
                  <Form.Select name="paymentMethod" value={selectedPaymentMethod?.id || ""} onChange={handleInputChange} required>
                    <option value="">Seleccione una forma de pago</option>
                    {paymentMethods.map((paymentMethod) => (
                      <option key={paymentMethod.id} value={paymentMethod.id}>{paymentMethod.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {(selectedCategory?.name === "Musculacion + Clases" || selectedCategory?.name === "Musculación") && (
                  <Form.Group className="mb-3">
                    <Form.Label>Máx. Días</Form.Label>
                    <Form.Control type="number" name="maxDays" value={formValues.maxDays} onChange={handleInputChange} required />
                  </Form.Group>
                )}

                {(selectedCategory?.name === "Musculacion + Clases" || selectedCategory?.name === "Clases") && (
                  <Form.Group className="mb-3">
                    <Form.Label>Máx. Clases</Form.Label>
                    <Form.Control type="number" name="maxClasses" value={formValues.maxClasses} onChange={handleInputChange} required />
                  </Form.Group>
                )}

                <Form.Group className="mb-3">
                  <Form.Label>Valor</Form.Label>
                  <Form.Control type="number" name="amount" value={formValues.amount} onChange={handleInputChange} required />
                </Form.Group>

                <Button type="submit" variant="primary" block="true">{editingMembership ? "Actualizar" : "Crear"}</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Table striped bordered hover className={`${styles.table} mt-4`} >
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Máx. Días</th>
            <th>Máx. Clases</th>
            <th>Valor</th>
            <th>Forma de pago</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {memberships.map((record) => (
            <tr key={record.membership.id}>
              <td>{record.membership.name}</td>
              <td>{record.membership.transactionCategory.name}</td>
              <td>{record.membership.maxDays || "-"}</td>
              <td>{record.membership.maxClasses || "-"}</td>
              <td>${record.priceList.amount}</td>
              <td>{record.priceList.paymentMethod.name}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(record)}>Editar</Button>
                <Button variant="danger" onClick={() => handleShowModal(record)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ConfirmationDeleteModal showModal={showModal} setShowModal={setShowModal} message={`Seguro que quieres eliminar la membresía ${item?.membership.name}`} handleDelete= {handleDelete}   /> 
      <ErrorModal showErrorModal={showErrorModal} setShowErrorModal={setShowErrorModal} errorMessage={errorMessage} />
    </Container>
  );
};

export default MembershipsPage;
