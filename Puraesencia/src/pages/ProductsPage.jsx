import React, { useState, useEffect } from "react";
import { Container, Form, Button, Row, Col, Card, Spinner } from "react-bootstrap";
import api from "../Api";
import { toast } from 'react-toastify';
import ErrorModal from "../components/ErrorModal";
import { useNavigate } from "react-router-dom";
import ConfirmationDeleteModal from "../components/ConfirmationDeleteModal";
import { ProductsTable } from "../components/ProductsTable";
import { EditStockModal } from "../components/EditStockModal";
import { EditAmountModal } from "../components/EditAmountModal";

const ProductPage = () => {
  const [productName, setProductName] = useState("");
  const [stock, setStock] = useState("");
  const [prices, setPrices] = useState({});
  const [products, setProducts] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditStockModal, setShowEditStockModal] = useState(false);
  const [newAmount, setNewAmount] = useState("");
  const [newStock, setNewStock] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
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
    setLoading(true);

    api
      .get("/products/price-and-stock")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los productos", error);
      })
      .finally(() => setLoading(false));
  }, [refresh]);

  const handleAddProduct = () => {
    // Asegurarse de que el objeto prices no esté vacío
    if (Object.keys(prices).length === 0) {
      toast.error("Debe ingresar un precio para al menos un medio de pago.");
      return;
    }
  
    const newProductRequest = { 
      name: productName,
      stock: stock,
      prices: prices,  // El objeto con los precios por medio de pago
    };
    api.post('/products/create-product-stock-price', newProductRequest)
      .then((response) => {
        toast.success("Producto creado correctamente", {
          position: "top-right", // Ahora directamente como string
        });
        setRefresh(prev => !prev); // Cambia refresh para disparar el useEffect
        setProductName("");
        setStock("");
        setPrices({});
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
    setSelectedPrice(priceList);
    setNewAmount(priceList.amount);
    setShowEditModal(true);
  };

  const handleSaveEdit = (updatedPriceLists) => {
    api
      .put(`/pricelists/updatePriceLists`, updatedPriceLists)
      .then((response) => {
        setShowEditModal(false);
        toast.success("Monto actualizado correctamente", { position: "top-right" });
        setRefresh(prev => !prev);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleAddStock = (productStock) => {
    setSelectedStock(productStock);
    setNewStock(productStock.stock);
    setShowEditStockModal(true);
  };

  const handleSaveAddStock = () => {
    if (newStock === "") return;
    api
      .put(`/products-stock/update/${selectedStock.id}`, newStock)
      .then(() => {
        setShowEditStockModal(false);
        setRefresh(prev => !prev);
        toast.success("Stock actualizado correctamente", { position: "top-right" });
      })
      .catch((error) => console.error("Error al actualizar stock", error));
  };

  const handleDeleteProduct = () => {
    api
      .post(`/products/delete-product-stock-price`, item)
      .then(() => {
        setRefresh(prev => !prev);
        toast.success("Producto eliminado exitosamente");
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

  const handleGoBack = () => {
    navigate("/");  // Redirige a la pantalla principal
  };

  const handleShowModal = (item) => {
    setItem(item);
    setShowModal(true);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.product.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="primary" />
        <span className="ml-2">Cargando...</span>
      </div>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Gestión de Productos</h2>

      <Card className="p-4 shadow-sm mb-5">
      <Form>
      <Row className="mb-3">
    <Col md={4}>
      <Form.Group>
        <Form.Label>Nombre del Producto</Form.Label>
        <Form.Control 
          type="text" 
          value={productName} 
          onChange={(e) => setProductName(e.target.value)} 
        />
      </Form.Group>
    </Col>
    <Col md={4}>
      <Form.Group>
        <Form.Label>Stock Disponible</Form.Label>
        <Form.Control 
          type="number" 
          value={stock} 
          onChange={(e) => setStock(e.target.value)} 
        />
      </Form.Group>
    </Col>
  </Row>
  <Row className="mb-3">
    <Col md={12}>
      <Form.Label>Medios de Pago y Monto</Form.Label>
      {paymentTypes.map(paymentType => (
        <Form.Group key={paymentType.id}>
          <Form.Control
          className="mt-3"
            type="number" 
            value={prices[paymentType.id] || ""} 
            onChange={(e) => {
              const newPrices = { ...prices, [paymentType.id]: parseFloat(e.target.value) };
              setPrices(newPrices);
            }}
            placeholder={`Valor para ${paymentType.name}`} 
            min="0"
          />
        </Form.Group>
      ))}
    </Col>
  </Row>
  <div className="d-flex justify-content-between">
    <Button className="btn btn-secondary mt-3" onClick={handleGoBack}>
      Volver a la pantalla principal
    </Button>
    <Button 
      variant="primary" 
      className="mt-3" 
      onClick={handleAddProduct} 
      disabled={productName === "" || stock === "" || Object.keys(prices).length === 0}
    >
      Crear Producto
    </Button>
  </div>
</Form>
      </Card>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <ProductsTable
        filteredProducts={filteredProducts}
        handleAddStock={handleAddStock}
        handleEditPrice={handleEditPrice}
        handleShowModal={handleShowModal}
        paymentMethods={paymentTypes}
      />
      <EditAmountModal 
      handleSaveEdit={handleSaveEdit}
      paymentTypes={paymentTypes}
      setShowEditModal={setShowEditModal}
      showEditModal={showEditModal}
      selectedPrice = {selectedPrice}
      />
      <EditStockModal
        handleSaveAddStock={handleSaveAddStock}
        showEditStockModal={showEditStockModal}
        setShowEditStockModal={setShowEditStockModal}
        setNewStock={setNewStock}
        newStock={newStock}
      />
      <ConfirmationDeleteModal
        showModal={showModal}
        setShowModal={setShowModal}
        message={`Seguro que quieres eliminar el producto ${item?.product.name}`}
        handleDelete={handleDeleteProduct}
      />
      <ErrorModal
        showErrorModal={showErrorModal}
        setShowErrorModal={setShowErrorModal}
        errorMessage={errorMessage}
      />
    </Container>
  );
};

export default ProductPage;
