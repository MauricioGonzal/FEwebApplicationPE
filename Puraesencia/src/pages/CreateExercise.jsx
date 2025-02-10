import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import api from '../Api'; 


const CreateExercise = () => {
    const navigate = useNavigate();
    
  const [exercise, setExercise] = useState({
    name: '',
    description: '',
    url: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExercise((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes enviar los datos del ejercicio a una API o a un backend
    api.post('/exercises/create', {
        name: exercise.name,
        description: exercise.description
    }) // Cambia la URL según tu API
    .then((response) => {
        alert("Ejercicio creado correctamente");
        navigate('/');
    })
    .catch((error) => console.error("Error al cargar los datos:", error));    
    // Limpiar los campos del formulario después de enviar
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Crear Ejercicio</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Nombre:</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            value={exercise.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">Descripción:</label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            value={exercise.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="url" className="form-label">URL (opcional):</label>
          <input
            type="url"
            id="url"
            name="url"
            className="form-control"
            value={exercise.url}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">Crear Ejercicio</button>
      </form>
    </div>
  );
};

export default CreateExercise;
