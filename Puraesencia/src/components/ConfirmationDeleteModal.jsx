import { Modal, Button } from 'react-bootstrap';
import { FaTimes } from "react-icons/fa";

const ConfirmationDeleteModal = ({ showModal, setShowModal, message, handleDelete }) => {
  return (
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
            <Modal.Title>Confirmar Eliminación</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {message}
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancelar
            </Button>
            <Button variant="danger" onClick={() => handleDelete()}>
                <FaTimes className="me-1" /> Eliminar
            </Button>
            </Modal.Footer>
      </Modal>
  );
};

export default ConfirmationDeleteModal;