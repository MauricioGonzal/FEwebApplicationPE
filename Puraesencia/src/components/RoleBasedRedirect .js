import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const RoleBasedRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const decoded = jwtDecode(token);
            console.log('Decoded token:', decoded);
            const role = decoded.roles[0]; // Ajusta según tu estructura de roles

            // Redirige según el rol
            if (role === 'ADMIN') {
                navigate('/admin-dashboard');
            } else if (role === 'USER') {
                navigate('/user-dashboard');
            } else {
                navigate('/login'); // Redirige a login si el rol no es reconocido
            }
        } catch (error) {
            console.error("Error al decodificar el token:", error);
            navigate('/login');
        }
    }, [navigate]);

    return null; // Este componente solo redirige, no necesita renderizar nada
};

export default RoleBasedRedirect;