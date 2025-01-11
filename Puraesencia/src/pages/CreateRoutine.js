import React, { useState } from 'react';
import api from '../Api'; // Asegúrate de tener configurada esta instancia de Axios

const CreateRoutine = () => {
    const [name, setName] = useState('');
    const [exerciseIds, setExerciseIds] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      // Convertir los IDs en un array de números
      const ids = exerciseIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
  
      // Verificar que los IDs son válidos
      if (ids.length === 0) {
        alert('Por favor, ingrese al menos un ID de ejercicio válido.');
        return;
      }
  
      try {
        // Realizar la solicitud POST al backend con los datos correctos
        const response = await api.post('/routines/create', 
          {
            name: name, 
            exerciseIds: ids
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
            withCredentials: true
          }
        );
        alert('Rutina creada con éxito!');
        console.log(response.data);
      } catch (error) {
        console.error('Error creando la rutina:', error);
        alert('No autorizado o error en la creación.');
      }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <label>
          Nombre de la rutina:
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
        </label>
        <br />
        <label>
          IDs de ejercicios (separados por coma):
          <input 
            type="text" 
            value={exerciseIds} 
            onChange={(e) => setExerciseIds(e.target.value)} 
          />
        </label>
        <br />
        <button type="submit">Crear Rutina</button>
      </form>
    );
  };
  
  export default CreateRoutine;