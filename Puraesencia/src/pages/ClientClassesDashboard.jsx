import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import jwtDecode from 'jwt-decode';
import api from '../Api';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const schedule = {
    Monday: [
      { time: "08:00 - 09:00", className: "Yoga" },
      { time: "10:00 - 11:00", className: "CrossFit" },
    ],
    Tuesday: [
      { time: "09:00 - 10:00", className: "Pilates" },
      { time: "18:00 - 19:00", className: "Boxing" },
    ],
    Wednesday: [
      { time: "07:00 - 08:00", className: "HIIT" },
      { time: "17:00 - 18:00", className: "Spinning" },
    ],
    // Agregar más días y clases según sea necesario
  };

  const remainingClasses = 5; // Simulación de clases restantes del usuario

const ClientClassesDashboard = () => {
    
    return (
        <div className="container mt-4">
          <h2 className="text-center mb-4">Weekly Class Schedule</h2>
          <div className="alert alert-info text-center" role="alert">
            You have <strong>{remainingClasses}</strong> classes remaining to take.
          </div>
          <div className="row">
            {Object.entries(schedule).map(([day, classes]) => (
              <div key={day} className="col-md-4 mb-3">
                <div className="card">
                  <div className="card-header bg-primary text-white text-center">
                    {day}
                  </div>
                  <ul className="list-group list-group-flush">
                    {classes.map((cls, index) => (
                      <li key={index} className="list-group-item">
                        <strong>{cls.time}</strong>: {cls.className}
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
