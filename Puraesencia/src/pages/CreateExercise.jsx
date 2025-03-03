import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import api from '../Api'; 
import { toast } from 'react-toastify';


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
        description: exercise.description,
        url: exercise.url 
    }) // Cambia la URL según tu API
    .then((response) => {
      toast.success("Transaccion creada correctamente", {
        position: "top-right", // Ahora directamente como string
      });
        navigate('/');
    })
    .catch((error) => console.error("Error al cargar los datos:", error));    
    // Limpiar los campos del formulario después de enviar
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h2 className="text-center mb-4 text-primary">Crear Ejercicio</h2>
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
                    placeholder="Ej. Flexiones"
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
                    placeholder="Descripción detallada del ejercicio"
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
                    placeholder="Ej. https://ejemplo.com/video"
                  />
                </div>

                <div className="d-flex justify-content-between">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => navigate('/')}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Crear Ejercicio
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateExercise;
