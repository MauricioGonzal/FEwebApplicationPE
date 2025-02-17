import api from "../Api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "./Logout";
import { FaCheck, FaUser, FaTrash, FaCashRegister, FaBox } from "react-icons/fa";
import Select from "react-select";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [totalCaja, setTotalCaja] = useState(0);
    const [paymentTypes, setPaymentTypes] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedPaymentType, setSelectedPaymentType] = useState(null);
    const [transactionCategories, setTransactionCategories] = useState([]);
    const navigate = useNavigate();
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedTransactionCategory, setSelectedTransactionCategory] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    const [showErrorModal, setShowErrorModal] = useState(false); // Estado para mostrar el modal

    useEffect(() => {
        api.get('/users/getAllByRole/client')
            .then((response) =>{ 
                console.log(response.data);
                setUsers(response.data)}
            )
            .catch((error) => console.error("Error al obtener usuarios", error));

        api.get('/transactions')
            .then((response) => {
                console.log(response.data);
                setTransactions(response.data);
                calcularTotalCaja(response.data);
            })
            .catch((error) => console.error("Error al obtener transacciones", error));
    }, []);

    useEffect(() => {
        api.get('/payment-methods')
            .then((response) =>{ 
                setPaymentTypes(response.data);
                console.log(response.data);
            }
            )
            .catch((error) => console.error("Error al obtener medios de pago", error));
    }, []);

    useEffect(() => {
        api.get('/products')
            .then((response) =>{ 
                setProducts(response.data);
                console.log(response.data);
            }
            )
            .catch((error) => console.error("Error al obtener medios de pago", error));
    }, []);

    useEffect(() => {
        api.get('/transaction-categories')
            .then((response) =>{ 
                setTransactionCategories(response.data);
                console.log(response.data);
            }
            )
            .catch((error) => console.error("Error al obtener categorias de transacciones", error));
    }, []);

    const handleAddTransaction = () => {

        const newTransaction = { 
            user: selectedUser.value,
            transactionCategory: selectedTransactionCategory.value,
            paymentMethod: selectedPaymentType.value,
            amount: 0, 
            date: new Date().toISOString() 
        };

        console.log(newTransaction);

        api.post('/transactions', newTransaction)
            .then((response) => {
                console.log(response);
                const updatedTransactions = [...transactions, response.data];
                setTransactions(updatedTransactions);
                calcularTotalCaja(updatedTransactions);
                setShowErrorModal(false);  // Cerrar modal en caso de éxito            
            })
            .catch((error) => {
                if (error.response && error.response.data) {
                    setErrorMessage(error.response.data.error || "Error desconocido");
                  } else {
                    setErrorMessage("Error al realizar la solicitud");
                  }
                  setShowErrorModal(true);  // Mostrar modal con el error
        });
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

    const handleDeleteUser = (userId) => {
        const confirmDelete = window.confirm("¿Seguro que quiere eliminar este usuario?");
        if (confirmDelete) {
            api.delete(`/users/${userId}`)
                .then(() => {
                    setUsers(users.filter(user => user.id !== userId));
                    alert("Usuario eliminado con éxito");
                })
                .catch((error) => console.error("Error al eliminar usuario", error));
        }
    };
    
    const handleMarkAttendance = (userId) => {
        const attendance = { userId: userId};
        
        api.post('/attendance', attendance)
            .then(() => {
                alert("Asistencia registrada con éxito");
            })
            .catch((error) => console.error("Error al registrar asistencia", error));
    };

    const userOptions = users.map(user => ({
        value: user, // Guarda el objeto entero en `value`
        label: `${user.fullName} (${user.email})`
    }));
    
    const productOptions = products.map(product => ({
        value: product, 
        label: product.name
    }));
    
    const transactionCategoryOptions = transactionCategories.map(category => ({
        value: category,
        label: category.name
    }));
    
    const paymentTypesOptions = paymentTypes.map(paymentType => ({
        value: paymentType,
        label: paymentType.name
    }));

    return (
        <div className="bg-light min-vh-100">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
            <div className="container d-flex justify-content-between">
                <a className="navbar-brand fw-bold" href="/">
                        <img src="./puraesencia.png" alt="Logo" width="40" height="40" className="me-2" />
                        Admin Panel
                    </a>                    
                    <div className="dropdown">
                        <button className="btn btn-light dropdown-toggle" data-bs-toggle="dropdown">
                            <FaUser />
                        </button>
                        <ul className="dropdown-menu">
                            <li><button className="dropdown-item" onClick={() => navigate('/create-user')}>Crear Usuario</button></li>
                            <li><button className="dropdown-item" onClick={() => navigate("/price-list")}>Lista de precios</button></li>
                            <li><button className="dropdown-item" onClick={() => navigate("/changepass")}>Cambiar Contraseña</button></li>
                            <li><button className="dropdown-item" onClick={() => logout(navigate)}>Cerrar Sesion</button></li>
                        </ul>
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
                                        {user.healthRecord === null &&
                                            <button className="btn btn-success btn-sm" onClick={() => navigate('/create-health-record/' + user.id)}>
                                                <FaTrash className="me-1" /> Cargar Ficha de salud
                                            </button>
                                        }
                                        <button className="btn btn-primary btn-sm me-2" onClick={() => handleMarkAttendance(user.id)}>
                                            <FaCheck className="me-1" /> Marcar Presente
                                        </button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(user.id)}>
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
                            <Select
                                options={transactionCategoryOptions}
                                value={selectedTransactionCategory}
                                onChange={(selectedOption) => setSelectedTransactionCategory(selectedOption)}
                                placeholder="Seleccionar categoria..."
                                isSearchable
                            />
                        </div>
                        <div className="col-md-4">
                            <Select
                                options={paymentTypesOptions}
                                value={selectedPaymentType}
                                onChange={(selectedOption) => setSelectedPaymentType(selectedOption)}
                                placeholder="Seleccionar medio de pago..."
                                isSearchable
                            />
                        </div>
                        {selectedTransactionCategory !== "Producto" ? (
                            <div className="col-md-4">
                                <Select
                                    options={userOptions}
                                    value={selectedUser}
                                    onChange={(selectedOption) => setSelectedUser(selectedOption)}
                                    placeholder="Seleccionar usuario..."
                                    isSearchable
                                />
                            </div>
                        ):
                        (  <div className="col-md-4">
                                <Select
                                    options={productOptions}
                                    value={selectedProduct}
                                    onChange={(selectedOption) => setSelectedProduct(selectedOption)}
                                    placeholder="Seleccionar producto..."
                                    isSearchable
                                />
                            </div>)}
                        <div className="col-md-4 mt-2">
                            <button className="btn btn-success" onClick={handleAddTransaction}>
                                <FaCashRegister className="me-1" /> Agregar
                            </button>
                        </div>
                    </div>
                </div>

                {/* Modal emergente para mostrar el error */}
                <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
                    <Modal.Header closeButton>
                    <Modal.Title>Error</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{errorMessage}</Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
                        Cerrar
                    </Button>
                    </Modal.Footer>
                </Modal>

                {/* Historial de ingresos */}
                <h5 className="mt-4">Historial de Ingresos</h5>
                <div className="table-responsive">
                    <table className="table table-hover table-bordered shadow-sm">
                        <thead className="table-dark text-center">
                            <tr>
                                <th>Monto</th>
                                <th>Medio de pago</th>
                                <th>Categoria</th>
                                <th>Fecha</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {transactions.map((transaction, index) => (
                                <tr key={index}>
                                    <td>${transaction.amount}</td>
                                    <td>{transaction.paymentMethod.name}</td>
                                    <td>{transaction.transactionCategory.name}</td>
                                    <td>{new Date(transaction.date).toLocaleString()}</td>
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
