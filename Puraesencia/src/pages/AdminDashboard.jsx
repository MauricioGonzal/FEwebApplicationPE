import api from "../Api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "./Logout";
import { FaUser, FaCashRegister, FaBox } from "react-icons/fa";
import Select from "react-select";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import UserTable from '../components/UserTable';


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
    const [selectedUserForDueDate, setSelectedUserForDueDate] = useState(null);
    const [selectedTransactionCategory, setSelectedTransactionCategory] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    const [comment, setComment] = useState("");
    const [amount, setAmount] = useState(0);
    const [showErrorModal, setShowErrorModal] = useState(false); // Estado para mostrar el modal

    const [showModal, setShowModal] = useState(false);
    const [dueDate, setDueDate] = useState(new Date().toISOString().split("T")[0]); // Fecha de hoy

    useEffect(() => {
        api.get('/users/getAllByRole/client')
            .then((response) =>{ 
                setUsers(response.data)}
            )
            .catch((error) => console.error("Error al obtener usuarios", error));

        api.get('/transactions')
            .then((response) => {
                setTransactions(response.data);
                calcularTotalCaja(response.data);
            })
            .catch((error) => console.error("Error al obtener transacciones", error));
    }, []);

    useEffect(() => {
        api.get('/payment-methods')
            .then((response) =>{ 
                setPaymentTypes(response.data);
            }
            )
            .catch((error) => console.error("Error al obtener medios de pago", error));
    }, []);

    useEffect(() => {
        api.get('/products')
            .then((response) =>{ 
                setProducts(response.data);
            }
            )
            .catch((error) => console.error("Error al obtener medios de pago", error));
    }, []);

    useEffect(() => {
        api.get('/transaction-categories')
            .then((response) =>{ 
                setTransactionCategories(response.data);
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
            comment: comment
        };

        console.log(newTransaction);

        api.post('/transactions', newTransaction)
            .then((response) => {
                console.log(response);
                const updatedTransactions = [...transactions, response.data];
                setTransactions(updatedTransactions);
                calcularTotalCaja(updatedTransactions);
                setShowErrorModal(false);  // Cerrar modal en caso de éxito            
                setComment("");
                setAmount(0);
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
        const attendance = { userId: userId };
    
        // 1️⃣ Verificar si la cuota está vencida antes de registrar la asistencia
        api.get("/payments/isOutDueDate/" + userId)
            .then((response) => {
                console.log("isOutDueDate:", response.data); // Verificar qué valor retorna
    
                if (response.data) { // Asegura que funcione con true, "true" o cualquier truthy
                    console.log('hola');
                    setSelectedUserForDueDate(userId); // Guardar el usuario para actualizar la cuota
                    setDueDate(new Date().toISOString().split("T")[0]); // Fecha de hoy
                    setShowModal(true); // Mostrar el modal
    
                    // 🔹 Retrasar el registro de asistencia hasta que el modal se cierre
                    //return Promise.reject("Modal abierto, asistencia detenida");
                }
                console.log("por ir"); // Verificar qué valor retorna

                api.post("/attendance", attendance)
                .then(() => {
                    alert("Asistencia registrada con éxito");
                })
                .catch((error) => {
                    console.error("Error al registrar la asistencia:", error);
                });
               
            })
            .catch((error) => {
                if (error !== "Modal abierto, asistencia detenida") {
                    console.error("Error en el proceso de asistencia", error);
                }
            })
            .finally(() => {

            });
    };
    

    const handleUpdateDueDate = () => {
console.log(dueDate);
console.log(selectedUserForDueDate);

        if (selectedUserForDueDate) {
            api.put(`/payments/updateDueDate/${selectedUserForDueDate}`, { dueDate })
                .then(() => {
                    alert("Fecha de vencimiento actualizada con éxito");
                    setShowModal(false);
                })
                .catch((error) => console.error("Error al actualizar la fecha de vencimiento", error));
        }
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
                            <li><button className="dropdown-item" onClick={() => navigate('/overdue-payments')}>Ver Cuotas Vencidas</button></li>
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
                <UserTable 
                    users={users} 
                    handleMarkAttendance={handleMarkAttendance} 
                    handleDeleteUser={handleDeleteUser} 
                />

                {/* Sección de Finanzas */}
                <h2 className="text-center fw-bold mt-5 mb-3 text-dark">Caja</h2>
                <div className="card shadow-sm p-4">
                    <h5>Registrar Movimiento</h5>
                    <div className="row">
                        <div className="col-md-4">
                            <Select
                                options={transactionCategoryOptions}
                                value={selectedTransactionCategory}
                                onChange={(selectedOption) => {setSelectedTransactionCategory(selectedOption)}}
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
                        {selectedTransactionCategory?.value?.name === "Egreso" ? (
                            <div>
                                <div className="col-md-4">
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Ingrese el monto..."
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Ingrese un comentario..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    />
                                </div>
                            </div>
                        ) : selectedTransactionCategory?.value?.name === "Producto" ? (
                            // Select de productos si es "Producto"
                            <div className="col-md-4">
                                <Select
                                    options={productOptions}
                                    value={selectedProduct}
                                    onChange={(selectedOption) => setSelectedProduct(selectedOption)}
                                    placeholder="Seleccionar producto..."
                                    isSearchable
                                />
                            </div>
                        ) : (
                            // Select de usuario para otros casos
                            <div className="col-md-4">
                                <Select
                                    options={userOptions}
                                    value={selectedUser}
                                    onChange={(selectedOption) => setSelectedUser(selectedOption)}
                                    placeholder="Seleccionar usuario..."
                                    isSearchable
                                />
                            </div>
                        )}
                        <div className="col-md-4 mt-2">
                            <button className="btn btn-success" onClick={handleAddTransaction}>
                                <FaCashRegister className="me-1" /> Agregar
                            </button>
                        </div>
                    </div>
                </div>

{/* Modal de actualización de cuota */}


<Modal show={showModal} onHide={() => setShowModal(false)}>
<Modal.Header closeButton>
<Modal.Title>Actualizar Fecha de Vencimiento</Modal.Title>
</Modal.Header>
<Modal.Body>            <label>Fecha de vencimiento:</label>
            <input 
                type="date" 
                value={dueDate} 
                onChange={(e) => setDueDate(e.target.value)} 
            />
            <button onClick={handleUpdateDueDate}>Actualizar</button>
            </Modal.Body>
<Modal.Footer>
<Button variant="secondary" onClick={() => setShowModal(false)}>
    Cerrar
</Button>
</Modal.Footer>
</Modal>



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
                <h5 className="mt-4">Historial de Movimientos</h5>
                <div className="table-responsive">
                    <table className="table table-hover table-bordered shadow-sm">
                        <thead className="table-dark text-center">
                            <tr>
                                <th>Monto</th>
                                <th>Medio de pago</th>
                                <th>Categoria</th>
                                <th>Usuario</th>
                                <th>Comentario</th>
                                <th>Fecha</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {transactions.map((transaction, index) => (
                                <tr key={index}>
                                    <td>${transaction.amount}</td>
                                    <td>{transaction.paymentMethod.name}</td>
                                    <td>{transaction.transactionCategory.name}</td>
                                    <td>{transaction?.user?.fullName}</td>
                                    <td>{transaction.comment}</td>
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
