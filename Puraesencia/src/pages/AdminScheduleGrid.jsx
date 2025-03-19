import React, { useEffect, useState } from "react";
import api from "../Api";
import Select from "react-select";
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

const daysOfWeek = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"];

const AdminScheduleGrid = () => {
  const [schedule, setSchedule] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [classTypes, setClassTypes] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [selectedClassType, setSelectedClassType] = useState(null);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = () => {
    api.get('/schedules/1/sessions')
    .then((response) =>{ 
        const formattedSchedule = daysOfWeek.reduce((acc, day) => {
            acc[day] = response.data.filter(session => session.dayOfWeek === day);
            return acc;
            }, {});
        setSchedule(formattedSchedule);
    })
    .catch((error) => console.error("Error fetching schedule:", error));
  };

  useEffect(() => {
    api.get('/classTypes')
    .then((response) =>{ 
        setClassTypes(response.data);
    })
    .catch((error) => console.error("Error al obtener clases", error));
  }, [])

  const addClassSession = () => {
    const session = { 
        classType: selectedClassType.value,
        startTime,
        endTime,
        dayOfWeek: selectedDay,
    };

    api.post('/schedules/1/sessions', session)
        .then((response) => {
            fetchSchedule();
            toast.success("Sesión creada correctamente", {
                position: "top-right", // Ahora directamente como string
              });
            setModalVisible(false);
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            setErrorMessage(error.response.data.error || "Error desconocido");
          } else {
            setErrorMessage("Error al realizar la solicitud");
          }
          setShowErrorModal(true);  // Mostrar modal con el error
    });
  };

  

  const classTypeOptions = classTypes.map(classType => ({
    value: classType, 
    label: classType.name
}));    

  return (
    <div className="container p-4">
      <h2 className="h3 mb-4 text-center text-primary">Administrar Horarios de Clases</h2>
      
      {/* Table for the schedule */}
      <div className="row">
        <div className="col">
          <div className="card shadow-sm">
            <div className="card-body">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Día</th>
                    <th>Horarios</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {daysOfWeek.map(day => (
                    <tr key={day}>
                      <td className="fw-bold">{day}</td>
                      <td>
                        <ul>
                          {schedule[day]?.map((session, index) => (
                            <li key={index}>{`${session.startTime} - ${session.endTime}: ${session?.classType.name}. ${session.classType.teacher.fullName}`}</li>
                          ))}
                        </ul>
                      </td>
                      <td>
                        <button className="btn btn-success btn-sm" onClick={() => { setSelectedDay(day); setModalVisible(true); }}>
                          <i className="bi bi-plus-circle me-1"></i> Agregar Clase
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for adding class session */}
      {modalVisible && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Agregar Clase</h5>
                <button type="button" className="btn-close" onClick={() => setModalVisible(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="daySelect" className="form-label">Día</label>
                  <select className="form-select" id="daySelect" value={selectedDay} disabled>
                    {daysOfWeek.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                    <Select
                        options={classTypeOptions}
                        value={selectedClassType}
                        onChange={(selectedOption) => setSelectedClassType(selectedOption)}
                        placeholder="Seleccionar clase"
                        isSearchable
                        className="mb-3"
                    />
                </div>
                <div className="mb-3">
                  <label htmlFor="startTimeInput" className="form-label">Hora de inicio</label>
                  <input type="time" className="form-control" id="startTimeInput" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label htmlFor="endTimeInput" className="form-label">Hora de fin</label>
                  <input type="time" className="form-control" id="endTimeInput" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={addClassSession}>Agregar Clase</button>
              </div>
            </div>
          </div>
        </div>
      )}
          <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
              <Modal.Header closeButton>
              <Modal.Title>Error</Modal.Title>
              </Modal.Header>
              <Modal.Body>{errorMessage}</Modal.Body>
              <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
                  Cerrar
              </Button>
              </Modal.Footer>
          </Modal>
    </div>
  );
};

export default AdminScheduleGrid;
