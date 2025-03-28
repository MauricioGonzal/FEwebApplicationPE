import { Form,Button, Modal } from "react-bootstrap";

export function EditStockModal ({ showEditStockModal, setShowEditStockModal, newStock, setNewStock, handleSaveAddStock }) {
    return (
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
          <Button variant="primary" onClick={handleSaveAddStock} disabled={newStock < 0}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    );
}
