import React, { useEffect, useState } from 'react';
import api from '../Api';

const Routines = () => {
  const [routines, setRoutines] = useState([]);

  useEffect(() => {
    // Obtener rutinas desde el backend
    const fetchRoutines = async () => {
      try {
        const response = await api.get('/routine');
        setRoutines(response.data);
      } catch (error) {
        console.error('Error fetching routines:', error);
      }
    };

    fetchRoutines();
  }, []);

  return (
    <div>
      <h1>Routines</h1>
      <ul>
        {routines.map(routine => (
          <li key={routine.id}>
            {routine.name} (Ejercicios: {routine.exercises.length})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Routines;