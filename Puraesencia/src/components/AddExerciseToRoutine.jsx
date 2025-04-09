import { Modal, Button, Form, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddExerciseToRoutine = ({ setShowModal, selectedDay, search, handleSearch, exercise, selectedExercises, showModal, filteredExercises, handleSelectExercise, handleRemoveExercise, setExercise, handleSaveExercise }) => {
  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
    <Modal.Header closeButton>
      <Modal.Title>Agregar Ejercicio para {selectedDay.name}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form onSubmit={(e) => e.preventDefault()}>
        <Form.Group className="mb-2">
          <Form.Control
            type="text"
            placeholder="Buscar ejercicio"
            value={search}
            onChange={handleSearch}
          />
        </Form.Group>
        {search && (
          <ListGroup>
            {filteredExercises.map((ex, index) => (
              <ListGroup.Item key={index} action onClick={() => handleSelectExercise(ex)}>
                {ex.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
        <div className="mt-3">
          <h6>Ejercicios Seleccionados:</h6>
          <ListGroup>
            {selectedExercises.map((ex, idx) => (
              <ListGroup.Item key={idx} className="d-flex justify-content-between">
                {ex.name}
                <Button variant="danger" size="sm" onClick={() => handleRemoveExercise(ex)}>
                  Eliminar
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
        <Form.Group className="mt-3">
<Form.Control
type="number"
placeholder="Series"
value={exercise.series}
onChange={(e) => {
  const newSeriesCount = parseInt(e.target.value);
  const newRepsArray = Array(newSeriesCount).fill(''); // array vacío
  setExercise({
    ...exercise,
    series: newSeriesCount,
    repetitionsPerSeries: newRepsArray,
  });
}}
/>
</Form.Group>

{exercise.repetitionsPerSeries &&
exercise.repetitionsPerSeries.map((rep, index) => (
<Form.Group className="mb-2" key={index}>
  <Form.Label>Repeticiones en serie {index + 1}</Form.Label>
  <Form.Control
    type="number"
    value={rep}
    onChange={(e) => {
      const updatedReps = [...exercise.repetitionsPerSeries];
      updatedReps[index] = e.target.value;
      setExercise({
        ...exercise,
        repetitionsPerSeries: updatedReps,
      });
    }}
  />
</Form.Group>
))}

        <Form.Group className="mb-2">
          <Form.Control
            type="number"
            placeholder="Descanso (segundos)"
            value={exercise.rest}
            onChange={(e) => setExercise({ ...exercise, rest: e.target.value })}
          />
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={() => setShowModal(false)}>
        Cancelar
      </Button>
      <Button variant="primary" onClick={handleSaveExercise}>
        Guardar
      </Button>
    </Modal.Footer>
  </Modal>
  );
};

export default AddExerciseToRoutine;
