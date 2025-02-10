import { useEffect, useState } from "react";
import api from '../Api'; 
import { useNavigate, useParams } from "react-router-dom";
import jwtDecode from 'jwt-decode';


const RoutineForm = () => {
  const [routineName, setRoutineName] = useState("");
  const [routineDescription, setRoutineDescription] = useState("");
  const [schedule, setSchedule] = useState({});
  const [exercises, setExercises] = useState([]);
  const navigate = useNavigate();
  const { isCustom, userId } = useParams();


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

  const handleRoutineSubmit = (data) => {
    var customAux = false;
    if(isCustom === "1"){
      customAux = true;
    }
    
    api.post('/routines', {
        title: data.name,
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

  const handleAddDay = (day) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: prev[day] || [], // Si ya existe, no lo duplica
    }));
  };

  const handleAddExercise = (day) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: [...prev[day], { exerciseId: "", name:"", description:"", series: "", repetitions: "" }],
    }));
  };

  const handleChangeExercise = (day, index, field, value) => {
    const updatedExercises = [...schedule[day]];
    if (field === "exerciseId") {
      const selectedExercise = exercises.find((ex) => ex.id === Number(value));
      updatedExercises[index] = {
        ...updatedExercises[index],
        exerciseId: value,
        name: selectedExercise ? selectedExercise.name : "",
        description: selectedExercise ? selectedExercise.description : "",
      };
    } else {
      updatedExercises[index][field] = value;
    }
    setSchedule((prev) => ({ ...prev, [day]: updatedExercises }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(schedule);
    handleRoutineSubmit({ name: routineName, description: routineDescription, schedule });
  };

  const handleRemoveExercise = (day, index) => {
    setSchedule((prevSchedule) => ({
        ...prevSchedule,
        [day]: prevSchedule[day].filter((_, i) => i !== index) // Filtra el ejercicio en base al índice
    }));
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light p-4">
    <div className="bg-white shadow rounded p-4 w-100" style={{ maxWidth: '800px' }}>
      <h2 className="text-center text-dark mb-4">Crear Nueva Rutina</h2>
      <form onSubmit={handleSubmit}>
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

        <h4 className="text-dark mt-4">Días de Entrenamiento</h4>
        <div className="mb-3 d-flex flex-wrap gap-2">
          {['1', '2', '3', '4', '5', '6', '7'].map((day) => (
            <button 
              type="button" 
              key={day} 
              className="btn btn-outline-primary"
              onClick={() => handleAddDay(day)}
            >
              Día {day}
            </button>
          ))}
        </div>

        {Object.keys(schedule).map((day) => (
          <div key={day} className="border rounded p-3 mb-3">
            <h5 className="text-dark">Día {day}</h5>
            {schedule[day].map((exercise, index) => (
              <div key={index} className="row g-2 mb-2">
                <div className="col-md-5">
                  <select
                    className="form-select"
                    value={exercise.exerciseId}
                    onChange={(e) => handleChangeExercise(day, index, "exerciseId", e.target.value)}
                    required
                  >
                    <option value="">Seleccionar ejercicio</option>
                    {exercises.map((ex) => (
                      <option key={ex.id} value={ex.id}>{ex.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Series"
                    value={exercise.series}
                    onChange={(e) => handleChangeExercise(day, index, "series", e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Repeticiones"
                    value={exercise.repetitions}
                    onChange={(e) => handleChangeExercise(day, index, "repetitions", e.target.value)}
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
            ))}
            <button 
              type="button" 
              className="btn btn-success btn-sm" 
              onClick={() => handleAddExercise(day)}
            >
              + Agregar Ejercicio
            </button>
          </div>
        ))}

        <div className="d-flex justify-content-end gap-2 mt-4">
          <button type="submit" className="btn btn-primary">Guardar Rutina</button>
          <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>Cancelar</button>
        </div>
      </form>
    </div>
  </div>
  );
};

export default RoutineForm;