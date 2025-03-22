import { useEffect, useState } from "react";
import jwtDecode from 'jwt-decode';
import { Button, ListGroup, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from '../Api';

export default function WorkoutHistory() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
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
        console.log(response.data);
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
    // No es necesario cargar los logs por separado, ya vienen incluidos en la respuesta
    setSelectedSession(sessionIds);
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
                {selectedSession.map((sessionId) => {
                  const session = sessions.find(s => s.workoutSession.id === sessionId);
                  if (!session) return null;

                  return (
                    <div key={session.workoutSession.id}>
                      <h5>{session.workoutLog.exercise?.name}</h5>
                      {session.sets.map((set) => (
                        <ListGroup.Item key={set.id}>
                          <strong>Repeticiones: {set.repetitions}</strong> | Peso: {set.weight} kg
                        </ListGroup.Item>
                      ))}
                      <p className="text-muted">{session.workoutLog.notes}</p>
                    </div>
                  );
                })}
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
