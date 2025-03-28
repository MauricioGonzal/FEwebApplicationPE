import { useState, useEffect } from "react";
import { Button, Form, Container, Row, Col, Card, Spinner } from "react-bootstrap";
import api from "../Api";
import { toast } from 'react-toastify';
import ErrorModal from "../components/ErrorModal";
import { MembershipsTable } from "../components/MembershipsTable";
import ConfirmationDeleteModal from "../components/ConfirmationDeleteModal";

const MembershipsPage = () => {
  const [memberships, setMemberships] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [transactionCategories, setTransactionCategories] = useState([]);
  const [editingMembership, setEditingMembership] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [formValues, setFormValues] = useState({ name: "", transactionCategory: "", maxDays: "", maxClasses: "", prices: {} });
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
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
    setLoading(true);
    api.get("/membership/priceList")
      .then((response) => setMemberships(response.data))
      .catch((error) => console.error("Error al obtener membresías", error))
      .finally(() => setLoading(false));
  }, [refresh]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="primary" />
        <span className="ml-2">Cargando...</span>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "transactionCategory") {
      const selectedCategoryObj = transactionCategories.find(cat => cat.id.toString() === value);
      setSelectedCategory(selectedCategoryObj);
      setFormValues(prev => ({ ...prev, transactionCategory: selectedCategoryObj }));
    } else {
      setFormValues(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAmountChange = (e, paymentMethodId) => {
    const { value } = e.target;
    setFormValues(prev => ({
      ...prev,
      prices: {
        ...prev.prices,
        [paymentMethodId]: parseFloat(value)
      }
    }));
  };

  const handleDelete = () => {
    console.log(item);
    api.post('/membership/delete-with-price', item)
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

  const handleEdit = (membership) => {
    setEditingMembership(membership);
  
    // Inicializamos los valores con los campos que pueden ser editados
    const prices = membership.priceLists.reduce((acc, price) => {
      acc[price.paymentMethod.id] = price.amount;
      return acc;
    }, {});
  
    setFormValues({
      name: membership.membership.name,
      transactionCategory: membership.membership.transactionCategory.id,  // solo necesitamos el ID de la categoría
      maxDays: membership.membership.maxDays || "",  // Solo se mostrará si es de tipo "Musculación"
      maxClasses: membership.membership.maxClasses || "",  // Solo se mostrará si es de tipo "Clases"
      prices: prices, // Cargamos los precios correspondientes
    });
  
    // Inicializa la categoría seleccionada
    const selectedCategoryObj = transactionCategories.find(
      (cat) => cat.id === membership.membership.transactionCategory.id
    );
    setSelectedCategory(selectedCategoryObj);
  };
  

  const handleSave = async (event) => {
    event.preventDefault();
    const membershipRequest = {
      name: formValues.name,
      maxDays: selectedCategory?.name === "Musculación" ? formValues.maxDays : null,
      maxClasses: selectedCategory?.name === "Clases" ? formValues.maxClasses : null,
      transactionCategory: selectedCategory,
      prices: formValues.prices
    };

    if (editingMembership) {
      api.put('/membership/update/' + editingMembership.membership.id, membershipRequest)
        .then(() => {
          toast.success("Membresía editada correctamente");
          setRefresh(prev => !prev);
        })
        .catch((error) => {
          setErrorMessage(error.response?.data?.message || "Error desconocido");
          setShowErrorModal(true);
        });
    } else {
      console.log(membershipRequest);
      api.post('/membership/create-membership-price', membershipRequest)
        .then(() => {
          toast.success("Membresía creada correctamente");
          setRefresh(prev => !prev);
        })
        .catch((error) => {
          setErrorMessage(error.response?.data?.message || "Error desconocido");
          setShowErrorModal(true);
        });
    }

    // Reset form
    setFormValues({ name: "", transactionCategory: "", maxDays: "", maxClasses: "", prices: {} });
    setSelectedCategory("");
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

                {(selectedCategory?.name === "Musculación" || selectedCategory?.name === "Musculacion + Clases") && (
                  <Form.Group className="mb-3">
                    <Form.Label>Cantidad de días</Form.Label>
                    <Form.Control
                      type="number"
                      name="maxDays"
                      value={formValues.maxDays}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                )}

                {(selectedCategory?.name === "Clases" || selectedCategory?.name === "Musculacion + Clases") && (
                  <Form.Group className="mb-3">
                    <Form.Label>Cantidad de clases</Form.Label>
                    <Form.Control
                      type="number"
                      name="maxClasses"
                      value={formValues.maxClasses}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                )}

                {paymentMethods.map((paymentMethod) => (
                  <Form.Group key={paymentMethod.id} className="mb-3">
                    <Form.Label>Monto ({paymentMethod.name})</Form.Label>
                    <Form.Control
                      type="number"
                      name={`amount-${paymentMethod.id}`}
                      value={formValues.prices[paymentMethod.id] || ""}
                      onChange={(e) => handleAmountChange(e, paymentMethod.id)}
                    />
                  </Form.Group>
                ))}

                <Button type="submit" variant="primary" block>{editingMembership ? "Actualizar" : "Crear"}</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <ConfirmationDeleteModal showModal={showModal} setShowModal={setShowModal} message={`Seguro que quieres eliminar la membresía ${item?.membership.name}`} handleDelete={handleDelete} />
      <MembershipsTable memberships={memberships} handleEdit={handleEdit} paymentMethods={paymentMethods} handleShowModal={handleShowModal}/>
      <ErrorModal showErrorModal={showErrorModal} setShowErrorModal={setShowErrorModal} errorMessage={errorMessage} />
    </Container>
  );
};

export default MembershipsPage;
