import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import jwtDecode from 'jwt-decode';
import api from '../Api';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { toast } from 'react-toastify';
import { Modal, Button, Form } from "react-bootstrap";
import Select from "react-select";

const daysOfWeek = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"];

const AdminClassesDashboard = () => {
  const [schedule, setSchedule] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [classTypes, setClassTypes] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [selectedClassType, setSelectedClassType] = useState(null);
  const [classesToEdit, setClassesToEdit] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");

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
    api.get('/users/getAllByRole/teacher')
        .then((response) =>{ 
            setInstructors(response.data)}
        )
        .catch((error) => console.error("Error al obtener profesores", error));
  }, []);

  useEffect(() => {
    api.get('/classTypes')
    .then((response) =>{ 
        setClassTypes(response.data);
    })
    .catch((error) => console.error("Error al obtener clases", error));
  }, []);

  useEffect(() => {
    fetchSchedule();
  }, [refresh]);

  const addClassSession = () => {
    console.log(selectedInstructor);
    const session = { 
        classType: selectedClassType.value,
        startTime,
        endTime,
        dayOfWeek: selectedDay,
        teacher: selectedInstructor.value
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

  const handleShowModal = (day) => {
    setEditModalVisible(true);
    setSelectedDay(day);
  };

  const handleEditClass = (session) => {
    setSelectedSession(session);
    // Asegúrate de que el instructor esté en el formato adecuado
    setSelectedInstructor({
        value: session.teacher, 
        label: session.teacher.fullName 
    });
    setNewStartTime(session.startTime);
    setNewEndTime(session.endTime);
    setSelectedClassType({ value: session.classType, label: session.classType.name });
    setEditModalVisible(true);
};

  const handleDeleteClass = (sessionId) => {
    api.delete(`/class-session/${sessionId}`)
      .then(() => {
        setRefresh(prev => !prev); // Refresca el estado después de eliminar
        toast.success("Clase eliminada exitosamente");
      })
      .catch((error) => console.error("Error deleting class:", error));
  };

  const updateClassSession = () => {
    const updatedSession = {
      ...selectedSession,
      startTime: newStartTime,
      endTime: newEndTime,
      classType: selectedClassType.value,

    };

    api.put(`/class-session/${selectedSession.id}`, updatedSession)
      .then(() => {
        setRefresh(prev => !prev);
        setEditModalVisible(false);
        toast.success("Clase actualizada correctamente");
      })
      .catch((error) => {
        console.error("Error al actualizar la clase:", error);
        setErrorMessage("No se pudo actualizar la clase");
        setShowErrorModal(true);
      });
  };

  const classTypeOptions = classTypes.map(classType => ({
    value: classType, 
    label: classType.name
  }));

  const instructorOptions = instructors.map(instructor => ({
    value: instructor, 
    label: instructor.fullName
  }));

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Grilla semanal de clases - Administrador</h2>
      <div className="row">
        {Object.entries(schedule).map(([day, classes]) => (
          <div key={day} className="col-md-4 mb-3">
            <div className="card">
              <div className="card-header bg-primary text-white text-center">
                {day}
                <button
                  className="btn btn-success btn-sm float-end"
                  onClick={() => { setSelectedDay(day); setModalVisible(true); }}
                >
                  Agregar Clase
                </button>
              </div>
              <ul className="list-group list-group-flush">
                {classes?.map((session, index) => (
                  <li key={index} className="list-group-item">
                    <strong>{session.startTime} - {session.endTime}</strong>: {session?.classType.name} . {session.teacher.fullName}
                    <div className="float-end">
                      <button
                        className="btn btn-warning btn-sm mx-2"
                        onClick={() => handleEditClass(session)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteClass(session.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for adding class session */}
      {modalVisible && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
            <div className="modal-header">
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
                <Select
                  options={instructorOptions}
                  value={selectedInstructor}  // El valor debe ser el objeto completo
                  onChange={setSelectedInstructor}  // Asegúrate de que onChange se maneje correctamente
                  placeholder="Seleccionar instructor"
                  isSearchable
                  className="mb-3"
                />
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

      {/* Modal for editing class session */}
      {editModalVisible && selectedSession && (
        <Modal show={editModalVisible} onHide={() => setEditModalVisible(false)} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>Editar Clase</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Select
              value={selectedClassType.value.id}
              onChange={(e) => setSelectedClassType({ value: classTypes.find(c => c.id === e.target.value), label: e.target.selectedOptions[0].text })}
            >
              {classTypes.map((classType) => (
                <option key={classType.id} value={classType.id}>
                  {classType.name}
                </option>
              ))}
            </Form.Select>
            <Select
              options={instructorOptions}
              value={selectedInstructor}  // El valor debe ser el objeto completo
              onChange={setSelectedInstructor}  // Asegúrate de que onChange se maneje correctamente
              isSearchable
              className="mb-3"
            />
            <Form.Control 
              type="time" 
              value={newStartTime} 
              onChange={(e) => setNewStartTime(e.target.value)} 
            />
            <Form.Control 
              type="time" 
              value={newEndTime} 
              onChange={(e) => setNewEndTime(e.target.value)} 
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={updateClassSession}>
              Guardar Cambios
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Error Modal */}
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

export default AdminClassesDashboard;
