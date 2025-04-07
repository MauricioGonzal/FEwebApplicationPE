import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import api from "../Api"; // Solo si necesitás llamar al backend para saber áreas del cliente

const RoleBasedRedirect = () => {
  const navigate = useNavigate();
  const [redirected, setRedirected] = useState(false); // Evitar redirecciones múltiples

  useEffect(() => {
    const redirectUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const role = decoded.role;

        if (role === 'ADMIN') {
          navigate('/admin-dashboard');
        } else if (role === 'RECEPTIONIST') {
          navigate('/employee-dashboard');
        } else if (role === 'TRAINER') {
          navigate('/trainer-dashboard');
        } else if (role === 'CLIENT_GYM') {
          navigate('/client-gym-dashboard');
        } else if (role === 'CLIENT_CLASSES') {
          navigate('/client-classes-dashboard');
        } else if (role === 'CLIENT_BOTH') {
          navigate('/client-both-dashboard');
        } else if (role === 'CLIENT') {
          // 🧠 Si es un cliente normal, consultamos las áreas y redirigimos según eso
          try {
            const response = await api.get("/area/" + decoded.id);
            const areaObjects = response.data || [];
            const areaNames = areaObjects.map(area => area.name);
        
            if (areaNames.includes("Musculacion") && areaNames.includes("Clases")) {
              navigate('/client-both-dashboard');
            } else if (areaNames.includes("Musculacion")) {
              navigate('/client-gym-dashboard');
            } else if (areaNames.includes("Clases")) {
              navigate('/client-classes-dashboard');
            } else {
              navigate('/login');
            }
          } catch (e) {
            console.error("Error al obtener áreas del cliente", e);
            navigate('/login');
          }
        } else {
          navigate('/login'); // Rol no reconocido
        }

        setRedirected(true);
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        navigate('/login');
      }
    };

    if (!redirected) {
      redirectUser();
    }
  }, [navigate, redirected]);

  return null;
};

export default RoleBasedRedirect;
