import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Routines from './pages/Routines';
import CreateRoutine from './pages/CreateRoutine';
import Login from './pages/Login';
import ClientDashboard from './pages/ClientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import TrainerDashboard from './pages/TrainerDashboard';
import PrivateRoute from './components/PrivateRoute';
import RoleBasedRedirect from './components/RoleBasedRedirect ';
import ProtectedLayout from "./components/ProtectedLayout";
import EditRoutine from './pages/EditRoutine';
import StudentRow from './pages/AssignNoCustomRoutine';
import RoutineForm from './pages/CreateRoutine';
import CreateExercise from './pages/CreateExercise';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<ProtectedLayout />}>
        <Route path="/routines" element={<Routines />} />
        <Route path="/create-routine" element={<CreateRoutine />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RoleBasedRedirect />} /> {/* Redirige según el rol */}
        <Route path="/admin-dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        <Route path="/client-dashboard" element={<PrivateRoute><ClientDashboard /></PrivateRoute>} />
        <Route path="/trainer-dashboard" element={<PrivateRoute><TrainerDashboard /></PrivateRoute>} />
        <Route path="/edit-routine/:userId" element={<PrivateRoute><EditRoutine /></PrivateRoute>} />
        <Route path="/assign-routine/:id" element={<PrivateRoute><StudentRow /></PrivateRoute>} />
        <Route path="/create-routine/:isCustom" element={<PrivateRoute><RoutineForm /></PrivateRoute>} />
        <Route path="/create-routine/:isCustom/:userId" element={<PrivateRoute><RoutineForm /></PrivateRoute>} />
        <Route path="/create-exercise" element={<PrivateRoute><CreateExercise /></PrivateRoute>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;