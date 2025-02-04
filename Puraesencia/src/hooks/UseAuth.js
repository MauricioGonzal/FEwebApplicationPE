import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

const useAuth = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkToken = () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login"); // Si no hay token, redirigir al login
                return;
            }

            try {
                const decoded = jwtDecode(token);
                const now = Date.now() / 1000; // Tiempo actual en segundos

                if (decoded.exp < now) {
                    localStorage.removeItem("token"); // Eliminar token vencido
                    navigate("/login"); // Redirigir al login
                }
            } catch (err) {
                console.error("Error decodificando el token:", err);
                localStorage.removeItem("token");
                navigate("/login");
            }
        };

        checkToken();
    }, [navigate]);
};

export default useAuth;
