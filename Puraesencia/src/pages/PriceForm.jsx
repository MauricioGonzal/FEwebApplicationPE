import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Importamos el hook useNavigate
import api from "../Api";
import Select from "react-select";

const PriceForm = ({ onAddPrice }) => {
  const [categories, setCategories] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [products, setProducts] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedPaymentType, setSelectedPaymentType] = useState([]);
  const [amount, setAmount] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedMembership, setSelectedMembership] = useState([]);
  const navigate = useNavigate();  // Inicializamos el hook de navegación

  useEffect(() => {
    api
      .get("/transaction-categories")
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

    api
    .get("/products")
    .then((response) => {
      setProducts(response.data);
    })
    .catch((error) => {
      console.error("Error al obtener los productos", error);
    });
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

  const productOptions = products.map(product => ({
    value: product, 
    label: product.name
  }));

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
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header text-center">
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Campos de formulario */}
            <div className="mb-3">
              <Select
                options={transactionCategoryOptions}
                value={selectedCategory}
                onChange={(selectedOption) => {setSelectedCategory(selectedOption)}}
                placeholder="Seleccionar categoria..."
                isSearchable
              />
            </div>

            <div className="mb-3">
              <Select
                options={paymentTypesOptions}
                value={selectedPaymentType}
                onChange={(selectedOption) => {setSelectedPaymentType(selectedOption)}}
                placeholder="Seleccionar medio de pago..."
                isSearchable
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Monto</label>
              <input
                type="number"
                className="form-control"
                placeholder="Ingrese el monto..."
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {selectedCategory.value?.name === "Producto" && (
              <div className="mb-3">
                <Select
                  options={productOptions}
                  value={selectedProduct}
                  onChange={(selectedOption) => {setSelectedProduct(selectedOption)}}
                  placeholder="Seleccionar producto..."
                  isSearchable
                />
              </div>
            )}

            {selectedCategory.value?.name === "Musculación" && (
              <div className="mb-3">
                <Select
                  options={membershipGimOptions}
                  value={selectedMembership}
                  onChange={(selectedOption) => {setSelectedMembership(selectedOption)}}
                  placeholder="Seleccionar cantidad de dias..."
                  isSearchable
                />
              </div>
            )}
              
            {selectedCategory.value?.name === "Clases" && (
              <div className="mb-3">
                <Select
                  options={membershipClassesOptions}
                  value={selectedMembership}
                  onChange={(selectedOption) => {setSelectedMembership(selectedOption)}}
                  placeholder="Seleccionar cantidad de clases..."
                  isSearchable
                />
              </div>
            )}

            <button type="submit" className="btn btn-primary w-100">
              Agregar Precio
            </button>
          </form>

          {/* Botón para volver a la pantalla principal */}
          <button className="btn btn-secondary mt-3 w-100" onClick={handleGoBack}>
            Volver a la pantalla principal
          </button>
        </div>
      </div>
    </div>
  );
};

export default PriceForm;
