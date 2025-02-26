import { useNavigate } from "react-router-dom";
import { logout } from "../pages/Logout";
import { FaUser} from "react-icons/fa";


const AdminNav = () => {
    const navigate = useNavigate();

  return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
            <div className="container d-flex justify-content-between">
                <a className="navbar-brand fw-bold" style={{ fontFamily: 'Roboto' }} href="/">
                        <img src="./puraesencia.png" alt="Logo" width="40" height="40" className="me-2" />
                        Admin Panel
                    </a>                    
                    <div className="dropdown">
                        <button className="btn btn-light dropdown-toggle" data-bs-toggle="dropdown">
                            <FaUser />
                        </button>
                        <ul className="dropdown-menu">
                            <li><button className="dropdown-item" onClick={() => navigate('/overdue-payments')}>Ver Cuotas Vencidas</button></li>
                            <li><button className="dropdown-item" onClick={() => navigate('/create-user')}>Crear Usuario</button></li>
                            <li><button className="dropdown-item" onClick={() => navigate("/price-list")}>Lista de precios</button></li>
                            <li><button className="dropdown-item" onClick={() => navigate("/user-table")}>Lista de usuarios</button></li>
                            <li><button className="dropdown-item" onClick={() => navigate("/salary")}>Sueldos</button></li>
                            <li><button className="dropdown-item" onClick={() => navigate("/user-table")}>Cierre Mensual</button></li>
                            <li><button className="dropdown-item" onClick={() => navigate("/daily-closures")}>Cierres</button></li>
                            <li><button className="dropdown-item" onClick={() => navigate("/changepass")}>Cambiar Contraseña</button></li>
                            <li><button className="dropdown-item" onClick={() => logout(navigate)}>Cerrar Sesion</button></li>
                        </ul>
                    </div>
                </div>
            </nav>
  );
};

export default AdminNav;