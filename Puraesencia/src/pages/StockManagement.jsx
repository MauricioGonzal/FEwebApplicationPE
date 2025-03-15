import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../Api";
import Select from "react-select";
import { Modal, Button } from "react-bootstrap";

const StockManagement = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [stock, setStock] = useState("");
  const [stockList, setStockList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [editingStock, setEditingStock] = useState(null);
  const [newStock, setNewStock] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [stockToDelete, setStockToDelete] = useState(null);

  useEffect(() => {
    api.get("/products")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error al obtener productos", error));
  }, []);

  useEffect(() => {
    api.get("/products-stock")
      .then((response) => setStockList(response.data))
      .catch((error) => console.error("Error al obtener products-stock", error));
  }, [refresh]);

  const handleAddStock = () => {
    if (!selectedProduct || !stock) return;

    api.post("/products-stock/create", { product: selectedProduct.value, stock })
      .then(() => {
        alert("Stock creado con éxito");
        setRefresh((prev) => !prev);
      })
      .catch((error) => {
        setErrorMessage(error.response?.data?.error || "Error al realizar la solicitud");
        setShowErrorModal(true);
      });

    setSelectedProduct("");
    setStock("");
  };

  const handleEdit = (item) => {
    setEditingStock(item.id);
    setNewStock(item.stock);
  };

  const handleSaveEdit = (id) => {
    if (newStock === "") return;

    api.put(`/products-stock/update/${id}`, { stock: newStock })
      .then(() => {
        alert("Stock actualizado con éxito");
        setRefresh((prev) => !prev);
        setEditingStock(null);
      })
      .catch((error) => console.error("Error al actualizar stock", error));
  };

  const confirmDeleteStock = (id) => {
    setStockToDelete(id);
    setShowConfirmModal(true);
  };

  const handleDelete = () => {
    if (!stockToDelete) return;

    api.delete(`/products-stock/${stockToDelete}`)
      .then(() => {
        alert("Stock eliminado con éxito");
        setRefresh((prev) => !prev);
      })
      .catch((error) => console.error("Error al eliminar stock", error));

    setShowConfirmModal(false);
    setStockToDelete(null);
  };

  const productOptions = products.map((product) => ({
    value: product,
    label: product.name
  }));

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title">Stock</h2>
          <div className="mb-3">
            <div className="col-md-6">
              <Select
                options={productOptions}
                value={selectedProduct}
                onChange={(selectedOption) => setSelectedProduct(selectedOption)}
                placeholder="Seleccionar producto..."
                isSearchable
                className="mb-3"
              />
            </div>
          </div>
          <div className="mb-3">
            <input
              type="number"
              className="form-control"
              placeholder="Cantidad de stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>
          <button className="btn btn-primary w-100" onClick={handleAddStock}>
            Agregar Stock
          </button>
        </div>
      </div>

      <div className="mt-4">
        <h3>Lista de Stocks</h3>
        <div className="table-responsive">
          <table className="table table-hover table-bordered shadow-sm rounded">
            <thead className="table-dark text-center">
              <tr>
                <th>Producto</th>
                <th>Stock Disponible</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {stockList.map((item, index) => (
                <tr key={index} className="table-light">
                  <td>{item.product.name}</td>
                  <td>
                    {editingStock === item.id ? (
                      <input
                        type="number"
                        value={newStock}
                        onChange={(e) => setNewStock(e.target.value)}
                        className="form-control"
                      />
                    ) : (
                      item.stock
                    )}
                  </td>
                  <td>
                    {editingStock === item.id ? (
                      <button className="btn btn-success" onClick={() => handleSaveEdit(item.id)}>
                        Guardar
                      </button>
                    ) : (
                      <button className="btn btn-warning me-2" onClick={() => handleEdit(item)}>
                        Editar
                      </button>
                    )}
                    <button className="btn btn-danger" onClick={() => confirmDeleteStock(item.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Modal de error */}
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

          {/* Modal de confirmación para eliminar */}
          <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Confirmar Eliminación</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              ¿Estás seguro de que quieres eliminar este stock?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Eliminar
              </Button>
            </Modal.Footer>
          </Modal>

        </div>
      </div>
    </div>
  );
};

export default StockManagement;
