import { useEffect, useState } from "react";
import jwtDecode from 'jwt-decode';
import {Button, ListGroup, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from '../Api';

export default function WorkoutHistory() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Hook para navegar hacia atrás

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No hay token de autenticación");
      return;
    }

    const decoded = jwtDecode(token);
    const userId = decoded.id;

    // Obtener las sesiones del usuario autenticado
    api.get(`/workout-sessions/${userId}`)
      .then((response) => {
        setSessions(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error cargando sesiones:", error);
        setLoading(false);
      });
  }, []);

  const loadWorkoutLogs = (sessionId) => {
    api.get(`/workout-logs/${sessionId}`)
      .then((response) => {
        setWorkoutLogs(response.data);
        setSelectedSession(sessionId);
      })
      .catch((error) => console.error("Error cargando logs:", error));
  };

  if (loading) {
    return <div className="text-center mt-5"><h4>Cargando sesiones...</h4></div>;
  }

  return (
    <Container className="py-4">
      <Row>
        <Col md={6}>
          <h3>📅 Historial de Entrenamientos</h3>
          <ListGroup>
            {sessions.length > 0 ? (
              sessions.map((session) => (
                <ListGroup.Item
                  key={session.id}
                  action
                  onClick={() => loadWorkoutLogs(session.id)}
                  className={selectedSession === session.id ? "active" : ""}
                >
                  🏋️‍♂️ Sesión del {new Date(session.date).toLocaleDateString()}
                </ListGroup.Item>
              ))
            ) : (
              <p>No tienes sesiones registradas.</p>
            )}
          </ListGroup>
        </Col>

        <Col md={6}>
          {selectedSession && (
            <>
              <Button variant="secondary" onClick={() => setSelectedSession(null)} className="mb-3">
                Volver atrás
              </Button>

              <h3>💪 Ejercicios de la Sesión</h3>
              <ListGroup>
                {workoutLogs.map((log) => (
                  <ListGroup.Item key={log.id}>
                    <strong>{log.exercise.name}</strong>
                    <p>Repeticiones: {log.repetitions} | Peso: {log.weight} kg</p>
                    <p className="text-muted">{log.notes}</p>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          )}

          {!selectedSession && (
            <p>Selecciona una sesión para ver los detalles.</p>
          )}

          {/* Botón para volver al inicio (Dashboard) */}
          <Button variant="primary" onClick={() => navigate('/')}>
            Volver al Inicio
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
