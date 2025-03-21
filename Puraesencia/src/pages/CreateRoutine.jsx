import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form, ListGroup } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import jwtDecode from 'jwt-decode';
import api from '../Api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';// Para los estilos de las notificaciones

export default function GymRoutineForm() {
  const daysOfWeek = [
    { index: 1, name: "Lunes" }, { index: 2, name: "Martes" }, { index: 3, name: "Miércoles" },
    { index: 4, name: "Jueves" }, { index: 5, name: "Viernes" }, { index: 6, name: "Sábado" }, { index: 7, name: "Domingo" }
  ];

  const [exercisesList, setExercises] = useState([]);
  const [routine, setRoutine] = useState({ title: "", description: "", isCustom: false, exercises: {} });
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [exercise, setExercise] = useState({ name: "", series: "", repetitions: "", rest: "" });
  const [search, setSearch] = useState("");
  const [filteredExercises, setFilteredExercises] = useState(exercisesList);
  const { isCustom, userId } = useParams();
  const navigate = useNavigate();

  const openModal = (day) => {
    setSelectedDay(day);
    setShowModal(true);
    setSelectedExercises([]);
    setExercise({ name: "", series: "", repetitions: "", rest: "" });
    setSearch("");
  };

  useEffect(() => {
    api
      .get("/exercises")
      .then((response) => {
        setExercises(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los ejercicios", error);
      });
  }, []);

  const handleSaveExercise = () => {
    let newExercise = {};
    if (selectedExercises.length === 1) {
      newExercise = {
        name: selectedExercises[0].name,
        exerciseIds: [selectedExercises[0].id],
        series: exercise.series,
        repetitions: exercise.repetitions,
        rest: exercise.rest,
      };
    } else {
      newExercise = {
        name: selectedExercises.map((exercise) => exercise.name).join(" + "),
        exerciseIds: selectedExercises.map((exercise) => exercise.id),
        series: exercise.series,
        repetitions: exercise.repetitions,
        rest: exercise.rest,
      };
    }

    setRoutine((prev) => ({
      ...prev,
      exercises: {
        ...prev.exercises,
        [selectedDay.index]: [
          ...(prev.exercises[selectedDay.index] || []),
          newExercise,
        ],
      },
    }));
    setShowModal(false);
    setSelectedExercises([]);
    setExercise({ name: "", series: "", repetitions: "", rest: "" });
    setSearch("");
  };

  const handleRemoveExerciseFromDay = (dayIndex, exerciseToRemove) => {
    setRoutine((prev) => {
      const updatedExercises = { ...prev.exercises };
      updatedExercises[dayIndex] = updatedExercises[dayIndex].filter(
        (ex) => ex.name !== exerciseToRemove.name
      );
      return { ...prev, exercises: updatedExercises };
    });
  };

  const handleSaveRoutine = () => {
    let customAux = false;
    let routineFormatted = routine;
    let exercisesFormatted = Object.keys(routine.exercises).reduce((acc, key) => {
      acc[key] = routine.exercises[key].map(({ name, ...rest }) => rest);
      return acc;
    }, {});
    routineFormatted.exercises = exercisesFormatted;

    if (isCustom === "1") {
      customAux = true;
    }
    routineFormatted.isCustom = customAux;

    api.post('/routines', routineFormatted)
      .then((response) => {
        if (userId !== undefined) {
          const token = localStorage.getItem('token');
          const decoded = jwtDecode(token);
          api.put(`/users/assign-routine`, {
            trainerId: decoded.id,
            userId: userId,
            routineId: response.data.id
          })
            .then(() => {
              toast.success("Rutina creada correctamente", {
                position: "top-right", // Ahora directamente como string
              });
              navigate('/');
            })
            .catch(error => console.error("Error al crear rutina:", error));
        } else {
          toast.success("Rutina creada correctamente", {
            position: "top-right", // Ahora directamente como string
          });
          navigate('/');
        }
      })
      .catch(error => console.error("Error al crear rutina:", error));
  };

  const handleCancel = () => {
    window.location.href = "/";
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    setFilteredExercises(exercisesList.filter((ex) => ex.name.toLowerCase().includes(value.toLowerCase())));
  };

  const handleSelectExercise = (ex) => {
    if (!selectedExercises.includes(ex)) {
      setSelectedExercises([...selectedExercises, ex]);
    }
    setSearch("");
    setFilteredExercises([]);
  };

  const handleRemoveExercise = (ex) => {
    setSelectedExercises(selectedExercises.filter((item) => item !== ex));
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-3">Crear Rutina</h1>
      <Form onSubmit={(e) => e.preventDefault()}>
        <Form.Group className="mb-2">
          <Form.Control
            type="text"
            placeholder="Nombre de la rutina"
            value={routine.title}
            onChange={(e) => setRoutine({ ...routine, title: e.target.value })}
          />
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Control
            type="text"
            placeholder="Descripción"
            value={routine.description}
            onChange={(e) => setRoutine({ ...routine, description: e.target.value })}
          />
        </Form.Group>
      </Form>

      <div className="row">
        {daysOfWeek.map((day) => (
          <div key={day.index} className="col-md-6 mb-3">
            <div className="card p-3 shadow-sm">
              <h5 className="card-title">{day.name}</h5>
              <p className="card-text">
                {routine.exercises[day.index] && routine.exercises[day.index].length > 0
                  ? routine.exercises[day.index].map((ex, idx) => (
                      <div
                        key={idx}
                        style={{
                          backgroundColor: ex.exerciseIds ? "#d1f7d1" : "transparent",
                          padding: "5px",
                          marginBottom: "5px",
                          borderRadius: "5px",
                        }}
                      >
                        {ex.exerciseIds.length > 1
                          ? `${ex.name} - ${ex.series} series de ${ex.repetitions} repeticiones, descanso: ${ex.rest}s (Combinado)`
                          : `${ex.name} - ${ex.series} series de ${ex.repetitions} repeticiones, descanso: ${ex.rest}s`}
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleRemoveExerciseFromDay(day.index, ex)}
                          style={{ marginLeft: '10px' }}
                        >
                          ×
                        </Button>
                      </div>
                    ))
                  : "Sin ejercicios"}
              </p>
              <Button variant="primary" onClick={() => openModal(day)}>
                Agregar Ejercicio
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 d-flex justify-content-between">
        <Button variant="danger" onClick={handleCancel}>
          Cancelar
        </Button>
        <Button variant="success" onClick={handleSaveRoutine}>
          Guardar Rutina
        </Button>
      </div>

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
                onChange={(e) => setExercise({ ...exercise, series: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Control
                type="number"
                placeholder="Repeticiones"
                value={exercise.repetitions}
                onChange={(e) => setExercise({ ...exercise, repetitions: e.target.value })}
              />
            </Form.Group>
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
    </div>
  );
}
