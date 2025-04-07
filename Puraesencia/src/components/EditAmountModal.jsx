import { Form, Button, Modal } from "react-bootstrap";
import React, { useState, useEffect } from "react";

export function EditAmountModal({ showEditModal, setShowEditModal, paymentTypes, handleSaveEdit, selectedPrice }) {
  // Estado para almacenar los montos editados
  const [editedAmounts, setEditedAmounts] = useState({});

  // Cargar valores iniciales cuando el modal se abre
  useEffect(() => {
    if (showEditModal) {
      const initialAmounts = paymentTypes.reduce((acc, paymentMethod) => {
        const priceList = selectedPrice
          .find(pl => pl.paymentMethod.id === paymentMethod.id);

        acc[paymentMethod.id] = priceList ? priceList.amount : 0;
        return acc;
      }, {});

      setEditedAmounts(initialAmounts);
    }
  }, [showEditModal, paymentTypes,selectedPrice]);

  // Manejar cambios en los inputs
  const handleAmountChange = (paymentMethodId, newValue) => {
    setEditedAmounts(prevState => ({
      ...prevState,
      [paymentMethodId]: newValue
    }));
  };

  const handleSave = () => {
    // Convertir el estado en una lista de precios actualizada
    const updatedPriceLists = paymentTypes.map(paymentMethod => {
      // Buscar si ya existía un precio para este método de pago
      const existingPrice = selectedPrice.find(pl => pl.paymentMethod.id === paymentMethod.id);
  
      return {
        id: existingPrice ? existingPrice.id : null, // Si existe, mantener su ID; si no, será un nuevo registro
        paymentMethod: paymentMethod, // Asociar el método de pago
        amount: Number(editedAmounts[paymentMethod.id]) || 0 // Tomar el monto ingresado
      };
    });
  
    handleSaveEdit(updatedPriceLists);
    setShowEditModal(false);
  };
  

  return (
    <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Monto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {paymentTypes.map(paymentMethod => (
            <Form.Group key={paymentMethod.id} controlId={`formAmount-${paymentMethod.id}`}>
              <Form.Label>{`Monto para ${paymentMethod.name}`}</Form.Label>
              <Form.Control
                type="number"
                value={editedAmounts[paymentMethod.id] || 0} // Usa el estado actualizado
                onChange={(e) => handleAmountChange(paymentMethod.id, e.target.value)} // Captura el nuevo valor
                min="0"
                placeholder={`Monto para ${paymentMethod.name}`}
              />
            </Form.Group>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowEditModal(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
