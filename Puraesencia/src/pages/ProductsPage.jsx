import React, { useState, useEffect } from "react";
import { Container, Form, Button, Table } from "react-bootstrap";
import api from "../Api";
import Select from "react-select";
import { toast } from 'react-toastify';

const ProductPage = () => {
  const [productName, setProductName] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedPaymentType, setSelectedPaymentType] = useState([]);

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

    api
      .get("/products/price-and-stock")
      .then((response) => {
        console.log(response.data);
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los products", error);
    });
  }, []);

  const handleAddProduct = () => {
    const newProductRequest = { 
      name: productName,
      stock: stock,
      amount: price, 
      paymentMethod: selectedPaymentType.value,
      transactionCategory: selectedCategory.value,
  };

  api.post('/products/create-product-stock-price', newProductRequest)
      .then((response) => {
          toast.success("Producto creado correctamente", {
              position: "top-right", // Ahora directamente como string
            });
      })
      .catch((error) => {
  });
  };

  const handleEditPrice = (index) => {
    const newPrice = prompt("Ingrese el nuevo precio:", products[index].price);
    if (newPrice !== null) {
      const updatedProducts = [...products];
      updatedProducts[index].price = Number(newPrice);
      setProducts(updatedProducts);
    }
  };

  const handleAddStock = (index) => {
    const additionalStock = prompt("Ingrese la cantidad a agregar:", "0");
    if (additionalStock !== null) {
      const updatedProducts = [...products];
      updatedProducts[index].stock += Number(additionalStock);
      setProducts(updatedProducts);
    }
  };

  const handleDeleteProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  const transactionCategoryOptions = categories.map(category => ({
    value: category,
    label: category.name
}));

const paymentTypesOptions = paymentTypes.map(paymentType => ({
    value: paymentType,
    label: paymentType.name
}));

  return (
    <Container className="mt-4">
      <h2>Alta de Productos</h2>
      <Form>
        <Form.Group>
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
          <Form.Label>Nombre del Producto</Form.Label>
          <Form.Control type="text" value={productName} onChange={(e) => setProductName(e.target.value)} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Stock Disponible</Form.Label>
          <Form.Control type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Precio</Form.Label>
          <Form.Control type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        </Form.Group>
        <Button variant="primary" className="mt-2" onClick={handleAddProduct}>
          Crear
        </Button>
      </Form>
      <h3 className="mt-4">Lista de Productos</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Stock Disponible</th>
            <th>Precio Actual</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product.product.name}</td>
              <td>{product.productStock.stock}</td>
              <td>${product.priceList.amount.toFixed(2)}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleEditPrice(index)} className="me-2">
                  Editar Precio
                </Button>
                <Button variant="success" size="sm" onClick={() => handleAddStock(index)} className="me-2">
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
    </Container>
  );
};

export default ProductPage;