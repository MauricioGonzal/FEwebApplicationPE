import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Asegúrate de importar los estilos
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Routines from './pages/Routines';
import CreateRoutine from './pages/CreateRoutine';
import Login from './pages/Login';
import ClientGymDashboard from './pages/ClientGymDashboard';
import AdminDashboard from './pages/AdminDashboard';
import TrainerDashboard from './pages/TrainerDashboard';
import PrivateRoute from './components/PrivateRoute';
import RoleBasedRedirect from './components/RoleBasedRedirect ';
import ProtectedLayout from "./components/ProtectedLayout";
import EditRoutine from './pages/EditRoutine';
import StudentRow from './pages/AssignNoCustomRoutine';
import RoutineForm from './pages/CreateRoutine';
import CreateExercise from './pages/CreateExercise';
import CreateUserForm from './pages/CreateUserForm';
import ChangePasswordForm from './pages/ChangePasswordForm';
import WorkoutHistory from './pages/WorkoutHistory';
import HealthForm from './pages/HealthForm';
import PriceList from './pages/PriceList';
import OverduePayments from './pages/OverduePayments';
import UserClassAttendance from './pages/UserClassesTable';
import UserGymAttendance from './pages/UserGymTable';


function App() {
  return (
    <Router>
      {/* Contenedor de notificaciones en cualquier ruta */}
      <ToastContainer />
      <Routes>
        <Route element={<ProtectedLayout />}>
        <Route path="/routines" element={<Routines />} />
        <Route path="/create-routine" element={<CreateRoutine />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RoleBasedRedirect />} /> {/* Redirige según el rol */}
        <Route path="/admin-dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        <Route path="/client-gym-dashboard" element={<PrivateRoute><ClientGymDashboard /></PrivateRoute>} />
        <Route path="/trainer-dashboard" element={<PrivateRoute><TrainerDashboard /></PrivateRoute>} />
        <Route path="/edit-routine/:routineId/:userId" element={<PrivateRoute><EditRoutine /></PrivateRoute>} />
        <Route path="/assign-routine/:id" element={<PrivateRoute><StudentRow /></PrivateRoute>} />
        <Route path="/create-routine/:isCustom" element={<PrivateRoute><RoutineForm /></PrivateRoute>} />
        <Route path="/create-routine/:isCustom/:userId" element={<PrivateRoute><RoutineForm /></PrivateRoute>} />
        <Route path="/create-exercise" element={<PrivateRoute><CreateExercise /></PrivateRoute>} />
        <Route path="/create-user" element={<PrivateRoute><CreateUserForm /></PrivateRoute>} />
        <Route path="/changepass" element={<PrivateRoute><ChangePasswordForm /></PrivateRoute>} />
        <Route path="/create-health-record/:userId" element={<PrivateRoute><HealthForm /></PrivateRoute>} />
        <Route path="/workout-sessions" element={<PrivateRoute><WorkoutHistory /></PrivateRoute>} />
        <Route path="/price-list" element={<PrivateRoute><PriceList /></PrivateRoute>} />
        <Route path="/overdue-payments" element={<PrivateRoute><OverduePayments /></PrivateRoute>} />
        <Route path="/user-classes-table" element={<PrivateRoute><UserClassAttendance /></PrivateRoute>} />
        <Route path="/user-gym-table" element={<PrivateRoute><UserGymAttendance /></PrivateRoute>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;