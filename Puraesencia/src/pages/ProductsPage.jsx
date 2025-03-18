import React, { useState, useEffect } from "react";
import { Container, Form, Button, Table, Row, Col, Card, Modal } from "react-bootstrap";
import api from "../Api";
import Select from "react-select";
import { toast } from 'react-toastify';
import ErrorModal from "../components/ErrorModal";
import { useNavigate } from "react-router-dom";

const ProductPage = () => {
  const [productName, setProductName] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [products, setProducts] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);

  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditStockModal, setShowEditStockModal] = useState(false);
  
  const [newAmount, setNewAmount] = useState("");
  const [newStock, setNewStock] = useState("");

  const [selectedPaymentType, setSelectedPaymentType] = useState([]);

  const [refresh, setRefresh] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");


  const navigate = useNavigate();

  

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
    api
      .get("/products/price-and-stock")
      .then((response) => {
        console.log(response.data);
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los products", error);
    });
  }, [refresh]);

  const handleAddProduct = () => {
    const newProductRequest = { 
      name: productName,
      stock: stock,
      amount: price, 
      paymentMethod: selectedPaymentType.value,
  };

  api.post('/products/create-product-stock-price', newProductRequest)
      .then((response) => {
        toast.success("Producto creado correctamente", {
              position: "top-right", // Ahora directamente como string
            });
        setRefresh(prev => !prev); // Cambia refresh para disparar el useEffect
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setErrorMessage(error.response.data.message || "Error desconocido");
        } else {
          setErrorMessage("Error al realizar la solicitud");
        }
        setShowErrorModal(true);  // Mostrar modal con el error
  });
  };

  const handleEditPrice = (priceList) => {
    setSelectedPrice(priceList)
    setNewAmount(priceList.amount);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (newAmount === "") return;

    api
      .put(`/pricelists/${selectedPrice.id}/updateAmount`, newAmount)
      .then((response) => {
        setShowEditModal(false);
        toast.success("Monto actualizado correctamente", { position: "top-right" });
        setRefresh(prev => !prev); // Cambia refresh para disparar el useEffect
      })
      .catch((error) => {
          console.log(error);
      });
  };

  const handleAddStock = (productStock) => {
    console.log(productStock);
    setSelectedStock(productStock)
    setNewStock(productStock.stock);
    setShowEditStockModal(true);
  };

  const handleSaveAddStock = () => {
      if (newStock === "") return;
      console.log(newStock);
      api.put(`/products-stock/update/${selectedStock.id}`, newStock )
      .then(() => {
        setShowEditStockModal(false);
        setRefresh(prev => !prev); // Cambia refresh para disparar el useEffect
        toast.success("Stock actualizado correctamente", { position: "top-right" });
      })
      .catch((error) => console.error("Error al actualizar stock", error));
    
  }

  const handleDeleteProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  const handleGoBack = () => {
    navigate('/');  // Redirige a la pantalla principal
  };

  const filteredProducts = products.filter(
    (product) =>
      product.product.name.toLowerCase().includes(search.toLowerCase())
  );

const paymentTypesOptions = paymentTypes.map(paymentType => ({
    value: paymentType,
    label: paymentType.name
}));

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Gestión de Productos</h2>

      <Card className="p-4 shadow-sm mb-5">
        <Form>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Medio de Pago</Form.Label>
                <Select options={paymentTypesOptions} value={selectedPaymentType} onChange={setSelectedPaymentType} placeholder="Seleccionar medio de pago..." isSearchable />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Nombre del Producto</Form.Label>
                <Form.Control type="text" value={productName} onChange={(e) => setProductName(e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Stock Disponible</Form.Label>
                <Form.Control type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Precio</Form.Label>
                <Form.Control type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
              </Form.Group>
            </Col>
          </Row>
          <div className="d-flex justify-content-between">
          <Button className="btn btn-secondary mt-3" onClick={handleGoBack}>
              Volver a la pantalla principal
            </Button>
          <Button variant="primary" className="mt-3" onClick={handleAddProduct}>Crear Producto</Button>
          </div>
        </Form>
      </Card>
      <div className="input-group mb-3">
        <input type="text" className="form-control" placeholder="Buscar producto..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Stock Disponible</th>
            <th>Precio Actual</th>
            <th>Medio De Pago</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product, index) => (
            <tr key={index}>
              <td>{product.product.name}</td>
              <td>{product.productStock.stock}</td>
              <td>${product.priceList.amount.toFixed(2)}</td>
              <td>{product.priceList.paymentMethod.name}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleEditPrice(product.priceList)} className="me-2">
                  Editar Precio
                </Button>
                <Button variant="success" size="sm" onClick={() => handleAddStock(product.productStock)} className="me-2">
                  Agregar Stock
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDeleteProduct(index)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

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
          <Button variant="primary" onClick={handleSaveEdit}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>

            {/* Modal de Edición */}
            <Modal show={showEditStockModal} onHide={() => setShowEditStockModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Stock</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNewAmount">
              <Form.Label>Nuevo Stock</Form.Label>
              <Form.Control
                type="number"
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
                min="0"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditStockModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveAddStock}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
      <ErrorModal showErrorModal={showErrorModal} setShowErrorModal={setShowErrorModal} errorMessage={errorMessage} />
    </Container>

    
  );
};

export default ProductPage;