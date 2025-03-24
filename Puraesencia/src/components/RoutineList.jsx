import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Api"; // Asegúrate de que tienes tu API configurada
import WatchRoutine from "./WatchRoutine"; // Ver rutina dentro del modal
import { Modal } from "react-bootstrap";


export default function RoutineList() {
  const [routines, setRoutines] = useState([]);
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/routines/nocustom")
      .then((response) => {
        console.log(Object.entries(response.data)[0])
        setRoutines(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener las rutinas", error);
      });
  }, []);

  const handleView = (routine) => {
    setSelectedRoutine(routine);
    setModalOpen(true);
  };

  const handleEdit = (id) => {
    navigate(`/edit-routine/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta rutina?")) {
      api.delete(`/routines/${id}`)
        .then(() => {
          setRoutines(routines.filter(routine => routine.id !== id));
        })
        .catch(error => {
          console.error("Error al eliminar la rutina", error);
        });
    }
  };

  return (
    <div className="container mt-4">
      <h2>Listado de Rutinas</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(routines).map((routine) => (
            <tr key={routine.id}>
              <td>{routine.name}</td>
              <td>{routine.description}</td>
              <td>
                <button className="btn btn-info me-2" onClick={() => handleView(routine)}>Ver</button>
                <button className="btn btn-warning me-2" onClick={() => handleEdit(routine.id)}>Editar</button>
                <button className="btn btn-danger" onClick={() => handleDelete(routine.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para ver la rutina */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Detalles de la Rutina">
        {selectedRoutine && <WatchRoutine routineId={selectedRoutine.id} />}
      </Modal>
    </div>
  );
}
