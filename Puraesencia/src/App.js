import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Routines from './pages/Routines';
import CreateRoutine from './pages/CreateRoutine';
import Login from './pages/Login';
import ClientDashboard from './pages/ClientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import RoleBasedRedirect from './components/RoleBasedRedirect ';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/routines" element={<Routines />} />
        <Route path="/create-routine" element={<CreateRoutine />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RoleBasedRedirect />} /> {/* Redirige según el rol */}
        <Route path="/admin-dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        <Route path="/client-dashboard" element={<PrivateRoute><ClientDashboard /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;