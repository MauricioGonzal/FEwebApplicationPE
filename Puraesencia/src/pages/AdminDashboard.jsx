import api from "../Api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "./Logout";
import { FaUser, FaCashRegister, FaBox } from "react-icons/fa";
import Select from "react-select";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';// Para los estilos de las notificaciones
import TransactionsTable from "../components/TransactionsTable";
import UsersTabs from "../components/UserTabs";

import { toast } from 'react-toastify';


const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [totalCaja, setTotalCaja] = useState(0);
    const [paymentTypes, setPaymentTypes] = useState([]);
    const [transactionCategories, setTransactionCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [memberships, setMemberships] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [comment, setComment] = useState("");
    const [amount, setAmount] = useState(0);
    const [showErrorModal, setShowErrorModal] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedPaymentType, setSelectedPaymentType] = useState(null);
    const [selectedMembership, setSelectedMembership] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedTransactionCategory, setSelectedTransactionCategory] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        api.get('/users/getAllByRole/clients')
            .then((response) =>{ 
                setUsers(response.data)}
            )
            .catch((error) => console.error("Error al obtener usuarios", error));

        api.get('/transactions/today')
            .then((response) => {
                console.log(response.data);
                setTransactions(response.data);
                calcularTotalCaja(response.data);
            })
            .catch((error) => console.error("Error al obtener transacciones", error));

        api.get('/payment-methods')
            .then((response) =>{ 
                setPaymentTypes(response.data);
            })
            .catch((error) => console.error("Error al obtener medios de pago", error));

        api.get('/products')
            .then((response) =>{ 
                setProducts(response.data);
            })
            .catch((error) => console.error("Error al obtener medios de pago", error));

        api.get('/transaction-categories')
            .then((response) =>{ 
                setTransactionCategories(response.data);
            })
            .catch((error) => console.error("Error al obtener categorias de transacciones", error));

            api.get('/membership')
            .then((response) =>{ 
                setMemberships(response.data);
            }
            )
            .catch((error) => console.error("Error al obtener categorias de transacciones", error));
    }, []);

    const handleAddTransaction = () => {
        const newTransaction = { 
            user: selectedUser?.value,
            transactionCategory: selectedTransactionCategory.value,
            paymentMethod: selectedPaymentType.value,
            amount: amount, 
            date: new Date().toISOString(),
            comment: comment,
            membership: selectedMembership.value
        };

        api.post('/transactions', newTransaction)
            .then((response) => {
                const updatedTransactions = [...transactions, response.data];
                setTransactions(updatedTransactions);
                calcularTotalCaja(updatedTransactions);
                setShowErrorModal(false);  // Cerrar modal en caso de éxito            
                setComment("");
                setAmount(0);
                toast.success("Transaccion creada correctamente", {
                    position: "top-right", // Ahora directamente como string
                  });
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

        api.post('/transactions/dailyClosing', cierre)
            .then(() => {
                alert(`Cierre de caja realizado con éxito. Total: $${totalCaja}`);
                setTransactions([]); // Opcional: limpiar transacciones después del cierre
                setTotalCaja(0);
            })
            .catch((error) => console.error("Error al cerrar caja", error));
    };

    const handleCierreMesCaja = () => {
        const cierre = { date: new Date().toISOString(), total: totalCaja };

        api.post('/transactions/dailyClosing', cierre)
            .then(() => {
                alert(`Cierre de caja realizado con éxito. Total: $${totalCaja}`);
                setTransactions([]); // Opcional: limpiar transacciones después del cierre
                setTotalCaja(0);
            })
            .catch((error) => console.error("Error al cerrar caja", error));
    };



    const userClassesOptions = users.filter(user => user.role === "CLIENT_CLASSES" || user.role === "CLIENT_BOTH").map(user => ({
        value: user, // Guarda el objeto entero en `value`
        label: `${user.fullName} (${user.email})`
    }));

    const userGymOptions = users.filter(user => user.role === "CLIENT_GYM" || user.role === "CLIENT_BOTH").map(user => ({
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

    const membershipGimOptions = memberships.filter(membership => membership.maxDays !== null).map(membership => ({
        value: membership,
        label: membership.name
    }));

    const membershipClassesOptions = memberships.filter(membership => membership.maxClasses !== null).map(membership => ({
        value: membership,
        label: membership.maxClasses
    }));

    return (
        <div className="bg-light min-vh-100">
            {/* Navbar */}
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
                        <ul className="dropdown-menu">
                            <li><button className="dropdown-item" onClick={() => navigate('/overdue-payments')}>Ver Cuotas Vencidas</button></li>
                            <li><button className="dropdown-item" onClick={() => navigate('/create-user')}>Crear Usuario</button></li>
                            <li><button className="dropdown-item" onClick={() => navigate("/price-list")}>Lista de precios</button></li>
                            <li><button className="dropdown-item" onClick={() => navigate("/user-table")}>Lista de usuarios</button></li>
                            <li><button className="dropdown-item" onClick={() => navigate("/salary")}>Sueldos</button></li>
                            <li><button className="dropdown-item" onClick={() => navigate("/user-table")}>Cierre Mensual</button></li>
                            <li><button className="dropdown-item" onClick={() => navigate("/daily-closures")}>Cierres</button></li>
                            <li><button className="dropdown-item" onClick={() => navigate("/changepass")}>Cambiar Contraseña</button></li>
                            <li><button className="dropdown-item" onClick={() => logout(navigate)}>Cerrar Sesion</button></li>
                        </ul>
                    </div>
                </div>
            </nav>

            <UsersTabs/>

            <div className="container mt-4">
    {/* Sección de Finanzas */}
    <h2 className="text-center fw-bold mt-5 mb-3 text-dark">Caja</h2>
    <div className="card shadow-sm p-4">
        <h5>Registrar Movimiento</h5>

        <div className="row">
            {/* Categoría de transacción */}
            <div className="col-md-4">
                <Select
                    options={transactionCategoryOptions}
                    value={selectedTransactionCategory}
                    onChange={(selectedOption) => setSelectedTransactionCategory(selectedOption)}
                    placeholder="Seleccionar categoría..."
                    isSearchable
                />
            </div>

            {/* Medio de pago */}
            <div className="col-md-4">
                <Select
                    options={paymentTypesOptions}
                    value={selectedPaymentType}
                    onChange={(selectedOption) => setSelectedPaymentType(selectedOption)}
                    placeholder="Seleccionar medio de pago..."
                    isSearchable
                />
            </div>
        </div>

        {/* Opciones adicionales según la categoría seleccionada */}
        {selectedTransactionCategory?.value?.name === "Egreso" && (
            <div className="row mt-3">
                <div className="col-md-6">
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Ingrese el monto..."
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>
                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Ingrese un comentario..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </div>
            </div>
        )}

        {selectedTransactionCategory?.value?.name === "Producto" && (
            <div className="row mt-3">
                <div className="col-md-6">
                    <Select
                        options={productOptions}
                        value={selectedProduct}
                        onChange={(selectedOption) => setSelectedProduct(selectedOption)}
                        placeholder="Seleccionar producto..."
                        isSearchable
                    />
                </div>
            </div>
        )}

        {(selectedTransactionCategory?.value?.name === "Musculacion") && (
            <div className="row mt-3">
                <div className="col-md-6">
                    <Select
                        options={membershipGimOptions}
                        value={selectedMembership}
                        onChange={(selectedOption) => setSelectedMembership(selectedOption)}
                        placeholder="Seleccionar días..."
                        isSearchable
                    />
                </div>
                <div className="col-md-6">
                    <Select
                        options={userGymOptions}
                        value={selectedUser}
                        onChange={(selectedOption) => setSelectedUser(selectedOption)}
                        placeholder="Seleccionar usuario..."
                        isSearchable
                    />
                </div>
            </div>
        )}

        {(selectedTransactionCategory?.value?.name === "Clases") && (
            <div className="row mt-3">
                <div className="col-md-6">
                    <Select
                        options={membershipClassesOptions}
                        value={selectedMembership}
                        onChange={(selectedOption) => setSelectedMembership(selectedOption)}
                        placeholder="Seleccionar cantidad de clases..."
                        isSearchable
                    />
                </div>
                <div className="col-md-6">
                    <Select
                        options={userClassesOptions}
                        value={selectedUser}
                        onChange={(selectedOption) => setSelectedUser(selectedOption)}
                        placeholder="Seleccionar usuario..."
                        isSearchable
                    />
                </div>
            </div>
        )}

        {/* Botón de agregar */}
        <div className="row mt-4">
            <div className="col text-center">
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
                <TransactionsTable 
                    transactions={transactions} 
                />
                {/* Cierre de caja */}
                <div className="card shadow-sm p-4">
                    <p className="fw-bold">Total del día: <span className="text-success">${totalCaja.toFixed(2)}</span></p>
                    <button className="btn btn-primary" onClick={handleCierreCaja} disabled={totalCaja === 0}>
                        <FaBox className="me-1" /> Realizar Cierre Diario
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
