import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Importamos el hook useNavigate
import api from "../Api";
import Select from "react-select";
import { Container, Form, Button, Card } from "react-bootstrap";

const PriceForm = ({ onAddPrice }) => {
  const [categories, setCategories] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedPaymentType, setSelectedPaymentType] = useState([]);
  const [amount, setAmount] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedMembership, setSelectedMembership] = useState([]);
  const navigate = useNavigate();  // Inicializamos el hook de navegación

  useEffect(() => {
    api
      .get("/transaction-categories/payments")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener las categorias", error);
      });

    api
      .get("/payment-methods")
      .then((response) => {
        setPaymentTypes(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los medios de pago", error);
    });

    api.get('/membership')
    .then((response) =>{ 
        setMemberships(response.data);
    }
    )
    .catch((error) => console.error("Error al obtener categorias de transacciones", error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
      onAddPrice({
        transactionCategory: selectedCategory.value,
        paymentMethod: selectedPaymentType.value,
        amount: amount,
        product: selectedProduct?.value,
        membership: selectedMembership?.value,
        validFrom: new Date().toISOString().split("T")[0],
        isActive: true
      });

      setAmount(0);
      setSelectedCategory([]);
      setSelectedMembership([]);
      setSelectedPaymentType([]);
      setSelectedProduct([]);
      
    
  };

  const handleGoBack = () => {
    navigate('/');  // Redirige a la pantalla principal
  };

  const transactionCategoryOptions = categories.map(category => ({
      value: category,
      label: category.name
  }));

  const paymentTypesOptions = paymentTypes.map(paymentType => ({
      value: paymentType,
      label: paymentType.name
  }));

  const membershipGimOptions = memberships.filter(membership => membership.maxDays !== null).map(membership => ({
      value: membership,
      label: membership.name
  }));

  const membershipClassesOptions = memberships.filter(membership => membership.maxClasses !== null).map(membership => ({
      value: membership,
      label: membership.maxClasses
  }));

  return (
    <Container className="mt-4 mb-5">
      <Card className="shadow-lg border-0 rounded-4">

        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {/* Categoría de transacción */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Categoría</Form.Label>
              <Select
                options={transactionCategoryOptions}
                value={selectedCategory}
                onChange={setSelectedCategory}
                placeholder="Seleccionar categoría..."
                isSearchable
                className="border rounded"
              />
            </Form.Group>

            {/* Medio de pago */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Medio de Pago</Form.Label>
              <Select
                options={paymentTypesOptions}
                value={selectedPaymentType}
                onChange={setSelectedPaymentType}
                placeholder="Seleccionar medio de pago..."
                isSearchable
                className="border rounded"
              />
            </Form.Group>

            {/* Monto */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Monto</Form.Label>
              <Form.Control
                type="number"
                placeholder="Ingrese el monto..."
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="rounded-3"
              />
            </Form.Group>

            {/* Membresía - Musculación */}
            {selectedCategory?.value?.name === "Musculación" && (
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Cantidad de días</Form.Label>
                <Select
                  options={membershipGimOptions}
                  value={selectedMembership}
                  onChange={setSelectedMembership}
                  placeholder="Seleccionar cantidad de días..."
                  isSearchable
                  className="border rounded"
                />
              </Form.Group>
            )}

            {/* Membresía - Clases */}
            {selectedCategory?.value?.name === "Clases" && (
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Cantidad de Clases</Form.Label>
                <Select
                  options={membershipClassesOptions}
                  value={selectedMembership}
                  onChange={setSelectedMembership}
                  placeholder="Seleccionar cantidad de clases..."
                  isSearchable
                  className="border rounded"
                />
              </Form.Group>
            )}

            <div className='d-flex justify-content-between mt-4'>
              <Button variant="outline-secondary" className="mt-3 py-2" onClick={handleGoBack}>
                Volver a la pantalla principal
              </Button>
              <Button type="submit" variant="primary" className="mt-3 py-2" disabled={selectedCategory.length === 0 || selectedPaymentType.length === 0 || amount === 0 || amount === "" || selectedMembership.length === 0}>
                Agregar Precio
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PriceForm;
