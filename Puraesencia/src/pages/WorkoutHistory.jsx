import { useEffect, useState } from "react";
import jwtDecode from 'jwt-decode';
import { Button, ListGroup, Container, Row, Col, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from '../Api';

export default function WorkoutHistory() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No hay token de autenticación");
      return;
    }

    const decoded = jwtDecode(token);
    const userId = decoded.id;

    api.get(`/workout-sessions/${userId}`)
      .then((response) => {
        if (response.data.length > 0) {
          setSessions(response.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error cargando sesiones:", error);
        setLoading(false);
      });
  }, []);

  // Agrupar sesiones por fecha
  const groupedSessions = sessions.reduce((acc, session) => {
    const date = new Date(session.workoutSession.date).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(session);
    return acc;
  }, {});

  const loadWorkoutLogs = (sessionIds) => {
    if (selectedSession && selectedSession.length > 0 && selectedSession.every(id => sessionIds.includes(id))) {
      setSelectedSession(null); // Si ya está seleccionada, la deseleccionamos
    } else {
      setSelectedSession(sessionIds);
    }
  };

  const handleShowModal = (workout) => {
    setSelectedWorkout(workout);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedWorkout(null);
  };

  if (loading) {
    return <div className="text-center mt-5"><h4>Cargando sesiones...</h4></div>;
  }

  return (
    <Container className="py-4">
      {/* Historial de Sesiones */}
      <Row>
        <Col xs={12}>
          <h3 className="text-center">📅 Historial de Entrenamientos</h3>
          <ListGroup>
            {Object.keys(groupedSessions).length > 0 ? (
              Object.entries(groupedSessions).map(([date, sessions]) => (
                <ListGroup.Item
                  key={date}
                  action
                  onClick={() => loadWorkoutLogs(sessions.map(s => s.workoutSession.id))}
                  className={selectedSession?.some(id => sessions.map(s => s.workoutSession.id).includes(id)) ? "active" : ""}
                >
                  🏋️‍♂️ Sesiones del {date}
                </ListGroup.Item>
              ))
            ) : (
              <p className="text-center mt-3">No tienes sesiones registradas.</p>
            )}
          </ListGroup>
        </Col>
      </Row>

      {/* Ejercicios de la sesión */}
      {selectedSession && (
        <Row className="mt-4">
          <Col xs={12}>
            <h3 className="text-center">💪 Ejercicios de la Sesión</h3>
            <ListGroup>
              {selectedSession.map((sessionId) => {
                const session = sessions.find(s => s.workoutSession.id === sessionId);
                if (!session) return null;

                return (
                  <ListGroup.Item key={session.workoutSession.id} className="d-flex justify-content-between align-items-center">
                    <strong>{session.workoutLog.exercise?.name}</strong>
                    <Button variant="info" size="sm" onClick={() => handleShowModal(session)}>
                      Ver Sets
                    </Button>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </Col>
        </Row>
      )}

      {/* Botón Volver al Inicio */}
      <Row className="mt-4">
        <Col xs={12} className="text-center">
          <Button variant="primary" onClick={() => navigate('/')} className="w-100">
            Volver al Inicio
          </Button>
        </Col>
      </Row>

      {/* Modal para mostrar los sets */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Entrenamiento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedWorkout && (
            <>
              <h5 className="text-center">{selectedWorkout.workoutLog.exercise?.name}</h5>
              <ListGroup>
                {selectedWorkout.sets.map((set) => (
                  <ListGroup.Item key={set.id}>
                    <strong>Repeticiones: {set.repetitions}</strong> | Peso: {set.weight} kg
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <p className="text-muted text-center mt-2">{selectedWorkout.workoutLog.notes}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal} className="w-100">
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
