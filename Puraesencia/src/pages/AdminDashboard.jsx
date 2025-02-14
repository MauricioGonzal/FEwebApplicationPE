import api from "../Api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "./Logout";
import { FaUserPlus, FaSignOutAlt, FaTrash, FaCashRegister, FaBox } from "react-icons/fa";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('Membresía');
    const [totalCaja, setTotalCaja] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/users/getAllByRole/client')
            .then((response) => setUsers(response.data))
            .catch((error) => console.error("Error al obtener usuarios", error));

        api.get('/transactions')
            .then((response) => {
                setTransactions(response.data);
                calcularTotalCaja(response.data);
            })
            .catch((error) => console.error("Error al obtener transacciones", error));
    }, []);

    const handleAddTransaction = () => {
        const newTransaction = { amount, type, date: new Date().toISOString() };

        api.post('/transactions', newTransaction)
            .then((response) => {
                const updatedTransactions = [...transactions, response.data];
                setTransactions(updatedTransactions);
                setAmount('');
                calcularTotalCaja(updatedTransactions);
            })
            .catch((error) => console.error("Error al agregar transacción", error));
    };

    const calcularTotalCaja = (transactions) => {
        const today = new Date().toISOString().split('T')[0]; // Obtiene la fecha de hoy (YYYY-MM-DD)
        const total = transactions
            .filter(t => t.date.startsWith(today))
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        setTotalCaja(total);
    };

    const handleCierreCaja = () => {
        const cierre = { date: new Date().toISOString(), total: totalCaja };

        api.post('/transactions/close', cierre)
            .then(() => {
                alert(`Cierre de caja realizado con éxito. Total: $${totalCaja}`);
                setTransactions([]); // Opcional: limpiar transacciones después del cierre
                setTotalCaja(0);
            })
            .catch((error) => console.error("Error al cerrar caja", error));
    };

    return (
        <div className="bg-light min-vh-100">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
                <div className="container">
                    <a className="navbar-brand fw-bold" href="/">
                        <img src="./puraesencia.png" alt="Logo" width="40" height="40" className="me-2" />
                        Admin Panel
                    </a>
                    <div className="ms-auto">
                        <button className="btn btn-outline-light me-2" onClick={() => navigate('/create-user')}>
                            <FaUserPlus className="me-1" /> Crear Usuario
                        </button>
                        <button className="btn btn-danger" onClick={() => logout(navigate)}>
                            <FaSignOutAlt className="me-1" /> Cerrar Sesión
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container mt-4">
                <h2 className="text-center fw-bold mb-4 text-dark">Usuarios Registrados</h2>
                <div className="table-responsive">
                    <table className="table table-hover table-bordered shadow-sm">
                        <thead className="table-dark text-center">
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.fullName}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <button className="btn btn-danger btn-sm">
                                            <FaTrash className="me-1" /> Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Sección de Finanzas */}
                <h2 className="text-center fw-bold mt-5 mb-3 text-dark">Caja</h2>
                <div className="card shadow-sm p-4">
                    <h5>Registrar Ingreso</h5>
                    <div className="row">
                        <div className="col-md-4">
                            <input type="number" className="form-control" placeholder="Monto" value={amount} onChange={(e) => setAmount(e.target.value)} />
                        </div>
                        <div className="col-md-4">
                            <select className="form-control" value={type} onChange={(e) => setType(e.target.value)}>
                                <option value="Membresía">Membresía</option>
                                <option value="Venta de producto">Venta de producto</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <button className="btn btn-success" onClick={handleAddTransaction}>
                                <FaCashRegister className="me-1" /> Agregar
                            </button>
                        </div>
                    </div>
                </div>

                {/* Historial de ingresos */}
                <h5 className="mt-4">Historial de Ingresos</h5>
                <div className="table-responsive">
                    <table className="table table-hover table-bordered shadow-sm">
                        <thead className="table-dark text-center">
                            <tr>
                                <th>Fecha</th>
                                <th>Monto</th>
                                <th>Tipo</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {transactions.map((transaction, index) => (
                                <tr key={index}>
                                    <td>{new Date(transaction.date).toLocaleString()}</td>
                                    <td>${transaction.amount}</td>
                                    <td>{transaction.type}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Cierre de caja */}
                <h5 className="mt-4">Cierre de Caja</h5>
                <div className="card shadow-sm p-4">
                    <p className="fw-bold">Total del día: <span className="text-success">${totalCaja.toFixed(2)}</span></p>
                    <button className="btn btn-primary" onClick={handleCierreCaja} disabled={totalCaja === 0}>
                        <FaBox className="me-1" /> Realizar Cierre
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
