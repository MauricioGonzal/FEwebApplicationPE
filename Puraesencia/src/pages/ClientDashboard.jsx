import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import jwtDecode from 'jwt-decode';
import api from '../Api';
import { logout } from "./Logout";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const ClientDashboard = () => {
    const daysOfWeek = [
        { index: 1, name: "Lunes" }, { index: 2, name: "Martes" }, { index: 3, name: "Miércoles" },
        { index: 4, name: "Jueves" }, { index: 5, name: "Viernes" }, { index: 6, name: "Sábado" }, { index: 7, name: "Domingo" }
      ];
    const navigate = useNavigate();
    const [routine, setRoutine] = useState(null);
    const [loading, setLoading] = useState(true);
    const [exercises, setExercises] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);
        api.get(`/users/${decoded.id}/routine`) // Ajusta la URL según tu API
            .then(response => {
                setRoutine(response.data);
                setLoading(false);
                console.log(response.data);
            })
            .catch(error => console.error("Error al cargar la rutina:", error));
    }, []);

    useEffect(() => {
        // Cargar los ejercicios disponibles
        api.get("/exercises")
          .then((response) => {
            setExercises(response.data);
          })
          .catch((error) => {
            console.error("Error al obtener los ejercicios", error);
          });
      }, []);

    if (loading) {
        return <div className="text-center mt-5"><h4>Cargando rutina...</h4></div>;
    }

    return (
        <div className="container-fluid">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
                <div className="container">
                    <button className="btn btn-secondary" onClick={() => navigate('/perfil')}>Perfil</button>
                    <button className="btn btn-danger ms-auto" onClick={() => logout(navigate)}>Cerrar Sesión</button>
                </div>
            </nav>

            {/* Rutina */}
            {routine !== "" ?
    <div className="container mt-4">
      <div className="row">
        
        {daysOfWeek.map((day) => (
          <div key={day.index} className="col-md-6 mb-3">
            <div className="card p-3 shadow-sm">
              <h5 className="card-title">{day.name}</h5>
              <div className="card-text">
              {routine !== "" && routine.exercisesByDay[day.index] && routine.exercisesByDay[day.index].length > 0
  ? routine.exercisesByDay[day.index].map((ex, idx) => {
      // Buscar los ejercicios correspondientes a cada exerciseId
      const exercisesDetails = ex.exerciseIds.map((id) => {
        const exerciseDetail = exercises.find((ex) => ex.id === id);
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
        :
        <div className="alert alert-warning text-center" role="alert">
        <h4 className="alert-heading">¡Atención!</h4>
        <p>Todavia no tienes una rutina asignada.</p>
        </div>        
        }
        {/* Footer */}
            <footer className="text-center py-3 bg-light">
                <small>&copy; 2025 Gimnasio Pura Esencia</small>
            </footer>
        </div>
    );
};

export default ClientDashboard;