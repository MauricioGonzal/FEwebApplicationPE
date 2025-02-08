import { useState } from "react";

const RoutineForm = ({ exercises, onSubmit }) => {
  const [routineName, setRoutineName] = useState("");
  const [routineDescription, setRoutineDescription] = useState("");
  const [schedule, setSchedule] = useState({});

  const handleAddDay = (day) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: prev[day] || [], // Si ya existe, no lo duplica
    }));
  };

  const handleAddExercise = (day) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: [...prev[day], { exerciseId: "", series: "", repetitions: "" }],
    }));
  };

  const handleChangeExercise = (day, index, field, value) => {
    const updatedExercises = [...schedule[day]];
    updatedExercises[index][field] = value;
    setSchedule((prev) => ({ ...prev, [day]: updatedExercises }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(schedule);
    onSubmit({ name: routineName, description: routineDescription, schedule });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Título"
        value={routineName}
        onChange={(e) => setRoutineName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Descripción"
        value={routineDescription}
        onChange={(e) => setRoutineDescription(e.target.value)}
      />

      <div>
        <h3>Días</h3>
        {["1", "2", "3", "4", "5", "6", "7"].map((day) => (
          <button type="button" key={day} onClick={() => handleAddDay(day)}>
            {day}
          </button>
        ))}
      </div>

      {Object.keys(schedule).map((day) => (
        <div key={day}>
          <h4>{day}</h4>
          {schedule[day].map((exercise, index) => (
            <div key={index}>
              <select
                value={exercise.exerciseId}
                onChange={(e) =>
                  handleChangeExercise(day, index, "exerciseId", e.target.value)
                }
              >
                <option value="">Seleccionar ejercicio</option>
                {exercises.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Series"
                value={exercise.series}
                onChange={(e) =>
                  handleChangeExercise(day, index, "series", e.target.value)
                }
              />
              <input
                type="number"
                placeholder="Repeticiones"
                value={exercise.repetitions}
                onChange={(e) =>
                  handleChangeExercise(day, index, "repetitions", e.target.value)
                }
              />
            </div>
          ))}
          <button type="button" onClick={() => handleAddExercise(day)}>
            Agregar ejercicio
          </button>
        </div>
      ))}

      <button type="submit">Guardar Rutina</button>
    </form>
  );
};

export default RoutineForm;