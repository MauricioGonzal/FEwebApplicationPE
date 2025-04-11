import React, { useState, useEffect } from "react";
import PriceForm from "./PriceForm";
import api from "../Api";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

const PriceList = () => {
  const [prices, setPrices] = useState([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [newAmount, setNewAmount] = useState("");

  // Cargar precios desde el backend
  useEffect(() => {
    api
      .get("/price-list/payments")
      .then((response) => {
        setPrices(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los precios", error);
      });
  }, []);

  const handleAddPrice = (newPrice) => {
    api
      .post("/price-list", newPrice)
      .then((response) => {
        setShowErrorModal(false);
        setPrices([...prices, response.data]);
        toast.success("Precio creado correctamente", { position: "top-right" });
      })
      .catch((error) => {
        setErrorMessage(error.response.data.message || "Error al realizar la solicitud");
        setShowErrorModal(true);
      });
  };

  const handleDelete = (id) => {
    setPrices(prices.filter((price) => price.id !== id));
  };

  const handleEditClick = (price) => {
    setSelectedPrice(price);
    setNewAmount(price.amount);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!selectedPrice || newAmount === "") return;

    api
      .put(`/price-list/${selectedPrice.id}/updateAmount`, newAmount)
      .then((response) => {
        setShowEditModal(false);
        setPrices(prices.map((p) => (p.id === selectedPrice.id ? response.data : p)));
        toast.success("Monto actualizado correctamente", { position: "top-right" });
      })
      .catch((error) => {
        setErrorMessage(error.response?.data?.error || "Error al realizar la solicitud");
        setShowErrorModal(true);
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Gestión de Membresias</h2>

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
              <th>Membresia</th>
              <th>Método de Pago</th>
              <th>Monto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {prices.length > 0 ? (
              prices.map((price) => (
                <tr key={price.id}>
                  <td>{price.product ? price.product.name : price.transactionCategory.name}</td>
                  <td>{price.membership.name}</td>
                  <td>{price.paymentMethod.name}</td>
                  <td>{price.amount} $</td>
                  <td>
                    <button className="btn btn-primary btn-sm me-2" onClick={() => handleEditClick(price)}>
                      Editar
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(price.id)}>
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

      {/* Modal de Edición */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Monto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNewAmount">
              <Form.Label>Nuevo Monto</Form.Label>
              <Form.Control
                type="number"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                min="0"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveEdit} disabled={newAmount < 0}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Error */}
      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PriceList;
