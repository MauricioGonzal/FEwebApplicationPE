import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Api"; // Asegúrate de que tienes tu API configurada
import RoutineModal from "../components/RoutineModal";
import { toast } from 'react-toastify';
import ConfirmationDeleteModal from "../components/ConfirmationDeleteModal";
import ErrorModal from "../components/ErrorModal";

export default function RoutineList() {
  const [groupedRoutines, setGroupedRoutines] = useState([]);
  const [selectedRoutineDetails, setSelectedRoutineDetails] = useState([]);
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [showRoutineModal, setShowRoutineModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    api.get("/routines/nocustom")
      .then((response) => {
        const grouped = response.data.reduce((acc, routineSet) => {
          const { routine } = routineSet;
          if (!acc[routine.id]) {
              acc[routine.id] = {
                  routine,
                  routineSets: [],
              };
          }
          acc[routine.id].routineSets.push(routineSet);
          return acc;
      }, {});
      setGroupedRoutines(grouped);
        //setRoutines(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener las rutinas", error);
      });
  }, [refresh]);

  const handleView = (routine) => {
    setSelectedRoutineDetails(groupedRoutines[routine.id].routineSets);
    setShowRoutineModal(true);
  };

  const handleEdit = (id) => {
    navigate(`/edit-routine/${id}/0`);
  };

  const handleDelete = () => {
    api.delete(`/routines/${selectedRoutine.id}`)
      .then(() => {
        toast.success("Rutina eliminada correctamente", {
          position: "top-right", // Ahora directamente como string
        });
        setRefresh(prev => !prev);
        setShowConfirmationModal(false);
      })
      .catch(error => {
        if (error.response && error.response.data) {
          setErrorMessage(error.response.data.message || "Error desconocido");
        } else {
          setErrorMessage("Error al realizar la solicitud");
        }
        setShowErrorModal(true);  // Mostrar modal con el error
        setShowConfirmationModal(false);
      });
  };

  const handleShowConfirmationModal = (routine) => {
    setSelectedRoutine(routine);
    setShowConfirmationModal(true);
  };

  return (
    <div className="container mt-4">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(groupedRoutines).map(({ routine, routineSets }) => (
            <tr key={routine.id}>
              <td>{routine.name}</td>
              <td>{routine.description}</td>
              <td>
                <button className="btn btn-info me-2" onClick={() => handleView(routine)}>Ver</button>
                <button className="btn btn-warning me-2" onClick={() => handleEdit(routine.id)}>Editar</button>
                <button className="btn btn-danger" onClick={() => handleShowConfirmationModal(routine)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para ver la rutina */}
      {showRoutineModal && <RoutineModal routine={selectedRoutineDetails} onClose={() => setShowRoutineModal(false)} />}
      <ErrorModal showErrorModal={showErrorModal} setShowErrorModal={setShowErrorModal} errorMessage={errorMessage} />
      <ConfirmationDeleteModal showModal={showConfirmationModal} setShowModal={setShowConfirmationModal} message={`Seguro que quieres eliminar la rutina?`} handleDelete= {handleDelete}   /> 


    </div>
  );
}
