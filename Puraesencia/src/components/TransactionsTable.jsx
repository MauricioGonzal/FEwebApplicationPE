import { FaDollarSign, FaRegCalendarAlt, FaUser, FaClipboard } from "react-icons/fa";

const TransactionsTable = ({ transactions }) => {
    // Filtrar transacciones por categoría
    const cuotas = transactions.filter(t => ["Musculación", "Clases"].includes(t.transactionCategory.name));
    const bebidas = transactions.filter(t => t.transactionCategory.name === "Producto");
    const egresos = transactions.filter(t => t.transactionCategory.name === "Egreso");

    // Formatear moneda
    const formatCurrency = (amount) => 
        new Intl.NumberFormat("es-ES", { style: "currency", currency: "ARS" }).format(amount);

    // Función para renderizar una tabla con las transacciones filtradas
    const renderTable = (title, data, badgeColor) => (
        <div className="mb-4 p-4">
            <h5 className="d-flex align-items-center">
                <span className={`badge bg-${badgeColor} p-2 me-2`}>{title}</span>
            </h5>
            {data.length > 0 ? (
                <div className="table-responsive">
                    <table className="table table-hover table-bordered shadow-sm rounded">
                        <thead className="table-dark text-center">
                            <tr>
                                <th><FaDollarSign /> Monto</th>
                                <th>💳 Medio de pago</th>
                                <th><FaUser /> Usuario</th>
                                <th>🏋️ Membresía</th>
                                <th><FaClipboard /> Comentario</th>
                                <th><FaRegCalendarAlt /> Fecha</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {data.map((transaction, index) => (
                                <tr key={index} className="table-light">
                                    <td className="fw-bold">{formatCurrency(transaction.amount)}</td>
                                    <td>{transaction.paymentMethod.name}</td>
                                    <td>{transaction?.payment?.user?.fullName || "—"}</td>
                                    <td>{transaction?.payment?.membership?.name || "—"}</td>
                                    <td>{transaction.comment || "Sin comentarios"}</td>
                                    <td>{new Date(transaction.date).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-muted">No hay registros en esta categoría.</p>
            )}
        </div>
    );

    return (
        <>
            {renderTable("Cuotas", cuotas, "primary")}
            {renderTable("Bebidas", bebidas, "success")}
            {renderTable("Egresos", egresos, "danger")}
        </>
    );
};

export default TransactionsTable;
