import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Importamos el hook useNavigate
import api from "../Api";

const PriceForm = ({ onAddPrice }) => {
  const [categories, setCategories] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [products, setProducts] = useState([]);
  const [newPrice, setNewPrice] = useState({
    transactionCategory: '',
    paymentMethod: '',
    amount: '',
    product: ''
  });
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
  }, []);

  useEffect(() => {
    api
      .get("/payment-methods")
      .then((response) => {
        setPaymentTypes(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los medios de pago", error);
      });
  }, []);

  useEffect(() => {
    if (newPrice.transactionCategory === "6") {
      api
        .get("/products")
        .then((response) => {
          setProducts(response.data);
        })
        .catch((error) => {
          console.error("Error al obtener los productos", error);
        });
    } else {
      setProducts([]);
    }
  }, [newPrice.transactionCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPrice({
      ...newPrice,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPrice.transactionCategory && newPrice.paymentMethod && newPrice.amount) {
      onAddPrice({
        transactionCategory: categories.find((category) => category.id === Number(newPrice.transactionCategory)),
        paymentMethod: paymentTypes.find((paymentType) => paymentType.id === Number(newPrice.paymentMethod)),
        amount: newPrice.amount,
        product: products.find((product) => product.id === Number(newPrice.product)),
      });
      setNewPrice({ transactionCategory: '', paymentMethod: '', amount: '', product: '' });
    }
  };

  const handleGoBack = () => {
    navigate('/');  // Redirige a la pantalla principal
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header text-center">
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Campos de formulario */}
            <div className="mb-3">
              <label className="form-label">Categoría</label>
              <select
                name="transactionCategory"
                value={newPrice.transactionCategory}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Seleccione una categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Tipo de Pago</label>
              <select
                name="paymentMethod"
                value={newPrice.paymentMethod}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Seleccione un tipo de pago</option>
                {paymentTypes.map((paymentType) => (
                  <option key={paymentType.id} value={paymentType.id}>
                    {paymentType.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Monto</label>
              <input
                type="number"
                name="amount"
                value={newPrice.amount}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            {newPrice.transactionCategory === "6" && (
              <div className="mb-3">
                <label className="form-label">Producto</label>
                <select
                  name="product"
                  value={newPrice.product}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Seleccione un producto</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
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
