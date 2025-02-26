

import { useNavigate } from "react-router-dom";
import { logout } from "../pages/Logout";
import { FaUser} from "react-icons/fa";


const ClientGymNav = () => {
    const navigate = useNavigate();

  return (
<nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
<div className="container d-flex justify-content-between">
    <a className="navbar-brand fw-bold" href="/">
        <img src="./puraesencia.png" alt="Logo" width="40" height="40" className="me-2" />
    </a>
    <div className="dropdown">
        <button className="btn btn-light dropdown-toggle" data-bs-toggle="dropdown">
            <FaUser />
        </button>
        <ul className="dropdown-menu">
            <button className="btn btn-secondary" onClick={() => navigate('/perfil')}>Perfil</button>
            <button className="dropdown-item" onClick={() => navigate("/changepass")}>Cambiar Contraseña</button>
            <button className="dropdown-item" onClick={() => navigate("/workout-sessions")}>Mi progreso</button>
            <button className="btn btn-danger ms-auto" onClick={() => logout(navigate)}>Cerrar Sesión</button>
        </ul>
    </div>
</div>
</nav>
  );
};

export default ClientGymNav;