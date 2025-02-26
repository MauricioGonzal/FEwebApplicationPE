import { Outlet } from "react-router-dom";
import AdminNav from "./AdminNav";
import ReceptionistNav from "./ReceptionistNav";
import TrainerNav from "./TrainerNav";
import ClientGymNav from "./ClientGymNav";
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
//import ClientNav from "./navs/ClientNav";

const RoleBasedLayout = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    if (!token) {
        navigate('/login');
        return;
    }

    const decoded = jwtDecode(token);
    console.log('Decoded token:', decoded);
    const role = decoded.role;

  const getNavbar = () => {
    switch (role) {
      case "ADMIN":
        return <AdminNav />;
      case "RECEPTIONIST":
        return <ReceptionistNav />;
      case "TRAINER":
        return <TrainerNav />;
      case "CLIENT_GYM":
        return <ClientGymNav />;
      default:
        return null; // O un navbar genérico si lo necesitas
    }
  };

  return (
    <div>
      {getNavbar()}
      <Outlet />
    </div>
  );
};

export default RoleBasedLayout;