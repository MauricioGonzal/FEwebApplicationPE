import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Navbar, Nav } from 'react-bootstrap';
import api from '../Api'; // Archivo de configuración de Axios
import jwtDecode from 'jwt-decode';

const ClientDashboard = () => {
    const [routine, setRoutine] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [trainer, setTrainer] = useState(null);
    const [trainerError, setTrainerError] = useState(null);

    // Cargar la rutina al montar el componente
    useEffect(() => {
        const fetchRoutine = async () => {
            try {
                const token = localStorage.getItem('token');
                const decoded = jwtDecode(token);
                const response = await api.get('/routines/email/' + decoded.sub);
                setRoutine(response.data.exercises); // Asume que el backend devuelve un array de ejercicios
            } catch (err) {
                console.error("Error al cargar la rutina:", err);
                setError("No se pudo cargar la rutina. Intenta nuevamente.");
            } finally {
                setLoading(false);
            }
        };

        fetchRoutine();
    }, []);

    // Cargar el entrenador del cliente
    useEffect(() => {
        const fetchTrainer = async () => {
            try {
                const token = localStorage.getItem('token');
                const decoded = jwtDecode(token);
                const response = await api.get('/users/' + decoded.id + '/trainer');
                setTrainer(response.data);
            } catch (err) {
                console.error("Error al cargar info del trainer:", err);
                setTrainerError("No tienes un entrenador asignado.");
            }
        };

        fetchTrainer();
    }, []);

    return (
        <>
            {/* Header */}
            <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
                <Container>
                    <Navbar.Brand href="#home">Gym Dashboard</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="#routine">Rutina</Nav.Link>
                            <Nav.Link href="#profile">Mis Datos</Nav.Link>
                            <Nav.Link href="#trainer">Mi Entrenador</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Main Content */}
            <Container fluid>
                <Row>
                    {/* Sidebar */}
                    <Col md={3} className="bg-light">
                        <Nav className="flex-column p-3">
                            <Nav.Link href="#routine">Ver Rutina</Nav.Link>
                            <Nav.Link href="#profile">Datos Personales</Nav.Link>
                            <Nav.Link href="#trainer">Mi Entrenador</Nav.Link>
                            <Nav.Link href="#logout">Cerrar Sesión</Nav.Link>
                        </Nav>
                    </Col>

                    {/* Main Sections */}
                    <Col md={9}>
                        {/* Rutina */}
                        <Card id="routine" className="mb-4">
                            <Card.Header>Mi Rutina</Card.Header>
                            <Card.Body>
                                {loading ? (
                                    <p>Cargando rutina...</p>
                                ) : error ? (
                                    <p className="text-danger">{error}</p>
                                ) : routine.length > 0 ? (
                                    <ul>
                                        {routine.map((exercise, index) => (
                                            <li key={index}>
                                                {exercise.name} - {exercise.sets}x{exercise.reps}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No tienes ejercicios asignados.</p>
                                )}
                            </Card.Body>
                        </Card>

                        {/* Datos Personales */}
                        <Card id="profile" className="mb-4">
                            <Card.Header>Mis Datos</Card.Header>
                            <Card.Body>
                                <p><strong>Nombre:</strong> Juan Pérez</p>
                                <p><strong>Altura:</strong> 1.75 m</p>
                                <p><strong>Peso:</strong> 70 kg</p>
                                <p><strong>Edad:</strong> 28 años</p>
                            </Card.Body>
                        </Card>

                        {/* Entrenador */}
                        <Card id="trainer">
                            <Card.Header>Mi Entrenador</Card.Header>
                            <Card.Body>
                                {trainer ? (
                                    <>
                                        <p><strong>Nombre:</strong> {trainer.firstName}</p>
                                        <p><strong>Email:</strong> {trainer.email}</p>
                                        <p><strong>Teléfono:</strong> {trainer.phone || "No disponible"}</p>
                                    </>
                                ) : (
                                    <p className="text-danger">{trainerError}</p>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default ClientDashboard;