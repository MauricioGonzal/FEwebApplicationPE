import React, { useState, useEffect } from 'react';
import PriceForm from './PriceForm';
import api from "../Api";

const PriceList = () => {
  const [prices, setPrices] = useState([]);

  // Cargar precios desde el backend
  useEffect(() => {
    api
      .get("/pricelists")
      .then((response) => {
        console.log(response.data);
        setPrices(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los precios", error);
      });
  }, []);

  const handleAddPrice = (newPrice) => {
    console.log(newPrice);
    api
      .post("/pricelists", newPrice)
      .then((response) => {
        const updatedPriceList = [...prices, response.data];
                setPrices(updatedPriceList);
      })
      .catch((error) => {
        console.error("Error al guardar precio", error);
      });
  };

  const handleDelete = (id) => {
    setPrices(prices.filter(price => price.id !== id));
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Lista de Precios</h2>

      {/* Agregar nuevo precio */}
      <div className="mb-4">
        <PriceForm onAddPrice={handleAddPrice} />
      </div>

      {/* Tabla de precios */}
      <div className="table-responsive">
        <table className="table table-hover table-bordered shadow-sm">
          <thead className="thead-light">
            <tr>
              <th>Categoría</th>
              <th>Metodo de pago</th>
              <th>Monto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {prices.length > 0 ? (
              prices.map((price) => (
                <tr key={price.id}>
                  <td>
                    {price.product ? price.product.name : price.transactionCategory.name}
                  </td>
                  <td>{price.paymentMethod.name}</td>
                  <td>{price.amount} $</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(price.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No hay precios disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PriceList;
