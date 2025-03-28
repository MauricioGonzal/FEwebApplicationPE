import { Table, Button } from "react-bootstrap";

export function ProductsTable ({ handleAddStock, handleEditPrice, handleShowModal, filteredProducts, paymentMethods }) {
    console.log(filteredProducts)
    return (
        <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Stock Disponible</th>
            {/* Generar headers para cada PaymentMethod */}
                {paymentMethods.map((paymentMethod) => (
                <th key={paymentMethod.id}>Valor {paymentMethod.name}</th>
            ))}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product, index) => (
            <tr key={index}>
              <td>{product.product.name}</td>
              <td>{product.productStock.stock}</td>
            {/* Buscar el valor correspondiente para cada PaymentMethod */}
                {paymentMethods.map((paymentMethod) => {
                // Buscar el priceList correspondiente al PaymentMethod actual
                const priceList = product.priceList.find(pl => pl.paymentMethod.id === paymentMethod.id);
                return (
                    <td key={paymentMethod.id}>
                        {/* Si no hay precio para este PaymentMethod, se muestra "-" */}
                        {priceList ? `$${priceList.amount}` : "-"}
                    </td>
                );
                })}
              <td>
                <Button variant="warning" size="sm" onClick={() => handleEditPrice(product.priceList)} className="me-2">
                  Editar Precio
                </Button>
                <Button variant="success" size="sm" onClick={() => handleAddStock(product.productStock)} className="me-2">
                  Agregar Stock
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleShowModal(product)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
}
