


import { useNavigate } from "react-router-dom";
import { logout } from "../pages/Logout";
import { FaUser, FaSignOutAlt} from "react-icons/fa";


const TrainerNav = () => {
    const navigate = useNavigate();

    return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
        <div className="container d-flex justify-content-between">
            <a className="navbar-brand fw-bold" href="/">
                <img src="./puraesencia.png" alt="Logo" width="40" height="40" className="me-2" />
                Trainer Panel
            </a>                    
            <div className="dropdown">
                <button className="btn btn-light dropdown-toggle" data-bs-toggle="dropdown">
                    <FaUser />
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                    <li><button className="dropdown-item" onClick={() => navigate("/routine-tabs")}>Rutinas</button></li>
                    <li><button className="dropdown-item" onClick={() => navigate("/create-exercise")}>Crear Ejercicio</button></li>
                    <li><button className="dropdown-item" onClick={() => navigate("/changepass")}>Cambiar Contraseña</button></li>
                    <li><button className="dropdown-item text-danger" onClick={() => logout(navigate)}><FaSignOutAlt /> Cerrar Sesión</button></li>
                </ul>
            </div>
        </div>
    </nav>
    );
};

export default TrainerNav;