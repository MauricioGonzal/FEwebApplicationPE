import jwtDecode from 'jwt-decode';

export const getUserRole = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded.roles[0]; // Obtén el primer rol
    } catch (error) {
        console.error("Error decodificando el token:", error);
        return null;
    }
};