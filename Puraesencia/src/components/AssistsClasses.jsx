import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import api from "../Api";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AssistsClasses = () => {
  const [asistencias, setAsistencias] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = jwtDecode(token);
    const userId = decoded.id;

    api.get("/attendance/" + userId)
      .then((response) => {
        setAsistencias(response.data);
      })
      .catch((error) => console.error("Error al obtener asistencias", error));
  }, []);

  return (
    <div className="container py-3">
      <button className="btn btn-outline-primary mb-3" onClick={() => navigate("/")}> 
        <FaArrowLeft className="me-2" /> Volver 
      </button>
      <h4 className="text-center mb-3">Mis Asistencias</h4>
      <div className="d-flex flex-column gap-3">
        {asistencias.length > 0 ? (
          asistencias.map((asistencia, index) => (
            <div key={index} className="card shadow-sm p-3 rounded">
              <h5 className="fw-bold">{asistencia.classType.name}</h5>
              <p className="text-muted mb-0">
                {new Date(asistencia.date + "T00:00:00").toLocaleDateString("es-ES")}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-muted">No hay asistencias registradas.</p>
        )}
      </div>
    </div>
  );
};

export default AssistsClasses;