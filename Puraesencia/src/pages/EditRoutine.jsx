import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../Api"; 
import jwtDecode from 'jwt-decode';

const EditRoutine = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [routine, setRoutine] = useState(null);
    const [schedule, setSchedule] = useState({});

    useEffect(() => {
        api.get('/users/' + userId + '/routine') // Cambia la URL según tu API
            .then((response) => {
                setRoutine(response.data);
                setSchedule(response.data.exercisesByDay);
                setLoading(false);
            })
            .catch((error) => console.error("Error al cargar los datos:", error));
    }, [userId]);
  
    const handleChangeExercise = (day, index, field, value) => {
      setSchedule((prevSchedule) => ({
        ...prevSchedule,
        [day]: prevSchedule[day].map((ex, i) =>
          i === index ? { ...ex, [field]: value } : ex
        ),
      }));
    };
  
    const handleAddExercise = (day) => {
      setSchedule((prevSchedule) => ({
        ...prevSchedule,
        [day]: [...prevSchedule[day], { exerciseId: "", name: "", series: "", repetitions: "" }],
      }));
    };
  
    const handleRemoveExercise = (day, index) => {
      setSchedule((prevSchedule) => ({
        ...prevSchedule,
        [day]: prevSchedule[day].filter((_, i) => i !== index),
      }));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      const updatedRoutine = { ...routine, exercisesByDay: schedule };
      console.log(updatedRoutine);
      if(updatedRoutine.isCustom === false){
        //tengo que crear un registro nuevo y actualizar el campo routine_id en user
        //tengo que llamar a /routines method post con todos los datos de rutina y luego llamar a endpoint para asignar rutina a usuario
        api.post('/routines', {
            title: routine.name,
            description: routine.description,
            isCustom: true,
            exercises: schedule
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
      }
      else{
        console.log(updatedRoutine.exercisesByDay);
        //CREAR ENDPOINT PARA EDITAR
        api.put('/routines/' + updatedRoutine.id, {
            title: updatedRoutine.name,
            description: updatedRoutine.description,
            isCustom: true,
            exercises: updatedRoutine.exercisesByDay
        }) // Cambia la URL según tu API
        .then((response) => {
            alert("Rutina editada correctamente");
            navigate('/');
        })
        .catch((error) => console.error("Error al cargar los datos:", error));
      }
      /*
      fetch(`https://tu-api.com/routines/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedRoutine),
      })
        .then((response) => {
          if (response.ok) {
            alert("Rutina actualizada con éxito");
            navigate("/");
          } else {
            alert("Error al actualizar la rutina");
          }
        })
        .catch((error) => {
          console.error("Error al actualizar la rutina:", error);
        });*/
    };
  
    if (loading) return <p className="text-center">Cargando rutina...</p>;
    if (!routine) return <p className="text-center text-danger">Error al cargar la rutina</p>;
  
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light p-4">
        <div className="bg-white shadow rounded p-4 w-100" style={{ maxWidth: "900px" }}>
          <h2 className="text-center text-dark mb-4">Editar Rutina</h2>
          <form onSubmit={handleSubmit}>
            {/* Título y Descripción */}
            <div className="mb-3">
              <label className="form-label">Título</label>
              <input
                type="text"
                className="form-control"
                value={routine.name}
                onChange={(e) => setRoutine({ ...routine, name: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Descripción</label>
              <textarea
                className="form-control"
                rows="3"
                value={routine.description}
                onChange={(e) => setRoutine({ ...routine, description: e.target.value })}
              />
            </div>
  
            {/* Ejercicios por Día */}
            {Object.keys(schedule).map((day) => (
              <div key={day} className="mb-4 p-3 border rounded bg-light">
                <h4 className="text-primary">Día {day}</h4>
                {schedule[day].map((exercise, index) => (
                  <div key={index} className="mb-3 row">
                    <div className="col-md-4">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Ejercicio"
                        value={exercise.name}
                        onChange={(e) => handleChangeExercise(day, index, "name", e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Series"
                        value={exercise.series}
                        onChange={(e) => handleChangeExercise(day, index, "series", e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Repeticiones"
                        value={exercise.repetitions}
                        onChange={(e) => handleChangeExercise(day, index, "repetitions", e.target.value)}
                      />
                    </div>
                    <div className="col-md-2 d-flex align-items-center">
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemoveExercise(day, index)}
                      >
                        ❌
                      </button>
                    </div>
                  </div>
                ))}
                <button type="button" className="btn btn-success btn-sm" onClick={() => handleAddExercise(day)}>
                  + Agregar ejercicio
                </button>
              </div>
            ))}
  
            {/* Botones de acción */}
            <div className="d-flex justify-content-between mt-4">
              <button type="submit" className="btn btn-primary">
                Guardar Cambios
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/")}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

export default EditRoutine;
