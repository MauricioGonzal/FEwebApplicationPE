import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form, ListGroup } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import jwtDecode from 'jwt-decode';
import api from '../Api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const daysOfWeek = [
  { index: 1, name: "Lunes" }, { index: 2, name: "Martes" }, { index: 3, name: "Miércoles" },
  { index: 4, name: "Jueves" }, { index: 5, name: "Viernes" }, { index: 6, name: "Sábado" }, { index: 7, name: "Domingo" }
];
export default function GymRoutineForm({ isCustomParam, userIdParam }) {


  const [exercisesList, setExercises] = useState([]);
  const [routine, setRoutine] = useState({ title: "", description: "", isCustom: false, exercises: [] });
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [exercise, setExercise] = useState({ name: "", series: "", repetitions: "", rest: "" });
  const [search, setSearch] = useState("");
  const [filteredExercises, setFilteredExercises] = useState(exercisesList);
  const { routineId, isCustom, userId } = useParams();
  const navigate = useNavigate();

  const openModal = (day) => {
    setSelectedDay(day);
    setShowModal(true);
    setSelectedExercises([]);
    setExercise({ name: "", series: "", repetitions: "", rest: "" });
    setSearch("");
  };

  useEffect(() => {

    if (routineId) {
      api
        .get(`/routines/id/${routineId}`)
        .then((response) => {
          console.log(response.data);

          // Agrupar ejercicios por día (day_number)
          var formatted = response.data.map((exerciseSet)=>{
            var exIds = JSON.parse(exerciseSet.exerciseIds).map((exId) => {
              const exerciseDetails = exercisesList.find(ex => ex.id === exId);
              return exerciseDetails;
            })
            return {...exerciseSet, exerciseIds: exIds};

          })
          console.log(formatted);
          const groupedExercises = daysOfWeek.map((day) => {
            const exercisesForDay = formatted.filter(ex => ex.dayNumber === day.index);
            return {
              ...day,
              exercises: exercisesForDay,
            };
          });

          setRoutine({
            title: formatted[0].routine.title,
            description:formatted[0].routine.description,
            isCustom: formatted[0].routine.isCustom,
            exercises: groupedExercises,
          });
        })
        .catch((error) => {
          console.error("Error al obtener la rutina", error);
        });
    }
  }, [routineId, exercisesList]);

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
    let newExercise = {
      dayNumber: selectedDay.index,
      exerciseIds: selectedExercises,
      series: exercise.series,
      repetitions: exercise.repetitions,
      rest: exercise.rest,
    };

    setRoutine((prev) => ({
      ...prev,
      exercises: prev.exercises.map((day) =>
        day.index === selectedDay.index
          ? { ...day, exercises: [...day.exercises, newExercise] }
          : day
      ),
    }));

    setShowModal(false);
    setSelectedExercises([]);
    setExercise({ name: "", series: "", repetitions: "", rest: "" });
    setSearch("");
  };

  const handleRemoveExerciseFromDay = (exerciseToRemove, dayIndex) => {
    setRoutine((prev) => ({
      ...prev,
      exercises: prev.exercises.map((day) =>
        day.index === dayIndex
          ? {
              ...day,
              exercises: day.exercises.filter((ex) => ex !== exerciseToRemove),
            }
          : day
      ),
    }));
  };

  const handleSaveRoutine = () => {
    let customAux = false;
    if (isCustom === "1") {
      customAux = true;
    }

    const aux = routine.exercises.flatMap(day => day.exercises);
    const aux2 = aux.map((exercise)=>{
      var ids = exercise.exerciseIds.map(exercise => exercise.id);
      const exerciseIdsJson = JSON.stringify(ids);
      return {
        ...exercise,
        exerciseIds: exerciseIdsJson
      }
    })
    const routineFormatted = {
      title: routine.title,
      description: routine.description,
      exercises: aux2,
      isCustom: isCustom
    };

    console.log(routineFormatted);

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
              toast.success("Rutina editada correctamente", {
                position: "top-right", // Ahora directamente como string
              });
              navigate('/');
            })
            .catch(error => console.error("Error al asignar rutina:", error));
        } else {
          toast.success("Rutina editada correctamente", {
            position: "top-right", // Ahora directamente como string
          });
          navigate('/');
        }
      })
      .catch(error => console.error("Error al editar rutina:", error));
  };

  
  const handleSaveRoutineAux = () => {
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
              toast.success("Rutina editada correctamente", {
                position: "top-right", // Ahora directamente como string
              });
              navigate('/');
            })
            .catch(error => console.error("Error al asignar rutina:", error));
        } else {
          toast.success("Rutina editada correctamente", {
            position: "top-right", // Ahora directamente como string
          });
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
      {routine.exercises.map((day) => (
  <div key={day.index} className="col-md-6 mb-3">
    <div className="card p-3 shadow-sm">
      <h5 className="card-title">{day.name}</h5>
      <p className="card-text">
        {day.exercises.map((ex, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: "#d1f7d1",
              padding: "5px",
              marginBottom: "5px",
              borderRadius: "5px",
            }}
          >
            {ex.exerciseIds.map((exId) => {
              return exId ? (
                <div key={exId.id}>
                  {exId.name} - {ex.series} series de {ex.repetitions} repeticiones, descanso: {ex.rest}s
                </div>
              ) : null;
            })}

            <Button
              variant="danger"
              size="sm"
              onClick={() => handleRemoveExerciseFromDay(ex, day.index)}
              style={{ marginLeft: '10px' }}
            >
              ×
            </Button>
          </div>
        ))}
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
                      ×
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
            <Form.Group className="mb-2">
              <Form.Control
                type="text"
                placeholder="Series"
                value={exercise.series}
                onChange={(e) => setExercise({ ...exercise, series: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Control
                type="text"
                placeholder="Repeticiones"
                value={exercise.repetitions}
                onChange={(e) => setExercise({ ...exercise, repetitions: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Control
                type="text"
                placeholder="Descanso (segundos)"
                value={exercise.rest}
                onChange={(e) => setExercise({ ...exercise, rest: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleSaveExercise}>
            Guardar Ejercicio
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
