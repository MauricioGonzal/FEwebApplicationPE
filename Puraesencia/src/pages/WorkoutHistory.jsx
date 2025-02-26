import { useEffect, useState } from "react";
import jwtDecode from 'jwt-decode';
import { Button, ListGroup, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from '../Api';

export default function WorkoutHistory() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [workoutLogs, setWorkoutLogs] = useState([]);
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
        if(response.data.length > 0){
          setSessions(response.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error cargando sesiones:", error);
        setLoading(false);
      });
  }, []);

  const loadWorkoutLogs = (sessionIds) => {
    Promise.all(sessionIds.map(sessionId => api.get(`/workout-logs/${sessionId}`)))
      .then((responses) => {
        setWorkoutLogs(responses.flatMap(res => res.data));
        setSelectedSession(sessionIds);
      })
      .catch((error) => console.error("Error cargando logs:", error));
  };

  // Agrupar sesiones por fecha
  const groupedSessions = sessions.reduce((acc, session) => {
    const date = new Date(session.date).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(session);
    return acc;
  }, {});

  if (loading) {
    return <div className="text-center mt-5"><h4>Cargando sesiones...</h4></div>;
  }

  return (
    <Container className="py-4">
      <Row>
        <Col md={6}>
          <h3>📅 Historial de Entrenamientos</h3>
          <ListGroup>
            {Object.keys(groupedSessions).length > 0 ? (
              Object.entries(groupedSessions).map(([date, sessions]) => (
                <ListGroup.Item
                  key={date}
                  action
                  onClick={() => loadWorkoutLogs(sessions.map(s => s.id))}
                  className={selectedSession?.some(id => sessions.map(s => s.id).includes(id)) ? "active" : ""}
                >
                  🏋️‍♂️ Sesiones del {date}
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

          {!selectedSession && <p>Selecciona una sesión para ver los detalles.</p>}

          <Button variant="primary" onClick={() => navigate('/')}>
            Volver al Inicio
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
