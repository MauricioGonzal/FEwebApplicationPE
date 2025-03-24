import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useParams } from "react-router-dom";
import api from '../Api';

export default function WatchRoutine() {
  const daysOfWeek = [
    { index: 1, name: "Lunes" }, { index: 2, name: "Martes" }, { index: 3, name: "Miércoles" },
    { index: 4, name: "Jueves" }, { index: 5, name: "Viernes" }, { index: 6, name: "Sábado" }, { index: 7, name: "Domingo" }
  ];

  const [exercisesList, setExercises] = useState([]);
  const [routine, setRoutine] = useState({ name: "", description: "", isCustom: false, exercisesByDay: {} });
  const { routineId } = useParams();

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

  return (
    <div className="container mt-4">
      <h1 className="mb-3">{routine.name}</h1>
      <h1 className="mb-3">{routine.description}</h1>

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
        </div>
      );
    })
  : <p>Sin ejercicios</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
