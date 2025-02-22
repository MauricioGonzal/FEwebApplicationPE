import { useState } from "react";
import { FaCheck, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const UserTable = ({ users, handleMarkAttendance, attendanceStatus, attendanceTypeOptions, selectedAttendanceType, setSelectedAttendanceType }) => {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();


    const filteredUsers = users.filter(user =>
        user.fullName.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            {/* Campo de búsqueda */}
            <input
                type="text"
                className="form-control mb-3"
                placeholder="Buscar usuario por nombre o correo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* Mostrar tabla solo si hay coincidencias */}
            {search.length > 0 && filteredUsers.length > 0 && (
                <table className="table table-hover table-bordered shadow-sm">
                    <thead className="table-dark text-center">
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.fullName}</td>
                                <td>{user.email}</td>
                                <td>
                                    {user.healthRecord === null && (
                                        <button
                                            className="btn btn-success btn-sm"
                                            onClick={() => navigate('/create-health-record/' + user.id)}
                                        >
                                            <FaTrash className="me-1" /> Cargar Ficha de salud
                                        </button>
                                    )}
                                    {/* Mostrar botón o mensaje según asistencia */}
                                    
                                    {user.role !== "CLIENT_BOTH" ? (
  attendanceStatus.some((as) => as.user.id === user.id) ? (
    <span className="text-success fw-bold">
      <FaCheck className="me-1" /> Presente Hoy
    </span>
  ) : (
    <button className="btn btn-primary btn-sm me-2" onClick={() => handleMarkAttendance(user.id)}>
      <FaCheck className="me-1" /> Marcar Presente
    </button>
  )
) : (
  (() => {
    const userAttendances = attendanceStatus.filter((as) => as.user.id === user.id);
    const hasGym = userAttendances.some((as) => as.attendanceType.name === "Gimnasio");
    const hasClasses = userAttendances.some((as) => as.attendanceType.name === "Clases");

    if (hasGym && hasClasses) {
      return (
        <>
          <span className="text-success fw-bold">
            <FaCheck className="me-1" /> Presente Gimnasio
          </span>
          <br />
          <span className="text-success fw-bold">
            <FaCheck className="me-1" /> Presente Clases
          </span>
        </>
      );
    }

    return (
      <>
        {hasGym && (
          <span className="text-success fw-bold">
            <FaCheck className="me-1" /> Presente Gimnasio
          </span>
        )}
        {hasClasses && (
          <span className="text-success fw-bold">
            <FaCheck className="me-1" /> Presente Clases
          </span>
        )}

        {/* Mostrar el botón si falta marcar una asistencia */}
        {!(hasGym && hasClasses) && (
          <>
            <Select
              options={attendanceTypeOptions}
              value={selectedAttendanceType}
              onChange={(selectedOption) => setSelectedAttendanceType(selectedOption)}
              placeholder="Seleccionar tipo de presente..."
              isSearchable
            />
            <button
              disabled={!selectedAttendanceType}
              className="btn btn-primary btn-sm me-2"
              onClick={() => handleMarkAttendance(user.id)}
            >
              <FaCheck className="me-1" /> Marcar Presente
            </button>
          </>
        )}
      </>
    );
  })()
)}


                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Mostrar mensaje si no hay resultados */}
            {search.length > 0 && filteredUsers.length === 0 && (
                <p className="text-center text-muted">No se encontraron usuarios.</p>
            )}
        </div>
    );
};

export default UserTable;
