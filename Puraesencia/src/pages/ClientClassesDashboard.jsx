import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import jwtDecode from 'jwt-decode';
import api from '../Api';
import { Client } from '@stomp/stompjs';  // Importar Client de STOMP
import SockJS from 'sockjs-client';  // Importar SockJS para manejar la conexión WebSocket
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const daysOfWeek = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"];

const ClientClassesDashboard = () => {
  const [schedule, setSchedule] = useState([]);
  const [leftAttendances, setLeftAttendances] = useState("");
  const [refresh, setRefresh] = useState(false);


  useEffect(() => {
    // Conectar al WebSocket y suscribirse al topic para las actualizaciones
    const token = localStorage.getItem('token');
    if (!token) return;

    const decoded = jwtDecode(token);
    const userId = decoded.id;

    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws', // Dirección de WebSocket
      connectHeaders: {},
      debug: function (str) {
        console.log(str);
      },
      onConnect: () => {
        // Suscribirse al topic para este usuario
        client.subscribe(`/topic/attendance/${userId}`, (message) => {
          setRefresh(prev => !prev); // Cambia refresh para disparar el useEffect
        });
      },
      onStompError: (frame) => {
        console.error(frame);
      },
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'), // Conexión WebSocket con SockJS
    });

    client.activate(); // Activar la conexión

    return () => {
      client.deactivate(); // Limpiar la conexión cuando el componente se desmonte
    };
  }, []);

  useEffect(() => {
    // Fetch de la grilla de clases
    const fetchSchedule = () => {
      api.get('/schedules/1/sessions')
        .then((response) => {
          const formattedSchedule = daysOfWeek.reduce((acc, day) => {
            acc[day] = response.data.filter(session => session.dayOfWeek === day);
            return acc;
          }, {});
          setSchedule(formattedSchedule);
        })
        .catch((error) => console.error("Error fetching schedule:", error));
    };

    fetchSchedule();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const decoded = jwtDecode(token);

    // Hacer el fetch inicial de las clases restantes
    api.get(`/attendance/${decoded.id}/leftattendances`)
      .then((response) => { 
        setLeftAttendances(response.data);
      })
      .catch((error) => console.error("Error fetching left attendances:", error));
  }, [refresh]);
  
  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Grilla semanal de clases</h2>
      <div className="alert alert-info text-center" role="alert">
        Te quedan <strong>{leftAttendances}</strong> clases por tomar.
      </div>
      <div className="row">
        {Object.entries(schedule).map(([day, classes]) => (
          <div key={day} className="col-md-4 mb-3">
            <div className="card">
              <div className="card-header bg-primary text-white text-center">
                {day}
              </div>
              <ul className="list-group list-group-flush">
                {schedule[day]?.map((session, index) => (
                  <li key={index} className="list-group-item">
                    <strong>{session.startTime} - {session.endTime}</strong>: {session?.classType.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientClassesDashboard;
