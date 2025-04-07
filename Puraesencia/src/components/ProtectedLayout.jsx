import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

const ProtectedLayout = () => {
    const navigate = useNavigate();

    React.useEffect(() => {
        const checkToken = () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login"); // Si no hay token, redirigir al login
                return;
            }

            try {
                const decoded = jwtDecode(token);
                const now = Date.now() / 1000;

                if (decoded.exp < now) {
                    localStorage.removeItem("token");
                    navigate("/login");
                }
            } catch (err) {
                console.error("Error con el token:", err);
                localStorage.removeItem("token");
                navigate("/login");
            }
        };

        checkToken();
    }, [navigate]);

    return <Outlet />; // Renderiza el contenido de la ruta protegida
};

export default ProtectedLayout;
