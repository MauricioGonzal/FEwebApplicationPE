import { useNavigate } from "react-router-dom";
import { logout } from "../pages/Logout";
import { FaUser } from "react-icons/fa";

const ClientClassesNav = () => {
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
                    <ul className="dropdown-menu dropdown-menu-end">
                        <li>
                            <button className="dropdown-item w-100" onClick={() => navigate('/perfil')}>Perfil</button>
                        </li>
                        <li>
                            <button className="dropdown-item w-100" onClick={() => navigate("/changepass")}>Cambiar Contraseña</button>
                        </li>
                        <li>
                            <button className="dropdown-item w-100 text-danger" onClick={() => logout(navigate)}>Cerrar Sesión</button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default ClientClassesNav;
