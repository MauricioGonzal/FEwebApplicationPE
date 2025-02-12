import React, { useState } from "react";

const ExerciseSearch = ({ exercises }) => {
  const [query, setQuery] = useState("");
  const [filteredExercises, setFilteredExercises] = useState(exercises);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setQuery(query);

    if (query === "") {
      setFilteredExercises(exercises); // Restaurar lista completa
    } else {
      setFilteredExercises(
        exercises.filter((exercise) =>
          exercise.name.toLowerCase().includes(query)
        )
      );
    }
  };

  return (
    <div className="row g-2 mb-2">
      <div className="col-md-5">
        {/* Campo de búsqueda */}
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Buscar ejercicio..."
          value={query}
          onChange={handleSearchChange}
        />
      </div>
      <div className="col-md-7">
        {/* Lista de ejercicios filtrados */}
        <select className="form-select">
          <option value="">Seleccionar ejercicio</option>
          {filteredExercises.map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ExerciseSearch;