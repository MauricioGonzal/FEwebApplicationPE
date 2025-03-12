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
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li><button className="dropdown-item" onClick={() => navigate('/overdue-payments')}>Cuotas Vencidas</button></li>
                            <li><button className="dropdown-item" onClick={() => navigate('/create-user')}>Crear Usuario</button></li>
                            <li><button className="dropdown-item" onClick={() => navigate('/products')}>Productos</button></li>
                            <li><button className="dropdown-item" onClick={() => navigate("/price-list")}>Precios</button></li>
                            <li><button className="dropdown-item" onClick={() => navigate("/user-table")}>Usuarios</button></li>
                            <li><button className="dropdown-item" onClick={() => navigate("/salary")}>Sueldos</button></li>
                            <li><button className="dropdown-item" onClick={() => navigate("/monthly-closures")}>Cierres Mensuales</button></li>
                            <li><button className="dropdown-item" onClick={() => navigate("/daily-closures")}>Cierres Diarios</button></li>
                            <li><button className="dropdown-item" onClick={() => navigate("/fixed-expenses")}>Gastos</button></li>
                            <li><button className="dropdown-item" onClick={() => navigate("/stock-management")}>Inventario</button></li>
                            <li><button className="dropdown-item" onClick={() => navigate("/classes-schedule")}>Grilla de clases</button></li>
                            <li><button className="dropdown-item" onClick={() => navigate("/changepass")}>Cambiar Contraseña</button></li>
                            <li><button className="dropdown-item" onClick={() => logout(navigate)}>Cerrar Sesion</button></li>
                        </ul>
                    </div>
                </div>
            </nav>
  );
};

export default AdminNav;