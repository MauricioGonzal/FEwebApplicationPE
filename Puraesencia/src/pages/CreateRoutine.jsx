import api from "../Api"; 
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import jwtDecode from 'jwt-decode';


const RoutineForm = () => {
  const [schedule, setSchedule] = useState({});
  const [exercises, setExercises] = useState([]);
  const navigate = useNavigate();
  const { isCustom, userId } = useParams();
  const [routineName, setRoutineName] = useState("");
  const [routineDescription, setRoutineDescription] = useState("");

  // Obtener ejercicios desde el backend
  useEffect(() => {
    api
      .get("/exercises")  // Asegúrate de que esta sea la URL correcta de tu API
      .then((response) => {
        setExercises(response.data); // Asumiendo que la respuesta es un array de ejercicios
      })
      .catch((error) => {
        console.error("Error al obtener los ejercicios", error);
      });
  }, []); // Este efecto se ejecuta solo una vez al cargar el componente

  const handleAddDay = () => {
    const newDay = Object.keys(schedule).length + 1;
    setSchedule({ ...schedule, [newDay]: [] });
  };

  const handleAddExercise = (day, isGroup = false) => {
    if (isGroup) {
      // Crear un nuevo grupo de ejercicios con un ID único
      const newGroup = {
        groupId: Date.now(),
        exercises: [],
      };
      setSchedule({ ...schedule, [day]: [...schedule[day], newGroup] });
    } else {
      // Agregar un ejercicio normal
      const newExercise = { exerciseIds: "", series: "", repetitions: "" };
      setSchedule({
        ...schedule,
        [day]: [...schedule[day], newExercise],
      });
    }
  };

  const handleAddExerciseToGroup = (day, groupId) => {
    const updatedDay = schedule[day].map((item) => {
      if (item.groupId === groupId) {
        return { ...item, exercises: [...item.exercises, { exerciseIds: "", series: "", repetitions: "" }] };
      }
      return item;
    });

    setSchedule({ ...schedule, [day]: updatedDay });
  };

  const handleChangeExercise = (day, index, field, value, groupId = null) => {
    const updatedDay = [...schedule[day]];
    
    if (groupId) {
      updatedDay.forEach((group) => {
        if (group.groupId === groupId) {
          group.exercises[index][field] = value;
        }
      });
    } else {
      updatedDay[index] = { ...updatedDay[index], [field]: value };
    }

    setSchedule({ ...schedule, [day]: updatedDay });
  };

  const handleRemoveExercise = (day, index, groupId = null) => {
    const updatedDay = schedule[day].map((item) => {
      if (groupId && item.groupId === groupId) {
        item.exercises = item.exercises.filter((_, i) => i !== index);
      }
      return item;
    });

    setSchedule({ ...schedule, [day]: updatedDay });
  };

  const handleRoutineSubmit = (data) => {
    var customAux = false;
    if(isCustom === "1"){
      customAux = true;
    }
    
    api.post('/routines', {
        title: data.title,
        description: data.description,
        isCustom: customAux,
        exercises: data.schedule
      })
      .then((response) => {
        if(userId !== undefined){
          const token = localStorage.getItem('token');
          const decoded = jwtDecode(token);
          api.put(`/users/assign-routine`, {
            trainerId: decoded.id,
            userId: userId,
            routineId: response.data.id
          }
          )
            .then((response) => {
              alert("Rutina creada correctamente");
              navigate('/')
            })
            .catch(error => console.error("Error al crear rutina:", error));
        }
        else{
          alert("Rutina creada correctamente");
          navigate('/');
        }
    })
    .catch(error => console.error("Error al crear rutina:", error));
};

const handleSubmit = (e) => {
  e.preventDefault();

  Object.entries(schedule).forEach(([day, exercises]) => {
    var exerciseIdsAux = [];
    var groupItem = { exerciseIds: [], series: "", repetitions: ""}
    exercises.forEach((ex, index)=>{
      if(ex.groupId !== undefined){
        ex.exercises.forEach((exOfGroup)=>{
          exerciseIdsAux.push(exOfGroup.exerciseId);
          groupItem.series = exOfGroup.series;
          groupItem.repetitions = exOfGroup.repetitions;
        })
        groupItem.exerciseIds = exerciseIdsAux;
        exercises.splice(1, index);
        schedule[day].push(groupItem);
      }
      else{
        schedule[day][index].exerciseIds = [ex.exerciseId]
      }
    });
  });
  handleRoutineSubmit({ title: routineName, description: routineDescription, schedule });
};


  return (
    <form onSubmit={handleSubmit}>
    <div className="container mt-4">
    <h2 className="text-center mb-4">Crear Rutina</h2>
    <div className="mb-3">
          <label className="form-label">Título</label>
          <input
            type="text"
            className="form-control"
            placeholder="Ingrese el título"
            value={routineName}
            onChange={(e) => setRoutineName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea
            className="form-control"
            placeholder="Ingrese una descripción"
            value={routineDescription}
            onChange={(e) => setRoutineDescription(e.target.value)}
            required
          />
        </div>
    <button type="button" className="btn btn-primary mb-3" onClick={handleAddDay}>
      + Agregar Día
    </button>

    {Object.keys(schedule).map((day) => (
      <div key={day} className="border rounded p-3 mb-3">
        <h5 className="text-dark">Día {day}</h5>

        {schedule[day].map((item, index) =>
          item.groupId ? (
            <div key={item.groupId} className="border rounded p-3 mb-3 bg-light">
              <h6 className="text-primary">Grupo de Ejercicios</h6>
              {item.exercises.map((exercise, i) => (
                <div key={i} className="row g-2 mb-2">
                  <div className="col-md-5">
                    <select
                      className="form-select"
                      value={exercise.exerciseId}
                      onChange={(e) =>
                        handleChangeExercise(day, i, "exerciseId", e.target.value, item.groupId)
                      }
                      required
                    >
                      <option value="">Seleccionar ejercicio</option>
                      {exercises.map((ex) => (
                        <option key={ex.id} value={ex.id}>
                          {ex.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-3">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Series"
                      value={exercise.series}
                      onChange={(e) =>
                        handleChangeExercise(day, i, "series", e.target.value, item.groupId)
                      }
                      required
                    />
                  </div>

                  <div className="col-md-3">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Repeticiones"
                      value={exercise.repetitions}
                      onChange={(e) =>
                        handleChangeExercise(day, i, "repetitions", e.target.value, item.groupId)
                      }
                      required
                    />
                  </div>

                  <div className="col-md-1 d-flex align-items-center">
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemoveExercise(day, i, item.groupId)}
                    >
                      ✖
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleAddExerciseToGroup(day, item.groupId)}
              >
                + Agregar Ejercicio al Grupo
              </button>
            </div>
          ) : (
            <div key={index} className="row g-2 mb-2">
              <div className="col-md-5">
                <select
                  className="form-select"
                  value={item.exerciseId}
                  onChange={(e) =>
                    handleChangeExercise(day, index, "exerciseId", e.target.value)
                  }
                  required
                >
                  <option value="">Seleccionar ejercicio</option>
                  {exercises.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Series"
                  value={item.series}
                  onChange={(e) =>
                    handleChangeExercise(day, index, "series", e.target.value)
                  }
                  required
                />
              </div>

              <div className="col-md-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Repeticiones"
                  value={item.repetitions}
                  onChange={(e) =>
                    handleChangeExercise(day, index, "repetitions", e.target.value)
                  }
                  required
                />
              </div>

              <div className="col-md-1 d-flex align-items-center">
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => handleRemoveExercise(day, index)}
                >
                  ✖
                </button>
              </div>
            </div>
          )
        )}

        <button
          type="button"
          className="btn btn-success btn-sm me-2"
          onClick={() => handleAddExercise(day)}
        >
          + Agregar Ejercicio
        </button>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => handleAddExercise(day, true)}
        >
          + Crear Grupo de Ejercicios
        </button>
      </div>
      
    ))}
            <div className="d-flex justify-content-end gap-2 mt-4">
          <button type="submit" className="btn btn-primary">Guardar Rutina</button>
          <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>Cancelar</button>
        </div>
  </div>
  </form>
  );
};

export default RoutineForm;
