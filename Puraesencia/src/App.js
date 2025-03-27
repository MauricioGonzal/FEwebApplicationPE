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
import EmployeeDashboard from './pages/EmployeeDashboard';

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
import UserTable from "./components/UserTable";
import CreateSalary from "./pages/SalaryForm";
import DailyClosures from "./pages/DailyClosures";
import MonthlyCLosures from './pages/MonthlyClosures';

import RoleBasedLayout from './components/RoleBasedLayout';
import FixedExpensesPage from './pages/FixedExpensesPage';
import CreateMonthlyClosure from './pages/CreateMonthlyCashClosure';
import ClientClassesDashboard from './pages/ClientClassesDashboard'
import AdminScheduleGrid from './pages/AdminScheduleGrid'
import ClientBothDashboard from './pages/ClientBothDashboard';
import ProductPage from './pages/ProductsPage';
import ClassesTabs from './components/ClassesTabs';
import CashClosureTabs from './components/CashClosureTabs';
import AssistsClasses from './components/AssistsClasses';
import RoutineTabs from './components/RoutineTabs';
import MembershipsPage from './pages/MembershipsPage';
import PaymentTabs from './components/PaymentTabs';

function App() {
  return (
    <Router>
      {/* Contenedor de notificaciones en cualquier ruta */}
      <ToastContainer />
      <Routes>
        <Route element={<ProtectedLayout />}>
        <Route element={<RoleBasedLayout />}>
          <Route path="/admin-dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
          <Route path="/create-user" element={<PrivateRoute><CreateUserForm /></PrivateRoute>} />
          <Route path="/create-health-record/:userId" element={<PrivateRoute><HealthForm /></PrivateRoute>} />
          <Route path="/salary" element={<PrivateRoute><CreateSalary /></PrivateRoute>} />
          <Route path="/daily-closures" element={<PrivateRoute><DailyClosures /></PrivateRoute>} />
          <Route path="/user-table" element={<PrivateRoute><UserTable /></PrivateRoute>} />
          <Route path="/price-list" element={<PrivateRoute><PriceList /></PrivateRoute>} />
          <Route path="/overdue-payments" element={<PrivateRoute><OverduePayments /></PrivateRoute>} />
          <Route path="/user-classes-table" element={<PrivateRoute><UserClassAttendance /></PrivateRoute>} />
          <Route path="/user-gym-table" element={<PrivateRoute><UserGymAttendance /></PrivateRoute>} />
          <Route path="/employee-dashboard" element={<PrivateRoute><EmployeeDashboard /></PrivateRoute>} />
          <Route path="/create-user" element={<PrivateRoute><CreateUserForm /></PrivateRoute>} />
          <Route path="/create-health-record/:userId" element={<PrivateRoute><HealthForm /></PrivateRoute>} />
          <Route path="/user-table" element={<PrivateRoute><UserTable /></PrivateRoute>} />
          <Route path="/user-classes-table" element={<PrivateRoute><UserClassAttendance /></PrivateRoute>} />
          <Route path="/user-gym-table" element={<PrivateRoute><UserGymAttendance /></PrivateRoute>} />
          <Route path="/trainer-dashboard" element={<PrivateRoute><TrainerDashboard /></PrivateRoute>} />
          <Route path="/edit-routine/:routineId/:userId" element={<PrivateRoute><EditRoutine /></PrivateRoute>} />
          <Route path="/assign-routine/:id" element={<PrivateRoute><StudentRow /></PrivateRoute>} />
          <Route path="/create-routine/:isCustom/:userId" element={<PrivateRoute><RoutineForm /></PrivateRoute>} />
          <Route path="/create-exercise" element={<PrivateRoute><CreateExercise /></PrivateRoute>} />
          <Route path="/create-routine/:isCustom" element={<PrivateRoute><RoutineForm /></PrivateRoute>} />
          <Route path="/routines" element={<Routines />} />
          <Route path="/create-routine" element={<CreateRoutine />} />
          <Route path="/changepass" element={<PrivateRoute><ChangePasswordForm /></PrivateRoute>} />
          <Route path="/client-gym-dashboard" element={<PrivateRoute><ClientGymDashboard /></PrivateRoute>} />
          <Route path="/client-classes-dashboard" element={<PrivateRoute><ClientClassesDashboard /></PrivateRoute>} />
          <Route path="/workout-sessions" element={<PrivateRoute><WorkoutHistory /></PrivateRoute>} />
          <Route path="/fixed-expenses" element={<PrivateRoute><FixedExpensesPage /></PrivateRoute>} />
          <Route path="/monthly-closures" element={<PrivateRoute><MonthlyCLosures /></PrivateRoute>} />
          <Route path="/create-monthly-closure" element={<PrivateRoute><CreateMonthlyClosure /></PrivateRoute>} />
          <Route path="/classes-schedule" element={<PrivateRoute><AdminScheduleGrid /></PrivateRoute>} />
          <Route path="/client-both-dashboard" element={<PrivateRoute><ClientBothDashboard /></PrivateRoute>} />
          <Route path="/products" element={<PrivateRoute><ProductPage /></PrivateRoute>} />
          <Route path="/classes" element={<PrivateRoute><ClassesTabs /></PrivateRoute>} />
          <Route path="/monthly-cash-closures" element={<PrivateRoute><CashClosureTabs /></PrivateRoute>} />
          <Route path="/assists" element={<PrivateRoute><AssistsClasses /></PrivateRoute>} />
          <Route path="/routine-tabs" element={<PrivateRoute><RoutineTabs /></PrivateRoute>} />
          <Route path="/memberships" element={<PrivateRoute><MembershipsPage /></PrivateRoute>} />
          <Route path="/payments" element={<PrivateRoute><PaymentTabs /></PrivateRoute>} />

          </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RoleBasedRedirect />} /> {/* Redirige según el rol */}


        </Route>
      </Routes>
    </Router>
  );
}

export default App;