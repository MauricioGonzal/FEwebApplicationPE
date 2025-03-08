import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import jwtDecode from 'jwt-decode';
import api from '../Api';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const daysOfWeek = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"];

const ClientClassesDashboard = () => {
  const [schedule, setSchedule] = useState([]);
  const [leftAttendances, setLeftAttendances] = useState("");

  useEffect(() => {
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
  }, []); // ✅ No más advertencias



  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
  
    const decoded = jwtDecode(token);

    api.get('/attendance/' + decoded.id + '/leftattendances')
    .then((response) =>{ 
      setLeftAttendances(response.data);
    })
    .catch((error) => console.error("Error fetching left attendances:", error));
  }, []);
  
    
    return (
        <div className="container mt-4">
          <h2 className="text-center mb-4">Grilla semanal de clases</h2>
          <div className="alert alert-info text-center" role="alert">
            You have <strong>{leftAttendances}</strong> classes remaining to take.
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
