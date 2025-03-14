import { Modal, Button } from 'react-bootstrap';

const ErrorModal = ({ showErrorModal, setShowErrorModal, errorMessage }) => {
  return (
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
  );
};

export default ErrorModal;
