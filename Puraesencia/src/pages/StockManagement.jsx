import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../Api";
import Select from "react-select";
import { Modal, Button } from 'react-bootstrap';


const StockManagement = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [stock, setStock] = useState("");
  const [stockList, setStockList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [editingStock, setEditingStock] = useState(null); // Para identificar qué stock estamos editando
  const [newStock, setNewStock] = useState(""); // El valor que se editará
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);


  useEffect(() => {
    api.get('/products')
    .then((response) =>{ 
        setProducts(response.data);
    })
    .catch((error) => console.error("Error al obtener productos", error));
  }, []);

  useEffect(() => {
    api.get('/products-stock')
    .then((response) =>{ 
        setStockList(response.data);
    })
    .catch((error) => console.error("Error al obtener products-stock", error));
  }, [refresh]);

  const handleAddStock = () => {
    if (!selectedProduct || !stock) return;

    console.log(selectedProduct.value);
    console.log(stock);
    api.post('/products-stock/create', {product: selectedProduct.value, stock})
    .then(() => {
        alert("Stock creado con éxito");
        setRefresh(prev => !prev); // Cambia refresh para disparar el useEffect
    })
    .catch((error) => {
        if (error.response && error.response.data) {
            setErrorMessage(error.response.data.error || "Error desconocido");
          } else {
            setErrorMessage("Error al realizar la solicitud");
          }
          setShowErrorModal(true);  // Mostrar modal con el error
    });

    setSelectedProduct("");
    setStock("");
  };

  const handleEdit = (item) => {
    setEditingStock(item.id);
    setNewStock(item.stock); // Prepara el valor actual para ser editado
  };

  const handleSaveEdit = (id) => {
    if (newStock === "") return;
console.log(newStock);
    api.put(`/products-stock/update/${id}`, newStock )
    .then(() => {
      alert("Stock actualizado con éxito");
      setRefresh(prev => !prev); // Actualiza la lista de stocks
      setEditingStock(null); // Cierra el modo de edición
    })
    .catch((error) => console.error("Error al actualizar stock", error));
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este stock?")) {
      api.delete(`/products-stock/${id}`)
      .then(() => {
        alert("Stock eliminado con éxito");
        setRefresh(prev => !prev); // Actualiza la lista de stocks
      })
      .catch((error) => console.error("Error al eliminar stock", error));
    }
  };

  const productOptions = products.map(product => ({
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
          <button className="btn btn-primary w-100" onClick={handleAddStock}>Agregar Stock</button>
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
                      <button className="btn btn-success" onClick={() => handleSaveEdit(item.id)}>Guardar</button>
                    ) : (
                      <button className="btn btn-warning me-2" onClick={() => handleEdit(item)}>Editar</button>
                    )}
                    <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
                          {/* Modal emergente para mostrar el error */}
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
      </div>
    </div>
  );
};

export default StockManagement;
