import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form, ListGroup } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import jwtDecode from 'jwt-decode';
import api from '../Api';

export default function EditGymRoutineForm() {
  const daysOfWeek = [
    { index: 1, name: "Lunes" }, { index: 2, name: "Martes" }, { index: 3, name: "Miércoles" },
    { index: 4, name: "Jueves" }, { index: 5, name: "Viernes" }, { index: 6, name: "Sábado" }, { index: 7, name: "Domingo" }
  ];

  const [exercisesList, setExercises] = useState([]);
  const [routine, setRoutine] = useState({ name: "", description: "", isCustom: false, exercisesByDay: {} });
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [exercise, setExercise] = useState({ name: "", series: "", repetitions: "", rest: "" });
  const [search, setSearch] = useState("");
  const [filteredExercises, setFilteredExercises] = useState(exercisesList);
  const { routineId, userId } = useParams();
  const navigate = useNavigate();

  const openModal = (day) => {
    setSelectedDay(day);
    setShowModal(true);
    setSelectedExercises([]);
  };

  useEffect(() => {
    // Cargar los ejercicios disponibles
    api.get("/exercises")
      .then((response) => {
        setExercises(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los ejercicios", error);
      });

    // Cargar la rutina a editar
    api.get(`/routines/id/${routineId}`)
      .then((response) => {
        const { name, description, isCustom, exercisesByDay } = response.data;

        setRoutine({ name, description, isCustom, exercisesByDay });
      })
      .catch((error) => {
        console.error("Error al cargar la rutina", error);
      });
  }, [routineId]);

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
      exercisesByDay: {
        ...prev.exercisesByDay,
        [selectedDay.index]: [
          ...(prev.exercisesByDay[selectedDay.index] || []),
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
      const updatedExercises = { ...prev.exercisesByDay };
      updatedExercises[dayIndex] = updatedExercises[dayIndex].filter(
        (ex) => ex.name !== exerciseToRemove.name
      );
      return { ...prev, exercisesByDay: updatedExercises };
    });
  };

  const handleSaveRoutine = () => {
    let customAux = false;
    let routineFormatted = routine;
    let exercisesFormatted = Object.keys(routine.exercisesByDay).reduce((acc, key) => {
      acc[key] = routine.exercisesByDay[key].map(({ name, ...rest }) => rest);
      return acc;
    }, {});
    routineFormatted.exercises = exercisesFormatted;
    routineFormatted.isCustom = customAux;

    if (routine.isCustom === true) {
      customAux = true;
    }

    api.put(`/routines/${routineId}`, routineFormatted)
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
              alert("Rutina editada correctamente");
              navigate('/');
            })
            .catch(error => console.error("Error al asignar rutina:", error));
        } else {
          alert("Rutina editada correctamente");
          navigate('/');
        }
      })
      .catch(error => console.error("Error al editar rutina:", error));
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
      <h1 className="mb-3">Editar Rutina</h1>
      <Form onSubmit={(e) => e.preventDefault()}>
        <Form.Group className="mb-2">
          <Form.Control
            type="text"
            placeholder="Nombre de la rutina"
            value={routine.name}
            onChange={(e) => setRoutine({ ...routine, name: e.target.value })}
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
              <div className="card-text">
              {routine.exercisesByDay[day.index] && routine.exercisesByDay[day.index].length > 0
  ? routine.exercisesByDay[day.index].map((ex, idx) => {
      // Buscar los ejercicios correspondientes a cada exerciseId
      const exercisesDetails = ex.exerciseIds.map((id) => {
        const exerciseDetail = exercisesList.find((ex) => ex.id === id);
        return exerciseDetail;
      });

      // Crear una cadena para mostrar los detalles de los ejercicios
      const exerciseNames = exercisesDetails
        .map((exDetail) => exDetail?.name)
        .join(" + ");

      return (
        <div
          key={idx}
          style={{
            backgroundColor: ex.exerciseIds ? "#d1f7d1" : "transparent",
            padding: "5px",
            marginBottom: "5px",
            borderRadius: "5px",
          }}
        >
          {exerciseNames} - {ex.series} series de {ex.repetitions} repeticiones, descanso: {ex.rest}s
          {ex.exerciseIds.length > 1 && " (Combinado)"}
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleRemoveExerciseFromDay(day.index, ex)}
            style={{ marginLeft: '10px' }}
          >
            ×
          </Button>
        </div>
      );
    })
  : <p>Sin ejercicios</p>}
              </div>
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
