export const logout = (navigate) => {
    localStorage.removeItem("token"); // Borra el token
    navigate("/login"); // Redirige al login
};